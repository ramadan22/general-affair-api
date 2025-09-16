import { Router } from 'express';
import * as userController from './controller';

const router = Router();

router.post('/register', userController.register);

export default router;
