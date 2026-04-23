import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { createCalendarEvent } from '@/network/apis/calendar/create-event';

type Payload = Parameters<typeof createCalendarEvent>[0];
type CreatedRow = NonNullable<Awaited<ReturnType<typeof createCalendarEvent>>['data']>;

export function useCreateCalendarEvent(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (input: Payload): Promise<CreatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                createCalendarEvent(input)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '일정 생성 실패');
                        toastSuccess('일정이 생성되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '일정 생성 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
