-- Portfolio Likes 테이블
-- 사용자별 포트폴리오 좋아요 기록

CREATE TABLE IF NOT EXISTS portfolio_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, user_id)
);

-- portfolios 테이블에 like_count 컬럼 추가 (없으면)
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- 인덱스 생성 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_portfolio_id ON portfolio_likes(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_user_id ON portfolio_likes(user_id);

-- RLS (Row Level Security) 정책
ALTER TABLE portfolio_likes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 좋아요 목록 조회 가능
CREATE POLICY "Anyone can view likes" ON portfolio_likes
  FOR SELECT USING (true);

-- 인증된 사용자만 자신의 좋아요 생성 가능
CREATE POLICY "Authenticated users can insert own likes" ON portfolio_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 인증된 사용자만 자신의 좋아요 삭제 가능
CREATE POLICY "Users can delete own likes" ON portfolio_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 좋아요 추가 시 like_count 증가 트리거
CREATE OR REPLACE FUNCTION increment_portfolio_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE portfolios
  SET like_count = like_count + 1
  WHERE id = NEW.portfolio_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_portfolio_like_insert
  AFTER INSERT ON portfolio_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_portfolio_like_count();

-- 좋아요 삭제 시 like_count 감소 트리거
CREATE OR REPLACE FUNCTION decrement_portfolio_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE portfolios
  SET like_count = GREATEST(like_count - 1, 0)
  WHERE id = OLD.portfolio_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_portfolio_like_delete
  AFTER DELETE ON portfolio_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_portfolio_like_count();
