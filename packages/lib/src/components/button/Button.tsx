/**
 * Button — Compound Component 진입점.
 *
 * 사용:
 *   <Button variant="primary">저장</Button>
 *   <Button.Icon aria-label="닫기"><CloseIcon /></Button.Icon>
 *   <Button.Group gap="md" align="end">
 *     <Button variant="ghost">취소</Button>
 *     <Button variant="primary">확인</Button>
 *   </Button.Group>
 */
import { CommonButton } from './CommonButton';
import { IconButton } from './IconButton';
import { ButtonGroup } from './ButtonGroup';

export const Button = Object.assign(CommonButton, {
  Icon: IconButton,
  Group: ButtonGroup,
});
