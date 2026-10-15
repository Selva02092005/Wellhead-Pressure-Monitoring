import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Droplet, Flame, Timer, Activity } from 'lucide-react';

const Production = () => {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProduction = async () => {
        try {
            const response = await api.get('/api/production/daily-report');
            setReport(response.data);
        } catch (e) {
            console.error("Error fetching production report", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduction();
        // Since it's a daily report, it doesn't need rapid polling, but we can poll every 30s
        const interval = setInterval(fetchProduction, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading && report.length === 0) {
        return <div className="h-full flex items-center justify-center text-gray-500">Compiling fleet volumetric data...</div>;
    }

    // Calculate aggregated KPIs
    const totalOil = report.reduce((sum, item) => sum + item.actual_oil_bbl, 0);
    const targetOil = report.reduce((sum, item) => sum + item.target_oil_bbl, 0);
    const oilHitRate = (totalOil / targetOil) * 100;

    const totalGas = report.reduce((sum, item) => sum + item.actual_gas_mcf, 0);
    
    const avgUptime = report.reduce((sum, item) => sum + item.uptime_percentage, 0) / (report.length || 1);

    return (
        <div className="h-full flex flex-col max-w-7xl mx-auto w-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Production Reporting</h2>
                    <p className="text-gray-400 text-sm mt-1">Daily aggregated volumetric output and efficiency metrics</p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-[#2a2a2a] p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Total Fleet Oil</p>
                        <p className="text-3xl font-bold font-mono text-white mb-1">
                            {totalOil.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-sm text-gray-500 font-sans">bbl/d</span>
                        </p>
                        <p className={`text-xs ${oilHitRate > 95 ? 'text-success' : 'text-warning'} font-medium`}>
                            {oilHitRate.toFixed(1)}% of Target
                        </p>
                    </div>
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Droplet size={28} />
                    </div>
                </div>

                <div className="bg-card border border-[#2a2a2a] p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Total Fleet Gas</p>
                        <p className="text-3xl font-bold font-mono text-white mb-1">
                            {totalGas.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-sm text-gray-500 font-sans">mcf/d</span>
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            Derived extraction estimates
                        </p>
                    </div>
                    <div className="w-14 h-14 bg-warning/10 rounded-full flex items-center justify-center text-warning">
                        <Flame size={28} />
                    </div>
                </div>

                <div className="bg-card border border-[#2a2a2a] p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Avg Fleet Uptime</p>
                        <p className="text-3xl font-bold font-mono text-white mb-1">
                            {avgUptime.toFixed(1)}<span className="text-sm text-gray-500 font-sans">%</span>
                        </p>
                        <p className={`text-xs ${avgUptime > 90 ? 'text-success' : 'text-critical'} font-medium`}>
                            Rolling 24h efficiency
                        </p>
                    </div>
                    <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center text-success">
                        <Timer size={28} />
                    </div>
                </div>
            </div>

            {/* Production Matrix Table */}
            <div className="bg-card border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg flex-1">
                <div className="p-4 border-b border-[#2a2a2a]">
                    <h3 className="font-bold text-gray-300">Well-by-Well Volumetrics</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#121212] text-gray-400 font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Well ID</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Actual Oil (BBL)</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Target Oil (BBL)</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Actual Gas (MCF)</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Avail. Uptime</th>
                                <th className="px-6 py-4 border-b border-[#2a2a2a]">Report Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {report.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <Activity size={48} className="mx-auto mb-4 opacity-50" />
                                        No production data available for simulation.
                                    </td>
                                </tr>
                            ) : report.map(item => {
                                return (
                                    <tr key={item.well_id} className="hover:bg-[#1a1a1a] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-white">{item.well_id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-primary font-semibold">
                                            {item.actual_oil_bbl.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-500">
                                            {item.target_oil_bbl.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-warning font-semibold">
                                            {item.actual_gas_mcf.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-[#121212] rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${item.uptime_percentage > 90 ? 'bg-success' : 'bg-warning'}`} 
                                                        style={{ width: `${item.uptime_percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-mono text-xs">{item.uptime_percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-xs">
                                            {item.report_date}
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

export default Production;
