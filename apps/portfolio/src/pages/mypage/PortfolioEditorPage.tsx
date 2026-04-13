/**
 * PortfolioEditorPage - 포트폴리오 생성/편집 페이지
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, useToast } from '@sonhoseong/mfa-lib';
import {
    createPortfolio,
    updatePortfolio,
    getPortfolioById,
    uploadImage,
    CreatePortfolioRequest,
} from '@/network';
import { LINK_PREFIX, UPLOAD_CONFIG } from '@/config/constants';
import TiptapEditor from '@/components/TiptapEditor';

interface TechStackItem {
    name: string;
    icon?: string;
    icon_color?: string;
}

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
                setTagsInput(p.tags.map((t: any) => t.tag || t).join(', '));
            }

            if (p.techStack && p.techStack.length > 0) {
                setTechStack(p.techStack.map((t: any) => ({
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

        // 파일 크기 체크
        if (file.size > UPLOAD_CONFIG.maxImageSize) {
            toast.error(`이미지 크기는 ${UPLOAD_CONFIG.maxImageSize / (1024 * 1024)}MB 이하여야 합니다.`);
            return;
        }

        // 이미지 타입 체크
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

        // 입력 초기화
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
                <div className="editor-empty">로그인이 필요합니다.</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="editor-container">
                <div className="editor-loading">
                    <div className="spinner-large" />
                </div>
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
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate(`${LINK_PREFIX}/mypage`)}
                            disabled={isSaving}
                        >
                            취소
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? '저장 중...' : isEditing ? '수정' : '생성'}
                        </button>
                    </div>
                </div>

                <div className="editor-content">
                    {/* 기본 정보 */}
                    <section className="editor-section">
                        <h2>기본 정보</h2>
                        <div className="form-group">
                            <label htmlFor="title">제목 *</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="프로젝트 제목"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="slug">슬러그 *</label>
                                <input
                                    id="slug"
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="url-friendly-slug"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="badge">배지</label>
                                <input
                                    id="badge"
                                    type="text"
                                    value={badge}
                                    onChange={(e) => setBadge(e.target.value)}
                                    placeholder="예: 개인, 팀, 회사"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="shortDescription">짧은 설명</label>
                            <input
                                id="shortDescription"
                                type="text"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                placeholder="한 줄 요약"
                                maxLength={200}
                            />
                        </div>

                        <div className="form-group">
                            <label>상세 설명 (HTML 에디터)</label>
                            <TiptapEditor
                                content={description}
                                onChange={setDescription}
                                placeholder="프로젝트에 대한 상세 설명을 작성하세요..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="coverImage">커버 이미지</label>
                            <div className="cover-upload-area">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    id="coverImageFile"
                                />
                                <button
                                    type="button"
                                    className="btn-upload"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? '업로드 중...' : '이미지 선택'}
                                </button>
                                <span className="upload-hint">또는 URL 직접 입력</span>
                            </div>
                            <input
                                id="coverImage"
                                type="url"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                            {coverImage && (
                                <div className="cover-preview">
                                    <img src={coverImage} alt="미리보기" />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 프로젝트 정보 */}
                    <section className="editor-section">
                        <h2>프로젝트 정보</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="role">역할</label>
                                <input
                                    id="role"
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="예: 풀스택 개발"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="teamSize">팀 규모</label>
                                <input
                                    id="teamSize"
                                    type="number"
                                    value={teamSize}
                                    onChange={(e) => setTeamSize(e.target.value)}
                                    placeholder="1"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="period">기간</label>
                                <input
                                    id="period"
                                    type="text"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    placeholder="예: 2024.01 - 2024.03"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="duration">소요 기간</label>
                                <input
                                    id="duration"
                                    type="text"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="예: 3개월"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="overview">개요</label>
                            <textarea
                                id="overview"
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                placeholder="프로젝트 개요"
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="challenge">도전 과제</label>
                            <textarea
                                id="challenge"
                                value={challenge}
                                onChange={(e) => setChallenge(e.target.value)}
                                placeholder="프로젝트에서 겪은 도전 과제"
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="solution">해결 방법</label>
                            <textarea
                                id="solution"
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                placeholder="도전 과제를 어떻게 해결했는지"
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="outcome">결과</label>
                            <textarea
                                id="outcome"
                                value={outcome}
                                onChange={(e) => setOutcome(e.target.value)}
                                placeholder="프로젝트의 결과 및 성과"
                                rows={3}
                            />
                        </div>
                    </section>

                    {/* 기술 스택 */}
                    <section className="editor-section">
                        <h2>기술 스택</h2>
                        <div className="tech-stack-input">
                            <input
                                type="text"
                                value={newTechName}
                                onChange={(e) => setNewTechName(e.target.value)}
                                placeholder="기술 이름 (예: React)"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                            />
                            <button type="button" onClick={addTechStack} className="btn-add">
                                추가
                            </button>
                        </div>
                        {techStack.length > 0 && (
                            <div className="tech-stack-list">
                                {techStack.map((tech, index) => (
                                    <span key={index} className="tech-tag">
                                        {tech.name}
                                        <button type="button" onClick={() => removeTechStack(index)}>×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* 태그 */}
                    <section className="editor-section">
                        <h2>태그</h2>
                        <div className="form-group">
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="쉼표로 구분 (예: 웹, 모바일, AI)"
                            />
                        </div>
                    </section>

                    {/* 링크 */}
                    <section className="editor-section">
                        <h2>링크</h2>
                        <div className="form-group">
                            <label htmlFor="demoUrl">데모 URL</label>
                            <input
                                id="demoUrl"
                                type="url"
                                value={demoUrl}
                                onChange={(e) => setDemoUrl(e.target.value)}
                                placeholder="https://demo.example.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="githubUrl">GitHub URL</label>
                            <input
                                id="githubUrl"
                                type="url"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                placeholder="https://github.com/user/repo"
                            />
                        </div>
                    </section>

                    {/* 설정 */}
                    <section className="editor-section">
                        <h2>설정</h2>
                        <div className="form-group">
                            <label htmlFor="status">상태</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as typeof status)}
                            >
                                <option value="draft">임시저장</option>
                                <option value="published">공개</option>
                                <option value="archived">보관</option>
                            </select>
                        </div>

                        <div className="form-checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                공개 여부
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                />
                                대표 프로젝트로 표시
                            </label>
                        </div>
                    </section>
                </div>
            </form>

            {/* 오른쪽: 실시간 미리보기 */}
            <div className="editor-preview">
                <div className="preview-header">
                    <h2>미리보기</h2>
                    <span className="preview-badge">실시간</span>
                </div>
                <div className="preview-card">
                    {/* 커버 이미지 */}
                    <div className="preview-cover">
                        {coverImage ? (
                            <img src={coverImage} alt={title || '미리보기'} />
                        ) : (
                            <div className="preview-cover-placeholder">
                                <span>{badge || '🚀'}</span>
                            </div>
                        )}
                        {isFeatured && (
                            <span className="preview-featured-badge">Featured</span>
                        )}
                    </div>

                    {/* 콘텐츠 */}
                    <div className="preview-content">
                        <h3 className="preview-title">
                            {title || '프로젝트 제목'}
                        </h3>

                        <p className="preview-desc">
                            {shortDescription || '한 줄 요약이 여기에 표시됩니다.'}
                        </p>

                        {/* 기술 스택 */}
                        {techStack.length > 0 && (
                            <div className="preview-tech">
                                {techStack.map((tech, index) => (
                                    <span key={index} className="preview-tech-tag">
                                        {tech.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 프로젝트 정보 */}
                        <div className="preview-meta">
                            {role && (
                                <div className="preview-meta-item">
                                    <span className="meta-label">역할</span>
                                    <span className="meta-value">{role}</span>
                                </div>
                            )}
                            {period && (
                                <div className="preview-meta-item">
                                    <span className="meta-label">기간</span>
                                    <span className="meta-value">{period}</span>
                                </div>
                            )}
                            {teamSize && (
                                <div className="preview-meta-item">
                                    <span className="meta-label">팀 규모</span>
                                    <span className="meta-value">{teamSize}명</span>
                                </div>
                            )}
                        </div>

                        {/* 링크 */}
                        <div className="preview-links">
                            {demoUrl && (
                                <span className="preview-link demo">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                    Demo
                                </span>
                            )}
                            {githubUrl && (
                                <span className="preview-link github">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    GitHub
                                </span>
                            )}
                        </div>

                        {/* 상세 설명 미리보기 */}
                        {description && (
                            <div className="preview-description">
                                <h4>상세 설명</h4>
                                <div
                                    className="preview-description-content"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioEditorPage;
