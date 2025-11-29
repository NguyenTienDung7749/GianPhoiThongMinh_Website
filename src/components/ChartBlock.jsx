// src/components/ChartBlock.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatDuration } from "../utils/calcDuration";

// Đăng ký các components của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function ChartBlock({ dailyStats }) {
  if (!dailyStats || dailyStats.length === 0) {
    return (
      <div className="text-center py-10 text-lava-orange/60">
        <span className="text-4xl mb-4 block">📈</span>
        <p>Chưa có dữ liệu để hiển thị biểu đồ</p>
      </div>
    );
  }

  // Đảo ngược để hiển thị từ cũ đến mới
  const reversedStats = [...dailyStats].reverse();

  const data = {
    labels: reversedStats.map((d) =>
      d.dateObj.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })
    ),
    datasets: [
      {
        label: "Thời gian phơi (phút)",
        data: reversedStats.map((d) => Math.round(d.dryingSec / 60)),
        backgroundColor: "rgba(255, 34, 0, 0.8)",
        borderColor: "rgba(255, 85, 0, 1)",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(255, 85, 0, 1)",
      },
      {
        label: "Thời gian thu (phút)",
        data: reversedStats.map((d) => Math.round(d.inSec / 60)),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(34, 197, 94, 0.9)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffae00",
          font: {
            size: 12,
            weight: "bold",
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Thống kê hoạt động 7 ngày gần nhất",
        color: "#ff5500",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(10, 10, 10, 0.95)",
        titleColor: "#ff5500",
        bodyColor: "#ffae00",
        borderColor: "#ff2200",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const minutes = context.raw;
            const sec = minutes * 60;
            return `${context.dataset.label}: ${formatDuration(sec)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffae00",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(255, 34, 0, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#ffae00",
          font: {
            size: 11,
          },
          callback: function (value) {
            if (value >= 60) {
              return `${(value / 60).toFixed(1)}h`;
            }
            return `${value}m`;
          },
        },
        grid: {
          color: "rgba(255, 34, 0, 0.1)",
        },
      },
    },
  };

  return (
    <div className="h-80 p-4">
      <Bar data={data} options={options} />
    </div>
  );
}

export default ChartBlock;
