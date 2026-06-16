/**
 * Node.js API Initialize Hook
 * 앱 부트 시 HttpOnly Cookie → AccessToken 복구 + 사용자 정보 로드
 * Supabase Auth 대신 Node.js JWT 기반 인증 사용
 *
 * 가드 두 가지:
 *  1) ranRef     — React Strict Mode 이중 마운트에서 effect 가 두 번 도는 걸 방지
 *  2) AbortController — unmount 후 도착한 응답이 store 에 dispatch 되는 zombie write 방지
 */
export declare function useNodeInitialize(): {
    initialized: boolean;
};
//# sourceMappingURL=use-node-initialize.d.ts.map