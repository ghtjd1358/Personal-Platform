import { useCallback, useRef, useState } from 'react';
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
export function useImageUpload({ uploader, maxSizeBytes = DEFAULT_MAX_BYTES, onSuccess, onError, }) {
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef(null);
    const handleFileChange = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith('image/')) {
            onError?.('이미지 파일만 업로드 가능합니다.');
            if (inputRef.current)
                inputRef.current.value = '';
            return;
        }
        if (file.size > maxSizeBytes) {
            const mb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
            onError?.(`파일 크기는 ${mb}MB 이하만 가능합니다.`);
            if (inputRef.current)
                inputRef.current.value = '';
            return;
        }
        setIsUploading(true);
        try {
            const result = await uploader(file);
            onSuccess?.(result);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.';
            onError?.(msg);
        }
        finally {
            setIsUploading(false);
            if (inputRef.current)
                inputRef.current.value = '';
        }
    }, [uploader, maxSizeBytes, onSuccess, onError]);
    return { isUploading, inputRef, handleFileChange };
}
