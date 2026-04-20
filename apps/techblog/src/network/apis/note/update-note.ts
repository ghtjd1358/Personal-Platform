/**
 * Update Note API
 *
 * Updates an existing note
 */

import { JobNote, NoteType } from '@/types/job';
import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

export interface UpdateNoteInput {
  content?: string;
  noteType?: NoteType;
}

/**
 * Update a note
 *
 * @example
 * ```ts
 * const result = await updateNote('note-1', {
 *   content: '<p>Updated content</p>'
 * });
 * ```
 */
export async function updateNote(
  noteId: string,
  input: UpdateNoteInput
): Promise<ApiResponse<JobNote>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const updateData: Record<string, unknown> = {};

    if (input.content !== undefined) updateData.content = input.content;
    if (input.noteType !== undefined) updateData.note_type = input.noteType;

    const { data, error } = await supabase
      .from('job_notes')
      .update(updateData)
      .eq('id', noteId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('updateNote error:', error);
      return errorResponse(error.message);
    }

    if (!data) {
      return errorResponse('노트를 찾을 수 없습니다');
    }

    const note: JobNote = {
      id: data.id,
      applicationId: data.application_id,
      userId: data.user_id,
      content: data.content,
      noteType: data.note_type as NoteType,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return successResponse(note);
  } catch (err) {
    console.error('updateNote exception:', err);
    return errorResponse('노트 수정에 실패했습니다');
  }
}
