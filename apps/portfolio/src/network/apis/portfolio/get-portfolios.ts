import { supabaseAxios } from '../../axios-instance';
import { ApiResponse, PageListResponse } from '../common';
import { PortfolioSearchCondition, PortfolioSummary } from './types';

/**
 * 포트폴리오 목록을 조회합니다.
 * Supabase REST API (PostgREST) 사용
 */
export async function getPortfolios(
  params: PortfolioSearchCondition = {}
): Promise<ApiResponse<PageListResponse<PortfolioSummary>>> {
  try {
    const { page = 1, limit = 12, categoryId, status, isFeatured, isPublic, search, userId } = params;
    const offset = (page - 1) * limit;

    // PostgREST 쿼리 파라미터 구성
    const queryParams: Record<string, string> = {
      select: `*,category:portfolio_categories(id,name,slug,description),tags:portfolio_tags(id,tag,order_index),detail:portfolio_details(*),techStack:portfolio_tech_stack(id,name,icon,icon_color,order_index)`,
      order: 'is_featured.desc,order_index.asc',
    };

    // 필터 조건 추가
    const filters: string[] = [];

    // 공개 여부 필터
    if (isPublic !== undefined) {
      filters.push(`is_public=eq.${isPublic}`);
    } else {
      filters.push('is_public=eq.true');
    }

    // 상태 필터
    if (status) {
      filters.push(`status=eq.${status}`);
    }

    // 카테고리 필터
    if (categoryId) {
      filters.push(`category_id=eq.${categoryId}`);
    }

    // 사용자 필터
    if (userId) {
      filters.push(`user_id=eq.${userId}`);
    }

    // 추천 필터
    if (isFeatured !== undefined) {
      filters.push(`is_featured=eq.${isFeatured}`);
    }

    // 검색어 필터
    if (search) {
      filters.push(`or=(title.ilike.*${search}*,description.ilike.*${search}*)`);
    }

    // URL 구성
    const filterString = filters.join('&');
    const url = `/portfolios?${filterString}`;

    const response = await supabaseAxios.get<PortfolioSummary[]>(url, {
      params: queryParams,
      headers: {
        'Range': `${offset}-${offset + limit - 1}`,
        'Prefer': 'count=exact',
      },
    });

    // Content-Range 헤더에서 총 개수 추출 (예: "0-11/25")
    const contentRange = response.headers['content-range'];
    let total = 0;
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)/);
      if (match) {
        total = parseInt(match[1], 10);
      }
    }

    return {
      success: true,
      data: {
        data: response.data || [],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err: any) {
    console.error('Error fetching portfolios:', err);
    return {
      success: false,
      error: err.response?.data?.message || '포트폴리오 목록 조회 중 오류가 발생했습니다.'
    };
  }
}
