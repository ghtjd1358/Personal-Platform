import React from 'react';
interface LikeButtonProps {
    liked: boolean;
    count: number;
    onToggle: () => void;
    disabled?: boolean;
    animating?: boolean;
    showCount?: boolean;
    className?: string;
}
declare const LikeButton: React.FC<LikeButtonProps>;
export { LikeButton };
//# sourceMappingURL=LikeButton.d.ts.map