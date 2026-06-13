import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function WeeklyOrdersChart() {
    const [chartData, setChartData] = useState(null);
    const token = localStorage.getItem('piknic_admin_token');

    useEffect(() => {
        const fetchWeekly = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/charts/weekly-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setChartData({
                    labels: data.days,
                    datasets: [
                        {
                            label: 'Buyurtmalar soni',
                            data: data.ordersData,
                            backgroundColor: 'rgba(44, 85, 48, 0.8)',
                            borderColor: '#2C5530',
                            borderWidth: 2,
                            borderRadius: 8,
                            hoverBackgroundColor: '#2C5530'
                        }
                    ]
                });
            } catch (error) {
                console.error("Haftalik buyurtmalar grafigini yuklashda xatolik", error);
            }
        };

        fetchWeekly();
    }, [token]);

    if (!chartData) {
        return <div className="h-80 flex items-center justify-center">Yuklanmoqda...</div>;
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1A1A1A',
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return `${context.parsed.y} ta buyurtma`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    stepSize: 1
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="h-80">
            <Bar data={chartData} options={options} />
        </div>
    );
}