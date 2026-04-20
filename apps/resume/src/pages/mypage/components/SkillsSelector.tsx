import React, { useState, useEffect } from 'react';
import { skillsApi, type SkillCategoryWithSkills } from '@/network/apis/supabase';

interface SkillsSelectorProps {
  selectedSkills: string[]; // skill names (not IDs)
  onChange: (skills: string[]) => void;
  disabled?: boolean;
}

const SkillsSelector: React.FC<SkillsSelectorProps> = ({
  selectedSkills,
  onChange,
  disabled = false,
}) => {
  const [categories, setCategories] = useState<SkillCategoryWithSkills[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await skillsApi.getCategories();
        setCategories(data);
        // 기본적으로 모든 카테고리 펼침
        setExpandedCategories(new Set(data.map((c) => c.id)));
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSkills();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      onChange(selectedSkills.filter((s) => s !== skillName));
    } else {
      onChange([...selectedSkills, skillName]);
    }
  };

  const selectAllInCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const categorySkillNames = category.skills.map((s) => s.name);
    const allSelected = categorySkillNames.every((name) => selectedSkills.includes(name));

    if (allSelected) {
      // 모두 선택됨 -> 모두 해제
      onChange(selectedSkills.filter((s) => !categorySkillNames.includes(s)));
    } else {
      // 일부 또는 전혀 선택 안됨 -> 모두 선택
      const newSkills = new Set([...selectedSkills, ...categorySkillNames]);
      onChange(Array.from(newSkills));
    }
  };

  if (isLoading) {
    return (
      <div className="skills-selector">
        <div className="skills-selector-header">
          <h4 className="skills-selector-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            기술 스택
          </h4>
        </div>
        <div className="skills-selector-loading">
          <div className="spinner-small" />
          <span>기술 스택을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-selector">
      <div className="skills-selector-header">
        <h4 className="skills-selector-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          기술 스택
        </h4>
        {selectedSkills.length > 0 && (
          <span className="skills-selector-count">{selectedSkills.length}개 선택됨</span>
        )}
      </div>

      <p className="skills-selector-desc">
        보유하고 있는 기술을 선택해주세요. 선택한 기술은 이력서에 표시됩니다.
      </p>

      {categories.length === 0 ? (
        <div className="skills-selector-empty">
          <p>등록된 기술이 없습니다.</p>
        </div>
      ) : (
        <div className="skills-selector-categories">
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            const categorySkillNames = category.skills.map((s) => s.name);
            const selectedCount = categorySkillNames.filter((name) =>
              selectedSkills.includes(name)
            ).length;
            const allSelected = selectedCount === category.skills.length && category.skills.length > 0;

            return (
              <div key={category.id} className="skills-selector-category">
                <div
                  className="skills-selector-category-header"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="skills-selector-category-info">
                    <svg
                      className={`skills-selector-chevron ${isExpanded ? 'expanded' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                    <span className="skills-selector-category-name">{category.label}</span>
                    {selectedCount > 0 && (
                      <span className="skills-selector-category-count">
                        {selectedCount}/{category.skills.length}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`skills-selector-select-all ${allSelected ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectAllInCategory(category.id);
                    }}
                    disabled={disabled}
                  >
                    {allSelected ? '전체 해제' : '전체 선택'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="skills-selector-skills">
                    {category.skills.map((skill) => {
                      const isSelected = selectedSkills.includes(skill.name);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          className={`skills-selector-skill ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleSkill(skill.name)}
                          disabled={disabled}
                        >
                          {skill.name}
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedSkills.length > 0 && (
        <div className="skills-selector-selected">
          <span className="skills-selector-selected-label">선택된 기술:</span>
          <div className="skills-selector-selected-tags">
            {selectedSkills.map((skill) => (
              <span key={skill} className="skills-selector-tag">
                {skill}
                <button
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  disabled={disabled}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSelector;
