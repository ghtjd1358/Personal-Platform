/**
 * iconResolver — DB skills.icon (key 문자열) → React 아이콘 노드 매핑의 단일 source of truth.
 *
 * 기존 iconMap.tsx 는 정적 Record<string, ReactNode> 로 브랜드 컬러까지 코드에 박아두었음.
 * 이 파일은 factory 함수 기반으로 재구성:
 *   - 각 키: `(color?: string) => ReactNode` 형태
 *   - 호출 시 color 안 주면 default brand color, 주면 override (DB skills.icon_color 에서 옴)
 *
 * 끝단 사용 패턴:
 *   - 카드/모달/타임라인: `resolveIcon(skill.icon, skill.icon_color)` — DB-driven
 *   - IconPicker / 기존 페이지 (ResumeDetailPage 등): 백워드 호환 `iconMap[key]` 사용 (default 컬러 적용된 정적 Record)
 */
import React from 'react';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiRedux,
  SiReactquery,
  SiGit,
  SiWebpack,
  SiNpm,
  SiVscodium,
  SiNextdotjs,
  SiStyledcomponents,
  SiTailwindcss,
  SiSass,
  SiReacthookform,
  SiGithub,
  SiSupabase,
  SiSpringboot,
  SiMysql,
  SiJira,
  SiConfluence,
  SiFirebase,
  SiJest,
  SiPython,
  SiLighthouse,
  SiAxios,
} from 'react-icons/si';

// ===== 커스텀 SVG 아이콘 (react-icons 에 없거나 브랜드 충실도 위해 직접 정의) =====

const FigmaIcon: React.FC = () => (
  <svg viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
  </svg>
);

const VercelIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L24 22H0L12 1Z" fill="#000000"/>
  </svg>
);

const WebSocketIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#4A4A4A"/>
    <path d="M7 14L10 8L12 12L14 8L17 14" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IBSheetIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2E7D32" strokeWidth="2"/>
    <line x1="3" y1="9" x2="21" y2="9" stroke="#2E7D32" strokeWidth="2"/>
    <line x1="3" y1="15" x2="21" y2="15" stroke="#2E7D32" strokeWidth="2"/>
    <line x1="9" y1="3" x2="9" y2="21" stroke="#2E7D32" strokeWidth="2"/>
    <line x1="15" y1="3" x2="15" y2="21" stroke="#2E7D32" strokeWidth="2"/>
  </svg>
);

const AwsIcon: React.FC<{ color?: string }> = ({ color = '#FF9900' }) => (
  <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.296.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.807-.414l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/>
  </svg>
);

const ViteIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vite-gradient-1" x1="6" y1="3" x2="30" y2="29" gradientUnits="userSpaceOnUse">
        <stop stopColor="#41D1FF"/>
        <stop offset="1" stopColor="#BD34FE"/>
      </linearGradient>
      <linearGradient id="vite-gradient-2" x1="19" y1="3" x2="15" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFBD4F"/>
        <stop offset="1" stopColor="#FF980E"/>
      </linearGradient>
    </defs>
    <path d="M29.884 6.146L16.678 29.452a.9.9 0 01-1.578.013L1.98 6.153a.9.9 0 01.996-1.312l13.091 2.56a.9.9 0 00.346 0l12.476-2.554a.9.9 0 01.995 1.299z" fill="url(#vite-gradient-1)"/>
    <path d="M22.264 2.007L12.54 3.912a.45.45 0 00-.357.417l-.578 9.824a.45.45 0 00.536.474l2.924-.588a.45.45 0 01.523.545l-.87 4.268a.45.45 0 00.548.53l1.804-.433a.45.45 0 01.548.53l-1.382 6.79a.281.281 0 00.512.209l.342-.49 6.478-12.961a.45.45 0 00-.449-.673l-3.01.478a.45.45 0 01-.5-.584l1.956-5.325a.45.45 0 00-.5-.584z" fill="url(#vite-gradient-2)"/>
  </svg>
);

// ===== Factory 레지스트리: 키 → (color?) => ReactNode =====
// react-icons 기반은 color prop 으로 동적 컬러 지원. 커스텀 SVG 중 단색(AwsIcon) 도 color prop 받음.
// 멀티컬러 (Figma/Vite/Vercel/WebSocket/IBSheet) 는 color 무시.

