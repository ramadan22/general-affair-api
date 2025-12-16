import { Router } from 'express';
import * as categoryController from './controller';
import { checkUserToken } from '@/middlewares/checkToken';
const router = Router();
router.post('/', checkUserToken, categoryController.create);
router.get('/', checkUserToken, categoryController.get);
router.put('/:id', checkUserToken, categoryController.update);
router.delete('/:id', checkUserToken, categoryController.deleteCategory);
export default router;
