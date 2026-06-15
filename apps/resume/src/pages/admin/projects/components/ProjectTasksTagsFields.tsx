import React, { useMemo } from 'react';
import { Badge } from '@sonhoseong/mfa-lib';

interface ProjectTasksTagsFieldsProps {
    tasksText: string;
    tagsText: string;
    onTasksTextChange: (value: string) => void;
    onTagsTextChange: (value: string) => void;
}

const ProjectTasksTagsFields: React.FC<ProjectTasksTagsFieldsProps> = ({
    tasksText,
    tagsText,
    onTasksTextChange,
    onTagsTextChange,
}) => {
    const parsedTags = useMemo(
        () => tagsText.split(',').map((s) => s.trim()).filter(Boolean),
        [tagsText],
    );

    return (
        <div className="exp-editor-card">
            <div className="exp-field">
                <div className="exp-field-label">
                    <span className="exp-field-name">주요 작업</span>
                    <span className="exp-field-hint">ONE TASK PER LINE · **BOLD** OK</span>
                </div>
                <textarea
                    className="exp-textarea"
                    value={tasksText}
                    onChange={(e) => onTasksTextChange(e.target.value)}
                    rows={6}
                    placeholder={'예)\n**번들 최적화** - 8.09MB → 397KB (80% 감소)\n**Lighthouse 개선** - 73 → 89점'}
                />
            </div>

            <div className="exp-field">
                <div className="exp-field-label">
                    <span className="exp-field-name">기술 태그</span>
                    <span className="exp-field-hint">COMMA SEPARATED</span>
                </div>
                <input
                    className="exp-input"
                    value={tagsText}
                    onChange={(e) => onTagsTextChange(e.target.value)}
                    placeholder="React, TypeScript, Vite, Tailwind CSS"
                />
                <div className="exp-chips">
                    {parsedTags.length > 0 ? (
                        parsedTags.map((t) => (
                            <Badge key={t} variant="default" className="exp-chip">{t}</Badge>
                        ))
                    ) : (
                        <span className="exp-chips-empty">쉼표로 구분하면 여기에 칩으로 나타나요.</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectTasksTagsFields;
