import React from 'react';
import { Badge, Button } from '@sonhoseong/mfa-lib';

interface TechStackItem {
    name: string;
    icon?: string;
    icon_color?: string;
}

interface PortfolioTechTagsSectionProps {
    techStack: TechStackItem[];
    newTechName: string;
    tagsInput: string;
    onNewTechNameChange: (value: string) => void;
    onAddTechStack: () => void;
    onRemoveTechStack: (index: number) => void;
    onTagsInputChange: (value: string) => void;
}

const PortfolioTechTagsSection: React.FC<PortfolioTechTagsSectionProps> = ({
    techStack,
    newTechName,
    tagsInput,
    onNewTechNameChange,
    onAddTechStack,
    onRemoveTechStack,
    onTagsInputChange,
}) => {
    return (
        <>
            <section className="editor-section">
                <h2>기술 스택</h2>
                <div className="tech-stack-input">
                    <input
                        type="text"
                        value={newTechName}
                        onChange={(e) => onNewTechNameChange(e.target.value)}
                        placeholder="기술 이름 (예: React)"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTechStack())}
                    />
                    <Button type="button" size="sm" variant="ghost" onClick={onAddTechStack} className="btn-add">
                        추가
                    </Button>
                </div>
                {techStack.length > 0 && (
                    <div className="tech-stack-list">
                        {techStack.map((tech, index) => (
                            <Badge key={`${tech.name}-${index}`} variant="default" className="tech-tag">
                                {tech.name}
                                <button type="button" onClick={() => onRemoveTechStack(index)}>×</button>
                            </Badge>
                        ))}
                    </div>
                )}
            </section>

            <section className="editor-section">
                <h2>태그</h2>
                <div className="form-group">
                    <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => onTagsInputChange(e.target.value)}
                        placeholder="쉼표로 구분 (예: 웹, 모바일, AI)"
                    />
                </div>
            </section>
        </>
    );
};

export default PortfolioTechTagsSection;
