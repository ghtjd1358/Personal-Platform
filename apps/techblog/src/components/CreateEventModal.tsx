import React, { useState } from 'react';
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
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '450px' }}
      >
        <div className="modal-header">
          <div className="modal-title">일정 추가</div>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 일정 제목 (필수) */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  일정 제목 <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="예: 네이버 1차 면접"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* 날짜 (필수) */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  날짜 <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* 일정 타입 (필수) */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  일정 종류 <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {typeOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: opt.value }))}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: formData.type === opt.value
                          ? `2px solid ${opt.color}`
                          : '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontSize: '14px',
                        fontWeight: formData.type === opt.value ? '600' : '400',
                        background: formData.type === opt.value ? opt.color : 'var(--background)',
                        color: formData.type === opt.value ? 'white' : 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !formData.title.trim() || !formData.date}
            >
              {isSubmitting ? '추가 중...' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
