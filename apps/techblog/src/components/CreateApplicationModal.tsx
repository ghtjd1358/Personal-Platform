import React, { useState } from 'react';
import { ApplicationStatus, ApplicationSource } from '@/types/job';
import { CreateApplicationInput } from '@/network/apis';

interface CreateApplicationModalProps {
  onClose: () => void;
  onCreate: (input: CreateApplicationInput) => Promise<unknown>;
}

const CreateApplicationModal: React.FC<CreateApplicationModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<CreateApplicationInput>({
    companyName: '',
    position: '',
    location: '',
    salaryRange: '',
    jobUrl: '',
    status: 'interested',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions: { value: ApplicationStatus; label: string }[] = [
    { value: 'interested', label: '관심' },
    { value: 'applied', label: '지원완료' },
    { value: 'interview', label: '면접' },
    { value: 'result', label: '결과' },
  ];

  const sourceOptions: { value: ApplicationSource; label: string }[] = [
    { value: 'wanted', label: '원티드' },
    { value: 'saramin', label: '사람인' },
    { value: 'jobkorea', label: '잡코리아' },
    { value: 'linkedin', label: '링크드인' },
    { value: 'remember', label: '리멤버' },
    { value: 'direct', label: '회사 직접' },
    { value: 'referral', label: '추천/소개' },
    { value: 'other', label: '기타' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim() || !formData.position.trim()) {
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
        style={{ maxWidth: '500px' }}
      >
        <div className="modal-header">
          <div className="modal-title">새 지원 추가</div>
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
              {/* 회사명 (필수) */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  회사명 <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="예: 네이버"
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

              {/* 포지션 (필수) */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  포지션 <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="예: 프론트엔드 개발자"
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

              {/* 초기 상태 */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  지원 상태
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* 지원 경로 */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  지원 경로
                </label>
                <select
                  name="source"
                  value={formData.source || ''}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="">선택 안함</option>
                  {sourceOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* 근무지 */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  근무지
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="예: 서울 강남구"
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

              {/* 연봉 */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  연봉
                </label>
                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange || ''}
                  onChange={handleChange}
                  placeholder="예: 5,000~6,000만원"
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

              {/* 채용공고 URL */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  채용공고 URL
                </label>
                <input
                  type="url"
                  name="jobUrl"
                  value={formData.jobUrl || ''}
                  onChange={handleChange}
                  placeholder="https://..."
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
              disabled={isSubmitting || !formData.companyName.trim() || !formData.position.trim()}
            >
              {isSubmitting ? '추가 중...' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateApplicationModal;
