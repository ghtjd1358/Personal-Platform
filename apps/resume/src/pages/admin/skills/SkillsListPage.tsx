import React from 'react';
import { mockSkillCategories } from '../../../data';
import { iconMap } from '../../../constants/iconMap';

/**
 * SkillsListPage - 기술스택 목록 (목업 데이터 사용)
 *
 * 참고: 스킬은 현재 목업 데이터로 표시됩니다.
 * 아이콘 매핑이 복잡하여 DB 연동 대신 코드에서 직접 관리합니다.
 * 스킬 추가/수정이 필요하면 src/data/skills.ts 파일을 수정하세요.
 */
const SkillsListPage: React.FC = () => {
  return (
    <div className="admin-list-page">
      <header className="admin-page-header">
        <div className="admin-page-header-left">
          <h1>기술스택 관리</h1>
          <p>보유한 기술스택을 확인합니다.</p>
        </div>
        {/* 스킬 추가는 src/data/skills.ts에서 직접 수정 */}
      </header>

      <div className="admin-info-box" style={{
        padding: '16px 20px',
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        marginBottom: '24px',
        color: '#0369a1'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          <strong>안내:</strong> 스킬은 아이콘 매핑이 필요하여 코드에서 직접 관리합니다.
          <br />
          스킬 추가/수정이 필요하면 <code style={{ background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>src/data/skills.ts</code> 파일을 수정하세요.
        </p>
      </div>

      <div className="admin-categories-list">
        {mockSkillCategories.map((category) => (
          <section key={category.id} className="admin-category-section">
            <h2 className="admin-category-title">{category.name}</h2>
            <div className="admin-skills-grid">
              {category.skills.map((skill) => (
                <div key={skill.id} className="admin-skill-card" style={{ justifyContent: 'flex-start', gap: '12px' }}>
                  <span className="admin-skill-icon" style={{ fontSize: '20px' }}>
                    {iconMap[skill.name] || '💻'}
                  </span>
                  <span className="admin-skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SkillsListPage;
