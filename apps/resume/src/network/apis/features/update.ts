import { getSupabase } from '@sonhoseong/mfa-lib';
import type { FeatureInput } from '../types';

export const update = (id: string, data: Partial<FeatureInput>) =>
    getSupabase().from('features').update(data).eq('id', id).select().single();
