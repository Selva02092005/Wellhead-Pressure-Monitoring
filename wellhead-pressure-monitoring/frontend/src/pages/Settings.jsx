import React from 'react';
import { Sliders, Bell, Shield, Database, Save } from 'lucide-react';

const Settings = () => {
    return (
        <div className="h-full flex flex-col max-w-7xl mx-auto w-full">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">System Settings</h2>
                    <p className="text-gray-400 text-sm mt-1">Configure global application parameters, alarm thresholds, and security preferences</p>
                </div>
                <button className="px-5 py-2.5 bg-primary text-white rounded text-sm font-bold shadow hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Save size={16} /> Save Configuration
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Global Configuration */}
                <div className="bg-card border border-[#2a2a2a] rounded-xl flex flex-col">
                    <div className="p-4 border-b border-[#2a2a2a] flex items-center gap-3">
                        <Sliders size={20} className="text-gray-400" />
                        <h3 className="font-bold text-gray-300">Global Settings</h3>
                    </div>
                    <div className="p-5 flex-1 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Facility Name</label>
                            <input type="text" defaultValue="Sector 7G Offshore" className="w-full bg-[#121212] border border-[#2a2a2a] rounded p-2.5 text-white text-sm focus:border-primary outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Telemetry Retention (Days)</label>
                            <select className="w-full bg-[#121212] border border-[#2a2a2a] rounded p-2.5 text-white text-sm focus:border-primary outline-none transition-colors">
                                <option>30 Days</option>
                                <option>90 Days</option>
                                <option>1 Year</option>
                                <option>Never Delete</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm text-gray-300 font-medium">Dark Mode Enforced</span>
                            <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alarm Thresholds */}
                <div className="bg-card border border-[#2a2a2a] rounded-xl flex flex-col">
                    <div className="p-4 border-b border-[#2a2a2a] flex items-center gap-3">
                        <Bell size={20} className="text-gray-400" />
                        <h3 className="font-bold text-gray-300">Alarm Defaults (PSI)</h3>
                    </div>
                    <div className="p-5 flex-1 space-y-6">
                        <p className="text-xs text-gray-500 italic mb-2">These thresholds apply globally across the fleet unless overridden at the well-level.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase text-gray-400 mb-1">Tubing Max</label>
                                <input type="number" defaultValue="2500" className="w-full bg-[#121212] border border-[#2a2a2a] rounded p-2 text-white text-sm font-mono" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase text-gray-400 mb-1">Tubing Min</label>
                                <input type="number" defaultValue="800" className="w-full bg-[#121212] border border-[#2a2a2a] rounded p-2 text-white text-sm font-mono" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase text-gray-400 mb-1">Flowline Max</label>
                                <input type="number" defaultValue="1450" className="w-full bg-[#121212] border border-[#2a2a2a] rounded p-2 text-white text-sm font-mono" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase text-gray-400 mb-1">Flowline Min</label>
                                <input type="number" defaultValue="400" className="w-full bg-[#121212] border border-[#2a2a2a] rounded p-2 text-white text-sm font-mono" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase text-gray-400 mb-1">Annulus MAASP Limit</label>
                                <input type="number" defaultValue="1800" className="w-full bg-[#121212] border border-warning/50 border-dashed rounded p-2 text-warning text-sm font-mono focus:border-warning outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security & Access */}
                <div className="bg-card border border-[#2a2a2a] rounded-xl flex flex-col">
                    <div className="p-4 border-b border-[#2a2a2a] flex items-center gap-3">
                        <Shield size={20} className="text-gray-400" />
                        <h3 className="font-bold text-gray-300">Security Parameters</h3>
                    </div>
                    <div className="p-5 flex-1 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Session Timeout (Minutes)</label>
                            <input type="number" defaultValue="60" className="w-full bg-[#121212] border border-[#2a2a2a] rounded p-2.5 text-white text-sm focus:border-primary outline-none transition-colors" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300 font-medium">Require 2FA for Critical Configs</span>
                            <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300 font-medium">Log Operator Read Queries</span>
                            <div className="w-10 h-5 bg-gray-600 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-gray-400 rounded-full"></div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-[#2a2a2a]">
                            <button className="w-full py-2 bg-transparent border border-gray-600 text-gray-400 rounded text-sm hover:text-white hover:border-white transition-colors">
                                Generate API Key
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
