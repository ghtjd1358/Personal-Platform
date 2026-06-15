import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, EmptyState } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';
import { TimelineCard } from '../../../components/timeline/TimelineCard';

interface ExperienceDetail {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  is_dev: boolean;
  tasks: { id: string; task: string }[];
  tags: string[];
}

interface ProjectDetail {
  id: string;
  title: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  tasks: { id: string; task: string }[];
  tags: string[];
  image?: string;
}

interface ResumeTimelineSectionProps {
  resumeId: string;
  experiences: ExperienceDetail[];
  projects: ProjectDetail[];
  expandedItem: string | null;
  onToggleExpand: (id: string) => void;
}

const formatDate = (dateStr: string | null, isEnd = false, isCurrent = false) => {
  if (isCurrent && isEnd) return '현재';
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const ResumeTimelineSection: React.FC<ResumeTimelineSectionProps> = ({
  resumeId,
  experiences,
  projects,
  expandedItem,
  onToggleExpand,
}) => {
  return (
    <section className="section experience">
      <div className="container">
        <div className="section-header animate-visible">
          <div className="section-label">경력</div>
          <h2 className="section-title">경력 & 프로젝트</h2>
          <Link
            to={`${LINK_PREFIX}/admin/experience?resumeId=${resumeId}`}
            className="section-edit-link"
          >
            경력 관리 →
          </Link>
        </div>

        {/* 경력 Timeline */}
        {experiences.length > 0 && (
          <>
            <div className="timeline-category animate-visible">
              <div className="timeline-category-line left"></div>
              <span className="timeline-category-text">경력</span>
              <div className="timeline-category-line right"></div>
            </div>
            <div className="timeline">
              {experiences.map((exp) => (
                <div key={exp.id} className="timeline-item animate-visible">
                  <div className={`timeline-date ${!exp.is_current ? 'past' : ''}`}>
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date, true, exp.is_current)}
                    <Badge
                      variant={exp.is_dev ? 'success' : 'warning'}
                      className={`exp-type-badge ${exp.is_dev ? 'dev' : 'non-dev'}`}
                    >
                      {exp.is_dev ? '개발' : '비개발'}
                    </Badge>
                  </div>
                  <TimelineCard title={exp.company} subtitle={exp.position} tags={exp.tags}>
                    {exp.tasks && exp.tasks.length > 0 && (
                      <>
                        <div
                          className={`toggle-tasks ${expandedItem === exp.id ? 'active' : ''}`}
                          onClick={() => onToggleExpand(exp.id)}
                        >
                          <span className="toggle-icon">›</span>
                          <span>주요 업무 내용</span>
                        </div>
                        {expandedItem === exp.id && (
                          <ul className="timeline-tasks">
                            {exp.tasks.map((task) => (
                              <li key={task.id}>{task.task}</li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </TimelineCard>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 프로젝트 Timeline */}
        {projects.length > 0 && (
          <>
            <div className="timeline-category timeline-category--mt animate-visible">
              <div className="timeline-category-line left"></div>
              <span className="timeline-category-text">프로젝트</span>
              <div className="timeline-category-line right"></div>
              <Link
                to={`${LINK_PREFIX}/admin/projects?resumeId=${resumeId}`}
                className="section-edit-link section-edit-link--ml"
              >
                관리 →
              </Link>
            </div>
            <div className="timeline">
              {projects.map((proj) => (
                <div key={proj.id} className="timeline-item animate-visible">
                  <div className={`timeline-date ${!proj.is_current ? 'past' : ''}`}>
                    {formatDate(proj.start_date)} - {formatDate(proj.end_date, true, proj.is_current)}
                  </div>
                  <TimelineCard title={proj.title} subtitle={proj.role} tags={proj.tags}>
                    {proj.tasks && proj.tasks.length > 0 && (
                      <>
                        <div
                          className={`toggle-tasks ${expandedItem === proj.id ? 'active' : ''}`}
                          onClick={() => onToggleExpand(proj.id)}
                        >
                          <span className="toggle-icon">›</span>
                          <span>주요 작업 내용</span>
                        </div>
                        {expandedItem === proj.id && (
                          <ul className="timeline-tasks">
                            {proj.tasks.map((task) => (
                              <li key={task.id}>{task.task}</li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </TimelineCard>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 데이터 없음 */}
        {experiences.length === 0 && projects.length === 0 && (
          <EmptyState
            description="등록된 경력/프로젝트가 없습니다."
            action={
              <div className="action-row">
                <Link to={`${LINK_PREFIX}/admin/experience/new?resumeId=${resumeId}`} className="btn btn-primary">
                  경력 추가
                </Link>
                <Link to={`${LINK_PREFIX}/admin/projects/new?resumeId=${resumeId}`} className="btn btn-outline">
                  프로젝트 추가
                </Link>
              </div>
            }
          />
        )}
      </div>
    </section>
  );
};

export type { ExperienceDetail, ProjectDetail };
export default ResumeTimelineSection;
