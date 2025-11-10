import express from 'express';
import { approvalHistoryController } from './controller';

const router = express.Router();

router.post('/', approvalHistoryController.create);
router.get('/', approvalHistoryController.getAll);
router.get('/:id', approvalHistoryController.getById);

export default router;
