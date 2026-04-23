import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermission, CommonButton } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';
import { EditIcon } from '@/constants/actionIcons';

interface SectionEditButtonProps {
  /** 편집 페이지 경로 (예: '/admin/skills') — LINK_PREFIX 가 자동으로 앞에 붙음 */
  editPath: string;
  /** 버튼 라벨 */
  label?: string;
}

/**
 * 섹션 편집 버튼 — admin 에게만 표시.
 * CommonButton 을 ghost+sm 으로 감싼 wrapper — 권한 체크 + navigate 로직 캡슐화.
 * Host 모드에선 자동으로 /container/resume prefix, standalone '/resume' prefix.
 */
export const SectionEditButton: React.FC<SectionEditButtonProps> = ({
  editPath,
  label = '편집',
}) => {
  const navigate = useNavigate();
  const { isAdmin } = usePermission();

  if (!isAdmin) return null;

  return (
    <CommonButton
      variant="ghost"
      size="sm"
      onClick={() => navigate(`${LINK_PREFIX}${editPath}`)}
      title={`${label} 페이지로 이동`}
      leftIcon={<EditIcon />}
    >
      {label}
    </CommonButton>
  );
};

export default SectionEditButton;
