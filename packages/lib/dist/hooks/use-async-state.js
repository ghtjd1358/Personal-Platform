import { useCallback, useEffect, useRef, useState } from 'react';
export function useAsyncState(asyncFn, options = {}) {
    const { initialData = null, autoExecute = false } = options;
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // unmount 후 setState noise 방어
    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    const execute = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await asyncFn();
            if (mountedRef.current)
                setData(result);
            return result;
        }
        catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            if (mountedRef.current)
                setError(err);
            return null;
        }
        finally {
            if (mountedRef.current)
                setIsLoading(false);
        }
    }, [asyncFn]);
    const reset = useCallback(() => {
        setData(initialData);
        setIsLoading(false);
        setError(null);
    }, [initialData]);
    useEffect(() => {
        if (autoExecute)
            void execute();
        // autoExecute 는 mount-only — execute 가 deps 로 들어가면 asyncFn 변경 시마다 재실행되어 의도와 다름.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { data, isLoading, error, execute, reset };
}
