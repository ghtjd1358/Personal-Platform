import React from 'react';
import { Badge } from '@sonhoseong/mfa-lib';
import type { SkillCategory } from '@/network/apis/resume/types/resume';

interface Props {
  skills: SkillCategory[];
}

const ResumeSkillsSection: React.FC<Props> = ({ skills }) => (
  <section id="tech-stack" className="resume-detail-section resume-section">
    <h2 className="section-title">기술 스택</h2>
    <div className="skill-list">
      {skills.map((category) => (
        <div key={category.id} className="skill-category">
          <h3 className="skill-category-name">{category.name}</h3>
          <div className="skill-tags">
            {category.skills.map((skill) => (
              <Badge key={skill.id} variant="default" className="skill-tag">{skill.name}</Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ResumeSkillsSection;
