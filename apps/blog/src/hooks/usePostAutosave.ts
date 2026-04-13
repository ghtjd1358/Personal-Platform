import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@sonhoseong/mfa-lib';
import type { PostFormData } from './usePostEditorData';

/** 자동 저장 설정 */
const AUTOSAVE_CONFIG = {
  key: 'blog_post_autosave',
  interval: 30000, // 30초
  maxAge: 24 * 60 * 60 * 1000, // 24시간
} as const;

interface UsePostAutosaveOptions {
  /** 수정 모드 여부 (수정 모드에서는 자동 저장 비활성화) */
  isEditMode: boolean;
  /** 폼 데이터 */
  formData: PostFormData;
  /** 폼 데이터 설정 함수 */
  setFormData: (data: PostFormData) => void;
}

interface UsePostAutosaveReturn {
  /** 마지막 자동 저장 시간 */
  lastSavedAt: Date | null;
  /** 저장되지 않은 변경사항 여부 */
  hasUnsavedChanges: boolean;
  /** 변경사항 발생 표시 */
  markAsChanged: () => void;
  /** 자동 저장 데이터 삭제 */
  clearAutosave: () => void;
}

/**
 * 포스트 에디터 자동 저장 훅
 *
 * 기능:
 * - localStorage에 30초마다 자동 저장
 * - 24시간 이내 저장된 데이터 복원
 * - 페이지 이탈 시 경고
 */
export function usePostAutosave({
  isEditMode,
  formData,
  setFormData,
}: UsePostAutosaveOptions): UsePostAutosaveReturn {
  const toast = useToast();
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 저장 - localStorage에 저장
  const saveToLocal = useCallback(() => {
    if (isEditMode) return;

    if (formData.title.trim() || formData.content.trim()) {
      const autosaveData = {
        ...formData,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(AUTOSAVE_CONFIG.key, JSON.stringify(autosaveData));
      setLastSavedAt(new Date());
      setHasUnsavedChanges(false);
    }
  }, [formData, isEditMode]);

  // 자동 저장 데이터 복원 (최초 마운트 시)
  useEffect(() => {
    if (isEditMode) return;

    const savedData = localStorage.getItem(AUTOSAVE_CONFIG.key);
    if (!savedData) return;

    try {
      const parsed = JSON.parse(savedData);
      const savedTime = new Date(parsed.savedAt);
      const timeDiff = Date.now() - savedTime.getTime();

      // 설정된 시간 이내의 데이터만 복원
      if (timeDiff < AUTOSAVE_CONFIG.maxAge) {
        if (parsed.title || parsed.content) {
          const confirmRestore = window.confirm(
            `${savedTime.toLocaleString('ko-KR')}에 저장된 임시 글이 있습니다.\n복원하시겠습니까?`
          );
          if (confirmRestore) {
            setFormData({
              title: parsed.title || '',
              content: parsed.content || '',
              excerpt: parsed.excerpt || '',
              tagIds: parsed.tagIds || [],
              meta_title: parsed.meta_title || '',
              meta_description: parsed.meta_description || '',
              seriesId: parsed.seriesId || null,
            });
            setLastSavedAt(savedTime);
            toast.success('임시 저장된 글을 복원했습니다.');
          } else {
            localStorage.removeItem(AUTOSAVE_CONFIG.key);
          }
        }
      } else {
        localStorage.removeItem(AUTOSAVE_CONFIG.key);
      }
    } catch {
      localStorage.removeItem(AUTOSAVE_CONFIG.key);
    }
  }, [isEditMode, setFormData, toast]);

  // 주기적 자동 저장
  useEffect(() => {
    if (isEditMode || !hasUnsavedChanges) return;

    autosaveTimerRef.current = setInterval(() => {
      saveToLocal();
    }, AUTOSAVE_CONFIG.interval);

    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, [isEditMode, hasUnsavedChanges, saveToLocal]);

  // 페이지 이탈 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 자동 저장 데이터 삭제
  const clearAutosave = useCallback(() => {
    localStorage.removeItem(AUTOSAVE_CONFIG.key);
    setHasUnsavedChanges(false);
  }, []);

  // 변경사항 발생 표시
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  return {
    lastSavedAt,
    hasUnsavedChanges,
    markAsChanged,
    clearAutosave,
  };
}
