import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Image1 from '../images/13.jpg'; 
import Icon1 from '../images/icon1.jpeg'; 
import { motion } from 'framer-motion';
import { ArrowRight, BarChart4 } from 'lucide-react';
// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Prediction = () => {
  const [dailyDate, setDailyDate] = useState("");

  const [selectedDate, setSelectedDate] = useState('');
  const [chartLabels, setChartLabels] = useState([]); // Chart labels (dates)
  const [chartData, setChartData] = useState([]);

  const [topCustomers, setTopCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [yesterdayStats, setYesterdayStats] = useState({
    date: "",
    total_sales: 0,
  });

  const [monthlydate, setMonthlyDate] = useState("");
  const [monthly_prediction, setMonthlyPrediction] = useState(null);
  const [monthlyError, setMonthlyError] = useState(null);

  const handleMonthlyPredict = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/predict-monthly-sales/", { date: monthlydate });
      setMonthlyPrediction(response.data.predicted_sales);
      setMonthlyError(null);
    } catch (err) {
      setMonthlyError("Failed to fetch prediction");
      setMonthlyPrediction(null);
    }
  };
  
  const [weeklydate, setWeeklyDate] = useState("");
  const [weekly_prediction, setWeeklyPrediction] = useState(null);
  const [weeklyError, setWeeklyError] = useState(null);

  const handleWeeklyPredict = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/predict-weekly-sales/", { date: weeklydate });
      setWeeklyPrediction(response.data.predicted_sales);
      setWeeklyError(null);
    } catch (err) {
      setWeeklyError("Failed to fetch prediction");
      setWeeklyPrediction(null);
    }
  };

  const [daydate, setDayDate] = useState("");
  const [day_prediction, setDayPrediction] = useState(null);
  const [dayError, setDayError] = useState(null);

  const handleDailyPredict = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/predict-daily-sales/", { date: daydate });
      setDayPrediction(response.data.predicted_sales);
      setDayError(null);
    } catch (err) {
      setDayError("Failed to fetch prediction");
      setDayPrediction(null);
    }
  };

  const fetchQuickInsights = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/quick-insights/");
      const data = await response.json();

      if (data.status === "success") {
        const dateObj = new Date(data.data.date);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        setYesterdayStats({
          date: formattedDate,
          total_sales: data.data.total_sales,
        });
      }
    } catch (error) {
      console.error("Error fetching quick insights:", error);
    }
  };

  const fetchTopCustomers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/get-top-customers/");
      const data = await response.json();
      if (data.status === "success") {
        setTopCustomers(data.sales);
      }
    } catch (error) {
      console.error("Error fetching top customers:", error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/get-top-products/");
      const data = await response.json();
      if (data.status === "success") {
        setTopProducts(data.sales);
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
  };

  // Fetch predicted sales data
  const fetchSalesData = async () => {
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/daily-sales-prediction/?date=${selectedDate}`);
      const data = await response.json();

      if (data.sales_data) {
        // Extract dates and predicted sales
        const labels = data.sales_data.map((item) => item.date);
        const sales = data.sales_data.map((item) => item.predicted_sales);

        // Update state with new data
        setChartLabels(labels);
        setChartData(sales);
      } else {
        alert("No sales data available!");
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };


  useEffect(() => {
    fetchQuickInsights();
    fetchTopCustomers();
    fetchTopProducts();
  }, []);

  return (
  

<div className="container mx-auto p-6 space-y-6 bg-gradient-to-b from-black to-gray-900 min-h-screen text-white pt-20">

<motion.div
  className="text-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  {/*<h2 className="text-3xl font-bold mb-6 text-orange-400">📊 Sales Predictions</h2>*/}
  <h2 className="text-3xl font-bold mb-6 text-orange-400 flex items-center justify-center w-full">
  <img 
    src={Icon1} 
    alt="Bar Chart" 
    className="h-8 w-8 mr-2"
  />
  <span>Sales Predictions</span>
</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* Daily Prediction */}
    <motion.div 
      className="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-600 text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <h3 className="text-xl font-semibold text-orange-300">Daily Sales Prediction</h3>
      <input
        type="date"
        className="mt-4 p-2 w-full border border-gray-500 rounded-md bg-gray-700 text-white"
        value={daydate}
        onChange={(e) => setDayDate(e.target.value)}
      />
      <motion.button 
        className="mt-4 w-full bg-orange-400 text-black py-2 rounded-lg shadow-md hover:bg-orange-600"
        whileHover={{ scale: 1.1 }}
        onClick={handleDailyPredict}
      >
        Predict
      </motion.button>
      {day_prediction !== null && <h3 className="mt-4 text-xl text-orange-400">Predicted Sales: ${day_prediction}</h3>}
      {dayError && <p className="mt-2 text-red-500">{dayError}</p>}
    </motion.div>

    {/* Weekly Prediction */}
    <motion.div 
      className="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-600 text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
    >
      <h3 className="text-xl font-semibold text-orange-300">Weekly Sales Prediction</h3>
      <input
        type="date"
        className="mt-4 p-2 w-full border border-gray-500 rounded-md bg-gray-700 text-white"
        value={weeklydate}
        onChange={(e) => setWeeklyDate(e.target.value)}
      />
      <motion.button 
        className="mt-4 w-full bg-orange-400 text-black py-2 rounded-lg shadow-md hover:bg-orange-600"
        whileHover={{ scale: 1.1 }}
        onClick={handleWeeklyPredict}
      >
        Predict
      </motion.button>
      {weekly_prediction !== null && <h3 className="mt-4 text-xl text-orange-400">Predicted Sales: ${weekly_prediction}</h3>}
      {weeklyError && <p className="mt-2 text-red-500">{weeklyError}</p>}
    </motion.div>

    {/* Monthly Prediction */}
    <motion.div 
      className="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-600 text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6 }}
    >
      <h3 className="text-xl font-semibold text-orange-300">Monthly Sales Prediction</h3>
      <input
        type="date"
        className="mt-4 p-2 w-full border border-gray-500 rounded-md bg-gray-700 text-white"
        value={monthlydate}
        onChange={(e) => setMonthlyDate(e.target.value)}
      />
      <motion.button 
        className="mt-4 w-full bg-orange-400 text-black py-2 rounded-lg shadow-md hover:bg-orange-600"
        whileHover={{ scale: 1.1 }}
        onClick={handleMonthlyPredict}
      >
        Predict
      </motion.button>
      {monthly_prediction !== null && <h3 className="mt-4 text-xl text-orange-400">Predicted Sales: ${monthly_prediction}</h3>}
      {monthlyError && <p className="mt-2 text-red-500">{monthlyError}</p>}
    </motion.div>

  </div>
</motion.div>

  

{/* Why Use Sales Predictions Section */}
<motion.div 
  className="flex items-center justify-center text-gray-300 mt-0"
  initial={{ opacity: 0, x: -100 }} // Initial state: hidden to the left
  whileInView={{ opacity: 1, x: 0 }} // Animation when in view: fade in and move to original position
  transition={{ duration: 1 }}
  viewport={{ once: true }} // Trigger animation only once
>
  
  {/* Left Content (Text) */}
  <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-start ml-4">
  
    {/* Title with larger font */}
    <motion.p 
      className="text-3xl font-bold text-orange-400 mt-[-10px] mb-4"
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      📈 Why Use Sales Predictions?
    </motion.p>
  
    {/* List with motion effects */}
    <motion.ul 
      className="space-y-4 text-lg"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <motion.li 
        className="flex items-center justify-center md:justify-start"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center">
        <ArrowRight className="text-amber-500 h-5 w-5 mr-2 flex-shrink-0" />
        <span>Plan Inventory Smartly – Stock up based on demand forecasts.</span>
        </div>
      </motion.li>
      <motion.li 
        className="flex items-center justify-center md:justify-start"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center">
        <ArrowRight className="text-amber-500 h-5 w-5 mr-2 flex-shrink-0" />
        <span>Identify Trends – Understand seasonal highs and lows.</span>
        </div>
      </motion.li>
      <motion.li 
        className="flex items-center justify-center md:justify-start"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center">
        <ArrowRight className="text-amber-500 h-5 w-5 mr-2 flex-shrink-0" />
        <span>Optimize Pricing & Promotions – Run discounts on slow days, boost profits on peak days.</span>
        </div>
      </motion.li>
    </motion.ul>
  </div>
  
  {/* Right Content (Image) */}
  <motion.div 
    className="hidden md:block w-full md:w-1/2"
    initial={{ opacity: 0, x: 100 }} // Initial position: image is hidden to the right
    whileInView={{ opacity: 1, x: 0 }} // Animate to normal position when in view
    transition={{ duration: 1 }}
  >
    <img 
      src={Image1} 
      alt="Sales Prediction" 
      className="w-full h-full object-cover rounded-lg shadow-lg" 
    />
  </motion.div>
  
</motion.div>



  <div className="container mx-auto p-6 bg-gradient-to-b from-black to-gray-900 min-h-screen text-white flex flex-col items-center justify-center pt-20">

{/* Heading & Explanation */}
<h2 className="text-3xl font-bold mb-6 text-orange-400 text-center flex items-center justify-center">
  <BarChart4 className="text-orange-400 h-8 w-8 mr-2" />
  <span>Sales Forecast at a Glance!</span>
</h2>
<p className="text-lg text-gray-300 text-center mb-4 max-w-2xl">
  The graph below represents predicted sales trends based on past data. Select a date, hit ‘Load Sales Data,’ and see the expected sales for that day!
</p>

{/* Graph Legend */}
<div className="text-gray-400 mb-6 text-center">
  <p><span className="font-bold text-orange-300">🔹 Orange Line:</span> Represents predicted sales values, helping you anticipate trends.</p>
  <p><span className="font-bold text-orange-300">🔹 Dynamic Updates:</span> Enter a date and watch the graph adjust instantly.</p>
</div>

{/* Date Picker & Button */}
<div className="mb-8 flex flex-col items-center">
  <input 
    type="date" 
    value={selectedDate} 
    onChange={(e) => setSelectedDate(e.target.value)} 
    className="p-2 border border-orange-400 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-orange-400"
  />
  <button 
    onClick={fetchSalesData} 
    className="mt-4 px-6 py-2 bg-orange-400 text-black rounded-lg shadow-md hover:bg-orange-600">
    Load Sales Data
  </button>
</div>

{/* Graph Section */}
<div className="w-full md:w-3/4 lg:w-1/2 flex flex-col items-center">
  
  {/* Graph Title */}
  <h3 className="text-xl font-semibold text-orange-300 text-center mb-4">Predicted Daily Sales</h3>
  
  {/* Graph Container */}
  <div className="w-full h-96">
    <Line
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: "Predicted Sales",
            data: chartData,
            borderColor: "orange",
            backgroundColor: "rgba(255,165,0,0.2)",
            fill: true,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: { 
            grid: { color: "rgba(255, 255, 255, 0.2)" },
            ticks: { color: "white" }, 
          },
          y: { 
            grid: { color: "rgba(255, 255, 255, 0.2)" } ,
            ticks: { color: "white" }, 
          },
          },
        plugins: {
          legend: { labels: { color: "white" } },
        },
      }}
    />
  </div>
</div>

</div>


      {/* Yesterday's Insights Section */}
      {/* <div className="mb-8 rounded-lg bg-white shadow-md text-center p-6 border border-gray-300">
        <h2 className="text-3xl font-bold mb-4 text-orange-500">Yesterday's Insights</h2>
        <p className="text-xl mb-2">{yesterdayStats.date}</p>
        <p className="text-4xl font-bold text-black">
          Total Sales: ${yesterdayStats.total_sales.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div> */}

      {/* Main Content Area */}
      {/* <div className="bg-white rounded-lg p-6 shadow-md border border-gray-300"> */}
        {/* Summary Insights Section */}
        {/* <div className="p-6 rounded-lg shadow-md mb-6 border border-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-orange-500">Summary Insights</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm text-center">
              <h3 className="text-lg font-semibold text-gray-800">Top Customer</h3>
              <p className="text-green-400 font-medium mt-2">{topCustomers[0]?.customer_name || "N/A"}</p>
              <p className="text-gray-600 mt-1">${topCustomers[0]?.total_sales.toFixed(2) || "0.00"}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm text-center">
              <h3 className="text-lg font-semibold text-gray-800">Top Product</h3>
              <p className="text-green-400 font-medium mt-2">{topProducts[0]?.product_name || "N/A"}</p>
              <p className="text-gray-600 mt-1">${topProducts[0]?.total_sales.toFixed(2) || "0.00"}</p>
            </div>
          </div>
        </div> */}

                {/* Top Customers & Products Section */}
        {/* <div className="grid grid-cols-2 gap-6 mb-6 p-6 bg-gradient-to-b from-gray-900 to-gray-700 rounded-lg shadow-lg border border-gray-600"> */}
          {/* Top Customers Section */}
          {/* <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 text-center">Top Customers</h2>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="p-4 border border-gray-500 rounded-lg shadow-sm flex justify-between items-center bg-gray-900">
                  <span className="font-medium text-white">{index + 1}. {customer.customer_name}</span>
                  <span className="text-orange-300 font-semibold">${customer.total_sales.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div> */}

          {/* Top Products Section */}
          {/* <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 text-center">Top Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="p-4 border border-gray-500 rounded-lg shadow-sm flex justify-between items-center bg-gray-900">
                  <span className="font-medium text-white">{index + 1}. {product.product_name}</span>
                  <span className="text-orange-300 font-semibold">${product.total_sales.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div> */}


      </div>
  );
};

export default Prediction;
