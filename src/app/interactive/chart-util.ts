import { ChartOptions } from 'chart.js';

// the climate charts grow point-by-point; each point eases in from the
// previous one's y so the line draws itself left to right.
export const previous_y = (ctx: any) =>
  ctx.index === 0
    ? ctx.chart.scales.y.getPixelForValue(0)
    : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1]
        .getProps(['y'], true).y;

export function point_animation(delay: () => number) {
  return {
    x: {
      type: 'number',
      easing: 'linear',
      duration: delay,
      from: NaN,
      delay: (ctx: any) => (ctx.type !== 'data' || ctx.xStarted ? 0 : (ctx.xStarted = true, ctx.index * delay()))
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: delay,
      from: (ctx: any) => previous_y(ctx),
      delay: (ctx: any) => (ctx.type !== 'data' || ctx.yStarted ? 0 : (ctx.yStarted = true, ctx.index * delay()))
    }
  };
}

export function climate_chart_options(animation: any, x: { min: number; max: number; stepSize: number }): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation,
    interaction: { intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        type: 'linear',
        min: x.min,
        max: x.max,
        ticks: {
          callback: v => String(v),
          stepSize: x.stepSize,
          font: { size: 14 }
        }
      },
      y: {
        min: -1,
        max: 1,
        ticks: {
          maxTicksLimit: 4,
          font: { size: 14 },
          callback: v => Number(v).toFixed(1)
        }
      }
    }
  };
}
