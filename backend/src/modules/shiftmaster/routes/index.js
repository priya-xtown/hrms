import express from 'express';
import shiftRoutes from './shift.routes.js';

const router = express.Router();

router.use('/shift', shiftRoutes);

export default router;