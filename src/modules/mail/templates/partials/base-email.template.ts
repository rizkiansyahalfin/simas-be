type BaseEmailTemplateProps = {
  title: string
  subtitle?: string
  content: string
}

export const baseEmailTemplate = ({
  title,
  subtitle,
  content,
}: BaseEmailTemplateProps) => {

  return `
<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${title}</title>

  <style>

    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6fa;
      font-family:
        "Inter",
        "Segoe UI",
        Tahoma,
        Geneva,
        Verdana,
        sans-serif;

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
      overflow: hidden;

      box-shadow:
        0 24px 64px
        rgba(15, 23, 42, 0.08);
    }

    .header {

      background:
        linear-gradient(
          135deg,
          #055d8c 0%,
          #0f9b76 100%
        );

      color: white;

      padding:
        32px
        32px
        28px;
    }

    .logo {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 18px;
    }

    .title {
      margin: 0;
      font-size: 28px;
      line-height: 1.2;
    }

    .subtitle {
      margin-top: 14px;
      color: rgba(255,255,255,0.88);
      line-height: 1.7;
      font-size: 15px;
    }

    .content {
      padding: 32px;
      color: #374151;
      line-height: 1.8;
      font-size: 15px;
    }

    .content p {
      margin:
        0
        0
        18px;
    }

    .footer {

      padding:
        0
        32px
        32px;

      font-size: 13px;
      line-height: 1.7;

      color: #6b7280;
    }

    .footer-line {
      margin-top: 24px;
      padding-top: 20px;

      border-top:
        1px solid #e5e7eb;
    }

    .badge {
      display: inline-block;

      padding:
        12px
        16px;

      border-radius: 14px;

      background: #ecfdf5;

      color: #047857;

      font-weight: 700;
    }

    .button {
      display: inline-block;

      padding:
        14px
        22px;

      border-radius: 14px;

      background: #0f9b76;

      color: white !important;

      text-decoration: none;
      font-weight: 600;
    }

  </style>
</head>

<body>

  <div class="wrapper">

    <div class="card">

      <div class="header">

        <div class="logo">
          🕌 SIMAS
        </div>

        <h1 class="title">
          ${title}
        </h1>

        ${
          subtitle
            ? `<p class="subtitle">${subtitle}</p>`
            : ""
        }

      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">

        <div class="footer-line">

          Email ini dikirim otomatis oleh sistem SIMAS.
          Mohon tidak membalas email ini.

          <br /><br />

          © ${new Date().getFullYear()} SIMAS —
          Sistem Informasi Manajemen Masjid

        </div>

      </div>

    </div>

  </div>

</body>
</html>
`
}