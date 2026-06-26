import { useCallback } from 'react';
import { useFormFromData } from '@sonhoseong/mfa-lib';
import type { ResumeVisibility } from '@/network/apis/resume/types/resume';
import type { ExperienceFormData, ProjectFormData } from '@/pages/mypage/components';

export interface ResumeFormData {
    resume_name: string;
    name: string;
    title: string;
    summary: string;
    profile_image: string;
    contact_email: string;
    github: string;
    blog: string;
    visibility: ResumeVisibility;
    experiences: ExperienceFormData[];
    projects: ProjectFormData[];
    skills: string[];
}

export const INITIAL_RESUME_FORM_DATA: ResumeFormData = {
    resume_name: '',
    name: '',
    title: '',
    summary: '',
    profile_image: '',
    contact_email: '',
    github: '',
    blog: '',
    visibility: 'private',
    experiences: [],
    projects: [],
    skills: [],
};

/**
 * 이력서 폼 상태 관리 훅 — lib `useFormFromData` 위임 + DOM change handler + visibility setter 합성.
 *
 * 책임:
 *  - formData 단일 객체 + setFormData (nested array 갱신용)
 *  - updateField — typed field setter (단일 필드)
 *  - handleChange — `<input name=...>` 등 DOM event 직접 바인딩
 *  - setVisibility — visibility 전용 typed setter (select 컴포넌트가 typed value 만 넘김)
 *
 * 책임 외 (page 가 보유):
 *  - API 로딩 (resumesApi.getById, experiencesApi/portfoliosApi.getByResumeId)
 *  - submit 시퀀스 (validation + create/update + nested CRUD)
 *  - 이미지 업로드 (`useImageUpload` + uploadProfileImage)
 */
export function useResumeForm() {
    const { formData, setFormData, setField, reset } = useFormFromData<ResumeFormData>(INITIAL_RESUME_FORM_DATA);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        },
        [setFormData],
    );

    const setVisibility = useCallback(
        (value: ResumeVisibility) => {
            setFormData((prev) => ({ ...prev, visibility: value }));
        },
        [setFormData],
    );

    return {
        formData,
        setFormData,
        updateField: setField,
        resetForm: reset,
        handleChange,
        setVisibility,
    };
}
