"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, Sun, Code, Terminal as TerminalIcon, Github, Settings, Play, 
  Save, Download, Upload, Share2, Cpu, Home, Package, 
  FileCode, Layout, PanelLeft, PanelRight, ExternalLink,
  Search, GitBranch, Bell, Coffee, Eye, Flame, 
  MessageSquare, MoreHorizontal, CloudLightning, Zap,
  BookOpen, Layers, FileSearch, RefreshCw, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AIAssistantPanel from './AIAssistantPanel';
import CodeSamplesPanel from './CodeSamplesPanel';
import Terminal from './Terminal';
import GitHubIntegration from './GitHubIntegration';
import SettingsPanel from './SettingsPanel';
import ExtensionMarketplace from './ExtensionMarketplace';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import Link from 'next/link';
import ModelExplorer from './ModelExplorer';
import PreviewWindow from './PreviewWindow';

export default function AIPlayground() {
  // State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [code, setCode] = useState<string>('// Start coding here...\n\nconsole.log("Hello Neural Nexus!");');
  const [language, setLanguage] = useState<string>('javascript');
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>('untitled.js');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFileExplorer, setShowFileExplorer] = useState<boolean>(true);
  const [showActivityBar, setShowActivityBar] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('explorer');
  const [openFiles, setOpenFiles] = useState([
    { id: 'main', name: 'main.js', active: true },
    { id: 'config', name: 'config.json', active: false },
    { id: 'demo', name: 'demo.js', active: false },
    { id: 'resume', name: 'ResumeGenerator.jsx', active: false }
  ]);
  const [showStatusBar, setShowStatusBar] = useState<boolean>(true);
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  const [editorSettings, setEditorSettings] = useState({
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 14,
    tabSize: 2
  });
  
  // Effect to handle theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('neural-nexus-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('neural-nexus-theme', newTheme);
  };
  
  // Toggle panel
  const togglePanel = (panelName: string) => {
    if (activePanel === panelName) {
      setActivePanel(null);
    } else {
      setActivePanel(panelName);
    }
  };
  
  // Run code
  const runCode = () => {
    setIsRunning(true);
    setShowTerminal(true);
    
    // Simulate running code
    setTimeout(() => {
      try {
        // For demo purposes, we'll just evaluate JavaScript
        // In a real app, you'd want to use a sandboxed environment
        const output = [];
        output.push(`[${new Date().toLocaleTimeString()}] Running ${fileName}...`);
        
        if (language === 'javascript' || language === 'typescript') {
          // This is just for demo - in a real app you'd use a proper sandbox
          const consoleLog = console.log;
          const logs: string[] = [];
          
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
            consoleLog(...args);
          };
          
          try {
            // eslint-disable-next-line no-new-func
            new Function(code)();
            output.push(...logs);
            output.push(`[${new Date().toLocaleTimeString()}] Execution completed successfully.`);
          } catch (error: any) {
            output.push(`Error: ${error.message}`);
            output.push(`[${new Date().toLocaleTimeString()}] Execution failed.`);
          } finally {
            console.log = consoleLog;
          }
        } else {
          output.push(`Language '${language}' execution is simulated.`);
          output.push('Output would appear here in a real environment.');
          output.push(`[${new Date().toLocaleTimeString()}] Execution completed.`);
        }
        
        setTerminalOutput(output.join('\n'));
      } catch (error: any) {
        setTerminalOutput(`Error running code: ${error.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };
  
  // Save code
  const saveCode = () => {
    // In a real app, this would save to a database or file
    setIsSaved(true);
    // Show a temporary "Saved!" message
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
      const originalText = saveButton.textContent;
      saveButton.textContent = 'Saved!';
      setTimeout(() => {
        saveButton.textContent = originalText;
      }, 2000);
    }
  };
  
  // Download code
  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  // Handle code change
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsSaved(false);
  };
  
  // Handle file name change
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
    setIsSaved(false);
  };

  // Handle importing a repository
  const handleImportRepository = (repo: any) => {
    console.log('Repository imported:', repo);
    // In a real app, this would clone/import the repo
  };

  // Handle file selection
  const handleFileSelect = (file: any) => {
    console.log('File selected:', file);
    setFileName(file.name);
    // In a real app, this would load the file content
    
    // Set active tab
    setOpenFiles(prev => 
      prev.map(f => ({
        ...f,
        active: f.id === file.id
      }))
    );
    
    // If file isn't in open files, add it
    if (!openFiles.some(f => f.id === file.id)) {
      setOpenFiles(prev => [
        ...prev.map(f => ({ ...f, active: false })),
        { id: file.id, name: file.name, active: true }
      ]);
    }
  };

  // Handle tab click
  const handleTabClick = (id: string) => {
    setOpenFiles(prev => 
      prev.map(f => ({
        ...f,
        active: f.id === id
      }))
    );
  };

  // Handle tab close
  const handleTabClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    // If closing the active tab, switch to another tab
    const isActive = openFiles.find(f => f.id === id)?.active;
    const newFiles = openFiles.filter(f => f.id !== id);
    
    if (isActive && newFiles.length > 0) {
      newFiles[0].active = true;
    }
    
    setOpenFiles(newFiles);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setShowFileExplorer(!showFileExplorer);
  };
  
  // Toggle activity bar
  const toggleActivityBar = () => {
    setShowActivityBar(!showActivityBar);
  };
  
  // Set active tab in the sidebar
  const setActiveSidebarTab = (tab: string) => {
    setActiveTab(tab);
    setShowFileExplorer(true);
  };
  
  return (
    <div className={cn(
      "flex flex-col h-screen w-full overflow-hidden",
      theme === 'dark' ? 'bg-[#1a1c1e] text-white' : 'bg-white text-black'
    )}>
      {/* Title Bar */}
      <div className={cn(
        "flex items-center justify-between h-9 px-4 py-1 border-b z-10",
        theme === 'dark' ? 'bg-[#1f1f1f] border-[#3d3d3d]' : 'bg-[#e5e5e5] border-[#d0d0d0]'
      )}>
        <div className="flex items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-1 rounded-sm mr-2",
                theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#d0d0d0]'
              )}
              aria-label="Go to home page"
              title="Home"
            >
              <Home className="h-4 w-4" />
            </motion.button>
          </Link>
          <h1 className="text-sm font-medium">Neural Nexus Playground</h1>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            className={cn(
              "p-1 rounded-sm",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#d0d0d0]'
            )}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        {showActivityBar && (
          <div className={cn(
            "w-12 flex flex-col items-center py-2 border-r",
            theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-[#f3f3f3] border-[#e0e0e0]'
          )}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveSidebarTab('explorer')}
              className={cn(
                "p-2 rounded mb-2 relative",
                activeTab === 'explorer' 
                  ? theme === 'dark' 
                    ? 'bg-[#3c3c3c]' 
                    : 'bg-[#e0e0e0]' 
                  : 'hover:bg-opacity-25 hover:bg-gray-500'
              )}
              aria-label="Explorer"
              title="Explorer"
            >
              <FileSearch className="h-5 w-5" />
              {activeTab === 'explorer' && (
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-0.5",
                  theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                )} />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveSidebarTab('github')}
              className={cn(
                "p-2 rounded mb-2 relative",
                activeTab === 'github' 
                  ? theme === 'dark' 
                    ? 'bg-[#3c3c3c]' 
                    : 'bg-[#e0e0e0]' 
                  : 'hover:bg-opacity-25 hover:bg-gray-500'
              )}
              aria-label="GitHub"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
              {activeTab === 'github' && (
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-0.5",
                  theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                )} />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveSidebarTab('ai')}
              className={cn(
                "p-2 rounded mb-2 relative",
                activeTab === 'ai' 
                  ? theme === 'dark' 
                    ? 'bg-[#3c3c3c]' 
                    : 'bg-[#e0e0e0]' 
                  : 'hover:bg-opacity-25 hover:bg-gray-500'
              )}
              aria-label="AI Models"
              title="AI Models"
            >
              <CloudLightning className="h-5 w-5" />
              {activeTab === 'ai' && (
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-0.5",
                  theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                )} />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveSidebarTab('extensions')}
              className={cn(
                "p-2 rounded mb-2 relative",
                activeTab === 'extensions' 
                  ? theme === 'dark' 
                    ? 'bg-[#3c3c3c]' 
                    : 'bg-[#e0e0e0]' 
                  : 'hover:bg-opacity-25 hover:bg-gray-500'
              )}
              aria-label="Extensions"
              title="Extensions"
            >
              <Package className="h-5 w-5" />
              {activeTab === 'extensions' && (
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-0.5",
                  theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                )} />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveSidebarTab('samples')}
              className={cn(
                "p-2 rounded mb-2 relative",
                activeTab === 'samples' 
                  ? theme === 'dark' 
                    ? 'bg-[#3c3c3c]' 
                    : 'bg-[#e0e0e0]' 
                  : 'hover:bg-opacity-25 hover:bg-gray-500'
              )}
              aria-label="Code Samples"
              title="Code Samples"
            >
              <Code className="h-5 w-5" />
              {activeTab === 'samples' && (
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-0.5",
                  theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                )} />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveSidebarTab('resume')}
              className={cn(
                "p-2 rounded mb-2 relative",
                activeTab === 'resume' 
                  ? theme === 'dark' 
                    ? 'bg-[#3c3c3c]' 
                    : 'bg-[#e0e0e0]' 
                  : 'hover:bg-opacity-25 hover:bg-gray-500'
              )}
              aria-label="Resume Generator"
              title="Resume Generator"
            >
              <FileCode className="h-5 w-5" />
              {activeTab === 'resume' && (
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-0.5",
                  theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                )} />
              )}
            </motion.button>
            
            <div className="flex-1"></div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => togglePanel('settings')}
              className={cn(
                "p-2 rounded mb-2 relative",
                activePanel === 'settings' 
                  ? theme === 'dark' 
                    ? 'bg-[#3c3c3c]' 
                    : 'bg-[#e0e0e0]' 
                  : 'hover:bg-opacity-25 hover:bg-gray-500'
              )}
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </motion.button>
          </div>
        )}
        
        {/* Sidebar */}
        {showFileExplorer && (
          <div className={cn(
            "w-64 flex flex-col border-r overflow-hidden",
            theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-[#f3f3f3] border-[#e0e0e0]'
          )}>
            <div className={cn(
              "px-4 py-2 text-sm font-medium uppercase tracking-wider border-b",
              theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
            )}>
              {activeTab === 'explorer' && 'Explorer'}
              {activeTab === 'github' && 'GitHub'}
              {activeTab === 'ai' && 'AI Models'}
              {activeTab === 'extensions' && 'Extensions'}
              {activeTab === 'samples' && 'Code Samples'}
              {activeTab === 'resume' && 'Resume Generator'}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'explorer' && (
                <FileExplorer 
                  theme={theme} 
                  onSelectFile={handleFileSelect} 
                />
              )}
              {activeTab === 'github' && (
                <GitHubIntegration 
                  theme={theme} 
                  onClose={() => setActiveTab('explorer')}
                  onImportRepository={handleImportRepository}
                />
              )}
              {activeTab === 'ai' && (
                <ModelExplorer 
                  theme={theme} 
                  onClose={() => setActiveTab('explorer')}
                />
              )}
              {activeTab === 'extensions' && (
                <ExtensionMarketplace 
                  theme={theme} 
                  onClose={() => setActiveTab('explorer')}
                />
              )}
              {activeTab === 'samples' && (
                <CodeSamplesPanel 
                  theme={theme} 
                  onClose={() => setActiveTab('explorer')}
                />
              )}
              {activeTab === 'resume' && (
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-3">Resume Generator</h3>
                  <p className="text-sm mb-4">Create professional resumes with AI assistance</p>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        // Set open file to resume generator
                        setOpenFiles(prev => 
                          prev.map(f => ({
                            ...f,
                            active: f.id === 'resume'
                          }))
                        );
                      }}
                      className={cn(
                        "flex items-center p-2 rounded text-sm",
                        theme === 'dark' 
                          ? 'hover:bg-[#3c3c3c] bg-[#2d2d2d]' 
                          : 'hover:bg-[#e0e0e0] bg-[#f0f0f0]'
                      )}
                    >
                      <FileCode className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Open Resume Generator</span>
                    </button>
                    
                    <div className={cn(
                      "text-xs p-3 rounded",
                      theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-[#f5f5f5]'
                    )}>
                      <p className="mb-2">✨ Create professional resumes in multiple styles</p>
                      <p className="mb-2">🧠 Powered by Neural Nexus AI</p>
                      <p>📄 Export directly to HTML format</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Tabs */}
          <div className={cn(
            "flex items-center border-b overflow-x-auto hide-scrollbar",
            theme === 'dark' ? 'bg-[#1e1e1e] border-[#3d3d3d]' : 'bg-[#f5f5f5] border-[#e0e0e0]'
          )}>
            {openFiles.map(file => (
              <div
                key={file.id}
                onClick={() => handleTabClick(file.id)}
                className={cn(
                  "flex items-center py-1 px-3 border-r h-9 relative cursor-pointer max-w-[180px] min-w-[120px]",
                  file.active 
                    ? theme === 'dark' 
                      ? 'bg-[#1f1f1f] border-[#3d3d3d]' 
                      : 'bg-white border-[#e0e0e0]' 
                    : theme === 'dark' 
                      ? 'bg-[#2d2d2d] border-[#3d3d3d] hover:bg-[#262626]' 
                      : 'bg-[#ececec] border-[#e0e0e0] hover:bg-[#e5e5e5]',
                  theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
                )}
              >
                {file.active && (
                  <div className={cn(
                    "absolute left-0 right-0 top-0 h-0.5",
                    theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                  )} />
                )}
                <div className="truncate flex-1 text-sm font-medium">{file.name}</div>
                {!isSaved && file.active && <span className="ml-1 text-xs text-yellow-500">●</span>}
                <button
                  onClick={(e) => handleTabClose(e, file.id)}
                  className={cn(
                    "ml-2 p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100",
                    theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#d0d0d0]'
                  )}
                  aria-label="Close tab"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Editor and Panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                code={code}
                onChange={handleCodeChange}
                language={language}
                theme={theme}
                onRun={runCode}
                running={isRunning}
                onDownload={downloadCode}
                onSave={saveCode}
                fontFamily={editorSettings.fontFamily}
                fontSize={editorSettings.fontSize}
                tabSize={editorSettings.tabSize}
              />
            </div>
            
            {/* Right Panel */}
            <AnimatePresence>
              {activePanel && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 400, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "border-l h-full",
                    theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
                  )}
                >
                  {activePanel === 'assistant' && (
                    <AIAssistantPanel
                      theme={theme}
                      onClose={() => setActivePanel(null)}
                    />
                  )}
                  {activePanel === 'settings' && (
                    <SettingsPanel
                      theme={theme === 'dark' ? 'dark' : 'light'}
                      onClose={() => setActivePanel(null)}
                      onSaveSettings={(newSettings) => {
                        setEditorSettings({
                          fontFamily: newSettings.editor.fontFamily,
                          fontSize: newSettings.editor.fontSize,
                          tabSize: newSettings.editor.tabSize
                        });
                      }}
                    />
                  )}
                  {activePanel === 'preview' && (
                    <PreviewWindow
                      theme={theme}
                      code={code}
                      language={language}
                      onClose={() => setActivePanel(null)}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Terminal */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 200, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "border-t",
                  theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
                )}
              >
                <Terminal
                  output={terminalOutput}
                  theme={theme}
                  onClose={() => setShowTerminal(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Status Bar */}
          {showStatusBar && (
            <div className={cn(
              "h-6 flex items-center justify-between px-3 text-xs border-t",
              theme === 'dark' ? 'bg-[#007acc] text-white border-[#3d3d3d]' : 'bg-[#007acc] text-white border-[#e0e0e0]'
            )}>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <GitBranch className="h-3 w-3 mr-1" />
                  <span>main</span>
                </div>
                <div className="flex items-center">
                  <Code className="h-3 w-3 mr-1" />
                  <span>{language}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => togglePanel('assistant')}
                  className="flex items-center hover:underline"
                >
                  <Cpu className="h-3 w-3 mr-1" />
                  <span>AI Assistant</span>
                </button>
                
                <button
                  onClick={() => togglePanel('preview')}
                  className="flex items-center hover:underline"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span>Preview</span>
                </button>
                
                <button
                  onClick={() => setShowTerminal(!showTerminal)}
                  className="flex items-center hover:underline"
                >
                  <TerminalIcon className="h-3 w-3 mr-1" />
                  <span>Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Folder({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}