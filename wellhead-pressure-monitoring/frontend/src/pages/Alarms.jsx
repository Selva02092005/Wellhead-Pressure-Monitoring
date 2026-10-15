import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertOctagon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const getSeverityStyles = (severity, status) => {
    if (status === 'ACKNOWLEDGED') return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    switch (severity?.toUpperCase()) {
        case 'CRITICAL': return 'text-critical bg-critical/10 border-critical/30';
        case 'WARNING': return 'text-warning bg-warning/10 border-warning/30';
        default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
};

const SeverityIcon = ({ severity, status }) => {
    if (status === 'ACKNOWLEDGED') return <CheckCircle size={18} />;
    if (severity === 'CRITICAL') return <AlertOctagon size={18} />;
    if (severity === 'WARNING') return <AlertTriangle size={18} />;
    return <Clock size={18} />;
};

const Alarms = () => {
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAlarms = async () => {
        try {
            const response = await api.get('/api/alarms');
            setAlarms(response.data);
        } catch (e) {
            console.error("Error fetching alarms", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlarms();
        // Option to poll every 5 seconds for new alarms
        const interval = setInterval(fetchAlarms, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAcknowledge = async (alarmId) => {
        try {
            await api.post(`/api/alarms/${alarmId}/acknowledge`);
            // Optimistically update the UI
            setAlarms(current => current.map(alarm => 
                alarm.id === alarmId 
                    ? { ...alarm, status: 'ACKNOWLEDGED' } 
                    : alarm
            ));
        } catch (e) {
            console.error("Failed to acknowledge alarm", e);
        }
    };

    if (loading && alarms.length === 0) {
        return <div className="h-full flex items-center justify-center text-gray-500">Loading alarms...</div>;
    }

    return (
        <div className="flex flex-col max-w-7xl mx-auto w-full pb-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Alarm Center</h2>
                    <p className="text-gray-400 text-sm mt-1">Monitor and acknowledge system anomalies</p>
                </div>
            </div>

            <div className="bg-card border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#121212] text-gray-400 font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Status</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Time</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Well ID</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Type</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a] w-1/3">Message</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {alarms.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No active or historical alarms found.
                                    </td>
                                </tr>
                            ) : alarms.map((alarm) => {
                                const styles = getSeverityStyles(alarm.severity, alarm.status);
                                return (
                                    <tr key={alarm.id} className="hover:bg-[#1a1a1a] transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${styles}`}>
                                                <SeverityIcon severity={alarm.severity} status={alarm.status} />
                                                {alarm.status === 'ACKNOWLEDGED' ? 'CLEARED' : alarm.severity}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                            {new Date(alarm.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-white group-hover:text-primary transition-colors">{alarm.well_id}</span>
                                            <div className="text-xs text-gray-500">{alarm.sensor}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                                            {alarm.alarm_type}
                                        </td>
                                        <td className="px-6 py-4 max-w-md truncate" title={alarm.message}>
                                            <span className="text-gray-200">{alarm.message}</span>
                                            {alarm.value && alarm.threshold && (
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    Val: <span className="text-white">{alarm.value}</span> / Thr: {alarm.threshold}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {alarm.status === 'ACTIVE' ? (
                                                <button 
                                                    onClick={() => handleAcknowledge(alarm.id)}
                                                    className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase"
                                                >
                                                    Acknowledge
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-500 italic">By {alarm.acknowledged_by}</span>
                                            )}
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

export default Alarms;
