import { useEffect, useState } from 'react';
import { resumesApi, experiencesApi, portfoliosApi } from '@/network';
import type { ResumeProfile } from '@/network/apis/resume/types/resume';
import type { ExperienceFormData, ProjectFormData } from '@/pages/mypage/components';

export type ResumeEditorFetchError = 'forbidden' | 'load-failed';

export interface ResumeEditorData {
    resume: ResumeProfile;
    experiences: ExperienceFormData[];
    projects: ProjectFormData[];
}

export interface UseFetchResumeEditorDataResult {
    data: ResumeEditorData | null;
    isLoading: boolean;
    error: ResumeEditorFetchError | null;
}

/**
 * 이력서 편집기 초기 데이터 fetch — resume + experiences + projects 병렬 + 정규화.
 *
 * 헤드리스 원칙:
 *  - navigate / toast / setFormData 등 UI·page 채널 일체 import 하지 않음
 *  - 결과 (`data` / `error`) 만 반환 — caller 가 redirect / toast / form 주입 결정
 *
 * 호출 조건: `resumeId && userId` 둘 다 truthy 일 때만 fetch.
 * 미충족 시 `{ data: null, isLoading: false, error: null }` — caller 가 mode dispatch.
 *
 * 소유권(`resume.user_id !== userId`) 위반은 `'forbidden'` 으로 보고.
 */
export function useFetchResumeEditorData(
    resumeId: string | undefined,
    userId: string | undefined,
): UseFetchResumeEditorDataResult {
    const [data, setData] = useState<ResumeEditorData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ResumeEditorFetchError | null>(null);

    useEffect(() => {
        if (!resumeId || !userId) {
            setData(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;
        setIsLoading(true);
        setError(null);

        (async () => {
            try {
                const resume = await resumesApi.getById(resumeId);
                if (cancelled) return;

                if (resume.user_id !== userId) {
                    setError('forbidden');
                    setData(null);
                    return;
                }

                const [expResult, projResult] = await Promise.all([
                    experiencesApi.getByResumeId(resumeId),
                    portfoliosApi.getByResumeId(resumeId),
                ]);
                if (cancelled) return;

                const experiences: ExperienceFormData[] = (expResult.data || []).map((exp: any) => ({
                    id: exp.id,
                    company: exp.company || '',
                    position: exp.position || '',
                    start_date: exp.start_date || '',
                    end_date: exp.end_date || '',
                    is_current: exp.is_current || false,
                    is_dev: exp.is_dev ?? true,
                    description: exp.description || '',
                }));

                const projects: ProjectFormData[] = (projResult.data || []).map((proj: any) => ({
                    id: proj.id,
                    title: proj.title || '',
                    role: proj.role || '',
                    start_date: proj.start_date || '',
                    end_date: proj.end_date || '',
                    is_current: proj.is_current || false,
                    description: proj.description || '',
                    tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : '',
                }));

                setData({ resume, experiences, projects });
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load resume editor data:', err);
                setError('load-failed');
                setData(null);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [resumeId, userId]);

    return { data, isLoading, error };
}
