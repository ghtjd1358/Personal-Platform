import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { isHostApp } from '@sonhoseong/mfa-lib';
import HomePage from '../home/HomePage';
import JobSearchPage from '../search/JobSearchPage';
import TrackerPage from '../tracker/TrackerPage';
import CalendarPage from '../calendar/CalendarPage';

const Routes: React.FC = () => {
  const isHost = isHostApp();
  // Route path용 - host 모드에선 빈 문자열 (descendant Routes는 부모 match 이후의 남은 URL로 평가되므로)
  // 이 분리 없이 절대경로(/container/jobtracker...)로 route를 정의하면 host 모드에서 매치 실패 → 빈화면
  const PREFIX = isHost ? '' : '/jobtracker';
  // Navigate용 - 실제 URL 절대경로
  const LINK_PREFIX = isHost ? '/container/jobtracker' : '/jobtracker';

  return (
    <RouterRoutes>
      <Route path={`${PREFIX}/`} element={<HomePage />} />
      <Route path={`${PREFIX}/search`} element={<JobSearchPage />} />
      <Route path={`${PREFIX}/tracker`} element={<TrackerPage />} />
      <Route path={`${PREFIX}/calendar`} element={<CalendarPage />} />
      {/* 매치 실패 시 홈으로 fallback */}
      <Route path="*" element={<Navigate to={`${LINK_PREFIX}/`} replace />} />
    </RouterRoutes>
  );
};

export default Routes;
