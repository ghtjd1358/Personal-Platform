/**
 * SkillsListPage — 카테고리별 스킬 관리.
 * - 카테고리: CRUD inline edit
 * - 스킬: iconMap 전체를 badge grid 로 펼쳐 클릭-토글 (추가/제거)
 * - iconMap 에 없는 커스텀 아이콘/이모지는 "+ 커스텀 아이콘" 링크로 editor 페이지로 fallback
 */
import React, { useMemo, useState } from 'react';
import { useAsyncConfirm, usePermission, Button, EmptyState } from '@sonhoseong/mfa-lib';
import { techIconMap as iconMap } from '@sonhoseong/mfa-lib';
import type { SkillCategoryWithSkills } from '../../../network/apis/supabase';
import {
    useFetchSkillCategories,
    useCreateSkillCategory,
    useUpdateSkillCategory,
    useDeleteSkillCategory,
    useCreateSkill,
    useDeleteSkill,
} from '../../../network/hooks';
import { SkillsCategorySection } from './components';
import './Skills.editorial.css';

const SkillsListPage: React.FC = () => {
    const confirmDialog = useAsyncConfirm();
    const { isOwner } = usePermission();

    // updater 증가 = 전체 재조회 트리거 (React Query invalidate 대용)
    const [updater, setUpdater] = useState(0);
    const { categories } = useFetchSkillCategories(updater);
    const createCategory = useCreateSkillCategory();
    const updateCategory = useUpdateSkillCategory();
    const deleteCategory = useDeleteSkillCategory();
    const createSkill = useCreateSkill();
    const deleteSkill = useDeleteSkill();

    const [newCategoryName, setNewCategoryName] = useState('');
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    // picker drawer 상태
    const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null);
    const [pickerSearch, setPickerSearch] = useState('');
    const [busyBadge, setBusyBadge] = useState<string | null>(null);

    const allBadgeNames = useMemo(() => Object.keys(iconMap), []);
    const filteredBadges = useMemo(() => {
        const q = pickerSearch.trim().toLowerCase();
        if (!q) return allBadgeNames;
        return allBadgeNames.filter((n) => n.toLowerCase().includes(q));
    }, [allBadgeNames, pickerSearch]);

    const refresh = () => setUpdater((n) => n + 1);

    const handleCreateCategory = async () => {
        const name = newCategoryName.trim();
        if (!name) return;
        const res = await createCategory({ label: name, order_index: categories.length });
        if (!res) return;
        setNewCategoryName('');
        setCreatingCategory(false);
        refresh();
    };

    const handleUpdateCategory = async (id: string) => {
        const name = editingCategoryName.trim();
        if (!name) return;
        const res = await updateCategory(id, { label: name });
        if (!res) return;
        setEditingCategoryId(null);
        setEditingCategoryName('');
        refresh();
    };

    const handleDeleteCategory = async (id: string, label: string) => {
        const ok = await confirmDialog(
            `"${label}" 카테고리를 삭제할까요?\n하위 스킬도 모두 삭제됩니다.`,
            '카테고리 삭제',
        );
        if (!ok) return;
        const done = await deleteCategory(id);
        if (done) refresh();
    };

    const handleDeleteSkill = async (id: string, name: string) => {
        const ok = await confirmDialog(`"${name}" 스킬을 삭제할까요?`, '스킬 삭제');
        if (!ok) return;
        const done = await deleteSkill(id);
        if (done) refresh();
    };

    /** badge 클릭: 이미 카테고리에 있으면 제거, 없으면 추가 */
    const handleToggleBadge = async (category: SkillCategoryWithSkills, badgeName: string) => {
        const busyKey = `${category.id}::${badgeName}`;
        if (busyBadge === busyKey) return;
        setBusyBadge(busyKey);
        try {
            const existing = category.skills.find((s) => s.name === badgeName);
            if (existing) {
                const done = await deleteSkill(existing.id);
                if (!done) return;
            } else {
                const row = await createSkill({
                    category_id: category.id,
                    name: badgeName,
                    icon: badgeName,
                    icon_color: '#2B1E14',
                    order_index: category.skills.length,
                });
                if (!row) return;
            }
            refresh();
        } finally {
            setBusyBadge(null);
        }
    };

    const togglePicker = (categoryId: string) => {
        setPickerOpenFor(pickerOpenFor === categoryId ? null : categoryId);
        setPickerSearch('');
    };

    const handleStartEdit = (id: string, currentName: string) => {
        setEditingCategoryId(id);
        setEditingCategoryName(currentName);
    };

    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setEditingCategoryName('');
    };

    const isEmpty = categories.length === 0;

    return (
        <div className="admin-list-page skills-admin">
            <header className="admin-page-header skills-admin-header">
                <div>
                    <h1 className="skills-admin-title">기술스택 관리</h1>
                    <p className="skills-admin-sub">카테고리 만들고, 아래 뱃지에서 원하는 기술을 클릭해서 넣으세요.</p>
                </div>
                {!isEmpty && isOwner && (
                    <Button variant="primary" onClick={() => setCreatingCategory(true)}>
                        + 카테고리 추가
                    </Button>
                )}
            </header>

            <div className="skills-admin-info">
                <strong className="skills-admin-info-label">NOTE</strong>
                뱃지를 클릭하면 즉시 카테고리에 추가·제거돼요. 목록에 없는 기술은 카테고리별 "커스텀 아이콘"으로 수동 입력 가능.
            </div>

            {isEmpty && !creatingCategory && (
                <EmptyState
                    description={
                        isOwner
                            ? '아직 등록된 카테고리가 없습니다. 먼저 카테고리(예: 프론트엔드, 상태관리)를 만들어보세요.'
                            : '아직 등록된 카테고리가 없습니다. Owner 가 카테고리를 추가하면 여기에 표시됩니다. (열람만 가능)'
                    }
                    action={
                        isOwner ? (
                            <Button variant="primary" onClick={() => setCreatingCategory(true)}>
                                카테고리 추가
                            </Button>
                        ) : undefined
                    }
                />
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
                    <Button variant="primary" onClick={handleCreateCategory}>저장</Button>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setCreatingCategory(false);
                            setNewCategoryName('');
                        }}
                    >
                        취소
                    </Button>
                </div>
            )}

            <div className="skills-categories">
                {categories.map((category) => (
                    <SkillsCategorySection
                        key={category.id}
                        category={category}
                        isOwner={isOwner}
                        isPickerOpen={pickerOpenFor === category.id}
                        pickerSearch={pickerSearch}
                        filteredBadges={filteredBadges}
                        busyBadge={busyBadge}
                        editingCategoryId={editingCategoryId}
                        editingCategoryName={editingCategoryName}
                        onEditingNameChange={setEditingCategoryName}
                        onStartEdit={handleStartEdit}
                        onCancelEdit={handleCancelEdit}
                        onUpdateCategory={handleUpdateCategory}
                        onDeleteCategory={handleDeleteCategory}
                        onDeleteSkill={handleDeleteSkill}
                        onTogglePicker={togglePicker}
                        onPickerSearchChange={setPickerSearch}
                        onClosePicker={() => setPickerOpenFor(null)}
                        onToggleBadge={handleToggleBadge}
                    />
                ))}
            </div>
        </div>
    );
};

export default SkillsListPage;
