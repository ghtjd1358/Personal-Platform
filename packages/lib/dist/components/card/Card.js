import { jsx as _jsx } from "react/jsx-runtime";
function Card({ as: As = 'div', className = '', style, children, ...props }) {
    return (_jsx(As, { className: `lib-card ${className}`, style: { position: 'relative', ...style }, ...props, children: children }));
}
Card.Image = function CardImage({ src, alt = '', loading = 'lazy', fetchPriority = 'auto', renderPlaceholder, className = '', children, style, ...props }) {
    return (_jsx("div", { className: `lib-card__image ${className}`, style: { position: 'relative', width: '100%', overflow: 'hidden', ...style }, ...props, children: src
            ? _jsx("img", { src: src, alt: alt, loading: loading, fetchPriority: fetchPriority, decoding: "async", style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } })
            : renderPlaceholder
                ? renderPlaceholder()
                : children }));
};
Card.Body = function CardBody({ className = '', style, children, ...props }) {
    return (_jsx("div", { className: `lib-card__body ${className}`, style: { display: 'flex', flexDirection: 'column', ...style }, ...props, children: children }));
};
Card.Title = function CardTitle({ as: As = 'h3', className = '', style, children, ...props }) {
    return (_jsx(As, { className: `lib-card__title ${className}`, style: { margin: 0, ...style }, ...props, children: children }));
};
Card.Description = function CardDescription({ clamp, className = '', style, children, ...props }) {
    const clampStyle = clamp
        ? { display: '-webkit-box', WebkitLineClamp: clamp, WebkitBoxOrient: 'vertical', overflow: 'hidden', ...style }
        : style;
    return (_jsx("p", { className: `lib-card__description ${className}`, style: { margin: 0, ...clampStyle }, ...props, children: children }));
};
Card.Footer = function CardFooter({ className = '', style, children, ...props }) {
    return (_jsx("div", { className: `lib-card__footer ${className}`, style: { display: 'flex', alignItems: 'center', ...style }, ...props, children: children }));
};
Card.Meta = function CardMeta({ className = '', style, children, ...props }) {
    return (_jsx("div", { className: `lib-card__meta ${className}`, style: { display: 'flex', alignItems: 'center', gap: 8, ...style }, ...props, children: children }));
};
Card.Tags = function CardTags({ className = '', style, children, ...props }) {
    return (_jsx("div", { className: `lib-card__tags ${className}`, style: { display: 'flex', flexWrap: 'wrap', gap: 6, ...style }, ...props, children: children }));
};
export { Card };
