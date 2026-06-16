import { useCallback, useState } from 'react';
import { CreateApplicationInput } from '@/network/apis';

interface UseApplicationFormOptions {
  initialValues?: Partial<CreateApplicationInput>;
  onCreate: (input: CreateApplicationInput) => Promise<unknown>;
  /** 성공 후 콜백 — 보통 modal close */
  onSuccess?: () => void;
}

interface UseApplicationFormReturn {
  formData: CreateApplicationInput;
  isSubmitting: boolean;
  /** input/select 공용 change 핸들러 */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  /** form submit — preventDefault + validation + 호출 */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** 회사명 + 포지션이 모두 채워졌는지 (제출 가능 여부) */
  isValid: boolean;
}

const DEFAULT_VALUES: CreateApplicationInput = {
  companyName: '',
  position: '',
  location: '',
  salaryRange: '',
  jobUrl: '',
  status: 'interested',
};

/**
 * CreateApplicationModal 폼 비즈니스 로직 hook.
 *
 * - form state + 검증(필수 필드) + onCreate 호출 + isSubmitting 상태를 모두 캡슐화.
 * - UI(CreateApplicationModal) 는 본 hook 의 반환값만 받아 input wiring 만 함.
 */
export function useApplicationForm({
  initialValues,
  onCreate,
  onSuccess,
}: UseApplicationFormOptions): UseApplicationFormReturn {
  const [formData, setFormData] = useState<CreateApplicationInput>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.companyName.trim() || !formData.position.trim()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onCreate(formData);
        onSuccess?.();
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onCreate, onSuccess]
  );

  const isValid = !!formData.companyName.trim() && !!formData.position.trim();

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    isValid,
  };
}
