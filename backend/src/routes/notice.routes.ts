import { Router } from 'express';
import { prisma } from '../config/database.js';
import { z } from 'zod';

export const router = Router();

router.get('/', async (req, res) => {
  const { page = '1', limit = '20', hostelId, priority, search } = req.query as Record<string, string>;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (hostelId) where.hostelId = hostelId;
  if (priority) where.priority = priority as any;
  if (search) where.OR = [
    { title: { contains: search, mode: 'insensitive' } },
    { content: { contains: search, mode: 'insensitive' } },
  ];
  const [items, total] = await Promise.all([
    prisma.notice.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.notice.count({ where }),
  ]);
  res.json({ success: true, data: { notices: items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } } });
});

const createNoticeDto = z.object({
  hostelId: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  priority: z.enum(['LOW','MEDIUM','HIGH']).optional(),
});

router.post('/', async (req, res) => {
  const parsed = createNoticeDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() } });
  // Using a seed user as author for now
  const author = await prisma.user.findFirst();
  const created = await prisma.notice.create({ data: { ...parsed.data, createdBy: author?.id ?? 'seed-user' } });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const payload = z.object({ title: z.string().optional(), content: z.string().optional(), priority: z.enum(['LOW','MEDIUM','HIGH']).optional() }).parse(req.body);
  const updated = await prisma.notice.update({ where: { id }, data: payload });
  res.json({ success: true, data: updated });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.notice.delete({ where: { id } });
  res.status(204).send();
});

