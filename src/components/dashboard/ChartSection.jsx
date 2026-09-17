import React, { useState } from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaChartBar, FaChartLine, FaChartPie } from 'react-icons/fa';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartSection = () => {
  const [chartType, setChartType] = useState('bar');

  const departments = [
    'Software', 'Marketing', 'Electrical', 
    'Production', 'HR', 'Finance'
  ];

  const barData = {
    labels: departments,
    datasets: [
      {
        label: 'Present',
        data: [45, 30, 25, 35, 20, 15],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: '#22c55e',
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.7
      },
      {
        label: 'Absent',
        data: [8, 12, 10, 15, 5, 8],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#ef4444',
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.7
      },
      {
        label: 'Leave',
        data: [5, 8, 6, 10, 3, 4],
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
        borderColor: '#eab308',
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.7
      }
    ]
  };

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Present',
        data: [65, 70, 68, 72, 75, 60, 45],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      },
      {
        label: 'Absent',
        data: [15, 12, 18, 10, 8, 20, 25],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      },
      {
        label: 'Leave',
        data: [10, 8, 12, 8, 7, 10, 15],
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }
    ]
  };

  const doughnutData = {
    labels: ['Present', 'Absent', 'Leave'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: [
          'rgba(34, 197, 94, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(234, 179, 8, 0.9)'
        ],
        borderColor: ['#22c55e', '#ef4444', '#eab308'],
        borderWidth: 3,
        hoverOffset: 12
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={lineData} options={options} />;
      case 'pie':
        return (
          <Doughnut 
            data={doughnutData} 
            options={{ 
              ...options, 
              scales: undefined,
              cutout: '65%'
            }} 
          />
        );
      default:
        return <Bar data={barData} options={options} />;
    }
  };

  return (
    <Card className="dashboard-card chart-card h-100">
      <Card.Header className="chart-card-header">
        <div>
          <h5 className="chart-title">Attendance Overview</h5>
          <span className="chart-subtitle">
            Department-wise attendance statistics
          </span>
        </div>
        <ButtonGroup size="sm" className="chart-type-buttons">
          <Button
            variant={chartType === 'bar' ? 'primary' : 'outline-secondary'}
            onClick={() => setChartType('bar')}
            title="Bar Chart"
          >
            <FaChartBar />
          </Button>
          <Button
            variant={chartType === 'line' ? 'primary' : 'outline-secondary'}
            onClick={() => setChartType('line')}
            title="Line Chart"
          >
            <FaChartLine />
          </Button>
          <Button
            variant={chartType === 'pie' ? 'primary' : 'outline-secondary'}
            onClick={() => setChartType('pie')}
            title="Doughnut Chart"
          >
            <FaChartPie />
          </Button>
        </ButtonGroup>
      </Card.Header>
      <Card.Body className="chart-card-body">
        <div className="chart-container">{renderChart()}</div>
      </Card.Body>
    </Card>
  );
};

export default ChartSection;