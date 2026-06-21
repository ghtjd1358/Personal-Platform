// Phase 3: Common config (dev/prod)
// Phase 4: Module Federation
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const Dotenv = require('dotenv-webpack');
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.tsx',

  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    // Module Federation 필수: 'auto'는 런타임에 origin 자동 계산 → host에서 로드돼도 chunk는 자기 origin(5003)에서 로드
    publicPath: 'auto'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, 'src')
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
      // npm published @sonhoseong/mfa-lib(1.3.10)에 initRemoteApp 없음 → 로컬 packages/lib(1.3.11) 강제 매핑.
      // dist까지 매핑하면 subpath import(`/dist/styles/...`)가 중복 경로로 깨짐 → packages/lib까지만.
      '@sonhoseong/mfa-lib': path.resolve(__dirname, '../../packages/lib')
    }
  },

  plugins: [
    new Dotenv({ systemvars: true, silent: true }),

    new ModuleFederationPlugin({
      name: 'portfolio',
      filename: 'remoteEntry.js',
      // strict mode IIFE 안 'var X' 는 outer 노출 안 되므로 type 'window' 명시
      library: { type: 'window', name: 'portfolio' },
      exposes: {
        './App': './src/App',
        './LnbItems': './src/exposes/lnb-items'
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
        'react-redux': { singleton: true, requiredVersion: deps['react-redux'] },
        'react-promise-tracker': { singleton: true, requiredVersion: deps['react-promise-tracker'] },
        '@sonhoseong/mfa-lib': { singleton: true, requiredVersion: deps['@sonhoseong/mfa-lib'] }
      }
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};
