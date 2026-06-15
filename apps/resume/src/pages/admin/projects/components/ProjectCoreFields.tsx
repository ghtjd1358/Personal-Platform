import React from 'react';

export interface ProjectFormState {
    title: string;
    role: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    link_to_resume: boolean;
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
        </div>
    );
};

export default ProjectCoreFields;
