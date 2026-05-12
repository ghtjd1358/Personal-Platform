// ⭐ Phase 3: 프로덕션 환경 설정
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,

  output: {
    filename: '[name].[contenthash].js'
  },

  // ModuleFederation 함정: runtimeChunk 'single' / chunks 'all' 가 remoteEntry 깨뜨림. async 로 제한 + runtime inline
  optimization: {
    usedExports: true,
    sideEffects: true,
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-vendor',
          chunks: 'async',
          priority: 30,
        },
        reactEcosystem: {
          test: /[\\/]node_modules[\\/](react-router|react-router-dom|@reduxjs|react-redux)[\\/]/,
          name: 'react-ecosystem',
          chunks: 'async',
          priority: 25,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'async',
          priority: 10,
        },
      },
    },
  },
});
