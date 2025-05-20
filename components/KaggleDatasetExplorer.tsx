import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  Clock, 
  Tag, 
  Filter,
  HardDrive,
  BookOpen,
  BarChart4
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { KaggleDataset } from '@/lib/KaggleCrawler';

export default function KaggleDatasetExplorer() {
  // State management
  const [datasets, setDatasets] = useState<KaggleDataset[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<KaggleDataset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popularity' | 'recency' | 'usability'>('popularity');
  const [minDownloads, setMinDownloads] = useState(0);
  const [showTabular, setShowTabular] = useState<boolean | undefined>(undefined);

  // Common tags for filter dropdown
  const commonTags = [
    "tabular", "classification", "deep learning", "computer vision", "NLP", 
    "time series", "sentiment analysis", "regression", "image classification"
  ];

  // Fetch datasets on component mount and when filters change
  useEffect(() => {
    fetchDatasets();
  }, []);

  // Apply filters when datasets or filter criteria change
  useEffect(() => {
    filterDatasets();
  }, [
    datasets, searchQuery, selectedTags,
    sortBy, minDownloads, showTabular
  ]);

  // Fetch datasets from API
  const fetchDatasets = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      if (forceRefresh) setIsRefreshing(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append('searchTerm', searchQuery);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      if (minDownloads > 0) params.append('minDownloads', minDownloads.toString());
      params.append('sortBy', sortBy);
      if (showTabular !== undefined) params.append('isTabular', showTabular.toString());
      if (forceRefresh) params.append('forceRefresh', 'true');
      
      // Make API request
      const response = await fetch(`/api/kaggle-datasets?${params.toString()}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch datasets');
      }
      
      setDatasets(data.datasets);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching datasets:', error);
      setError(error.message || 'Failed to fetch datasets');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Apply filters to datasets
  const filterDatasets = () => {
    let filtered = [...datasets];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(dataset => 
        dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(dataset => 
        selectedTags.some(tag => dataset.tags.includes(tag))
      );
    }
    
    // Filter by minimum downloads
    if (minDownloads > 0) {
      filtered = filtered.filter(dataset => dataset.downloadCount >= minDownloads);
    }
    
    // Filter by tabular/non-tabular
    if (showTabular !== undefined) {
      filtered = filtered.filter(dataset => dataset.isTabular === showTabular);
    }
    
    // Sort datasets
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'recency':
        filtered.sort((a, b) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        break;
      case 'usability':
        filtered.sort((a, b) => b.usability - a.usability);
        break;
    }
    
    setFilteredDatasets(filtered);
  };

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle tag selection/deselection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    await fetchDatasets(true);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('popularity');
    setMinDownloads(0);
    setShowTabular(undefined);
  };

  return (
    <div className="w-full">
      {/* Search and filter section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/70 border-gray-700"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Filter buttons */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Tags</span>
                  {selectedTags.length > 0 && (
                    <Badge className="ml-1 bg-purple-600">{selectedTags.length}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {commonTags.map(tag => (
                  <DropdownMenuItem 
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={selectedTags.includes(tag) ? "bg-purple-900/30" : ""}
                  >
                    <span className={selectedTags.includes(tag) ? "text-purple-400" : ""}>
                      {tag}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart4 className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={() => setSortBy('popularity')}
                  className={sortBy === 'popularity' ? "bg-purple-900/30" : ""}
                >
                  <span className={sortBy === 'popularity' ? "text-purple-400" : ""}>
                    Most Popular
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('recency')}
                  className={sortBy === 'recency' ? "bg-purple-900/30" : ""}
                >
                  <span className={sortBy === 'recency' ? "text-purple-400" : ""}>
                    Most Recent
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('usability')}
                  className={sortBy === 'usability' ? "bg-purple-900/30" : ""}
                >
                  <span className={sortBy === 'usability' ? "text-purple-400" : ""}>
                    Most Usable
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Type</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={() => setShowTabular(undefined)}
                  className={showTabular === undefined ? "bg-purple-900/30" : ""}
                >
                  <span className={showTabular === undefined ? "text-purple-400" : ""}>
                    All Types
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowTabular(true)}
                  className={showTabular === true ? "bg-purple-900/30" : ""}
                >
                  <span className={showTabular === true ? "text-purple-400" : ""}>
                    Tabular Only
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowTabular(false)}
                  className={showTabular === false ? "bg-purple-900/30" : ""}
                >
                  <span className={showTabular === false ? "text-purple-400" : ""}>
                    Non-Tabular Only
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh datasets"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-purple-400" : ""}`} />
            </Button>
          </div>
        </div>
        
        {/* Active filters display */}
        {(selectedTags.length > 0 || minDownloads > 0 || showTabular !== undefined) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            
            {selectedTags.map(tag => (
              <Badge key={tag} className="bg-purple-600/70 hover:bg-purple-700 cursor-pointer" onClick={() => toggleTag(tag)}>
                {tag} ✕
              </Badge>
            ))}
            
            {showTabular !== undefined && (
              <Badge className="bg-blue-600/70 hover:bg-blue-700 cursor-pointer" onClick={() => setShowTabular(undefined)}>
                {showTabular ? 'Tabular' : 'Non-Tabular'} ✕
              </Badge>
            )}
            
            {minDownloads > 0 && (
              <Badge className="bg-green-600/70 hover:bg-green-700 cursor-pointer" onClick={() => setMinDownloads(0)}>
                {`${formatNumber(minDownloads)}+ downloads`} ✕
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={resetFilters}
            >
              Reset all
            </Button>
          </div>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-300 text-lg">Fetching the hottest datasets...</p>
        </div>
      ) : (
        <>
          {/* Error state */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 text-center">
              <p className="text-red-300 mb-2">{error}</p>
              <Button 
                variant="outline"
                onClick={handleRefresh}
                className="bg-red-700/50 hover:bg-red-700 border-red-600"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {/* Results count */}
          {!error && (
            <p className="text-gray-400 mb-6">
              {filteredDatasets.length === 0 
                ? 'No datasets match your criteria. Try adjusting your filters.' 
                : `Found ${filteredDatasets.length} dataset${filteredDatasets.length === 1 ? '' : 's'}`}
            </p>
          )}
          
          {/* Datasets grid */}
          {!error && filteredDatasets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all h-full flex flex-col"
                >
                  <div className="p-5 flex-grow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{dataset.title}</h3>
                      <Badge className={dataset.isTabular ? "bg-blue-600" : "bg-green-600"}>
                        {dataset.isTabular ? 'Tabular' : 'Non-Tabular'}
                      </Badge>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{dataset.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dataset.tags.slice(0, 5).map(tag => (
                        <span 
                          key={tag} 
                          className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded cursor-pointer hover:bg-gray-700"
                          onClick={() => !selectedTags.includes(tag) && toggleTag(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                      {dataset.tags.length > 5 && (
                        <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                          +{dataset.tags.length - 5} more
                        </span>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-400">
                      <div className="flex items-center">
                        <HardDrive className="h-3 w-3 mr-1" />
                        <span>{dataset.size}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(dataset.lastUpdated)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        <span>{formatNumber(dataset.downloadCount)} downloads</span>
                      </div>
                      
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        <span>{dataset.fileCount} files</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer with action buttons */}
                  <div className="border-t border-gray-700/50 p-3 bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-gray-400 border-gray-700">
                          {dataset.license}
                        </Badge>
                      </div>
                      
                      <a 
                        href={dataset.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center text-sm font-medium"
                      >
                        View Dataset
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Empty state */}
          {!error && filteredDatasets.length === 0 && (
            <div className="text-center py-20 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-bold mb-2">No datasets found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <Button 
                onClick={resetFilters}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 