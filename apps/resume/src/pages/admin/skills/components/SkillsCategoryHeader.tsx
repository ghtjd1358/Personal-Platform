import React from 'react';
import { Button } from '@sonhoseong/mfa-lib';
import type { SkillCategoryWithSkills } from '../../../../network/apis/supabase';

interface SkillsCategoryHeaderProps {
    category: SkillCategoryWithSkills;
    isOwner: boolean;
    editingCategoryId: string | null;
    editingCategoryName: string;
    onEditingNameChange: (value: string) => void;
    onStartEdit: (id: string, currentName: string) => void;
    onCancelEdit: () => void;
    onUpdate: (id: string) => void;
    onDelete: (id: string, label: string) => void;
}

const SkillsCategoryHeader: React.FC<SkillsCategoryHeaderProps> = ({
    category,
    isOwner,
    editingCategoryId,
    editingCategoryName,
    onEditingNameChange,
    onStartEdit,
    onCancelEdit,
    onUpdate,
    onDelete,
}) => {
    const isEditing = editingCategoryId === category.id;

    return (
        <header className="skills-category-header">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editingCategoryName}
                        onChange={(e) => onEditingNameChange(e.target.value)}
                        className="skills-input"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onUpdate(category.id);
                            if (e.key === 'Escape') onCancelEdit();
                        }}
                    />
                    <Button variant="primary" onClick={() => onUpdate(category.id)}>저장</Button>
                    <Button variant="ghost" onClick={onCancelEdit}>
                        취소
                    </Button>
                </>
            ) : (
                <>
                    <h2 className="skills-category-name">{category.label}</h2>
                    {isOwner && (
                        <div className="skills-category-actions">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onStartEdit(category.id, category.label)}
                            >
                                이름 수정
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onDelete(category.id, category.label)}
                            >
                                삭제
                            </Button>
                        </div>
                    )}
                </>
            )}
        </header>
    );
};

export default SkillsCategoryHeader;
