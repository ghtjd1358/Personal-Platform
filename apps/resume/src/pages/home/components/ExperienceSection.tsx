import React, { useState } from 'react';
import { iconMap } from '../../../constants/iconMap';
import { ExperienceDetail, ProjectDetail } from '../../../data';
import { SectionEditButton } from '../../../components/common';

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

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, projects }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showAllExp, setShowAllExp] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const visibleExperiences = showAllExp ? experiences : experiences.slice(0, INITIAL_DISPLAY_COUNT);
  const visibleProjects = showAllProjects ? projects : projects.slice(0, INITIAL_DISPLAY_COUNT);

  const hasNoData = experiences.length === 0 && projects.length === 0;

  if (hasNoData) {
    return (
      <section id="experience" className="section experience">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <div className="section-label">경력</div>
            <h2 className="section-title">경력 & 프로젝트</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            경력 정보가 없습니다.
          </div>
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
                    <span className={`exp-type-badge ${exp.is_dev ? 'dev' : 'non-dev'}`}>
                      {exp.is_dev ? '개발' : '비개발'}
                    </span>
                  </div>
                  <div className="timeline-content">
                    <h3>{exp.company}</h3>
                    <p>{exp.position}</p>
                    {exp.tags && exp.tags.length > 0 && (
                      <div className="timeline-tech-icons">
                        {exp.tags.map((tag, index) => (
                          <div className="tech-icon" key={`${exp.id}-tag-${index}`} data-tooltip={tag}>
                            {iconMap[tag] || <span>💻</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    {exp.tasks && exp.tasks.length > 0 && (
                      <>
                        <div
                          className={`toggle-tasks ${expandedItem === exp.id ? 'active' : ''}`}
                          onClick={() => setExpandedItem(expandedItem === exp.id ? null : exp.id)}
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
                  </div>
                </div>
              ))}
            </div>
            {experiences.length > INITIAL_DISPLAY_COUNT && (
              <button
                className={`show-more-btn ${showAllExp ? 'collapsed' : ''}`}
                onClick={() => setShowAllExp(!showAllExp)}
              >
                <div className="chevron-wave">
                  <span className="chevron"></span>
                  <span className="chevron"></span>
                </div>
              </button>
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
                  <div className="timeline-content">
                    <h3>{proj.title}</h3>
                    <p>{proj.role}</p>
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="timeline-tech-icons">
                        {proj.tags.map((tag, index) => (
                          <div className="tech-icon" key={`${proj.id}-tag-${index}`} data-tooltip={tag}>
                            {iconMap[tag] || <span>💻</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    {proj.tasks && proj.tasks.length > 0 && (
                      <>
                        <div
                          className={`toggle-tasks ${expandedItem === proj.id ? 'active' : ''}`}
                          onClick={() => setExpandedItem(expandedItem === proj.id ? null : proj.id)}
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
                  </div>
                </div>
              ))}
            </div>
            {projects.length > INITIAL_DISPLAY_COUNT && (
              <button
                className={`show-more-btn ${showAllProjects ? 'collapsed' : ''}`}
                onClick={() => setShowAllProjects(!showAllProjects)}
              >
                <div className="chevron-wave">
                  <span className="chevron"></span>
                  <span className="chevron"></span>
                </div>
              </button>
            )}
          </>
        )}

        <SectionEditButton editPath="/admin/experience" label="경력 편집" />
      </div>
    </section>
  );
};
