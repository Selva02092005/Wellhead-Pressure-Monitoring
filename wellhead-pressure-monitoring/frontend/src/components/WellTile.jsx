import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';
import { WebSocketContext } from '../context/WebSocketContext';

const getStatusColor = (status) => {
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

const ValueDisplay = ({ label, value, unit = 'psi' }) => (
    <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a] last:border-0">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className="text-gray-200 font-mono text-lg">{value !== undefined && value !== null ? value.toFixed(1) : '---'}</span>
            <span className="text-gray-600 text-xs">{unit}</span>
        </div>
    </div>
);

const WellTile = ({ well }) => {
    const navigate = useNavigate();
    const { liveData } = useContext(WebSocketContext);
    
    // Merge DB well info with live WS info
    const wellLiveState = liveData[well.well_id] || {};
    
    // Since backend isn't setting dynamic UI status yet, we fallback to DB status or NORMAL.
    const status = wellLiveState.status || well.status || 'NORMAL';
    const statusClasses = getStatusColor(status);

    return (
        <div 
            onClick={() => navigate(`/wells/${well.well_id}`)}
            className="bg-card border border-[#2a2a2a] p-5 rounded-xl cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{well.well_id}</h3>
                    <p className="text-xs text-gray-500 uppercase">{well.name}</p>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-bold uppercase border ${statusClasses}`}>
                    {status}
                </div>
            </div>

            <div className="space-y-1 mb-5">
                <ValueDisplay label="Tubing" value={wellLiveState.tubing} />
                <ValueDisplay label="Annulus A" value={wellLiveState.annulus_a} />
                <ValueDisplay label="Annulus B" value={wellLiveState.annulus_b} />
                <ValueDisplay label="Flowline" value={wellLiveState.flowline} />
                <ValueDisplay label="Choke" value={wellLiveState.choke} />
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                    {/* Tiny KPI indicators */}
                    <div className="w-8 h-8 rounded bg-[#121212] flex items-center justify-center border border-[#2a2a2a]" title="Integrity OK">
                        <ShieldAlert size={14} className="text-success" />
                    </div>
                    <div className="w-8 h-8 rounded bg-[#121212] flex items-center justify-center border border-[#2a2a2a]" title="Sensors Online">
                        <Cpu size={14} className="text-success" />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-primary font-medium tracking-wide">
                    <Activity size={14} /> LIVE
                </div>
            </div>
            
            {/* Edge decorative line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(status).split(' ')[0].replace('text-', 'bg-')}`}></div>
        </div>
    );
};

export default WellTile;
