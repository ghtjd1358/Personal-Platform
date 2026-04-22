import { useEffect } from 'react';

/**
 * `.animate-on-scroll` 요소가 뷰포트에 들어오면 `animate-visible` 클래스를 붙여 등장 애니메이션 트리거.
 *
 * ⚠️ 과거 버그: 마운트 시점 1회만 querySelectorAll 해서 observe → 비동기 fetch 후
 * setState 로 DOM 이 재마운트되면 새 노드들은 감시 대상이 아니라 영구 opacity:0.
 * 해결: MutationObserver 로 새로 생긴 `.animate-on-scroll` 요소도 자동 observe.
 */
export const useScrollAnimation = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-visible');
                    }
                });
            },
            { threshold: 0.15 }
        );

        const observeEl = (el: Element) => {
            if (!el.classList.contains('animate-visible')) observer.observe(el);
        };

        // 초기 DOM 의 요소
        document.querySelectorAll('.animate-on-scroll').forEach(observeEl);

        // 런타임에 추가되는 요소 감지
        const mutObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;
                    const el = node as Element;
                    if (el.classList?.contains('animate-on-scroll')) observeEl(el);
                    el.querySelectorAll?.('.animate-on-scroll').forEach(observeEl);
                });
            });
        });

        mutObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutObserver.disconnect();
        };
    }, []);
};
