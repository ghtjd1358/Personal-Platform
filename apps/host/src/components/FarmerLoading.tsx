/**
 * FarmerLoading - Editorial Global Loading Overlay (host 전용).
 *
 * KOMCA 패턴: `react-promise-tracker` 의 'GLOBAL' area 구독.
 * remote 의 `useShowGlobalLoading` 이 trackPromise 로 감싼 promise 가 진행중이면 표시.
 * 중첩 호출 counter 자동 관리 + 500ms debounce 로 깜빡임 방지.
 *
 * Visual dialect 는 lib 의 GlobalLoading 과 동일 (한지 bone + 먹 arc + 주홍 head + mono 라벨).
 */
import React, { useEffect, useState } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useSelector } from 'react-redux';

const GLOBAL_AREA_CONFIG = { area: 'GLOBAL' };

const FarmerLoading: React.FC = () => {
    const { promiseInProgress } = usePromiseTracker(GLOBAL_AREA_CONFIG);
    const title = useSelector((state: any) => state.app?.globalLoadingTitle);

    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (promiseInProgress) {
            setVisible(true);
        } else {
            const timer = setTimeout(() => setVisible(false), 500);
            return () => clearTimeout(timer);
        }
    }, [promiseInProgress]);

    if (!visible) return null;

    const label = title ? `LOADING · ${title}` : 'LOADING · 불러오는 중';

    return (
        <div className="editorial-loading-overlay" role="status" aria-live="polite">
            <div className="editorial-loading-card">
                <svg
                    className="editorial-loading-arc"
                    viewBox="0 0 60 60"
                    width="44"
                    height="44"
                    aria-hidden
                >
                    <circle
                        cx="30" cy="30" r="24"
                        stroke="rgba(43, 30, 20, 0.15)"
                        strokeWidth="3"
                        fill="none"
                    />
                    <circle
                        cx="30" cy="30" r="24"
                        stroke="#8C1E1A"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="42 200"
                        strokeLinecap="round"
                        className="editorial-loading-arc-head"
                    />
                </svg>
                <p className="editorial-loading-label">{label}</p>
                <div className="editorial-loading-dots" aria-hidden>
                    <span /><span /><span />
                </div>
            </div>

            <style>{`
                .editorial-loading-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(244, 234, 213, 0.82);
                    backdrop-filter: blur(3px) saturate(1.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: editorialLoadingFadeIn 0.25s ease-out;
                }
                @keyframes editorialLoadingFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .editorial-loading-card {
                    background: #FBF5E3;
                    border: 1px solid #2B1E14;
                    box-shadow: 3px 5px 0 rgba(43, 30, 20, 0.12);
                    padding: 28px 36px 22px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 14px;
                    min-width: 200px;
                    position: relative;
                }
                .editorial-loading-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='lg'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012 0.85' numOctaves='2' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0.22  0 0 0 0 0.17  0 0 0 0 0.12  0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23lg)'/%3E%3C/svg%3E");
                    mix-blend-mode: multiply;
                    opacity: 0.5;
                    pointer-events: none;
                }
                .editorial-loading-arc {
                    position: relative;
                    z-index: 1;
                }
                .editorial-loading-arc-head {
                    transform-origin: 30px 30px;
                    animation: editorialLoadingSpin 0.95s cubic-bezier(.55, .1, .5, .9) infinite;
                }
                @keyframes editorialLoadingSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .editorial-loading-label {
                    margin: 0;
                    font-family: 'JetBrains Mono', ui-monospace, monospace;
                    font-size: 10px;
                    letter-spacing: 0.22em;
                    color: #8B7355;
                    text-transform: uppercase;
                    font-weight: 500;
                    position: relative;
                    z-index: 1;
                }
                .editorial-loading-dots {
                    display: inline-flex;
                    gap: 6px;
                    position: relative;
                    z-index: 1;
                }
                .editorial-loading-dots span {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #2B1E14;
                    opacity: 0.25;
                    animation: editorialLoadingPulse 1.2s ease-in-out infinite;
                }
                .editorial-loading-dots span:nth-child(2) { animation-delay: 0.18s; }
                .editorial-loading-dots span:nth-child(3) { animation-delay: 0.36s; }
                @keyframes editorialLoadingPulse {
                    0%, 100% { opacity: 0.25; transform: scale(0.7); background: #2B1E14; }
                    50%      { opacity: 1;    transform: scale(1.1); background: #8C1E1A; }
                }
            `}</style>
        </div>
    );
};

export default FarmerLoading;
