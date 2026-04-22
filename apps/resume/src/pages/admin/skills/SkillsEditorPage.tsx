/**
 * SkillsEditorPage — 스킬 create / edit 폼
 * URL:
 *   /admin/skills/new         (쿼리 ?category=UUID 로 카테고리 사전 선택 가능)
 *   /admin/skills/edit/:id
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useToast } from '@sonhoseong/mfa-lib';
import { iconMap } from '../../../constants/iconMap';
import { LINK_PREFIX } from '@/config/constants';
import {
    skillsApi,
    type SkillCategoryWithSkills,
} from '../../../network/apis/supabase';
import IconPicker from './IconPicker';
import './Skills.editorial.css';

const SkillsEditorPage: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams<{ id?: string }>();
    const [searchParams] = useSearchParams();
    const isEdit = Boolean(id);

    const [categories, setCategories] = useState<SkillCategoryWithSkills[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categoryId, setCategoryId] = useState<string>(searchParams.get('category') || '');
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [iconColor, setIconColor] = useState('#2B1E14');

    // 초기 로드: 카테고리 목록 + (edit 모드면) 기존 스킬 데이터
    useEffect(() => {
        (async () => {
            try {
                const cats = await skillsApi.getCategories();
                setCategories(cats);
                if (!categoryId && cats.length > 0) {
                    setCategoryId(cats[0].id);
                }

                if (isEdit && id) {
                    const { data, error } = await skillsApi.getSkillById(id);
                    if (error) throw error;
                    if (data) {
                        setName(data.name || '');
                        setIcon(data.icon || data.name || '');
                        setIconColor(data.icon_color || '#2B1E14');
                        setCategoryId(data.category_id || '');
                    }
                }
            } catch (err) {
                console.error('[SkillsEditor] 로드 실패:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, isEdit]);

    const handleSave = async () => {
        console.log('[SkillsEditor] handleSave entered', { name, categoryId, icon, iconColor, isEdit, id });
        if (!name.trim()) {
            console.warn('[SkillsEditor] blocked: empty name');
            toast.error('스킬 이름을 입력하세요.');
            return;
        }
        if (!categoryId) {
            console.warn('[SkillsEditor] blocked: empty categoryId');
            toast.error('카테고리를 선택하세요.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: name.trim(),
                icon: icon.trim() || name.trim(),
                icon_color: iconColor,
                category_id: categoryId,
            };
            console.log('[SkillsEditor] submitting', { isEdit, payload });
            if (isEdit && id) {
                const { error } = await skillsApi.updateSkill(id, payload);
                if (error) throw error;
                toast.success('스킬을 수정했어요.');
            } else {
                const { data, error } = await skillsApi.createSkill(payload);
                if (error) throw error;
                console.log('[SkillsEditor] created', data);
                toast.success('스킬을 추가했어요.');
            }
            navigate(`${LINK_PREFIX}/admin/skills`);
        } catch (err) {
            console.error('[SkillsEditor] save failed:', err);
            toast.error('저장 실패: ' + (err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    // 미리보기 아이콘
    const preview = useMemo(() => {
        if (icon && iconMap[icon]) return iconMap[icon];
        if (iconMap[name]) return iconMap[name];
        return (
            <span style={{ color: iconColor }}>{icon || '💻'}</span>
        );
    }, [icon, name, iconColor]);

    if (loading) {
        return (
            <div className="admin-editor-page skills-admin">
                <div className="skills-admin-loading">불러오는 중…</div>
            </div>
        );
    }

    return (
        <div className="admin-editor-page skills-admin">
            <header className="admin-page-header skills-admin-header">
                <button
                    type="button"
                    className="skills-btn skills-btn--ghost"
                    onClick={() => navigate(`${LINK_PREFIX}/admin/skills`)}
                >
                    ← 목록으로
                </button>
                <h1 className="skills-admin-title">
                    {isEdit ? '스킬 수정' : '새 스킬'}
                </h1>
            </header>

            {categories.length === 0 ? (
                <div className="skills-empty">
                    <p className="skills-empty-title">먼저 카테고리가 있어야 스킬을 추가할 수 있습니다.</p>
                    <button
                        className="skills-btn skills-btn--primary"
                        onClick={() => navigate(`${LINK_PREFIX}/admin/skills`)}
                    >
                        카테고리 만들러 가기
                    </button>
                </div>
            ) : (
                <form
                    className="skills-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    {/* 미리보기 */}
                    <div className="skills-form-preview">
                        <div className="skills-form-preview-icon">{preview}</div>
                        <div className="skills-form-preview-name">
                            {name || '스킬 이름'}
                        </div>
                    </div>

                    {/* 이름 */}
                    <label className="skills-form-field">
                        <span className="skills-form-label">이름</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="예: React"
                            className="skills-input"
                            required
                        />
                    </label>

                    {/* 카테고리 */}
                    <label className="skills-form-field">
                        <span className="skills-form-label">카테고리</span>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="skills-input"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* 아이콘 */}
                    <div className="skills-form-field">
                        <span className="skills-form-label">아이콘</span>
                        <IconPicker value={icon} onChange={setIcon} />
                    </div>

                    {/* 색상 (커스텀 이모지/텍스트용) */}
                    <label className="skills-form-field">
                        <span className="skills-form-label">색 (커스텀 아이콘 전용)</span>
                        <div className="skills-color-row">
                            <input
                                type="color"
                                value={iconColor}
                                onChange={(e) => setIconColor(e.target.value)}
                                className="skills-color-input"
                            />
                            <input
                                type="text"
                                value={iconColor}
                                onChange={(e) => setIconColor(e.target.value)}
                                placeholder="#2B1E14"
                                className="skills-input"
                                style={{ maxWidth: 140 }}
                            />
                        </div>
                    </label>

                    {/* 액션 */}
                    <div className="skills-form-actions">
                        <button
                            type="button"
                            className="skills-btn skills-btn--ghost"
                            onClick={() => navigate(`${LINK_PREFIX}/admin/skills`)}
                            disabled={saving}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="skills-btn skills-btn--primary"
                            disabled={saving}
                        >
                            {saving ? '저장 중…' : isEdit ? '수정 저장' : '스킬 추가'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SkillsEditorPage;
