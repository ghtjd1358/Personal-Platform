import { jsx as _jsx } from "react/jsx-runtime";
import { CommonButton } from './CommonButton';
const HeartIcon = ({ liked, animating }) => (_jsx("svg", { className: animating ? 'like-icon animating' : 'like-icon', viewBox: "0 0 24 24", fill: liked ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: "2", width: "18", height: "18", children: _jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) }));
const LikeButton = ({ liked, count, onToggle, disabled = false, animating = false, showCount = true, className = '', }) => {
    const modifiers = [liked && 'like-button--liked', animating && 'like-button--animating', className]
        .filter(Boolean)
        .join(' ');
    return (_jsx(CommonButton, { variant: "ghost", size: "sm", className: `like-button ${modifiers}`, onClick: onToggle, disabled: disabled, "aria-label": liked ? '좋아요 취소' : '좋아요', "aria-pressed": liked, leftIcon: _jsx(HeartIcon, { liked: liked, animating: animating }), children: showCount && _jsx("span", { className: "like-count", children: count }) }));
};
export { LikeButton };
