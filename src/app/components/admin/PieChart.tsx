import React from "react";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const cx = 142.5;
  const cy = 142.5;
  const radius = 139;
  const labelOffset = 3;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  console.log(data);
  console.log(total);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  let cumulativeAngle = 0;

  const getCoordinates = (angle: number, offset = 0) => {
    const x = cx + (radius + offset) * Math.cos(angle - Math.PI / 2); // Start from top
    const y = cy + (radius + offset) * Math.sin(angle - Math.PI / 2);
    return [x, y];
  };

  const slices = data.map((slice) => {
    const startAngle = cumulativeAngle;
    const sliceAngle = (slice.value / total) * 2 * Math.PI;
    cumulativeAngle += sliceAngle;
    const endAngle = cumulativeAngle;

    const [x1, y1] = getCoordinates(startAngle);
    const [x2, y2] = getCoordinates(endAngle);
    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const midAngle = startAngle + sliceAngle / 2;
    const [labelX, labelY] = getCoordinates(midAngle, labelOffset);

    const percentage = Math.round((slice.value / total) * 100);

    return {
      ...slice,
      path: `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`,
      labelX,
      labelY,
      percentage,
    };
  });

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-10 space-y-6 sm:space-y-0">
        {/* SVG Pie Chart */}
        <svg 
          width="285" 
          height="285" 
          viewBox="0 0 285 285" 
          className="flex-shrink-0 sm:ml-[-25px] w-[200px] h-[200px] sm:w-[285px] sm:h-[285px]"
        >
          {slices.map((slice, index) => (
            <g key={index}>
              <path 
                d={slice.path} 
                fill={slice.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              {slice.percentage >= 5 && ( // Only show percentage if slice is large enough
                <>
                  <circle cx={slice.labelX} cy={slice.labelY} r={16} fill="white" stroke="#e5e7eb" strokeWidth="1" />
                  <text
                    x={slice.labelX}
                    y={slice.labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-darker-grotesque font-regular"
                    style={{ fontSize: '12px', fill: '#212121' }}
                  >
                    {slice.percentage}%
                  </text>
                </>
              )}
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="space-y-3 w-full sm:w-auto">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-800 font-medium">{item.label}</span>
                <span className="text-xs text-gray-500">{item.value} orders</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;