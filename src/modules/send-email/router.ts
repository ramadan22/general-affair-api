import express from 'express';
import * as mailController from './controller';

const router = express.Router();

router.post('/reset-password', mailController.resetPassword);

export default router;
