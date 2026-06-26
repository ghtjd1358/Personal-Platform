import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser, useToast, EmptyState, Button, useImageUpload, useEditorImageUploader } from '@sonhoseong/mfa-lib';
import { CreatePortfolioRequest } from '@/network';
import {
    useFetchPortfolioById,
    useCreatePortfolio,
    useUpdatePortfolio,
    useUploadImage,
} from '@/network/hooks';
import { usePortfolioForm, INITIAL_FORM_DATA } from '@/hooks/usePortfolioForm';
import { LINK_PREFIX, UPLOAD_CONFIG } from '@/config/constants';
import {
    PortfolioBasicSection,
    PortfolioDetailSection,
    PortfolioTechTagsSection,
    PortfolioLinksSettingsSection,
    PortfolioPreview,
} from './components';

type TagItem = { tag: string } | string;

const PortfolioEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const currentUser = useCurrentUser();
    const isEditing = !!id;

    const { formData, setFormData, updateField, addTechStack, removeTechStack, generateSlug } =
        usePortfolioForm();

    const [newTechName, setNewTechName] = useState('');

    const { detail } = useFetchPortfolioById(id);
    const createPortfolioFn = useCreatePortfolio();
    const updatePortfolioFn = useUpdatePortfolio();
    const uploadImageFn = useUploadImage();

    // useImageUpload — uploadImageFn 결과({url} | null) 받아 coverImage field set.
    const { isUploading, inputRef: fileInputRef, handleFileChange: handleImageUpload } = useImageUpload({
        uploader: (file) => uploadImageFn(file, 'portfolio'),
        maxSizeBytes: UPLOAD_CONFIG.maxImageSize,
        onSuccess: (result) => {
            if (result) {
                updateField('coverImage', result.url);
                toast.success('이미지가 업로드되었습니다.');
            }
        },
        onError: (msg) => toast.error(msg),
    });

    // TiptapEditor uploader contract — lib useEditorImageUploader 위임
    const handleDescriptionUpload = useEditorImageUploader({
        uploader: (file) => uploadImageFn(file, 'portfolio'),
        extractUrl: (r) => (r === false ? null : r.url),
        maxSizeBytes: UPLOAD_CONFIG.maxImageSize,
        onError: (msg) => toast.error(msg),
    });

    useEffect(() => {
        if (!detail) return;
        setFormData({
            ...INITIAL_FORM_DATA,
            title: detail.title ?? '',
            slug: detail.slug ?? '',
            shortDescription: detail.short_description ?? '',
            description: detail.description ?? '',
            coverImage: detail.cover_image ?? '',
            badge: detail.badge ?? '',
            status: detail.status ?? 'draft',
            isFeatured: detail.is_featured ?? false,
            isPublic: detail.is_public !== false,
            showOnResume: detail.show_on_resume !== false,
            demoUrl: detail.demo_url ?? '',
            githubUrl: detail.github_url ?? '',
            role: detail.detail?.role ?? '',
            teamSize: detail.detail?.team_size?.toString() ?? '',
            duration: detail.detail?.duration ?? '',
            period: detail.detail?.period ?? '',
            overview: detail.detail?.overview ?? '',
            challenge: detail.detail?.challenge ?? '',
            solution: detail.detail?.solution ?? '',
            outcome: detail.detail?.outcome ?? '',
            tagsInput: detail.tags?.length
                ? detail.tags.map((t: TagItem) => (typeof t === 'string' ? t : t.tag)).join(', ')
                : '',
            techStack: detail.techStack?.map((t) => ({
                name: t.name,
                icon: t.icon ?? undefined,
                icon_color: t.icon_color ?? undefined,
            })) ?? [],
        });
    }, [detail, setFormData]);

    const handleTitleChange = (value: string) => {
        updateField('title', value);
        if (!isEditing && !formData.slug) {
            updateField('slug', generateSlug(value) + '-' + Date.now().toString(36));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return toast.error('제목을 입력해주세요.');
        if (!formData.slug.trim()) return toast.error('슬러그를 입력해주세요.');

        const tags = formData.tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

        const payload: CreatePortfolioRequest = {
            title: formData.title.trim(),
            slug: formData.slug.trim(),
            description: formData.description.trim() || undefined,
            short_description: formData.shortDescription.trim() || undefined,
            cover_image: formData.coverImage.trim() || undefined,
            badge: formData.badge.trim() || undefined,
            status: formData.status,
            is_featured: formData.isFeatured,
            is_public: formData.isPublic,
            show_on_resume: formData.showOnResume,
            demo_url: formData.demoUrl.trim() || undefined,
            github_url: formData.githubUrl.trim() || undefined,
            detail: {
                role: formData.role.trim() || undefined,
                team_size: formData.teamSize ? parseInt(formData.teamSize) : undefined,
                duration: formData.duration.trim() || undefined,
                period: formData.period.trim() || undefined,
                overview: formData.overview.trim() || undefined,
                challenge: formData.challenge.trim() || undefined,
                solution: formData.solution.trim() || undefined,
                outcome: formData.outcome.trim() || undefined,
            },
            tags: tags.length > 0 ? tags : undefined,
            techStack: formData.techStack.length > 0 ? formData.techStack : undefined,
        };

        const result = isEditing && id
            ? await updatePortfolioFn(id, payload)
            : await createPortfolioFn(payload);

        if (result) navigate(`${LINK_PREFIX}/mypage`);
    };

    if (!currentUser) {
        return (
            <div className="editor-container">
                <EmptyState description="로그인이 필요합니다." />
            </div>
        );
    }

    return (
        <div className="editor-container editor-split-layout">
            <form onSubmit={handleSubmit} className="editor-form">
                <div className="editor-header">
                    <h1>{isEditing ? '포트폴리오 편집' : '새 포트폴리오'}</h1>
                    <div className="editor-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            className="btn-secondary"
                            onClick={() => navigate(`${LINK_PREFIX}/mypage`)}
                        >
                            취소
                        </Button>
                        <Button type="submit" variant="primary" className="btn-primary">
                            {isEditing ? '수정' : '생성'}
                        </Button>
                    </div>
                </div>

                <div className="editor-content">
                    <PortfolioBasicSection
                        title={formData.title}
                        slug={formData.slug}
                        badge={formData.badge}
                        shortDescription={formData.shortDescription}
                        description={formData.description}
                        coverImage={formData.coverImage}
                        isUploading={isUploading}
                        fileInputRef={fileInputRef}
                        descriptionUploader={handleDescriptionUpload}
                        onTitleChange={handleTitleChange}
                        onSlugChange={(v) => updateField('slug', v)}
                        onBadgeChange={(v) => updateField('badge', v)}
                        onShortDescriptionChange={(v) => updateField('shortDescription', v)}
                        onDescriptionChange={(v) => updateField('description', v)}
                        onCoverImageChange={(v) => updateField('coverImage', v)}
                        onImageUpload={handleImageUpload}
                    />

                    <PortfolioDetailSection
                        role={formData.role}
                        teamSize={formData.teamSize}
                        period={formData.period}
                        duration={formData.duration}
                        overview={formData.overview}
                        challenge={formData.challenge}
                        solution={formData.solution}
                        outcome={formData.outcome}
                        onRoleChange={(v) => updateField('role', v)}
                        onTeamSizeChange={(v) => updateField('teamSize', v)}
                        onPeriodChange={(v) => updateField('period', v)}
                        onDurationChange={(v) => updateField('duration', v)}
                        onOverviewChange={(v) => updateField('overview', v)}
                        onChallengeChange={(v) => updateField('challenge', v)}
                        onSolutionChange={(v) => updateField('solution', v)}
                        onOutcomeChange={(v) => updateField('outcome', v)}
                    />

                    <PortfolioTechTagsSection
                        techStack={formData.techStack}
                        newTechName={newTechName}
                        tagsInput={formData.tagsInput}
                        onNewTechNameChange={setNewTechName}
                        onAddTechStack={() => {
                            addTechStack(newTechName);
                            setNewTechName('');
                        }}
                        onRemoveTechStack={removeTechStack}
                        onTagsInputChange={(v) => updateField('tagsInput', v)}
                    />

                    <PortfolioLinksSettingsSection
                        demoUrl={formData.demoUrl}
                        githubUrl={formData.githubUrl}
                        status={formData.status}
                        isPublic={formData.isPublic}
                        isFeatured={formData.isFeatured}
                        showOnResume={formData.showOnResume}
                        onDemoUrlChange={(v) => updateField('demoUrl', v)}
                        onGithubUrlChange={(v) => updateField('githubUrl', v)}
                        onStatusChange={(v) => updateField('status', v)}
                        onIsPublicChange={(v) => updateField('isPublic', v)}
                        onIsFeaturedChange={(v) => updateField('isFeatured', v)}
                        onShowOnResumeChange={(v) => updateField('showOnResume', v)}
                    />
                </div>
            </form>

            <PortfolioPreview
                title={formData.title}
                shortDescription={formData.shortDescription}
                coverImage={formData.coverImage}
                badge={formData.badge}
                isFeatured={formData.isFeatured}
                techStack={formData.techStack}
                role={formData.role}
                period={formData.period}
                teamSize={formData.teamSize}
                demoUrl={formData.demoUrl}
                githubUrl={formData.githubUrl}
                description={formData.description}
            />
        </div>
    );
};

export default PortfolioEditorPage;
