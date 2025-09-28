import { Router } from 'express';
import * as approvalController from './controller';
import { checkUserToken } from '@/middlewares/checkToken';

const router = Router();

router.post('/', checkUserToken, approvalController.create);
router.get('/', checkUserToken, approvalController.get);
router.put('/:id', checkUserToken, approvalController.update);
router.put('/update-status/:id', checkUserToken, approvalController.updateStatus);
router.delete('/:id', checkUserToken, approvalController.deleteApproval);

export default router;
