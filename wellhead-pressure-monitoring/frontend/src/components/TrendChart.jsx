import React from 'react';
import ReactECharts from 'echarts-for-react';

const TrendChart = ({ title, series }) => {
  const options = {
    title: { 
        text: title, 
        textStyle: { color: '#ccc', fontSize: 13, fontWeight: 'normal', fontFamily: 'monospace' },
        left: 10,
        top: 10
    },
    tooltip: { 
        trigger: 'axis', 
        backgroundColor: '#1e1e1e', 
        borderColor: '#333', 
        textStyle: { color: '#fff' } 
    },
    legend: { 
        textStyle: { color: '#ccc' }, 
        right: 10,
        top: 10,
        icon: 'circle',
        itemWidth: 10
    },
    grid: { left: '3%', right: '4%', bottom: '5%', containLabel: true, top: 45 },
    xAxis: { 
        type: 'time', 
        splitLine: { show: false }, 
        axisLabel: { color: '#666', fontSize: 10 },
        axisLine: { lineStyle: { color: '#2a2a2a' } }
    },
    yAxis: { 
        type: 'value', 
        name: 'Pressure (psi)', 
        splitLine: { lineStyle: { color: '#2a2a2a', type: 'dashed' } }, 
        axisLabel: { color: '#666', fontSize: 10 }, 
        nameTextStyle: { color: '#666', fontSize: 10, padding: [0, 0, 0, 20] } 
    },
    series: series.map(s => ({
      name: s.name,
      type: 'line',
      showSymbol: false,
      smooth: true,
      lineStyle: { width: 2, color: s.color },
      itemStyle: { color: s.color },
      areaStyle: {
        color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
                { offset: 0, color: s.color ? `${s.color}40` : 'rgba(59, 130, 246, 0.4)' },
                { offset: 1, color: s.color ? `${s.color}00` : 'rgba(59, 130, 246, 0)' }
            ]
        }
      },
      data: s.data
    })),
    backgroundColor: 'transparent'
  };

  return <ReactECharts option={options} style={{ height: '280px', width: '100%' }} />;
}

export default TrendChart;
