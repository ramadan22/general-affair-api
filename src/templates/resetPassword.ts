/* eslint-disable max-len */

import { RoleLabel } from '@/constants/Role';

export interface ResetPasswordPayload {
	firstName: string;
	email: string;
	role: string;
	plainPassword: string;
}

export const ResetPasswordTemplate = (data: ResetPasswordPayload) => `
	<div style="font-family: Arial, sans-serif; padding: 20px; background-color:#f5f6fa;">
		<table width="100%" style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px;">
			<!-- HEADER ICON -->
			<tr>
				<td style="text-align:center;">
					<svg
						width="80"
						height="80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#2563eb"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="16" r="1"></circle>
						<rect width="18" height="12" x="3" y="10" rx="2"></rect>
						<path d="M7 10V7a5 5 0 0 1 9.33-2.5"></path>
					</svg>

					<h2 style="color:#2d3436; margin-top:15px;">Reset Password Successfully</h2>
				</td>
			</tr>

			<!-- BODY TEXT -->
			<tr>
				<td style="font-size:15px; color:#2d3436; line-height:1.6; padding-top:10px;">
					<p>Hi <strong>${data.firstName}</strong>,</p>

					<p>
						We would like to inform you that your account password has been successfully reset.
						You may now log in using the updated credentials below:
					</p>

					<div style="background:#f1f2f6; padding:15px; border-radius:6px; margin:20px 0;">
						<p style="margin:5px 0;"><strong>Email:</strong> ${data.email}</p>
						<p style="margin:5px 0;"><strong>Role:</strong> ${RoleLabel[data.role]}</p>
						<p style="margin:5px 0;"><strong>Temporary Password:</strong> <span style="color:#d63031;">${data.plainPassword}</span></p>
					</div>

					<p>
						For security reasons, we strongly recommend changing your password immediately after logging in.
					</p>
				</td>
			</tr>

			<!-- FOOTER -->
			<tr>
				<td style="padding-top:25px; border-top:1px solid #dfe6e9; font-size:14px; color:#636e72;">
					<p>Thank you,</p>
					<p><strong>General Affair</strong></p>
					<p>PT. Contoh Digital Indonesia</p>
				</td>
			</tr>
		</table>
	</div>
`;
