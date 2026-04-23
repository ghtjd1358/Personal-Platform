import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import HomePage from '../home/HomePage';
import JobSearchPage from '../search/JobSearchPage';
import TrackerPage from '../tracker/TrackerPage';
import CalendarPage from '../calendar/CalendarPage';
import { PREFIX, LINK_PREFIX } from '@/config/constants';

const Routes: React.FC = () => {
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
