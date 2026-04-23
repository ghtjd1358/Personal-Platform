import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getJobSkills } from '@/network/apis/job/get-jobs';

export function useFetchJobSkills(
    updater?: number,
    options: { silent?: boolean } = { silent: true },
) {
    const [skills, setSkills] = useState<string[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getJobSkills()
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '기술 스택 조회 실패');
                    setSkills(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setSkills([]);
                    if (!options.silent) toastError(err?.message || '기술 스택 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updater]);

    return { skills };
}
