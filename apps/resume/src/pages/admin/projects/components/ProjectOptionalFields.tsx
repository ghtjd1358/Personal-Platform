import React from 'react';
import type { ProjectFormState } from './ProjectCoreFields';

interface ProjectOptionalFieldsProps {
    form: ProjectFormState;
    onChange: (form: ProjectFormState) => void;
}

const ProjectOptionalFields: React.FC<ProjectOptionalFieldsProps> = ({ form, onChange }) => {
    return (
        <details className="exp-editor-card proj-editor-fullwidth-row">
            <summary className="proj-editor-summary">
                <span className="proj-editor-optional-label">
                    OPTIONAL
                </span>
                포트폴리오 섹션 전용 필드 (이력서엔 표시 안 됨)
            </summary>

            <div className="exp-field proj-editor-section-block">
                <div className="exp-field-label">
                    <span className="exp-field-name">짧은 소개</span>
                    <span className="exp-field-hint">SHORT DESCRIPTION · 1~2 FIG</span>
                </div>
                <input
                    className="exp-input"
                    value={form.short_description}
                    onChange={(e) => onChange({ ...form, short_description: e.target.value })}
                    placeholder="카드 hover 시 보이는 한 줄 설명"
                />
            </div>

            <div className="exp-field">
                <div className="exp-field-label">
                    <span className="exp-field-name">커버 이미지 URL</span>
                    <span className="exp-field-hint">COVER IMAGE</span>
                </div>
                <input
                    className="exp-input"
                    value={form.cover_image}
                    onChange={(e) => onChange({ ...form, cover_image: e.target.value })}
                    placeholder="https://..."
                />
            </div>

            <div className="exp-field">
                <div className="exp-field-label">
                    <span className="exp-field-name">링크</span>
                    <span className="exp-field-hint">DEMO · GITHUB · FIGMA</span>
                </div>
                <input
                    className="exp-input proj-editor-input--mb-8"
                    value={form.demo_url}
                    onChange={(e) => onChange({ ...form, demo_url: e.target.value })}
                    placeholder="Demo URL — https://..."
                />
                <input
                    className="exp-input proj-editor-input--mb-8"
                    value={form.github_url}
                    onChange={(e) => onChange({ ...form, github_url: e.target.value })}
                    placeholder="GitHub URL — https://github.com/..."
                />
                <input
                    className="exp-input"
                    value={form.figma_url}
                    onChange={(e) => onChange({ ...form, figma_url: e.target.value })}
                    placeholder="Figma URL — https://figma.com/..."
                />
            </div>
        </details>
    );
};

export default ProjectOptionalFields;
