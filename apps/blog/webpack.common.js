// Phase 3: Common config (dev/prod)
// Phase 4: Module Federation
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.tsx',

  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    // Module Federation 필수: 'auto'는 런타임에 origin 자동 계산 → host에서 로드돼도 chunk는 자기 origin(5002)에서 로드
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
      '@': path.resolve(__dirname, 'src')
    }
  },

  plugins: [
    new Dotenv({ systemvars: true, silent: true }),

    new ModuleFederationPlugin({
      name: 'blog',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './LnbItems': './src/exposes/lnb-items',
        './MyPage': './src/exposes/my-page'
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: deps['react-dom']
        },
        'react-router-dom': { singleton: true, eager: true },
        '@reduxjs/toolkit': { singleton: true, eager: true },
        'react-redux': { singleton: true, eager: true },
        'react-promise-tracker': { singleton: true, eager: true },
        '@sonhoseong/mfa-lib': { singleton: true, eager: true }
      }
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),

    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ]
};
