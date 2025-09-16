import { Router } from 'express';
import * as authenticationController from './controller';
import { checkToken } from '@/middlewares/checkToken';

const router = Router();

router.post('/login', authenticationController.login);
router.post('/change-password', checkToken, authenticationController.changePassword);

export default router;
