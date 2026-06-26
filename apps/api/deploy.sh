#!/bin/bash
# API를 Vercel에 처음 연결하고 환경변수를 설정하는 스크립트
# 실행 전: npm i -g vercel && vercel login
# 실행: bash apps/api/deploy.sh

set -e
cd "$(dirname "$0")"

echo "=== Vercel 프로젝트 연결 ==="
vercel link --yes

echo "=== 환경변수 설정 ==="
# 아래 값들은 실제 값으로 교체 후 실행

vercel env add NODE_ENV production <<< "production"

# JWT (openssl rand -base64 32 로 생성)
read -p "JWT_ACCESS_SECRET 입력: " jwt_access
vercel env add JWT_ACCESS_SECRET production <<< "$jwt_access"

read -p "JWT_REFRESH_SECRET 입력: " jwt_refresh
vercel env add JWT_REFRESH_SECRET production <<< "$jwt_refresh"

# Google OAuth (Google Cloud Console)
read -p "GOOGLE_CLIENT_ID 입력: " google_id
vercel env add GOOGLE_CLIENT_ID production <<< "$google_id"

read -p "GOOGLE_CLIENT_SECRET 입력: " google_secret
vercel env add GOOGLE_CLIENT_SECRET production <<< "$google_secret"

# GOOGLE_CALLBACK_URL은 배포 후 URL을 알아야 설정 가능
# vercel env add GOOGLE_CALLBACK_URL production <<< "https://YOUR_API_URL/api/auth/google/callback"

# Supabase
vercel env add SUPABASE_URL production <<< "https://ujhlgylnauzluttvmcrz.supabase.co"

read -p "SUPABASE_SERVICE_ROLE_KEY 입력: " supabase_key
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$supabase_key"

# Client
vercel env add CLIENT_URL production <<< "https://personal-platform-alpha.vercel.app"
vercel env add COOKIE_DOMAIN production <<< "vercel.app"

# Demo account
vercel env add DEMO_ACCOUNT_EMAIL production <<< "admin@test.com"
vercel env add DEMO_ACCOUNT_PASSWORD production <<< "1234"

echo ""
echo "=== 배포 ==="
vercel deploy --prod

echo ""
echo "=== 완료 ==="
echo "배포된 API URL을 확인하고:"
echo "1. personal-platform Vercel 프로젝트에 REACT_APP_API_URL 환경변수 추가"
echo "2. Google Cloud Console에 콜백 URL 추가: https://[API_URL]/api/auth/google/callback"
echo "3. GOOGLE_CALLBACK_URL 환경변수 업데이트: vercel env add GOOGLE_CALLBACK_URL production"
