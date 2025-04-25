import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DataEntry = () => {
  const [formData, setFormData] = useState({
    order_date: '',
    customer_id: '',
    customer_name: '',
    segment: '',
    country: '',
    city: '',
    state: '',
    postal_code: '',
    region: '',
    product_id: '',
    category: '',
    sub_category: '',
    product_name: '',
    sales: '',
    quantity: '',
    discount: '',
    profit: '',
    avg_for_week: 0,
    avg_for_month: 0,
    week_sales: 0,
    month_sales: 0,
    day_sales: 0
  });

  const segments = ['Consumer', 'Corporate', 'Home Office'];
  const regions = ['Central', 'East', 'West', 'South'];
  const categories = ['Office Supplies', 'Furniture', 'Technology'];
  const subCategories = {
    'Office Supplies': ['Paper', 'Labels', 'Storage', 'Supplies', 'Binders', 'Art'],
    'Furniture': ['Chairs', 'Tables', 'Furnishings', 'Bookcases'],
    'Technology': ['Phones', 'Machines', 'Accessories', 'Copiers']
  };

  const resetForm = () => {
    // Create an object with the same shape as formData but with empty values
    const emptyForm = Object.keys(formData).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    
    // Set the form data to the empty values
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        sales: parseFloat(formData.sales) || 0,
        quantity: parseInt(formData.quantity) || 0,
        discount: parseFloat(formData.discount) || 0,
        profit: parseFloat(formData.profit) || 0,
      };

      const response = await fetch('http://localhost:8000/api/sales/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });
      
      if (response.ok) {
        alert('Sales data submitted successfully!');
        setFormData({
          order_date: '',
          customer_id: '',
          customer_name: '',
          segment: '',
          country: '',
          city: '',
          state: '',
          postal_code: '',
          region: '',
          product_id: '',
          category: '',
          sub_category: '',
          product_name: '',
          sales: '',
          quantity: '',
          discount: '',
          profit: '',
          avg_for_week: 0,
          avg_for_month: 0,
          week_sales: 0,
          month_sales: 0,
          day_sales: 0
        });
      } else {
        const errorData = await response.json();
        alert(`Error submitting data: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error submitting data: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-24 pb-10 px-4 text-white">
  <div className="container mx-auto max-w-6xl">
    {/* Header with abstract data visualization */}
    <div className="mb-10 relative">
      {/*<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 inline-block">*/}
      <h1 className="text-4xl font-bold text-orange-400 inline-block">
        Sales Data Entry
      </h1>
      <div className="absolute -top-8 right-0 opacity-50 hidden md:block">
        <svg width="300" height="150" viewBox="0 0 300 150">
          <path d="M10,80 Q50,20 90,80 T170,80 T250,80" stroke="orange" strokeWidth="3" fill="none" />
          <path d="M10,100 Q50,40 90,100 T170,100 T250,100" stroke="orange" strokeWidth="2" fill="none" opacity="0.7" />
          <circle cx="50" cy="60" r="5" fill="orange" />
          <circle cx="90" cy="40" r="8" fill="orange" />
          <circle cx="130" cy="70" r="6" fill="orange" />
          <circle cx="170" cy="50" r="9" fill="orange" />
          <circle cx="210" cy="60" r="7" fill="orange" />
        </svg>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-12">

{/* Customer Section with floating cards design */}
<motion.div 
  className="relative"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  <h2 className="text-2xl font-bold mb-6 text-orange-400 flex items-center">
    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    Customer Information
  </h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Order Date</label>
      <input
        type="date"
        name="order_date"
        value={formData.order_date}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
        required
      />
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Customer ID</label>
      <input
        type="text"
        name="customer_id"
        value={formData.customer_id}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      />
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Customer Name</label>
      <input
        type="text"
        name="customer_name"
        value={formData.customer_name}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      />
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Segment</label>
      <select
        name="segment"
        value={formData.segment}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      >
        <option value="">Select Segment</option>
        {segments.map(segment => (
          <option key={segment} value={segment}>{segment}</option>
        ))}
      </select>
    </motion.div>
  </div>
</motion.div>

      {/* Location Section with floating cards design */}
<motion.div 
  className="relative"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  {/* <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-transparent"></div> */}
  <h2 className="text-2xl font-bold mb-6 text-orange-400 flex items-center">
    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    Location Information
  </h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Country</label>
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      />
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">City</label>
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      />
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">State</label>
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      />
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Postal Code</label>
      <input
        type="text"
        name="postal_code"
        value={formData.postal_code}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      />
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
       <label className="block text-sm font-medium mb-1 text-orange-200">Region</label>
      <select
        name="region"
        value={formData.region}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      >
        <option value="">Select Region</option>
        {regions.map(region => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>
    </motion.div>
  </div>
</motion.div>

     {/* Product Section with floating cards design */}
     <motion.div 
  className="relative"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  {/* <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-transparent"></div> */}
  
  <h2 className="text-2xl font-bold mb-6 text-orange-400 flex items-center">
    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
    Product Information
  </h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Product ID</label>
      <input
        type="text"
        name="product_id"
        value={formData.product_id}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      />
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Category</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      >
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Sub-Category</label>
      <select
        name="sub_category"
        value={formData.sub_category}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
        disabled={!formData.category}
      >
        <option value="">Select Sub-Category</option>
        {formData.category && subCategories[formData.category].map(subCat => (
          <option key={subCat} value={subCat}>{subCat}</option>
        ))}
      </select>
    </motion.div>
    <motion.div 
      className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <label className="block text-sm font-medium mb-1 text-orange-200">Product Name</label>
      <input
        type="text"
        name="product_name"
        value={formData.product_name}
        onChange={handleChange}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
      />
    </motion.div>
  </div>
</motion.div>

      {/* Sales Information with data visualization background */}
      <div className="relative">
        <h2 className="text-2xl font-bold mb-6 text-orange-400 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Sales Information
        </h2>
        
        {/* Mini sales chart 
        <div className="absolute right-0 top-0 w-48 h-24 opacity-70 hidden md:block">
          <svg viewBox="0 0 200 100">
            <path d="M0,80 L20,70 L40,75 L60,50 L80,55 L100,30 L120,35 L140,20 L160,25 L180,10 L200,15" 
                  fill="none" stroke="orange" strokeWidth="2" />
            <path d="M0,80 L20,70 L40,75 L60,50 L80,55 L100,30 L120,35 L140,20 L160,25 L180,10 L200,15 L200,100 L0,100 Z" 
                  fill="rgba(255,165,0,0.2)" stroke="none" />
          </svg>
        </div>*/}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg bg-opacity-60 backdrop-filter backdrop-blur-sm border-t border-orange-600">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <label className="text-sm font-medium text-orange-200">Sales Amount</label>
            </div>
            <input
              type="number"
              name="sales"
              value={formData.sales}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
              step="0.01"
            />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg bg-opacity-60 backdrop-filter backdrop-blur-sm border-t border-orange-600">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <label className="text-sm font-medium text-orange-200">Quantity</label>
            </div>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
            />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg bg-opacity-60 backdrop-filter backdrop-blur-sm border-t border-orange-600">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <label className="text-sm font-medium text-orange-200">Discount</label>
            </div>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
              step="0.01"
              min="0"
              max="1"
            />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg bg-opacity-60 backdrop-filter backdrop-blur-sm border-t border-orange-600">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <label className="text-sm font-medium text-orange-200">Profit</label>
            </div>
            <input
              type="number"
              name="profit"
              value={formData.profit}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Submit buttons */}
      <div className="flex justify-end space-x-6 pt-6 border-t border-gray-700">
        <button
          type="button"
          onClick={() => resetForm()}
          className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-300 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 transition duration-300 shadow-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Submit
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default DataEntry;