/**
 * NotionEmbedModal — Notion 공유 페이지를 react-notion-x 로 렌더링.
 *
 * 동작: notion URL 에서 page-id 추출 → notion-client (browser-direct) 로 recordMap fetch → NotionRenderer 컴포넌트.
 * Notion unofficial API 가 브라우저 직접 호출 시 CORS 차단되면 fetch 실패 → fallback UI 노출 (원본 페이지 새 탭).
 */
import React, { useEffect, useState } from 'react';
import { NotionRenderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import './NotionEmbedModal.editorial.css';

// Supabase Edge Function endpoint — 노션 unofficial API 의 content-type/CORS 회피 proxy
const NOTION_PROXY_URL = 'https://ujhlgylnauzluttvmcrz.supabase.co/functions/v1/notion-page';

// 정적 이미지(PNG/JPG/WebP) 만 노션 image proxy 로 강제 — presigned URL 만료(1h) 우회.
// GIF 는 노션 proxy 가 transcode 하면서 깨지는 케이스가 있어서 원본 presigned URL 패스스루
// (모달 열 때마다 노션 API 가 fresh presigned 발급하므로 실무상 OK).
const GIF_REGEXP = /\.gif(?:$|\?|#)/i;
const proxyImageUrl = (url: string | undefined, block: any): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('https://www.notion.so/image/')) return url;
  if (GIF_REGEXP.test(url)) return url;
  try {
    const u = new URL(url);
    // Edge Function 이 getSignedFileUrls 로 발급한 fresh signed URL 은 그대로 통과
    if (u.searchParams.has('X-Amz-Signature')) return url;
    const proxiable =
      u.hostname.endsWith('.amazonaws.com') ||
      u.hostname === 'img.notionusercontent.com' ||
      url.startsWith('/');
    if (!proxiable) return url;
  } catch {
    return url;
  }
  const proxied = `https://www.notion.so/image/${encodeURIComponent(url)}`;
  try {
    const v2 = new URL(proxied);
    let table = block?.parent_table === 'space' ? 'block' : block?.parent_table;
    if (!table || table === 'collection' || table === 'team') table = 'block';
    v2.searchParams.set('table', table);
    if (block?.id) v2.searchParams.set('id', block.id);
    v2.searchParams.set('cache', 'v2');
    return v2.toString();
  } catch {
    return proxied;
  }
};

interface Props {
  notionUrl: string | null;
  title?: string;
  onClose: () => void;
}

/**
 * Notion URL → 32hex page id → UUID hyphen 형식 (8-4-4-4-12).
 * notion-client 의 NotionAPI.loadPageChunk 가 hyphen 없는 id 에 400 Bad Request 반환하는 케이스 회피.
 * e.g. 1732ddbb2746801c851ec6710db343bf  →  1732ddbb-2746-801c-851e-c6710db343bf
 */
function extractPageId(url: string): string | null {
  const match = url.match(/([a-f0-9]{32})/i);
  if (!match) return null;
  const hex = match[1].toLowerCase();
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const NotionEmbedModal: React.FC<Props> = ({ notionUrl, title, onClose }) => {
  const [recordMap, setRecordMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!notionUrl) return;

    let cancelled = false;
    const pageId = extractPageId(notionUrl);
    if (!pageId) {
      setError('Notion 페이지 ID 를 URL 에서 추출하지 못했습니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setRecordMap(null);

    fetch(`${NOTION_PROXY_URL}?pageId=${encodeURIComponent(pageId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `Proxy ${res.status}`);
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        if (!data?.recordMap) throw new Error('recordMap 누락');
        setRecordMap(data.recordMap);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || 'Notion 페이지를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [notionUrl]);

  useEffect(() => {
    if (!notionUrl) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [notionUrl, onClose]);

  if (!notionUrl) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="nm-backdrop" onClick={handleBackdropClick}>
      <div className="nm-modal" role="dialog" aria-modal="true">
        <header className="nm-header">
          <div className="nm-header-meta">
            <span className="nm-eyebrow">NOTION · DETAIL</span>
            {title && <h2 className="nm-title">{title}</h2>}
          </div>
          <div className="nm-header-actions">
            <a
              href={notionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nm-open-link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              원본 페이지
            </a>
            <button className="nm-close" onClick={onClose} aria-label="닫기">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        <div className="nm-body">
          {loading && (
            <div className="nm-loading">
              <div className="nm-loading-dot" />
              <div className="nm-loading-dot" />
              <div className="nm-loading-dot" />
            </div>
          )}

          {error && !loading && (
            <div className="nm-error">
              <p className="nm-error-text">노션 콘텐츠를 모달 안에서 불러올 수 없었습니다.</p>
              <p className="nm-error-sub">{error}</p>
              <a href={notionUrl} target="_blank" rel="noopener noreferrer" className="nm-error-cta">
                원본 페이지에서 열기 →
              </a>
            </div>
          )}

          {recordMap && !error && (
            <div className="nm-notion-wrap">
              <NotionRenderer
                recordMap={recordMap}
                fullPage={false}
                darkMode={false}
                mapImageUrl={proxyImageUrl}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotionEmbedModal;
