export enum RoutePath {
    Home = '/',

    // 이력서 둘러보기 (공개)
    Resumes = '/resumes',
    ResumeDetail = '/resumes/:id',
    UserResume = '/user/:userId',

    // 마이페이지 (로그인 필요)
    MyPage = '/mypage',
    MyPageWrite = '/mypage/write',
    MyPageEdit = '/mypage/edit',

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
