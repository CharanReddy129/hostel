import { Router } from 'express';
import { prisma } from '../config/database.js';
import { z } from 'zod';
import { Prisma, $Enums } from '@prisma/client';

export const router = Router();

router.get('/', async (req, res) => {
  const { page = '1', limit = '20', hostelId, floor, type, search } = req.query as Record<string, string>;
  const skip = (Number(page) - 1) * Number(limit);
  const where: Prisma.RoomWhereInput = {};
  if (hostelId) where.hostelId = hostelId;
  if (floor) where.floor = floor;
  if (type) where.roomType = type as $Enums.RoomType;
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
  floor: z.string().min(1),
  roomType: z.enum(['SINGLE','DOUBLE','TRIPLE','DORMITORY']),
  capacity: z.number().int().min(1),
  amenities: z.array(z.string()).optional(),
});

router.post('/', async (req, res) => {
  const parsed = createRoomDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() } });
  const created = await prisma.room.create({ data: { ...parsed.data, amenities: parsed.data.amenities ?? [] } });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const payload = z.object({ roomNumber: z.string().optional(), floor: z.string().optional(), roomType: z.enum(['SINGLE','DOUBLE','TRIPLE','DORMITORY']).optional(), capacity: z.number().int().optional(), amenities: z.array(z.string()).optional() }).parse(req.body);
  const updated = await prisma.room.update({ where: { id }, data: payload });
  res.json({ success: true, data: updated });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.room.delete({ where: { id } });
  res.status(204).send();
});

