import React from 'react';
import { Badge, Card } from '@sonhoseong/mfa-lib';
import type { ProjectItem } from '@/network/apis/resume/types/resume';
import { formatPeriod } from '@/utils/date';

interface Props {
  projects: ProjectItem[];
}

const ResumeProjectsSection: React.FC<Props> = ({ projects }) => (
  <section id="projects" className="resume-detail-section resume-section">
    <h2 className="section-title">프로젝트</h2>
    <div className="project-list">
      {projects.map((project) => (
        <Card key={project.id} className="project-item">
          {project.image_url && (
            <Card.Image className="project-image" src={project.image_url} alt={project.title} />
          )}
          <Card.Body className="project-content">
            <div className="project-header">
              <Card.Title className="project-title">{project.title}</Card.Title>
              <span className="project-period">
                {formatPeriod(project.start_date, project.end_date, project.is_current)}
              </span>
            </div>
            <p className="project-role">{project.role}</p>
            {project.tasks.length > 0 && (
              <ul className="project-tasks">
                {project.tasks.map((task) => (
                  <li key={task.id}>{task.task.replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                ))}
              </ul>
            )}
            {project.tags.length > 0 && (
              <Card.Tags className="project-tags">
                {project.tags.map((tag, i) => (
                  <Badge key={`${tag}-${i}`} variant="default" className="tag">{tag}</Badge>
                ))}
              </Card.Tags>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  </section>
);

export default ResumeProjectsSection;
