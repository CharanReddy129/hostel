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
    prisma.tenantStay.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        bed: { include: { room: { select: { id: true, roomNumber: true } } } },
        user: true,
      },
    }),
    prisma.tenantStay.count({ where }),
  ]);
  res.json({ success: true, data: { tenants: items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } } });
});

const createTenantDto = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  bedId: z.string().uuid(),
  checkInDate: z.string().optional(),
  monthlyRent: z.coerce.number().nonnegative().optional(),
});

router.post('/', async (req, res) => {
  const parsed = createTenantDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() } });
  const { email, firstName, lastName, phone, bedId, checkInDate, monthlyRent } = parsed.data;
  const generatedEmail = email ?? `tenant+${Date.now()}@example.com`;

  // Ensure bed exists and is VACANT; also ensure no ACTIVE stay for the bed
  const bed = await prisma.bed.findUnique({ where: { id: bedId } });
  if (!bed) return res.status(404).json({ success: false, error: { code: 'BED_NOT_FOUND', message: 'Selected bed does not exist' } });
  if (bed.status !== 'VACANT') return res.status(400).json({ success: false, error: { code: 'BED_NOT_AVAILABLE', message: 'Selected bed is not available' } });
  const activeStay = await prisma.tenantStay.findFirst({ where: { bedId, status: 'ACTIVE' as any } });
  if (activeStay) return res.status(400).json({ success: false, error: { code: 'BED_OCCUPIED', message: 'Selected bed is already occupied' } });

  const result = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.upsert({ where: { id: 'org-seed' }, update: {}, create: { id: 'org-seed', name: 'Seed Org', subdomain: 'seed-org' } });
    const user = await tx.user.create({ data: { organizationId: org.id, email: generatedEmail, passwordHash: 'placeholder', firstName, lastName, phone } });
    const bedUpdate: any = { status: 'OCCUPIED' as any };
    if (typeof monthlyRent === 'number') bedUpdate.monthlyRent = monthlyRent;
    await tx.bed.update({ where: { id: bedId }, data: bedUpdate });
    const stay = await tx.tenantStay.create({ data: { userId: user.id, bedId, checkInDate: checkInDate ? new Date(checkInDate) : new Date(), status: 'ACTIVE' as any } });
    return { user, stay };
  });
  res.status(201).json({ success: true, data: result });
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

// Move tenant to a different bed (target bed must be VACANT)
const moveDto = z.object({ newBedId: z.string().uuid(), monthlyRent: z.coerce.number().nonnegative().optional() });
router.put('/:id/move', async (req, res) => {
  const { id } = req.params;
  const { newBedId, monthlyRent } = moveDto.parse(req.body);

  const stay = await prisma.tenantStay.findUnique({ where: { id } });
  if (!stay) return res.status(404).json({ success: false, error: { code: 'STAY_NOT_FOUND', message: 'Tenant stay not found' } });

  // If the tenant keeps the same bed, just update rent (if provided) and return
  if (newBedId === stay.bedId) {
    const data: any = {};
    if (typeof monthlyRent === 'number') data.monthlyRent = monthlyRent;
    if (Object.keys(data).length) {
      await prisma.bed.update({ where: { id: newBedId }, data });
    }
    const current = await prisma.tenantStay.findUnique({
      where: { id },
      include: { bed: { include: { room: { select: { id: true, roomNumber: true } } } }, user: true },
    });
    return res.json({ success: true, data: current });
  }

  // Moving to a different bed: target must be VACANT
  const target = await prisma.bed.findUnique({ where: { id: newBedId } });
  if (!target) return res.status(404).json({ success: false, error: { code: 'BED_NOT_FOUND', message: 'Target bed not found' } });
  if (target.status !== 'VACANT') return res.status(400).json({ success: false, error: { code: 'BED_NOT_AVAILABLE', message: 'Target bed is not available' } });

  const updated = await prisma.$transaction(async (tx) => {
    // Free previous bed
    await tx.bed.update({ where: { id: stay.bedId }, data: { status: 'VACANT' as any } });
    // Occupy new bed and optionally update rent
    const bedUpdate: any = { status: 'OCCUPIED' as any };
    if (typeof monthlyRent === 'number') bedUpdate.monthlyRent = monthlyRent;
    await tx.bed.update({ where: { id: newBedId }, data: bedUpdate });
    // Move stay
    return tx.tenantStay.update({
      where: { id },
      data: { bedId: newBedId },
      include: { bed: { include: { room: { select: { id: true, roomNumber: true } } } }, user: true },
    });
  });

  res.json({ success: true, data: updated });
});

router.post('/:id/check-out', async (req, res) => {
  const { id } = req.params;
  const body = z.object({ checkOutDate: z.string().optional(), reason: z.string().optional(), feedback: z.string().optional() }).parse(req.body);
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.tenantStay.update({ where: { id }, data: { status: 'COMPLETED' as any, checkOutDate: body.checkOutDate ? new Date(body.checkOutDate) : new Date() } });
    // Mark bed as VACANT after checkout
    await tx.bed.update({ where: { id: updated.bedId }, data: { status: 'VACANT' as any } });
    return updated;
  });
  res.json({ success: true, data: result });
});

