import React, { lazy, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { RoutePath } from './paths';
import { PREFIX } from '@/config/constants';

const BlogList = lazy(() => import('@/pages/blog/BlogList'));
const PostDetail = lazy(() => import('@/pages/post/detail/PostDetail'));
const SeriesDetail = lazy(() => import('@/pages/series/SeriesDetail'));

function LoginRequiredAlert() {
    const navigate = useNavigate();
    useEffect(() => {
        alert('로그인 부탁드립니다.');
        navigate(`${PREFIX}/`, { replace: true });
    }, [navigate]);
    return null;
}

/**
 * Standalone(remote2 단독) 라우트 — 공개 블로그 뷰.
 * 편집/관리/로그인 흐름은 host 모드 전용 → standalone 에서 login 라우트 제거.
 * 글쓰기/수정은 비로그인 사용자가 진입 시 알럿 후 목록으로 리다이렉트.
 */
function RoutesGuestPages() {
    return (
        <Routes>
            {/* 메인 + 공개 컨텐츠 */}
            <Route path={`${PREFIX}/`} element={<BlogList />} />
            <Route path={`${PREFIX}${RoutePath.Blog}`} element={<BlogList />} />
            <Route path={`${PREFIX}${RoutePath.PostDetail}`} element={<PostDetail />} />
            <Route path={`${PREFIX}${RoutePath.SeriesDetail}`} element={<SeriesDetail />} />

            {/* 비로그인 사용자가 글쓰기/수정 진입 시 알럿 */}
            <Route path={`${PREFIX}${RoutePath.Write}`} element={<LoginRequiredAlert />} />
            <Route path={`${PREFIX}${RoutePath.Edit}`} element={<LoginRequiredAlert />} />
            <Route path={`${PREFIX}${RoutePath.Manage}`} element={<LoginRequiredAlert />} />
            <Route path={`${PREFIX}${RoutePath.My}`} element={<LoginRequiredAlert />} />

            {/* 나머지는 목록으로 */}
            <Route path="*" element={<BlogList />} />
        </Routes>
    );
}

export { RoutesGuestPages };
