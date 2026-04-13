import { Item } from './Item';

/**
 * Checkbox 클래스 - 체크 가능한 Todo 아이템
 * 
 * Item 클래스를 상속받아 check() 메서드를 추가합니다.
 * check() 메서드는 태스크를 완료 상태로 표시합니다.
 */
export class Checkbox extends Item {
  constructor(title: string) {
    super(title);
  }

  /**
   * 태스크를 완료 상태로 표시합니다.
   * 
   * Note: 자식 클래스는 부모의 인스턴스 변수(completed)에 접근할 수 있습니다!
   */
  check(): void {
    this.completed = true;
  }

  /**
   * 태스크의 완료 상태를 해제합니다.
   */
  uncheck(): void {
    this.completed = false;
  }

  /**
   * 태스크의 완료 상태를 토글합니다.
   */
  toggle(): void {
    this.completed = !this.completed;
  }
}
