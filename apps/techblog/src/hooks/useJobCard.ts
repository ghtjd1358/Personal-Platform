import { Job } from '@/types/job';

export function useJobCard(job: Job) {
  const daysUntilDeadline = Math.ceil(
    (new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const visibleSkills = job.skills.slice(0, 4);
  const hiddenSkillCount = Math.max(0, job.skills.length - 4);
  const logoFallback = job.company[0];

  return { daysUntilDeadline, visibleSkills, hiddenSkillCount, logoFallback };
}
