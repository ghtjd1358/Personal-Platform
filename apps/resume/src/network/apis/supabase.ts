import { getSupabase } from '@sonhoseong/mfa-lib'
import type { ExperienceInput, PortfolioInput } from './types'

// Experiences CRUD
export const experiencesApi = {
    getAll: () => getSupabase().from('experiences').select('*').order('order_index'),
    getByUserId: (userId: string) => getSupabase().from('experiences').select('*').eq('user_id', userId).order('order_index'),
    getById: (id: string) => getSupabase().from('experiences').select('*').eq('id', id).single(),
    create: (data: ExperienceInput) => getSupabase().from('experiences').insert(data).select().single(),
    update: (id: string, data: Partial<ExperienceInput>) => getSupabase().from('experiences').update(data).eq('id', id).select().single(),
    delete: (id: string) => getSupabase().from('experiences').delete().eq('id', id),
}

// Portfolios CRUD
export const portfoliosApi = {
    getAll: () => getSupabase().from('portfolios').select('*').order('order_index'),
    getByUserId: (userId: string) => getSupabase().from('portfolios').select('*').eq('user_id', userId).order('order_index'),
    getById: (id: string) => getSupabase().from('portfolios').select('*').eq('id', id).single(),
    create: (data: PortfolioInput) => getSupabase().from('portfolios').insert(data).select().single(),
    update: (id: string, data: Partial<PortfolioInput>) => getSupabase().from('portfolios').update(data).eq('id', id).select().single(),
    delete: (id: string) => getSupabase().from('portfolios').delete().eq('id', id),
}
