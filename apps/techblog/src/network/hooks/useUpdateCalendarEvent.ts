import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { updateCalendarEvent } from '@/network/apis/calendar/update-event';

type Payload = Parameters<typeof updateCalendarEvent>[1];
type UpdatedRow = NonNullable<Awaited<ReturnType<typeof updateCalendarEvent>>['data']>;

export function useUpdateCalendarEvent(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (eventId: string, input: Payload): Promise<UpdatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                updateCalendarEvent(eventId, input)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '일정 수정 실패');
                        toastSuccess('일정이 수정되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '일정 수정 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
