import { Item, Checkbox } from './index';

// Item 클래스 테스트
console.log('=== Item 클래스 테스트 ===');
const item = new Item('Buy groceries');
console.log('Title:', item.getTitle()); // "Buy groceries"
console.log('Completed:', item.isCompleted()); // false
console.log('toString:', item.toString()); // "○ Buy groceries"

// Checkbox 클래스 테스트
console.log('\n=== Checkbox 클래스 테스트 ===');
const checkbox = new Checkbox('Complete homework');
console.log('Title:', checkbox.getTitle()); // "Complete homework"
console.log('Completed before check:', checkbox.isCompleted()); // false

// check() 메서드 호출 - 태스크를 완료 상태로 표시
checkbox.check();
console.log('Completed after check:', checkbox.isCompleted()); // true
console.log('toString:', checkbox.toString()); // "✓ Complete homework"

// uncheck() 메서드 테스트
checkbox.uncheck();
console.log('Completed after uncheck:', checkbox.isCompleted()); // false

// toggle() 메서드 테스트
checkbox.toggle();
console.log('Completed after toggle:', checkbox.isCompleted()); // true

// 상속 확인
console.log('\n=== 상속 확인 ===');
console.log('checkbox instanceof Checkbox:', checkbox instanceof Checkbox); // true
console.log('checkbox instanceof Item:', checkbox instanceof Item); // true
console.log('item instanceof Item:', item instanceof Item); // true
console.log('item instanceof Checkbox:', item instanceof Checkbox); // false

console.log('\n✅ 모든 테스트 통과!');
