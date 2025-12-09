import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { responseHelper } from './middleware/index.js';
// import moduleRoutes from "./modules/index.js";


import userRoutes from './modules/user/routes/index.js';
import employeeRoutes from './modules/employee/routes/index.js';
import shiftRoutes from './modules/shiftmaster/routes/index.js';
import attendanceRoutes from './modules/attandance/routes/index.js';
import companyRoutes from './modules/companymaster/routes/index.js';
// import payrollRoutes from './modules/payrollmaster/routes/index.js';



const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));
app.use(responseHelper);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));


app.get('/', (req, res) => {
  res.status(200).send("✅ HRMS API Running Successfully");
});

// Test routes
app.get('/api/data', (req, res) => {
  res.sendSuccess({ value: 42 }, 'Data fetched successfully');
});

app.get('/api/error', (req, res) => {
  res.sendError('Something went wrong', 422, [{ field: 'email', message: 'Invalid' }]);
});

app.use('/hrms_api/v1', userRoutes);
app.use('/hrms_api/v1', shiftRoutes);

app.use('/hrms_api/v1', employeeRoutes);
app.use('/hrms_api/v1',companyRoutes);

app.use('/hrms_api/v1',attendanceRoutes);



app.use((req, res) => {
  return res.sendError('Route not found', 404);
});

export default app;
