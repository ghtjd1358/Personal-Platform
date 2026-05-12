import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const sizeMap = {
    sm: { main: 24, side: 14 },
    md: { main: 40, side: 22 },
    lg: { main: 56, side: 32 },
    xl: { main: 72, side: 42 },
};
export const Logo = ({ size = 'md', customSize, sideColor = '#1E3A5F', centerColor = '#0EA5E9', eyeColor = '#FFFFFF', interactive = true, onClick, className = '', centerOnly = false, }) => {
    const [sideHover, setSideHover] = useState(false);
    const [centerHover, setCenterHover] = useState(false);
    const dimensions = customSize
        ? { main: customSize, side: Math.round(customSize * 0.58) }
        : sizeMap[size];
    const styles = {
        container: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Math.round(dimensions.main * 0.2),
            cursor: onClick ? 'pointer' : 'default',
        },
        side: {
            cursor: interactive ? 'pointer' : 'default',
            transition: 'transform 0.2s ease',
        },
        center: {
            cursor: interactive ? 'pointer' : 'default',
        },
    };
    // 눈 위치 (호버시 위로 이동)
    const eyeY = sideHover && interactive ? 33 : 36;
    // 콧구멍 크기 (호버시 커짐)
    const noseRx = centerHover && interactive ? 5.5 : 4;
    const noseRy = centerHover && interactive ? 8 : 6;
    return (_jsxs("div", { style: styles.container, className: `logo ${className}`, onClick: onClick, role: onClick ? 'button' : undefined, children: [!centerOnly && (_jsx("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", width: dimensions.side, height: dimensions.side, style: styles.side, onMouseEnter: () => setSideHover(true), onMouseLeave: () => setSideHover(false), children: _jsx("path", { d: "M 8 40 L 24 8 L 40 40", stroke: sideColor, strokeWidth: "14", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }) })), _jsxs("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", width: dimensions.main, height: dimensions.main, style: styles.center, onMouseEnter: () => setCenterHover(true), onMouseLeave: () => setCenterHover(false), children: [_jsx("rect", { x: "20", y: "2", width: "8", height: "16", rx: "4", fill: centerColor }), _jsx("rect", { x: "6", y: "16", width: "36", height: "6", rx: "3", fill: centerColor }), _jsx("ellipse", { cx: "24", cy: "36", rx: "18", ry: "12", fill: centerColor }), _jsx("ellipse", { cx: "17", cy: eyeY, rx: noseRx, ry: noseRy, fill: eyeColor, style: { transition: 'all 0.2s ease' } }), _jsx("ellipse", { cx: "31", cy: eyeY, rx: noseRx, ry: noseRy, fill: eyeColor, style: { transition: 'all 0.2s ease' } })] }), !centerOnly && (_jsx("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", width: dimensions.side, height: dimensions.side, style: styles.side, onMouseEnter: () => setSideHover(true), onMouseLeave: () => setSideHover(false), children: _jsx("path", { d: "M 8 40 L 24 8 L 40 40", stroke: sideColor, strokeWidth: "14", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }) }))] }));
};
export default Logo;
