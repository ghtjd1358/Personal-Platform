import { supabaseAxios } from '../../axios-instance';
import { isAxiosError } from '../../axios-factory';
import { ApiResponse } from '../common';
import { PortfolioSummary } from './types';

/** Axios 에러에서 메시지 추출 */
function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    return err.response?.data?.message || fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

/**
 * 포트폴리오 생성 요청 타입
 */
export interface CreatePortfolioRequest {
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  cover_image?: string;
  badge?: string;
  category_id?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  is_public?: boolean;
  demo_url?: string;
  github_url?: string;
  order_index?: number;
  detail?: {
    role?: string;
    team_size?: number;
    duration?: string;
    period?: string;
    client?: string;
    overview?: string;
    challenge?: string;
    solution?: string;
    outcome?: string;
  };
  tags?: string[];
  techStack?: Array<{
    name: string;
    icon?: string;
    icon_color?: string;
  }>;
}

/**
 * 포트폴리오 수정 요청 타입
 */
export interface UpdatePortfolioRequest extends Partial<CreatePortfolioRequest> {
  id: string;
}

/**
 * 새 포트폴리오를 생성합니다.
 */
export async function createPortfolio(
  request: CreatePortfolioRequest
): Promise<ApiResponse<PortfolioSummary>> {
  try {
    const { detail, tags, techStack, ...portfolioData } = request;

    // 1. 포트폴리오 기본 정보 생성
    const { data: portfolio, status } = await supabaseAxios.post<PortfolioSummary[]>(
      '/portfolios',
      portfolioData,
      {
        headers: {
          'Prefer': 'return=representation',
        },
      }
    );

    if (!portfolio || portfolio.length === 0) {
      return { success: false, error: '포트폴리오 생성에 실패했습니다.' };
    }

    const createdPortfolio = portfolio[0];

    // 2. 상세 정보 생성
    if (detail) {
      await supabaseAxios.post('/portfolio_details', {
        portfolio_id: createdPortfolio.id,
        ...detail,
      });
    }

    // 3. 태그 생성
    if (tags && tags.length > 0) {
      const tagData = tags.map((tag, index) => ({
        portfolio_id: createdPortfolio.id,
        tag,
        order_index: index,
      }));
      await supabaseAxios.post('/portfolio_tags', tagData);
    }

    // 4. 기술 스택 생성
    if (techStack && techStack.length > 0) {
      const techData = techStack.map((tech, index) => ({
        portfolio_id: createdPortfolio.id,
        name: tech.name,
        icon: tech.icon,
        icon_color: tech.icon_color,
        order_index: index,
      }));
      await supabaseAxios.post('/portfolio_tech_stack', techData);
    }

    return { success: true, data: createdPortfolio };
  } catch (err) {
    console.error('Error creating portfolio:', err);
    return {
      success: false,
      error: getErrorMessage(err, '포트폴리오 생성 중 오류가 발생했습니다.'),
    };
  }
}

/**
 * 포트폴리오를 수정합니다.
 */
export async function updatePortfolio(
  request: UpdatePortfolioRequest
): Promise<ApiResponse<PortfolioSummary>> {
  try {
    const { id, detail, tags, techStack, ...portfolioData } = request;

    // 1. 포트폴리오 기본 정보 수정
    if (Object.keys(portfolioData).length > 0) {
      await supabaseAxios.patch(`/portfolios?id=eq.${id}`, portfolioData);
    }

    // 2. 상세 정보 수정 (upsert)
    if (detail) {
      // 기존 상세 정보 삭제 후 재생성
      await supabaseAxios.delete(`/portfolio_details?portfolio_id=eq.${id}`);
      await supabaseAxios.post('/portfolio_details', {
        portfolio_id: id,
        ...detail,
      });
    }

    // 3. 태그 수정 (전체 교체)
    if (tags !== undefined) {
      await supabaseAxios.delete(`/portfolio_tags?portfolio_id=eq.${id}`);
      if (tags.length > 0) {
        const tagData = tags.map((tag, index) => ({
          portfolio_id: id,
          tag,
          order_index: index,
        }));
        await supabaseAxios.post('/portfolio_tags', tagData);
      }
    }

    // 4. 기술 스택 수정 (전체 교체)
    if (techStack !== undefined) {
      await supabaseAxios.delete(`/portfolio_tech_stack?portfolio_id=eq.${id}`);
      if (techStack.length > 0) {
        const techData = techStack.map((tech, index) => ({
          portfolio_id: id,
          name: tech.name,
          icon: tech.icon,
          icon_color: tech.icon_color,
          order_index: index,
        }));
        await supabaseAxios.post('/portfolio_tech_stack', techData);
      }
    }

    // 수정된 포트폴리오 조회
    const { data } = await supabaseAxios.get<PortfolioSummary[]>(
      `/portfolios?id=eq.${id}`,
      {
        params: {
          select: `*,category:portfolio_categories(id,name,slug,description),tags:portfolio_tags(id,tag,order_index),detail:portfolio_details(*),techStack:portfolio_tech_stack(id,name,icon,icon_color,order_index)`,
        },
      }
    );

    if (!data || data.length === 0) {
      return { success: false, error: '포트폴리오를 찾을 수 없습니다.' };
    }

    return { success: true, data: data[0] };
  } catch (err) {
    console.error('Error updating portfolio:', err);
    return {
      success: false,
      error: getErrorMessage(err, '포트폴리오 수정 중 오류가 발생했습니다.'),
    };
  }
}

/**
 * 포트폴리오를 삭제합니다.
 */
export async function deletePortfolio(
  portfolioId: string
): Promise<ApiResponse<void>> {
  try {
    // 관련 데이터 먼저 삭제 (FK 제약 조건 때문)
    await Promise.all([
      supabaseAxios.delete(`/portfolio_details?portfolio_id=eq.${portfolioId}`),
      supabaseAxios.delete(`/portfolio_tags?portfolio_id=eq.${portfolioId}`),
      supabaseAxios.delete(`/portfolio_tech_stack?portfolio_id=eq.${portfolioId}`),
      supabaseAxios.delete(`/portfolio_comments?portfolio_id=eq.${portfolioId}`),
    ]);

    // 포트폴리오 삭제
    await supabaseAxios.delete(`/portfolios?id=eq.${portfolioId}`);

    return { success: true, data: undefined };
  } catch (err) {
    console.error('Error deleting portfolio:', err);
    return {
      success: false,
      error: getErrorMessage(err, '포트폴리오 삭제 중 오류가 발생했습니다.'),
    };
  }
}

/**
 * 내 포트폴리오 목록을 조회합니다.
 */
export async function getMyPortfolios(
  userId: string
): Promise<ApiResponse<PortfolioSummary[]>> {
  try {
    const { data } = await supabaseAxios.get<PortfolioSummary[]>(
      `/portfolios?user_id=eq.${userId}`,
      {
        params: {
          select: `*,category:portfolio_categories(id,name,slug,description),tags:portfolio_tags(id,tag,order_index),detail:portfolio_details(*),techStack:portfolio_tech_stack(id,name,icon,icon_color,order_index)`,
          order: 'created_at.desc',
        },
      }
    );

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Error fetching my portfolios:', err);
    return {
      success: false,
      error: getErrorMessage(err, '포트폴리오 목록 조회 중 오류가 발생했습니다.'),
    };
  }
}
