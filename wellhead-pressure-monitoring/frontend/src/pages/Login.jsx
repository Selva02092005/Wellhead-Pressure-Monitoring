import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Database, Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-dark">
      <div className="w-full max-w-md p-8 bg-card rounded-xl border border-[#2a2a2a] shadow-2xl">
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Database size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">WellGuard</h1>
          <p className="text-gray-400 text-sm tracking-widest mt-1">INDUSTRIAL SCADA SYSTEM</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-critical/10 border border-critical/30 rounded-lg flex items-center gap-3 text-critical">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Operator ID</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                <User size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-[#121212] border border-[#2a2a2a] text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter your system ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Access Key</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-[#121212] border border-[#2a2a2a] text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 rounded-lg font-bold tracking-widest uppercase transition-all duration-300 ${
              isLoading 
                ? 'bg-primary/50 text-white/50 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-blue-600 shadow-lg shadow-primary/20'
            }`}
          >
            {isLoading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-600 uppercase tracking-wider">
          <p>AUTHORIZED PERSONNEL ONLY</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
