import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, useToast } from '@sonhoseong/mfa-lib';
import { resumesApi, experiencesApi, portfoliosApi } from '@/network';
import type { ResumeProfile, ExperienceItem, ProjectItem } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';
import '@/styles/admin.css';

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const accessToken = useSelector((state: any) => state.app?.accessToken);
  const user = getCurrentUser();

  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // UUID 형식 검증 함수
  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // 데이터 로드
  useEffect(() => {
    if (!accessToken) {
      navigate(`${LINK_PREFIX}/login`);
      return;
    }

    const loadData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      // UUID 형식 검증 - 잘못된 ID면 재로그인 유도
      if (!isValidUUID(user.id)) {
        console.error('Invalid user ID format. Please re-login.');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        navigate(`${LINK_PREFIX}/login`);
        return;
      }

      try {
        setIsLoading(true);

        const resumeData = await resumesApi.getMyResume(user.id);
        setResume(resumeData);

        const { data: expData } = await experiencesApi.getByUserId(user.id);
        setExperiences((expData || []) as ExperienceItem[]);

        const { data: projData } = await portfoliosApi.getByUserId(user.id);
        setProjects((projData || []) as ProjectItem[]);
      } catch (err: any) {
        console.error('Failed to load my page data:', err?.message || err?.code || err);
        // 인증 오류가 아닌 경우에만 토스트 표시
        if (err?.code !== 'PGRST301') {
          toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [accessToken, user?.id, navigate]); // toast 제거 - 무한루프 방지

  // 공개/비공개 토글
  const handleToggleVisibility = async () => {
    if (!resume) return;

    try {
      setIsSaving(true);
      const newVisibility = resume.visibility === 'public' ? 'private' : 'public';
      await resumesApi.update(resume.id, { visibility: newVisibility });
      setResume({ ...resume, visibility: newVisibility });
      toast.success(newVisibility === 'public' ? '이력서가 공개되었습니다.' : '이력서가 비공개로 설정되었습니다.');
    } catch (err) {
      console.error('Failed to update visibility:', err);
      toast.error('설정 변경에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${year}.${month}`;
  };

  const formatPeriod = (startDate: string | null, endDate: string | null, isCurrent: boolean) => {
    const start = formatDate(startDate);
    const end = isCurrent ? '현재' : formatDate(endDate);
    if (!start && !end) return '';
    return `${start} ~ ${end}`;
  };

  if (!accessToken) {
    return null;
  }

  if (isLoading) {
    return <div className="admin-loading"><p>로딩 중...</p></div>;
  }

  return (
    <div className="admin-list-page">
      <header className="admin-page-header">
        <div className="admin-page-header-left">
          <h1>마이페이지</h1>
          <p>내 이력서를 관리하세요</p>
        </div>
        <div className="admin-page-header-right">
          {resume ? (
            <>
              <button
                onClick={handleToggleVisibility}
                disabled={isSaving}
                className={`admin-btn ${resume.visibility === 'public' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              >
                {resume.visibility === 'public' ? '공개 중' : '비공개'}
              </button>
              <Link to={`${LINK_PREFIX}/mypage/edit`} className="admin-btn admin-btn-primary">
                이력서 수정
              </Link>
            </>
          ) : (
            <Link to={`${LINK_PREFIX}/mypage/write`} className="admin-btn admin-btn-primary">
              이력서 만들기
            </Link>
          )}
        </div>
      </header>

      {!resume ? (
        <div className="admin-empty">
          <p>아직 이력서가 없습니다.</p>
          <Link to={`${LINK_PREFIX}/mypage/write`} className="admin-btn admin-btn-primary">
            이력서 만들기
          </Link>
        </div>
      ) : (
        <>
          {/* 프로필 카드 */}
          <div className="admin-card-grid" style={{ marginBottom: '32px' }}>
            <div className="admin-card" style={{ cursor: 'default' }}>
              <div className="admin-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>{resume.title || '직함 없음'}</h3>
              <p>{resume.summary || '자기소개가 없습니다.'}</p>
              {resume.visibility === 'public' && (
                <span className="admin-badge admin-badge-success" style={{ marginLeft: 0, marginTop: '12px' }}>
                  공개됨
                </span>
              )}
            </div>

            {resume.contact_email && (
              <div className="admin-card" style={{ cursor: 'default' }}>
                <div className="admin-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h3>이메일</h3>
                <p>{resume.contact_email}</p>
              </div>
            )}

            {resume.github && (
              <a href={resume.github} target="_blank" rel="noopener noreferrer" className="admin-card">
                <div className="admin-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <h3>GitHub</h3>
                <p>프로필 보기</p>
              </a>
            )}

            {resume.blog && (
              <a href={resume.blog} target="_blank" rel="noopener noreferrer" className="admin-card">
                <div className="admin-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3>블로그</h3>
                <p>블로그 방문</p>
              </a>
            )}
          </div>

          {/* 경력 섹션 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>
              경력 & 교육
              <span className="admin-badge admin-badge-secondary">{experiences.length}</span>
            </h2>
            <Link to={`${LINK_PREFIX}/admin/experience`} className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              관리
            </Link>
          </div>

          {experiences.length === 0 ? (
            <div className="admin-empty" style={{ marginBottom: '32px' }}>
              <p>등록된 경력/교육이 없습니다.</p>
              <Link to={`${LINK_PREFIX}/admin/experience/new`} className="admin-btn admin-btn-primary">
                추가하기
              </Link>
            </div>
          ) : (
            <div className="admin-table-container" style={{ marginBottom: '32px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>회사/기관</th>
                    <th>직책</th>
                    <th>기간</th>
                    <th>구분</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((exp) => (
                    <tr key={exp.id}>
                      <td className="admin-table-title">{exp.company}</td>
                      <td>{exp.position}</td>
                      <td className="admin-table-date">{formatPeriod(exp.start_date, exp.end_date, exp.is_current)}</td>
                      <td>
                        {exp.is_dev ? (
                          <span className="admin-badge admin-badge-primary">개발</span>
                        ) : (
                          <span className="admin-badge admin-badge-secondary">비개발</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 프로젝트 섹션 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>
              프로젝트
              <span className="admin-badge admin-badge-secondary">{projects.length}</span>
            </h2>
            <Link to={`${LINK_PREFIX}/admin/projects`} className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              관리
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="admin-empty">
              <p>등록된 프로젝트가 없습니다.</p>
              <Link to={`${LINK_PREFIX}/admin/projects/new`} className="admin-btn admin-btn-primary">
                추가하기
              </Link>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>프로젝트명</th>
                    <th>역할</th>
                    <th>기간</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => (
                    <tr key={proj.id}>
                      <td className="admin-table-title">{proj.title}</td>
                      <td>{proj.role}</td>
                      <td className="admin-table-date">{formatPeriod(proj.start_date, proj.end_date, proj.is_current)}</td>
                      <td>
                        {proj.is_current ? (
                          <span className="admin-badge admin-badge-success">진행중</span>
                        ) : (
                          <span className="admin-badge admin-badge-secondary">완료</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyPage;
