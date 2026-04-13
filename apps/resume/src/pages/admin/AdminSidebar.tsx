import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuItem {
  title: string;
  link?: string;
  icon?: React.ReactNode;
  subItems?: MenuItem[];
}

const adminMenuItems: MenuItem[] = [
  {
    title: '이력서 관리',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    subItems: [
      { title: '기술스택', link: '/admin/skills' },
      { title: '경력', link: '/admin/experience' },
      { title: '프로젝트', link: '/admin/projects' }
    ]
  }
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['이력서 관리']);

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (link: string) => {
    if (link === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(link);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>관리자</h2>
      </div>

      <nav className="admin-sidebar-nav">
        {adminMenuItems.map((item) => (
          <div key={item.title} className="admin-menu-item">
            {item.subItems ? (
              <>
                <button
                  className={`admin-menu-button ${expandedMenus.includes(item.title) ? 'expanded' : ''}`}
                  onClick={() => toggleMenu(item.title)}
                >
                  <span className="admin-menu-icon">{item.icon}</span>
                  <span className="admin-menu-title">{item.title}</span>
                  <svg
                    className="admin-menu-arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {expandedMenus.includes(item.title) && (
                  <div className="admin-submenu">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.link}
                        to={subItem.link!}
                        className={`admin-submenu-link ${isActive(subItem.link!) ? 'active' : ''}`}
                      >
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.link!}
                className={`admin-menu-link ${isActive(item.link!) ? 'active' : ''}`}
                end={item.link === '/admin'}
              >
                <span className="admin-menu-icon">{item.icon}</span>
                <span className="admin-menu-title">{item.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <NavLink to="/" className="admin-back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>사이트로 돌아가기</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
