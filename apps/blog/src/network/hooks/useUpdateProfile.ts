import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { updateProfile } from '@/network/apis/profile/update-profile';

type Payload = Parameters<typeof updateProfile>[1];
type UpdatedRow = NonNullable<Awaited<ReturnType<typeof updateProfile>>['data']>;

export function useUpdateProfile(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (userId: string, payload: Payload): Promise<UpdatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                updateProfile(userId, payload)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '프로필 수정 실패');
                        toastSuccess('프로필이 수정되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '프로필 수정 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
