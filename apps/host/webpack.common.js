const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');
// CI/Vercel 환경에서는 .env 없이 시스템 환경변수를 직접 사용하므로 누락 경고 억제
if (!process.env.CI && !process.env.VERCEL) {
    const result = require('dotenv').config();
    if (result.error && process.env.NODE_ENV !== 'production') {
        console.warn('[webpack] .env 파일을 찾을 수 없습니다. 환경변수를 직접 설정해야 합니다.');
    }
}
if (process.env.NODE_ENV === 'production') {
    if (!process.env.REMOTE1_URL) throw new Error('REMOTE1_URL이 설정되지 않았습니다.');
    if (!process.env.REMOTE2_URL) throw new Error('REMOTE2_URL이 설정되지 않았습니다.');
    if (!process.env.REMOTE3_URL) throw new Error('REMOTE3_URL이 설정되지 않았습니다.');
    if (!process.env.REMOTE4_URL) throw new Error('REMOTE4_URL이 설정되지 않았습니다.');
    if (!process.env.REACT_APP_SUPABASE_URL) throw new Error('REACT_APP_SUPABASE_URL이 설정되지 않았습니다.');
    if (!process.env.REACT_APP_SUPABASE_ANON_KEY) throw new Error('REACT_APP_SUPABASE_ANON_KEY가 설정되지 않았습니다.');
    if (!process.env.REACT_APP_API_URL) throw new Error('REACT_APP_API_URL이 설정되지 않았습니다.');
}

// 환경 변수에서 Remote URL 가져오기
const REMOTE1_URL = process.env.REMOTE1_URL || 'http://localhost:5001';
const REMOTE2_URL = process.env.REMOTE2_URL || 'http://localhost:5002';
const REMOTE3_URL = process.env.REMOTE3_URL || 'http://localhost:5003';
const REMOTE4_URL = process.env.REMOTE4_URL || 'http://localhost:5004';

// ============================================
// 동적 Remote 로더 (KOMCA 패턴)
// - Promise 기반 런타임 로딩
// - 캐시 무효화 (타임스탬프)
// - Graceful fallback (로드 실패 시에도 앱 동작)
// ============================================
const dynamicRemoteLoader = (remoteName, remoteUrl) => {
  // ?t= 를 runtime Date.now() 로 박아 host main.js 가 stale cache 라도 remoteEntry 는 매 fetch fresh 보장
  // (build-time timestamp 였을 때는 옛 deploy cache + 같은 URL 로 stale remoteEntry 받는 케이스 존재)
  // 캐시 방지: 매번 새로운 타임스탬프로 remoteEntry.js를 새로 가져옴
  return `promise new Promise((resolve, reject) => {
    // 이미 로드됐으면 재사용 (중복 로드 방지)
    if (window['${remoteName}']) {
      resolve({
        get: (request) => window['${remoteName}'].get(request),
        init: (arg) => {
          try {
            return window['${remoteName}'].init(arg);
          } catch (e) {
            console.warn('[MFA] ${remoteName} already initialized');
          }
        }
      });
      return;
    }

    // 처음 로드: <script> 태그를 만들어 remoteEntry.js를 동적으로 불러옴
    const script = document.createElement('script');
    script.src = '${remoteUrl}' + '?t=' + Date.now();
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      if (window['${remoteName}']) {
        resolve({
          get: (request) => window['${remoteName}'].get(request),
          init: (arg) => {
            try {
              return window['${remoteName}'].init(arg);
            } catch (e) {
              console.warn('[MFA] ${remoteName} already initialized');
            }
          }
        });
      } else {
        console.error('[MFA] ${remoteName} not found on window after script load');
        // Graceful fallback: 빈 모듈 반환
        resolve({
          get: () => Promise.resolve(() => () => null),
          init: () => {}
        });
      }
    };

    script.onerror = (error) => {
      console.error('[MFA] Failed to load ${remoteName}:', error);
      // 로드 실패해도 앱이 멈추지 않도록 빈 모듈을 반환 (Graceful Fallback)
      resolve({
        get: () => Promise.resolve(() => () => null),
        init: () => {}
      });
    };

    document.head.appendChild(script);
  })`
};

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path:
        path.resolve(__dirname, 'dist'),
    // Host는 루트 기준 절대경로 '/'를 사용. 'auto'로 두면 nested path(/container/blog)에서 새로고침 시
    // <script src="main.xxx.js">가 상대경로로 해석돼 /container/main.xxx.js 요청 → 404 → 부팅 실패.
    // Remote는 host에 의해 로드되므로 'auto'가 필요하지만, host는 자기 도메인에서만 뜨므로 '/'가 안전.
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '../lib/dist')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // 이미지 및 폰트 최적화
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB 이하는 인라인 base64
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
      'node_modules'
    ],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react': path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom')
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        // 동적 로더 사용 (Graceful Fallback 포함)
        // 이력서 앱 (port 5001)
        '@resume': dynamicRemoteLoader('remote1', `${REMOTE1_URL}/remoteEntry.js`),
        // 블로그 앱 (port 5002)
        '@blog': dynamicRemoteLoader('blog', `${REMOTE2_URL}/remoteEntry.js`),
        // 포트폴리오 앱 (port 5003)
        '@portfolio': dynamicRemoteLoader('portfolio', `${REMOTE3_URL}/remoteEntry.js`),
        // 기술블로그 앱 (port 5004)
        '@jobtracker': dynamicRemoteLoader('jobtracker', `${REMOTE4_URL}/remoteEntry.js`)
      },
      shared: {
        // React 핵심 — 앱 전체에서 하나만 사용 (singleton)
        react: { singleton: true, eager: true, requiredVersion: '19.2.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '19.2.0' },
        // 라우팅 — singleton 은 exact version pin (caret range 면 remote 들이 서로 다른 minor 로 로드돼 store/router context 충돌)
        'react-router-dom': { singleton: true, eager: true, requiredVersion: '7.11.0' },
        // 전역 상태관리
        '@reduxjs/toolkit': { singleton: true, eager: true, requiredVersion: '2.11.2' },
        'react-redux': { singleton: true, eager: true, requiredVersion: '9.2.0' },
        // 로딩 상태 표시
        'react-promise-tracker': { singleton: true, eager: true, requiredVersion: '2.1.1' },
        // 이 모노레포 공유 라이브러리 — workspace 내부 패키지, 항상 함께 빌드됨
        // requiredVersion 생략 — semver pin 은 외부 패키지에만 의미 있음
        '@sonhoseong/mfa-lib': {
          singleton: true,
          eager: true,
        }
      }

    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      // undefined인 경우 JSON.stringify → undefined (literal) → 런타임 참조 시 SyntaxError
      // || '' 또는 || undefined로 null-coalesce하여 항상 문자열 또는 undefined 리터럴 방지
      'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(process.env.REACT_APP_SUPABASE_URL || ''),
      'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(process.env.REACT_APP_SUPABASE_ANON_KEY || ''),
      'process.env.REACT_APP_OWNER_EMAIL': JSON.stringify(process.env.REACT_APP_OWNER_EMAIL || ''),
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || ''),
    })
  ]
};
