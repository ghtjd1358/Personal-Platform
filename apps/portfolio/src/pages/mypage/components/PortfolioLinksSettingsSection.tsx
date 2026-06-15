import React from 'react';

interface PortfolioLinksSettingsSectionProps {
    demoUrl: string;
    githubUrl: string;
    status: 'draft' | 'published' | 'archived';
    isPublic: boolean;
    isFeatured: boolean;
    showOnResume: boolean;
    onDemoUrlChange: (value: string) => void;
    onGithubUrlChange: (value: string) => void;
    onStatusChange: (value: 'draft' | 'published' | 'archived') => void;
    onIsPublicChange: (value: boolean) => void;
    onIsFeaturedChange: (value: boolean) => void;
    onShowOnResumeChange: (value: boolean) => void;
}

const PortfolioLinksSettingsSection: React.FC<PortfolioLinksSettingsSectionProps> = ({
    demoUrl,
    githubUrl,
    status,
    isPublic,
    isFeatured,
    showOnResume,
    onDemoUrlChange,
    onGithubUrlChange,
    onStatusChange,
    onIsPublicChange,
    onIsFeaturedChange,
    onShowOnResumeChange,
}) => {
    return (
        <>
            <section className="editor-section">
                <h2>링크</h2>
                <div className="form-group">
                    <label htmlFor="demoUrl">데모 URL</label>
                    <input
                        id="demoUrl"
                        type="url"
                        value={demoUrl}
                        onChange={(e) => onDemoUrlChange(e.target.value)}
                        placeholder="https://demo.example.com"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="githubUrl">GitHub URL</label>
                    <input
                        id="githubUrl"
                        type="url"
                        value={githubUrl}
                        onChange={(e) => onGithubUrlChange(e.target.value)}
                        placeholder="https://github.com/user/repo"
                    />
                </div>
            </section>

            <section className="editor-section">
                <h2>설정</h2>
                <div className="form-group">
                    <label htmlFor="status">상태</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value as typeof status)}
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
                            onChange={(e) => onIsPublicChange(e.target.checked)}
                        />
                        공개 여부
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => onIsFeaturedChange(e.target.checked)}
                        />
                        대표 프로젝트로 표시
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showOnResume}
                            onChange={(e) => onShowOnResumeChange(e.target.checked)}
                        />
                        이력서에 노출 (체크 해제 시 resume 의 경력&프로젝트 / 주요 작업물에서 숨김)
                    </label>
                </div>
            </section>
        </>
    );
};

export default PortfolioLinksSettingsSection;
