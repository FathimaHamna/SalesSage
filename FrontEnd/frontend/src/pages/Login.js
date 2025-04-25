import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Define your API base URL - adjust this to match your Django backend URL
  const API_BASE_URL = 'http://localhost:8000'; // or your Django server URL

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login/' : '/api/auth/register/';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isLogin ? {
          email: formData.email,
          password: formData.password
        } : {
          email: formData.email,
          password: formData.password,
          username: formData.username
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      navigate('/app/home');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
  <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
  {/* <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-orange-400">SalesSage</h1>
        </div> */}
    <div>
      <h2 className="text-center text-3xl text-orange-400">
        {isLogin ? 'Sign In to your Account' : 'Create a New Account'}
      </h2>
      {error && (
        <div className="mt-2 text-center text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>

    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        {!isLogin && (
          <div>
            <input
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleInputChange}
              className="appearance-none rounded-md w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Username"
            />
          </div>
        )}
        <div>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="appearance-none rounded-md w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:bg-gray-700 sm:text-sm"
  placeholder="Email address"
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="appearance-none rounded-md w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
            isLoading ? 'bg-orange-400' : 'bg-orange-400 hover:bg-orange-500 transition duration-200'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
        >
          {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
      </div>
    </form>
    
    <div className="text-center">
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setError('');
          setFormData({ email: '', password: '', username: '' });
        }}
        className="text-sm text-orange-400 hover:text-orange-300 transition duration-200"
      >
        {isLogin 
          ? "Don't have an account? Sign Up" 
          : "Already have an account? Sign In"}
      </button>
    </div>
  </div>
</div>

  );
};

export default Login;