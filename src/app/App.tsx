import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { RotatingLogo } from '@/app/components/RotatingLogo';
import { PrescriptionForm } from '@/app/components/PrescriptionForm';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { AdminLogin } from '@/app/components/AdminLogin';
import { HeartMonitor } from '@/app/components/HeartMonitor';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check URL for admin parameter and authentication status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setShowAdmin(true);
      // Check if already authenticated in this session
      const authenticated = sessionStorage.getItem('admin_authenticated') === 'true';
      setIsAuthenticated(authenticated);
    }
  }, []);

  // Update URL when switching views
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (showAdmin) {
      params.set('admin', 'true');
    } else {
      params.delete('admin');
    }
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [showAdmin]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setShowAdmin(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleBackToSite = () => {
    setShowAdmin(false);
    setIsAuthenticated(false);
  };

  // Show login page if admin is requested but not authenticated
  if (showAdmin && !isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} onBack={handleBackToSite} />;
  }

  // Show admin dashboard if authenticated
  if (showAdmin && isAuthenticated) {
    return <AdminDashboard onBack={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Heart Monitor Background */}
      <HeartMonitor />

      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Logo Section */}
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <RotatingLogo />
          


          <motion.div
            className="mt-2 text-sm text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
          </motion.div>
        </motion.div>

        {/* Prescription Form */}
        <PrescriptionForm />

        {/* Footer */}
        <motion.div
          className="mt-12 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p>© 2026 Dr. Spill. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}