import React from 'react';
import { SeriesDetail } from '@/network';

interface SeriesSelectorProps {
  series: SeriesDetail[];
  selectedSeriesId: string | null;
  onSeriesChange: (seriesId: string | null) => void;
}

const SeriesSelector: React.FC<SeriesSelectorProps> = ({
  series,
  selectedSeriesId,
  onSeriesChange,
}) => {
  const selectedSeries = series.find((s) => s.id === selectedSeriesId);

  if (series.length === 0) {
    return null;
  }

  return (
    <div className="editor-series">
      <div className="series-label">시리즈</div>
      <div className="series-selector">
        <select
          className="series-select"
          value={selectedSeriesId || ''}
          onChange={(e) => onSeriesChange(e.target.value || null)}
        >
          <option value="">시리즈 선택 안함</option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.posts?.length || 0}개)
            </option>
          ))}
        </select>
        {selectedSeries && (
          <button
            type="button"
            className="series-clear"
            onClick={() => onSeriesChange(null)}
            title="시리즈 선택 해제"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export { SeriesSelector };
