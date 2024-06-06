import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Products = () => {
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    category: '',
    sub_category: '',
    price: '',
    stock_level: ''
  });

  const categories = ['Office Supplies', 'Furniture', 'Technology'];
  const subCategories = {
    'Office Supplies': ['Paper', 'Labels', 'Storage', 'Supplies', 'Binders', 'Art'],
    'Furniture': ['Chairs', 'Tables', 'Furnishings', 'Bookcases'],
    'Technology': ['Phones', 'Machines', 'Accessories', 'Copiers']
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/new-product-data/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert(`Error fetching products: ${error.message}`);
      }
    };
  
    fetchProducts();
  }, []); // Empty dependency array → Runs only on mount
  

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
        price: Number(formData.price).toFixed(2) || 0,
        stock_level: Math.round(Number(formData.stock_level)) || 0, 
      };

      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });
      
      if (response.ok) {
        alert('Product data submitted successfully!');
        resetForm();
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
      <div className="container mx-auto max-w-4xl">
        {/* Header with abstract data visualization */}
        <div className="mb-10 relative">
          <h1 className="text-4xl font-bold text-orange-400 inline-block">
            Product Management
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Product Section with floating cards design */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-orange-400 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Product Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium mb-1 text-orange-200">Product Name</label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
                  required
                />
              </motion.div>
              <motion.div 
                className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <label className="block text-sm font-medium mb-1 text-orange-200">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
                  required
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
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <label className="block text-sm font-medium mb-1 text-orange-200">Sub-Category</label>
                <select
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
                  disabled={!formData.category}
                  required
                >
                  <option value="">Select Sub-Category</option>
                  {formData.category && subCategories[formData.category].map(subCat => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </motion.div>
            </div>
          </motion.div>

          {/* Pricing and Inventory Section */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-orange-400 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pricing & Inventory
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <label className="text-sm font-medium text-orange-200">Current Price ($)</label>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
                  step="0.01"
                  min="0"
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
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <label className="text-sm font-medium text-orange-200">Stock Level</label>
                </div>
                <input
                  type="number"
                  name="stock_level"
                  value={formData.stock_level}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-orange-400 focus:ring focus:ring-orange-300 focus:ring-opacity-50"
                  min="0"
                  required
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-6 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition duration-300"
            >
              Reset
            </button>
            <motion.button
              type="submit"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Product
            </motion.button>
          </div>
        </form>

        {/* Add the table below the form */}
<motion.div 
  className="relative mt-12"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  <h2 className="text-2xl font-bold mb-6 text-orange-400 flex items-center">
    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
    Product List
  </h2>

  <div className="overflow-x-auto bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-sm p-6 rounded-lg border-l-2 border-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg">
    <table className="min-w-full table-auto text-white">
      <thead>
        <tr className="bg-gray-900 text-left">
          <th className="py-3 px-4 text-sm font-semibold text-orange-200">Product ID</th>
          <th className="py-3 px-4 text-sm font-semibold text-orange-200">Name</th>
          <th className="py-3 px-4 text-sm font-semibold text-orange-200">Category</th>
          <th className="py-3 px-4 text-sm font-semibold text-orange-200">Subcategory</th>
          <th className="py-3 px-4 text-sm font-semibold text-orange-200">Current Price</th>
          <th className="py-3 px-4 text-sm font-semibold text-orange-200">Stock Level</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ? (
          products.map((product) => (
            <tr key={product.product_id} className="border-t border-gray-700">
              <td className="py-3 px-4 text-sm">{product.product_id}</td>
              <td className="py-3 px-4 text-sm">{product.product_name}</td>
              <td className="py-3 px-4 text-sm">{product.category}</td>
              <td className="py-3 px-4 text-sm">{product.sub_category}</td>
              <td className="py-3 px-4 text-sm">${product.price}</td>
              <td className="py-3 px-4 text-sm">{product.stock_level}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="py-3 px-4 text-center text-sm text-orange-200">No products found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</motion.div>


      </div>
    </div>
  );
};

export default Products;