const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Firebase 별도 청크 (번들 크기가 크므로 분리)
        firebase: {
          test: /[\\/]node_modules[\\/]firebase/,
          name: 'firebase',
          chunks: 'all',
          priority: 20,
        },
        // React 관련 라이브러리 청크
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 15,
        },
        // Redux 관련 라이브러리 청크
        redux: {
          test: /[\\/]node_modules[\\/](@reduxjs|react-redux)/,
          name: 'redux-vendor',
          chunks: 'all',
          priority: 15,
        },
        // 기타 node_modules
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
      },
    },
    // 런타임 청크 분리 (캐싱 최적화)
    runtimeChunk: 'single',
  },
});
