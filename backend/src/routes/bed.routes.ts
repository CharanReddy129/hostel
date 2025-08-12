import { Router } from 'express';
import { prisma } from '../config/database.js';
import { z } from 'zod';

export const router = Router();

router.get('/', async (req, res) => {
  const { page = '1', limit = '20', roomId, status, search } = req.query as Record<string, string>;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (roomId) where.roomId = roomId;
  if (status) where.status = status as any;
  if (search) where.OR = [
    { bedNumber: { contains: search, mode: 'insensitive' } },
  ];
  const [items, total] = await Promise.all([
    prisma.bed.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.bed.count({ where }),
  ]);
  res.json({ success: true, data: { beds: items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } } });
});

const createBedDto = z.object({
  roomId: z.string().uuid(),
  bedNumber: z.string().min(1),
  monthlyRent: z.number().nonnegative(),
});

router.post('/', async (req, res) => {
  const parsed = createBedDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() } });
  const created = await prisma.bed.create({ data: { ...parsed.data, status: 'VACANT' as any } });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const payload = z.object({ bedNumber: z.string().optional(), status: z.enum(['VACANT','OCCUPIED','MAINTENANCE']).optional(), monthlyRent: z.number().nonnegative().optional() }).parse(req.body);
  const updated = await prisma.bed.update({ where: { id }, data: payload });
  res.json({ success: true, data: updated });
});

router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const payload = z.object({ status: z.enum(['VACANT','OCCUPIED','MAINTENANCE']) }).parse(req.body);
  const updated = await prisma.bed.update({ where: { id }, data: { status: payload.status } });
  res.json({ success: true, data: updated });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.bed.delete({ where: { id } });
  res.status(204).send();
});

