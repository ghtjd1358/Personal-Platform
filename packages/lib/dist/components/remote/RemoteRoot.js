import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ModalContainer } from '../modal';
import { ToastContainer } from '../toast';
import { ErrorBoundary } from '../error';
import { GlobalLoading } from '../loading';
import { ScrollTopButton } from '../button';
import { Container } from '../layout';
import { storage } from '../../utils/storage';
import { useSimpleInitialize } from '../../hooks/use-simple-initialize';
const isHost = storage.isHostApp();
export function RemoteRoot({ children, hideScrollTop }) {
    const { initialized } = useSimpleInitialize();
    if (!initialized)
        return null;
    const content = (_jsxs(ErrorBoundary, { children: [_jsx("main", { className: "main-content", children: children }), _jsx(GlobalLoading, {})] }));
    return (_jsxs(_Fragment, { children: [_jsx(ModalContainer, {}), _jsx(ToastContainer, {}), isHost ? content : _jsx(Container, { children: content }), !isHost && !hideScrollTop && _jsx(ScrollTopButton, {})] }));
}
