"use client";

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Play, Copy, Save, RefreshCw, Layout, Menu, Settings, Monitor, CloudSnow } from 'lucide-react';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';
import FileExplorer from './FileExplorer';
import ExtensionMarketplace from './ExtensionMarketplace';
import PreviewWindow from './PreviewWindow';
import CloudShell from './CloudShell';
import SettingsModal from './SettingsModal';

export default function Playground() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [code, setCode] = useState<string>(`// yooo let's code something lit 🔥
function vibeCheck(mood) {
  if (mood === 'bussin') {
    return 'no cap, fr fr';
  } else {
    return 'mid, tbh';
  }
}

// this function is straight fire 🚫🧢
const sendIt = () => {
  console.log("sending it...");
  return "sent!";
};

// main function to run the whole thing
vibeCheck('bussin');
sendIt();
`);
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>('');
  const [showFileExplorer, setShowFileExplorer] = useState<boolean>(true);
  const [showExtensions, setShowExtensions] = useState<boolean>(false);
  const [showTerminal, setShowTerminal] = useState<boolean>(true);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCloudShell, setShowCloudShell] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<string>("'Fira Code', monospace");
  const [fontSize, setFontSize] = useState<number>(14);
  const [tabSize, setTabSize] = useState<number>(2);
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Function to run code
  const runCode = async () => {
    setIsLoading(true);
    setOutput('Running code...\n');
    
    try {
      // In a real app, we would send this to a backend service
      // Here we're simulating execution with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate output based on the code
      if (code.includes('console.log')) {
        const logMatch = code.match(/console\.log\(["'](.*)["']\)/);
        if (logMatch && logMatch[1]) {
          setOutput(prev => prev + logMatch[1] + '\n');
        }
      }
      
      if (code.includes('vibeCheck')) {
        setOutput(prev => prev + 'vibeCheck result: no cap, fr fr\n');
      }
      
      if (code.includes('sendIt')) {
        setOutput(prev => prev + 'sent!\n');
      }
      
      setOutput(prev => prev + 'Code execution completed successfully! ✨\n');
    } catch (error) {
      setOutput(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Run code with Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      
      // Save with Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Save functionality would go here
        setOutput(prev => prev + 'Code saved!\n');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code]);
  
  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'}`}>
      {/* Top navbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFileExplorer(!showFileExplorer)}
            className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'}`}
            aria-label="Toggle file explorer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium">Neural Nexus Playground</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={runCode}
            disabled={isLoading}
            className={`flex items-center px-3 py-1.5 rounded text-sm ${
              theme === 'dark' 
                ? 'bg-[#0e639c] hover:bg-[#1177bb] text-white' 
                : 'bg-[#0067c0] hover:bg-[#0078d7] text-white'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Run code"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
            Run
          </button>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded ${
              showPreview
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Toggle preview"
            title="Toggle preview"
          >
            <Monitor className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowCloudShell(!showCloudShell)}
            className={`p-2 rounded ${
              showCloudShell
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Toggle cloud shell"
            title="Toggle cloud shell"
          >
            <CloudSnow className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowExtensions(!showExtensions)}
            className={`p-2 rounded ${
              showExtensions
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Extensions"
          >
            <Layout className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-2 rounded ${
              showTerminal
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
            }`}
            aria-label="Toggle terminal"
          >
            <span className="font-mono text-sm">{'>'}_</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'}`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button
            className={`p-2 rounded ${theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'}`}
            aria-label="Settings"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File explorer */}
        {showFileExplorer && (
          <div className={`w-64 border-r flex-shrink-0 ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
            <FileExplorer 
              theme={theme} 
              onSelectFile={(file) => {
                // In a real app, this would load the file content
                setOutput(`Loading file: ${file.name}\n`);
              }}
            />
          </div>
        )}
        
        {/* Center content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showPreview ? (
            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 overflow-hidden">
                <CodeEditor 
                  code={code} 
                  onChange={setCode} 
                  language={language}
                  theme={theme}
                  onRun={runCode}
                  running={isLoading}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  tabSize={tabSize}
                  onDownload={() => {
                    // Simple download implementation
                    const blob = new Blob([code], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `code.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt'}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    setOutput(prev => prev + 'Code downloaded!\n');
                  }}
                />
              </div>
              <div className="w-1/2 border-l overflow-hidden">
                <PreviewWindow
                  code={code}
                  language={language}
                  theme={theme}
                  onClose={() => setShowPreview(false)}
                />
              </div>
            </div>
          ) : showCloudShell ? (
            <div className="flex-1 overflow-hidden">
              <CloudShell 
                theme={theme}
                onClose={() => setShowCloudShell(false)}
              />
        </div>
      ) : (
            <div className="flex-1 overflow-hidden">
              <CodeEditor 
                code={code} 
                onChange={setCode} 
                language={language}
                theme={theme}
                onRun={runCode}
                running={isLoading}
                fontFamily={fontFamily}
                fontSize={fontSize}
                tabSize={tabSize}
                onDownload={() => {
                  // Simple download implementation
                  const blob = new Blob([code], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `code.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt'}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  
                  setOutput(prev => prev + 'Code downloaded!\n');
                }}
              />
        </div>
      )}
      
          {/* Terminal */}
          {showTerminal && !showCloudShell && (
            <div className={`h-1/3 border-t ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
              <Terminal 
                output={output} 
                theme={theme}
                onClose={() => setShowTerminal(false)}
              />
          </div>
          )}
        </div>
        
        {/* Extension marketplace */}
        {showExtensions && (
          <div className={`w-80 border-l flex-shrink-0 ${theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'}`}>
            <ExtensionMarketplace 
              theme={theme}
              onClose={() => setShowExtensions(false)}
            />
        </div>
      )}
    </div>
      
      {/* Status bar */}
      <div className={`flex items-center justify-between px-4 py-1 text-xs border-t ${theme === 'dark' ? 'bg-[#007acc] text-white border-[#3d3d3d]' : 'bg-[#007acc] text-white border-[#e0e0e0]'}`}>
        <div className="flex items-center space-x-4">
          <div>{language}</div>
          <div>Ln 1, Col 1</div>
          <div>Spaces: {tabSize}</div>
          <div>UTF-8</div>
            </div>
        <div className="flex items-center space-x-2">
          <div>Neural Nexus v1.0.0</div>
          <div>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</div>
          </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          theme={theme}
          onClose={() => setShowSettings(false)}
          onChangeTheme={setTheme}
          fontFamily={fontFamily}
          onChangeFontFamily={setFontFamily}
          fontSize={fontSize}
          onChangeFontSize={setFontSize}
          tabSize={tabSize}
          onChangeTabSize={setTabSize}
        />
      )}
    </div>
  );
} 