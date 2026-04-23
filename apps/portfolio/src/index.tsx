// init 먼저 실행 후 bootstrap 실행 (순차적)
// init 의 storage.removeHostApp() + Supabase 초기화가 bootstrap 전에 완료돼야
// standalone 모드 판별 + Supabase 클라이언트 사용 가능.
import('./init').then(() => import('./bootstrap'))

export {}
