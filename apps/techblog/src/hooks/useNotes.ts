/**
 * useNotes Hook
 *
 * Manages job notes state with CRUD operations for a specific application
 */

import { useState, useEffect, useCallback } from 'react';
import { JobNote, NoteType } from '@/types/job';
import {
  getNotesByApplicationId,
  createNote,
  updateNote,
  deleteNote,
} from '@/network/apis';

// mock fallback 제거 — API 실패 시 빈 배열로 정직하게 표시

interface UseNotesState {
  notes: JobNote[];
  isLoading: boolean;
  error: string | null;
}

interface UseNotesReturn extends UseNotesState {
  // CRUD operations
  create: (content: string, noteType: NoteType) => Promise<JobNote | null>;
  update: (noteId: string, content: string, noteType?: NoteType) => Promise<boolean>;
  remove: (noteId: string) => Promise<boolean>;
  refetch: () => void;
}

/**
 * Hook for managing notes for a specific application
 *
 * @param applicationId - The application ID to fetch notes for
 *
 * @example
 * ```tsx
 * const { notes, create, remove } = useNotes(application.id);
 *
 * // Add a new note
 * const handleAddNote = async (content: string) => {
 *   await create(content, 'memo');
 * };
 *
 * // Delete a note
 * const handleDelete = async (noteId: string) => {
 *   await remove(noteId);
 * };
 * ```
 */
export function useNotes(applicationId: string): UseNotesReturn {
  const [state, setState] = useState<UseNotesState>({
    notes: [],
    isLoading: true,
    error: null,
  });

  const fetchNotes = useCallback(async () => {
    if (!applicationId) {
      setState({ notes: [], isLoading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getNotesByApplicationId(applicationId);

      if (result.success && result.data) {
        setState({ notes: result.data, isLoading: false, error: null });
      } else {
        setState({ notes: [], isLoading: false, error: result.error ?? null });
      }
    } catch {
      setState({ notes: [], isLoading: false, error: '메모를 불러오지 못했어요.' });
    }
  }, [applicationId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /**
   * Create a new note
   */
  const create = useCallback(async (
    content: string,
    noteType: NoteType
  ): Promise<JobNote | null> => {
    try {
      const result = await createNote({
        applicationId,
        content,
        noteType,
      });

      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          notes: [result.data!, ...prev.notes],
        }));
        return result.data;
      } else {
        // Fallback: Create local note
        const newNote: JobNote = {
          id: `note-${Date.now()}`,
          applicationId,
          userId: 'user-1',
          content,
          noteType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setState(prev => ({
          ...prev,
          notes: [newNote, ...prev.notes],
        }));
        return newNote;
      }
    } catch {
      // Fallback: Create local note
      const newNote: JobNote = {
        id: `note-${Date.now()}`,
        applicationId,
        userId: 'user-1',
        content,
        noteType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setState(prev => ({
        ...prev,
        notes: [newNote, ...prev.notes],
      }));
      return newNote;
    }
  }, [applicationId]);

  /**
   * Update a note
   */
  const update = useCallback(async (
    noteId: string,
    content: string,
    noteType?: NoteType
  ): Promise<boolean> => {
    // Optimistic update
    const previousNotes = state.notes;
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(note =>
        note.id === noteId
          ? {
              ...note,
              content,
              noteType: noteType || note.noteType,
              updatedAt: new Date().toISOString(),
            }
          : note
      ),
    }));

    try {
      const result = await updateNote(noteId, {
        content,
        noteType,
      });

      if (!result.success) {
        // Revert on error
        setState(prev => ({
          ...prev,
          notes: previousNotes,
          error: result.error || '수정 실패',
        }));
        return false;
      }

      return true;
    } catch {
      // Revert on error
      setState(prev => ({
        ...prev,
        notes: previousNotes,
        error: '노트 수정 중 오류 발생',
      }));
      return false;
    }
  }, [state.notes]);

  /**
   * Delete a note with optimistic update
   */
  const remove = useCallback(async (noteId: string): Promise<boolean> => {
    // Optimistic update
    const previousNotes = state.notes;
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId),
    }));

    try {
      const result = await deleteNote(noteId);

      if (!result.success) {
        // Revert on error
        setState(prev => ({
          ...prev,
          notes: previousNotes,
          error: result.error || '삭제 실패',
        }));
        return false;
      }

      return true;
    } catch {
      // Revert on error
      setState(prev => ({
        ...prev,
        notes: previousNotes,
        error: '노트 삭제 중 오류 발생',
      }));
      return false;
    }
  }, [state.notes]);

  return {
    ...state,
    create,
    update,
    remove,
    refetch: fetchNotes,
  };
}

export default useNotes;
