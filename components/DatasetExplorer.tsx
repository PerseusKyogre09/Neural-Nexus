import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Database, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  Clock, 
  Tag, 
  Filter,
  HardDrive
} from 'lucide-react';
import type { DatasetEntry } from '@/lib/DataCrawler';

interface DatasetExplorerProps {
  initialCategory?: string;
}

export default function DatasetExplorer({ initialCategory = '' }: DatasetExplorerProps) {
  // Super dope state variables with Gen-Z style names
  const [datasets, setDatasets] = useState<DatasetEntry[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<DatasetEntry[]>([]);
  const [searchVibe, setSearchVibe] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // These are our dataset categories - each with a vibe
  const datasetCategories = [
    { id: "all", name: "All Datasets" },
    { id: "vision", name: "Vision" },
    { id: "nlp", name: "NLP" },
    { id: "tabular", name: "Tabular" },
    { id: "audio", name: "Audio" },
    { id: "multimodal", name: "Multimodal" }
  ];

  // Fetch datasets on component mount
  useEffect(() => {
    fetchDatasets();
  }, []);

  // Filter datasets when search or category changes
  useEffect(() => {
    filterDatasets();
  }, [datasets, searchVibe, activeCategory]);

  // Fetch datasets from our API
  const fetchDatasets = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      if (forceRefresh) setIsRefreshing(true);
      
      const response = await fetch(`/api/datasets?refresh=${forceRefresh}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch datasets');
      }
      
      setDatasets(data.datasets);
      setErrorMsg('');
    } catch (error) {
      console.error('Error fetching datasets:', error);
      setErrorMsg('Failed to fetch datasets. Try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filter datasets based on search and category
  const filterDatasets = () => {
    const filtered = datasets.filter(dataset => {
      const matchesSearch = searchVibe === '' || 
        dataset.name.toLowerCase().includes(searchVibe.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchVibe.toLowerCase()) ||
        dataset.tags.some(tag => tag.toLowerCase().includes(searchVibe.toLowerCase()));
      
      const matchesCategory = activeCategory === 'all' || dataset.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredDatasets(filtered);
  };

  // Handle manual refresh of datasets
  const handleRefresh = () => {
    fetchDatasets(true);
  };

  // Format dataset size for display
  const formatSize = (size?: string) => {
    return size || 'Size N/A';
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get source icon based on dataset source
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'kaggle':
        return <span className="text-blue-400 font-semibold">Kaggle</span>;
      case 'huggingface':
        return <span className="text-yellow-400 font-semibold">HuggingFace</span>;
      default:
        return <span className="text-green-400 font-semibold">Public</span>;
    }
  };

  return (
    <div className="w-full">
      {/* Header and search area */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <input 
              type="text" 
              placeholder="Search datasets..." 
              className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={searchVibe}
              onChange={(e) => setSearchVibe(e.target.value)}
              aria-label="Search datasets"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {datasetCategories.map(category => (
                <button 
                  key={category.id}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <button 
              className="p-2 bg-gray-800/70 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh datasets"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-purple-400' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {errorMsg && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-center">
          <p className="text-red-300">{errorMsg}</p>
          <button 
            className="mt-2 px-4 py-1 bg-red-700/50 hover:bg-red-700 rounded-lg text-sm transition-colors"
            onClick={() => fetchDatasets(true)}
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-300 text-lg">Loading datasets...</p>
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-gray-400 mb-6">
            {filteredDatasets.length === 0 
              ? 'No datasets found. Try adjusting your search.' 
              : `Found ${filteredDatasets.length} dataset${filteredDatasets.length === 1 ? '' : 's'}`}
          </p>
          
          {/* Dataset grid */}
          {filteredDatasets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatasets.map((dataset) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all"
                >
                  {/* Dataset card content */}
                  <div className="p-5">
                    {/* Header with name and source */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{dataset.name}</h3>
                      {getSourceIcon(dataset.source)}
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4">{dataset.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dataset.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Additional info */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-400">
                      {dataset.size && (
                        <div className="flex items-center">
                          <HardDrive className="h-3 w-3 mr-1" />
                          <span>{formatSize(dataset.size)}</span>
                        </div>
                      )}
                      
                      {dataset.lastUpdated && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(dataset.lastUpdated)}</span>
                        </div>
                      )}
                      
                      {dataset.downloadCount && (
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          <span>{dataset.downloadCount.toLocaleString()} downloads</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action button */}
                    <div className="flex justify-center">
                      <Link 
                        href={dataset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        View Dataset
                        <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Empty state */}
          {filteredDatasets.length === 0 && !isLoading && !errorMsg && (
            <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-bold mb-2">No datasets found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or category filter</p>
              <button 
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                onClick={() => {
                  setSearchVibe('');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 