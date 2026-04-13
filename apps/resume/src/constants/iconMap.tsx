import React from 'react';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiRedux,
  SiReactquery,
  SiGit,
  SiWebpack,
  SiVite,
  SiNpm,
  SiVscodium,
  SiNextdotjs,
  SiStyledcomponents,
  SiTailwindcss,
  SiSass,
  SiReacthookform,
  SiGithub,
  SiGmail,
  SiVelog,
  SiSupabase,
  SiSpringboot,
  SiMysql,
  SiJira,
  SiConfluence,
  SiFirebase,
  SiAmazonwebservices,
  SiAmazons3,
  SiJest,
  SiPython,
  SiLighthouse,
  SiAxios
} from 'react-icons/si';

// Custom SVG Icons
const FigmaIcon = () => (
  <svg viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
  </svg>
);

const VercelIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L24 22H0L12 1Z" fill="#000000"/>
  </svg>
);

const WebSocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#4A4A4A"/>
    <path d="M7 14L10 8L12 12L14 8L17 14" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IBSheetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2E7D32" strokeWidth="2"/>
    <line x1="3" y1="9" x2="21" y2="9" stroke="#2E7D32" strokeWidth="2"/>
    <line x1="3" y1="15" x2="21" y2="15" stroke="#2E7D32" strokeWidth="2"/>
    <line x1="9" y1="3" x2="9" y2="21" stroke="#2E7D32" strokeWidth="2"/>
    <line x1="15" y1="3" x2="15" y2="21" stroke="#2E7D32" strokeWidth="2"/>
  </svg>
);

const ViteIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export const iconMap: Record<string, React.ReactNode> = {
  'React': <SiReact color="#61DAFB" />,
  'TypeScript': <SiTypescript color="#3178C6" />,
  'JavaScript': <SiJavascript color="#F7DF1E" />,
  'HTML5': <SiHtml5 color="#E34F26" />,
  'CSS3': <SiCss3 color="#1572B6" />,
  'Redux': <SiRedux color="#764ABC" />,
  'Redux Toolkit': <SiRedux color="#764ABC" />,
  'React Query': <SiReactquery color="#FF4154" />,
  'Zustand': <span className="zustand-icon">🐻</span>,
  'Context API': <SiReact color="#61DAFB" />,
  'Git': <SiGit color="#F05032" />,
  'Webpack': <SiWebpack color="#8DD6F9" />,
  'Vite': <ViteIcon />,
  'npm': <SiNpm color="#CB3837" />,
  'Figma': <FigmaIcon />,
  'VS Code': <SiVscodium color="#007ACC" />,
  'Next.js': <SiNextdotjs color="#000000" />,
  'Styled Components': <SiStyledcomponents color="#DB7093" />,
  'Tailwind CSS': <SiTailwindcss color="#06B6D4" />,
  'Sass': <SiSass color="#CC6699" />,
  'Vercel': <VercelIcon />,
  'React Hook Form': <SiReacthookform color="#EC5990" />,
  'Supabase': <SiSupabase color="#3ECF8E" />,
  'WebSocket': <WebSocketIcon />,
  'Spring Boot': <SiSpringboot color="#6DB33F" />,
  'MySQL': <SiMysql color="#4479A1" />,
  'Jira': <SiJira color="#0052CC" />,
  'Confluence': <SiConfluence color="#172B4D" />,
  'Firebase': <SiFirebase color="#FFCA28" />,
  'AWS': <SiAmazonwebservices color="#FF9900" />,
  'S3': <SiAmazons3 color="#569A31" />,
  'IBSheet': <IBSheetIcon />,
  'MFA': <SiWebpack color="#8DD6F9" />,
  'TanStack Query': <SiReactquery color="#FF4154" />,
  'Jest': <SiJest color="#C21325" />,
  'GitHub': <SiGithub color="#181717" />,
  'Python': <SiPython color="#3776AB" />,
  'Lighthouse': <SiLighthouse color="#F44B21" />,
  'Axios': <SiAxios color="#5A29E4" />,
};
