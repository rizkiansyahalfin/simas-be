import type { DonationVerifiedTemplateProps } from "./mail.type"

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(value)

export const donationVerifiedTemplate = ({ donorName, amount }: DonationVerifiedTemplateProps) => {
  return `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Donasi Berhasil Diverifikasi</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6fa;
        font-family: "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: #111827;
      }
      .wrapper {
        width: 100%;
        padding: 24px;
        box-sizing: border-box;
      }
      .card {
        max-width: 680px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 24px;
        box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08);
        overflow: hidden;
      }
      .hero {
        background: linear-gradient(135deg, #055d8c 0%, #0f9b76 100%);
        color: #ffffff;
        padding: 32px 32px 28px;
      }
      .hero h1 {
        margin: 0;
        font-size: 28px;
        line-height: 1.1;
      }
      .hero p {
        margin: 16px 0 0;
        color: rgba(255, 255, 255, 0.85);
        font-size: 15px;
        line-height: 1.7;
      }
      .content {
        padding: 32px;
      }
      .content p {
        margin: 0 0 18px;
        line-height: 1.75;
        color: #374151;
        font-size: 15px;
      }
      .amount {
        display: inline-block;
        margin: 18px 0;
        padding: 14px 18px;
        background: #ecfdf5;
        color: #047857;
        border-radius: 14px;
        font-weight: 700;
        font-size: 18px;
      }
      .footer {
        padding: 0 32px 32px;
        color: #6b7280;
        font-size: 13px;
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="card">
        <div class="hero">
          <h1>Donasi Anda Telah Diverifikasi</h1>
          <p>Terima kasih telah berkontribusi. Berikut detail donasi yang telah diterima oleh sistem kami.</p>
        </div>
        <div class="content">
          <p>Halo ${donorName},</p>
          <p>Donasi Anda telah berhasil diverifikasi dan dicatat dalam sistem.</p>
          <p class="amount">${formatRupiah(amount)}</p>
          <p>
            Dana Anda akan segera dijalankan sesuai dengan alokasi program yang ditentukan.
            Terima kasih atas dukungan Anda yang berkelanjutan.
          </p>
          <p>Salam hormat,<br />Tim Administrasi SIMAS</p>
        </div>
        <div class="footer">
          Email ini dikirim otomatis oleh sistem SIMAS. Mohon tidak membalas email ini.
        </div>
      </div>
    </div>
  </body>
</html>`
}