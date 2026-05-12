import { jsx as _jsx } from "react/jsx-runtime";
export const Container = ({ children, className = '' }) => {
    return (_jsx("div", { className: `app-container ${className}`, children: children }));
};
export default Container;
