// ⭐ Phase 3: 프로덕션 환경 설정
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: false, // 프로덕션에서는 소스맵 비활성화

  output: {
    filename: '[name].[contenthash].js'
  },

  // ModuleFederation 함정: runtimeChunk 'single' 가 webpack runtime 을 별도 chunk 로 빼면
  // remoteEntry.js 에 runtime 없어 host 가 fetch 해도 chunk callback 실행 불가 → window.X 미노출
  // 또 splitChunks chunks:'all' 가 entry/initial chunk 까지 split 해 dependency 흩어짐
  // → 둘 다 'async' 로 제한해 remoteEntry 가 self-contained 가 되게 함
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
