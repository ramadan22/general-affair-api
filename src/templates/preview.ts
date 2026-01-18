import { Router, Request, Response } from 'express';
import { ActivationAccount } from './accountActivation';
import { ResetPasswordTemplate } from './resetPassword'; // <-- import template baru

const previewRouter = Router();

previewRouter.get('/new-account', (_: Request, res: Response) => {
  const dummyData = {
    firstName: 'Haris',
    email: 'haris4@mailinator.com',
    role: 'MANAGER',
    plainPassword: '155742'
  };

  const html = ActivationAccount(dummyData);

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
});

previewRouter.get('/reset-password', (_: Request, res: Response) => {
  const dummyData = {
    firstName: 'Haris',
    email: 'haris4@mailinator.com',
    role: 'MANAGER',
    plainPassword: '998877' // contoh dummy password baru
  };

  const html = ResetPasswordTemplate(dummyData);

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
});

export default previewRouter;
