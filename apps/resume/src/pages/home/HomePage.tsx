import React from 'react';
import { useSelector } from 'react-redux';
import { StickyNav } from '@sonhoseong/mfa-lib';
import { ModalContainer } from '../../components/modal';
import {
    HeroSection,
    FeaturesSection,
    SkillsSection,
    ExperienceSection,
    ProjectsSection,
    ContactSection
} from './components';
import { useScrollAnimation } from './hooks';
import {
    mockResumeProfile,
    mockSkillCategories,
    mockExperiences,
    mockProjects,
    mockPortfolioData,
    mockFeatures,
    mockContactLinks,
    navSections
} from '../../data';

/**
 * HomePage - 개인 포트폴리오 메인 페이지
 *
 * 효율성을 위해 mock 데이터(src/data/)를 직접 사용합니다.
 * - API 호출 없이 즉시 렌더링
 * - 데이터 수정 시 src/data/ 파일 직접 수정
 *
 * Supabase 연동이 필요하면 마이페이지(/mypage)에서 관리할 수 있습니다.
 */
const HomePage: React.FC = () => {
    const user = useSelector((state: any) => state.app?.user);

    useScrollAnimation();

    return (
        <>
            <HeroSection userName={user?.name} resumeProfile={mockResumeProfile} />
            <StickyNav sections={navSections} scrollOffset={60} topPosition={20}/>
            <FeaturesSection features={mockFeatures} />
            <SkillsSection categories={mockSkillCategories} />
            <ExperienceSection experiences={mockExperiences} projects={mockProjects} />
            <ProjectsSection portfolioData={mockPortfolioData} />
            <ContactSection links={mockContactLinks} />
            <ModalContainer />
        </>
    );
};

export default HomePage;
