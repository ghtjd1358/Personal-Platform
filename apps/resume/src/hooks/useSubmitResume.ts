import { useCallback, useState } from 'react';
import { resumesApi, experiencesApi, portfoliosApi } from '@/network';
import type { ResumeProfile } from '@/network/apis/resume/types/resume';
import type { ResumeFormData } from './useResumeForm';

export interface SubmitResumeOptions {
    userId: string;
    /** null = create mode, ResumeProfile = edit mode (resume.id 사용) */
    resume: ResumeProfile | null;
    formData: ResumeFormData;
}

export interface UseSubmitResumeResult {
    /** 성공 시 targetResumeId 반환, 실패 시 throw. caller 가 try/catch 로 토스트 처리. */
    submit: (options: SubmitResumeOptions) => Promise<string>;
    isSaving: boolean;
}

/**
 * 이력서 저장 시퀀스 — resume create/update + experiences/projects 동기화.
 *
 * 헤드리스 원칙:
 *  - validation / toast / navigate 일체 import 하지 않음
 *  - caller 가 validation 통과 후 submit() 호출, 결과 받아 성공/실패 메시지 결정
 *
 * 동기화 전략 (기존 동작 보존): edit 모드에서 기존 experiences/projects 전체 delete 후 재생성.
 * 단순하지만 ID 가 매 저장마다 새로 발급되는 점 유의. diff-based sync 는 추후 개선 여지.
 */
export function useSubmitResume(): UseSubmitResumeResult {
    const [isSaving, setIsSaving] = useState(false);

    const submit = useCallback(
        async ({ userId, resume, formData }: SubmitResumeOptions): Promise<string> => {
            setIsSaving(true);
            try {
                const isEditMode = !!resume;
                let targetResumeId: string;

                if (isEditMode && resume) {
                    await resumesApi.update(
                        resume.id,
                        {
                            resume_name: formData.resume_name.trim() || undefined,
                            name: formData.name.trim(),
                            title: formData.title.trim(),
                            summary: formData.summary.trim() || undefined,
                            profile_image: formData.profile_image.trim() || null,
                            contact_email: formData.contact_email.trim() || null,
                            github: formData.github.trim() || null,
                            blog: formData.blog.trim() || null,
                            visibility: formData.visibility,
                        },
                        userId,
                    );
                    targetResumeId = resume.id;
                } else {
                    const newResume = await resumesApi.create(userId, {
                        resume_name: formData.resume_name.trim() || '기본 이력서',
                        name: formData.name.trim(),
                        title: formData.title.trim(),
                        summary: formData.summary.trim() || undefined,
                        profile_image: formData.profile_image.trim() || undefined,
                        contact_email: formData.contact_email.trim() || undefined,
                        github: formData.github.trim() || undefined,
                        blog: formData.blog.trim() || undefined,
                        visibility: formData.visibility,
                    });
                    targetResumeId = newResume.id;
                }

                if (isEditMode && resume) {
                    const { data: existingExps } = await experiencesApi.getByResumeId(resume.id);
                    for (const exp of existingExps || []) {
                        await experiencesApi.delete(exp.id);
                    }
                }

                for (let i = 0; i < formData.experiences.length; i++) {
                    const exp = formData.experiences[i];
                    if (exp.company.trim() && exp.position.trim()) {
                        await experiencesApi.create({
                            user_id: userId,
                            resume_id: targetResumeId,
                            company: exp.company.trim(),
                            position: exp.position.trim(),
                            start_date: exp.start_date || new Date().toISOString().slice(0, 7),
                            end_date: exp.is_current ? null : (exp.end_date || null),
                            is_current: exp.is_current,
                            is_dev: exp.is_dev,
                            description: exp.description.trim() || undefined,
                            order_index: i,
                        });
                    }
                }

                if (isEditMode && resume) {
                    const { data: existingProjs } = await portfoliosApi.getByResumeId(resume.id);
                    for (const proj of existingProjs || []) {
                        await portfoliosApi.delete(proj.id);
                    }
                }

                for (let i = 0; i < formData.projects.length; i++) {
                    const proj = formData.projects[i];
                    if (proj.title.trim() && proj.role.trim()) {
                        await portfoliosApi.create({
                            user_id: userId,
                            resume_id: targetResumeId,
                            title: proj.title.trim(),
                            role: proj.role.trim(),
                            start_date: proj.start_date || new Date().toISOString().slice(0, 7),
                            end_date: proj.is_current ? null : (proj.end_date || null),
                            is_current: proj.is_current,
                            description: proj.description.trim() || undefined,
                            order_index: i,
                        });
                    }
                }

                return targetResumeId;
            } finally {
                setIsSaving(false);
            }
        },
        [],
    );

    return { submit, isSaving };
}
