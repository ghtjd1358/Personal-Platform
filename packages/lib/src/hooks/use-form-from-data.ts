import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * 폼 데이터 상태 hook — `{ formData, setFormData, setField, handleChange, reset, isDirty }`.
 *
 * controlled input + name 기반 dispatch 둘 다 지원:
 *  - `setField('email', value)` — type-safe 한 단일 필드 set
 *  - `handleChange(e)` — `<input name="email">` 자동 dispatch (checkbox/select 도 처리)
 *
 * 도메인 메서드(`addTechStack`, `generateSlug` 등)는 호출부에서 `setFormData` 로 합성.
 * submit + isSubmitting + 에러는 `useAsyncState` 와 합성 (form hook 은 form 만).
 *
 * @example  단순 사용
 * const { formData, handleChange, isDirty } = useFormFromData({ name: '', bio: '' });
 * <input name="name" value={formData.name} onChange={handleChange} />
 *
 * @example  type-safe 사용 + useAsyncState 합성
 * const form = useFormFromData<ProfileInput>({ name: '', bio: '' });
 * const { isLoading, error, execute } = useAsyncState(
 *   useCallback(() => updateProfile(form.formData), [form.formData])
 * );
 * <input value={form.formData.name} onChange={(e) => form.setField('name', e.target.value)} />
 */
export interface UseFormFromDataReturn<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  /** type-safe 단일 필드 set */
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  /** input/select/textarea 공용 — `e.target.name` 으로 dispatch, checkbox 는 `checked` 사용 */
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  /** initialValues 로 복귀 */
  reset: () => void;
  /** shallow ref equality 로 초기값 대비 변경 여부 */
  isDirty: boolean;
}

export function useFormFromData<T extends Record<string, any>>(
  initialValues: T,
): UseFormFromDataReturn<T> {
  // initialValues 가 매 렌더 새 객체로 와도 reset 기준은 mount 시점값 고정
  const initialRef = useRef(initialValues);
  const [formData, setFormData] = useState<T>(initialValues);

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = e.target as HTMLInputElement;
      const { name, type, value, checked } = target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setFormData(initialRef.current);
  }, []);

  const isDirty = useMemo(() => {
    const init = initialRef.current;
    return (Object.keys(init) as Array<keyof T>).some((k) => init[k] !== formData[k]);
  }, [formData]);

  return { formData, setFormData, setField, handleChange, reset, isDirty };
}
