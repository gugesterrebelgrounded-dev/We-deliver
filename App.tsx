
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { UserRole } from './types';
import Login from './views/Login';
import PlatformOwnerDashboard from './views/PlatformOwnerDashboard';
import RestaurantAdminDashboard from './views/RestaurantAdminDashboard';
import CustomerApp from './views/CustomerApp';
import DriverApp from './views/DriverApp';
import Layout from './components/Layout';

const App: React.FC = () => {
  const { currentUser } = useStore();

  const getDashboardByRole = () => {
    switch (currentUser?.role) {
      case UserRole.OWNER:
        return <PlatformOwnerDashboard />;
      case UserRole.RESTAURANT_ADMIN:
        return <RestaurantAdminDashboard />;
      case UserRole.CUSTOMER:
        return <CustomerApp />;
      case UserRole.DRIVER:
        return <DriverApp />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
        <Route 
          path="/" 
          element={
            currentUser ? (
              <Layout>
                {getDashboardByRole()}
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
