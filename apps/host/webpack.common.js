const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');
require('dotenv').config();

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
  // 캐시 무효화를 위한 타임스탬프 (1분 단위)
  const timestamp = Math.floor(Date.now() / 60000);
  const urlWithTimestamp = `${remoteUrl}?t=${timestamp}`;

  return `promise new Promise((resolve, reject) => {
    // 이미 로드된 경우 재사용
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

    const script = document.createElement('script');
    script.src = '${urlWithTimestamp}';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      if (window['${remoteName}']) {
        console.log('[MFA] ${remoteName} loaded successfully');
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
      // Graceful fallback: 에러 시에도 앱 계속 동작
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
    // publicPath: 'auto' → 명시적으로 '/'로 설정 (Vercel 배포 호환)
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
        '@resume': dynamicRemoteLoader('remote1', `${REMOTE1_URL}/remoteEntry.js`),
        '@blog': dynamicRemoteLoader('blog', `${REMOTE2_URL}/remoteEntry.js`),
        '@portfolio': dynamicRemoteLoader('portfolio', `${REMOTE3_URL}/remoteEntry.js`),
        '@jobtracker': dynamicRemoteLoader('jobtracker', `${REMOTE4_URL}/remoteEntry.js`)
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^19.2.1' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^19.2.1' },
        'react-router-dom': { singleton: true, eager: true },
        '@reduxjs/toolkit': { singleton: true, eager: true },
        'react-redux': { singleton: true, eager: true },
        '@sonhoseong/mfa-lib': {
          singleton: true,
          eager: true,
          requiredVersion: '^1.3.9'
        }
      }

    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
      'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(process.env.REACT_APP_SUPABASE_URL),
      'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(process.env.REACT_APP_SUPABASE_ANON_KEY),
    })
  ]
};
