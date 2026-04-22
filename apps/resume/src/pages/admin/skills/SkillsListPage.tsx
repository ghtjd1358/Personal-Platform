/**
 * SkillsListPage — 카테고리별 스킬 관리.
 * - 카테고리: CRUD inline edit
 * - 스킬: iconMap 전체를 badge grid 로 펼쳐 클릭-토글 (추가/제거)
 * - iconMap 에 없는 커스텀 아이콘/이모지는 "+ 커스텀 아이콘" 링크로 editor 페이지로 fallback
 */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, useAsyncConfirm, usePermission } from '@sonhoseong/mfa-lib';
import { iconMap } from '../../../constants/iconMap';
import { LINK_PREFIX } from '@/config/constants';
import {
    skillsApi,
    type SkillCategoryWithSkills,
} from '../../../network/apis/supabase';
import './Skills.editorial.css';

const SkillsListPage: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const confirmDialog = useAsyncConfirm();
    // 현재 SkillCategoryWithSkills 는 user_id 를 포함하지 않아 row-level gating 이 어려움.
    // 단일-Owner 운영 가정 하에 isOwner 로 전체 편집 UI gating. 추후 multi-user 지원 시
    // API response 에 user_id 포함 + canEditResource 세분화 리팩토링.
    const { isOwner } = usePermission();
    const [categories, setCategories] = useState<SkillCategoryWithSkills[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    // picker drawer 상태: 어떤 카테고리에 대해 열려있는지 (null = 닫힘), 검색 쿼리
    const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null);
    const [pickerSearch, setPickerSearch] = useState('');
    const [busyBadge, setBusyBadge] = useState<string | null>(null); // "category.id::name" 키로 중복 클릭 방지

    const allBadgeNames = useMemo(() => Object.keys(iconMap), []);
    const filteredBadges = useMemo(() => {
        const q = pickerSearch.trim().toLowerCase();
        if (!q) return allBadgeNames;
        return allBadgeNames.filter((n) => n.toLowerCase().includes(q));
    }, [allBadgeNames, pickerSearch]);

    const refresh = useCallback(async () => {
        try {
            const data = await skillsApi.getCategories();
            setCategories(data);
        } catch (err) {
            console.error('[SkillsList] fetch 실패:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const handleCreateCategory = async () => {
        const name = newCategoryName.trim();
        if (!name) return;
        const nextOrder = categories.length;
        try {
            const { error } = await skillsApi.createCategory({
                label: name,
                order_index: nextOrder,
            });
            if (error) throw error;
            setNewCategoryName('');
            setCreatingCategory(false);
            await refresh();
        } catch (err) {
            toast.error('카테고리 추가 실패: ' + (err as Error).message);
        }
    };

    const handleUpdateCategory = async (id: string) => {
        const name = editingCategoryName.trim();
        if (!name) return;
        try {
            const { error } = await skillsApi.updateCategory(id, { label: name });
            if (error) throw error;
            setEditingCategoryId(null);
            setEditingCategoryName('');
            await refresh();
        } catch (err) {
            toast.error('카테고리 수정 실패: ' + (err as Error).message);
        }
    };

    const handleDeleteCategory = async (id: string, label: string) => {
        const ok = await confirmDialog(
            `"${label}" 카테고리를 삭제할까요?\n하위 스킬도 모두 삭제됩니다.`,
            '카테고리 삭제'
        );
        if (!ok) return;
        try {
            const { error } = await skillsApi.deleteCategory(id);
            if (error) throw error;
            await refresh();
        } catch (err) {
            toast.error('카테고리 삭제 실패: ' + (err as Error).message);
        }
    };

    const handleDeleteSkill = async (id: string, name: string) => {
        const ok = await confirmDialog(`"${name}" 스킬을 삭제할까요?`, '스킬 삭제');
        if (!ok) return;
        try {
            const { error } = await skillsApi.deleteSkill(id);
            if (error) throw error;
            await refresh();
        } catch (err) {
            toast.error('스킬 삭제 실패: ' + (err as Error).message);
        }
    };

    /** badge 클릭: 이미 카테고리에 있으면 제거, 없으면 추가 */
    const handleToggleBadge = async (category: SkillCategoryWithSkills, badgeName: string) => {
        const busyKey = `${category.id}::${badgeName}`;
        if (busyBadge === busyKey) return;
        setBusyBadge(busyKey);
        try {
            const existing = category.skills.find((s) => s.name === badgeName);
            if (existing) {
                const { error } = await skillsApi.deleteSkill(existing.id);
                if (error) throw error;
                toast.success(`${badgeName} 제거됨`);
            } else {
                const { error } = await skillsApi.createSkill({
                    category_id: category.id,
                    name: badgeName,
                    icon: badgeName,
                    icon_color: '#2B1E14',
                    order_index: category.skills.length,
                });
                if (error) throw error;
                toast.success(`${badgeName} 추가됨`);
            }
            await refresh();
        } catch (err) {
            toast.error('변경 실패: ' + (err as Error).message);
        } finally {
            setBusyBadge(null);
        }
    };

    const togglePicker = (categoryId: string) => {
        setPickerOpenFor(pickerOpenFor === categoryId ? null : categoryId);
        setPickerSearch('');
    };

    if (loading) {
        return (
            <div className="admin-list-page skills-admin">
                <div className="skills-admin-loading">불러오는 중…</div>
            </div>
        );
    }

    const isEmpty = categories.length === 0;

    return (
        <div className="admin-list-page skills-admin">
            <header className="admin-page-header skills-admin-header">
                <div>
                    <h1 className="skills-admin-title">기술스택 관리</h1>
                    <p className="skills-admin-sub">카테고리 만들고, 아래 뱃지에서 원하는 기술을 클릭해서 넣으세요.</p>
                </div>
                {!isEmpty && isOwner && (
                    <button
                        className="skills-btn skills-btn--primary"
                        onClick={() => setCreatingCategory(true)}
                    >
                        + 카테고리 추가
                    </button>
                )}
            </header>

            <div className="skills-admin-info">
                <strong className="skills-admin-info-label">NOTE</strong>
                뱃지를 클릭하면 즉시 카테고리에 추가·제거돼요. 목록에 없는 기술은 카테고리별 "커스텀 아이콘"으로 수동 입력 가능.
            </div>

            {isEmpty && !creatingCategory && (
                <div className="skills-empty">
                    <p className="skills-empty-title">아직 등록된 카테고리가 없습니다.</p>
                    {isOwner ? (
                        <>
                            <p className="skills-empty-sub">먼저 카테고리(예: 프론트엔드, 상태관리)를 만들어보세요.</p>
                            <div className="skills-empty-actions">
                                <button
                                    className="skills-btn skills-btn--primary"
                                    onClick={() => setCreatingCategory(true)}
                                >
                                    카테고리 추가
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="skills-empty-sub">Owner 가 카테고리를 추가하면 여기에 표시됩니다. (열람만 가능)</p>
                    )}
                </div>
            )}

            {creatingCategory && (
                <div className="skills-category-editor">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="예: 프론트엔드"
                        className="skills-input"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateCategory();
                            if (e.key === 'Escape') {
                                setCreatingCategory(false);
                                setNewCategoryName('');
                            }
                        }}
                    />
                    <button className="skills-btn skills-btn--primary" onClick={handleCreateCategory}>저장</button>
                    <button
                        className="skills-btn skills-btn--ghost"
                        onClick={() => {
                            setCreatingCategory(false);
                            setNewCategoryName('');
                        }}
                    >
                        취소
                    </button>
                </div>
            )}

            <div className="skills-categories">
                {categories.map((category) => {
                    const isPickerOpen = pickerOpenFor === category.id;
                    return (
                        <section key={category.id} className="skills-category">
                            <header className="skills-category-header">
                                {editingCategoryId === category.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editingCategoryName}
                                            onChange={(e) => setEditingCategoryName(e.target.value)}
                                            className="skills-input"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleUpdateCategory(category.id);
                                                if (e.key === 'Escape') {
                                                    setEditingCategoryId(null);
                                                    setEditingCategoryName('');
                                                }
                                            }}
                                        />
                                        <button className="skills-btn skills-btn--primary" onClick={() => handleUpdateCategory(category.id)}>저장</button>
                                        <button
                                            className="skills-btn skills-btn--ghost"
                                            onClick={() => {
                                                setEditingCategoryId(null);
                                                setEditingCategoryName('');
                                            }}
                                        >
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="skills-category-name">{category.label}</h2>
                                        {isOwner && (
                                            <div className="skills-category-actions">
                                                <button
                                                    className="skills-btn skills-btn--ghost skills-btn--small"
                                                    onClick={() => {
                                                        setEditingCategoryId(category.id);
                                                        setEditingCategoryName(category.label);
                                                    }}
                                                >
                                                    이름 수정
                                                </button>
                                                <button
                                                    className="skills-btn skills-btn--danger skills-btn--small"
                                                    onClick={() => handleDeleteCategory(category.id, category.label)}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </header>

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
                                                <button
                                                    className="skills-btn skills-btn--danger skills-btn--tiny"
                                                    onClick={() => handleDeleteSkill(skill.id, skill.name)}
                                                    title="삭제"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isOwner && (
                                    <button
                                        type="button"
                                        className={`skills-add-card ${isPickerOpen ? 'is-active' : ''}`}
                                        onClick={() => togglePicker(category.id)}
                                    >
                                        {isPickerOpen ? '닫기 ▲' : '+ 스킬 추가'}
                                    </button>
                                )}
                            </div>

                            {isPickerOpen && (
                                <div className="skills-picker">
                                    <div className="skills-picker-head">
                                        <input
                                            type="text"
                                            className="skills-input skills-picker-search"
                                            placeholder="검색 (예: React, Python, AWS)"
                                            value={pickerSearch}
                                            onChange={(e) => setPickerSearch(e.target.value)}
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            className="skills-btn skills-btn--ghost skills-btn--small"
                                            onClick={() => navigate(`${LINK_PREFIX}/admin/skills/new?category=${category.id}`)}
                                            title="iconMap 에 없는 기술은 여기서 수동으로 아이콘/이모지 지정"
                                        >
                                            + 커스텀 아이콘
                                        </button>
                                        <button
                                            type="button"
                                            className="skills-picker-close"
                                            onClick={() => setPickerOpenFor(null)}
                                            title="닫기"
                                            aria-label="닫기"
                                        >
                                            ✕
                                        </button>
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
                                                    onClick={() => handleToggleBadge(category, name)}
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
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillsListPage;
