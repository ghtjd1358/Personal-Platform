/**
 * NotionContent — react-notion-x 본문 렌더러 (modal chrome 없음).
 *
 * resume 의 PortfolioModal 안에서 body 자리만 차지하는 형태로 사용.
 */
import React from 'react';
import { NotionRenderer } from 'react-notion-x';
import { createNotionImageMapper, LoadingSpinner, ErrorState } from '@sonhoseong/mfa-lib';
import { useNotionContent } from '@/hooks';
import 'react-notion-x/src/styles.css';
import './NotionContent.editorial.css';

interface Props {
  notionUrl: string;
}

const NotionContent: React.FC<Props> = ({ notionUrl }) => {
  const { recordMap, loading, error } = useNotionContent(notionUrl);

  if (loading) return <LoadingSpinner message="NOTION · FETCHING" />;

  if (error) {
    return (
      <ErrorState
        message="노션 콘텐츠를 불러올 수 없었습니다."
        backHref={notionUrl}
        backLabel="원본 페이지에서 열기 →"
      />
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
