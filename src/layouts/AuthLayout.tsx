
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center auth-bg p-4">
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <div className="mb-6">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <img 
              src="/lovable-uploads/34b4fa02-fc30-4c51-9d64-33a4137303d4.png" 
              alt="Memberly Logo" 
              className="h-10 mb-2"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Memberly
          </h1>
          <p className="text-gray-600 text-center">Your Membership Management Solution</p>
        </div>
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
