import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  Clock, 
  Tag, 
  Filter,
  BarChart4,
  Heart,
  Layers,
  Code,
  BookOpen,
  Cpu
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
import { AIModel } from '@/lib/ModelCrawler';

export default function AIModelExplorer() {
  // State management
  const [models, setModels] = useState<AIModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<AIModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'popularity' | 'recency' | 'likes'>('popularity');
  const [showFineTuned, setShowFineTuned] = useState<boolean | undefined>(undefined);

  // Common tasks for filter dropdown
  const commonTasks = [
    "text-generation", "fill-mask", "summarization", "question-answering", 
    "text-to-image", "translation", "conversational", "zero-shot-image-classification",
    "sentence-similarity"
  ];

  // Common frameworks for filter dropdown
  const commonFrameworks = [
    "PyTorch", "TensorFlow", "JAX/Flax", "ONNX"
  ];

  // Common tags for filter dropdown
  const commonTags = [
    "transformer", "pytorch", "llm", "fine-tuned", "text-generation", 
    "diffusion", "generative", "large-language-model", "bert", "gpt2"
  ];

  // Fetch models on component mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Apply filters when models or filter criteria change
  useEffect(() => {
    filterModels();
  }, [
    models, searchQuery, selectedTasks, selectedTags,
    selectedFramework, sortBy, showFineTuned
  ]);

  // Fetch models from API
  const fetchModels = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      if (forceRefresh) setIsRefreshing(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append('searchTerm', searchQuery);
      if (selectedTasks.length > 0) params.append('tasks', selectedTasks.join(','));
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      if (selectedFramework) params.append('framework', selectedFramework);
      params.append('sortBy', sortBy);
      if (showFineTuned !== undefined) params.append('isFineTuned', showFineTuned.toString());
      if (forceRefresh) params.append('forceRefresh', 'true');
      
      // Make API request
      const response = await fetch(`/api/ai-models?${params.toString()}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch models');
      }
      
      setModels(data.models);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching models:', error);
      setError(error.message || 'Failed to fetch models');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Apply filters to models
  const filterModels = () => {
    let filtered = [...models];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by selected tasks
    if (selectedTasks.length > 0) {
      filtered = filtered.filter(model => 
        selectedTasks.includes(model.task)
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(model => 
        selectedTags.some(tag => model.tags.includes(tag))
      );
    }
    
    // Filter by framework
    if (selectedFramework) {
      filtered = filtered.filter(model => model.framework === selectedFramework);
    }
    
    // Filter by fine-tuned status
    if (showFineTuned !== undefined) {
      filtered = filtered.filter(model => model.isFineTuned === showFineTuned);
    }
    
    // Sort models
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'recency':
        filtered.sort((a, b) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }
    
    setFilteredModels(filtered);
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

  // Handle task selection/deselection
  const toggleTask = (task: string) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter(t => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  // Handle tag selection/deselection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle framework selection/deselection
  const toggleFramework = (framework: string) => {
    if (selectedFramework === framework) {
      setSelectedFramework(undefined);
    } else {
      setSelectedFramework(framework);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    await fetchModels(true);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTasks([]);
    setSelectedTags([]);
    setSelectedFramework(undefined);
    setSortBy('popularity');
    setShowFineTuned(undefined);
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
              placeholder="Search AI models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/70 border-gray-700"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span>Tasks</span>
                  {selectedTasks.length > 0 && (
                    <Badge className="ml-1 bg-purple-600">{selectedTasks.length}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {commonTasks.map(task => (
                  <DropdownMenuItem 
                    key={task}
                    onClick={() => toggleTask(task)}
                    className={selectedTasks.includes(task) ? "bg-purple-900/30" : ""}
                  >
                    <span className={selectedTasks.includes(task) ? "text-purple-400" : ""}>
                      {task.replace(/-/g, ' ')}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
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
                  <Cpu className="h-4 w-4" />
                  <span>Framework</span>
                  {selectedFramework && (
                    <Badge className="ml-1 bg-purple-600">1</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {commonFrameworks.map(framework => (
                  <DropdownMenuItem 
                    key={framework}
                    onClick={() => toggleFramework(framework)}
                    className={selectedFramework === framework ? "bg-purple-900/30" : ""}
                  >
                    <span className={selectedFramework === framework ? "text-purple-400" : ""}>
                      {framework}
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
                    Most Downloads
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
                  onClick={() => setSortBy('likes')}
                  className={sortBy === 'likes' ? "bg-purple-900/30" : ""}
                >
                  <span className={sortBy === 'likes' ? "text-purple-400" : ""}>
                    Most Liked
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Type</span>
                  {showFineTuned !== undefined && (
                    <Badge className="ml-1 bg-purple-600">1</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={() => setShowFineTuned(undefined)}
                  className={showFineTuned === undefined ? "bg-purple-900/30" : ""}
                >
                  <span className={showFineTuned === undefined ? "text-purple-400" : ""}>
                    All Types
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowFineTuned(true)}
                  className={showFineTuned === true ? "bg-purple-900/30" : ""}
                >
                  <span className={showFineTuned === true ? "text-purple-400" : ""}>
                    Fine-tuned Only
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowFineTuned(false)}
                  className={showFineTuned === false ? "bg-purple-900/30" : ""}
                >
                  <span className={showFineTuned === false ? "text-purple-400" : ""}>
                    Base Models Only
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh models"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-purple-400" : ""}`} />
            </Button>
          </div>
        </div>
        
        {/* Active filters display */}
        {(selectedTasks.length > 0 || selectedTags.length > 0 || selectedFramework || showFineTuned !== undefined) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            
            {selectedTasks.map(task => (
              <Badge key={task} className="bg-blue-600/70 hover:bg-blue-700 cursor-pointer" onClick={() => toggleTask(task)}>
                {task.replace(/-/g, ' ')} ✕
              </Badge>
            ))}
            
            {selectedTags.map(tag => (
              <Badge key={tag} className="bg-purple-600/70 hover:bg-purple-700 cursor-pointer" onClick={() => toggleTag(tag)}>
                {tag} ✕
              </Badge>
            ))}
            
            {selectedFramework && (
              <Badge className="bg-green-600/70 hover:bg-green-700 cursor-pointer" onClick={() => setSelectedFramework(undefined)}>
                {selectedFramework} ✕
              </Badge>
            )}
            
            {showFineTuned !== undefined && (
              <Badge className="bg-yellow-600/70 hover:bg-yellow-700 cursor-pointer" onClick={() => setShowFineTuned(undefined)}>
                {showFineTuned ? 'Fine-tuned' : 'Base Models'} ✕
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
          <p className="text-gray-300 text-lg">Loading AI models...</p>
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
              {filteredModels.length === 0 
                ? 'No models match your criteria. Try adjusting your filters.' 
                : `Found ${filteredModels.length} model${filteredModels.length === 1 ? '' : 's'}`}
            </p>
          )}
          
          {/* Models grid */}
          {!error && filteredModels.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all h-full flex flex-col"
                >
                  <div className="p-5 flex-grow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{model.name}</h3>
                      <Badge className={model.isFineTuned ? "bg-yellow-600" : "bg-blue-600"}>
                        {model.isFineTuned ? 'Fine-tuned' : 'Base Model'}
                      </Badge>
                    </div>
                    
                    {/* Owner and framework */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-400">{model.owner}</span>
                      <span className="text-gray-500">•</span>
                      <Badge variant="outline" className="text-gray-300 border-gray-700">
                        {model.framework}
                      </Badge>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{model.description}</p>
                    
                    {/* Task */}
                    <div className="mb-3">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">
                        {model.task.replace(/-/g, ' ')}
                      </Badge>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {model.tags.slice(0, 5).map(tag => (
                        <span 
                          key={tag} 
                          className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded cursor-pointer hover:bg-gray-700"
                          onClick={() => !selectedTags.includes(tag) && toggleTag(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                      {model.tags.length > 5 && (
                        <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                          +{model.tags.length - 5} more
                        </span>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-400">
                      <div className="flex items-center">
                        <Layers className="h-3 w-3 mr-1" />
                        <span>{model.size}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(model.lastUpdated)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        <span>{formatNumber(model.downloadCount)} downloads</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        <span>{formatNumber(model.likes)} likes</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer with action buttons */}
                  <div className="border-t border-gray-700/50 p-3 bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-gray-400 border-gray-700">
                          {model.license}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {model.paperUrl && (
                          <a 
                            href={model.paperUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium"
                            title="View paper"
                          >
                            <BookOpen className="h-4 w-4" />
                          </a>
                        )}
                        
                        {model.demoUrl && (
                          <a 
                            href={model.demoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 flex items-center text-sm font-medium"
                            title="Try demo"
                          >
                            <span className="mr-1">Demo</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        
                        <a 
                          href={model.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 flex items-center text-sm font-medium"
                        >
                          View Model
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Empty state */}
          {!error && filteredModels.length === 0 && (
            <div className="text-center py-20 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <Code className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-bold mb-2">No models found</h3>
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