/**
 * NotionContent — react-notion-x 본문 렌더러 (modal chrome 없음).
 *
 * resume 의 PortfolioModal 안에서 body 자리만 차지하는 형태로 사용.
 * URL 파싱 / image proxy / recordMap fetch 는 mfa-lib 공유 유틸에 위임 (MFA 정석).
 */
import React, { useEffect, useState } from 'react';
import { NotionRenderer } from 'react-notion-x';
import {
  createNotionImageMapper,
  fetchNotionRecordMap,
} from '@sonhoseong/mfa-lib';
import 'react-notion-x/src/styles.css';
import './NotionContent.editorial.css';

interface Props {
  notionUrl: string;
}

const NotionContent: React.FC<Props> = ({ notionUrl }) => {
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

  if (loading) {
    return (
      <div className="nm-loading">
        <div className="nm-loading-dots">
          <div className="nm-loading-dot" />
          <div className="nm-loading-dot" />
          <div className="nm-loading-dot" />
        </div>
        <div className="nm-loading-text">
          <span className="nm-loading-eyebrow">NOTION · FETCHING</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nm-error">
        <p className="nm-error-text">노션 콘텐츠를 불러올 수 없었습니다.</p>
        <p className="nm-error-sub">{error}</p>
        <a
          href={notionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="nm-error-cta"
        >
          원본 페이지에서 열기 →
        </a>
      </div>
    );
  }

  if (!recordMap) return null;

  return (
    <div className="nm-notion-wrap">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        mapImageUrl={createNotionImageMapper(recordMap)}
      />
    </div>
  );
};

export default NotionContent;
