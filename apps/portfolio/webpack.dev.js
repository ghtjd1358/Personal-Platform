// �?Phase 3: 개발 ?�경 ?�정
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 5003,
    hot: true,
    open: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    setupExitSignals: true
  }
});
