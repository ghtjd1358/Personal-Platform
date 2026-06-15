import React from 'react';

interface ErrorStateProps {
  message?: string;
  onBack?: () => void;
  backLabel?: string;
  backHref?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = '오류가 발생했습니다.',
  onBack,
  backLabel = '돌아가기',
  backHref,
  className = '',
}) => (
  <div
    className={`lib-error-state ${className}`}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '40px 20px', textAlign: 'center' }}
  >
    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-secondary, #8B7355)', marginBottom: 24 }}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
    <p style={{ fontSize: 18, marginBottom: 24, color: 'var(--text, inherit)' }}>{message}</p>
    {backHref ? (
      <a href={backHref} className="btn btn-secondary">{backLabel}</a>
    ) : onBack ? (
      <button type="button" className="btn btn-secondary" onClick={onBack}>{backLabel}</button>
    ) : null}
  </div>
);

export { ErrorState };
export type { ErrorStateProps };
