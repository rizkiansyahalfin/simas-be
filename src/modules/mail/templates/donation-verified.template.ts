import { baseEmailTemplate } from './partials/base-email.template';

import type { DonationVerifiedTemplateProps } from '../mail.type';

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

export const donationVerifiedTemplate = ({ donorName, amount }: DonationVerifiedTemplateProps) => {
  return baseEmailTemplate({
    title: 'Donasi Berhasil Diverifikasi',

    subtitle: 'Terima kasih telah berkontribusi untuk kegiatan dan operasional masjid.',

    content: `

      <p>
        Halo ${donorName},
      </p>

      <p>
        Donasi Anda telah berhasil diverifikasi
        dan dicatat ke dalam sistem SIMAS.
      </p>

      <p>
        <span class="badge">
          ${formatRupiah(amount)}
        </span>
      </p>

      <p>
        Dana akan digunakan sesuai dengan
        program dan kebutuhan operasional
        yang telah ditentukan.
      </p>

      <p>
        Semoga menjadi amal jariyah
        yang terus mengalir manfaatnya.
      </p>

      <p>
        Hormat kami,
        <br />
        Tim Administrasi SIMAS
      </p>
    `,
  });
};
