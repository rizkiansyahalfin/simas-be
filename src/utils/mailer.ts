import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

transporter.verify((error) => {
  if (error) {
    console.error('❌ Mailer error:', error)
  } else {
    console.log('✅ Mailer ready')
  }
})