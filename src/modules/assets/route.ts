import { Router } from 'express';
import * as assetsController from './controller';
import { checkUserToken } from '@/middlewares/checkToken';

const router = Router();

router.post('/', checkUserToken, assetsController.create);
router.get('/', checkUserToken, assetsController.get);
router.get('/:name', checkUserToken, assetsController.get);
router.put('/:id', checkUserToken, assetsController.update);
router.delete('/:id', checkUserToken, assetsController.deleteAsset);

export default router;
