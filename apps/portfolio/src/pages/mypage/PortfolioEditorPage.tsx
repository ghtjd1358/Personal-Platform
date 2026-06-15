/**
 * PortfolioEditorPage - 포트폴리오 생성/편집 페이지
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, useToast, EmptyState, LoadingSpinner, Button } from '@sonhoseong/mfa-lib';
import {
    createPortfolio,
    updatePortfolio,
    getPortfolioById,
    uploadImage,
    CreatePortfolioRequest,
} from '@/network';
import { LINK_PREFIX, UPLOAD_CONFIG } from '@/config/constants';
import {
    PortfolioBasicSection,
    PortfolioDetailSection,
    PortfolioTechTagsSection,
    PortfolioLinksSettingsSection,
    PortfolioPreview,
} from './components';

interface TechStackItem {
    name: string;
    icon?: string;
    icon_color?: string;
}

// API 응답의 태그 타입 (객체 또는 문자열)
type TagItem = { tag: string } | string;

const PortfolioEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const currentUser = getCurrentUser();

    const isEditing = !!id;

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [badge, setBadge] = useState('');
    const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const [showOnResume, setShowOnResume] = useState(true);
    const [demoUrl, setDemoUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');

    // Detail state
    const [role, setRole] = useState('');
    const [teamSize, setTeamSize] = useState('');
    const [duration, setDuration] = useState('');
    const [period, setPeriod] = useState('');
    const [overview, setOverview] = useState('');
    const [challenge, setChallenge] = useState('');
    const [solution, setSolution] = useState('');
    const [outcome, setOutcome] = useState('');

    // Tags & Tech
    const [tagsInput, setTagsInput] = useState('');
    const [techStack, setTechStack] = useState<TechStackItem[]>([]);
    const [newTechName, setNewTechName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && id) {
            loadPortfolio(id);
        }
    }, [id, isEditing]);

    const loadPortfolio = async (portfolioId: string) => {
        setIsLoading(true);
        const result = await getPortfolioById(portfolioId);
        if (result.success && result.data) {
            const p = result.data;
            setTitle(p.title || '');
            setSlug(p.slug || '');
            setShortDescription(p.short_description || '');
            setDescription(p.description || '');
            setCoverImage(p.cover_image || '');
            setBadge(p.badge || '');
            setStatus(p.status || 'draft');
            setIsFeatured(p.is_featured || false);
            setIsPublic(p.is_public !== false);
            setShowOnResume(p.show_on_resume !== false);
            setDemoUrl(p.demo_url || '');
            setGithubUrl(p.github_url || '');

            if (p.detail) {
                setRole(p.detail.role || '');
                setTeamSize(p.detail.team_size?.toString() || '');
                setDuration(p.detail.duration || '');
                setPeriod(p.detail.period || '');
                setOverview(p.detail.overview || '');
                setChallenge(p.detail.challenge || '');
                setSolution(p.detail.solution || '');
                setOutcome(p.detail.outcome || '');
            }

            if (p.tags && p.tags.length > 0) {
                setTagsInput(p.tags.map((t: TagItem) => typeof t === 'string' ? t : t.tag).join(', '));
            }

            if (p.techStack && p.techStack.length > 0) {
                setTechStack(p.techStack.map((t: TechStackItem) => ({
                    name: t.name,
                    icon: t.icon,
                    icon_color: t.icon_color,
                })));
            }
        } else {
            toast.error('포트폴리오를 불러올 수 없습니다.');
            navigate(`${LINK_PREFIX}/mypage`);
        }
        setIsLoading(false);
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9가-힣\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 100);
    };

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!isEditing && !slug) {
            setSlug(generateSlug(value) + '-' + Date.now().toString(36));
        }
    };

    const addTechStack = () => {
        if (newTechName.trim()) {
            setTechStack([...techStack, { name: newTechName.trim() }]);
            setNewTechName('');
        }
    };

    const removeTechStack = (index: number) => {
        setTechStack(techStack.filter((_, i) => i !== index));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > UPLOAD_CONFIG.maxImageSize) {
            toast.error(`이미지 크기는 ${UPLOAD_CONFIG.maxImageSize / (1024 * 1024)}MB 이하여야 합니다.`);
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('이미지 파일만 업로드 가능합니다.');
            return;
        }

        setIsUploading(true);
        const result = await uploadImage(file, 'portfolio');
        setIsUploading(false);

        if (result.success && result.data) {
            setCoverImage(result.data.url);
            toast.success('이미지가 업로드되었습니다.');
        } else {
            toast.error(result.error || '이미지 업로드에 실패했습니다.');
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('제목을 입력해주세요.');
            return;
        }

        if (!slug.trim()) {
            toast.error('슬러그를 입력해주세요.');
            return;
        }

        setIsSaving(true);

        const tags = tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t);

        const portfolioData: CreatePortfolioRequest = {
            title: title.trim(),
            slug: slug.trim(),
            description: description.trim() || undefined,
            short_description: shortDescription.trim() || undefined,
            cover_image: coverImage.trim() || undefined,
            badge: badge.trim() || undefined,
            status,
            is_featured: isFeatured,
            is_public: isPublic,
            show_on_resume: showOnResume,
            demo_url: demoUrl.trim() || undefined,
            github_url: githubUrl.trim() || undefined,
            detail: {
                role: role.trim() || undefined,
                team_size: teamSize ? parseInt(teamSize) : undefined,
                duration: duration.trim() || undefined,
                period: period.trim() || undefined,
                overview: overview.trim() || undefined,
                challenge: challenge.trim() || undefined,
                solution: solution.trim() || undefined,
                outcome: outcome.trim() || undefined,
            },
            tags: tags.length > 0 ? tags : undefined,
            techStack: techStack.length > 0 ? techStack : undefined,
        };

        let result;
        if (isEditing && id) {
            result = await updatePortfolio({ id, ...portfolioData });
        } else {
            result = await createPortfolio(portfolioData);
        }

        setIsSaving(false);

        if (result.success) {
            toast.success(isEditing ? '포트폴리오가 수정되었습니다.' : '포트폴리오가 생성되었습니다.');
            navigate(`${LINK_PREFIX}/mypage`);
        } else {
            toast.error(result.error || '저장에 실패했습니다.');
        }
    };

    if (!currentUser) {
        return (
            <div className="editor-container">
                <EmptyState description="로그인이 필요합니다." />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="editor-container">
                <LoadingSpinner message="불러오는 중" />
            </div>
        );
    }

    return (
        <div className="editor-container editor-split-layout">
            {/* 왼쪽: 폼 영역 */}
            <form onSubmit={handleSubmit} className="editor-form">
                <div className="editor-header">
                    <h1>{isEditing ? '포트폴리오 편집' : '새 포트폴리오'}</h1>
                    <div className="editor-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            className="btn-secondary"
                            onClick={() => navigate(`${LINK_PREFIX}/mypage`)}
                            disabled={isSaving}
                        >
                            취소
                        </Button>
                        <Button type="submit" variant="primary" className="btn-primary" disabled={isSaving} loading={isSaving}>
                            {isSaving ? '저장 중...' : isEditing ? '수정' : '생성'}
                        </Button>
                    </div>
                </div>

                <div className="editor-content">
                    <PortfolioBasicSection
                        title={title}
                        slug={slug}
                        badge={badge}
                        shortDescription={shortDescription}
                        description={description}
                        coverImage={coverImage}
                        isUploading={isUploading}
                        fileInputRef={fileInputRef}
                        onTitleChange={handleTitleChange}
                        onSlugChange={setSlug}
                        onBadgeChange={setBadge}
                        onShortDescriptionChange={setShortDescription}
                        onDescriptionChange={setDescription}
                        onCoverImageChange={setCoverImage}
                        onImageUpload={handleImageUpload}
                    />

                    <PortfolioDetailSection
                        role={role}
                        teamSize={teamSize}
                        period={period}
                        duration={duration}
                        overview={overview}
                        challenge={challenge}
                        solution={solution}
                        outcome={outcome}
                        onRoleChange={setRole}
                        onTeamSizeChange={setTeamSize}
                        onPeriodChange={setPeriod}
                        onDurationChange={setDuration}
                        onOverviewChange={setOverview}
                        onChallengeChange={setChallenge}
                        onSolutionChange={setSolution}
                        onOutcomeChange={setOutcome}
                    />

                    <PortfolioTechTagsSection
                        techStack={techStack}
                        newTechName={newTechName}
                        tagsInput={tagsInput}
                        onNewTechNameChange={setNewTechName}
                        onAddTechStack={addTechStack}
                        onRemoveTechStack={removeTechStack}
                        onTagsInputChange={setTagsInput}
                    />

                    <PortfolioLinksSettingsSection
                        demoUrl={demoUrl}
                        githubUrl={githubUrl}
                        status={status}
                        isPublic={isPublic}
                        isFeatured={isFeatured}
                        showOnResume={showOnResume}
                        onDemoUrlChange={setDemoUrl}
                        onGithubUrlChange={setGithubUrl}
                        onStatusChange={setStatus}
                        onIsPublicChange={setIsPublic}
                        onIsFeaturedChange={setIsFeatured}
                        onShowOnResumeChange={setShowOnResume}
                    />
                </div>
            </form>

            {/* 오른쪽: 실시간 미리보기 */}
            <PortfolioPreview
                title={title}
                shortDescription={shortDescription}
                coverImage={coverImage}
                badge={badge}
                isFeatured={isFeatured}
                techStack={techStack}
                role={role}
                period={period}
                teamSize={teamSize}
                demoUrl={demoUrl}
                githubUrl={githubUrl}
                description={description}
            />
        </div>
    );
};

export default PortfolioEditorPage;
