import React from 'react';
import { SeriesSelector } from './SeriesSelector';
import type { SeriesItem } from '@/network';

interface EditorSidebarProps {
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  series: SeriesItem[];
  selectedSeriesId: string | null;
  onExcerptChange: (value: string) => void;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onSeriesChange: (seriesId: string | null) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  excerpt,
  metaTitle,
  metaDescription,
  series,
  selectedSeriesId,
  onExcerptChange,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onSeriesChange,
}) => {
  return (
    <aside className="editor-sidebar">
      <div className="sidebar-section">
        <h3>시리즈</h3>
        <SeriesSelector
          series={series}
          selectedSeriesId={selectedSeriesId}
          onSeriesChange={onSeriesChange}
        />
      </div>

      <div className="sidebar-section">
        <h3>요약 (발췌문)</h3>
        <textarea
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="글의 요약을 입력하세요"
          className="sidebar-textarea"
          rows={4}
        />
      </div>

      <div className="sidebar-section">
        <h3>SEO 설정</h3>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder="메타 제목"
          className="sidebar-input"
        />
        <textarea
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="메타 설명"
          className="sidebar-textarea"
          rows={3}
        />
      </div>
    </aside>
  );
};

export { EditorSidebar };
