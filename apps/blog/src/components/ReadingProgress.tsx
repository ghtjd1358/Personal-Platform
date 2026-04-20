/**
 * ReadingProgress - 읽기 진행률 표시 바
 *
 * 스크롤 위치에 따라 상단에 프로그레스 바 표시
 */

import React, { useState, useEffect, useCallback } from 'react';

interface ReadingProgressProps {
  /** 진행률을 계산할 컨테이너 셀렉터 (기본: article) */
  targetSelector?: string;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
  targetSelector = 'article',
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const calculateProgress = useCallback(() => {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const windowHeight = window.innerHeight;
    const documentHeight = target.scrollHeight;
    const scrollTop = window.scrollY;
    const targetTop = (target as HTMLElement).offsetTop;

    // 아티클 영역 내에서의 진행률 계산
    const contentStart = targetTop;
    const contentEnd = contentStart + documentHeight - windowHeight;
    const currentPosition = scrollTop - contentStart;
    const totalScrollable = contentEnd - contentStart;

    if (totalScrollable <= 0) {
      setProgress(100);
      return;
    }

    const percentage = Math.min(100, Math.max(0, (currentPosition / totalScrollable) * 100));
    setProgress(percentage);

    // 스크롤이 시작되면 표시
    setIsVisible(scrollTop > 100);
  }, [targetSelector]);

  useEffect(() => {
    // 초기 계산
    calculateProgress();

    // 스크롤 이벤트 리스너 (throttled)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [calculateProgress]);

  if (!isVisible) return null;

  return (
    <div className="reading-progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
      <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

export { ReadingProgress };
