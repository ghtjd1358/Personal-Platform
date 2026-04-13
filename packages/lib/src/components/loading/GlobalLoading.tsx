/**
 * GlobalLoading Component - KOMCA 패턴
 * 전역 로딩 스피너 UI
 */

import React from 'react';
import { useSelector } from 'react-redux';

interface GlobalLoadingProps {
    /** 커스텀 로딩 메시지 */
    message?: string;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ message }) => {
    const isLoading = useSelector((state: any) => state.app?.isLoading);
    const globalLoadingTitle = useSelector((state: any) => state.app?.globalLoadingTitle);

    if (!isLoading) return null;

    const displayMessage = message || globalLoadingTitle || '로딩 중...';

    return (
        <div className="global-loading-overlay">
            <div className="global-loading-content">
                <div className="global-loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                {displayMessage && (
                    <p className="global-loading-message">{displayMessage}</p>
                )}
            </div>

            <style>{`
                .global-loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(2px);
                }

                .global-loading-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    padding: 32px 48px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                .global-loading-spinner {
                    position: relative;
                    width: 48px;
                    height: 48px;
                }

                .spinner-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 3px solid transparent;
                    border-top-color: #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .spinner-ring:nth-child(2) {
                    width: 80%;
                    height: 80%;
                    top: 10%;
                    left: 10%;
                    border-top-color: #60a5fa;
                    animation-duration: 0.8s;
                    animation-direction: reverse;
                }

                .spinner-ring:nth-child(3) {
                    width: 60%;
                    height: 60%;
                    top: 20%;
                    left: 20%;
                    border-top-color: #93c5fd;
                    animation-duration: 0.6s;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .global-loading-message {
                    margin: 0;
                    font-size: 14px;
                    color: #374151;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default GlobalLoading;
