import React, { useState, useEffect } from 'react';
import { Logo } from '@sonhoseong/mfa-lib';

interface NavItem {
  label: string;
  id: string;
}

interface Props {
  items?: NavItem[];
}

const DEFAULT_ITEMS: NavItem[] = [
  { label: '핵심 역량', id: 'core-summary' },
  { label: '기술 스택', id: 'skills' },
  { label: '경력', id: 'experience' },
  { label: '프로젝트', id: 'projects' },
];

const ResumeNavHeader: React.FC<Props> = ({ items = DEFAULT_ITEMS }) => {
  const [activeId, setActiveId] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      for (const { id } of [...items].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 70) {
          setActiveId(id);
          return;
        }
      }
      setActiveId('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`resume-section-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="resume-section-nav__inner">
        <div className="resume-section-nav__logo">
          <Logo size="sm" sideColor="#2B1E14" centerColor="#8C1E1A" eyeColor="#F4EAD5" interactive={false} />
        </div>
        <div className="resume-section-nav__items">
          {items.map(({ label, id }) => (
            <button
              key={id}
              className={`resume-section-nav__item${activeId === id ? ' active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ResumeNavHeader;
