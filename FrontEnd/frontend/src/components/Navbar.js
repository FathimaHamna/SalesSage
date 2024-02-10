import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For menu icons

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Add logout logic here later
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { name: "Home", path: "/app/home" },
    { name: "Dashboard", path: "/app/dashboard" },
    { name: "Prediction", path: "/app/prediction" },
    { name: "Products", path: "/app/products" },
    { name: "Sales", path: "/app/data-entry" },
  ];

  return (
    <nav className="bg-black p-4 shadow-lg fixed top-0 left-0 w-full z-40">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-orange-400 font-extrabold text-2xl tracking-wide">SalesSage</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {links.map(({ name, path }) => (
            <Link
              key={path}
              to={path}
              className={`transition-all duration-300 ${
                location.pathname === path ? "text-orange-400" : "text-gray-300 hover:text-orange-400"
              }`}
            >
              {name}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="text-gray-300 hover:text-orange-400 transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-300" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-black p-4 absolute top-full left-0 w-full shadow-lg">
          {links.map(({ name, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`block py-2 text-center transition-all duration-300 ${
                location.pathname === path ? "text-orange-400" : "text-gray-300 hover:text-orange-400"
              }`}
            >
              {name}
            </Link>
          ))}
          <button 
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="block py-2 text-center text-gray-300 hover:text-orange-400 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
