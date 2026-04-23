/**
 * experiences 도메인 barrel — 기존 consumer 들이 `experiencesApi.xxx` 로 호출하던 API 를
 * 그대로 유지하기 위한 aggregator. 각 메서드는 자기 파일에 분리되어 있음.
 */
import { getAll } from './getAll';
import { getByUserId } from './getByUserId';
import { getByResumeId } from './getByResumeId';
import { getById } from './getById';
import { getByUserIdWithDetails } from './getByUserIdWithDetails';
import { getByIdWithDetails } from './getByIdWithDetails';
import { countByResumeId } from './countByResumeId';
import { create } from './create';
import { update } from './update';
import { remove } from './remove';
import { replaceChildren } from './replaceChildren';

export const experiencesApi = {
    getAll,
    getByUserId,
    getByResumeId,
    getById,
    getByUserIdWithDetails,
    getByIdWithDetails,
    countByResumeId,
    create,
    update,
    // 파일명은 remove (delete 예약어 회피), 기존 호출부 호환 위해 alias 로 delete 도 노출
    delete: remove,
    replaceChildren,
};

export type { ExperienceWithDetails } from './types';
