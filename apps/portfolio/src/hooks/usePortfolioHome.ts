import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from '@sonhoseong/mfa-lib';
import { usePortfolios } from '@/pages/home/hooks';
import { PortfolioSummary } from '@/network/apis/portfolio/types';
import AOS from 'aos';

export type SortField = 'date' | 'views' | 'title';
export type SortDir = 'desc' | 'asc';
export type ColsOpt = 1 | 2 | 3;

export function usePortfolioHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedNotion, setSelectedNotion] = useState<{ url: string; title: string } | null>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [cols, setCols] = useState<ColsOpt>(1);

  const { portfolios, loading } = usePortfolios();

  const allTechStacks = useMemo(() => {
    const techSet = new Set<string>();
    portfolios.forEach(p => p.techStack?.forEach(t => techSet.add(t.name)));
    return Array.from(techSet).sort();
  }, [portfolios]);

  const filteredProjects = useMemo(() => {
    let projects = [...portfolios];

    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        p.techStack?.some(t => t.name.toLowerCase().includes(q)) ||
        p.tags?.some(t => (typeof t === 'string' ? t : t.tag).toLowerCase().includes(q))
      );
    }

    if (selectedTech) {
      projects = projects.filter(p => p.techStack?.some(t => t.name === selectedTech));
    }

    switch (sortField) {
      case 'views':
        projects.sort((a, b) => { const d = (b.view_count || 0) - (a.view_count || 0); return sortDir === 'desc' ? d : -d; });
        break;
      case 'title':
        projects.sort((a, b) => { const d = a.title.localeCompare(b.title, 'ko'); return sortDir === 'asc' ? d : -d; });
        break;
      default:
        projects.sort((a, b) => { const d = new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(); return sortDir === 'desc' ? d : -d; });
    }

    return projects;
  }, [portfolios, debouncedSearchQuery, selectedTech, sortField, sortDir]);

  const isFiltering = Boolean(debouncedSearchQuery.trim() || selectedTech);

  const gridProjects = useMemo(() => {
    const base = isFiltering ? filteredProjects : [...filteredProjects.filter(p => p.is_featured), ...filteredProjects.filter(p => !p.is_featured)];
    return [...base.filter(p => p.badge !== '토이'), ...base.filter(p => p.badge === '토이')];
  }, [filteredProjects, isFiltering]);

  const totalViews = useMemo(() => portfolios.reduce((s, p) => s + (p.view_count || 0), 0), [portfolios]);
  const totalLikes = useMemo(() => portfolios.reduce((s, p) => s + (p.like_count || 0), 0), [portfolios]);
  const daysRunning = useMemo(() => {
    if (!portfolios.length) return 0;
    const earliest = portfolios.reduce<number>((min, p) => {
      const t = p.created_at ? new Date(p.created_at).getTime() : Infinity;
      return Math.min(min, t);
    }, Infinity);
    return isFinite(earliest) ? Math.max(1, Math.floor((Date.now() - earliest) / 86400000)) : 0;
  }, [portfolios]);

  useEffect(() => {
    if (!loading && portfolios.length > 0) AOS.refreshHard();
  }, [loading, portfolios, cols, debouncedSearchQuery, selectedTech, sortField, sortDir]);

  return {
    searchQuery, setSearchQuery,
    selectedTech, setSelectedTech,
    selectedNotion, setSelectedNotion,
    selectedPortfolioId, setSelectedPortfolioId,
    sortField, setSortField,
    sortDir, setSortDir,
    cols, setCols,
    portfolios, loading,
    allTechStacks,
    filteredProjects,
    gridProjects,
    isFiltering,
    totalViews, totalLikes, daysRunning,
  };
}
