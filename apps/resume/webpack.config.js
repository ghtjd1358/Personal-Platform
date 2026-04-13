// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
//
// module.exports = {
//   mode: 'development', // ⭐ Phase 2: 개발 모드
//   devtool: 'source-map', // ⭐ Phase 2: 소스맵 (디버깅용)
//
//   entry: './src/index.tsx', // 번들링 시작점
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist')
//   }, // 번들링 완료 후 결과물 위치
//   module: { // 파일별 처리 방법
//     rules: [
//       {
//         //.tsx 파일은 bable-loader 사용하여 파일처리
//         test: /\.tsx?$/, // 처리할 파일
//         use: 'babel-loader' // 파일 처리를 위한 도구
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader']
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js'] // 확장자 생략해도 파일 탐색 가능(왼쪽부터 우선 탐색)
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './public/index.html'
//     }),
//   ],
//
//   // ⭐ Phase 2: 개발 서버 설정
//   devServer: {
//     static: {
//       directory: path.join(__dirname, 'public')
//     },
//     port: 9000,
//     hot: true, // Hot Module Replacement
//     open: true, // 자동으로 브라우저 열기
//     historyApiFallback: true // React Router 지원
//   }
// };
