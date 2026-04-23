/**
 * portfolios 도메인 barrel — `portfoliosApi.xxx` 호출 호환 유지용 aggregator.
 * 각 메서드는 자기 파일에 분리 (한 파일 = 한 기능).
 */
import { getAll } from './getAll';
import { getByUserId } from './getByUserId';
import { getByResumeId } from './getByResumeId';
import { getById } from './getById';
import { getByResumeIdWithDetails } from './getByResumeIdWithDetails';
import { getByIdWithDetails } from './getByIdWithDetails';
import { countByResumeId } from './countByResumeId';
import { create } from './create';
import { update } from './update';
import { remove } from './remove';
import { replaceChildren } from './replaceChildren';

export const portfoliosApi = {
    getAll,
    getByUserId,
    getByResumeId,
    getById,
    getByResumeIdWithDetails,
    getByIdWithDetails,
    countByResumeId,
    create,
    update,
    // 파일명은 remove (delete 예약어 회피), consumer 호환 위해 alias 노출
    delete: remove,
    replaceChildren,
};

export type { PortfolioWithDetails } from './types';
