import React, { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  delay?: number;
  className?: string;
  fullPage?: boolean;
}

// GlobalLoading 과 동일한 editorial 언어로 통일 — 주홍 arc head + 한지 카드 + JetBrains Mono 라벨.
// delay(기본 200ms) 동안 빈 렌더로 짧은 fetch 의 플리커 방지.
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = '불러오는 중',
  delay = 200,
  className = '',
  fullPage = false,
}) => {
  const [show, setShow] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!show) return null;

  return (
    <div
      className={`editorial-loading-inline ${fullPage ? 'editorial-loading-inline--full' : ''} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <div className="editorial-loading-card">
        <svg className="editorial-loading-arc" viewBox="0 0 60 60" width="44" height="44" aria-hidden>
          <circle cx="30" cy="30" r="24" stroke="rgba(43, 30, 20, 0.15)" strokeWidth="3" fill="none" />
          <circle
            cx="30" cy="30" r="24"
            stroke="#8C1E1A"
            strokeWidth="3"
            fill="none"
            strokeDasharray="42 200"
            strokeLinecap="round"
            className="editorial-loading-arc-head"
          />
        </svg>
        <p className="editorial-loading-label">LOADING · {message}</p>
        <div className="editorial-loading-dots" aria-hidden>
          <span /><span /><span />
        </div>
      </div>

      <style>{`
        .editorial-loading-inline {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }
        .editorial-loading-inline--full {
          min-height: 60vh;
        }
        .editorial-loading-inline .editorial-loading-card {
          background: #FBF5E3;
          border: 1px solid #2B1E14;
          box-shadow: 3px 5px 0 rgba(43, 30, 20, 0.12);
          padding: 28px 36px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          min-width: 200px;
          position: relative;
        }
        .editorial-loading-inline .editorial-loading-arc-head {
          transform-origin: 30px 30px;
          animation: editorialLoadingInlineSpin 0.95s cubic-bezier(.55, .1, .5, .9) infinite;
        }
        @keyframes editorialLoadingInlineSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .editorial-loading-inline .editorial-loading-label {
          margin: 0;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          color: #8B7355;
          text-transform: uppercase;
          font-weight: 500;
        }
        .editorial-loading-inline .editorial-loading-dots {
          display: inline-flex;
          gap: 6px;
        }
        .editorial-loading-inline .editorial-loading-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #2B1E14;
          opacity: 0.25;
          animation: editorialLoadingInlinePulse 1.2s ease-in-out infinite;
        }
        .editorial-loading-inline .editorial-loading-dots span:nth-child(2) { animation-delay: 0.18s; }
        .editorial-loading-inline .editorial-loading-dots span:nth-child(3) { animation-delay: 0.36s; }
        @keyframes editorialLoadingInlinePulse {
          0%, 100% { opacity: 0.25; transform: scale(0.7); background: #2B1E14; }
          50%      { opacity: 1;    transform: scale(1.1); background: #8C1E1A; }
        }
      `}</style>
    </div>
  );
};

export { LoadingSpinner };
