import { ResumeWithUser } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';

export function useResumeCard(resume: ResumeWithUser) {
  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${resume.user?.name || 'U'}`;
  const avatarUrl = resume.user?.avatar_url || defaultAvatar;
  const userName = resume.user?.name || '익명';
  const profileImage = resume.profile_image;
  const summary = resume.summary
    ? resume.summary.length > 80
      ? `${resume.summary.substring(0, 80)}...`
      : resume.summary
    : null;
  const userLink = `${LINK_PREFIX}/user/${resume.user_id}`;
  const hasEmail = Boolean(resume.contact_email);
  const hasGithub = Boolean(resume.github);
  const hasBlog = Boolean(resume.blog);

  return { avatarUrl, userName, profileImage, summary, userLink, hasEmail, hasGithub, hasBlog };
}
