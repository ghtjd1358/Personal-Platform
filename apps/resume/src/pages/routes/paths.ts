export enum RoutePath {
    // 메인 = 이력서 둘러보기
    Home = '/',

    // 이력서 둘러보기 (공개)
    Resumes = '/resumes',
    ResumeDetail = '/resumes/:id',
    UserResume = '/user/:userId',

    // 마이페이지 (로그인 필요) - 다중 이력서 지원
    MyResumes = '/mypage',                    // 내 이력서 목록
    MyResumeCreate = '/mypage/create',        // 새 이력서 만들기
    MyResumeDetail = '/mypage/:resumeId',     // 이력서 상세/관리
    MyResumeEdit = '/mypage/:resumeId/edit',  // 이력서 수정

    // 관리자 페이지
    AdminSkills = '/admin/skills',
    AdminSkillsNew = '/admin/skills/new',
    AdminSkillsEdit = '/admin/skills/edit/:id',

    AdminExperience = '/admin/experience',
    AdminExperienceNew = '/admin/experience/new',
    AdminExperienceEdit = '/admin/experience/edit/:id',

    AdminProjects = '/admin/projects',
    AdminProjectsNew = '/admin/projects/new',
    AdminProjectsEdit = '/admin/projects/edit/:id',
}
