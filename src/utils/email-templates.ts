export const donationReceivedTemplate = (data: {
  donorName: string
  amount: string
  category: string
  createdAt: string
}) => ({
  subject: `[SIMAS] Donasi Baru Masuk - ${data.donorName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1a7f4b; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: white; margin: 0;">🕌 Notifikasi Donasi Masuk</h2>
      </div>
      <div style="background-color: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
        <p>Assalamu'alaikum,</p>
        <p>Telah masuk donasi baru yang menunggu verifikasi:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f0f0f0; width: 40%;"><strong>Nama Donatur</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.donorName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f0f0f0;"><strong>Jumlah</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">Rp ${data.amount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f0f0f0;"><strong>Kategori</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.category}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f0f0f0;"><strong>Waktu</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.createdAt}</td>
          </tr>
        </table>
        <p>Silakan login ke dashboard untuk memverifikasi donasi ini.</p>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          Email ini dikirim otomatis oleh sistem SIMAS. Jangan balas email ini.
        </p>
      </div>
    </div>
  `,
})

export const donationVerifiedTemplate = (data: {
  donorName: string
  amount: string
  category: string
  verifiedAt: string
}) => ({
  subject: `[SIMAS] Donasi Anda Telah Diverifikasi`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1a7f4b; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: white; margin: 0;">✅ Donasi Terverifikasi</h2>
      </div>
      <div style="background-color: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
        <p>Assalamu'alaikum, <strong>${data.donorName}</strong></p>
        <p>Alhamdulillah, donasi Anda telah berhasil diverifikasi. Jazakallahu khairan atas kebaikan Anda.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f0f0f0; width: 40%;"><strong>Jumlah</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">Rp ${data.amount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f0f0f0;"><strong>Kategori</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.category}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f0f0f0;"><strong>Diverifikasi Pada</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.verifiedAt}</td>
          </tr>
        </table>
        <p>Semoga Allah SWT membalas kebaikan Anda dengan berlipat ganda. Aamiin.</p>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          Email ini dikirim otomatis oleh sistem SIMAS. Jangan balas email ini.
        </p>
      </div>
    </div>
  `,
})

export const donationRejectedTemplate = (data: {
  donorName: string
  amount: string
  rejectionNote: string
}) => ({
  subject: `[SIMAS] Donasi Anda Memerlukan Perhatian`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #c0392b; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: white; margin: 0;">⚠️ Donasi Ditolak</h2>
      </div>
      <div style="background-color: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
        <p>Assalamu'alaikum, <strong>${data.donorName}</strong></p>
        <p>Mohon maaf, donasi Anda sebesar <strong>Rp ${data.amount}</strong> tidak dapat diverifikasi dengan alasan berikut:</p>
        <div style="background: #fff3f3; border-left: 4px solid #c0392b; padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0;">
          <p style="margin: 0;">${data.rejectionNote}</p>
        </div>
        <p>Silakan hubungi pengurus masjid untuk informasi lebih lanjut.</p>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          Email ini dikirim otomatis oleh sistem SIMAS. Jangan balas email ini.
        </p>
      </div>
    </div>
  `,
})