/**
 * HostShell — 인증 분기와 무관하게 항상 마운트되는 Host 공용 chrome
 *
 * - ModalContainer / ToastContainer: 어디서든 띄워질 수 있어야 하므로 root
 * - GlobalLoading `force`: Container 밖 최상위 1회만 마운트해 StrictMode/HMR
 *   에서도 overlay 중복 가능성을 원천 차단
 */

import { ReactNode } from 'react';
import {
    ToastContainer,
    ModalContainer,
    GlobalLoading,
} from '@sonhoseong/mfa-lib';

interface Props {
    children: ReactNode;
}

const HostShell = ({ children }: Props) => (
    <>
        <ModalContainer />
        <ToastContainer position="top-right" />
        {children}
        <GlobalLoading force />
    </>
);

export default HostShell;
