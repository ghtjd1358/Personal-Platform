import { useCallback } from 'react';
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_FAILURE = '이미지 업로드에 실패했습니다.';
export function useEditorImageUploader({ uploader, extractUrl, maxSizeBytes = DEFAULT_MAX_BYTES, onError, }) {
    return useCallback(async (file) => {
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
        }
        catch (err) {
            onError?.(err instanceof Error ? err.message : DEFAULT_FAILURE);
            return null;
        }
    }, [uploader, extractUrl, maxSizeBytes, onError]);
}
