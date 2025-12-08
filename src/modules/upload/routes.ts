// src/modules/upload/routes.ts

import { Router } from 'express';
import { uploadDynamic } from '@/middlewares/upload';
import { validateSignature } from '@/middlewares/validateSignature';
import * as uploadController from './controller';

const router = Router();

router.post(
  '/',
  uploadDynamic.single('file'),
  validateSignature,
  uploadController.upload
);

export default router;
