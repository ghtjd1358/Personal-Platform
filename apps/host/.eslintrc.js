module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React 17+ JSX Transform - import React 불필요
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',

    // TypeScript에서 prop-types 불필요
    'react/prop-types': 'off',

    // 미사용 변수 경고 (단, _로 시작하는 변수는 허용)
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // any 타입 경고 (점진적 마이그레이션 허용)
    '@typescript-eslint/no-explicit-any': 'warn',

    // 빈 함수 허용 (이벤트 핸들러 등)
    '@typescript-eslint/no-empty-function': 'off',

    // console 허용 (개발 중)
    'no-console': 'off',

    // React Hooks 규칙
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: ['dist', 'node_modules', '*.config.js', 'webpack.*.js'],
};
