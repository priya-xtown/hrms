import express from 'express';
import payrollSlipRoutes from './payrollslip.routes.js';
import annualRoutes from './annualpayroll.routes.js';

const router = express.Router();
// router.use('/payrollslip', payrollSlipRoutes);
router.use('/annualpayroll', annualRoutes); // Assuming annual payroll routes are handled in the same file

export default router;