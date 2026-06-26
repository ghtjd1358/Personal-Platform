import React, { useMemo, useState } from 'react';
import { Badge, Button, EmptyState, useCollapsibleSet } from '@sonhoseong/mfa-lib';
import type { ExperienceDetail, ProjectDetail } from '../../../types';
import { SectionEditButton } from '../../../components/common';
import { TimelineCard } from '../../../components/timeline/TimelineCard';

interface ExperienceSectionProps {
  experiences: ExperienceDetail[];
  projects: ProjectDetail[];
}

const INITIAL_DISPLAY_COUNT = 3;

const formatDate = (dateStr: string | null, isEnd = false, isCurrent = false) => {
  if (isCurrent && isEnd) return '현재';
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// 진행중(is_current) 최상단 → start_date desc. server order_index 정렬은 신규 항목 맨 아래로 가서 직관 어긋남.
const sortByRecent = <T extends { is_current?: boolean; start_date?: string | null }>(a: T, b: T) => {
  if (a.is_current !== b.is_current) return a.is_current ? -1 : 1;
  return (b.start_date || '').localeCompare(a.start_date || '');
};

// task 본문의 **word** 마크다운 → <strong>. admin editor placeholder 가 'BOLD OK' 안내하므로 home 도 일관 처리.
const renderTaskWithBold = (text: string): React.ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part)
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );

