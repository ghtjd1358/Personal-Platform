import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Custom BrowserRouter - KOMCA 패턴
 * history 객체를 받아서 사용
 */
import { useLayoutEffect, useState } from 'react';
import { Router } from 'react-router-dom';
export const BrowserRouter = ({ history, children }) => {
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    });
    useLayoutEffect(() => {
        return history.listen(setState);
    }, [history]);
    return (_jsx(Router, { location: state.location, navigationType: state.action, navigator: history, children: children }));
};
export default BrowserRouter;
