import React from 'react';
import { SiGmail, SiGithub, SiVelog, SiLinkedin } from 'react-icons/si';
import { ContactLink } from '../../../data';

interface ContactSectionProps {
  links: ContactLink[];
}

const iconMap: Record<ContactLink['type'], React.ReactNode> = {
  email: <SiGmail size={28} color="#EA4335" />,
  github: <SiGithub size={28} color="#181717" />,
  blog: <SiVelog size={28} color="#20C997" />,
  linkedin: <SiLinkedin size={28} color="#0A66C2" />,
  other: null,
};

export const ContactSection: React.FC<ContactSectionProps> = ({ links }) => {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <h2 className="section-title animate-on-scroll">
          감사합니다
        </h2>
        <p className="contact-desc animate-on-scroll">
          새로운 기회나 협업 제안을 기다리고 있습니다
        </p>
        <div className="contact-icons animate-on-scroll">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.type === 'email' ? `mailto:${link.url}` : link.url}
              className="contact-icon-link"
              target={link.type !== 'email' ? '_blank' : undefined}
              rel={link.type !== 'email' ? 'noreferrer' : undefined}
              title={link.label}
            >
              {iconMap[link.type]}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
