/**
 * RemoteErrorBoundary
 * Remote 앱 로드 실패 시 에러를 캡처하고 Fallback UI 표시
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RemoteErrorFallback } from './RemoteErrorFallback';

export interface RemoteErrorBoundaryProps {
  /** 자식 요소 (Remote 앱) */
  children: ReactNode;
  /** Remote 앱 이름 (Fallback UI에 표시) */
  remoteName: string;
  /** 커스텀 Fallback 컴포넌트 */
  fallback?: ReactNode;
  /** 에러 발생 시 콜백 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface RemoteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class RemoteErrorBoundary extends Component<
  RemoteErrorBoundaryProps,
  RemoteErrorBoundaryState
> {
  constructor(props: RemoteErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): RemoteErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[RemoteErrorBoundary] ${this.props.remoteName} 로드 실패:`, error);
    console.error('Error Info:', errorInfo);

    // 에러 콜백 실행
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, remoteName, fallback } = this.props;

    if (hasError) {
      // 커스텀 Fallback이 있으면 사용
      if (fallback) {
        return fallback;
      }

      // 기본 Fallback UI
      return (
        <RemoteErrorFallback
          remoteName={remoteName}
          error={error}
          onRetry={this.handleRetry}
        />
      );
    }

    return children;
  }
}

export default RemoteErrorBoundary;