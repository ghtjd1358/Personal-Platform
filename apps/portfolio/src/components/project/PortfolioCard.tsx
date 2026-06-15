import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@sonhoseong/mfa-lib';
import { PortfolioSummary } from '@/network/apis/portfolio/types';

interface PortfolioCardProps {
  project: PortfolioSummary;
  index: number;
  isAdmin: boolean;
  onNotionClick: (url: string, title: string) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, index, isAdmin, onNotionClick }) => (
  <Card as="article" className="insta-grid-card">
    {isAdmin && (
      <Link
        to={`/container/resume/admin/portfolio/edit/${project.id}`}
        className="insta-grid-edit-btn"
        aria-label="이 프로젝트 수정"
        title="이 프로젝트 수정"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </Link>
    )}

    <Card.Image
      className="insta-grid-image"
      src={project.cover_image}
      alt={project.title}
      renderPlaceholder={() => (
        <div className="insta-grid-placeholder">
          <span>{project.badge || '✶'}</span>
        </div>
      )}
    />

    <Card.Body className="insta-grid-info">
      <span className="insta-grid-eyebrow">
        {project.badge || `CASE · 0${(index % 9) + 1}`}
        {project.detail?.period && (
          <span className="insta-grid-eyebrow-period">{project.detail.period}</span>
        )}
      </span>
      <Card.Title className="insta-grid-title">{project.title}</Card.Title>
      {project.short_description && (
        <Card.Description className="insta-grid-sub">{project.short_description}</Card.Description>
      )}
      {project.techStack && project.techStack.length > 0 && (
        <Card.Tags className="insta-grid-tech">
          {project.techStack.slice(0, 8).map((tech) => (
            <span key={tech.id} className="insta-grid-tech-chip">{tech.name}</span>
          ))}
        </Card.Tags>
      )}
      <Card.Footer className="insta-grid-actions">
        {project.notion_url && (
          <button
            type="button"
            className="insta-grid-action insta-grid-action--primary"
            onClick={(e) => { e.stopPropagation(); onNotionClick(project.notion_url!, project.title); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            상세 내용
          </button>
        )}
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="insta-grid-action insta-grid-action--ghost" onClick={(e) => e.stopPropagation()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Live Demo
          </a>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="insta-grid-action insta-grid-action--ghost" onClick={(e) => e.stopPropagation()} aria-label="GitHub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        )}
      </Card.Footer>
    </Card.Body>
  </Card>
);

export { PortfolioCard };
