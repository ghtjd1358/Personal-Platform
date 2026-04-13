import React, { useState } from 'react';
import { iconMap } from '../../../constants/iconMap';
import { SkillCategoryDetail } from '../../../data';
import { SectionEditButton } from '../../../components/common';

interface SkillsSectionProps {
  categories: SkillCategoryDetail[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ categories }) => {
  const [activeSkillTab, setActiveSkillTab] = useState<string>('');

  if (categories.length === 0) {
    return (
      <section id="skills" className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <div className="section-label">기술 스택</div>
            <h2 className="section-title">사용하는 기술들</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            기술 스택 정보가 없습니다.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-label">기술 스택</div>
          <h2 className="section-title">사용하는 기술들</h2>
        </div>

        <div className="skill-tabs animate-on-scroll">
          <button
            className={`skill-tab ${activeSkillTab === '' ? 'active' : ''}`}
            onClick={() => setActiveSkillTab('')}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`skill-tab ${activeSkillTab === cat.id ? 'active' : ''}`}
              onClick={() => setActiveSkillTab(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="skill-grid animate-on-scroll">
          {categories.flatMap((cat) =>
            cat.skills?.map((skill) => (
              <div
                className={`skill-badge ${activeSkillTab && activeSkillTab !== cat.id ? 'dimmed' : ''}`}
                key={skill.id}
                data-tooltip={skill.name}
              >
                <div className="skill-icon">
                  {iconMap[skill.name] || (
                    <span style={{ color: skill.icon_color || '#666' }}>{skill.icon || '💻'}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <SectionEditButton editPath="/admin/skills" label="기술스택 편집" />
      </div>
    </section>
  );
};
