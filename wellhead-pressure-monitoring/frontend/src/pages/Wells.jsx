import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import api from '../services/api';
import { WebSocketContext } from '../context/WebSocketContext';

const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
        case 'NORMAL':
        case 'RUNNING': return 'text-success bg-success/10 border-success/30';
        case 'WARNING': return 'text-warning bg-warning/10 border-warning/30';
        case 'CRITICAL': return 'text-critical bg-critical/10 border-critical/30';
        case 'SHUT-IN': return 'text-primary bg-primary/10 border-primary/30';
        case 'SENSOR FAULT': return 'text-fault bg-fault/10 border-fault/30';
        default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
};

const Wells = () => {
    const navigate = useNavigate();
    const { liveData } = useContext(WebSocketContext);
    const [wells, setWells] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWells = async () => {
            try {
                const response = await api.get('/api/wells');
                setWells(response.data);
            } catch (e) {
                console.error("Error fetching wells", e);
            } finally {
                setLoading(false);
            }
        };
        fetchWells();
    }, []);

    if (loading) {
        return <div className="h-full flex items-center justify-center text-gray-500">Loading wells fleet...</div>;
    }

    return (
        <div className="flex flex-col max-w-7xl mx-auto w-full pb-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Wells Fleet</h2>
                    <p className="text-gray-400 text-sm mt-1">Comprehensive telemetry and operational status for all associated wellheads</p>
                </div>
            </div>

            <div className="bg-card border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#121212] text-gray-400 font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Status</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Well ID</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Location</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Tubing (psi)</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Flowline (psi)</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Choke (psi)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {wells.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <Activity size={48} className="mx-auto mb-4 opacity-50" />
                                        No wells found in the system.
                                    </td>
                                </tr>
                            ) : wells.map(well => {
                                const liveState = liveData[well.well_id] || {};
                                const status = liveState.status || well.status || 'UNKNOWN';
                                const style = getStatusStyle(status);
                                
                                return (
                                    <tr 
                                        key={well.id} 
                                        onClick={() => navigate(`/wells/${well.well_id}`)}
                                        className="hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border capitalize ${style}`}>
                                                {status.toLowerCase()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-white group-hover:text-primary transition-colors">{well.well_id}</span>
                                            <div className="text-xs text-gray-500 mt-1">{well.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                            {well.location || 'N/A'}
                                            <div className="text-xs text-gray-500 mt-1">{well.completion_type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-200">
                                            {liveState.tubing !== undefined ? liveState.tubing.toFixed(1) : '---'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-200">
                                            {liveState.flowline !== undefined ? liveState.flowline.toFixed(1) : '---'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-200">
                                            {liveState.choke !== undefined ? liveState.choke.toFixed(1) : '---'}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Wells;
