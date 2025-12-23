import { Router } from 'express';
import * as userController from './controller';
import { checkUserToken } from '@/middlewares/checkToken';

const router = Router();

router.get('/', checkUserToken, userController.getUsers);
router.delete('/:id', checkUserToken, userController.deleteUser);
router.put('/:id', checkUserToken, userController.updateUser);

router.post('/register', userController.register);
router.put('/update-profile', checkUserToken, userController.updateProfile);
router.get('/profile', checkUserToken, userController.getProfile);
router.get('/profile/:id', checkUserToken, userController.getProfile);

export default router;
