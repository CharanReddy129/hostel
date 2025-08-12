import { Router } from 'express';
import { prisma } from '../config/database.js';
import { z } from 'zod';

export const router = Router();

router.get('/', async (req, res) => {
  const { page = '1', limit = '20', hostelId, status, search } = req.query as Record<string, string>;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = {};
  if (hostelId) where.bed = { room: { hostelId } };
  if (status) where.status = status as any;
  if (search) where.OR = [
    { email: { contains: search, mode: 'insensitive' } },
    { firstName: { contains: search, mode: 'insensitive' } },
    { lastName: { contains: search, mode: 'insensitive' } },
    { phone: { contains: search, mode: 'insensitive' } },
  ];
  const [items, total] = await Promise.all([
    prisma.tenantStay.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' }, include: { bed: true, user: true } }),
    prisma.tenantStay.count({ where }),
  ]);
  res.json({ success: true, data: { tenants: items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } } });
});

const createTenantDto = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  bedId: z.string().uuid(),
  checkInDate: z.string().optional(),
});

router.post('/', async (req, res) => {
  const parsed = createTenantDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() } });
  const { email, firstName, lastName, phone, bedId, checkInDate } = parsed.data;
  // For now, create a user without password/auth; can be extended later
  const org = await prisma.organization.upsert({ where: { id: 'org-seed' }, update: {}, create: { id: 'org-seed', name: 'Seed Org', subdomain: 'seed-org' } });
  const user = await prisma.user.create({ data: { organizationId: org.id, email, passwordHash: 'placeholder', firstName, lastName, phone } });
  const stay = await prisma.tenantStay.create({ data: { userId: user.id, bedId, checkInDate: checkInDate ? new Date(checkInDate) : new Date(), status: 'ACTIVE' } });
  res.status(201).json({ success: true, data: { user, stay } });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const payload = z.object({ phone: z.string().optional(), firstName: z.string().optional(), lastName: z.string().optional(), status: z.enum(['ACTIVE','COMPLETED']).optional() }).parse(req.body);
  const stay = await prisma.tenantStay.update({ where: { id }, data: { status: payload.status }, include: { user: true, bed: true } });
  if (payload.firstName || payload.lastName || payload.phone) {
    await prisma.user.update({ where: { id: stay.userId }, data: { firstName: payload.firstName, lastName: payload.lastName, phone: payload.phone } });
  }
  res.json({ success: true, data: stay });
});

router.post('/:id/check-out', async (req, res) => {
  const { id } = req.params;
  const body = z.object({ checkOutDate: z.string().optional(), reason: z.string().optional(), feedback: z.string().optional() }).parse(req.body);
  const updated = await prisma.tenantStay.update({ where: { id }, data: { status: 'COMPLETED', checkOutDate: body.checkOutDate ? new Date(body.checkOutDate) : new Date() } });
  res.json({ success: true, data: updated });
});

