import React from 'react';

interface MonthlyTrendData {
  month: string;
  applied: number;
  passed: number;
}

interface MonthlyTrendChartProps {
  monthlyTrend: MonthlyTrendData[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ monthlyTrend }) => {
  if (monthlyTrend.length === 0) return null;

  return (
    <div className="card section-mb-24">
      <div className="card-header">
        <h3 className="card-title">월별 지원 현황</h3>
      </div>
      <div className="trend-chart">
        {monthlyTrend.map((data, index) => {
          const maxApplied = Math.max(...monthlyTrend.map(d => d.applied), 1);
          const barHeight = (data.applied / maxApplied) * 100;
          return (
            <div key={index} className="trend-chart-col">
              <div className="trend-chart-bar-wrap">
                {data.applied > 0 && (
                  <span className="trend-chart-bar-value">
                    {data.applied}
                  </span>
                )}
                <div
                  className="trend-chart-bar"
                  style={{
                    height: `${barHeight}%`,
                    minHeight: data.applied > 0 ? '8px' : '2px',
                    background: data.applied > 0 ? 'linear-gradient(180deg, var(--warning), var(--primary))' : 'var(--border)',
                  }}
                >
                  {data.passed > 0 && (
                    <div
                      className="trend-chart-bar-passed"
                      style={{
                        height: `${(data.passed / data.applied) * 100}%`,
                      }}
                      title={`합격: ${data.passed}`}
                    />
                  )}
                </div>
              </div>
              <span className="trend-chart-month-label">{data.month}</span>
            </div>
          );
        })}
      </div>
      <div className="trend-chart-legend">
        <div className="trend-chart-legend-item">
          <span className="trend-chart-legend-swatch trend-chart-legend-swatch--applied" />
          지원
        </div>
        <div className="trend-chart-legend-item">
          <span className="trend-chart-legend-swatch trend-chart-legend-swatch--passed" />
          합격
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendChart;
