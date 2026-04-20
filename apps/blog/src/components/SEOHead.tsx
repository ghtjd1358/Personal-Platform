/**
 * SEOHead - 블로그 SEO 메타 태그 컴포넌트
 *
 * Open Graph, Twitter Cards, 기본 메타 태그 관리
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

const SITE_NAME = 'Son Hoseong Blog';
const DEFAULT_DESCRIPTION = '개발자 손호성의 기술 블로그입니다. 웹 개발, 프론트엔드, 백엔드 관련 글을 작성합니다.';
const DEFAULT_IMAGE = '/og-image.png';

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags = [],
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const imageUrl = image || DEFAULT_IMAGE;

  // 절대 URL로 변환
  const getAbsoluteUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}${path}`;
  };

  const absoluteImageUrl = getAbsoluteUrl(imageUrl);
  const absoluteUrl = getAbsoluteUrl(url);

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={absoluteUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title || SITE_NAME} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:locale" content="ko_KR" />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || SITE_NAME} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />

      {/* 추가 메타 태그 */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
};

export default SEOHead;
