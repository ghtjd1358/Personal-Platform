/**
 * Remote1 개발 서버 설정
 *
 * 단독 실행 지원:
 * - 포트 5001에서 독립적으로 실행 가능
 * - Mock API 미들웨어 포함 (로그인, 토큰 갱신 등)
 * - 테스트 계정: admin@test.com / 1234
 */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const jwt = require('jsonwebtoken');

// 개발용 JWT 시크릿 (Host와 동일)
const ACCESS_TOKEN_SECRET = 'dev-access-secret-key';
const REFRESH_TOKEN_SECRET = 'dev-refresh-secret-key';

// 테스트 사용자
const TEST_USERS = {
  'admin@test.com': {
    password: '1234',
    user: { id: '1', name: '관리자', email: 'admin@test.com', role: 'admin' },
  },
  'user@test.com': {
    password: '1234',
    user: { id: '2', name: '사용자', email: 'user@test.com', role: 'user' },
  },
};

// 토큰 생성
const generateAccessToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (user) => jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

// 토큰 검증
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const testUser = Object.values(TEST_USERS).find((u) => u.user.id === decoded.id);
    return testUser?.user || null;
  } catch { return null; }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch { return null; }
};

// Cookie 파싱
const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
};

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',

  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 5001,
    hot: true,
    open: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    setupExitSignals: true,

    // Mock API 미들웨어 (단독 실행 시 인증 지원)
    setupMiddlewares: (middlewares, devServer) => {
      const app = devServer.app;

      // JSON body parser
      app.use(require('express').json());

      // CORS 헤더
      app.use('/api', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') return res.status(200).end();
        next();
      });

      // POST /api/auth/login
      app.post('/api/auth/login', (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
        }
        const testUser = TEST_USERS[email];
        if (!testUser || testUser.password !== password) {
          return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
        const { user } = testUser;
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);
        return res.status(200).json({ statusCode: 200, data: { accessToken, user } });
      });

      // POST /api/auth/refresh
      app.post('/api/auth/refresh', (req, res) => {
        const cookies = parseCookies(req.headers.cookie);
        const refreshToken = cookies['refreshToken'];
        if (!refreshToken) {
          return res.status(401).json({ statusCode: 401, error: '인증이 만료되었습니다. 다시 로그인해주세요.' });
        }
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
          return res.status(401).json({ statusCode: 401, error: '인증이 만료되었습니다. 다시 로그인해주세요.' });
        }
        const testUser = Object.values(TEST_USERS).find((u) => u.user.id === decoded.id);
        if (!testUser) {
          return res.status(401).json({ statusCode: 401, error: '사용자를 찾을 수 없습니다.' });
        }
        const { user } = testUser;
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        res.setHeader('Set-Cookie', `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);
        return res.status(200).json({ statusCode: 200, data: { accessToken: newAccessToken, user } });
      });

      // POST /api/auth/logout
      app.post('/api/auth/logout', (req, res) => {
        res.setHeader('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
        return res.status(200).json({ statusCode: 200, message: '로그아웃 되었습니다.' });
      });

      // GET /api/auth/me
      app.get('/api/auth/me', (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ statusCode: 401, error: '인증이 필요합니다.' });
        }
        const accessToken = authHeader.substring(7);
        const user = verifyAccessToken(accessToken);
        if (!user) {
          return res.status(401).json({ statusCode: 401, error: '인증이 만료되었습니다.' });
        }
        return res.status(200).json({ statusCode: 200, data: { user } });
      });

      return middlewares;
    }
  }
});
