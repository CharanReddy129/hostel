import { Router } from 'express';
import { prisma } from '../config/database.js';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const router = Router();

router.get('/', async (req, res) => {
  const { page = '1', limit = '20', hostelId, search } = req.query as Record<string, string>;
  const skip = (Number(page) - 1) * Number(limit);
  const where: Prisma.RoomWhereInput = {};
  if (hostelId) where.hostelId = hostelId;
    if (search)
    where.OR = [
      { roomNumber: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { hostel: { is: { name: { contains: search, mode: Prisma.QueryMode.insensitive } } } },
    ];
  const [items, total] = await Promise.all([
    prisma.room.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.room.count({ where }),
  ]);
  res.json({ success: true, data: { rooms: items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } } });
});

const createRoomDto = z.object({
  hostelId: z.string().uuid(),
  roomNumber: z.string().min(1),
  capacity: z.number().int().min(1),
  amenities: z.array(z.string()).optional(),
});

router.post('/', async (req, res) => {
  const parsed = createRoomDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() } });
  const created = await prisma.room.create({ data: { ...parsed.data, amenities: parsed.data.amenities ?? [] } });
  // Auto-generate beds 1..capacity
  if (created.capacity > 0) {
    const toCreate = Array.from({ length: created.capacity }, (_, i) => ({
      roomId: created.id,
      bedNumber: String(i + 1),
      monthlyRent: new Prisma.Decimal(0),
      status: 'VACANT' as any,
    }));
    await prisma.$transaction(toCreate.map((data) => prisma.bed.create({ data })));
    // Optional: keep hostel.totalBeds in sync
    await prisma.hostel.update({ where: { id: created.hostelId }, data: { totalBeds: { increment: created.capacity } } }).catch(() => {});
  }
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const payload = z.object({ roomNumber: z.string().optional(), capacity: z.number().int().optional(), amenities: z.array(z.string()).optional() }).parse(req.body);
  const updated = await prisma.room.update({ where: { id }, data: payload });
  // If capacity increased, create missing beds to match new capacity
  if (typeof payload.capacity === 'number') {
    const existingCount = await prisma.bed.count({ where: { roomId: id } });
    const missing = payload.capacity - existingCount;
    if (missing > 0) {
      const toCreate = Array.from({ length: missing }, (_, i) => ({
        roomId: id,
        bedNumber: String(existingCount + i + 1),
        monthlyRent: new Prisma.Decimal(0),
        status: 'VACANT' as any,
      }));
      await prisma.$transaction(toCreate.map((data) => prisma.bed.create({ data })));
      // Optional: keep hostel.totalBeds in sync
      const room = await prisma.room.findUnique({ where: { id } });
      if (room) {
        await prisma.hostel.update({ where: { id: room.hostelId }, data: { totalBeds: { increment: missing } } }).catch(() => {});
      }
    }
  }
  res.json({ success: true, data: updated });
});

// Backfill: generate missing beds up to capacity
router.post('/:id/generate-beds', async (req, res) => {
  const { id } = req.params;
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) return res.status(404).json({ success: false, error: { code: 'ROOM_NOT_FOUND', message: 'Room not found' } });
  const existingCount = await prisma.bed.count({ where: { roomId: id } });
  const missing = room.capacity - existingCount;
  if (missing <= 0) return res.json({ success: true, data: { created: 0 } });
  const toCreate = Array.from({ length: missing }, (_, i) => ({
    roomId: id,
    bedNumber: String(existingCount + i + 1),
    monthlyRent: new Prisma.Decimal(0),
    status: 'VACANT' as any,
  }));
  await prisma.$transaction(toCreate.map((data) => prisma.bed.create({ data })));
  await prisma.hostel.update({ where: { id: room.hostelId }, data: { totalBeds: { increment: missing } } }).catch(() => {});
  res.json({ success: true, data: { created: missing } });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.room.delete({ where: { id } });
  res.status(204).send();
});

