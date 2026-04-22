import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '@sonhoseong/mfa-lib';
import { LINK_PREFIX } from '@/config/constants';

interface SectionEditButtonProps {
  /** 편집 페이지 경로 (예: '/admin/skills') — LINK_PREFIX 가 자동으로 앞에 붙음 */
  editPath: string;
  /** 버튼 라벨 */
  label?: string;
}

/**
 * 섹션 편집 버튼 - 로그인 시에만 표시
 * Host 모드에선 자동으로 /container/resume prefix 추가 (standalone 모드에선 /resume)
 */
export const SectionEditButton: React.FC<SectionEditButtonProps> = ({
  editPath,
  label = '편집'
}) => {
  const navigate = useNavigate();
  const { isAdmin } = usePermission();

  // 비-admin (일반 사용자·비로그인) 에겐 편집 버튼 자체 숨김.
  // Owner + Admin 만 노출 (Admin 이 Owner 것 진입 시엔 editor 에서 readOnly 처리)
  if (!isAdmin) {
    return null;
  }

  const handleClick = () => {
    // LINK_PREFIX 는 host 모드 '/container/resume', standalone '/resume'
    // editPath 는 '/admin/skills' 처럼 / 로 시작 → 그대로 이어붙이면 맞음
    navigate(`${LINK_PREFIX}${editPath}`);
  };

  return (
    <button
      className="section-edit-btn"
      onClick={handleClick}
      title={`${label} 페이지로 이동`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default SectionEditButton;
