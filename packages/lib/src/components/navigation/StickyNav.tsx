import React, { useState, useEffect, useCallback } from 'react';

export interface NavSection {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface StickyNavProps {
  sections: NavSection[];
  /** 스크롤 트리거 위치 (0-1, 기본 0.2) */
  triggerPoint?: number;
  /** 스크롤 오프셋 (기본 80) */
  scrollOffset?: number;
  /** 상단 고정 위치 (기본 20) */
  topPosition?: number;
  /** 로고 클릭 시 콜백 */
  onLogoClick?: () => void;
  /** 로고 표시 여부 */
  showLogo?: boolean;
  /** 커스텀 클래스 */
  className?: string;
  /** URL hash 업데이트 여부 (기본 false) */
  updateHash?: boolean;
}

export const StickyNav: React.FC<StickyNavProps> = ({
  sections,
  triggerPoint = 0.2,
  scrollOffset = 80,
  topPosition = 20,
  onLogoClick,
  showLogo = true,
  className = '',
  updateHash = false
}) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // 초기 로드 시 hash가 있으면 해당 섹션으로 스크롤 + hashchange 이벤트 처리
  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.slice(1);
        const element = document.getElementById(id);
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    };

    // 초기 로드
    if (updateHash && window.location.hash) {
      setTimeout(scrollToHash, 100);
    }

    // 브라우저 뒤로/앞으로 버튼 처리
    if (updateHash) {
      window.addEventListener('hashchange', scrollToHash);
      return () => window.removeEventListener('hashchange', scrollToHash);
    }
  }, [updateHash, scrollOffset]);

  // Scroll spy - 스크롤 시 active section 업데이트 + hash 업데이트
  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const trigger = viewportHeight * triggerPoint;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= trigger && rect.bottom > trigger) {
            if (activeSection !== section.id) {
              setActiveSection(section.id);
              // 스크롤 시에도 hash 업데이트 (pushState로 히스토리 쌓지 않음)
              if (updateHash) {
                window.history.replaceState(null, '', `#${section.id}`);
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, triggerPoint, activeSection, updateHash]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // URL hash 업데이트 (pushState로 히스토리에 추가)
      if (updateHash) {
        window.history.pushState(null, '', `#${id}`);
      }
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, [scrollOffset, updateHash]);

  const handleLogoClick = useCallback(() => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [onLogoClick]);

  const styles = {
    wrapper: {
      position: 'sticky' as const,
      top: topPosition,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      padding: '0 24px',
      marginBottom: '40px',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px',
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '50px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
    },
    logoButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '8px 12px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '50px',
      transition: 'background 0.2s',
    },
    dot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      transition: 'transform 0.2s',
    },
    pillList: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    pill: {
      padding: '10px 18px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#64748b',
      background: 'transparent',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
      transition: 'all 0.2s ease',
    },
    pillHover: {
      color: '#0EA5E9',
    },
    pillActive: {
      color: '#ffffff',
      background: '#1E3A5F',
      boxShadow: '0 2px 8px rgba(30, 58, 95, 0.25)',
    },
  };

  return (
    <div style={styles.wrapper} className={`sticky-nav-wrapper ${className}`}>
      <nav style={styles.nav} className="sticky-nav">
        {showLogo && (
          <button
            style={styles.logoButton}
            onClick={handleLogoClick}
            className="nav-logo-dots"
            aria-label="맨 위로"
          >
            <span style={{ ...styles.dot, background: '#3B82F6' }} className="dot blue" />
            <span style={{ ...styles.dot, background: '#22C55E' }} className="dot green" />
            <span style={{ ...styles.dot, background: '#F59E0B' }} className="dot yellow" />
          </button>
        )}
        <ul style={styles.pillList} className="nav-pills">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const isHovered = hoveredSection === section.id && !isActive;
            return (
              <li key={section.id}>
                <button
                  style={{
                    ...styles.pill,
                    ...(isHovered ? styles.pillHover : {}),
                    ...(isActive ? styles.pillActive : {}),
                  }}
                  className={`nav-pill ${isActive ? 'active' : ''}`}
                  onClick={() => scrollToSection(section.id)}
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  {section.icon && <span style={{ marginRight: '6px' }}>{section.icon}</span>}
                  {section.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default StickyNav;
