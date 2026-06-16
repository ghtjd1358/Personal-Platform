import React from 'react';
import { Card } from '@sonhoseong/mfa-lib';

interface StatCardProps {
  value: number | string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <Card className="stat-card">
    <Card.Title as="div" className="stat-value">{value}</Card.Title>
    <Card.Description className="stat-label">{label}</Card.Description>
  </Card>
);

export { StatCard };
