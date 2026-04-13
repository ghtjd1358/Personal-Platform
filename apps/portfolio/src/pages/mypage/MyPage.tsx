/**
 * MyPage - 포트폴리오 관리 페이지
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, useConfirmModal, useToast } from '@sonhoseong/mfa-lib';
import { getMyPortfolios, deletePortfolio, PortfolioSummary } from '@/network';
import { LINK_PREFIX } from '@/config/constants';

const MyPage: React.FC = () => {
    const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();
    const confirmModal = useConfirmModal();

    const currentUser = getCurrentUser();

    useEffect(() => {
        if (currentUser?.id) {
            loadPortfolios();
        }
    }, [currentUser?.id]);

    const loadPortfolios = async () => {
        if (!currentUser?.id) return;

        setIsLoading(true);
        const result = await getMyPortfolios(currentUser.id);
        if (result.success && result.data) {
            setPortfolios(result.data);
        }
        setIsLoading(false);
    };

    const handleDelete = async (portfolio: PortfolioSummary) => {
        const confirmed = await confirmModal.show({
            title: '포트폴리오 삭제',
            message: `"${portfolio.title}"을(를) 삭제하시겠습니까?\n삭제된 항목은 복구할 수 없습니다.`,
            confirmText: '삭제',
            cancelText: '취소',
        });

        if (confirmed) {
            const result = await deletePortfolio(portfolio.id);
            if (result.success) {
                toast.success('포트폴리오가 삭제되었습니다.');
                loadPortfolios();
            } else {
                toast.error(result.error || '삭제에 실패했습니다.');
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            published: { label: '공개', className: 'badge-published' },
            draft: { label: '임시저장', className: 'badge-draft' },
            archived: { label: '보관', className: 'badge-archived' },
        };
        return statusMap[status] || { label: status, className: '' };
    };

    if (!currentUser) {
        return (
            <div className="mypage-container">
                <div className="mypage-empty">
                    <p>로그인이 필요합니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mypage-container">
            <div className="mypage-header">
                <h1>내 포트폴리오</h1>
                <Link to={`${LINK_PREFIX}/mypage/new`} className="btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    새 프로젝트
                </Link>
            </div>

            {isLoading ? (
                <div className="mypage-loading">
                    <div className="spinner-large" />
                </div>
            ) : portfolios.length === 0 ? (
                <div className="mypage-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <p>아직 등록된 포트폴리오가 없습니다.</p>
                    <Link to={`${LINK_PREFIX}/mypage/new`} className="btn-primary">
                        첫 프로젝트 추가하기
                    </Link>
                </div>
            ) : (
                <div className="portfolio-list">
                    {portfolios.map((portfolio) => {
                        const status = getStatusBadge(portfolio.status || 'draft');
                        return (
                            <div key={portfolio.id} className="portfolio-item">
                                <div className="portfolio-thumbnail">
                                    {portfolio.cover_image ? (
                                        <img src={portfolio.cover_image} alt={portfolio.title} />
                                    ) : (
                                        <div className="thumbnail-placeholder">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="portfolio-info">
                                    <div className="portfolio-title-row">
                                        <h3>{portfolio.title}</h3>
                                        <span className={`status-badge ${status.className}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <p className="portfolio-desc">
                                        {portfolio.short_description || portfolio.description || '설명 없음'}
                                    </p>
                                    {portfolio.techStack && portfolio.techStack.length > 0 && (
                                        <div className="portfolio-tech">
                                            {portfolio.techStack.slice(0, 5).map((tech, idx) => (
                                                <span key={idx} className="tech-tag">{tech.name}</span>
                                            ))}
                                            {portfolio.techStack.length > 5 && (
                                                <span className="tech-more">+{portfolio.techStack.length - 5}</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="portfolio-meta">
                                        <span className="meta-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            {portfolio.view_count || 0}
                                        </span>
                                        <span className="meta-item">
                                            {new Date(portfolio.created_at).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>
                                </div>
                                <div className="portfolio-actions">
                                    <Link
                                        to={`${LINK_PREFIX}/project/${portfolio.slug}`}
                                        className="btn-icon"
                                        title="보기"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </Link>
                                    <Link
                                        to={`${LINK_PREFIX}/mypage/edit/${portfolio.id}`}
                                        className="btn-icon"
                                        title="편집"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </Link>
                                    <button
                                        className="btn-icon btn-danger"
                                        onClick={() => handleDelete(portfolio)}
                                        title="삭제"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyPage;
