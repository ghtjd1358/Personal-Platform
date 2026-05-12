import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function RemoteErrorFallback({ remoteName, onRetry, error }) {
    const isDev = process.env.NODE_ENV === 'development';
    return (_jsxs("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            textAlign: 'center',
            minHeight: '300px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            margin: '24px',
        }, children: [_jsx("div", { style: {
                    fontSize: '48px',
                    marginBottom: '16px',
                    opacity: 0.5,
                }, children: "\u26A0\uFE0F" }), _jsxs("h2", { style: {
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#343a40',
                }, children: [remoteName, " \uC571\uC744 \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4"] }), _jsxs("p", { style: {
                    margin: '0 0 24px 0',
                    fontSize: '14px',
                    color: '#6c757d',
                    maxWidth: '400px',
                }, children: ["\uC11C\uBE44\uC2A4\uC5D0 \uC77C\uC2DC\uC801\uC778 \uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.", _jsx("br", {}), "\uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694."] }), onRetry && (_jsx("button", { onClick: onRetry, style: {
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#fff',
                    backgroundColor: '#007bff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                }, onMouseOver: (e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                }, onMouseOut: (e) => {
                    e.currentTarget.style.backgroundColor = '#007bff';
                }, children: "\uB2E4\uC2DC \uC2DC\uB3C4" })), isDev && error && (_jsxs("details", { style: {
                    marginTop: '24px',
                    padding: '12px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#856404',
                    maxWidth: '500px',
                    textAlign: 'left',
                }, children: [_jsx("summary", { style: { cursor: 'pointer', fontWeight: 500 }, children: "\uAC1C\uBC1C\uC790 \uC815\uBCF4 (\uAC1C\uBC1C \uD658\uACBD\uC5D0\uC11C\uB9CC \uD45C\uC2DC)" }), _jsxs("pre", { style: {
                            marginTop: '8px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                        }, children: [error.message, error.stack && `\n\n${error.stack}`] })] }))] }));
}
export default RemoteErrorFallback;
