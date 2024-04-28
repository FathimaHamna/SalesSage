import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FrontPage() {
  const navigate = useNavigate();

  // Animation variants for letters sliding in from sides
  const letterAnimation = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-black to-gray-800 text-orange-400">
      <div className="text-center">
        <motion.div
          className="flex space-x-2 text-6xl font-bold"
          initial="hidden"
          animate="visible"
        >
          {"SalesSage".split("").map((letter, index) => (
            <motion.span key={index} variants={letterAnimation}>
              {letter}
            </motion.span>
          ))}
        </motion.div>
        <p className="text-lg text-orange-400 mt-2">Powered by OfficePro Solutions</p>
      </div>

      {/* Get Started button */}
      <motion.button
        onClick={() => navigate("/login")}
        className="mt-8 px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-xl transition shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Get Started
      </motion.button>
    </div>
  );
}
