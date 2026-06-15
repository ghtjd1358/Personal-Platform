import { useCallback, useState } from 'react';
import { JobNote, NoteType } from '@/types/job';

interface UseNoteEditorOptions {
  applicationId: string;
  onAddNote: (note: Omit<JobNote, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
}

interface UseNoteEditorReturn {
  content: string;
  setContent: (next: string) => void;
  noteType: NoteType;
  setNoteType: (next: NoteType) => void;
  /** contentEditable input 핸들러 */
  handleInput: (e: React.FormEvent<HTMLDivElement>) => void;
  /** 저장 — 검증 + onAddNote 호출 + 입력 비움 */
  handleSubmit: () => void;
  /** 저장 가능 여부 */
  canSubmit: boolean;
}

/**
 * NoteEditor 비즈니스 로직 hook.
 *
 * - 입력 상태(content / noteType)와 저장 로직을 분리.
 * - UI 컴포넌트는 hook 반환값으로 input wiring + 노트 목록 렌더링만 한다.
 */
export function useNoteEditor({
  applicationId,
  onAddNote,
}: UseNoteEditorOptions): UseNoteEditorReturn {
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('memo');

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!content.trim()) return;

    onAddNote({
      applicationId,
      content,
      noteType,
    });

    setContent('');
  }, [applicationId, content, noteType, onAddNote]);

  return {
    content,
    setContent,
    noteType,
    setNoteType,
    handleInput,
    handleSubmit,
    canSubmit: !!content.trim(),
  };
}
