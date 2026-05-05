"use client";

interface BarChartProps {
  horizontal?: boolean;
  data_1: number[];
  data_2: number[];
  title_1: string;
  title_2: string;
  bgColor_1: string;
  bgColor_2: string;
  labels?: string[];
}

const defaultLabels = ["January", "February", "March", "April", "May", "June"];

export const BarChart = ({
  data_1 = [],
  data_2 = [],
  title_1,
  title_2,
  bgColor_1,
  bgColor_2,
  labels = defaultLabels,
}: BarChartProps) => {
  const max = Math.max(...data_1, ...data_2, 1);

  return (
    <div className="simple-chart" role="img" aria-label={`${title_1} and ${title_2}`}>
      <div className="chart-bars">
        {labels.map((label, index) => (
          <div className="chart-bar-group" key={label}>
            <div className="chart-bar-stack">
              <span
                title={`${title_1}: ${data_1[index] ?? 0}`}
                style={{
                  height: `${((data_1[index] ?? 0) / max) * 100}%`,
                  backgroundColor: bgColor_1,
                }}
              />
              <span
                title={`${title_2}: ${data_2[index] ?? 0}`}
                style={{
                  height: `${((data_2[index] ?? 0) / max) * 100}%`,
                  backgroundColor: bgColor_2,
                }}
              />
            </div>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  backgroundColor: string[];
  cutout?: number | string;
  legends?: boolean;
}

export const DoughnutChart = ({
  labels,
  data,
  backgroundColor,
  cutout = 72,
  legends = true,
}: DoughnutChartProps) => {
  const total = data.reduce((sum, value) => sum + value, 0) || 1;
  const gradient = data
    .reduce<{ slices: string[]; start: number }>(
      (acc, value, index) => {
        const end = acc.start + (value / total) * 100;
        return {
          slices: [
            ...acc.slices,
            `${backgroundColor[index]} ${acc.start}% ${end}%`,
          ],
          start: end,
        };
      },
      { slices: [], start: 0 }
    )
    .slices
    .join(", ");

  return (
    <div className="doughnut-wrap">
      <div
        className="doughnut"
        style={{
          background: `conic-gradient(${gradient})`,
          ["--cutout" as string]: typeof cutout === "number" ? `${cutout}px` : cutout,
        }}
      />
      {legends && (
        <div className="chart-legend">
          {labels.map((label, index) => (
            <span key={label}>
              <i style={{ backgroundColor: backgroundColor[index] }} />
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

interface PieChartProps {
  labels: string[];
  data: number[];
  backgroundColor: string[];
}

export const PieChart = (props: PieChartProps) => (
  <DoughnutChart {...props} cutout="0" legends={false} />
);

interface LineChartProps {
  data: number[];
  label: string;
  backgroundColor: string;
  borderColor: string;
  labels?: string[];
}

export const LineChart = ({
  data,
  label,
  backgroundColor,
  borderColor,
  labels = defaultLabels,
}: LineChartProps) => {
  const max = Math.max(...data, 1);
  const points = data
    .map((value, index) => {
      const x = labels.length === 1 ? 50 : (index / (labels.length - 1)) * 100;
      const y = 100 - (value / max) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="line-chart" viewBox="0 0 100 100" role="img" aria-label={label}>
      <polyline
        fill="none"
        points={points}
        stroke={borderColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <polygon points={`0,100 ${points} 100,100`} fill={backgroundColor} opacity="0.16" />
    </svg>
  );
};
