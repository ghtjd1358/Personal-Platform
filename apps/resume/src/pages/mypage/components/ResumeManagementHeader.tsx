import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button } from '@sonhoseong/mfa-lib';
import type { ResumeProfile } from '@/network/apis/resume/types/resume';
import { LINK_PREFIX } from '@/config/constants';

interface ResumeManagementHeaderProps {
  resume: ResumeProfile;
  resumeId: string;
  isSaving: boolean;
  onToggleVisibility: () => void;
  onSetPrimary: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
}

const ResumeManagementHeader: React.FC<ResumeManagementHeaderProps> = ({
  resume,
  resumeId,
  isSaving,
  onToggleVisibility,
  onSetPrimary,
  onCopyLink,
  onDelete,
}) => {
  return (
    <div className="management-header">
      <div className="management-header-inner">
        <Link to={`${LINK_PREFIX}/mypage`} className="back-link">
          ← 내 이력서 목록
        </Link>
        <div className="management-title">
          <h2>{resume.resume_name || '이력서'}</h2>
          {resume.is_primary && <Badge variant="primary" className="badge badge-primary">대표</Badge>}
          <Badge
            variant={resume.visibility === 'public' ? 'success' : 'default'}
            className={`badge ${resume.visibility === 'public' ? 'badge-success' : 'badge-secondary'}`}
          >
            {resume.visibility === 'public' ? '공개' : '비공개'}
          </Badge>
        </div>
        <Button.Group className="management-actions" gap="md" align="end">
          <Button
            variant={resume.visibility === 'public' ? 'secondary' : 'primary'}
            onClick={onToggleVisibility}
            disabled={isSaving}
            loading={isSaving}
            className={`btn ${resume.visibility === 'public' ? 'btn-outline' : 'btn-primary'}`}
          >
            {resume.visibility === 'public' ? '🔒 비공개로 전환' : '🌐 공개하기'}
          </Button>
          {resume.visibility === 'public' && (
            <Button variant="secondary" onClick={onCopyLink} className="btn btn-outline">
              📋 링크 복사
            </Button>
          )}
          {!resume.is_primary && (
            <Button variant="secondary" onClick={onSetPrimary} disabled={isSaving} className="btn btn-outline">
              ⭐ 대표로 설정
            </Button>
          )}
          <Link to={`${LINK_PREFIX}/mypage/${resumeId}/edit`} className="btn btn-primary">
            ✏️ 수정
          </Link>
          <Button variant="danger" onClick={onDelete} disabled={isSaving} className="btn btn-danger">
            🗑️ 삭제
          </Button>
        </Button.Group>
      </div>
    </div>
  );
};

export default ResumeManagementHeader;
