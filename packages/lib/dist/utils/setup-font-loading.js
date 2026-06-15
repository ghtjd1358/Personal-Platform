/**
 * Fraunces variable font 로딩 가드.
 * 폰트 ready 전까지 `.fonts-loading` → visibility:hidden 처리.
 * 2s 타임아웃으로 영원히 숨는 상황 방어.
 */
const FONT_READY_TIMEOUT_MS = 2000;
export const setupFontLoading = () => {
    if (typeof document === 'undefined')
        return;
    const html = document.documentElement;
    html.classList.add('fonts-loading');
    const markReady = () => {
        html.classList.remove('fonts-loading');
        html.classList.add('fonts-ready');
    };
    const ready = document.fonts?.ready;
    if (ready && typeof ready.then === 'function') {
        ready.then(markReady).catch(markReady);
        setTimeout(markReady, FONT_READY_TIMEOUT_MS);
    }
    else {
        markReady();
    }
};
