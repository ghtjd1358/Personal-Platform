import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

function Card({ as: As = 'div', className = '', style, children, ...props }: CardProps) {
  return (
    <As className={`lib-card ${className}`} style={{ position: 'relative', ...style }} {...props}>
      {children}
    </As>
  );
}

interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  renderPlaceholder?: () => React.ReactNode;
}

Card.Image = function CardImage({
  src, alt = '', loading = 'lazy', fetchPriority = 'auto',
  renderPlaceholder, className = '', children, style, ...props
}: CardImageProps) {
  return (
    <div
      className={`lib-card__image ${className}`}
      style={{ position: 'relative', width: '100%', overflow: 'hidden', ...style }}
      {...props}
    >
      {src
        ? <img
            src={src}
            alt={alt}
            loading={loading}
            fetchPriority={fetchPriority as 'high' | 'low' | 'auto'}
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        : renderPlaceholder
          ? renderPlaceholder()
          : children}
    </div>
  );
};

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Body = function CardBody({ className = '', style, children, ...props }: CardBodyProps) {
  return (
    <div
      className={`lib-card__body ${className}`}
      style={{ display: 'flex', flexDirection: 'column', ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}

Card.Title = function CardTitle({ as: As = 'h3', className = '', style, children, ...props }: CardTitleProps) {
  return (
    <As className={`lib-card__title ${className}`} style={{ margin: 0, ...style }} {...props}>
      {children}
    </As>
  );
};

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  clamp?: number;
}

Card.Description = function CardDescription({ clamp, className = '', style, children, ...props }: CardDescriptionProps) {
  const clampStyle: React.CSSProperties | undefined = clamp
    ? { display: '-webkit-box', WebkitLineClamp: clamp, WebkitBoxOrient: 'vertical', overflow: 'hidden', ...style }
    : style;

  return (
    <p className={`lib-card__description ${className}`} style={{ margin: 0, ...clampStyle }} {...props}>
      {children}
    </p>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Footer = function CardFooter({ className = '', style, children, ...props }: CardFooterProps) {
  return (
    <div
      className={`lib-card__footer ${className}`}
      style={{ display: 'flex', alignItems: 'center', ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardMetaProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Meta = function CardMeta({ className = '', style, children, ...props }: CardMetaProps) {
  return (
    <div
      className={`lib-card__meta ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTagsProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Tags = function CardTags({ className = '', style, children, ...props }: CardTagsProps) {
  return (
    <div
      className={`lib-card__tags ${className}`}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 6, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };
export type { CardProps, CardImageProps, CardTitleProps, CardDescriptionProps };
