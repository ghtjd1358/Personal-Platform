import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { getLinkPrefix, isHostApp } from '@sonhoseong/mfa-lib';
import HomePage from '../home/HomePage';
import JobSearchPage from '../search/JobSearchPage';
import TrackerPage from '../tracker/TrackerPage';
import CalendarPage from '../calendar/CalendarPage';

const Routes: React.FC = () => {
  // Host에서 실행 시 /container/jobtracker, 독립 실행 시 /jobtracker
  const LINK_PREFIX = isHostApp() ? '/container/jobtracker' : '/jobtracker';

  return (
    <RouterRoutes>
      <Route path={`${LINK_PREFIX}`} element={<HomePage />} />
      <Route path={`${LINK_PREFIX}/search`} element={<JobSearchPage />} />
      <Route path={`${LINK_PREFIX}/tracker`} element={<TrackerPage />} />
      <Route path={`${LINK_PREFIX}/calendar`} element={<CalendarPage />} />
      <Route path={`${LINK_PREFIX}/*`} element={<Navigate to={LINK_PREFIX} replace />} />
      {/* 독립 실행 시 루트 경로도 처리 */}
      <Route path="/" element={<Navigate to={LINK_PREFIX} replace />} />
    </RouterRoutes>
  );
};

export default Routes;
