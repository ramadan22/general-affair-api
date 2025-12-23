import express from 'express';
import cors from 'cors';
import userRouter from '@/modules/user/route';
import authenticationRoute from '@/modules/authentication/route';
import uploadRoute from '@/modules/upload/routes';
import categoryRoute from '@/modules/category/route';
import assetsRoute from '@/modules/assets/route';
import approvalRoute from '@/modules/approval/route';
import historyRoute from '@/modules/history/route';
import { requestLogger } from '@/middlewares/requestLogger';
import { errorHandler } from '@/middlewares/errorHandler';
import { traceIdMiddleware } from './middlewares/traceId';
import previewRouter from '@/templates/preview';
import sendEmailRoute from '@/modules/send-email/router';
import path from 'path';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
  ],
  credentials: true,
}));

// middleware global
app.use(traceIdMiddleware);
app.use(express.json());
app.use(requestLogger);

// modules
app.use('/api/users', userRouter);
app.use('/api/authentication', authenticationRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/category', categoryRoute);
app.use('/api/assets', assetsRoute);
app.use('/api/approval', approvalRoute);
app.use('/api/history', historyRoute);

app.use('/api/send-email', sendEmailRoute);
app.use('/preview-template-email', previewRouter);


// static
const uploadDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

// error handler
app.use(errorHandler);

export default app;
