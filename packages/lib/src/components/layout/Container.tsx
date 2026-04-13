/**
 * Container Component - KOMCA 패턴
 *
 * 앱 전체를 감싸는 레이아웃 컨테이너
 */
import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`app-container ${className}`}>
      {children}
    </div>
  );
};

export default Container;
