import { useCallback } from 'react';
import { useToast } from '../components/toast/ToastContext';
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_FAILURE = '이미지 업로드에 실패했습니다.';
export function useEditorImageUploader({ uploader, extractUrl, maxSizeBytes = DEFAULT_MAX_BYTES, failureMessage = DEFAULT_FAILURE, }) {
    const toast = useToast();
    return useCallback(async (file) => {
        if (!file.type.startsWith('image/')) {
            toast.warning('이미지 파일만 업로드할 수 있습니다.');
            return null;
        }
        if (file.size > maxSizeBytes) {
            const mb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
            toast.warning(`이미지 크기는 ${mb}MB 이하여야 합니다.`);
            return null;
        }
        try {
            const result = await uploader(file);
            const url = extractUrl(result);
            if (!url) {
                toast.error(failureMessage);
                return null;
            }
            return url;
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : failureMessage);
            return null;
        }
    }, [uploader, extractUrl, maxSizeBytes, failureMessage, toast]);
}
