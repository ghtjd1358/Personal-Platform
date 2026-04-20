/**
 * useApplications Hook
 *
 * Manages job application state with CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import { JobApplication, ApplicationStatus, ApplicationResult } from '@/types/job';
import {
  getApplications,
  createApplication,
  updateApplicationStatus,
  updateApplicationResult,
  deleteApplication,
  CreateApplicationInput,
} from '@/network/apis';

// Import mock data as fallback
import { mockApplications } from '@/data/mockJobs';

interface UseApplicationsState {
  applications: JobApplication[];
  isLoading: boolean;
  error: string | null;
}

interface UseApplicationsReturn extends UseApplicationsState {
  // CRUD operations
  create: (input: CreateApplicationInput) => Promise<JobApplication | null>;
  updateStatus: (appId: string, status: ApplicationStatus) => Promise<boolean>;
  updateResult: (appId: string, result: ApplicationResult) => Promise<boolean>;
  remove: (appId: string) => Promise<boolean>;
  refetch: () => void;

  // Computed helpers
  getByStatus: (status: ApplicationStatus) => JobApplication[];
}

/**
 * Hook for managing job applications with optimistic updates
 *
 * @example
 * ```tsx
 * const { applications, updateStatus, getByStatus } = useApplications();
 *
 * // Get applications by status for Kanban columns
 * const interviewApps = getByStatus('interview');
 *
 * // Update status on drag-and-drop
 * const handleDrop = async (appId: string, newStatus: ApplicationStatus) => {
 *   await updateStatus(appId, newStatus);
 * };
 * ```
 */
export function useApplications(): UseApplicationsReturn {
  const [state, setState] = useState<UseApplicationsState>({
    applications: [],
    isLoading: true,
    error: null,
  });

  const fetchApplications = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getApplications();

      if (result.success && result.data) {
        setState({
          applications: result.data.data,
          isLoading: false,
          error: null,
        });
      } else {
        // Fallback to mock data
        setState({
          applications: mockApplications,
          isLoading: false,
          error: null,
        });
      }
    } catch {
      // Fallback to mock data
      setState({
        applications: mockApplications,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /**
   * Create a new application
   */
  const create = useCallback(async (input: CreateApplicationInput): Promise<JobApplication | null> => {
    try {
      const result = await createApplication(input);

      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          applications: [result.data!, ...prev.applications],
        }));
        return result.data;
      } else {
        setState(prev => ({ ...prev, error: result.error || '생성 실패' }));
        return null;
      }
    } catch {
      setState(prev => ({ ...prev, error: '지원 현황 생성 중 오류 발생' }));
      return null;
    }
  }, []);

  /**
   * Update application status with optimistic update
   */
  const updateStatus = useCallback(async (
    appId: string,
    status: ApplicationStatus
  ): Promise<boolean> => {
    // Optimistic update
    const previousApps = state.applications;
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(app =>
        app.id === appId
          ? { ...app, status, updatedAt: new Date().toISOString() }
          : app
      ),
    }));

    try {
      const result = await updateApplicationStatus(appId, status);

      if (!result.success) {
        // Revert on error
        setState(prev => ({
          ...prev,
          applications: previousApps,
          error: result.error || '상태 변경 실패',
        }));
        return false;
      }

      return true;
    } catch {
      // Revert on error
      setState(prev => ({
        ...prev,
        applications: previousApps,
        error: '상태 변경 중 오류 발생',
      }));
      return false;
    }
  }, [state.applications]);

  /**
   * Update application result with optimistic update
   */
  const updateResult = useCallback(async (
    appId: string,
    result: ApplicationResult
  ): Promise<boolean> => {
    // Optimistic update
    const previousApps = state.applications;
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(app =>
        app.id === appId
          ? { ...app, result, updatedAt: new Date().toISOString() }
          : app
      ),
    }));

    try {
      const apiResult = await updateApplicationResult(appId, result);

      if (!apiResult.success) {
        // Revert on error
        setState(prev => ({
          ...prev,
          applications: previousApps,
          error: apiResult.error || '결과 변경 실패',
        }));
        return false;
      }

      return true;
    } catch {
      // Revert on error
      setState(prev => ({
        ...prev,
        applications: previousApps,
        error: '결과 변경 중 오류 발생',
      }));
      return false;
    }
  }, [state.applications]);

  /**
   * Delete an application
   */
  const remove = useCallback(async (appId: string): Promise<boolean> => {
    // Optimistic update
    const previousApps = state.applications;
    setState(prev => ({
      ...prev,
      applications: prev.applications.filter(app => app.id !== appId),
    }));

    try {
      const result = await deleteApplication(appId);

      if (!result.success) {
        // Revert on error
        setState(prev => ({
          ...prev,
          applications: previousApps,
          error: result.error || '삭제 실패',
        }));
        return false;
      }

      return true;
    } catch {
      // Revert on error
      setState(prev => ({
        ...prev,
        applications: previousApps,
        error: '삭제 중 오류 발생',
      }));
      return false;
    }
  }, [state.applications]);

  /**
   * Get applications filtered by status
   */
  const getByStatus = useCallback(
    (status: ApplicationStatus) => state.applications.filter(app => app.status === status),
    [state.applications]
  );

  return {
    ...state,
    create,
    updateStatus,
    updateResult,
    remove,
    refetch: fetchApplications,
    getByStatus,
  };
}

export default useApplications;
