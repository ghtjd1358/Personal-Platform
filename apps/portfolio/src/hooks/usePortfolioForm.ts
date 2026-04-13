import { useState, useCallback } from 'react';

/** 기술 스택 아이템 */
export interface TechStackItem {
  name: string;
  icon?: string;
  icon_color?: string;
}

/** 포트폴리오 폼 데이터 */
export interface PortfolioFormData {
  // 기본 정보
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  badge: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isPublic: boolean;
  demoUrl: string;
  githubUrl: string;

  // 상세 정보
  role: string;
  teamSize: string;
  duration: string;
  period: string;
  overview: string;
  challenge: string;
  solution: string;
  outcome: string;

  // 태그 & 기술
  tagsInput: string;
  techStack: TechStackItem[];
}

/** 폼 초기값 */
export const INITIAL_FORM_DATA: PortfolioFormData = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  coverImage: '',
  badge: '',
  status: 'draft',
  isFeatured: false,
  isPublic: true,
  demoUrl: '',
  githubUrl: '',
  role: '',
  teamSize: '',
  duration: '',
  period: '',
  overview: '',
  challenge: '',
  solution: '',
  outcome: '',
  tagsInput: '',
  techStack: [],
};

interface UsePortfolioFormReturn {
  formData: PortfolioFormData;
  setFormData: React.Dispatch<React.SetStateAction<PortfolioFormData>>;
  updateField: <K extends keyof PortfolioFormData>(field: K, value: PortfolioFormData[K]) => void;
  resetForm: () => void;
  addTechStack: (name: string) => void;
  removeTechStack: (index: number) => void;
  generateSlug: (text: string) => string;
}

/**
 * 포트폴리오 폼 상태 관리 훅
 */
export function usePortfolioForm(initialData?: Partial<PortfolioFormData>): UsePortfolioFormReturn {
  const [formData, setFormData] = useState<PortfolioFormData>({
    ...INITIAL_FORM_DATA,
    ...initialData,
  });

  const updateField = useCallback(<K extends keyof PortfolioFormData>(
    field: K,
    value: PortfolioFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const addTechStack = useCallback((name: string) => {
    if (name.trim()) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, { name: name.trim() }],
      }));
    }
  }, []);

  const removeTechStack = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index),
    }));
  }, []);

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  }, []);

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    addTechStack,
    removeTechStack,
    generateSlug,
  };
}
