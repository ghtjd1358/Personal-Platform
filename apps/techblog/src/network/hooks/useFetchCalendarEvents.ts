import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getCalendarEvents } from '@/network/apis/calendar/get-events';

type Row = NonNullable<Awaited<ReturnType<typeof getCalendarEvents>>['data']>[number];
type Params = Parameters<typeof getCalendarEvents>[0];

export function useFetchCalendarEvents(
    params: Params = {},
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [events, setEvents] = useState<Row[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getCalendarEvents(params)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '일정 조회 실패');
                    setEvents(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setEvents([]);
                    if (!options.silent) toastError(err?.message || '일정 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, updater]);

    return { events };
}
