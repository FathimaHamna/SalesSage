import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import image1 from "../images/12.jpg";
import logoImage from "../images/10.png";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";

const Home = () => {
  const [showStaticText, setShowStaticText] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setShowStaticText(true), 3000); // Adjust timing based on typewriter speed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gradient-to-b from-black via-gray-800 to-gray-900 text-white">
     {/* Hero Section */}

<motion.section 
  className="relative py-20 flex flex-col md:flex-row items-center justify-between px-10 overflow-hidden" 
  initial={{ opacity: 0, y: -50 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 1 }} 
  whileInView={{ scale: 1, opacity: 1 }} 
  viewport={{ once: false, amount: 0.5 }} 
>
  
  {/* Left Section - Logo & Text */} 
  <div className="w-full md:w-1/2 text-center md:text-left relative z-10"> 
    {/* SalesSage Logo */} 
    <div className="flex justify-center md:justify-start mb-6"> 
      <img src={logoImage} alt="SalesSage Logo" className="h-16 md:h-20" /> 
    </div> 
 
    {/* Welcome Heading with Typewriter Effect */} 
    <motion.h1 
      className="text-5xl font-bold leading-tight mb-6" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }} 
    > 
      {showStaticText ? ( 
        <>Welcome to <span className="text-orange-400">SalesSage!!</span></> 
      ) : ( 
        <Typewriter 
          options={{ 
            strings: ["Welcome to SalesSage!!"], 
            autoStart: true, 
            delay: 150, // Word-by-word effect 
            cursor: "", // Hides the cursor after completion 
            onComplete: () => setShowStaticText(true), // Switch to static text 
          }} 
        /> 
      )} 
    </motion.h1> 
 
    {/* Description with Word-by-Word Motion */} 
    <motion.p 
      className="text-lg text-gray-300 max-w-2xl" 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1, delay: 0.5 }} 
    > 
      <strong>SalesSage - Powered by OfficePro Solutions</strong>, provides AI-driven insights 
      and advanced sales predictions to enhance business performance. 
    </motion.p> 
 
    {/* Additional Lines for Space Filling */} 
    <motion.p 
      className="text-lg text-gray-400 mt-4 max-w-2xl" 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1, delay: 1 }} 
    > 
      Stay ahead with cutting-edge analytics, interactive reports, and a seamless user experience. 
      Transform your business with real-time forecasting and data-driven strategies. 
    </motion.p> 
  </div> 
 
  {/* Right Section - Image with inside-to-outside animation */}
  <div className="w-full md:w-1/2 text-center mt-6 md:mt-0 relative z-10">
    <motion.div
      className="relative"
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 1.5,
        delay: 0.8,
        ease: "easeOut"
      }}
      whileInView={{ scale: 1, opacity: 1 }} 
      viewport={{ once: false, amount: 0.5 }}  
    >
      <div className="relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black rounded-lg"></div>

        {/* Image */}
        <img src={image1} alt="SalesSage Team" className="max-w-full rounded-lg shadow-lg" />
      </div>
    </motion.div>
  </div>
</motion.section>


{/* Features Section */}
<section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
  <div className="container mx-auto px-6">
    {/* Title with inside-out animation */}
    <motion.h2
      className="text-5xl font-bold leading-tight mb-12 text-center"
      initial={{ scale: 0.2, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: false, amount: 0.5 }}  
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      Why Choose <span className="text-orange-400">SalesSage?</span>
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          title: "Future Sales Predictions",
          description: "Leverage machine learning to forecast sales with high accuracy.",
          icon: "📊",
          delay: 0.3,
        },
        {
          title: "Sales Analysis",
          description: " Gain valuable insights from historical sales data with visualizations.",
          icon: "⚡",
          delay: 0.6,
        },
        {
          title: "Real Time Data Entry and Analysis",
          description: "Instantly update and analyze new sales data for better decision-making.",
          icon: "🔗",
          delay: 0.9,
        },
      ].map((feature, index) => (
        <motion.div
          key={index}
          className="text-center p-6 border border-gray-700 rounded-lg shadow-md bg-gray-800 hover:shadow-xl transition-all"
          initial={{ scale: 0.2, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}  
          transition={{ 
            duration: 0.8, 
            delay: feature.delay,
            ease: "easeOut"
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-5xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* How It Works Section */}
<section className="py-16 bg-gradient-to-b from-gray-800 to-gray-700">
  <div className="container mx-auto px-6">
    {/* Title with inside-out animation */}
    <motion.h2
      className="text-5xl font-bold leading-tight mb-12 text-center"
      initial={{ scale: 0.2, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: false, amount: 0.5 }}  
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      How <span className="text-orange-400">SalesSage</span> Works
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[ 
        {
          step: "1️⃣",
          title: "Enter Sales Data",
          description: "Add real-time sales records seamlessly.",
          delay: 0.3,
        },
        {
          step: "2️⃣",
          title: "Analyze Performance",
          description: "View sales trends, customer behavior, and product demand.",
          delay: 0.6,
        },
        {
          step: "3️⃣",
          title: "Predict Future Sales",
          description: "Get AI-driven forecasts to optimize business strategies.",
          delay: 0.9,
        },
        {
          step: "4️⃣",
          title: "Make Smarter Decisions",
          description: "Use insights to increase revenue and efficiency.",
          delay: 1.2,
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          className="text-center p-6 border border-gray-700 rounded-lg shadow-md bg-gray-800 hover:shadow-xl transition-all"
          initial={{ scale: 0.2, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}  
          transition={{ 
            duration: 0.8, 
            delay: item.delay,
            ease: "easeOut"
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-4xl mb-4">{item.step}</div>
          <h3 className="text-xl font-bold mb-3">{item.title}</h3>
          <p className="text-gray-400">{item.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>



      {/* Testimonials */}
<section className="py-16 bg-gray-900">
  <div className="container mx-auto px-6">
    <motion.h2
      className="text-4xl font-bold text-center mb-12"
      initial={{ scale: 0.2, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }} // Inside-to-out effect
      viewport={{ once: false, amount: 0.5 }} // Triggered when 50% of the element is visible
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      What Our <span className="text-orange-400">Clients Say</span>
    </motion.h2>

    <motion.div
      className="max-w-3xl mx-auto text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }} // Inside-to-out effect
      viewport={{ once: false, amount: 0.5 }} // Triggered when 50% of the element is visible
      transition={{ duration: 1 }}
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <p className="text-lg italic text-gray-300">
          "SalesSage transformed the way we predict sales. The accuracy and insights are top-notch!"
        </p>
        <h4 className="mt-4 font-bold text-orange-400">- Sarah Lee, Sales Director</h4>
      </div>
    </motion.div>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SalesSage</h3>
              <p className="text-gray-400">Your partner in AI-powered sales excellence.</p>
            </div>
            {/* <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-400">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400">Contact</a></li>
              </ul>
            </div> */}
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/app/home" className="text-gray-400 hover:text-orange-400">Home</Link></li>
                <li><Link to="/app/dashboard" className="text-gray-400 hover:text-orange-400">Dashboard</Link></li>
                <li><Link to="/app/prediction" className="text-gray-400 hover:text-orange-400">Prediction</Link></li>
                <li><Link to="/app/products" className="text-gray-400 hover:text-orange-400">Products</Link></li>
                <li><Link to="/app/data-entry" className="text-gray-400 hover:text-orange-400">Sales</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="text-gray-400 space-y-2">
                <li>Sales Predictions</li>
                <li>Sales Analysis</li>
                <li>Real Time Data Entry</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <p className="text-gray-400">Email: info@salessage.com</p>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 SalesSage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
