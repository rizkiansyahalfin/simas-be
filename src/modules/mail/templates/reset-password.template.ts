import { baseEmailTemplate } from './partials/base-email.template';
import type { ResetPasswordTemplateProps } from '../mail.type';

export const resetPasswordTemplate = ({
  recipientName,
  resetUrl,
  expiresInMinutes = 30,
}: ResetPasswordTemplateProps) =>
  baseEmailTemplate({
    title: 'Permintaan Reset Kata Sandi',
    subtitle: 'Gunakan tautan berikut untuk memperbarui kata sandi Anda.',
    content: `
      <p>Halo ${recipientName},</p>
      <p>Kami menerima permintaan untuk mereset kata sandi Anda. Klik tombol di bawah untuk membuat kata sandi baru.</p>
      <p>
        <a class="button" href="${resetUrl}" target="_blank" rel="noopener noreferrer">
          Reset Kata Sandi
        </a>
      </p>
      <p>Jika tautan tidak bekerja, salin dan tempel URL berikut ke browser Anda:</p>
      <p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>
      <p>Tautan ini akan kedaluwarsa dalam ${expiresInMinutes} menit.</p>
      <p>Jika Anda tidak meminta reset kata sandi, abaikan email ini.</p>
      <p>Hormat kami,<br />Tim Administrasi SIMAS</p>
    `,
  });
