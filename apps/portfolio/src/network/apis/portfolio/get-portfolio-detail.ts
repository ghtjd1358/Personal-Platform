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
 * 포트폴리오 상세 정보를 조회합니다.
 */
export async function getPortfolioDetail(
  slug: string
): Promise<ApiResponse<PortfolioSummary>> {
  try {
    const url = `/portfolios?slug=eq.${slug}&is_public=eq.true`;
    const queryParams = {
      select: `*,category:portfolio_categories(id,name,slug,description),tags:portfolio_tags(id,tag,order_index),detail:portfolio_details(*),techStack:portfolio_tech_stack(id,name,icon,icon_color,order_index)`,
    };

    const response = await supabaseAxios.get<PortfolioSummary[]>(url, {
      params: queryParams,
    });

    if (!response.data || response.data.length === 0) {
      return {
        success: false,
        error: '포트폴리오를 찾을 수 없습니다.',
      };
    }

    return {
      success: true,
      data: response.data[0],
    };
  } catch (err) {
    console.error('Error fetching portfolio detail:', err);
    return {
      success: false,
      error: getErrorMessage(err, '포트폴리오 조회 중 오류가 발생했습니다.'),
    };
  }
}

/**
 * 포트폴리오를 ID로 조회합니다. (편집용)
 */
export async function getPortfolioById(
  id: string
): Promise<ApiResponse<PortfolioSummary>> {
  try {
    const url = `/portfolios?id=eq.${id}`;
    const queryParams = {
      select: `*,category:portfolio_categories(id,name,slug,description),tags:portfolio_tags(id,tag,order_index),detail:portfolio_details(*),techStack:portfolio_tech_stack(id,name,icon,icon_color,order_index)`,
    };

    const response = await supabaseAxios.get<PortfolioSummary[]>(url, {
      params: queryParams,
    });

    if (!response.data || response.data.length === 0) {
      return {
        success: false,
        error: '포트폴리오를 찾을 수 없습니다.',
      };
    }

    return {
      success: true,
      data: response.data[0],
    };
  } catch (err) {
    console.error('Error fetching portfolio by ID:', err);
    return {
      success: false,
      error: getErrorMessage(err, '포트폴리오 조회 중 오류가 발생했습니다.'),
    };
  }
}

/**
 * 포트폴리오 조회수를 증가시킵니다.
 */
export async function incrementViewCount(
  portfolioId: string
): Promise<ApiResponse<void>> {
  try {
    // RPC 함수 호출 또는 직접 업데이트
    await supabaseAxios.patch(`/portfolios?id=eq.${portfolioId}`, {
      view_count: { increment: 1 },
    });

    return { success: true, data: undefined };
  } catch (err) {
    // 조회수 증가 실패는 무시
    console.warn('Failed to increment view count:', err);
    return { success: true, data: undefined };
  }
}
