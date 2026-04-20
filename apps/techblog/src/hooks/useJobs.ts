/**
 * useJobs Hook
 *
 * Manages job listing data with search, filter, and pagination
 */

import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/types/job';
import {
  getJobs,
  getJobLocations,
  getJobSkills,
  JobSearchParams,
} from '@/network/apis';

// Import mock data as fallback
import { mockJobs } from '@/data/mockJobs';

interface UseJobsState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  locations: string[];
  skills: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseJobsParams {
  search?: string;
  location?: string;
  skill?: string;
  page?: number;
  limit?: number;
}

interface UseJobsReturn extends UseJobsState {
  setSearch: (search: string) => void;
  setLocation: (location: string) => void;
  setSkill: (skill: string) => void;
  setPage: (page: number) => void;
  refetch: () => void;
  currentSearch: string;
  currentLocation: string;
  currentSkill: string;
}

/**
 * Hook for fetching and managing job listings
 */
export function useJobs(initialParams: UseJobsParams = {}): UseJobsReturn {
  const [search, setSearch] = useState(initialParams.search || '');
  const [location, setLocation] = useState(initialParams.location || '전체');
  const [skill, setSkill] = useState(initialParams.skill || '전체');
  const [page, setPage] = useState(initialParams.page || 1);
  const limit = initialParams.limit || 20;

  const [state, setState] = useState<UseJobsState>({
    jobs: [],
    isLoading: true,
    error: null,
    locations: ['전체'],
    skills: ['전체'],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  });

  const fetchJobs = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params: JobSearchParams = {
        search: search || undefined,
        location: location !== '전체' ? location : undefined,
        skill: skill !== '전체' ? skill : undefined,
        page,
        limit,
      };

      const result = await getJobs(params);

      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          jobs: result.data!.data,
          pagination: {
            page: result.data!.page,
            limit: result.data!.limit,
            total: result.data!.total,
            totalPages: result.data!.totalPages,
          },
          isLoading: false,
        }));
      } else {
        // Fallback to mock data
        const filteredMock = filterMockJobs(mockJobs, { search, location, skill });
        setState(prev => ({
          ...prev,
          jobs: filteredMock,
          pagination: { page: 1, limit: filteredMock.length, total: filteredMock.length, totalPages: 1 },
          isLoading: false,
        }));
      }
    } catch {
      const filteredMock = filterMockJobs(mockJobs, { search, location, skill });
      setState(prev => ({
        ...prev,
        jobs: filteredMock,
        pagination: { page: 1, limit: filteredMock.length, total: filteredMock.length, totalPages: 1 },
        isLoading: false,
      }));
    }
  }, [search, location, skill, page, limit]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const [locationsResult, skillsResult] = await Promise.all([
        getJobLocations(),
        getJobSkills(),
      ]);

      if (locationsResult.success) {
        setState(prev => ({ ...prev, locations: locationsResult.data! }));
      } else {
        const locs = [...new Set(mockJobs.map(job => job.location.split(' ')[0]))];
        setState(prev => ({ ...prev, locations: ['전체', ...locs] }));
      }

      if (skillsResult.success) {
        setState(prev => ({ ...prev, skills: skillsResult.data! }));
      } else {
        const allSkills = [...new Set(mockJobs.flatMap(job => job.skills))].slice(0, 15);
        setState(prev => ({ ...prev, skills: ['전체', ...allSkills] }));
      }
    } catch {
      const locs = [...new Set(mockJobs.map(job => job.location.split(' ')[0]))];
      const allSkills = [...new Set(mockJobs.flatMap(job => job.skills))].slice(0, 15);
      setState(prev => ({ ...prev, locations: ['전체', ...locs], skills: ['전체', ...allSkills] }));
    }
  }, []);

  useEffect(() => { fetchFilterOptions(); }, [fetchFilterOptions]);
  useEffect(() => { fetchJobs(); }, [fetchJobs]);
  useEffect(() => { setPage(1); }, [search, location, skill]);

  return {
    ...state,
    setSearch,
    setLocation,
    setSkill,
    setPage,
    refetch: fetchJobs,
    currentSearch: search,
    currentLocation: location,
    currentSkill: skill,
  };
}

function filterMockJobs(jobs: Job[], { search, location, skill }: { search: string; location: string; skill: string }): Job[] {
  return jobs.filter(job => {
    const matchesQuery = !search || job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.position.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesLocation = location === '전체' || job.location.includes(location);
    const matchesSkill = skill === '전체' || job.skills.includes(skill);
    return matchesQuery && matchesLocation && matchesSkill;
  });
}

export default useJobs;
