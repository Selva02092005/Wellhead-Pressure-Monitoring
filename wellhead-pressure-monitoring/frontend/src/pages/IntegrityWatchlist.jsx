import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Activity, ShieldAlert, Wrench, WifiOff } from 'lucide-react';

const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
        case 'OFFLINE': return 'text-critical bg-critical/10 border-critical/30';
        case 'DEGRADED': return 'text-warning bg-warning/10 border-warning/30';
        case 'MAINTENANCE': return 'text-primary bg-primary/10 border-primary/30';
        default: return 'text-success bg-success/10 border-success/30';
    }
};

const StatusIcon = ({ status }) => {
    switch (status?.toUpperCase()) {
        case 'OFFLINE': return <WifiOff size={24} className="text-critical" />;
        case 'DEGRADED': return <ShieldAlert size={24} className="text-warning" />;
        case 'MAINTENANCE': return <Wrench size={24} className="text-primary" />;
        default: return <Activity size={24} className="text-success" />;
    }
};

const IntegrityWatchlist = () => {
    const [faults, setFaults] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHealth = async () => {
        try {
            const response = await api.get('/api/integrity');
            setFaults(response.data);
        } catch (e) {
            console.error("Error fetching integrity data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading && faults.length === 0) {
        return <div className="h-full flex items-center justify-center text-gray-500">Loading watchlist...</div>;
    }

    return (
        <div className="h-full flex flex-col max-w-7xl mx-auto w-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Integrity Watchlist</h2>
                    <p className="text-gray-400 text-sm mt-1">Real-time monitoring of degraded hardware and sensor faults</p>
                </div>
            </div>

            {faults.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-600 border border-dashed border-[#2a2a2a] rounded-xl bg-card/30">
                    <ShieldAlert size={48} className="mb-4 opacity-50 text-success" />
                    <p>All wellhead sensors are operating at peak efficiency.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {faults.map((fault) => {
                        const style = getStatusStyle(fault.status);
                        return (
                            <div key={fault.id} className="bg-card border border-[#2a2a2a] rounded-xl p-5 hover:border-gray-500 transition-colors relative overflow-hidden flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded bg-[#121212] flex items-center justify-center border border-[#2a2a2a]">
                                            <StatusIcon status={fault.status} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{fault.well_id}</h3>
                                            <p className="text-xs text-gray-400 capitalize">{fault.sensor.replace('_', ' ')} Sensor</p>
                                        </div>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded text-xs font-bold border capitalize ${style}`}>
                                        {fault.status.toLowerCase()}
                                    </div>
                                </div>
                                
                                <div className="mt-2 space-y-3 flex-1">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Fault Type</p>
                                        <p className="text-gray-200 font-mono text-sm mt-0.5">{fault.fault_type || "UNKNOWN_ERROR"}</p>
                                    </div>
                                    
                                    <div className="flex justify-between items-end border-t border-[#2a2a2a] pt-3 mt-auto">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Last Valid Reading</p>
                                            <p className="text-white font-medium text-sm">
                                                {fault.last_valid_value !== null ? `${fault.last_valid_value} psi` : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Timestamp</p>
                                            <p className="text-gray-400 text-xs">{new Date(fault.last_update).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.split(' ')[0].replace('text-', 'bg-')}`}></div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default IntegrityWatchlist;
