import React, { useState, useEffect } from 'react';
import { 
  Star, GitFork, Code, FileCode, Search, Filter, ExternalLink, 
  RefreshCw, ArrowUpDown, ChevronDown, X, Tag
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  language: string;
  topics: string[];
  owner: {
    login: string;
    avatarUrl: string;
  };
  license?: {
    name: string;
    url: string;
  };
  isOpenSource: boolean;
}

interface GitHubRepoExplorerProps {
  initialLanguage?: string;
  initialTopics?: string[];
}

export default function GitHubRepoExplorer({ 
  initialLanguage = '', 
  initialTopics = []
}: GitHubRepoExplorerProps) {
  // State
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopics);
  const [minStars, setMinStars] = useState(0);
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated'>('stars');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  
  // Fetch repositories on mount
  useEffect(() => {
    fetchRepositories();
  }, []);
  
  // Filter and sort repositories when dependencies change
  useEffect(() => {
    if (repositories.length > 0) {
      filterAndSortRepositories();
      
      // Extract available languages and topics
      const languages = Array.from(new Set(repositories.map(repo => repo.language)));
      setAvailableLanguages(languages.filter(lang => lang !== "Unknown").sort());
      
      const topics = Array.from(new Set(repositories.flatMap(repo => repo.topics)));
      setAvailableTopics(topics.sort());
    }
  }, [repositories, searchQuery, selectedLanguage, selectedTopics, minStars, sortBy, sortOrder]);
  
  // Fetch repositories from API
  const fetchRepositories = async (forceRefresh = false) => {
    setIsLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (forceRefresh) {
        params.append('refresh', 'true');
      }
      
      const response = await fetch(`/api/github-repos?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch repositories');
      }
      
      if (data.success && data.repositories) {
        setRepositories(data.repositories);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter and sort repositories
  const filterAndSortRepositories = () => {
    let filtered = [...repositories];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(repo => 
        repo.name.toLowerCase().includes(query) || 
        repo.description.toLowerCase().includes(query) ||
        repo.fullName.toLowerCase().includes(query)
      );
    }
    
    // Apply language filter
    if (selectedLanguage) {
      filtered = filtered.filter(repo => repo.language === selectedLanguage);
    }
    
    // Apply topics filter
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(repo => 
        selectedTopics.every(topic => repo.topics.includes(topic))
      );
    }
    
    // Apply stars filter
    if (minStars > 0) {
      filtered = filtered.filter(repo => repo.stars >= minStars);
    }
    
    // Sort repositories
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'stars':
          comparison = a.stars - b.stars;
          break;
        case 'forks':
          comparison = a.forks - b.forks;
          break;
        case 'updated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredRepos(filtered);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle language selection
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(selectedLanguage === language ? '' : language);
  };
  
  // Handle topic toggle
  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Format number with k/M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
  
  // Format date to relative time
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };
  
  // Get language color based on language name
  const getLanguageColor = (language: string): string => {
    const colorMap: Record<string, string> = {
      "JavaScript": "#f1e05a",
      "TypeScript": "#3178c6",
      "Python": "#3572A5",
      "Java": "#b07219",
      "C++": "#f34b7d",
      "C#": "#178600",
      "PHP": "#4F5D95",
      "Ruby": "#701516",
      "Go": "#00ADD8",
      "Rust": "#dea584",
      "Swift": "#F05138",
      "Kotlin": "#A97BFF",
      "Dart": "#00B4AB",
    };
    
    return colorMap[language] || "#8e8e8e";
  };
  
  return (
    <div className="w-full space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {/* Language filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>{selectedLanguage || 'Language'}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
              <DropdownMenuItem 
                onClick={() => setSelectedLanguage('')}
                className={cn(!selectedLanguage && "bg-accent text-accent-foreground")}
              >
                All Languages
              </DropdownMenuItem>
              {availableLanguages.map(lang => (
                <DropdownMenuItem 
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={cn(selectedLanguage === lang && "bg-accent text-accent-foreground")}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getLanguageColor(lang) }}
                    />
                    {lang}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Topics filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>Topics {selectedTopics.length > 0 && `(${selectedTopics.length})`}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
              {availableTopics.slice(0, 30).map(topic => (
                <DropdownMenuItem 
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={cn(selectedTopics.includes(topic) && "bg-accent text-accent-foreground")}
                >
                  <div className="flex items-center gap-2">
                    {selectedTopics.includes(topic) ? (
                      <span className="text-blue-500">✓</span>
                    ) : (
                      <span className="w-4"></span>
                    )}
                    {topic}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setSortBy('stars')}
                className={cn(sortBy === 'stars' && "bg-accent text-accent-foreground")}
              >
                <Star className="h-4 w-4 mr-2" />
                Stars
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('forks')}
                className={cn(sortBy === 'forks' && "bg-accent text-accent-foreground")}
              >
                <GitFork className="h-4 w-4 mr-2" />
                Forks
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('updated')}
                className={cn(sortBy === 'updated' && "bg-accent text-accent-foreground")}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recently Updated
              </DropdownMenuItem>
              <hr className="my-1" />
              <DropdownMenuItem onClick={toggleSortOrder}>
                {sortOrder === 'desc' ? '↓ Descending' : '↑ Ascending'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Refresh button */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchRepositories(true)}
            disabled={isLoading}
            title="Refresh repositories"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>
      
      {/* Selected filters */}
      {(selectedLanguage || selectedTopics.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          
          {selectedLanguage && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: getLanguageColor(selectedLanguage) }}
              />
              {selectedLanguage}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setSelectedLanguage('')} 
              />
            </Badge>
          )}
          
          {selectedTopics.map(topic => (
            <Badge 
              key={topic}
              variant="secondary" 
              className="flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              {topic}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleTopicToggle(topic)} 
              />
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => {
              setSelectedLanguage('');
              setSelectedTopics([]);
            }}
          >
            Clear all
          </Button>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3 text-xl font-medium">Loading repositories...</span>
        </div>
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <div className="flex justify-center items-center py-12 text-red-500">
          <p>Error: {error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4"
            onClick={() => fetchRepositories(true)}
          >
            Try Again
          </Button>
        </div>
      )}
      
      {/* Results count */}
      {!isLoading && !error && (
        <div className="text-sm text-muted-foreground">
          Found {filteredRepos.length} repositories
        </div>
      )}
      
      {/* Repository grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRepos.map(repo => (
          <div 
            key={repo.id}
            className="border rounded-lg overflow-hidden flex flex-col transition-all duration-200 
              hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700"
          >
            <div className="p-5 flex flex-col h-full">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={repo.owner.avatarUrl} 
                    alt={repo.owner.login}
                    className="w-8 h-8 rounded-full" 
                  />
                  <div>
                    <h3 className="font-medium hover:underline">
                      <a 
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        {repo.name}
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </a>
                    </h3>
                    <p className="text-sm text-muted-foreground">{repo.owner.login}</p>
                  </div>
                </div>
                
                {/* Star count */}
                <div className="flex items-center text-sm text-amber-500">
                  <Star className="fill-amber-400 stroke-amber-500 h-4 w-4 mr-1" />
                  {formatNumber(repo.stars)}
                </div>
              </div>
              
              {/* Description */}
              <p className="mt-3 text-sm line-clamp-3 flex-grow">
                {repo.description || "No description provided"}
              </p>
              
              {/* Topics */}
              <div className="mt-4 flex flex-wrap gap-2">
                {repo.topics.slice(0, 5).map(topic => (
                  <Badge 
                    key={topic} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                    onClick={() => handleTopicToggle(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
                {repo.topics.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{repo.topics.length - 5} more
                  </Badge>
                )}
              </div>
              
              {/* Footer */}
              <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                  {repo.language}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <GitFork className="h-3 w-3 mr-1" />
                    {formatNumber(repo.forks)}
                  </div>
                  
                  <div title={new Date(repo.lastUpdated).toLocaleDateString()}>
                    Updated {formatDate(repo.lastUpdated)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {!isLoading && !error && filteredRepos.length === 0 && (
        <div className="text-center py-12">
          <FileCode className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-xl font-medium mb-2">No repositories found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedLanguage('');
              setSelectedTopics([]);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
} 