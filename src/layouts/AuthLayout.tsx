
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-teal p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Memberly</h1>
          <p className="text-gray-600">Your Membership Management Solution</p>
        </div>
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
