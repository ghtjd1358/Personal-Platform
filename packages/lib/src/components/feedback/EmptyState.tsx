import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  'data-aos'?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '✶',
  title,
  description,
  action,
  className = '',
  ...rest
}) => (
  <div
    className={`lib-empty-state ${className}`}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center', gap: 12 }}
    {...rest}
  >
    <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 4, color: 'var(--text-secondary, #8B7355)' }}>{icon}</div>
    {title && <p style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--text, inherit)' }}>{title}</p>}
    <p style={{ fontSize: 14, margin: 0, color: 'var(--text-secondary, #8B7355)' }}>{description}</p>
    {action && <div style={{ marginTop: 8 }}>{action}</div>}
  </div>
);

export { EmptyState };
export type { EmptyStateProps };
