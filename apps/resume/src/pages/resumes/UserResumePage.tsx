import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, LoadingSpinner, ErrorState } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';
import ResumeNavHeader from '@/components/resume/ResumeNavHeader';
import { useUserResume } from '@/hooks/useUserResume';
import ResumeProfileSection from './sections/ResumeProfileSection';
import ResumeSkillsSection from './sections/ResumeSkillsSection';
import ResumeExperienceSection from './sections/ResumeExperienceSection';
import ResumeProjectsSection from './sections/ResumeProjectsSection';

const UserResumePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const { resume, isLoading, error, isOwner, isStandalone, defaultAvatar } = useUserResume(userId, currentUser?.id);

  if (isLoading) return <LoadingSpinner fullPage message="이력서를 불러오는 중" />;
  if (error || !resume) return (
    <ErrorState
      message={error || '이력서를 찾을 수 없습니다.'}
      onBack={() => navigate(LINK_PREFIX || '/')}
      backLabel="목록으로 돌아가기"
    />
  );

  return (
    <>
      {isStandalone && <ResumeNavHeader />}
      <div className="resume-detail-page">
        <ResumeProfileSection
          profileImage={resume.profile_image}
          user={resume.user}
          title={resume.title}
          links={{ contact_email: resume.contact_email, github: resume.github, blog: resume.blog }}
          defaultAvatar={defaultAvatar}
          backPath={LINK_PREFIX || '/'}
          isOwner={isOwner}
          editPath={`${LINK_PREFIX}/mypage`}
        />

        {resume.summary && (
          <section id="core-summary" className="resume-detail-section resume-section">
            <h2 className="section-title">핵심 역량</h2>
            <p className="resume-summary-text">{resume.summary}</p>
          </section>
        )}

        {resume.skills?.length > 0 && <ResumeSkillsSection skills={resume.skills} />}
        {resume.experiences?.length > 0 && <ResumeExperienceSection experiences={resume.experiences} />}
        {resume.projects?.length > 0 && <ResumeProjectsSection projects={resume.projects} />}
      </div>
    </>
  );
};

export default UserResumePage;
