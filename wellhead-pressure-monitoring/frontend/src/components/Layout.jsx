import React, { useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Activity, 
  AlertTriangle, 
  Settings, 
  Users, 
  LogOut, 
  Database,
  BarChart3,
  ShieldAlert
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-card border border-primary/30 text-primary' 
          : 'text-gray-400 hover:bg-card hover:text-white'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{children}</span>
  </NavLink>
);

const Layout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen bg-dark overflow-hidden text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-[#161616] border-r border-[#2a2a2a]">
        <div className="p-5 flex items-center gap-3 border-b border-[#2a2a2a]">
          <Database size={24} className="text-primary" />
          <h1 className="font-bold text-lg tracking-wide uppercase">WellGuard</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <SidebarLink to="/" icon={Activity}>Dashboard</SidebarLink>
          <SidebarLink to="/wells" icon={Database}>Wells</SidebarLink>
          <SidebarLink to="/alarms" icon={AlertTriangle}>Alarm Center</SidebarLink>
          <SidebarLink to="/integrity" icon={ShieldAlert}>Integrity Watchlist</SidebarLink>
          <SidebarLink to="/production" icon={BarChart3}>Production</SidebarLink>
          
          <div className="pt-6 pb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase px-4">System</p>
          </div>
          <SidebarLink to="/users" icon={Users}>Users</SidebarLink>
          <SidebarLink to="/settings" icon={Settings}>Settings</SidebarLink>
        </nav>
        
        <div className="p-4 border-t border-[#2a2a2a]">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-card hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-[#2a2a2a]">
            <div></div>
            <div className="flex items-center gap-4">
              <span className="h-3 w-3 rounded-full bg-success"></span>
              <span className="text-sm font-medium text-gray-300">Live Data</span>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
