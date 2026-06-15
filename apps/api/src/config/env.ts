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

  // Client
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  // Cookie
  cookieSecure: process.env.NODE_ENV === 'production',
  cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',
}
