import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WellDetail from './pages/WellDetail';
import Alarms from './pages/Alarms';
import IntegrityWatchlist from './pages/IntegrityWatchlist';
import Wells from './pages/Wells';
import Production from './pages/Production';
import Users from './pages/Users';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const Placeholder = ({title}) => (
    <div className="flex items-center justify-center flex-1 h-full">
       <h1 className="text-2xl font-bold">{title} Page - Work in progress</h1>
    </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
            <ProtectedRoute>
                <WebSocketProvider>
                    <Layout />
                </WebSocketProvider>
            </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="wells" element={<Wells />} />
          <Route path="wells/:wellId" element={<WellDetail />} />
          <Route path="alarms" element={<Alarms />} />
          <Route path="integrity" element={<IntegrityWatchlist />} />
          <Route path="production" element={<Production />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
