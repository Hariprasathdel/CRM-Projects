import React, { useState } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
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
  const [timeRange, setTimeRange] = useState('week');

  const departments = ['Software', 'Marketing', 'Electrical', 'Production', 'HR', 'Finance'];
  
  const chartData = {
    labels: departments,
    datasets: [
      {
        label: 'Present',
        data: [45, 30, 25, 35, 20, 15],
        backgroundColor: 'rgba(40, 167, 69, 0.8)',
        borderColor: '#28a745',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6
      },
      {
        label: 'Absent',
        data: [8, 12, 10, 15, 5, 8],
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
        borderColor: '#dc3545',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6
      },
      {
        label: 'Leave',
        data: [5, 8, 6, 10, 3, 4],
        backgroundColor: 'rgba(255, 193, 7, 0.8)',
        borderColor: '#ffc107',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6
      }
    ]
  };

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Present',
        data: [65, 70, 68, 72, 75, 60, 45],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Absent',
        data: [15, 12, 18, 10, 8, 20, 25],
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Leave',
        data: [10, 8, 12, 8, 7, 10, 15],
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const doughnutData = {
    labels: ['Present', 'Absent', 'Leave'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: [
          'rgba(40, 167, 69, 0.9)',
          'rgba(220, 53, 69, 0.9)',
          'rgba(255, 193, 7, 0.9)'
        ],
        borderColor: ['#28a745', '#dc3545', '#ffc107'],
        borderWidth: 3,
        hoverOffset: 10
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
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          stepSize: 20
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={options} height={300} />;
      case 'line':
        return <Line data={lineChartData} options={options} height={300} />;
      case 'pie':
        return <Doughnut data={doughnutData} options={{ ...options, scales: undefined }} height={300} />;
      default:
        return <Bar data={chartData} options={options} height={300} />;
    }
  };

  return (
    <Card className="dashboard-card chart-card">
      <Card.Header className="chart-header">
        <div className="chart-header-left">
          <h5 className="chart-title">Attendance Overview</h5>
          <span className="chart-subtitle">Department-wise attendance statistics</span>
        </div>
        <div className="chart-header-right">
          <ButtonGroup size="sm" className="me-2">
            <Button 
              variant={chartType === 'bar' ? 'primary' : 'outline-secondary'}
              onClick={() => setChartType('bar')}
            >
              <FaChartBar />
            </Button>
            <Button 
              variant={chartType === 'line' ? 'primary' : 'outline-secondary'}
              onClick={() => setChartType('line')}
            >
              <FaChartLine />
            </Button>
            <Button 
              variant={chartType === 'pie' ? 'primary' : 'outline-secondary'}
              onClick={() => setChartType('pie')}
            >
              <FaChartPie />
            </Button>
          </ButtonGroup>
          
          <ButtonGroup size="sm">
            <Button 
              variant={timeRange === 'week' ? 'primary' : 'outline-secondary'}
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'primary' : 'outline-secondary'}
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button 
              variant={timeRange === 'year' ? 'primary' : 'outline-secondary'}
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </ButtonGroup>
        </div>
      </Card.Header>
      <Card.Body className="chart-body">
        <div className="chart-container">
          {renderChart()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChartSection;    