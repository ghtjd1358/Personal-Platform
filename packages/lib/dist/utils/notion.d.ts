/**
 * Notion 공유 페이지를 react-notion-x 로 렌더링하기 위한 공통 유틸.
 *
 * 무거운 react-notion-x 자체는 각 remote 가 직접 의존성으로 가져감 (lib 번들 비대화 회피).
 * lib 는 URL 파싱 / 이미지 proxy / Edge Function fetch 같은 도메인 로직만 담당.
 */
/** Supabase Edge Function — Notion unofficial API CORS 회피 proxy. */
export declare const NOTION_PROXY_URL = "https://ujhlgylnauzluttvmcrz.supabase.co/functions/v1/notion-page";
/**
 * Notion URL → 32hex page id → UUID hyphen 형식 (8-4-4-4-12).
 * notion-client 의 loadPageChunk 가 hyphen 없는 id 에 400 Bad Request 반환하는 케이스 회피.
 */
export declare function extractNotionPageId(url: string): string | null;
/**
 * react-notion-x 의 mapImageUrl 콜백으로 그대로 꽂아 쓰는 image proxy.
 *
 * - GIF: 원본 presigned URL 패스스루 (Notion proxy 가 transcode 하면서 깨지는 케이스 회피)
 * - X-Amz-Signature 가 있는 fresh signed URL: 그대로 통과
 * - amazonaws.com / img.notionusercontent.com: Notion image proxy 경유 (presigned 만료 1h 우회)
 */
export declare function proxyNotionImageUrl(url: string | undefined, block: {
    id?: string;
    parent_table?: string;
} | any): string | undefined;
/**
 * recordMap-aware image mapper factory.
 *
 * react-notion-x 의 image 분기(build/index.js:929-930)에 버그가 있음 — image 소스가 `.gif` 가 아니면서
 * `file.notion.so` 를 포함하면 signed URL 을 버리고 raw `block.properties.source[0][0]` (즉 `attachment:...` 같은
 * non-fetchable URL) 으로 덮어쓰고 mapImageUrl 을 호출함. `attachment:` 프로토콜은 브라우저가 못 fetch.
 *
 * 이 factory 는 mapImageUrl 콜백에 recordMap closure 를 부여해서, `attachment:` 가 들어오면
 * recordMap.signed_urls[block.id] 를 다시 룩업하고 spaceId 부착해서 fresh signed URL 로 복구.
 *
 * 그 외 케이스는 기존 proxyNotionImageUrl 로 위임 (S3 presigned, GIF passthrough 등).
 */
export declare function createNotionImageMapper(recordMap: any): (url: string | undefined, block: any) => string | undefined;
/**
 * Notion 페이지 URL 에서 recordMap 을 가져옴.
 * Supabase Edge Function (`notion-page` v7) 이 loadPageChunk + syncRecordValuesSpace
 * + getSignedFileUrls 를 합성해서 fresh signed URLs 포함 recordMap 을 반환.
 */
export declare function fetchNotionRecordMap(notionUrl: string): Promise<any>;
//# sourceMappingURL=notion.d.ts.map