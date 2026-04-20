import React from 'react';

export interface ExperienceFormData {
  id?: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_dev: boolean;
  description: string;
}

const emptyExperience: ExperienceFormData = {
  company: '',
  position: '',
  start_date: '',
  end_date: '',
  is_current: false,
  is_dev: true,
  description: '',
};

interface ExperienceEditorProps {
  experiences: ExperienceFormData[];
  onChange: (experiences: ExperienceFormData[]) => void;
  disabled?: boolean;
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experiences,
  onChange,
  disabled = false,
}) => {
  const handleAdd = () => {
    onChange([...experiences, { ...emptyExperience }]);
  };

  const handleRemove = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ExperienceFormData, value: any) => {
    const updated = experiences.map((exp, i) => {
      if (i !== index) return exp;
      const newExp = { ...exp, [field]: value };
      // is_current가 true면 end_date 초기화
      if (field === 'is_current' && value === true) {
        newExp.end_date = '';
      }
      return newExp;
    });
    onChange(updated);
  };

  return (
    <div className="inline-editor">
      <div className="inline-editor-header">
        <h4 className="inline-editor-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          경력사항
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
          경력 추가
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="inline-editor-empty">
          <p>아직 등록된 경력이 없습니다.</p>
          <button
            type="button"
            className="inline-editor-empty-btn"
            onClick={handleAdd}
            disabled={disabled}
          >
            첫 경력 추가하기
          </button>
        </div>
      ) : (
        <div className="inline-editor-list">
          {experiences.map((exp, index) => (
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
                  <label>회사명 *</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                    placeholder="회사명을 입력하세요"
                    disabled={disabled}
                  />
                </div>
                <div className="inline-editor-field">
                  <label>직책 *</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleChange(index, 'position', e.target.value)}
                    placeholder="프론트엔드 개발자"
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="inline-editor-row">
                <div className="inline-editor-field">
                  <label>시작일 *</label>
                  <input
                    type="month"
                    value={exp.start_date}
                    onChange={(e) => handleChange(index, 'start_date', e.target.value)}
                    disabled={disabled}
                  />
                </div>
                <div className="inline-editor-field">
                  <label>종료일</label>
                  <input
                    type="month"
                    value={exp.end_date}
                    onChange={(e) => handleChange(index, 'end_date', e.target.value)}
                    disabled={disabled || exp.is_current}
                    placeholder={exp.is_current ? '재직중' : ''}
                  />
                </div>
              </div>

              <div className="inline-editor-row inline-editor-row--checkboxes">
                <label className="inline-editor-checkbox">
                  <input
                    type="checkbox"
                    checked={exp.is_current}
                    onChange={(e) => handleChange(index, 'is_current', e.target.checked)}
                    disabled={disabled}
                  />
                  <span>현재 재직중</span>
                </label>
                <div className="inline-editor-radio-group">
                  <label className="inline-editor-radio">
                    <input
                      type="radio"
                      name={`is_dev_${index}`}
                      checked={exp.is_dev}
                      onChange={() => handleChange(index, 'is_dev', true)}
                      disabled={disabled}
                    />
                    <span>개발직</span>
                  </label>
                  <label className="inline-editor-radio">
                    <input
                      type="radio"
                      name={`is_dev_${index}`}
                      checked={!exp.is_dev}
                      onChange={() => handleChange(index, 'is_dev', false)}
                      disabled={disabled}
                    />
                    <span>비개발직</span>
                  </label>
                </div>
              </div>

              <div className="inline-editor-field">
                <label>업무 내용</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder="주요 업무와 성과를 작성해주세요.&#10;- 프론트엔드 개발 및 유지보수&#10;- 레거시 코드 리팩토링"
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

export default ExperienceEditor;
