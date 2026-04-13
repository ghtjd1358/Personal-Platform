/**
 * Item 클래스 - Todo 아이템의 기본 클래스
 * 
 * Todo 리스트에서 완료해야 할 항목을 나타냅니다.
 */
export class Item {
  protected title: string;
  protected completed: boolean;
  protected createdAt: Date;

  constructor(title: string) {
    this.title = title;
    this.completed = false;
    this.createdAt = new Date();
  }

  /**
   * 아이템의 제목을 반환합니다.
   */
  getTitle(): string {
    return this.title;
  }

  /**
   * 아이템의 완료 상태를 반환합니다.
   */
  isCompleted(): boolean {
    return this.completed;
  }

  /**
   * 아이템의 생성 시간을 반환합니다.
   */
  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * 아이템의 제목을 변경합니다.
   */
  setTitle(title: string): void {
    this.title = title;
  }

  /**
   * 아이템의 정보를 문자열로 반환합니다.
   */
  toString(): string {
    const status = this.completed ? '✓' : '○';
    return `${status} ${this.title}`;
  }
}
