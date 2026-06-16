import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  color?: string;
  type: 'interview' | 'deadline' | string;
}

interface UpcomingEventsCardProps {
  upcomingEvents: UpcomingEvent[];
}

const UpcomingEventsCard: React.FC<UpcomingEventsCardProps> = ({ upcomingEvents }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">다가오는 일정</h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`${LINK_PREFIX}/calendar`)}
        >
          캘린더 보기
        </Button>
      </div>
      {upcomingEvents.length === 0 ? (
        <EmptyState description="예정된 일정이 없습니다" />
      ) : (
        <div className="upcoming-list">
          {upcomingEvents.map(event => (
            <div
              key={event.id}
              className="upcoming-item"
              style={{
                borderLeft: `4px solid ${event.color || 'var(--primary)'}`
              }}
            >
              <div className="upcoming-item-body">
                <div className="upcoming-item-title">{event.title}</div>
                <div className="upcoming-item-date">
                  {new Date(event.date).toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </div>
              </div>
              <span
                className={`calendar-event ${event.type} upcoming-item-badge`}
              >
                {event.type === 'interview' ? '면접' :
                 event.type === 'deadline' ? '마감' : '지원'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsCard;
