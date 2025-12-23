// src/services/mailService.ts
import nodemailer from 'nodemailer';
import { AppError } from '@/utils/appError';
import { ActivationAccount } from '@/templates/accountActivation';
import { ResetPasswordTemplate } from '@/templates/resetPassword';

interface AccountPassword {
  firstName: string;
  email: string;
  role: string;
  plainPassword: string;
}

interface SendEmailProps {
  to: string;
	data: unknown;
}

export const mailService = {
  sendActivationAccount: async ({ to, data }: SendEmailProps) => {
    if (!to) {
      throw new AppError({
        message: 'The "to" field is required.',
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: 'Your New Account Has Been Successfully Created',
      html: ActivationAccount(data as AccountPassword),
    });

    return {
      message: 'Email sent successfully',
      messageId: info.messageId,
      to,
    };
  },
  sendResetPassword: async ({ to, data }: SendEmailProps) => {
    if (!to) {
      throw new AppError({
        message: 'The "to" field is required.',
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: 'Your Password Has Been Successfully Reset',
      html: ResetPasswordTemplate(data as AccountPassword),
    });

    return { messageId: info.messageId };
  },
};
