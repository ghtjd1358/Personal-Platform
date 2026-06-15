import React, { useState } from 'react';
import { Button } from '@sonhoseong/mfa-lib';
import { CreateEventInput } from '@/network/apis';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (input: CreateEventInput) => Promise<unknown>;
  defaultDate?: string;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onCreate,
  defaultDate,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<CreateEventInput>({
    title: '',
    date: defaultDate || today,
    type: 'interview',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typeOptions: { value: CreateEventInput['type']; label: string; color: string }[] = [
    { value: 'interview', label: '면접', color: 'var(--warning)' },
    { value: 'deadline', label: '마감', color: 'var(--danger)' },
    { value: 'applied', label: '지원', color: 'var(--primary)' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.date) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-container--app-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">일정 추가</div>
          <Button.Icon aria-label="닫기" className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button.Icon>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-stack">
              {/* 일정 제목 (필수) */}
              <div>
                <label className="form-label">
                  일정 제목 <span className="form-label-required">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="예: 네이버 1차 면접"
                  required
                  className="form-input"
                />
              </div>

              {/* 날짜 (필수) */}
              <div>
                <label className="form-label">
                  날짜 <span className="form-label-required">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              {/* 일정 타입 (필수) */}
              <div>
                <label className="form-label">
                  일정 종류 <span className="form-label-required">*</span>
                </label>
                <div className="status-button-row">
                  {typeOptions.map(opt => (
                    <Button
                      key={opt.value}
                      type="button"
                      variant={formData.type === opt.value ? 'primary' : 'secondary'}
                      onClick={() => setFormData(prev => ({ ...prev, type: opt.value }))}
                      style={{
                        flex: 1,
                        border: formData.type === opt.value
                          ? `2px solid ${opt.color}`
                          : '1px solid var(--border)',
                        fontWeight: formData.type === opt.value ? '600' : '400',
                        background: formData.type === opt.value ? opt.color : 'var(--background)',
                        color: formData.type === opt.value ? 'white' : 'var(--text-primary)',
                      }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-footer-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !formData.title.trim() || !formData.date}
              loading={isSubmitting}
            >
              추가
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
