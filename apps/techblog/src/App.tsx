import React from 'react';
import { storage } from '@sonhoseong/mfa-lib';
import Routes from './pages/routes/Routes';
import './styles/global.css';

const App: React.FC = () => {
  // Host 앱에서 실행 중이면 라우터 없이 렌더링 (Host가 라우터 제공)
  // 독립 실행 시 bootstrap.tsx에서 BrowserRouter 제공
  return <Routes />;
};

export default App;
