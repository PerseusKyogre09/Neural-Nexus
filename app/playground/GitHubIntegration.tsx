"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, X, ExternalLink, RefreshCw, Lock, Shield, 
  Github, LogOut, Download, Star, GitFork, File
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface GitHubIntegrationProps {
  theme: string;
  onClose: () => void;
  onImportRepository: (repo: any) => void;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  updatedAt: string;
  language: string;
  isPrivate: boolean;
}

export default function GitHubIntegration({ theme, onClose, onImportRepository }: GitHubIntegrationProps) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  
  // Repositories state
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'updated'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState<boolean>(false);
  
  // UI state
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null);
  const [importLoading, setImportLoading] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  
  // Check if authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        // In a real app, you would call your backend API to check auth status
        // For demo purposes, we'll simulate a check after a brief delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate not being authenticated initially
        setIsAuthenticated(false);
        setUsername("");
      } catch (error) {
        setAuthError("Failed to check authentication status");
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Filter repositories when search query changes
  useEffect(() => {
    if (repositories.length > 0) {
      let filtered = [...repositories];
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(repo => 
          repo.name.toLowerCase().includes(query) || 
          (repo.description && repo.description.toLowerCase().includes(query))
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'stars') {
          comparison = a.stars - b.stars;
        } else if (sortBy === 'updated') {
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      
      setFilteredRepos(filtered);
    }
  }, [repositories, searchQuery, sortBy, sortOrder]);
  
  // Mock function to fetch repositories (in a real app, this would hit the GitHub API)
  const fetchRepositories = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock repository data
      const mockRepos: Repository[] = [
        {
          id: 1,
          name: "neural-nexus",
          description: "AI code generation and analysis platform with advanced LLM integration",
          url: "https://github.com/username/neural-nexus",
          stars: 78,
          forks: 12,
          updatedAt: "2023-05-15T10:30:00Z",
          language: "TypeScript",
          isPrivate: false
        },
        {
          id: 2,
          name: "react-state-management",
          description: "Lightweight state management solution for React applications",
          url: "https://github.com/username/react-state-management",
          stars: 231,
          forks: 42,
          updatedAt: "2023-06-22T15:45:00Z",
          language: "JavaScript",
          isPrivate: false
        },
        {
          id: 3,
          name: "personal-website",
          description: "My personal portfolio and blog built with Next.js",
          url: "https://github.com/username/personal-website",
          stars: 15,
          forks: 3,
          updatedAt: "2023-04-10T08:20:00Z",
          language: "TypeScript",
          isPrivate: true
        }
      ];
      
      setRepositories(mockRepos);
      setFilteredRepos(mockRepos);
      setUsername("neuraluser123");
      setAvatar("https://avatars.githubusercontent.com/u/12345678");
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
      setAuthError("Failed to fetch repositories");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle GitHub authentication
  const handleAuthenticate = async () => {
    setAuthLoading(true);
    setAuthError(null);
    setShowAuthModal(true);
    
    try {
      // In a real app, you would redirect to GitHub OAuth flow
      // For demo purposes, we'll simulate success after a brief delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setIsAuthenticated(true);
      setShowAuthModal(false);
      // After authentication, fetch repositories
      await fetchRepositories();
    } catch (error) {
      setAuthError("Authentication failed. Please try again.");
      setShowAuthModal(false);
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setRepositories([]);
    setFilteredRepos([]);
    setUsername("");
    setAvatar("");
    setSelectedRepo(null);
    setImportSuccess(null);
  };
  
  // Handle repository import
  const handleImportRepo = async (repo: Repository) => {
    setImportLoading(true);
    setSelectedRepo(repo.id);
    setImportSuccess(null);
    
    try {
      // In a real app, this would clone the repository
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the parent's callback
      onImportRepository({
        name: repo.name,
        url: repo.url,
        language: repo.language
      });
      
      // Success message
      setImportSuccess(`Successfully imported ${repo.name}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setImportSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to import repository:", error);
    } finally {
      setImportLoading(false);
    }
  };
  
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };
  
  // Get language color
  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: "text-blue-400",
      JavaScript: "text-yellow-400",
      Python: "text-green-400",
      Java: "text-orange-400",
      "C++": "text-pink-400",
      "C#": "text-purple-400",
      Ruby: "text-red-400",
      Go: "text-cyan-400",
      Rust: "text-amber-500",
      PHP: "text-indigo-400",
      HTML: "text-orange-600",
      CSS: "text-blue-600"
    };
    
    return colors[language] || "text-gray-400";
  };
  
  return (
    <div className={cn(
      "flex flex-col h-full",
      theme === 'dark' ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'
    )}>
      {/* Header */}
      <div className={cn(
        "flex justify-between items-center p-4 border-b",
        theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
      )}>
        <h2 className="text-xl font-medium flex items-center">
          <Github className="mr-2 h-5 w-5" />
          GitHub Integration
        </h2>
        <button 
          onClick={onClose}
          className={cn(
            "p-1.5 rounded hover:bg-opacity-80",
            theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'
          )}
          aria-label="Close GitHub integration panel"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Success notification */}
      <AnimatePresence>
        {importSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "px-4 py-2 m-4 rounded-md flex items-center",
              theme === 'dark' ? 'bg-green-800/30 border border-green-700' : 'bg-green-100 border border-green-200'
            )}
          >
            <span className={cn(
              "mr-2 h-5 w-5 flex items-center justify-center rounded-full",
              theme === 'dark' ? 'bg-green-700' : 'bg-green-500'
            )}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <p className={theme === 'dark' ? 'text-green-400' : 'text-green-700'}>{importSuccess}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Github className="h-16 w-16 mb-4 opacity-80" />
            <h3 className="text-lg font-medium mb-2">Connect to GitHub</h3>
            <p className="text-sm opacity-75 mb-6 max-w-xs">
              Link your GitHub account to browse, import, and collaborate on repositories.
            </p>
            
            <button
              onClick={handleAuthenticate}
              disabled={authLoading}
              className={cn(
                "flex items-center px-4 py-2 rounded-md font-medium",
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
                authLoading ? 'opacity-70 cursor-not-allowed' : ''
              )}
            >
              {authLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4 mr-2" />
                  Connect with GitHub
                </>
              )}
            </button>
            
            {authError && (
              <p className="mt-4 text-sm text-red-500">{authError}</p>
            )}
            
            <div className={cn(
              "mt-8 p-3 rounded text-xs max-w-xs",
              theme === 'dark' ? 'bg-[#2d333b]' : 'bg-[#f6f8fa]'
            )}>
              <div className="flex items-start mb-2">
                <Shield className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
                <span>
                  Neural Nexus only requests read access to your public repositories and basic user info.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* User info and controls */}
            <div className={cn(
              "p-4 flex justify-between items-center border-b",
              theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
            )}>
              <div className="flex items-center">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={username} 
                    className="w-8 h-8 rounded-full mr-2 object-cover border"
                  />
                ) : (
                  <div className={cn(
                    "w-8 h-8 rounded-full mr-2 flex items-center justify-center",
                    theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                  )}>
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-medium">{username}</div>
                  <div className="text-xs opacity-75">Connected to GitHub</div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className={cn(
                  "flex items-center px-3 py-1.5 rounded text-sm",
                  theme === 'dark' ? 'hover:bg-[#3c3c3c] bg-[#2d2d2d]' : 'hover:bg-[#f0f0f0] bg-[#e8e8e8]'
                )}
                title="Disconnect from GitHub"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Logout
              </button>
            </div>
            
            {/* Search and filters */}
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-9 pr-4 py-2 rounded-md border",
                    theme === 'dark' 
                      ? 'bg-[#3c3c3c] border-[#4c4c4c] text-white placeholder-gray-400' 
                      : 'bg-white border-[#e0e0e0] text-gray-900 placeholder-gray-500'
                  )}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  {loading ? 'Loading...' : `${filteredRepos.length} repositories found`}
                </div>
                
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort-select" className="text-sm sr-only">
                    Sort by
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'stars' | 'updated')}
                    className={cn(
                      "text-sm px-2 py-1 rounded border",
                      theme === 'dark' 
                        ? 'bg-[#3c3c3c] border-[#4c4c4c] text-white' 
                        : 'bg-white border-[#e0e0e0] text-gray-900'
                    )}
                    aria-label="Sort repositories by"
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="stars">Stars</option>
                    <option value="name">Name</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className={cn(
                      "p-1.5 rounded",
                      theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'
                    )}
                    title={sortOrder === 'asc' ? "Sort descending" : "Sort ascending"}
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Repository list */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin opacity-50 mb-4" />
                <p className="text-sm opacity-75">Loading repositories...</p>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <File className="h-8 w-8 opacity-50 mb-4" />
                <p className="text-sm opacity-75">No repositories found</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={cn(
                      "mt-4 text-sm px-3 py-1.5 rounded",
                      theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#f0f0f0] hover:bg-[#e0e0e0]'
                    )}
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {filteredRepos.map(repo => (
                  <div 
                    key={repo.id}
                    className={cn(
                      "p-4 rounded-lg border transition-colors",
                      theme === 'dark' 
                        ? 'bg-[#2d2d2d] border-[#3d3d3d] hover:border-[#4d4d4d]' 
                        : 'bg-white border-[#e0e0e0] hover:border-[#c0c0c0]'
                    )}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {repo.name}
                          {repo.isPrivate && (
                            <Lock className="ml-1 h-3.5 w-3.5 opacity-70" />
                          )}
                        </h3>
                        <p className={cn(
                          "text-xs mt-1",
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {repo.description || "No description provided"}
                        </p>
                      </div>
                      
                      <div>
                        <a 
                          href={repo.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={cn(
                            "p-1.5 rounded inline-block",
                            theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f0f0f0]'
                          )}
                          title="View on GitHub"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        {repo.language && (
                          <div className="flex items-center">
                            <span className={cn(
                              "rounded-full h-3 w-3 mr-1",
                              getLanguageColor(repo.language)
                            )}></span>
                            <span>{repo.language}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 mr-1 text-yellow-400" />
                          <span>{repo.stars}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <GitFork className="h-3.5 w-3.5 mr-1 opacity-70" />
                          <span>{repo.forks}</span>
                        </div>
                        
                        <div className="opacity-70">
                          Updated {formatRelativeTime(repo.updatedAt)}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleImportRepo(repo)}
                        disabled={importLoading && selectedRepo === repo.id}
                        className={cn(
                          "flex items-center px-3 py-1.5 rounded text-sm font-medium",
                          theme === 'dark' 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white',
                          (importLoading && selectedRepo === repo.id) ? 'opacity-70 cursor-not-allowed' : ''
                        )}
                      >
                        {(importLoading && selectedRepo === repo.id) ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Import
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* GitHub Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "rounded-lg p-6 max-w-sm w-full",
                theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-white'
              )}
            >
              <div className="flex flex-col items-center">
                <Github className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">Connecting to GitHub</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '250ms' }}></div>
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '500ms' }}></div>
                </div>
                <p className="text-sm text-center opacity-75">
                  Authorizing with GitHub. This will grant Neural Nexus access to your public repositories.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 