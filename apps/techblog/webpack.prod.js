const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,

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
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 30,
        },
        reactEcosystem: {
          test: /[\\/]node_modules[\\/](react-router|react-router-dom|@reduxjs|react-redux)[\\/]/,
          name: 'react-ecosystem',
          chunks: 'all',
          priority: 25,
        },
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
