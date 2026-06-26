import { useCallback } from 'react';

/**
 * TiptapEditor 등 리치텍스트 에디터의 `uploader` prop contract `(file) => Promise<string | null>` 생성기.
 *
 * `useImageUpload` (input change 이벤트 driven) 의 직접 호출 짝 — 같은 검증 정책(MIME / 크기) 을
 * 에디터 drag·paste·툴바 버튼 케이스에 적용.
 *
 * 결과 shape 정규화는 caller 가 `extractUrl` 로 위임 — 앱별 uploader 가
 * `{url}` / `UploadResult | false` / `{success, data, error}` 등 제각각이므로.
 *
 * UI 알림 채널은 `onError(message)` 로 caller 위임 — hook 내부에서 toast 등 특정 채널을 import 하지 않음
 * (headless 원칙: callback 으로 위임해 React Native·테스트·다른 알림 채널에 무수정 재사용).
 *
 * @example
 * const handleEditorUpload = useEditorImageUploader({
 *   uploader: (file) => uploadImageFn(file, 'blog'),
 *   extractUrl: (r) => r === false ? null : r.url,
 *   maxSizeBytes: UPLOAD_CONFIG.maxImageSize,
 *   onError: (msg) => toast.error(msg),
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
  /** 검증 실패 + uploader throw + 결과 null 시 호출 — caller 가 toast/inline/무시 결정 */
  onError?: (message: string) => void;
}

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_FAILURE = '이미지 업로드에 실패했습니다.';

export function useEditorImageUploader<T>({
  uploader,
  extractUrl,
  maxSizeBytes = DEFAULT_MAX_BYTES,
  onError,
}: UseEditorImageUploaderOptions<T>): (file: File) => Promise<string | null> {
  return useCallback(
    async (file: File): Promise<string | null> => {
      if (!file.type.startsWith('image/')) {
        onError?.('이미지 파일만 업로드할 수 있습니다.');
        return null;
      }
      if (file.size > maxSizeBytes) {
        const mb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
        onError?.(`이미지 크기는 ${mb}MB 이하여야 합니다.`);
        return null;
      }
      try {
        const result = await uploader(file);
        const url = extractUrl(result);
        if (!url) {
          onError?.(DEFAULT_FAILURE);
          return null;
        }
        return url;
      } catch (err) {
        onError?.(err instanceof Error ? err.message : DEFAULT_FAILURE);
        return null;
      }
    },
    [uploader, extractUrl, maxSizeBytes, onError],
  );
}
