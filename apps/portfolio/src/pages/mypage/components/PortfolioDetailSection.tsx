import React from 'react';

interface PortfolioDetailSectionProps {
    role: string;
    teamSize: string;
    period: string;
    duration: string;
    overview: string;
    challenge: string;
    solution: string;
    outcome: string;
    onRoleChange: (value: string) => void;
    onTeamSizeChange: (value: string) => void;
    onPeriodChange: (value: string) => void;
    onDurationChange: (value: string) => void;
    onOverviewChange: (value: string) => void;
    onChallengeChange: (value: string) => void;
    onSolutionChange: (value: string) => void;
    onOutcomeChange: (value: string) => void;
}

const PortfolioDetailSection: React.FC<PortfolioDetailSectionProps> = ({
    role,
    teamSize,
    period,
    duration,
    overview,
    challenge,
    solution,
    outcome,
    onRoleChange,
    onTeamSizeChange,
    onPeriodChange,
    onDurationChange,
    onOverviewChange,
    onChallengeChange,
    onSolutionChange,
    onOutcomeChange,
}) => {
    return (
        <section className="editor-section">
            <h2>프로젝트 정보</h2>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="role">역할</label>
                    <input
                        id="role"
                        type="text"
                        value={role}
                        onChange={(e) => onRoleChange(e.target.value)}
                        placeholder="예: 풀스택 개발"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="teamSize">팀 규모</label>
                    <input
                        id="teamSize"
                        type="number"
                        value={teamSize}
                        onChange={(e) => onTeamSizeChange(e.target.value)}
                        placeholder="1"
                        min="1"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="period">기간</label>
                    <input
                        id="period"
                        type="text"
                        value={period}
                        onChange={(e) => onPeriodChange(e.target.value)}
                        placeholder="예: 2024.01 - 2024.03"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="duration">소요 기간</label>
                    <input
                        id="duration"
                        type="text"
                        value={duration}
                        onChange={(e) => onDurationChange(e.target.value)}
                        placeholder="예: 3개월"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="overview">개요</label>
                <textarea
                    id="overview"
                    value={overview}
                    onChange={(e) => onOverviewChange(e.target.value)}
                    placeholder="프로젝트 개요"
                    rows={3}
                />
            </div>

            <div className="form-group">
                <label htmlFor="challenge">도전 과제</label>
                <textarea
                    id="challenge"
                    value={challenge}
                    onChange={(e) => onChallengeChange(e.target.value)}
                    placeholder="프로젝트에서 겪은 도전 과제"
                    rows={3}
                />
            </div>

            <div className="form-group">
                <label htmlFor="solution">해결 방법</label>
                <textarea
                    id="solution"
                    value={solution}
                    onChange={(e) => onSolutionChange(e.target.value)}
                    placeholder="도전 과제를 어떻게 해결했는지"
                    rows={3}
                />
            </div>

            <div className="form-group">
                <label htmlFor="outcome">결과</label>
                <textarea
                    id="outcome"
                    value={outcome}
                    onChange={(e) => onOutcomeChange(e.target.value)}
                    placeholder="프로젝트의 결과 및 성과"
                    rows={3}
                />
            </div>
        </section>
    );
};

export default PortfolioDetailSection;
