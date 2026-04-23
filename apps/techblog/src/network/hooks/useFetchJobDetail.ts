import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getJobDetail } from '@/network/apis/job/get-job-detail';

type JobRow = NonNullable<Awaited<ReturnType<typeof getJobDetail>>['data']>;

export function useFetchJobDetail(
    jobId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [job, setJob] = useState<JobRow | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!jobId) { setJob(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getJobDetail(jobId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '공고 조회 실패');
                    setJob(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setJob(null);
                    if (!options.silent) toastError(err?.message || '공고 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId, updater]);

    return { job };
}
