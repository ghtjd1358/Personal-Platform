import { getSupabase } from '@sonhoseong/mfa-lib';
import type { PortfolioInput } from '../types';

/**
 * portfolio 생성.
 * slug 는 DB NOT NULL — client 가 안 주면 title 기반 auto-slug + timestamp suffix.
 * 공백/특수문자 제거한 ASCII slug 가 3자 미만이면 'proj-{ts}' fallback.
 */
export const create = (data: PortfolioInput) => {
    const autoSlug = (() => {
        if (data.slug) return data.slug;
        const ascii = (data.title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        const suffix = Date.now().toString(36).slice(-5);
        return ascii.length >= 3 ? `${ascii}-${suffix}` : `proj-${suffix}`;
    })();
    return getSupabase()
        .from('portfolios')
        .insert({ ...data, slug: autoSlug })
        .select()
        .single();
};
