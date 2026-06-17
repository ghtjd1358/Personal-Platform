import dotenv from 'dotenv'
dotenv.config()

export const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // JWT
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  jwtAccessExpiresIn: '15m',
  jwtRefreshExpiresIn: '7d',

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL!,

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Client — 쉼표 구분 다중 origin 지원 (로컬 + Vercel preview 등)
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5000').split(',').map(u => u.trim()),

  // Cookie
  cookieSecure: process.env.NODE_ENV === 'production',
  cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',

  // Demo account — 포트폴리오 체험용, production 에도 노출됨
  demoEmail: process.env.DEMO_ACCOUNT_EMAIL || '',
  demoPassword: process.env.DEMO_ACCOUNT_PASSWORD || '',
}
