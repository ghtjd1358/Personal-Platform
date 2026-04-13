/**
 * Footer Component
 */
import React from 'react';

export interface FooterProps {
    appName?: string;
    copyright?: string;
    links?: { label: string; href: string }[];
}

export const Footer: React.FC<FooterProps> = ({
    appName = 'App',
    copyright,
    links = [],
}) => {
    const year = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="app-footer-inner">
                <div className="app-footer-copyright">
                    {copyright || `© ${year} ${appName}. All rights reserved.`}
                </div>
                {links.length > 0 && (
                    <nav className="app-footer-links">
                        {links.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="app-footer-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                )}
            </div>
        </footer>
    );
};

export default Footer;
