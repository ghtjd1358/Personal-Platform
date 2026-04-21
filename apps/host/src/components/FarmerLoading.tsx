/**
 * FarmerLoading - 볏짚 배경 + 농부가 곡괭이질하는 스피너
 * mfa-lib GlobalLoading 대체 (host 전용).
 * Redux state.app.isLoading 구독 — 기존 로직 그대로, 시각만 조선 농부 컨셉.
 */
import React from 'react';
import { useSelector } from 'react-redux';

const FarmerLoading: React.FC = () => {
    const isLoading = useSelector((state: any) => state.app?.isLoading);

    if (!isLoading) return null;

    return (
        <div className="farmer-loading-overlay">
            <div className="farmer-loading-paper">
                <svg
                    className="farmer-svg"
                    viewBox="0 0 220 220"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <defs>
                        <filter id="farmer-grain">
                            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="4" />
                            <feDisplacementMap in="SourceGraphic" scale="1.2" />
                        </filter>
                    </defs>

                    {/* 땅 (흙) */}
                    <path
                        d="M 15 180 Q 60 176 110 180 T 205 180"
                        stroke="#2B1E14"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        filter="url(#farmer-grain)"
                    />
                    {/* 흙 덩어리 몇 개 */}
                    <ellipse cx="40" cy="185" rx="6" ry="2" fill="#8B6B3F" opacity="0.7" />
                    <ellipse cx="170" cy="186" rx="5" ry="2" fill="#8B6B3F" opacity="0.6" />
                    <ellipse cx="130" cy="188" rx="4" ry="1.5" fill="#8B6B3F" opacity="0.5" />

                    {/* 농부 몸체 */}
                    <g className="farmer-body">
                        {/* 삿갓(straw hat) — 원뿔 + 챙 */}
                        <path d="M 80 58 L 105 30 L 130 58 Z" fill="#D9C286" stroke="#8B6B3F" strokeWidth="1.2" />
                        <ellipse cx="105" cy="58" rx="34" ry="5" fill="#C8A35C" stroke="#8B6B3F" strokeWidth="1" />
                        {/* 얼굴 */}
                        <circle cx="105" cy="70" r="9" fill="#E6D4A3" stroke="#2B1E14" strokeWidth="1" />
                        {/* 허리 살짝 굽힘 */}
                        <path
                            d="M 105 79 Q 102 105 97 135"
                            stroke="#2B1E14"
                            strokeWidth="7"
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* 다리 */}
                        <line x1="97" y1="135" x2="87" y2="175" stroke="#2B1E14" strokeWidth="5" strokeLinecap="round" />
                        <line x1="97" y1="135" x2="105" y2="175" stroke="#2B1E14" strokeWidth="5" strokeLinecap="round" />
                    </g>

                    {/* 팔 + 곡괭이 (애니메이션 그룹) */}
                    <g className="farmer-arm">
                        {/* 팔 (어깨→손) */}
                        <line
                            x1="105"
                            y1="92"
                            x2="150"
                            y2="110"
                            stroke="#2B1E14"
                            strokeWidth="5"
                            strokeLinecap="round"
                        />
                        {/* 곡괭이 자루 (handle) */}
                        <line
                            x1="150"
                            y1="110"
                            x2="180"
                            y2="60"
                            stroke="#8B6B3F"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        {/* 곡괭이 날 (pick head) — 먹색 날 */}
                        <path
                            d="M 173 52 L 195 48 L 188 68 L 180 64 Z"
                            fill="#2B1E14"
                            stroke="#2B1E14"
                            strokeWidth="1"
                        />
                    </g>

                    {/* 흙 튀기는 입자 (impact particles, pulse 애니) */}
                    <g className="farmer-dust">
                        <circle cx="130" cy="176" r="1.8" fill="#8B6B3F" />
                        <circle cx="140" cy="172" r="1.3" fill="#8B6B3F" />
                        <circle cx="124" cy="170" r="1.5" fill="#8B6B3F" />
                        <circle cx="146" cy="178" r="1" fill="#8B6B3F" />
                    </g>
                </svg>
            </div>

            <style>{`
                .farmer-loading-overlay {
                    position: fixed;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 900px 600px at 25% 30%, rgba(200, 163, 92, 0.25) 0%, transparent 60%),
                        radial-gradient(ellipse 700px 500px at 75% 70%, rgba(217, 194, 134, 0.2) 0%, transparent 65%),
                        #E6D4A3;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(1.5px);
                    font-family: 'Pretendard Variable', Pretendard, sans-serif;
                }

                /* 볏짚 섬유 질감 */
                .farmer-loading-overlay::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Cfilter id='sf'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.008 0.9' numOctaves='2' seed='41'/%3E%3CfeColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.1  0 0 0 0.35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sf)'/%3E%3C/svg%3E");
                    background-size: cover;
                    mix-blend-mode: multiply;
                    opacity: 0.45;
                    pointer-events: none;
                }

                .farmer-loading-paper {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }

                .farmer-svg {
                    width: 180px;
                    height: 180px;
                }

                /* 팔+곡괭이 — 어깨 기준 회전 (밭 파는 동작) */
                .farmer-arm {
                    transform-origin: 105px 92px;
                    animation: farmer-dig 1.5s cubic-bezier(.5, 0, .5, 1) infinite;
                }

                @keyframes farmer-dig {
                    0%   { transform: rotate(0deg); }
                    30%  { transform: rotate(-55deg); }
                    48%  { transform: rotate(-55deg); }
                    68%  { transform: rotate(18deg); }
                    78%  { transform: rotate(18deg); }
                    100% { transform: rotate(0deg); }
                }

                /* 몸통도 미세하게 같이 움직 (실감) */
                .farmer-body {
                    transform-origin: 100px 140px;
                    animation: farmer-bob 1.5s cubic-bezier(.5, 0, .5, 1) infinite;
                }

                @keyframes farmer-bob {
                    0%, 30%, 100%  { transform: translateY(0) rotate(0deg); }
                    48%, 68%       { transform: translateY(1.5px) rotate(-1deg); }
                    78%            { transform: translateY(0) rotate(0deg); }
                }

                /* 흙먼지 — 곡괭이 내리치는 순간(68~78%)에 점멸 */
                .farmer-dust {
                    opacity: 0;
                    animation: farmer-dust 1.5s ease-out infinite;
                }

                @keyframes farmer-dust {
                    0%, 65% { opacity: 0; transform: translateY(0); }
                    75%     { opacity: 1; transform: translateY(-3px); }
                    90%     { opacity: 0; transform: translateY(-8px); }
                    100%    { opacity: 0; }
                }

                .farmer-loading-message {
                    margin: 0;
                    font-family: 'Fraunces', 'Pretendard Variable', serif;
                    font-size: 18px;
                    font-weight: 350;
                    font-style: italic;
                    font-variation-settings: "opsz" 36, "SOFT" 100, "WONK" 1;
                    color: #2B1E14;
                    letter-spacing: -0.01em;
                    text-shadow: 0 1px 0 rgba(251, 245, 227, 0.6);
                }

                @media (prefers-reduced-motion: reduce) {
                    .farmer-arm,
                    .farmer-body,
                    .farmer-dust {
                        animation-duration: 3s;
                    }
                }
            `}</style>
        </div>
    );
};

export default FarmerLoading;
