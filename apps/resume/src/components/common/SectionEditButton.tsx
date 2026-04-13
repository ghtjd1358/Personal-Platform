import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface SectionEditButtonProps {
  /** 편집 페이지 경로 (예: '/admin/skills') */
  editPath: string;
  /** 버튼 라벨 */
  label?: string;
}

/**
 * 섹션 편집 버튼 - 로그인 시에만 표시
 * KOMCA 패턴: 각 섹션 우측 하단에 "편집" 버튼
 */
export const SectionEditButton: React.FC<SectionEditButtonProps> = ({
  editPath,
  label = '편집'
}) => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: any) => state.app?.accessToken);
  const isAuthenticated = !!accessToken;

  if (!isAuthenticated) {
    return null;
  }

  const handleClick = () => {
    navigate(editPath);
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
