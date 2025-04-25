import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, PieChart as PieIcon } from 'lucide-react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { motion } from "framer-motion";
import Image2 from '../images/c2.png';
import Image3 from '../images/c3.png';
import Image4 from '../images/c4.png';
import Image5 from '../images/c5.png';
import Image6 from '../images/c6.png';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  ArcElement, // Needed for Pie and Doughnut charts
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [quickStats, setQuickStats] = useState({
    date: '',
    total_sales: 0,
    avg_order_value: 0,
    total_orders: 0,
    total_profit: 0
  });
  const [salesData, setSalesData] = useState([]);  // State for sales data
  const [profitData, setProfitData] = useState([]);  // State for profit data
  const [isLoading, setIsLoading] = useState(true);
  const [salesByProductData, setSalesByProductData] = useState([]); // Sales by Product data
  const [salesByCustomerData, setSalesByCustomerData] = useState([]); // State for sales by customer data

  useEffect(() => {
    fetchDashboardData();
    fetchSalesData();  // Fetch sales data for Sales Analysis section
    fetchProfitData(); //Fetch profit data
    fetchSalesByProductData();
    fetchSalesByCustomerData(); // Fetch sales by customer data
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const insightsResponse = await fetch('http://localhost:8000/api/quick-insights/');
      const insightsData = await insightsResponse.json();
      
      if (insightsData.status === 'success') {
        const dateObj = new Date(insightsData.data.date);
        insightsData.data.date = dateObj.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        setQuickStats(insightsData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/sales-data/');
      const data = await response.json();
      if (data.status === 'success') {
        setSalesData(data.sales);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };
  
  const formatSalesDataForChart = () => {
    const sortedSalesData = [...salesData].sort((a, b) => new Date(a.order_date) - new Date(b.order_date));
  
    const labels = sortedSalesData.map(item => item.order_date);  // Dates are already formatted as 'YYYY-MM-DD'
    const salesValues = sortedSalesData.map(item => item.sales);
  
    return {
      labels,
      datasets: [
        {
          label: 'Sales Over Time',
          data: salesValues,
          backgroundColor: 'rgba(255, 204, 153, 0.7)', // Very light orange
          borderColor: 'rgba(255, 140, 0, 0.9)', // Slightly darker orange for contrast
          borderWidth: 1,
          tension: 0.4
        }
      ]
    };
  };
  
  
  const fetchProfitData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/profit-data/');
      const data = await response.json();
      if (data.status === 'success') {
        setProfitData(data.sales);
      }
    } catch (error) {
      console.error('Error fetching profit data:', error);
    }
  };

  const formatProfitDataForChart = () => {
    const sortedProfitData = [...profitData].sort((a, b) => new Date(a.order_date) - new Date(b.order_date));
  
    const labels = sortedProfitData.map(item => item.order_date);  // Dates already formatted in 'YYYY-MM-DD'
    const profitValues = sortedProfitData.map(item => item.profit);
  
    return {
      labels,
      datasets: [
        {
          label: 'Profit Over Time',
          data: profitValues,
          backgroundColor: 'rgba(255, 204, 153, 0.7)', // Very light orange
          borderColor: 'rgba(255, 140, 0, 0.9)', // Slightly darker orange for contrast
          borderWidth: 1,
          tension: 0.4
        }
      ]
    };
  };  

  const fetchSalesByProductData = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/product-data/');
        const data = await response.json();
        if (data.status === 'success') {
            setSalesByProductData(data.sales);
        }
    } catch (error) {
        console.error('Error fetching sales by product data:', error);
    }
};

const formatSalesByProductDataForChart = () => {
  const sortedSalesByProductData = [...salesByProductData].sort((a, b) => a.product_name.localeCompare(b.product_name));

  const productNames = sortedSalesByProductData.map(item => item.product_name);
  const salesValues = sortedSalesByProductData.map(item => item.sales);

  return {
      labels: productNames,
      datasets: [
          {
              label: 'Sales by Product',
              data: salesValues,
              backgroundColor: 'rgba(255, 204, 153, 0.7)', // Very light orange
              borderColor: 'rgba(255, 140, 0, 0.9)', // Slightly darker orange for contrast
              borderWidth: 1
          }
      ]
  };
};

const formatSalesByCustomerDataForChart = () => {
  const customerNames = salesByCustomerData.map(item => item.customer_name);
  const totalSales = salesByCustomerData.map(item => item.total_sales);

  return {
    labels: customerNames,
    datasets: [
      {
        data: totalSales,
        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'], // Customize colors
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1
      }
    ]
  };
};

