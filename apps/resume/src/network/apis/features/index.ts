/**
 * features 도메인 barrel — "이런 개발자입니다" 섹션.
 * Storage bucket `resume-features` (public read, owner-only write) 업로드/삭제 포함.
 */
import { getAll } from './getAll';
import { getByUserId } from './getByUserId';
import { getById } from './getById';
import { create } from './create';
import { update } from './update';
import { remove } from './remove';
import { uploadImage } from './uploadImage';
import { deleteImageByUrl } from './deleteImageByUrl';

export const featuresApi = {
    getAll,
    getByUserId,
    getById,
    create,
    update,
    // 파일명은 remove (delete 예약어 회피), consumer 호환 위해 alias 노출
    delete: remove,
    uploadImage,
    deleteImageByUrl,
};
