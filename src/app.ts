import express from 'express';
import userRouter from '@/modules/user/route';
import authenticationRoute from '@/modules/authentication/route';
import uploadRoute from '@/modules/upload/routes';
import { requestLogger } from '@/middlewares/requestLogger';
import { errorHandler } from '@/middlewares/errorHandler';
import { traceIdMiddleware } from './middlewares/traceId';

const app = express();


// middleware global
app.use(traceIdMiddleware);
app.use(express.json());
app.use(requestLogger);

// modules
app.use('/api/users', userRouter);
app.use('/api/authentication', authenticationRoute);
app.use('/api/upload', uploadRoute);

app.use(errorHandler);

export default app;