const fetchSalesByCustomerData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/customer-data/');
    const data = await response.json();
    if (data.status === 'success') {
      setSalesByCustomerData(data.sales); // Store the fetched sales by customer data
    }
  } catch (error) {
    console.error('Error fetching sales by customer data:', error);
  }
};

  const quickInsights = [
    {
      title: "Total Sales",
      value: `$${quickStats.total_sales.toLocaleString(undefined, { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: "Average Order Value",
      value: `$${quickStats.avg_order_value.toLocaleString(undefined, { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      icon: <ShoppingCart className="h-4 w-4" />
    },
    {
      title: "Total Orders",
      value: quickStats.total_orders.toLocaleString(),
      icon: <Package className="h-4 w-4" />
    },
    {
      title: "Total Profit",
      value: `$${quickStats.total_profit.toLocaleString(undefined, { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      icon: <PieIcon className="h-4 w-4" />
    }
  ];

  return (
    <div className="bg-black">
  {/* Quick Insights Section */}
  <section className="w-full bg-black pt-16 pb-2">
    <div className="container mx-auto px-6">
      <motion.h2
        className="text-4xl font-bold leading-tight mb-6 text-center text-orange-400"
        initial={{ scale: 0.2, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Quick Insights
      </motion.h2>
      <h2 className="text-3xl text-gray-400 text-center mb-12">{quickStats.date}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {quickInsights.map((insight, index) => (
          <motion.div
            key={insight.title}
            className="text-center p-6 border border-gray-700 rounded-lg shadow-md bg-gray-800 hover:shadow-xl transition-all"
            initial={{ scale: 0.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{
              duration: 0.8,
              delay: 0.3 + index * 0.3,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500">
                {insight.icon}
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-400">{insight.title}</p>
                <h3 className="text-3xl font-semibold text-orange-400">{insight.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>


{/* Sales Analysis Section */}
<section className="w-full bg-black py-16">
  <div className="container mx-auto px-6">
    <motion.h2
      className="text-4xl font-bold mb-6 text-center text-orange-400"
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      Sales Analysis
    </motion.h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Sales by Customer Pie Chart */}
      <motion.div
        className="rounded-lg shadow-lg p-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-orange-300">Sales by Customers</h3>
        <div className="flex justify-center items-center" style={{ width: '100%', height: '300px' }}>
          <Pie 
            data={formatSalesByCustomerDataForChart()}
            options={{
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    boxWidth: 20,
                    color: '#fff'
                  }
                }
              }
            }}
          />
        </div>
      </motion.div>

      {/* Sales by Product Bar Chart */}
      <motion.div
        className="rounded-lg shadow-lg p-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-orange-300">Sales by Products</h3>
        <Bar
          data={formatSalesByProductDataForChart()}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#fff'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              x: {
                ticks: {
                  color: '#fff'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#fff'
                }
              }
            }
          }}
        />
      </motion.div>

      {/* Sales Over Time */}
      <motion.div
        className="rounded-lg shadow-lg p-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-orange-300">Sales Over Time</h3>
        <Line 
          data={formatSalesDataForChart()} 
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#fff'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              x: {
                ticks: {
                  color: '#fff'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#fff'
                }
              }
            }
          }}
        />
      </motion.div>
      
      {/* Profit Over Time */}
      <motion.div
        className="rounded-lg shadow-lg p-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-orange-300">Profit Over Time</h3>
        <Line
          data={formatProfitDataForChart()}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 2,
                  color: '#fff'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              x: {
                ticks: {
                  color: '#fff'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#fff'
                }
              }
            }
          }}
        />
      </motion.div>
    </div>
  </div>
</section>

{/* Historical Analysis Section */}
<section className="w-full bg-black py-16">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold mb-6 text-center text-orange-400">Historical Analysis</h2>
    <div className="grid grid-cols-1 md:grid-cols-2">

      {/* First row with Image 1 and Image 2 */}
<div className="rounded-lg shadow-lg p-6 text-center">
  <h3 className="text-lg font-semibold mb-4 text-orange-500">Sales Distribution by Category</h3>
  <motion.img 
    src={Image6}
    alt="Top Selling Products"
    className="w-3/4 h-auto rounded-lg mx-auto"  
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ amount: 0.2 }} // Ensures it triggers every time it enters view
  />
</div>
<div className="rounded-lg shadow-lg p-6">
  <h3 className="text-lg font-semibold mb-4 text-orange-500">Total Sales by Month</h3>
  <motion.img 
    src={Image4}
    alt="Revenue Growth Over Time"
    className="w-full h-auto rounded-lg"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ amount: 0.2 }} // Ensures animation triggers on every scroll
  />
</div>

      {/* Second row with Image 3 and Image 4 */}
      <div className="rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-orange-500">Top 10 Customers by Sales</h3>

        <motion.img 
          src={Image3}
          alt="Customer Purchase Trends"
          className="w-full h-auto rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 0.2 }}
        />
      </div>

      <div className="rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-orange-500">Total Profit by Month</h3>
        <motion.img 
          src={Image5}
          alt="Sales Distribution by Category"
          className="w-full h-auto rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 0.2 }}
        />
      </div>
    </div>

    <div className="rounded-lg shadow-lg p-6">
  <h3 className="text-lg font-semibold mb-4 text-orange-500">Top 10 Products by Sales</h3>
  <motion.img 
        src={Image2}
        alt="Sales Distribution by Category"
        className="w-3/4 h-auto rounded-lg mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ amount: 0.2 }}
      />
</div>

  </div>
</section>




  {isLoading && (
    <div className="flex justify-center items-center h-40 bg-black">
      <div className="text-lg text-white">Loading dashboard data...</div>
    </div>
  )}
</div>

  );
};

export default Dashboard;
