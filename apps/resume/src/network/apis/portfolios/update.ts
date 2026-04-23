import { getSupabase } from '@sonhoseong/mfa-lib';
import type { PortfolioInput } from '../types';

export const update = (id: string, data: Partial<PortfolioInput>) =>
    getSupabase().from('portfolios').update(data).eq('id', id).select().single();