// 프로젝트 tasks: "**제목** — 상세" 패턴을 제목 + 하위 ul 로 분리.
// 한 줄에 제목/상세 다 박히면 가독성 떨어진다는 피드백 → 시각적 hierarchy 분리.
const renderTaskNested = (text: string): React.ReactNode => {
  const sepIdx = text.indexOf(' — ');
  if (sepIdx === -1) return renderTaskWithBold(text);
  const head = text.slice(0, sepIdx);
  const detail = text.slice(sepIdx + 3);
  return (
    <>
      {renderTaskWithBold(head)}
      <ul className="timeline-tasks-sub">
        <li>{renderTaskWithBold(detail)}</li>
      </ul>
    </>
  );
};

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, projects }) => {
  // 토글 default: 개발(is_dev=true) 경력은 펼침 / 비개발 경력·프로젝트(is_dev 없음)는 접힘.
  // mfa-lib useCollapsibleSet 의 XOR 모델 — 사용자 override 만 별도 추적.
  const { isOpen: isExpanded, toggle: toggleItem } = useCollapsibleSet<{ id: string; is_dev?: boolean }>({
    getDefaultOpen: (item) => item.is_dev === true,
  });
  const [showAllExp, setShowAllExp] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const sortedExperiences = useMemo(() => [...experiences].sort(sortByRecent), [experiences]);
  const sortedProjects = useMemo(() => [...projects].sort(sortByRecent), [projects]);

  const visibleExperiences = showAllExp ? sortedExperiences : sortedExperiences.slice(0, INITIAL_DISPLAY_COUNT);
  const visibleProjects = showAllProjects ? sortedProjects : sortedProjects.slice(0, INITIAL_DISPLAY_COUNT);

  const hasNoData = experiences.length === 0 && projects.length === 0;

  if (hasNoData) {
    return (
      <section id="experience" className="section experience">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <div className="section-label">경력</div>
            <h2 className="section-title">경력 & 프로젝트</h2>
          </div>
          <EmptyState description="경력 정보가 없습니다." />
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-label">경력</div>
          <h2 className="section-title">경력 & 프로젝트</h2>
        </div>

        {/* 경력 */}
        {experiences.length > 0 && (
          <>
            <div className="timeline-category animate-on-scroll">
              <div className="timeline-category-line left"></div>
              <span className="timeline-category-text">경력</span>
              <div className="timeline-category-line right"></div>
            </div>
            <div className="timeline">
              {visibleExperiences.map((exp, index) => (
                <div key={exp.id} className={`timeline-item ${index < INITIAL_DISPLAY_COUNT ? 'animate-on-scroll' : 'animate-visible'}`}>
                  <div className={`timeline-date ${!exp.is_current ? 'past' : ''}`}>
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date, true, exp.is_current)}
                    <Badge
                      variant={exp.is_dev ? 'success' : 'warning'}
                      className={`exp-type-badge ${exp.is_dev ? 'dev' : 'non-dev'}`}
                    >
                      {exp.is_dev ? '개발' : '비개발'}
                    </Badge>
                  </div>
                  <TimelineCard title={exp.company} subtitle={exp.position} description={exp.description} tags={exp.tags}>
                    {exp.tasks && exp.tasks.length > 0 && (
                      <>
                        <button
                          type="button"
                          className={`toggle-tasks ${isExpanded(exp) ? 'active' : ''}`}
                          onClick={() => toggleItem(exp.id)}
                          aria-expanded={isExpanded(exp)}
                        >
                          <span className="toggle-icon">›</span>
                          <span>주요 업무 내용</span>
                        </button>
                        <div className={`timeline-tasks-collapsible ${isExpanded(exp) ? 'is-open' : ''}`}>
                          <ul className="timeline-tasks">
                            {exp.tasks.map((task, i) => (
                              <li key={task.id} style={{ ['--i' as any]: i }}>{renderTaskWithBold(task.task)}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </TimelineCard>
                </div>
              ))}
            </div>
            {experiences.length > INITIAL_DISPLAY_COUNT && (
              <Button
                type="button"
                variant="text"
                className={`show-more-btn ${showAllExp ? 'collapsed' : ''}`}
                onClick={() => setShowAllExp(!showAllExp)}
              >
                <div className="chevron-wave">
                  <span className="chevron"></span>
                  <span className="chevron"></span>
                </div>
              </Button>
            )}
          </>
        )}

        {/* 프로젝트 */}
        {projects.length > 0 && (
          <>
            <div className="timeline-category animate-on-scroll">
              <div className="timeline-category-line left"></div>
              <span className="timeline-category-text">프로젝트</span>
              <div className="timeline-category-line right"></div>
            </div>
            <div className="timeline">
              {visibleProjects.map((proj, index) => (
                <div key={proj.id} className={`timeline-item ${index < INITIAL_DISPLAY_COUNT ? 'animate-on-scroll' : 'animate-visible'}`}>
                  <div className={`timeline-date ${!proj.is_current ? 'past' : ''}`}>
                    {formatDate(proj.start_date)} - {formatDate(proj.end_date, true, proj.is_current)}
                  </div>
                  <TimelineCard title={proj.title} subtitle={proj.role} tags={proj.tags}>
                    {proj.tasks && proj.tasks.length > 0 && (
                      <>
                        <button
                          type="button"
                          className={`toggle-tasks ${isExpanded(proj) ? 'active' : ''}`}
                          onClick={() => toggleItem(proj.id)}
                          aria-expanded={isExpanded(proj)}
                        >
                          <span className="toggle-icon">›</span>
                          <span>주요 작업 내용</span>
                        </button>
                        <div className={`timeline-tasks-collapsible ${isExpanded(proj) ? 'is-open' : ''}`}>
                          <ul className="timeline-tasks">
                            {proj.tasks.map((task, i) => (
                              <li key={task.id} style={{ ['--i' as any]: i }}>{renderTaskNested(task.task)}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </TimelineCard>
                </div>
              ))}
            </div>
            {projects.length > INITIAL_DISPLAY_COUNT && (
              <Button
                type="button"
                variant="text"
                className={`show-more-btn ${showAllProjects ? 'collapsed' : ''}`}
                onClick={() => setShowAllProjects(!showAllProjects)}
              >
                <div className="chevron-wave">
                  <span className="chevron"></span>
                  <span className="chevron"></span>
                </div>
              </Button>
            )}
          </>
        )}

        <div className="section-edit-row">
          <SectionEditButton editPath="/admin/experience" label="경력 편집" />
        </div>
      </div>
    </section>
  );
};
