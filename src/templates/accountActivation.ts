/* eslint-disable max-len */

import { RoleLabel } from '@/constants/Role';

export interface ActivationAccountPayload {
  firstName: string;
  email: string;
  role: string;
  plainPassword: string;
}

export const ActivationAccount = (data: ActivationAccountPayload) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color:#f5f6fa;">
    <table width="100%" style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px;">
      <!-- HEADER ICON -->
      <tr>
        <td style="text-align:center;">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="#2563eb"
          >
            <path d="M4 2C3.44772 2 3 2.44772 3 3V5H5V4H19V20H5V19H3V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V3C21 2.44772 20.5523 2 20 2H4ZM9 16C9 14.3431 10.3431 13 12 13C13.6569 13 15 14.3431 15 16H9ZM12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12ZM6 9V7H2V9H6ZM6 11V13H2V11H6ZM6 17V15H2V17H6Z" />
          </svg>


          <h2 style="color:#2d3436; margin-top:15px;">Akun Baru Anda Telah Dibuat</h2>
        </td>
      </tr>

      <!-- BODY TEXT -->
      <tr>
        <td style="font-size:15px; color:#2d3436; line-height:1.6; padding-top:10px;">
          <p>Haii <strong>${data.firstName}</strong>,</p>

          <p>Kami dengan bangga menginformasikan bahwa akun baru Anda telah berhasil dibuat
          pada sistem kami. Anda dapat menggunakan kredensial berikut untuk login pertama kali:</p>

          <div style="background:#f1f2f6; padding:15px; border-radius:6px; margin:20px 0;">
            <p style="margin:5px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin:5px 0;"><strong>Role:</strong> ${RoleLabel[data.role]}</p>
            <p style="margin:5px 0;"><strong>Password Sementara:</strong> <span style="color:#d63031;">${data.plainPassword}</span></p>
          </div>

          <p>
            Demi keamanan akun, kami sangat menyarankan Anda segera melakukan perubahan password
            setelah login pertama kali.
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding-top:25px; border-top:1px solid #dfe6e9; font-size:14px; color:#636e72;">
          <p>Terima kasih,</p>
          <p><strong>General Affair</strong></p>
          <p>PT. Contoh Digital Indonesia</p>
        </td>
      </tr>
    </table>
  </div>
`;
