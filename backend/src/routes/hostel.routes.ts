import { Router } from 'express';
import { prisma } from '../config/database.js';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const router = Router();

const createHostelDto = z.object({
  organizationId: z.string().uuid().optional(), // simple for now
  name: z.string().min(1),
  address: z.string().min(1),
  contactInfo: z.any().optional(),
});

router.get('/', async (req, res) => {
  const { page = '1', limit = '20', search } = req.query as Record<string, string>;
  const skip = (Number(page) - 1) * Number(limit);
  const where: Prisma.HostelWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { address: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.hostel.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.hostel.count({ where }),
  ]);
  res.json({ success: true, data: { hostels: items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } } });
});

router.post('/', async (req, res) => {
  const parsed = createHostelDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() } });
  const { name, address, contactInfo } = parsed.data;
  const created = await prisma.hostel.create({ data: { organizationId: 'org-seed', name, address, contactInfo: contactInfo ?? {} } as any });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const payload = z.object({ name: z.string().min(1).optional(), address: z.string().min(1).optional(), contactInfo: z.any().optional() }).parse(req.body);
  const updated = await prisma.hostel.update({ where: { id }, data: payload });
  res.json({ success: true, data: updated });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.hostel.delete({ where: { id } });
  res.status(204).send();
});

