import React from 'react';

interface SalaryStats {
  applicationsWithSalary: number;
}

interface SalaryStatsCardProps {
  salary: SalaryStats;
}

const SalaryStatsCard: React.FC<SalaryStatsCardProps> = ({ salary }) => {
  if (salary.applicationsWithSalary === 0) return null;

  return (
    <div className="card section-mb-24">
      <div className="card-header">
        <h3 className="card-title">💰 급여 현황</h3>
        <span className="salary-card-meta">
          {salary.applicationsWithSalary}개 지원에서 급여 정보 확인
        </span>
      </div>
      <div className="salary-grid">
        <div className="salary-grid-cell">
          <div className="salary-grid-label">
            평균 연봉 범위
          </div>
          <div className="salary-grid-value salary-grid-value--primary">
            1,000~2,000
          </div>
          <div className="salary-grid-unit">만원</div>
        </div>
        <div className="salary-grid-cell">
          <div className="salary-grid-label">
            최저 제시 연봉
          </div>
          <div className="salary-grid-value">
            1,000
          </div>
          <div className="salary-grid-unit">만원</div>
        </div>
        <div className="salary-grid-cell">
          <div className="salary-grid-label">
            최고 제시 연봉
          </div>
          <div className="salary-grid-value salary-grid-value--success">
            2,000
          </div>
          <div className="salary-grid-unit">만원</div>
        </div>
      </div>
    </div>
  );
};

export default SalaryStatsCard;
