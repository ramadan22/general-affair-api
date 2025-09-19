import { Router } from 'express';
import * as authenticationController from './controller';
import { checkUserToken } from '@/middlewares/checkToken';

const router = Router();

router.post('/login', authenticationController.login);
router.post('/change-password', checkUserToken, authenticationController.changePassword);

export default router;
