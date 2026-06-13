import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function RevenueChart() {
    const [chartData, setChartData] = useState(null);
    const token = localStorage.getItem('piknic_admin_token');

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/charts/revenue', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setChartData({
                    labels: data.months,
                    datasets: [
                        {
                            label: 'Oylik daromad (so\'m)',
                            data: data.revenueData,
                            borderColor: '#2C5530',
                            backgroundColor: 'rgba(44, 85, 48, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#2C5530',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 7
                        }
                    ]
                });
            } catch (error) {
                console.error("Daromad grafigini yuklashda xatolik", error);
            }
        };

        fetchRevenue();
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
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#2C5530',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return `Daromad: ${context.parsed.y.toLocaleString('uz-UZ')} so'm`;
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
                    callback: function (value) {
                        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                        if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                        return value;
                    }
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
            <Line data={chartData} options={options} />
        </div>
    );
}