/**
 * useDashboardStats Hook
 *
 * Aggregates dashboard data from applications and calendar events
 */

import { useState, useEffect, useCallback } from 'react';
import { JobApplication, CalendarEvent, ApplicationStatus } from '@/types/job';
import { getApplications, getCalendarEvents } from '@/network/apis';

// mock fallback 제거 — API 실패 시 빈 통계로 정직하게 표시

interface SalaryStats {
  applicationsWithSalary: number;
  avgMinSalary: number;
  avgMaxSalary: number;
  minSalary: number;
  maxSalary: number;
}

interface DashboardStats {
  total: number;
  interested: number;
  applied: number;
  interview: number;
  result: number;
  passed: number;
  failed: number;
  passRate: number;
  salary: SalaryStats;
}

interface MonthlyTrend {
  month: string;
  applied: number;
  interview: number;
  passed: number;
}

interface UseDashboardStatsState {
  stats: DashboardStats;
  monthlyTrend: MonthlyTrend[];
  upcomingEvents: CalendarEvent[];
  recentApplications: JobApplication[];
  isLoading: boolean;
  error: string | null;
}

interface UseDashboardStatsReturn extends UseDashboardStatsState {
  refetch: () => void;
}

/**
 * Hook for fetching dashboard statistics and data
 *
 * Combines data from applications and calendar events APIs
 *
 * @example
 * ```tsx
 * const { stats, upcomingEvents, recentApplications, isLoading } = useDashboardStats();
 *
 * // Display stats
 * <div>Total: {stats.total}</div>
 * <div>Pass Rate: {stats.passRate}%</div>
 * ```
 */
/**
 * Parse salary range string to extract min/max values (in 만원)
 * Supports formats like: "5,000~6,000만원", "5000-6000", "연 5000만원", etc.
 */
function parseSalaryRange(salaryRange: string | undefined): { min: number; max: number } | null {
  if (!salaryRange) return null;

  // Remove common suffixes and whitespace
  const cleaned = salaryRange
    .replace(/[만원원]/g, '')
    .replace(/연/g, '')
    .replace(/\s/g, '')
    .replace(/,/g, '');

  // Try to find range patterns (5000~6000, 5000-6000)
  const rangeMatch = cleaned.match(/(\d+)[~\-](\d+)/);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1], 10),
      max: parseInt(rangeMatch[2], 10),
    };
  }

  // Try single number (5000)
  const singleMatch = cleaned.match(/(\d+)/);
  if (singleMatch) {
    const value = parseInt(singleMatch[1], 10);
    return { min: value, max: value };
  }

  return null;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [state, setState] = useState<UseDashboardStatsState>({
    stats: {
      total: 0,
      interested: 0,
      applied: 0,
      interview: 0,
      result: 0,
      passed: 0,
      failed: 0,
      passRate: 0,
      salary: {
        applicationsWithSalary: 0,
        avgMinSalary: 0,
        avgMaxSalary: 0,
        minSalary: 0,
        maxSalary: 0,
      },
    },
    monthlyTrend: [],
    upcomingEvents: [],
    recentApplications: [],
    isLoading: true,
    error: null,
  });

  const calculateStats = (applications: JobApplication[]): DashboardStats => {
    // Calculate salary statistics
    const salaryData: { min: number; max: number }[] = [];
    applications.forEach(app => {
      const parsed = parseSalaryRange(app.salaryRange);
      if (parsed) {
        salaryData.push(parsed);
      }
    });

    const salaryStats: SalaryStats = {
      applicationsWithSalary: salaryData.length,
      avgMinSalary: 0,
      avgMaxSalary: 0,
      minSalary: 0,
      maxSalary: 0,
    };

    if (salaryData.length > 0) {
      const totalMin = salaryData.reduce((sum, s) => sum + s.min, 0);
      const totalMax = salaryData.reduce((sum, s) => sum + s.max, 0);
      salaryStats.avgMinSalary = Math.round(totalMin / salaryData.length);
      salaryStats.avgMaxSalary = Math.round(totalMax / salaryData.length);
      salaryStats.minSalary = Math.min(...salaryData.map(s => s.min));
      salaryStats.maxSalary = Math.max(...salaryData.map(s => s.max));
    }

    const stats: DashboardStats = {
      total: applications.length,
      interested: applications.filter(a => a.status === 'interested').length,
      applied: applications.filter(a => a.status === 'applied').length,
      interview: applications.filter(a => a.status === 'interview').length,
      result: applications.filter(a => a.status === 'result').length,
      passed: applications.filter(a => a.result === 'passed').length,
      failed: applications.filter(a => a.result === 'failed').length,
      passRate: 0,
      salary: salaryStats,
    };

    stats.passRate = stats.result > 0
      ? Math.round((stats.passed / stats.result) * 100)
      : 0;

    return stats;
  };

  const calculateMonthlyTrend = (applications: JobApplication[]): MonthlyTrend[] => {
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const now = new Date();
    const monthlyData: Map<string, MonthlyTrend> = new Map();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyData.set(key, {
        month: monthNames[date.getMonth()],
        applied: 0,
        interview: 0,
        passed: 0,
      });
    }

    // Aggregate data
    applications.forEach(app => {
      const appDate = new Date(app.appliedAt || app.createdAt);
      const key = `${appDate.getFullYear()}-${appDate.getMonth()}`;

      if (monthlyData.has(key)) {
        const data = monthlyData.get(key)!;
        data.applied++;
        if (app.status === 'interview' || app.status === 'result') {
          data.interview++;
        }
        if (app.result === 'passed') {
          data.passed++;
        }
      }
    });

    return Array.from(monthlyData.values());
  };

  // DRY: 공통 데이터 가공 로직 추출
  const processDashboardData = (
    applications: JobApplication[],
    events: CalendarEvent[]
  ): Omit<UseDashboardStatsState, 'isLoading' | 'error'> => {
    const stats = calculateStats(applications);
    const monthlyTrend = calculateMonthlyTrend(applications);

    const upcomingEvents = events
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    const recentApplications = [...applications]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);

    return { stats, monthlyTrend, upcomingEvents, recentApplications };
  };

  const fetchDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get date range for upcoming events (today + 30 days)
      const today = new Date();
      const thirtyDaysLater = new Date(today);
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

      const [applicationsResult, eventsResult] = await Promise.all([
        getApplications({ limit: 100 }),
        getCalendarEvents({
          startDate: today.toISOString().split('T')[0],
          endDate: thirtyDaysLater.toISOString().split('T')[0],
        }),
      ]);

      let applications: JobApplication[] = [];
      let events: CalendarEvent[] = [];

      // Process applications — 실패 시 빈 배열 (정직한 0 통계)
      if (applicationsResult.success && applicationsResult.data) {
        applications = applicationsResult.data.data;
      }

      // Process events — 실패 시 빈 배열
      if (eventsResult.success && eventsResult.data) {
        events = eventsResult.data;
      }

      // Process and set dashboard data (0 통계라도 processDashboardData 가 안전하게 처리)
      const processedData = processDashboardData(applications, events);
      setState({ ...processedData, isLoading: false, error: null });
    } catch {
      const processedData = processDashboardData([], []);
      setState({ ...processedData, isLoading: false, error: '대시보드 데이터를 불러오지 못했어요.' });
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...state,
    refetch: fetchDashboardData,
  };
}

export default useDashboardStats;
