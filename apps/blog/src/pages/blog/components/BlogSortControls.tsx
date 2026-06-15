import React from 'react';

type SortField = 'date' | 'views' | 'likes';
type SortDir = 'desc' | 'asc';
type ColsOpt = 3 | 4 | 5;

interface BlogSortControlsProps {
  sortField: SortField;
  sortDir: SortDir;
  cols: ColsOpt;
  onSortFieldChange: (field: SortField) => void;
  onSortDirChange: (dir: SortDir) => void;
  onColsChange: (cols: ColsOpt) => void;
}

const BlogSortControls: React.FC<BlogSortControlsProps> = ({
  sortField,
  sortDir,
  cols,
  onSortFieldChange,
  onSortDirChange,
  onColsChange,
}) => {
  return (
    <div className="filter-group blog-sort-row">
      <div className="blog-sort-field">
        <span className="filter-label">정렬</span>
        <div className="segmented-control" role="radiogroup" aria-label="정렬 기준">
          <button
            type="button"
            className={`segmented-btn ${sortField === 'date' ? 'active' : ''}`}
            onClick={() => onSortFieldChange('date')}
            title="작성일 기준"
            aria-pressed={sortField === 'date'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>작성일</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${sortField === 'views' ? 'active' : ''}`}
            onClick={() => onSortFieldChange('views')}
            title="조회수 기준"
            aria-pressed={sortField === 'views'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>조회수</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${sortField === 'likes' ? 'active' : ''}`}
            onClick={() => onSortFieldChange('likes')}
            title="좋아요 기준"
            aria-pressed={sortField === 'likes'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={sortField === 'likes' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>좋아요</span>
          </button>
        </div>
      </div>
      <div className="blog-sort-field">
        <span className="filter-label">방향</span>
        <div className="segmented-control" role="radiogroup" aria-label="정렬 방향">
          <button
            type="button"
            className={`segmented-btn ${sortDir === 'desc' ? 'active' : ''}`}
            onClick={() => onSortDirChange('desc')}
            title="내림차순 (큰→작)"
            aria-pressed={sortDir === 'desc'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="13" y2="6" />
              <line x1="3" y1="12" x2="11" y2="12" />
              <line x1="3" y1="18" x2="9" y2="18" />
              <polyline points="17 18 17 6 21 10" />
            </svg>
            <span>내림</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${sortDir === 'asc' ? 'active' : ''}`}
            onClick={() => onSortDirChange('asc')}
            title="오름차순 (작→큰)"
            aria-pressed={sortDir === 'asc'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="9" y2="6" />
              <line x1="3" y1="12" x2="11" y2="12" />
              <line x1="3" y1="18" x2="13" y2="18" />
              <polyline points="17 6 17 18 21 14" />
            </svg>
            <span>오름</span>
          </button>
        </div>
      </div>
      <div className="blog-sort-field">
        <span className="filter-label">열</span>
        <div className="segmented-control segmented-control--cols" role="radiogroup" aria-label="열 개수">
          {([3, 4, 5] as const).map((n) => {
            // 3 → 1행 3열, 4 → 2행 2열, 5 → 위 2 + 아래 3
            const rows: number[] = n === 3 ? [3] : n === 4 ? [2, 2] : [2, 3];
            const W = 32;
            const H = 24;
            const pad = 3;
            const gap = 2.5;
            const innerH = H - pad * 2;
            const rowH = (innerH - gap * (rows.length - 1)) / rows.length;
            const isActive = cols === n;
            return (
              <button
                key={n}
                type="button"
                className={`segmented-btn cols-btn ${isActive ? 'active' : ''}`}
                onClick={() => onColsChange(n)}
                title={`${n}열`}
                aria-pressed={isActive}
              >
                <svg
                  width={W}
                  height={H}
                  viewBox={`0 0 ${W} ${H}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {rows.flatMap((cellsInRow, rIdx) => {
                    const innerW = W - pad * 2;
                    const cellW = (innerW - gap * (cellsInRow - 1)) / cellsInRow;
                    const y = pad + rIdx * (rowH + gap);
                    return Array.from({ length: cellsInRow }).map((_, cIdx) => {
                      const x = pad + cIdx * (cellW + gap);
                      return (
                        <rect
                          key={`${rIdx}-${cIdx}`}
                          x={x}
                          y={y}
                          width={cellW}
                          height={rowH}
                          rx={1}
                          fill={isActive ? 'currentColor' : 'none'}
                        />
                      );
                    });
                  })}
                </svg>
                <span className="cols-btn-num">{n}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export type { SortField, SortDir, ColsOpt };
export default BlogSortControls;
