import React, { useState, useMemo } from 'react';
import { CalendarEvent } from '@/types/job';
import { useCalendarEvents } from '@/hooks';
import CreateEventModal from '@/components/CreateEventModal';
import '../home/HomePage.editorial.css';
import './CalendarPage.editorial.css';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Use hook for calendar events
  const {
    monthEvents,
    getEventsForDate,
    create,
  } = useCalendarEvents({ year, month });

  // 달력 데이터 생성
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: { date: Date; isCurrentMonth: boolean; events: CalendarEvent[] }[] = [];

    // 이전 달 날짜들
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }

    // 현재 달 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const events = getEventsForDate(dateStr);
      days.push({ date, isCurrentMonth: true, events });
    }

    // 다음 달 날짜들 (6주 채우기)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }

    return days;
  }, [year, month, getEventsForDate]);

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 로딩 상태 UI 제거 — host GlobalLoading 에 맡김.

  return (
    <div className="job-tracker-app">
      <div className="page-header">
        <h1>일정 캘린더</h1>
        <p>면접 일정과 마감일을 확인하세요</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        {/* 캘린더 */}
        <div className="calendar-container">
          <div className="calendar-header">
            <div className="calendar-nav">
              <button onClick={() => navigateMonth(-1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <span className="calendar-month">
                {year}년 {month + 1}월
              </span>
              <button onClick={() => navigateMonth(1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={goToToday}>
              오늘
            </button>
          </div>

          <div className="calendar-grid">
            {/* 요일 헤더 */}
            {weekDays.map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}

            {/* 날짜 셀 */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday(day.date) ? 'today' : ''}`}
              >
                <div className="calendar-day-number">
                  {day.date.getDate()}
                </div>
                {day.events.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`calendar-event ${event.type}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '2px' }}>
                    +{day.events.length - 2}개 더
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 사이드바 - 일정 목록 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">이번 달 일정</h3>
          </div>

          {monthEvents.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <p>이번 달 일정이 없습니다</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {monthEvents.map(event => (
                <div
                  key={event.id}
                  style={{
                    padding: '12px',
                    background: 'var(--background)',
                    borderRadius: 'var(--radius)',
                    borderLeft: `4px solid ${event.color || 'var(--primary)'}`
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                    {event.title}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(event.date).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </span>
                    <span
                      className={`calendar-event ${event.type}`}
                      style={{ position: 'static', padding: '2px 8px' }}
                    >
                      {event.type === 'interview' ? '면접' :
                       event.type === 'deadline' ? '마감' : '지원'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 일정 추가 버튼 */}
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '16px' }}
            onClick={() => setShowCreateModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            일정 추가
          </button>
        </div>
      </div>

      {/* 범례 */}
      <div style={{
        display: 'flex',
        gap: '24px',
        marginTop: '24px',
        justifyContent: 'center',
        fontSize: '13px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            background: 'var(--warning)'
          }} />
          면접
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            background: 'var(--danger)'
          }} />
          마감
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            background: 'var(--primary)'
          }} />
          지원
        </div>
      </div>

      {/* 일정 추가 모달 */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={create}
        />
      )}
    </div>
  );
};

export default CalendarPage;
