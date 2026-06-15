import React from 'react';
interface CardProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
}
declare function Card({ as: As, className, style, children, ...props }: CardProps): import("react/jsx-runtime").JSX.Element;
declare namespace Card {
    var Image: ({ src, alt, loading, fetchPriority, renderPlaceholder, className, children, style, ...props }: CardImageProps) => import("react/jsx-runtime").JSX.Element;
    var Body: ({ className, style, children, ...props }: CardBodyProps) => import("react/jsx-runtime").JSX.Element;
    var Title: ({ as: As, className, style, children, ...props }: CardTitleProps) => import("react/jsx-runtime").JSX.Element;
    var Description: ({ clamp, className, style, children, ...props }: CardDescriptionProps) => import("react/jsx-runtime").JSX.Element;
    var Footer: ({ className, style, children, ...props }: CardFooterProps) => import("react/jsx-runtime").JSX.Element;
    var Meta: ({ className, style, children, ...props }: CardMetaProps) => import("react/jsx-runtime").JSX.Element;
    var Tags: ({ className, style, children, ...props }: CardTagsProps) => import("react/jsx-runtime").JSX.Element;
}
interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt?: string;
    loading?: 'lazy' | 'eager';
    fetchPriority?: 'high' | 'low' | 'auto';
    renderPlaceholder?: () => React.ReactNode;
}
interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    clamp?: number;
}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
}
interface CardMetaProps extends React.HTMLAttributes<HTMLDivElement> {
}
interface CardTagsProps extends React.HTMLAttributes<HTMLDivElement> {
}
export { Card };
export type { CardProps, CardImageProps, CardTitleProps, CardDescriptionProps };
//# sourceMappingURL=Card.d.ts.map