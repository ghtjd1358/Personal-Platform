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
 * 데이터 흐름:
 * - 로그인 시 Supabase 에서 현재 유저의 profile/skills/experiences/projects fetch
 * - 비로그인이거나 특정 영역 데이터 비어있으면 mock 으로 fallback → UI 는 항상 유효 상태
 * - 각 섹션은 로그인 시 편집 버튼 표시 → admin 라우트로 이동 (SectionEditButton)
 *
 * portfolioData/features/contactLinks 는 admin 라우트 없음 → mock 그대로 유지
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
