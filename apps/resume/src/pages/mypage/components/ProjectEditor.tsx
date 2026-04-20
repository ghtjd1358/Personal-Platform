import React from 'react';

export interface ProjectFormData {
  id?: string;
  title: string;
  role: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  tech_stack: string;
}

const emptyProject: ProjectFormData = {
  title: '',
  role: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  tech_stack: '',
};

interface ProjectEditorProps {
  projects: ProjectFormData[];
  onChange: (projects: ProjectFormData[]) => void;
  disabled?: boolean;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({
  projects,
  onChange,
  disabled = false,
}) => {
  const handleAdd = () => {
    onChange([...projects, { ...emptyProject }]);
  };

  const handleRemove = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ProjectFormData, value: any) => {
    const updated = projects.map((proj, i) => {
      if (i !== index) return proj;
      const newProj = { ...proj, [field]: value };
      if (field === 'is_current' && value === true) {
        newProj.end_date = '';
      }
      return newProj;
    });
    onChange(updated);
  };

  return (
    <div className="inline-editor">
      <div className="inline-editor-header">
        <h4 className="inline-editor-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          프로젝트
        </h4>
        <button
          type="button"
          className="inline-editor-add-btn"
          onClick={handleAdd}
          disabled={disabled}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          프로젝트 추가
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="inline-editor-empty">
          <p>아직 등록된 프로젝트가 없습니다.</p>
          <button
            type="button"
            className="inline-editor-empty-btn"
            onClick={handleAdd}
            disabled={disabled}
          >
            첫 프로젝트 추가하기
          </button>
        </div>
      ) : (
        <div className="inline-editor-list">
          {projects.map((proj, index) => (
            <div key={index} className="inline-editor-item">
              <div className="inline-editor-item-header">
                <span className="inline-editor-item-number">#{index + 1}</span>
                <button
                  type="button"
                  className="inline-editor-item-remove"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  title="삭제"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="inline-editor-row">
                <div className="inline-editor-field">
                  <label>프로젝트명 *</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    placeholder="프로젝트명을 입력하세요"
                    disabled={disabled}
                  />
                </div>
                <div className="inline-editor-field">
                  <label>역할 *</label>
                  <input
                    type="text"
                    value={proj.role}
                    onChange={(e) => handleChange(index, 'role', e.target.value)}
                    placeholder="프론트엔드 개발"
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="inline-editor-row">
                <div className="inline-editor-field">
                  <label>시작일 *</label>
                  <input
                    type="month"
                    value={proj.start_date}
                    onChange={(e) => handleChange(index, 'start_date', e.target.value)}
                    disabled={disabled}
                  />
                </div>
                <div className="inline-editor-field">
                  <label>종료일</label>
                  <input
                    type="month"
                    value={proj.end_date}
                    onChange={(e) => handleChange(index, 'end_date', e.target.value)}
                    disabled={disabled || proj.is_current}
                    placeholder={proj.is_current ? '진행중' : ''}
                  />
                </div>
              </div>

              <div className="inline-editor-row inline-editor-row--checkboxes">
                <label className="inline-editor-checkbox">
                  <input
                    type="checkbox"
                    checked={proj.is_current}
                    onChange={(e) => handleChange(index, 'is_current', e.target.checked)}
                    disabled={disabled}
                  />
                  <span>현재 진행중</span>
                </label>
              </div>

              <div className="inline-editor-field">
                <label>기술 스택</label>
                <input
                  type="text"
                  value={proj.tech_stack}
                  onChange={(e) => handleChange(index, 'tech_stack', e.target.value)}
                  placeholder="React, TypeScript, Redux (콤마로 구분)"
                  disabled={disabled}
                />
                <p className="inline-editor-hint">사용한 기술을 콤마(,)로 구분하여 입력하세요</p>
              </div>

              <div className="inline-editor-field">
                <label>프로젝트 설명</label>
                <textarea
                  value={proj.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder="프로젝트 내용과 본인의 기여도를 작성해주세요.&#10;- 주요 기능 개발&#10;- 성능 최적화 30% 달성"
                  rows={4}
                  disabled={disabled}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectEditor;
