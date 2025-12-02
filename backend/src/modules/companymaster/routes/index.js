import express from 'express';
import companyRoutes from './companyasset.routes.js';

const router = express.Router();

router.use('/company', companyRoutes);

export default router;
