import { uploadDynamic } from '@/middlewares/upload';
import { Router } from 'express';
import * as uploadController from './controller';

const router = Router();

router.post('/', uploadDynamic.single('file'), uploadController.upload);

export default router;
