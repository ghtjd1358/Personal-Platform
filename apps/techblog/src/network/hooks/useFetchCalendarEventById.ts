import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getCalendarEventById } from '@/network/apis/calendar/get-events';

type Row = NonNullable<Awaited<ReturnType<typeof getCalendarEventById>>['data']>;

export function useFetchCalendarEventById(
    eventId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [event, setEvent] = useState<Row | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!eventId) { setEvent(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getCalendarEventById(eventId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '일정 조회 실패');
                    setEvent(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setEvent(null);
                    if (!options.silent) toastError(err?.message || '일정 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, updater]);

    return { event };
}
