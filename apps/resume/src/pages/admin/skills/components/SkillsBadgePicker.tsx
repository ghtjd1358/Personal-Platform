import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, techIconMap as iconMap } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';
import type { SkillCategoryWithSkills } from '../../../../network/apis/supabase';

interface SkillsBadgePickerProps {
    category: SkillCategoryWithSkills;
    pickerSearch: string;
    filteredBadges: string[];
    busyBadge: string | null;
    onSearchChange: (value: string) => void;
    onClose: () => void;
    onToggleBadge: (category: SkillCategoryWithSkills, badgeName: string) => void;
}

const SkillsBadgePicker: React.FC<SkillsBadgePickerProps> = ({
    category,
    pickerSearch,
    filteredBadges,
    busyBadge,
    onSearchChange,
    onClose,
    onToggleBadge,
}) => {
    const navigate = useNavigate();

    return (
        <div className="skills-picker">
            <div className="skills-picker-head">
                <input
                    type="text"
                    className="skills-input skills-picker-search"
                    placeholder="검색 (예: React, Python, AWS)"
                    value={pickerSearch}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`${LINK_PREFIX}/admin/skills/new?category=${category.id}`)}
                    title="iconMap 에 없는 기술은 여기서 수동으로 아이콘/이모지 지정"
                >
                    + 커스텀 아이콘
                </Button>
                <Button
                    variant="text"
                    size="sm"
                    onClick={onClose}
                    title="닫기"
                    aria-label="닫기"
                >
                    ✕
                </Button>
            </div>

            <div className="skills-picker-grid">
                {filteredBadges.map((name) => {
                    const inCategory = category.skills.some((s) => s.name === name);
                    const busyKey = `${category.id}::${name}`;
                    const isBusy = busyBadge === busyKey;
                    return (
                        <button
                            type="button"
                            key={name}
                            className={`skills-picker-badge ${inCategory ? 'is-added' : ''} ${isBusy ? 'is-busy' : ''}`}
                            onClick={() => onToggleBadge(category, name)}
                            disabled={isBusy}
                            title={inCategory ? `${name} — 클릭해서 제거` : `${name} — 클릭해서 추가`}
                        >
                            <span className="skills-picker-badge-icon">{iconMap[name]}</span>
                            <span className="skills-picker-badge-name">{name}</span>
                            {inCategory && <span className="skills-picker-badge-check">✓</span>}
                        </button>
                    );
                })}
                {filteredBadges.length === 0 && (
                    <div className="skills-picker-empty">
                        "{pickerSearch}" 검색 결과 없음. "+ 커스텀 아이콘" 으로 직접 추가하세요.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillsBadgePicker;
