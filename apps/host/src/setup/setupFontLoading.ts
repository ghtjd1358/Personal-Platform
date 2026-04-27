/**
 * Fraunces variable font 로딩 가드
 *
 * 폰트가 ready 될 때까지 `.fonts-loading` 으로 hero-title 을 visibility:hidden 처리.
 * → 폴백(Georgia) 으로 굵게 그렸다가 Fraunces 300 으로 얇아지는 weight jump
 *   (reflow/repaint) 을 원천 차단.
 *
 * 2s 안에 fonts.ready 가 resolve 되지 않아도 강제 해제 — 영원히 숨지 않도록.
 */
const FONT_READY_TIMEOUT_MS = 2000;

export const setupFontLoading = () => {
    if (typeof document === 'undefined') return;

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
    } else {
        markReady();
    }
};
