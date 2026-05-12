/**
 * useDebounce / useThrottle Hooks
 * 입력 지연 및 스로틀링을 위한 훅
 */
import { useState, useEffect, useCallback, useRef } from 'react';
/**
 * useDebounce Hook
 * 값이 변경된 후 지정된 시간이 지난 뒤에 업데이트
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // debouncedSearch 값이 변경될 때만 API 호출
 *   fetchSearchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    return debouncedValue;
}
/**
 * useDebouncedCallback Hook
 * 콜백 함수를 디바운스 처리
 *
 * @example
 * const handleSearch = useDebouncedCallback((query: string) => {
 *   fetchSearchResults(query);
 * }, 300);
 *
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebouncedCallback(callback, delay = 300) {
    const timeoutRef = useRef(null);
    const callbackRef = useRef(callback);
    // 콜백 참조 업데이트
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    // 클린업
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delay);
    }, [delay]);
}
/**
 * useThrottle Hook
 * 값 업데이트를 지정된 간격으로 제한
 *
 * @example
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 100);
 */
export function useThrottle(value, interval = 300) {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastExecuted = useRef(Date.now());
    useEffect(() => {
        const now = Date.now();
        const timeSinceLastExec = now - lastExecuted.current;
        if (timeSinceLastExec >= interval) {
            lastExecuted.current = now;
            setThrottledValue(value);
        }
        else {
            const timer = setTimeout(() => {
                lastExecuted.current = Date.now();
                setThrottledValue(value);
            }, interval - timeSinceLastExec);
            return () => clearTimeout(timer);
        }
    }, [value, interval]);
    return throttledValue;
}
/**
 * useThrottledCallback Hook
 * 콜백 함수를 스로틀 처리
 *
 * @example
 * const handleScroll = useThrottledCallback(() => {
 *   console.log('Scrolling...', window.scrollY);
 * }, 100);
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 */
export function useThrottledCallback(callback, interval = 300) {
    const lastExecuted = useRef(0);
    const timeoutRef = useRef(null);
    const callbackRef = useRef(callback);
    // 콜백 참조 업데이트
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    // 클린업
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return useCallback((...args) => {
        const now = Date.now();
        const timeSinceLastExec = now - lastExecuted.current;
        if (timeSinceLastExec >= interval) {
            lastExecuted.current = now;
            callbackRef.current(...args);
        }
        else if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                lastExecuted.current = Date.now();
                callbackRef.current(...args);
                timeoutRef.current = null;
            }, interval - timeSinceLastExec);
        }
    }, [interval]);
}
export default useDebounce;
