import { Router } from 'express';
import { router as hostels } from './hostel.routes.js';
import { router as rooms } from './room.routes.js';
import { router as beds } from './bed.routes.js';
import { router as tenants } from './tenant.routes.js';
import { router as notices } from './notice.routes.js';
import { router as reports } from './report.routes.js';

export const router = Router();

router.use('/hostels', hostels);
router.use('/rooms', rooms);
router.use('/beds', beds);
router.use('/tenants', tenants);
router.use('/notices', notices);
router.use('/reports', reports);

