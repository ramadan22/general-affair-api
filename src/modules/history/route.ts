import express from 'express';
import { historyController } from './controller';
import { checkUserToken } from '@/middlewares/checkToken';

const router = express.Router();

router.post('/', checkUserToken, historyController.create);
router.get('/', checkUserToken, historyController.getAll);
router.get('/:id', checkUserToken, historyController.getById);

export default router;
