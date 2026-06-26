/**
 * TiptapEditor 등 리치텍스트 에디터의 `uploader` prop contract `(file) => Promise<string | null>` 생성기.
 *
 * `useImageUpload` (input change 이벤트 driven) 의 직접 호출 짝 — 같은 검증 정책(MIME / 크기) 을
 * 에디터 drag·paste·툴바 버튼 케이스에 적용.
 *
 * 결과 shape 정규화는 caller 가 `extractUrl` 로 위임 — 앱별 uploader 가
 * `{url}` / `UploadResult | false` / `{success, data, error}` 등 제각각이므로.
 *
 * @example
 * const handleEditorUpload = useEditorImageUploader({
 *   uploader: (file) => uploadImageFn(file, 'blog'),
 *   extractUrl: (r) => r === false ? null : r.url,
 *   maxSizeBytes: UPLOAD_CONFIG.maxImageSize,
 * });
 * <TiptapEditor ... uploader={handleEditorUpload} />
 */
export interface UseEditorImageUploaderOptions<T> {
    /** 실제 업로드 호출 — 결과 shape 은 caller 가 정의 */
    uploader: (file: File) => Promise<T>;
    /** uploader 결과에서 URL 추출 — `null` 은 실패로 간주 */
    extractUrl: (result: T) => string | null;
    /** 파일 크기 상한 (기본 5MB) */
    maxSizeBytes?: number;
    /** uploader 가 null/throw 시 사용자에게 보일 메시지 (기본: '이미지 업로드에 실패했습니다.') */
    failureMessage?: string;
}
export declare function useEditorImageUploader<T>({ uploader, extractUrl, maxSizeBytes, failureMessage, }: UseEditorImageUploaderOptions<T>): (file: File) => Promise<string | null>;
//# sourceMappingURL=use-editor-image-uploader.d.ts.map