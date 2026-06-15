import { useEffect, useState } from 'react';
import { fetchNotionRecordMap } from '@sonhoseong/mfa-lib';

interface UseNotionContentReturn {
  /** react-notion-x recordMap (any — 외부 라이브러리 타입) */
  recordMap: any | null;
  /** fetch 진행 중 */
  loading: boolean;
  /** fetch 실패 메시지 — null 이면 에러 없음 */
  error: string | null;
}

/**
 * Notion 페이지 recordMap fetching hook.
 *
 * - notionUrl 변경 시 재fetch + 이전 fetch cancel.
 * - UI(NotionContent) 는 recordMap / loading / error 받아 분기 렌더링만 함.
 */
export function useNotionContent(notionUrl: string): UseNotionContentReturn {
  const [recordMap, setRecordMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setRecordMap(null);

    fetchNotionRecordMap(notionUrl)
      .then((rm) => {
        if (!cancelled) setRecordMap(rm);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Notion 페이지를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [notionUrl]);

  return { recordMap, loading, error };
}