type IconFactory = (color?: string) => React.ReactNode;

const ICON_FACTORIES: Record<string, IconFactory> = {
  'React':             (c) => <SiReact color={c ?? '#61DAFB'} />,
  'TypeScript':        (c) => <SiTypescript color={c ?? '#3178C6'} />,
  'JavaScript':        (c) => <SiJavascript color={c ?? '#F7DF1E'} />,
  'HTML5':             (c) => <SiHtml5 color={c ?? '#E34F26'} />,
  'CSS3':              (c) => <SiCss color={c ?? '#1572B6'} />,
  'Redux':             (c) => <SiRedux color={c ?? '#764ABC'} />,
  'Redux Toolkit':     (c) => <SiRedux color={c ?? '#764ABC'} />,
  'React Query':       (c) => <SiReactquery color={c ?? '#FF4154'} />,
  'TanStack Query':    (c) => <SiReactquery color={c ?? '#FF4154'} />,
  'Zustand':           () => <span className="zustand-icon" role="img" aria-label="zustand">🐻</span>,
  'Context API':       (c) => <SiReact color={c ?? '#61DAFB'} />,
  'Git':               (c) => <SiGit color={c ?? '#F05032'} />,
  'Webpack':           (c) => <SiWebpack color={c ?? '#8DD6F9'} />,
  'MFA':               (c) => <SiWebpack color={c ?? '#8DD6F9'} />,
  'Vite':              () => <ViteIcon />,
  'npm':               (c) => <SiNpm color={c ?? '#CB3837'} />,
  'Figma':             () => <FigmaIcon />,
  'VS Code':           (c) => <SiVscodium color={c ?? '#007ACC'} />,
  'Next.js':           (c) => <SiNextdotjs color={c ?? '#000000'} />,
  'Styled Components': (c) => <SiStyledcomponents color={c ?? '#DB7093'} />,
  'Tailwind CSS':      (c) => <SiTailwindcss color={c ?? '#06B6D4'} />,
  'Sass':              (c) => <SiSass color={c ?? '#CC6699'} />,
  'Vercel':            () => <VercelIcon />,
  'React Hook Form':   (c) => <SiReacthookform color={c ?? '#EC5990'} />,
  'Supabase':          (c) => <SiSupabase color={c ?? '#3ECF8E'} />,
  'WebSocket':         () => <WebSocketIcon />,
  'Spring Boot':       (c) => <SiSpringboot color={c ?? '#6DB33F'} />,
  'MySQL':             (c) => <SiMysql color={c ?? '#4479A1'} />,
  'Jira':              (c) => <SiJira color={c ?? '#0052CC'} />,
  'Confluence':        (c) => <SiConfluence color={c ?? '#172B4D'} />,
  'Firebase':          (c) => <SiFirebase color={c ?? '#FFCA28'} />,
  'AWS':               (c) => <AwsIcon color={c ?? '#FF9900'} />,
  'S3':                (c) => <AwsIcon color={c ?? '#569A31'} />,
  'IBSheet':           () => <IBSheetIcon />,
  'Jest':              (c) => <SiJest color={c ?? '#C21325'} />,
  'GitHub':            (c) => <SiGithub color={c ?? '#181717'} />,
  'Python':            (c) => <SiPython color={c ?? '#3776AB'} />,
  'Lighthouse':        (c) => <SiLighthouse color={c ?? '#F44B21'} />,
  'Axios':             (c) => <SiAxios color={c ?? '#5A29E4'} />,
};

/**
 * 키 + 선택적 color 로 아이콘 ReactNode 반환. 미등록 키는 null.
 * DB-driven 컨텍스트에선 `resolveIcon(skill.icon, skill.icon_color)` 로 호출.
 */
export function resolveIcon(
  key: string | null | undefined,
  color?: string | null,
): React.ReactNode | null {
  if (!key) return null;
  const factory = ICON_FACTORIES[key];
  if (!factory) return null;
  return factory(color ?? undefined);
}

/** 등록된 모든 키 정렬 반환 — IconPicker grid 용. */
export function listIconKeys(): string[] {
  return Object.keys(ICON_FACTORIES).slice().sort((a, b) => a.localeCompare(b));
}
