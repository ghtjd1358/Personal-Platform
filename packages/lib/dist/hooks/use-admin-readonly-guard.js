/**
 * useAdminReadOnlyGuard
 *
 * 면접관 admin 체험 계정(role='admin' && !isOwner) 가 수정/삭제/추가 mutation 을 시도하면
 * warning toast 띄우고 차단. mutation hook 첫 줄에 한 줄 추가하는 가드 패턴.
 *
 * 사용 예시 (resume 의 useCreateFeature 등):
 *   const guard = useAdminReadOnlyGuard();
 *   return useCallback(async (payload) => {
 *     if (guard()) return false as const;
 *     // ...실제 mutation
 *   }, [..., guard]);
 *
 * Owner 는 무조건 통과, guest/admin 은 통과(차단 안 함), demo admin 만 차단.
 * 진짜 보호는 Supabase RLS — 이 가드는 UX 토스트.
 */
import { useCallback } from 'react';
import { usePermission } from './use-permission';
import { useToast } from '../components/toast/ToastContext';
export function useAdminReadOnlyGuard(message) {
    const { isOwner, isAdmin } = usePermission();
    const { warning } = useToast();
    return useCallback(() => {
        if (!isOwner && isAdmin) {
            warning(message || '관리자 데모 모드입니다 — 수정·삭제·추가는 차단되어 있어요');
            return true;
        }
        return false;
    }, [isOwner, isAdmin, warning, message]);
}
export default useAdminReadOnlyGuard;
