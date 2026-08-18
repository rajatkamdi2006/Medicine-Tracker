import React from 'react';

interface PulseRingProps {
  percentage: number;
  status: 'low' | 'moderate' | 'high' | 'pending';
  size?: number;
  strokeWidth?: number;
  isLoading?: boolean;
  trackColor?: string;
}

export const PulseRing: React.FC<PulseRingProps> = ({
  percentage,
  status,
  size = 48,
  strokeWidth = 4,
  isLoading = false,
  trackColor = 'var(--line-light)'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = 'var(--line-light)'; // pending default
  if (status === 'low') color = 'var(--pulse)';
  if (status === 'moderate') color = 'var(--amber)';
  if (status === 'high') color = 'var(--alert)';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        transform: 'rotate(-90deg)',
        transition: 'all 0.5s ease-in-out'
      }}
    >
      {/* Background Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        style={{ opacity: 0.2 }}
      />
      {/* Progress Ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={isLoading ? {
          animation: 'ring-draw 2s linear infinite'
        } : {
          transition: 'stroke-dashoffset 0.5s ease-in-out'
        }}
      />
    </svg>
  );
};
