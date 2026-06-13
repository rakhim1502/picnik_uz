import { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart() {
    const [chartData, setChartData] = useState(null);
    const token = localStorage.getItem('piknic_admin_token');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/charts/categories', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setChartData({
                    labels: data.labels,
                    datasets: [
                        {
                            data: data.data,
                            backgroundColor: [
                                '#2C5530',
                                '#E85D04',
                                '#1A1A1A',
                                '#4A7C59',
                                '#F4A261'
                            ],
                            borderColor: '#fff',
                            borderWidth: 3,
                            hoverOffset: 10
                        }
                    ]
                });
            } catch (error) {
                console.error("Kategoriya grafigini yuklashda xatolik", error);
            }
        };

        fetchCategories();
    }, [token]);

    if (!chartData) {
        return <div className="h-80 flex items-center justify-center">Yuklanmoqda...</div>;
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: '#1A1A1A',
                padding: 12,
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed.toLocaleString('uz-UZ')} so'm (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="h-80">
            <Doughnut data={chartData} options={options} />
        </div>
    );
}