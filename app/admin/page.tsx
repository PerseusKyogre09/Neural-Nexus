"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  BrainCircuit, 
  Server, 
  Settings, 
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  Download,
  Cloud,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('models');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<number | null>(null);

  // Mock data - in a real app, this would come from API/database
  const mockModels = [
    { id: 1, name: "GPT-XL Turbo", type: "Text Generation", status: "Live", deployments: 12, created: "2023-12-05", performance: 94 },
    { id: 2, name: "ImageGen Pro", type: "Image Generation", status: "Testing", deployments: 3, created: "2024-01-18", performance: 87 },
    { id: 3, name: "SentimentPro", type: "Classification", status: "Live", deployments: 8, created: "2023-11-22", performance: 91 },
    { id: 4, name: "VoiceClone Ultra", type: "Audio Generation", status: "Draft", deployments: 0, created: "2024-02-01", performance: 76 },
    { id: 5, name: "CodeAssist", type: "Code Generation", status: "Live", deployments: 5, created: "2023-10-15", performance: 89 },
  ];
  
  const filteredModels = mockModels.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Live': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Testing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <div className="pt-24 pb-20 px-4 container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="p-4 bg-gray-700/30">
                <h2 className="font-bold text-lg">Admin Dashboard</h2>
              </div>
              <nav className="p-2">
                <SidebarLink 
                  icon={<BrainCircuit size={18} />} 
                  label="Models" 
                  active={activeTab === 'models'} 
                  onClick={() => setActiveTab('models')}
                />
                <SidebarLink 
                  icon={<Server size={18} />} 
                  label="Deployments" 
                  active={activeTab === 'deployments'} 
                  onClick={() => setActiveTab('deployments')}
                />
                <SidebarLink 
                  icon={<Users size={18} />} 
                  label="Users" 
                  active={activeTab === 'users'} 
                  onClick={() => setActiveTab('users')}
                />
                <SidebarLink 
                  icon={<BarChart3 size={18} />} 
                  label="Analytics" 
                  active={activeTab === 'analytics'} 
                  onClick={() => setActiveTab('analytics')}
                />
                <SidebarLink 
                  icon={<Settings size={18} />} 
                  label="Settings" 
                  active={activeTab === 'settings'} 
                  onClick={() => setActiveTab('settings')}
                />
              </nav>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
              <h3 className="font-bold mb-3 text-gray-300">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Total Models</div>
                  <div className="text-2xl font-bold">24</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Active Deployments</div>
                  <div className="text-2xl font-bold">17</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">API Calls (24h)</div>
                  <div className="text-2xl font-bold">128,459</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'models' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h1 className="text-2xl font-bold">Model Management</h1>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search models..." 
                        className="bg-gray-800/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    <button className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-lg transition-colors">
                      <Plus size={16} />
                      <span>New Model</span>
                    </button>
                  </div>
                </div>
                
                {/* Models Table */}
                <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-700/30 text-left text-sm text-gray-300">
                          <th className="py-3 px-4 font-medium">Name</th>
                          <th className="py-3 px-4 font-medium">Type</th>
                          <th className="py-3 px-4 font-medium">Status</th>
                          <th className="py-3 px-4 font-medium">Deployments</th>
                          <th className="py-3 px-4 font-medium">Created</th>
                          <th className="py-3 px-4 font-medium">Performance</th>
                          <th className="py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredModels.map((model) => (
                          <tr 
                            key={model.id}
                            className={`border-t border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                              selectedModel === model.id ? 'bg-purple-900/20' : ''
                            }`}
                            onClick={() => setSelectedModel(model.id === selectedModel ? null : model.id)}
                          >
                            <td className="py-3 px-4 font-medium">{model.name}</td>
                            <td className="py-3 px-4 text-gray-300">{model.type}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block py-1 px-2 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                                {model.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{model.deployments}</td>
                            <td className="py-3 px-4 text-gray-300">{model.created}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-20 bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      model.performance > 90 ? 'bg-green-500' : 
                                      model.performance > 80 ? 'bg-yellow-500' : 'bg-orange-500'
                                    }`}
                                    style={{ width: `${model.performance}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{model.performance}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button 
                                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                                  aria-label="View model details"
                                >
                                  <Eye size={16} />
                                </button>
                                <button 
                                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                                  aria-label="Edit model"
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors"
                                  aria-label="Delete model"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Selected Model Details */}
                {selectedModel && (
                  <div className="mt-6 bg-gray-800/30 rounded-xl border border-gray-700/50 p-6">
                    <h2 className="text-xl font-bold mb-4">
                      {mockModels.find(m => m.id === selectedModel)?.name} Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-300 mb-3">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <ActionButton 
                            icon={<Cloud size={16} />}
                            label="Deploy Model"
                            onClick={() => {}}
                          />
                          <ActionButton 
                            icon={<Download size={16} />}
                            label="Export Weights"
                            onClick={() => {}}
                          />
                          <ActionButton 
                            icon={<Zap size={16} />}
                            label="Run Benchmark"
                            onClick={() => {}}
                          />
                          <ActionButton 
                            icon={<Eye size={16} />}
                            label="View Metrics"
                            onClick={() => {}}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-300 mb-3">Model Information</h3>
                        <div className="space-y-2">
                          <InfoRow label="Type" value={mockModels.find(m => m.id === selectedModel)?.type || ''} />
                          <InfoRow label="Created" value={mockModels.find(m => m.id === selectedModel)?.created || ''} />
                          <InfoRow label="Version" value="v1.2.3" />
                          <InfoRow label="Size" value="2.7 GB" />
                          <InfoRow label="Training Dataset" value="Neural-Corpus-2023" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center text-sm">
                  <div className="text-gray-400">
                    Showing <span className="font-medium text-white">{filteredModels.length}</span> of <span className="font-medium text-white">{mockModels.length}</span> models
                  </div>
                  <div className="flex gap-1">
                    <button className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      Previous
                    </button>
                    <button className="px-3 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                      1
                    </button>
                    <button className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors">
                      2
                    </button>
                    <button className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Placeholder for other tabs */}
            {activeTab !== 'models' && (
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-12 text-center">
                <h2 className="text-2xl font-bold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section</h2>
                <p className="text-gray-400">This section is under construction</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function SidebarLink({ icon, label, active, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button 
      className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
        active 
          ? 'bg-purple-600 text-white' 
          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ActionButton({ icon, label, onClick }: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button 
      className="flex items-center gap-2 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors w-full"
      onClick={onClick}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="w-1/3 text-gray-400">{label}:</span>
      <span className="w-2/3 font-medium">{value}</span>
    </div>
  );
} 