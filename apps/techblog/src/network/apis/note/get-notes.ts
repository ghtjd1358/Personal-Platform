/**
 * Get Notes API
 *
 * Fetches notes for a specific job application
 */

import { JobNote, NoteType } from '@/types/job';
import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

/**
 * Get notes for a specific application
 *
 * @example
 * ```ts
 * const result = await getNotesByApplicationId('app-1');
 * if (result.success) {
 *   console.log(result.data); // JobNote[]
 * }
 * ```
 */
export async function getNotesByApplicationId(
  applicationId: string
): Promise<ApiResponse<JobNote[]>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const { data, error } = await supabase
      .from('job_notes')
      .select('*')
      .eq('application_id', applicationId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getNotesByApplicationId error:', error);
      return errorResponse(error.message);
    }

    const notes: JobNote[] = (data || []).map(row => ({
      id: row.id,
      applicationId: row.application_id,
      userId: row.user_id,
      content: row.content,
      noteType: row.note_type as NoteType,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return successResponse(notes);
  } catch (err) {
    console.error('getNotesByApplicationId exception:', err);
    return errorResponse('노트를 불러오는데 실패했습니다');
  }
}

/**
 * Get a single note by ID
 */
export async function getNoteById(
  noteId: string
): Promise<ApiResponse<JobNote>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const { data, error } = await supabase
      .from('job_notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('getNoteById error:', error);
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
    console.error('getNoteById exception:', err);
    return errorResponse('노트를 불러오는데 실패했습니다');
  }
}
