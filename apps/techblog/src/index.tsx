// init 먼저 실행 후 bootstrap 실행 (순차적)
// init의 storage.removeHostApp()이 bootstrap 전에 완료돼야 standalone 모드가 정확히 판별됨
import('./init').then(() => import('./bootstrap'));

export {};
