import React from 'react';
import { Button, techIconMap as iconMap } from '@sonhoseong/mfa-lib';
import type { SkillCategoryWithSkills } from '../../../../network/apis/supabase';
import SkillsCategoryHeader from './SkillsCategoryHeader';
import SkillsBadgePicker from './SkillsBadgePicker';

interface SkillsCategorySectionProps {
    category: SkillCategoryWithSkills;
    isOwner: boolean;
    isPickerOpen: boolean;
    pickerSearch: string;
    filteredBadges: string[];
    busyBadge: string | null;
    editingCategoryId: string | null;
    editingCategoryName: string;
    onEditingNameChange: (value: string) => void;
    onStartEdit: (id: string, currentName: string) => void;
    onCancelEdit: () => void;
    onUpdateCategory: (id: string) => void;
    onDeleteCategory: (id: string, label: string) => void;
    onDeleteSkill: (id: string, name: string) => void;
    onTogglePicker: (categoryId: string) => void;
    onPickerSearchChange: (value: string) => void;
    onClosePicker: () => void;
    onToggleBadge: (category: SkillCategoryWithSkills, badgeName: string) => void;
}

const SkillsCategorySection: React.FC<SkillsCategorySectionProps> = ({
    category,
    isOwner,
    isPickerOpen,
    pickerSearch,
    filteredBadges,
    busyBadge,
    editingCategoryId,
    editingCategoryName,
    onEditingNameChange,
    onStartEdit,
    onCancelEdit,
    onUpdateCategory,
    onDeleteCategory,
    onDeleteSkill,
    onTogglePicker,
    onPickerSearchChange,
    onClosePicker,
    onToggleBadge,
}) => {
    return (
        <section className="skills-category">
            <SkillsCategoryHeader
                category={category}
                isOwner={isOwner}
                editingCategoryId={editingCategoryId}
                editingCategoryName={editingCategoryName}
                onEditingNameChange={onEditingNameChange}
                onStartEdit={onStartEdit}
                onCancelEdit={onCancelEdit}
                onUpdate={onUpdateCategory}
                onDelete={onDeleteCategory}
            />

            <div className="skills-grid">
                {category.skills.map((skill) => (
                    <div key={skill.id} className="skills-item">
                        <span className="skills-item-icon">
                            {(skill.icon && iconMap[skill.icon]) ||
                                iconMap[skill.name] || (
                                    <span style={{ color: skill.icon_color || '#8B7355' }}>
                                        {skill.icon || '💻'}
                                    </span>
                                )}
                        </span>
                        <span className="skills-item-name">{skill.name}</span>
                        {isOwner && (
                            <div className="skills-item-actions">
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDeleteSkill(skill.id, skill.name)}
                                    title="삭제"
                                    aria-label={`${skill.name} 삭제`}
                                >
                                    ×
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                {isOwner && (
                    <button
                        type="button"
                        className={`skills-add-card ${isPickerOpen ? 'is-active' : ''}`}
                        onClick={() => onTogglePicker(category.id)}
                    >
                        {isPickerOpen ? '닫기 ▲' : '+ 스킬 추가'}
                    </button>
                )}
            </div>

            {isPickerOpen && (
                <SkillsBadgePicker
                    category={category}
                    pickerSearch={pickerSearch}
                    filteredBadges={filteredBadges}
                    busyBadge={busyBadge}
                    onSearchChange={onPickerSearchChange}
                    onClose={onClosePicker}
                    onToggleBadge={onToggleBadge}
                />
            )}
        </section>
    );
};

export default SkillsCategorySection;
