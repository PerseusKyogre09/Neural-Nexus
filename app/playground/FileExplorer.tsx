"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Plus, Trash, RefreshCw, MoreHorizontal, FileText, Code, FileJson, Search, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  extension?: string;
  active?: boolean;
  lastModified?: string;
  size?: string;
}

interface FileExplorerProps {
  theme: string;
  onSelectFile: (file: FileItem) => void;
}

export default function FileExplorer({ theme, onSelectFile }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['workspace', 'src']);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>('main');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'name' | 'modified'>('name');
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, itemId: string} | null>(null);
  
  // Mock file structure
  const files: FileItem[] = [
    {
      id: 'workspace',
      name: 'neural-nexus-workspace',
      type: 'folder',
      lastModified: '2023-11-12T10:32:00Z',
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          lastModified: '2023-11-14T14:22:00Z',
          children: [
            {
              id: 'main',
              name: 'main.js',
              type: 'file',
              extension: 'js',
              active: true,
              lastModified: '2023-11-14T16:45:00Z',
              size: '4.2 KB'
            },
            {
              id: 'utils',
              name: 'utils.js',
              type: 'file',
              extension: 'js',
              lastModified: '2023-11-13T09:15:00Z',
              size: '2.8 KB'
            },
            {
              id: 'types',
              name: 'types.d.ts',
              type: 'file',
              extension: 'ts',
              lastModified: '2023-11-10T11:30:00Z',
              size: '0.9 KB'
            },
            {
              id: 'components',
              name: 'components',
              type: 'folder',
              lastModified: '2023-11-12T08:45:00Z',
              children: [
                {
                  id: 'button',
                  name: 'Button.jsx',
                  type: 'file',
                  extension: 'jsx',
                  lastModified: '2023-11-12T08:45:00Z',
                  size: '1.6 KB'
                },
                {
                  id: 'input',
                  name: 'Input.jsx',
                  type: 'file',
                  extension: 'jsx',
                  lastModified: '2023-11-11T16:22:00Z',
                  size: '1.2 KB'
                }
              ]
            }
          ]
        },
        {
          id: 'configs',
          name: 'configs',
          type: 'folder',
          lastModified: '2023-11-09T13:40:00Z',
          children: [
            {
              id: 'config',
              name: 'config.json',
              type: 'file',
              extension: 'json',
              lastModified: '2023-11-09T13:40:00Z',
              size: '0.5 KB'
            },
            {
              id: 'settings',
              name: 'settings.json',
              type: 'file',
              extension: 'json',
              lastModified: '2023-11-08T10:15:00Z',
              size: '0.8 KB'
            }
          ]
        },
        {
          id: 'readme',
          name: 'README.md',
          type: 'file',
          extension: 'md',
          lastModified: '2023-11-07T09:20:00Z',
          size: '1.4 KB'
        },
        {
          id: 'package',
          name: 'package.json',
          type: 'file',
          extension: 'json',
          lastModified: '2023-11-06T14:30:00Z',
          size: '1.1 KB'
        }
      ]
    }
  ];
  
  const toggleFolder = (folderId: string) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(expandedFolders.filter(id => id !== folderId));
    } else {
      setExpandedFolders([...expandedFolders, folderId]);
    }
  };
  
  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      setActiveFile(file.id);
      onSelectFile(file);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      itemId
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };
  
  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case 'js':
        return <Code className="h-4 w-4 text-yellow-400" />;
      case 'jsx':
        return <Code className="h-4 w-4 text-blue-500" />;
      case 'ts':
        return <Code className="h-4 w-4 text-blue-400" />;
      case 'tsx':
        return <Code className="h-4 w-4 text-blue-600" />;
      case 'json':
        return <FileJson className="h-4 w-4 text-yellow-600" />;
      case 'md':
        return <FileText className="h-4 w-4 text-blue-300" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Flatten file structure for search
  const flattenFiles = (items: FileItem[]): FileItem[] => {
    return items.reduce<FileItem[]>((acc, item) => {
      if (item.type === 'folder' && item.children) {
        return [...acc, item, ...flattenFiles(item.children)];
      }
      return [...acc, item];
    }, []);
  };

  // Filter files based on search query
  const filteredFiles = () => {
    if (!searchQuery) return files;
    
    const allFiles = flattenFiles(files);
    const filtered = allFiles.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Create a new structure with only matching files and their parent folders
    return filtered.map(item => ({
      ...item,
      children: item.children ? item.children.filter(child => 
        filtered.some(f => f.id === child.id)
      ) : undefined
    }));
  };
  
  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map(item => (
      <motion.div 
        key={item.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div 
          className={cn(
            "flex items-center py-1 hover:bg-opacity-30 cursor-pointer group",
            hoveredItem === item.id 
              ? theme === 'dark' ? 'bg-[#2a2d2e]' : 'bg-[#e8e8e8]' 
              : '',
            activeFile === item.id 
              ? theme === 'dark' ? 'bg-[#37373d] text-white' : 'bg-[#d6ebff]' 
              : ''
          )}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => item.type === 'folder' ? toggleFolder(item.id) : handleFileSelect(item)}
          onContextMenu={(e) => handleContextMenu(e, item.id)}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
        >
          {item.type === 'folder' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(item.id);
              }}
              className="mr-1 focus:outline-none transition-transform duration-200"
              style={{ 
                transform: expandedFolders.includes(item.id) ? 'rotate(0deg)' : 'rotate(-90deg)'
              }}
              title={expandedFolders.includes(item.id) ? "Collapse folder" : "Expand folder"}
              aria-expanded={expandedFolders.includes(item.id)}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
          
          {item.type === 'folder' ? (
            <Folder className={cn("h-4 w-4 mr-1.5", expandedFolders.includes(item.id) ? 'text-blue-400' : 'text-yellow-400')} />
          ) : (
            <span className="mr-1.5">{getFileIcon(item.extension)}</span>
          )}
          
          <span className="text-sm truncate">{item.name}</span>
          
          <div className={cn(
            "ml-auto flex mr-1 opacity-0 transition-opacity duration-200",
            hoveredItem === item.id ? 'opacity-100' : 'group-hover:opacity-70'
          )}>
            {item.type === 'file' && (
              <button 
                className={cn(
                  "p-0.5 rounded-sm",
                  theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
                )}
                title="Delete file"
                onClick={(e) => {
                  e.stopPropagation();
                  // Delete file logic here
                }}
              >
                <Trash className="h-3.5 w-3.5" />
              </button>
            )}
            {item.type === 'folder' && (
              <button 
                className={cn(
                  "p-0.5 rounded-sm",
                  theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
                )}
                title="New file"
                onClick={(e) => {
                  e.stopPropagation();
                  // New file logic here
                }}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        
        <AnimatePresence>
          {item.type === 'folder' && expandedFolders.includes(item.id) && item.children && item.children.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderFileTree(item.children, depth + 1)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    ));
  };
  
  return (
    <div 
      className={cn(
        "w-[250px] border-r h-full flex flex-col",
        theme === 'dark' 
          ? 'bg-[#252526] border-[#3d3d3d] text-gray-300' 
          : 'bg-[#f3f3f3] border-[#e0e0e0] text-gray-800'
      )}
      onClick={closeContextMenu}
    >
      {/* Explorer header */}
      <div className={cn(
        "px-4 py-2 flex justify-between items-center",
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        <h3 className="font-bold uppercase text-xs">Explorer</h3>
        <div className="flex space-x-1">
          <button 
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            onClick={() => setShowSearch(!showSearch)}
            title={showSearch ? "Hide search" : "Show search"}
          >
            <Search className="h-4 w-4" />
          </button>
          <button 
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            title="New file"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button 
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button 
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            title="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Search input */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2"
          >
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className={cn(
                  "w-full pl-8 pr-2 py-1 text-sm rounded border",
                  theme === 'dark' 
                    ? 'bg-[#3c3c3c] border-[#4c4c4c] text-white placeholder-gray-400' 
                    : 'bg-white border-[#e0e0e0] text-gray-900 placeholder-gray-500'
                )}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'modified')}
                className={cn(
                  "py-0.5 px-1 rounded border text-xs",
                  theme === 'dark' 
                    ? 'bg-[#3c3c3c] border-[#4c4c4c] text-white' 
                    : 'bg-white border-[#e0e0e0] text-gray-900'
                )}
                aria-label="Sort by options"
                title="Sort files"
              >
                <option value="name">Sort: Name</option>
                <option value="modified">Sort: Modified</option>
              </select>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className={cn(
                    "text-xs underline",
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  )}
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Files list */}
      <div className="overflow-auto flex-grow">
        <AnimatePresence>
          {renderFileTree(files)}
        </AnimatePresence>
        
        {/* Empty state if no search results */}
        {searchQuery && filteredFiles().length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <File className="h-6 w-6 opacity-40 mb-2" />
            <p className="text-sm opacity-60">No matching files found</p>
          </div>
        )}
      </div>
      
      {/* GitHub integration section */}
      <div className={cn(
        "px-4 py-2 border-t",
        theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
      )}>
        <h4 className="font-bold uppercase text-xs flex items-center mb-2">
          <GitBranch className="h-4 w-4 mr-1" />
          GitHub Integration
        </h4>
        <button 
          className={cn(
            "w-full py-1 px-2 text-xs text-center rounded transition-colors duration-200",
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white'
          )}
        >
          Connect to Repository
        </button>
      </div>
      
      {/* Context menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "absolute rounded-md shadow-lg z-50 overflow-hidden w-48",
              theme === 'dark' ? 'bg-[#252526] border border-[#3d3d3d]' : 'bg-white border border-[#e0e0e0]'
            )}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              <button className={cn(
                "flex items-center w-full px-4 py-1.5 text-sm",
                theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f5f5f5]'
              )}>
                <Plus className="h-4 w-4 mr-2" />
                New File
              </button>
              <button className={cn(
                "flex items-center w-full px-4 py-1.5 text-sm",
                theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f5f5f5]'
              )}>
                <Folder className="h-4 w-4 mr-2" />
                New Folder
              </button>
              <div className={cn(
                "border-t my-1",
                theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
              )}></div>
              <button className={cn(
                "flex items-center w-full px-4 py-1.5 text-sm",
                theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f5f5f5]'
              )}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </button>
              <button className={cn(
                "flex items-center w-full px-4 py-1.5 text-sm",
                theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f5f5f5]'
              )}>
                <Settings className="h-4 w-4 mr-2" />
                Properties
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// GitBranch Icon (kept from original)
function GitBranch({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="6" y1="3" x2="6" y2="15"></line>
      <circle cx="18" cy="6" r="3"></circle>
      <circle cx="6" cy="18" r="3"></circle>
      <path d="M18 9a9 9 0 0 1-9 9"></path>
    </svg>
  );
} 