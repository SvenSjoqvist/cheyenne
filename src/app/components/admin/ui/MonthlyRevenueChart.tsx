"use client";

import { useEffect, useRef } from 'react';

interface MonthlyRevenueData {
  month: string;
  revenue: number;
  formattedRevenue: string;
}

interface MonthlyRevenueChartProps {
  data: MonthlyRevenueData[];
}

// Function to determine bar color based on revenue amount
function getBarColor(revenue: number): string {
  if (revenue <= 500) {
    return '#A3D2EC';
  } else if (revenue <= 1000) {
    return '#5FADE7';
  } else {
    return '#0B6EB7';
  }
}

export default function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = rect.width;
    const height = rect.height;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find max revenue for scaling
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    const scale = maxRevenue > 0 ? chartHeight / maxRevenue : 1;

    // Draw bars
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;

    data.forEach((item, index) => {
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const barHeight = item.revenue * scale;
      const y = height - padding - barHeight;

      // Draw bar with color based on revenue amount
      ctx.fillStyle = getBarColor(item.revenue);
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top of bar
      if (item.revenue > 0) {
        ctx.fillStyle = '#212121';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.formattedRevenue, x + barWidth / 2, y - 5);
      }
    });

    // Draw month labels
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    data.forEach((item, index) => {
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const monthName = new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' });
      ctx.fillText(monthName, x + barWidth / 2, height - padding + 20);
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const value = (maxRevenue / ySteps) * i;
      const y = height - padding - (value * scale);
      ctx.fillText(formatCurrency(value, 'USD'), padding - 10, y + 4);
    }

  }, [data]);

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxHeight: '400px' }}
      />
    </div>
  );
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
} 