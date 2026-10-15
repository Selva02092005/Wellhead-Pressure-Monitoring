import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../context/WebSocketContext';
import TrendChart from '../components/TrendChart';
import api from '../services/api';
import { Activity, AlertTriangle, ArrowLeft } from 'lucide-react';

const WellDetail = () => {
    const { wellId } = useParams();
    const navigate = useNavigate();
    const { liveData } = useContext(WebSocketContext);
    const [wellInfo, setWellInfo] = useState(null);
    const [history, setHistory] = useState({ tubing: [], annulus: [], flowline: [] });

    // Extract live pressure
    const live = liveData[wellId] || {};

    // Keep artificial short trailing history for demo aesthetics
    useEffect(() => {
        const time = new Date().getTime();
        
        setHistory(prev => {
            const maxPoints = 50;
            const newTubing = live.tubing ? [...prev.tubing, [time, live.tubing]].slice(-maxPoints) : prev.tubing;
            
            // Build pseudo array
            return {
                tubing: newTubing,
                annulus_a: live.annulus_a ? [...(prev.annulus_a || []), [time, live.annulus_a]].slice(-maxPoints) : prev.annulus_a,
                flowline: live.flowline ? [...(prev.flowline || []), [time, live.flowline]].slice(-maxPoints) : prev.flowline,
            }
        });
    }, [live.tubing, live.annulus_a, live.flowline]);

    // Fetch well meta
    useEffect(() => {
        // Normally we'd fetch actual timeseries API endpoint here.
        const fetchWell = async () => {
            try {
                // Not perfectly rigorous without DB items, but simulate fetching the single well
                setWellInfo({ name: 'Simulated Well', id: wellId, status: 'NORMAL' });
            } catch (e) {
                console.error(e);
            }
        };
        fetchWell();
    }, [wellId]);

    if (!wellInfo) {
        return <div className="text-gray-500">Loading Well Details...</div>;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto pr-2">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-card border border-[#2a2a2a] rounded hover:border-gray-500 transition-colors">
                    <ArrowLeft size={16} className="text-gray-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-widest">{wellId}</h1>
                    <p className="text-xs text-gray-500 uppercase">{wellInfo.name} | Status: {live.status || wellInfo.status}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                {['tubing', 'annulus_a', 'annulus_b', 'flowline', 'choke'].map(sensor => (
                    <div key={sensor} className="bg-card p-4 rounded-xl border border-[#2a2a2a]">
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-1">{sensor.replace('_', ' ')}</p>
                        <p className="text-2xl font-bold font-mono text-white">
                            {live[sensor] ? live[sensor].toFixed(1) : '---'} <span className="text-xs text-gray-600 font-sans">psi</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-card border border-[#2a2a2a] rounded-xl p-4">
                    <TrendChart 
                        title="Tubing Pressure History" 
                        series={[
                            { name: 'Tubing', data: history.tubing || [], color: '#3b82f6' }
                        ]} 
                    />
                </div>
                
                <div className="bg-card border border-[#2a2a2a] rounded-xl p-4">
                    <TrendChart 
                        title="Annulus Pressures" 
                        series={[
                            { name: 'Annulus A', data: history.annulus_a || [], color: '#f59e0b' }
                        ]} 
                    />
                </div>

                <div className="bg-card border border-[#2a2a2a] rounded-xl p-4">
                    <TrendChart 
                        title="Flowline & Choke" 
                        series={[
                            { name: 'Flowline', data: history.flowline || [], color: '#10b981' }
                        ]} 
                    />
                </div>
                
                <div className="bg-card border border-[#2a2a2a] rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <h3 className="text-lg font-bold text-gray-300 uppercase tracking-widest mb-6 w-full text-center">MAASP UTILIZATION</h3>
                    
                    {/* Ring gauge simulation using pure CSS */}
                    <div className="relative w-40 h-40 rounded-full bg-[#121212] border-[12px] border-[#2a2a2a] flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                        <div className="absolute inset-0 rounded-full border-[12px] border-primary/80" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                        <div className="flex flex-col items-center z-10">
                            <span className="text-3xl font-mono font-bold text-primary">68%</span>
                            <span className="text-xs text-gray-500 uppercase mt-1">Annulus A</span>
                        </div>
                    </div>
                    
                    <p className="mt-6 text-sm text-gray-400">Current: {live.annulus_a?.toFixed(0) || 0} psi / MAASP: 2500 psi</p>
                </div>
            </div>
        </div>
    );
};

export default WellDetail;
