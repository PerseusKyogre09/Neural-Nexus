"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronsRight, ExternalLink, Copy, Download, Maximize2, Minimize2, Clock, RefreshCw, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TerminalProps {
  output: string;
  theme: string;
  onClose: () => void;
}

export default function Terminal({ output, theme, onClose }: TerminalProps) {
  const [activeTab, setActiveTab] = useState('terminal');
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>(['npm run dev', 'git status', 'ls -la']);
  const [currentCommand, setCurrentCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showTabDropdown, setShowTabDropdown] = useState(false);
  
  const resizeRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialY = useRef<number>(0);
  const initialHeight = useRef<number>(200);
  
  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick);
    }
    
    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick);
      }
    };
  }, []);
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Handle terminal resize
  useEffect(() => {
    const resizeElement = resizeRef.current;
    
    if (!resizeElement) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      initialY.current = e.clientY;
      initialHeight.current = terminalHeight;
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const delta = initialY.current - e.clientY;
      const newHeight = Math.max(100, Math.min(500, initialHeight.current + delta));
      setTerminalHeight(newHeight);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    resizeElement.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      resizeElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [terminalHeight]);
  
  // Handle input key events for command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentCommand.trim()) {
        setCommandHistory(prev => [currentCommand, ...prev]);
        setCurrentCommand('');
        setHistoryIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setCurrentCommand(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCurrentCommand(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };
  
  const downloadOutput = () => {
    const element = document.createElement('a');
    const file = new Blob([output], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'terminal-output.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const clearTerminal = () => {
    // This would typically clear the terminal output
    // Since we're just displaying the output prop, we'd need to lift this state up
    console.log('Clear terminal requested');
  };
  
  const formatOutput = (text: string) => {
    // Add some color formatting to the output
    return text
      .replace(/error|Error|ERROR/g, '<span class="text-red-400">$&</span>')
      .replace(/success|Success|SUCCESS/g, '<span class="text-green-400">$&</span>')
      .replace(/warning|Warning|WARNING/g, '<span class="text-yellow-400">$&</span>')
      .replace(/(https?:\/\/[^\s]+)/g, '<span class="text-blue-400 underline">$&</span>');
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col border-t relative",
        isFullscreen ? "fixed inset-0 z-50" : "",
        theme === 'dark' ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-white border-[#e0e0e0]'
      )}
      style={{ height: isFullscreen ? '100vh' : `${terminalHeight}px` }}
      ref={terminalRef}
    >
      {/* Resize handle */}
      {!isFullscreen && (
        <motion.div 
          ref={resizeRef}
          className="w-full h-1 cursor-ns-resize hover:bg-blue-500 transition-colors"
          title="Resize terminal"
          whileHover={{ backgroundColor: theme === 'dark' ? '#3b82f6' : '#60a5fa' }}
        />
      )}
      
      {/* Terminal header */}
      <div className={cn(
        "flex justify-between items-center px-2 py-1 border-b",
        theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-[#f3f3f3] border-[#e0e0e0]'
      )}>
        <div className="flex items-center text-xs">
          <div className="relative">
            <button 
              onClick={() => setShowTabDropdown(!showTabDropdown)}
              className={cn(
                "px-3 py-1 flex items-center gap-1",
                activeTab === 'terminal' ? (theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black') : ''
              )}
              title="Terminal"
            >
              TERMINAL
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {showTabDropdown && (
              <div className={cn(
                "absolute top-full left-0 mt-1 z-10 rounded shadow-lg border overflow-hidden",
                theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-white border-[#e0e0e0]'
              )}>
                <button 
                  onClick={() => { handleTabClick('terminal'); setShowTabDropdown(false); }}
                  className={cn(
                    "block w-full text-left px-4 py-2 text-xs",
                    activeTab === 'terminal' 
                      ? theme === 'dark' ? 'bg-[#37373d] text-white' : 'bg-[#e8e8e8] text-black'
                      : theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f0f0f0]'
                  )}
                >
                  Terminal
                </button>
                <button 
                  onClick={() => { handleTabClick('problems'); setShowTabDropdown(false); }}
                  className={cn(
                    "block w-full text-left px-4 py-2 text-xs",
                    activeTab === 'problems' 
                      ? theme === 'dark' ? 'bg-[#37373d] text-white' : 'bg-[#e8e8e8] text-black'
                      : theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f0f0f0]'
                  )}
                >
                  Problems
                </button>
                <button 
                  onClick={() => { handleTabClick('output'); setShowTabDropdown(false); }}
                  className={cn(
                    "block w-full text-left px-4 py-2 text-xs",
                    activeTab === 'output' 
                      ? theme === 'dark' ? 'bg-[#37373d] text-white' : 'bg-[#e8e8e8] text-black'
                      : theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f0f0f0]'
                  )}
                >
                  Output
                </button>
                <button 
                  onClick={() => { handleTabClick('debug'); setShowTabDropdown(false); }}
                  className={cn(
                    "block w-full text-left px-4 py-2 text-xs",
                    activeTab === 'debug' 
                      ? theme === 'dark' ? 'bg-[#37373d] text-white' : 'bg-[#e8e8e8] text-black'
                      : theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f0f0f0]'
                  )}
                >
                  Debug Console
                </button>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex">
            <button 
              onClick={() => handleTabClick('problems')}
              className={cn(
                "px-3 py-1",
                activeTab === 'problems' ? (theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black') : ''
              )}
              title="Problems"
            >
              PROBLEMS
            </button>
            <button 
              onClick={() => handleTabClick('output')}
              className={cn(
                "px-3 py-1",
                activeTab === 'output' ? (theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black') : ''
              )}
              title="Output"
            >
              OUTPUT
            </button>
            <button 
              onClick={() => handleTabClick('debug')}
              className={cn(
                "px-3 py-1",
                activeTab === 'debug' ? (theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black') : ''
              )}
              title="Debug console"
            >
              DEBUG CONSOLE
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={copyOutput}
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            title="Copy output"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button 
            onClick={clearTerminal}
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            title="Clear terminal"
          >
            <Trash className="h-4 w-4" />
          </button>
          <button 
            onClick={downloadOutput}
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            title="Download output"
          >
            <Download className="h-4 w-4" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button 
            onClick={onClose}
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            title="Close terminal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Terminal content */}
      <div className="relative flex-1 overflow-hidden">
        <div className={cn(
          "absolute top-0 left-0 right-0 bottom-0 overflow-auto",
          theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
        )}>
          {activeTab === 'terminal' && (
            <div className="p-2 font-mono text-sm">
              <div className={cn(
                "flex items-center mb-1",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              )}>
                <ChevronsRight className="h-4 w-4 mr-1" />
                <span>neuralnexus@cloudshell:~$</span>
              </div>
              
              <div 
                className={cn(
                  "whitespace-pre-wrap mb-4",
                  theme === 'dark' ? 'text-green-400' : 'text-green-700'
                )}
                dangerouslySetInnerHTML={{ __html: formatOutput(output || 'Terminal ready. Run code to see output.') }}
              />
              
              <div className="flex items-center">
                <ChevronsRight className={cn(
                  "h-4 w-4 mr-1",
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                )} />
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "flex-1 bg-transparent focus:outline-none",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                  )}
                  placeholder="Type commands here..."
                />
              </div>
            </div>
          )}
          
          {activeTab === 'problems' && (
            <div className="p-2 font-mono text-sm flex flex-col items-center justify-center h-full">
              <div className={cn(
                "p-2 rounded-full",
                theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-[#f0f0f0]'
              )}>
                <RefreshCw className={cn(
                  "h-5 w-5",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                )} />
              </div>
              <span className={cn(
                "mt-2",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              )}>No problems detected</span>
            </div>
          )}
          
          {activeTab === 'output' && (
            <div className="p-2 font-mono text-sm">
              <div className="flex items-center mb-2">
                <Clock className={cn(
                  "h-4 w-4 mr-1",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                )} />
                <span className={cn(
                  "text-xs",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                )}>
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <pre className={cn(
                "whitespace-pre-wrap",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
              )}>
                {output || 'No output to display.'}
              </pre>
            </div>
          )}
          
          {activeTab === 'debug' && (
            <div className="p-2 font-mono text-sm flex flex-col items-center justify-center h-full">
              <span className={cn(
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              )}>Debug session not started</span>
              <button className={cn(
                "mt-2 px-3 py-1 text-xs rounded",
                theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
              )}>
                Start Debugging
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 