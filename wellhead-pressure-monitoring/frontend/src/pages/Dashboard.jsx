import React, { useState, useEffect } from 'react';
import api from '../services/api';
import WellTile from '../components/WellTile';
import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const [wells, setWells] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [integrityList, setIntegrityList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wellsRes, alarmsRes, integrityRes] = await Promise.all([
            api.get('/api/wells'),
            api.get('/api/alarms'),
            api.get('/api/integrity')
        ]);
        setWells(wellsRes.data);
        setAlarms(alarmsRes.data);
        setIntegrityList(integrityRes.data);
      } catch (e) {
        console.error("Error fetching dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
      return <div className="h-full flex items-center justify-center text-gray-500">Loading fleet telemetry...</div>;
  }

  // Computed stats from real backend APIs
  const totalWells = wells.length;
  const warnings = alarms.filter(a => a.status === 'ACTIVE').length;
  const critical = integrityList.filter(i => i.status !== 'NORMAL' && i.status !== 'SUCCESS').length;

  return (
    <div className="h-full flex flex-col">
      {/* KPI Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card p-4 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Total Active Wells</p>
                <p className="text-3xl font-bold font-mono text-white">{totalWells}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Activity size={24} />
            </div>
        </div>
        
        <div className="bg-card p-4 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Total Warnings</p>
                <p className="text-3xl font-bold font-mono text-warning">{warnings}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center text-warning">
                <AlertTriangle size={24} />
            </div>
        </div>

        <div className="bg-card p-4 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Critical Integrity</p>
                <p className="text-3xl font-bold font-mono text-critical">{critical}</p>
            </div>
            <div className="w-12 h-12 bg-critical/10 rounded-full flex items-center justify-center text-critical">
                <ShieldCheck size={24} />
            </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white tracking-wide uppercase">Field Overview</h2>
          <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-[#1e1e1e] border border-[#2a2a2a] rounded text-sm text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
                  Filter: All
              </button>
          </div>
      </div>

      {/* Grid of Wells */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wells.map(well => (
            <WellTile key={well.id} well={well} />
        ))}
      </div>
      
      {wells.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 border border-dashed border-[#2a2a2a] rounded-xl bg-card/30">
              <Activity size={48} className="mb-4 opacity-50" />
              <p>No wells configured or database is empty.</p>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
