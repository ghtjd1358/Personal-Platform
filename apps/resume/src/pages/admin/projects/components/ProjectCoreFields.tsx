import React from 'react';

export interface ProjectFormState {
    title: string;
    role: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    link_to_resume: boolean;
    /** 'work' = 회사 작업물 (이력서 "프로젝트" 섹션), 'personal' = 개인 작업물 (이력서 "주요 작업물" 섹션). */
    category: 'work' | 'personal';
    short_description: string;
    demo_url: string;
    github_url: string;
    figma_url: string;
    cover_image: string;
}

interface ProjectCoreFieldsProps {
    form: ProjectFormState;
    onChange: (form: ProjectFormState) => void;
}

const ProjectCoreFields: React.FC<ProjectCoreFieldsProps> = ({ form, onChange }) => {
    return (
        <div className="exp-editor-card">
            <div className="exp-field">
                <div className="exp-field-label">
                    <span className="exp-field-name">제목</span>
                    <span className="exp-field-hint">REQUIRED</span>
                </div>
                <input
                    className="exp-input"
                    value={form.title}
                    onChange={(e) => onChange({ ...form, title: e.target.value })}
                    placeholder="예: 개인 플랫폼"
                    required
                />
            </div>

            <div className="exp-field">
                <div className="exp-field-label">
                    <span className="exp-field-name">역할</span>
                    <span className="exp-field-hint">REQUIRED</span>
                </div>
                <input
                    className="exp-input"
                    value={form.role}
                    onChange={(e) => onChange({ ...form, role: e.target.value })}
                    placeholder="예: 개인 프로젝트 · 설계/개발"
                    required
                />
            </div>

            <div className="exp-field">
                <div className="exp-field-label">
                    <span className="exp-field-name">기간</span>
                    <span className="exp-field-hint">START · END</span>
                </div>
                <div className="exp-date-row">
                    <input
                        type="date"
                        className="exp-input"
                        value={form.start_date}
                        onChange={(e) => onChange({ ...form, start_date: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        className="exp-input"
                        value={form.end_date || ''}
                        onChange={(e) => onChange({ ...form, end_date: e.target.value })}
                        disabled={form.is_current}
                    />
                </div>
            </div>

            <div className="exp-field">
                <div className="exp-field-label">
                    <span className="exp-field-name">플래그</span>
                    <span className="exp-field-hint">FLAGS</span>
                </div>
                <div className="exp-checks">
                    <label className="exp-check">
                        <input
                            type="checkbox"
                            checked={form.is_current}
                            onChange={(e) => onChange({ ...form, is_current: e.target.checked })}
                        />
                        <span className="exp-check-box" aria-hidden="true"></span>
                        <span className="exp-check-label">진행중</span>
                    </label>
                    <label className="exp-check">
                        <input
                            type="checkbox"
                            checked={form.link_to_resume}
                            onChange={(e) => onChange({ ...form, link_to_resume: e.target.checked })}
                        />
                        <span className="exp-check-box" aria-hidden="true"></span>
                        <span className="exp-check-label">이력서에 노출</span>
                    </label>
                </div>
            </div>

            <div className="exp-field">
                <div className="exp-field-label">
                    <span className="exp-field-name">분류</span>
                    <span className="exp-field-hint">CATEGORY</span>
                </div>
                <div className="exp-checks">
                    {/* radio: 회사 작업물(work) ↔ 개인 작업물(personal). 이력서 섹션 분기를 결정. */}
                    <label className="exp-check">
                        <input
                            type="radio"
                            name="portfolio-category"
                            checked={form.category === 'work'}
                            onChange={() => onChange({ ...form, category: 'work' })}
                        />
                        <span className="exp-check-box" aria-hidden="true"></span>
                        <span className="exp-check-label">회사 작업물</span>
                    </label>
                    <label className="exp-check">
                        <input
                            type="radio"
                            name="portfolio-category"
                            checked={form.category === 'personal'}
                            onChange={() => onChange({ ...form, category: 'personal' })}
                        />
                        <span className="exp-check-box" aria-hidden="true"></span>
                        <span className="exp-check-label">개인 작업물</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ProjectCoreFields;
