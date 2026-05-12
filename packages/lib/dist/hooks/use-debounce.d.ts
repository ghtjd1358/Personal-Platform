/**
 * useDebounce / useThrottle Hooks
 * 입력 지연 및 스로틀링을 위한 훅
 */
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
export declare function useDebounce<T>(value: T, delay?: number): T;
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
export declare function useDebouncedCallback<T extends (...args: any[]) => any>(callback: T, delay?: number): (...args: Parameters<T>) => void;
/**
 * useThrottle Hook
 * 값 업데이트를 지정된 간격으로 제한
 *
 * @example
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 100);
 */
export declare function useThrottle<T>(value: T, interval?: number): T;
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
export declare function useThrottledCallback<T extends (...args: any[]) => any>(callback: T, interval?: number): (...args: Parameters<T>) => void;
export default useDebounce;
//# sourceMappingURL=use-debounce.d.ts.map