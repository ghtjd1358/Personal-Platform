import React from 'react';
import { Button } from '@sonhoseong/mfa-lib';
import { ApplicationStatus, ApplicationSource } from '@/types/job';
import { CreateApplicationInput } from '@/network/apis';
import { useApplicationForm } from '@/hooks';

interface CreateApplicationModalProps {
  onClose: () => void;
  onCreate: (input: CreateApplicationInput) => Promise<unknown>;
}

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

const CreateApplicationModal: React.FC<CreateApplicationModalProps> = ({ onClose, onCreate }) => {
  const { formData, isSubmitting, isValid, handleChange, handleSubmit } = useApplicationForm({
    onCreate,
    onSuccess: onClose,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-container--app-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">새 지원 추가</div>
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
              <div>
                <label className="form-label">
                  회사명 <span className="form-label-required">*</span>
                </label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="예: 네이버" required className="form-input" />
              </div>

              <div>
                <label className="form-label">
                  포지션 <span className="form-label-required">*</span>
                </label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="예: 프론트엔드 개발자" required className="form-input" />
              </div>

              <div>
                <label className="form-label">지원 상태</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">지원 경로</label>
                <select name="source" value={formData.source || ''} onChange={handleChange} className="form-input">
                  <option value="">선택 안함</option>
                  {sourceOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">근무지</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} placeholder="예: 서울 강남구" className="form-input" />
              </div>

              <div>
                <label className="form-label">연봉</label>
                <input type="text" name="salaryRange" value={formData.salaryRange || ''} onChange={handleChange} placeholder="예: 5,000~6,000만원" className="form-input" />
              </div>

              <div>
                <label className="form-label">채용공고 URL</label>
                <input type="url" name="jobUrl" value={formData.jobUrl || ''} onChange={handleChange} placeholder="https://..." className="form-input" />
              </div>
            </div>
          </div>

          <div className="form-footer-actions">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>취소</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || !isValid} loading={isSubmitting}>
              추가
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateApplicationModal;
