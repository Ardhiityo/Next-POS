export const environment = {
  MIDTRANS_SCRIPT_URL: process.env.MIDTRANS_SCRIPT_URL || "",
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY || "",
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY || "",
  MIDTRANS_IS_PRODUCTION: false,
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 465,
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || ""
};
