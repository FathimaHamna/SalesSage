import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import DataEntry from './pages/DataEntry';
import Profile from './pages/Profile';
import Login from './pages/Login';
import FrontPage from './pages/FrontPage'; 
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Products from './pages/Products';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root path to login */}
          {/*<Route path="/" element={<Navigate to="/login" />} />*/}
          {/* Show the front page when the app starts */}
          <Route path="/" element={<FrontPage />} />

          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes with Navbar */}
          <Route
            path="/app/*"
            element={
              <div>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Navigate to="/app/home" />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/prediction" element={<Prediction />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/data-entry" element={<DataEntry />} />
                </Routes>
              </div>
            }
          />

          {/* Catch all other routes and redirect to login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;