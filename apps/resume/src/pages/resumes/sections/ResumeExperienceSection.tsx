import React from 'react';
import { Badge } from '@sonhoseong/mfa-lib';
import type { ExperienceItem } from '@/network/apis/resume/types/resume';
import { formatPeriod } from '@/utils/date';

interface Props {
  experiences: ExperienceItem[];
}

const ResumeExperienceSection: React.FC<Props> = ({ experiences }) => (
  <section id="experience" className="resume-detail-section resume-section">
    <h2 className="section-title">경력 & 교육</h2>
    <div className="experience-list">
      {experiences.map((exp) => (
        <div key={exp.id} className={`experience-item ${exp.is_dev ? 'dev' : 'non-dev'}`}>
          <div className="experience-header">
            <div className="experience-info">
              <h3 className="experience-company">{exp.company}</h3>
              <p className="experience-position">{exp.position}</p>
            </div>
            <span className="experience-period">
              {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
            </span>
          </div>
          {exp.tasks.length > 0 && (
            <ul className="experience-tasks">
              {exp.tasks.map((task) => (
                <li key={task.id}>{task.task.replace(/\*\*(.*?)\*\*/g, '$1')}</li>
              ))}
            </ul>
          )}
          {exp.tags.length > 0 && (
            <div className="experience-tags">
              {exp.tags.map((tag, i) => (
                <Badge key={`${tag}-${i}`} variant="default" className="tag">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default ResumeExperienceSection;
