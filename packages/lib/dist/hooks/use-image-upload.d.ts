/**
 * 이미지 업로드 hook — validation + isUploading + input clear 까지 표준화.
 *
 * uploader 결과 shape 가 앱별로 다르므로 (`result.url` / `result.publicUrl` / `result.data.url`)
 * generic `<T>` 로 받아 `onSuccess(result: T)` 에 url 추출은 호출부 위임.
 *
 * 검증 정책 (기본):
 *  - `image/*` MIME type 만 허용
 *  - `maxSizeBytes` 초과 시 onError
 *  - validation 실패 시 uploader 호출 없이 onError 만 트리거 + input 초기화
 *
 * input 초기화 (`fileInputRef.current.value = ''`) — 같은 파일을 두 번 선택해도 change 이벤트 발생하도록.
 *
 * @example
 * const { isUploading, inputRef, handleFileChange } = useImageUpload({
 *   uploader: (f) => uploadImage(f, 'series'),
 *   maxSizeBytes: 5 * 1024 * 1024,
 *   onSuccess: (res) => res.success && res.data && setCoverImage(res.data.url),
 *   onError: (msg) => toast.error(msg),
 * });
 * <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
 */
export interface UseImageUploadOptions<T> {
    /** 실제 업로드 호출 — 결과 shape 은 caller 가 정의 */
    uploader: (file: File) => Promise<T>;
    /** 파일 크기 상한 (기본 5MB) */
    maxSizeBytes?: number;
    /** 업로드 성공 시 — caller 가 url 추출 */
    onSuccess?: (result: T) => void;
    /** 검증 실패 + uploader throw + 사용자 메시지 통일 채널 */
    onError?: (message: string) => void;
}
export interface UseImageUploadReturn {
    isUploading: boolean;
    /** `<input ref={inputRef}>` 에 연결 — 업로드 후 자동 초기화 */
    inputRef: React.RefObject<HTMLInputElement | null>;
    /** `<input type="file" onChange={handleFileChange}>` 에 연결 */
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}
export declare function useImageUpload<T>({ uploader, maxSizeBytes, onSuccess, onError, }: UseImageUploadOptions<T>): UseImageUploadReturn;
//# sourceMappingURL=use-image-upload.d.ts.map