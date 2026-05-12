import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
export const NotFound = ({ title = '페이지를 찾을 수 없습니다', message = '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.', homePath = '/', showBackButton = true, showHomeButton = true, }) => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };
    const handleGoHome = () => {
        navigate(homePath);
    };
    return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.content, children: [_jsx("div", { style: styles.errorCode, children: "404" }), _jsx("h1", { style: styles.title, children: title }), _jsx("p", { style: styles.message, children: message }), _jsxs("div", { style: styles.buttonContainer, children: [showBackButton && (_jsx("button", { onClick: handleGoBack, style: styles.button, onMouseEnter: (e) => {
                                e.currentTarget.style.backgroundColor = '#5a6268';
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.backgroundColor = '#6c757d';
                            }, children: "\uC774\uC804 \uD398\uC774\uC9C0" })), showHomeButton && (_jsx("button", { onClick: handleGoHome, style: { ...styles.button, ...styles.primaryButton }, onMouseEnter: (e) => {
                                e.currentTarget.style.backgroundColor = '#0056b3';
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.backgroundColor = '#007bff';
                            }, children: "\uD648\uC73C\uB85C" }))] })] }) }));
};
const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px',
    },
    content: {
        textAlign: 'center',
        maxWidth: '500px',
    },
    errorCode: {
        fontSize: '120px',
        fontWeight: 'bold',
        color: '#dee2e6',
        lineHeight: 1,
        marginBottom: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 600,
        color: '#343a40',
        marginBottom: '12px',
    },
    message: {
        fontSize: '16px',
        color: '#6c757d',
        marginBottom: '32px',
        lineHeight: 1.5,
    },
    buttonContainer: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
    },
    button: {
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: 500,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#6c757d',
        color: '#fff',
        transition: 'background-color 0.2s',
    },
    primaryButton: {
        backgroundColor: '#007bff',
    },
};
export default NotFound;
