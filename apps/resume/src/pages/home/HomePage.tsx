import React from 'react';
import { useSelector } from 'react-redux';
import { ModalContainer } from '../../components/modal';
import {
    HeroSection,
    FeaturesSection,
    SkillsSection,
    ExperienceSection,
    ProjectsSection,
    ContactSection
} from './components';
import { useScrollAnimation, useHomePageData } from './hooks';

/**
 * HomePage - 개인 포트폴리오 메인 페이지
 *
 * 데이터 흐름: 로그인 시 Supabase 에서 profile/skills/experiences/projects/features fetch.
 * mock 데이터 제거 — 비로그인/빈 상태는 빈 섹션으로 정직하게 표시.
 * 각 섹션 편집 버튼은 로그인 시 표시 → admin 라우트로 이동 (SectionEditButton).
 */
const HomePage: React.FC = () => {
    const user = useSelector((state: any) => state.app?.user);

    useScrollAnimation();
    const {
        profile,
        skillCategories,
        experiences,
        projects,
        portfolioData,
        features,
        contactLinks,
    } = useHomePageData();

    return (
        <>
            <HeroSection userName={user?.name} resumeProfile={profile} />
            <FeaturesSection features={features} />
            <SkillsSection categories={skillCategories} />
            <ExperienceSection experiences={experiences} projects={projects} />
            <ProjectsSection portfolioData={portfolioData} />
            <ContactSection links={contactLinks} />
            <ModalContainer />
        </>
    );
};

export default HomePage;
