/**
 * Create Note API
 *
 * Creates a new note for a job application
 */

import { JobNote, NoteType } from '@/types/job';
import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

export interface CreateNoteInput {
  applicationId: string;
  content: string;
  noteType: NoteType;
}

/**
 * Create a new note
 *
 * @example
 * ```ts
 * const result = await createNote({
 *   applicationId: 'app-1',
 *   content: '<p>면접 준비 사항</p>',
 *   noteType: 'interview'
 * });
 * ```
 */
export async function createNote(
  input: CreateNoteInput
): Promise<ApiResponse<JobNote>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const insertData = {
      user_id: user.id,
      application_id: input.applicationId,
      content: input.content,
      note_type: input.noteType,
    };

    const { data, error } = await supabase
      .from('job_notes')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('createNote error:', error);
      return errorResponse(error.message);
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
    console.error('createNote exception:', err);
    return errorResponse('노트 생성에 실패했습니다');
  }
}
