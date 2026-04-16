// ⭐ Phase 3: 프로덕션 환경 설정
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: false, // 프로덕션에서는 소스맵 비활성화

  output: {
    filename: '[name].[contenthash].js'
  },

  optimization: {
    usedExports: true,
    sideEffects: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        // React 코어 라이브러리
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 30,
        },
        // React Router & Redux
        reactEcosystem: {
          test: /[\\/]node_modules[\\/](react-router|react-router-dom|@reduxjs|react-redux)[\\/]/,
          name: 'react-ecosystem',
          chunks: 'all',
          priority: 25,
        },
        // 기타 vendor
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
      },
    },
    runtimeChunk: 'single',
  },
});
