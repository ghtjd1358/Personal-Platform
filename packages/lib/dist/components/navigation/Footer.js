import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Footer = ({ appName = 'App', copyright, links = [], }) => {
    const year = new Date().getFullYear();
    return (_jsx("footer", { className: "app-footer", children: _jsxs("div", { className: "app-footer-inner", children: [_jsx("div", { className: "app-footer-copyright", children: copyright || `© ${year} ${appName}. All rights reserved.` }), links.length > 0 && (_jsx("nav", { className: "app-footer-links", children: links.map((link, index) => (_jsx("a", { href: link.href, className: "app-footer-link", target: "_blank", rel: "noopener noreferrer", children: link.label }, index))) }))] }) }));
};
export default Footer;
