"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, ChevronDown, ChevronUp, Monitor, Moon, Sun, Keyboard, Terminal, Cpu, PaintBucket, RotateCcw, Save, Home, Edit3, Layout, Minus, Plus, Eye, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';

interface SettingsPanelProps {
  theme: 'dark' | 'light';
  onClose: () => void;
  onSaveSettings?: (settings: Settings) => void;
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

interface Settings {
  editor: {
    fontFamily: string;
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    autoSave: boolean;
    minimap: boolean;
    lineNumbers: boolean;
    bracketPairColorization: boolean;
  };
  terminal: {
    fontFamily: string;
    fontSize: number;
    cursorBlink: boolean;
    cursorStyle: 'block' | 'underline' | 'bar';
    bellSound: boolean;
  };
  ai: {
    model: string;
    apiKey: string;
    contextLimit: number;
    temperature: number;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    zoomLevel: number;
    sidebarPosition: 'left' | 'right';
    showStatusBar: boolean;
    showActivityBar: boolean;
    smoothScrolling: boolean;
  };
}

// Mock switch component until we have the real one
const MockSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button
    className={`w-10 h-5 rounded-full p-1 transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-400'}`}
    onClick={onChange}
    aria-pressed={checked ? 'true' : 'false'}
    title="Toggle setting"
  >
    <div className={`bg-white w-3 h-3 rounded-full transform transition-transform ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

export default function SettingsPanel({ theme, onClose, onSaveSettings, onThemeChange }: SettingsPanelProps) {
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    editor: true,
    terminal: false,
    ai: false,
    ui: false
  });

  // State for settings
  const [settings, setSettings] = useState<Settings>({
    editor: {
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      tabSize: 2,
      wordWrap: true,
      autoSave: true,
      minimap: true,
      lineNumbers: true,
      bracketPairColorization: true,
    },
    terminal: {
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      cursorBlink: true,
      cursorStyle: 'block',
      bellSound: true,
    },
    ai: {
      model: 'deepseek-coder',
      apiKey: 'sk-8474c934d6974bb79685dcf91fab925c',
      contextLimit: 8192,
      temperature: 0.7,
    },
    ui: {
      theme: theme,
      accentColor: '#6366f1',
      zoomLevel: 1,
      sidebarPosition: 'left',
      showStatusBar: true,
      showActivityBar: true,
      smoothScrolling: true,
    },
  });

  // Update UI theme when theme prop changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        theme
      }
    }));
  }, [theme]);

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Reset settings to default
  const handleReset = () => {
    setSettings({
      editor: {
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
        autoSave: true,
        minimap: true,
        lineNumbers: true,
        bracketPairColorization: true,
      },
      terminal: {
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        cursorBlink: true,
        cursorStyle: 'block',
        bellSound: true,
      },
      ai: {
        model: 'deepseek-coder',
        apiKey: 'sk-8474c934d6974bb79685dcf91fab925c',
        contextLimit: 8192,
        temperature: 0.7,
      },
      ui: {
        theme: theme,
        accentColor: '#6366f1',
        zoomLevel: 1,
        sidebarPosition: 'left',
        showStatusBar: true,
        showActivityBar: true,
        smoothScrolling: true,
      },
    });
  };

  // Save settings and close panel
  const handleSave = () => {
    if (onSaveSettings) {
      onSaveSettings(settings);
    }
    onClose();
  };

  // Handle theme change
  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setSettings(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        theme: newTheme
      }
    }));
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  // Helper function for rendering section buttons with proper ARIA attributes
  const renderSectionButton = (section: 'editor' | 'terminal' | 'ai' | 'ui', icon: React.ReactNode, label: string) => {
    const isExpanded = expandedSections[section];
    
    return (
      <button
        className={cn(
          "w-full p-4 flex items-center justify-between",
          theme === 'dark' ? 'hover:bg-[#2d2d2d]' : 'hover:bg-[#f9f9f9]'
        )}
        onClick={() => toggleSection(section)}
        aria-expanded={isExpanded ? 'true' : 'false'}
        title={isExpanded ? "Collapse Settings" : "Expand Settings"}
      >
        <div className="flex items-center">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <ChevronDown 
          className={cn(
            "h-5 w-5 transition-transform",
            isExpanded ? 'rotate-180' : ''
          )} 
        />
      </button>
    );
  };

  // Helper function for theme buttons with proper ARIA attributes
  const renderThemeButton = (themeType: 'light' | 'dark', icon: React.ReactNode, label: string) => {
    const isActive = theme === themeType;
    
    return (
      <button
        onClick={() => handleThemeChange(themeType)}
        className={cn(
          "flex-1 py-2 px-3 rounded flex items-center justify-center text-sm",
          isActive
            ? 'bg-blue-500 text-white'
            : theme === 'light' 
              ? 'bg-[#f0f0f0] text-gray-700 hover:bg-[#e4e4e4]' 
              : 'bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]'
        )}
        aria-pressed={isActive ? "true" : "false"}
      >
        {icon}
        {label}
      </button>
    );
  };

  // Update settings - fix the type issues
  const updateEditorSetting = (key: keyof Settings['editor'], value: any) => {
    setSettings(prev => ({
      ...prev,
      editor: {
        ...prev.editor,
        [key]: value
      }
    }));
  };

  const updateTerminalSetting = (key: keyof Settings['terminal'], value: any) => {
    setSettings(prev => ({
      ...prev,
      terminal: {
        ...prev.terminal,
        [key]: value
      }
    }));
  };

  const updateAIAssistantSetting = (key: keyof Settings['ai'], value: any) => {
    setSettings(prev => ({
      ...prev,
      ai: {
        ...prev.ai,
        [key]: value
      }
    }));
  };

  const updateUISetting = (key: keyof Settings['ui'], value: any) => {
    setSettings(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        [key]: value
      }
    }));
  };

  return (
    <div className={cn(
      "flex flex-col h-full",
      theme === 'dark' ? 'bg-[#252526] text-gray-300' : 'bg-white text-gray-800'
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
      )}>
        <div className="flex items-center">
          <div className={cn(
            "p-2 rounded mr-2 bg-gradient-to-br",
            theme === 'dark' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'
          )}>
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Settings</h2>
            <p className="text-xs opacity-75">Configure Neural Nexus</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Link href="/" className={cn(
            "p-1 rounded-full mr-2",
            theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
          )}>
            <Home className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Back to Home</span>
          </Link>
          
          <button
            onClick={onClose}
            className={cn(
              "p-1 rounded-full",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
            )}
            aria-label="Close settings panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Settings body */}
      <div className="flex-1 overflow-y-auto">
        {/* Editor settings */}
        <div className={cn(
          "border-b",
          theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
        )}>
          {renderSectionButton(
            'editor', 
            <Edit3 className="h-5 w-5 mr-2 text-blue-500" />, 
            'Editor'
          )}
          
          {expandedSections.editor && (
            <div className="p-4 pt-0 space-y-4">
              {/* Font Family */}
              <div>
                <label htmlFor="editorFontFamily" className="block text-sm mb-1">Font Family</label>
                <select
                  id="editorFontFamily"
                  value={settings.editor.fontFamily}
                  onChange={(e) => updateEditorSetting('fontFamily', e.target.value)}
                  className={cn(
                    "w-full p-2 rounded text-sm",
                    theme === 'dark' 
                      ? 'bg-[#3c3c3c] border-[#3d3d3d]' 
                      : 'bg-white border-[#e0e0e0]',
                    "border"
                  )}
                  aria-label="Editor font family"
                  title="Select editor font family"
                >
                  <option value="monospace">Monospace</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                  <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                  <option value="'Source Code Pro', monospace">Source Code Pro</option>
                </select>
              </div>
              
              {/* Font Size */}
              <div className="flex flex-col space-y-2 mb-4">
                <label htmlFor="fontSize" className="text-sm font-medium">Font Size</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="fontSize"
                    type="range"
                    min="10"
                    max="24"
                    value={settings.editor.fontSize}
                    onChange={(e) => updateEditorSetting('fontSize', parseInt(e.target.value))}
                    className="w-full"
                    aria-label="Font size"
                  />
                  <span className="text-sm w-8 text-center">{settings.editor.fontSize}</span>
                </div>
              </div>
              
              {/* Tab Size */}
              <div className="flex flex-col space-y-2 mb-4">
                <label htmlFor="tabSize" className="text-sm font-medium">Tab Size</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="tabSize"
                    type="range"
                    min="2"
                    max="8"
                    step="2"
                    value={settings.editor.tabSize}
                    onChange={(e) => updateEditorSetting('tabSize', parseInt(e.target.value))}
                    className="w-full"
                    aria-label="Tab size"
                  />
                  <span className="text-sm w-8 text-center">{settings.editor.tabSize}</span>
                </div>
              </div>
              
              {/* Word Wrap */}
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="wordWrap" className="text-sm font-medium">Word Wrap</label>
                <Switch
                  id="wordWrap"
                  checked={settings.editor.wordWrap}
                  onCheckedChange={(checked: boolean) => updateEditorSetting('wordWrap', checked)}
                />
              </div>
              
              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <label htmlFor="editorAutoSave" className="text-sm">Auto Save</label>
                <Switch 
                  checked={settings.editor.autoSave}
                  onCheckedChange={(checked: boolean) => updateEditorSetting('autoSave', checked)}
                />
              </div>
              
              {/* Line Numbers */}
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="lineNumbers" className="text-sm font-medium">Line Numbers</label>
                <Switch
                  id="lineNumbers"
                  checked={settings.editor.lineNumbers}
                  onCheckedChange={(checked: boolean) => updateEditorSetting('lineNumbers', checked)}
                />
              </div>
              
              {/* Bracket Pair Colorization */}
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="bracketPairColorization" className="text-sm font-medium">Bracket Pair Colorization</label>
                <Switch
                  id="bracketPairColorization"
                  checked={settings.editor.bracketPairColorization}
                  onCheckedChange={(checked: boolean) => updateEditorSetting('bracketPairColorization', checked)}
                />
              </div>
              
              {/* Minimap */}
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="minimap" className="text-sm font-medium">Minimap</label>
                <Switch
                  id="minimap"
                  checked={settings.editor.minimap}
                  onCheckedChange={(checked: boolean) => updateEditorSetting('minimap', checked)}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Terminal settings */}
        <div className={cn(
          "border-b",
          theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
        )}>
          {renderSectionButton(
            'terminal', 
            <Terminal className="h-5 w-5 mr-2 text-green-500" />, 
            'Terminal'
          )}
          
          {expandedSections.terminal && (
            <div className="p-4 pt-0 space-y-4">
              {/* Font Family */}
              <div>
                <label htmlFor="terminalFontFamily" className="block text-sm mb-1">Font Family</label>
                <select
                  id="terminalFontFamily"
                  value={settings.terminal.fontFamily}
                  onChange={(e) => updateTerminalSetting('fontFamily', e.target.value)}
                  className={cn(
                    "w-full p-2 rounded text-sm",
                    theme === 'dark' 
                      ? 'bg-[#3c3c3c] border-[#3d3d3d]' 
                      : 'bg-white border-[#e0e0e0]',
                    "border"
                  )}
                  aria-label="Terminal font family"
                  title="Select terminal font family"
                >
                  <option value="monospace">Monospace</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                  <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                  <option value="'Source Code Pro', monospace">Source Code Pro</option>
                </select>
              </div>
              
              {/* Font Size */}
              <div className="flex flex-col space-y-2 mb-4">
                <label htmlFor="terminalFontSize" className="text-sm font-medium">Font Size</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="terminalFontSize"
                    type="range"
                    min="10"
                    max="24"
                    value={settings.terminal.fontSize}
                    onChange={(e) => updateTerminalSetting('fontSize', parseInt(e.target.value))}
                    className="w-full"
                    aria-label="Terminal font size"
                  />
                  <span className="text-sm w-8 text-center">{settings.terminal.fontSize}</span>
                </div>
              </div>
              
              {/* Cursor Blink */}
              <div className="flex items-center justify-between">
                <label htmlFor="terminalCursorBlink" className="text-sm">Cursor Blink</label>
                <Switch 
                  checked={settings.terminal.cursorBlink}
                  onCheckedChange={(checked: boolean) => updateTerminalSetting('cursorBlink', checked)}
                />
              </div>
              
              {/* Cursor Style */}
              <div className="flex flex-col space-y-2 mb-4">
                <label htmlFor="cursorStyle" className="text-sm font-medium">Cursor Style</label>
                <select
                  id="cursorStyle"
                  value={settings.terminal.cursorStyle}
                  onChange={(e) => updateTerminalSetting('cursorStyle', e.target.value as 'block' | 'underline' | 'bar')}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  aria-label="Terminal cursor style"
                >
                  <option value="block">Block</option>
                  <option value="underline">Underline</option>
                  <option value="bar">Bar</option>
                </select>
              </div>
              
              {/* Bell Sound */}
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="bellSound" className="text-sm font-medium">Bell Sound</label>
                <Switch
                  id="bellSound"
                  checked={settings.terminal.bellSound}
                  onCheckedChange={(checked: boolean) => updateTerminalSetting('bellSound', checked)}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* AI Assistant settings */}
        <div className={cn(
          "border-b",
          theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
        )}>
          {renderSectionButton(
            'ai', 
            <Cpu className="h-5 w-5 mr-2 text-purple-500" />, 
            'DeepSeek AI Assistant'
          )}
          
          {expandedSections.ai && (
            <div className="p-4 pt-0 space-y-4">
              {/* Model */}
              <div>
                <label htmlFor="aiModel" className="block text-sm mb-1">Model</label>
                <select
                  id="aiModel"
                  value={settings.ai.model}
                  onChange={(e) => updateAIAssistantSetting('model', e.target.value)}
                  className={cn(
                    "w-full p-2 rounded text-sm",
                    theme === 'dark' 
                      ? 'bg-[#3c3c3c] border-[#3d3d3d]' 
                      : 'bg-white border-[#e0e0e0]',
                    "border"
                  )}
                  aria-label="AI model selection"
                  title="Select AI model"
                >
                  <option value="deepseek-coder">DeepSeek Coder</option>
                  <option value="deepseek-chat">DeepSeek Chat</option>
                  <option value="deepseek-lite">DeepSeek Lite</option>
                </select>
              </div>
              
              {/* API Key */}
              <div>
                <label htmlFor="aiApiKey" className="block text-sm mb-1">API Key</label>
                <div className="flex items-center">
                  <input
                    id="aiApiKey"
                    type="password"
                    value={settings.ai.apiKey}
                    onChange={(e) => updateAIAssistantSetting('apiKey', e.target.value)}
                    placeholder="sk-deepseek-xxx..."
                    className={cn(
                      "flex-1 p-2 rounded-l text-sm",
                      theme === 'dark' 
                        ? 'bg-[#3c3c3c] border-[#3d3d3d]' 
                        : 'bg-white border-[#e0e0e0]',
                      "border border-r-0"
                    )}
                  />
                  <button
                    className={cn(
                      "p-2 rounded-r",
                      theme === 'dark' 
                        ? 'bg-[#3c3c3c] border-[#3d3d3d] hover:bg-[#4c4c4c]' 
                        : 'bg-[#f0f0f0] border-[#e0e0e0] hover:bg-[#e4e4e4]',
                      "border border-l-0"
                    )}
                    title="Reveal API key"
                    aria-label="Reveal API key"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs opacity-75">Required for DeepSeek AI API access</p>
              </div>
              
              {/* Context Limit */}
              <div>
                <label htmlFor="aiContextLimit" className="block text-sm mb-1">Context Limit</label>
                <div className="flex items-center">
                  <input
                    id="aiContextLimit"
                    type="range"
                    min="1000"
                    max="10000"
                    step="1000"
                    value={settings.ai.contextLimit}
                    onChange={(e) => updateAIAssistantSetting('contextLimit', parseInt(e.target.value))}
                    className="flex-1 mr-2"
                    aria-label="Context limit"
                    title="Adjust AI context token limit"
                  />
                  <span className="text-sm w-16 text-right">{settings.ai.contextLimit.toLocaleString()} tokens</span>
                </div>
              </div>
              
              {/* Temperature */}
              <div>
                <label htmlFor="aiTemperature" className="block text-sm mb-1">Temperature</label>
                <div className="flex items-center">
                  <input
                    id="aiTemperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.ai.temperature}
                    onChange={(e) => updateAIAssistantSetting('temperature', parseFloat(e.target.value))}
                    className="flex-1 mr-2"
                    aria-label="AI temperature"
                    title="Adjust AI temperature"
                  />
                  <span className="text-sm w-8 text-right">{settings.ai.temperature}</span>
                </div>
                <p className="mt-1 text-xs opacity-75">Lower values give more precise answers, higher values more creative ones</p>
              </div>
            </div>
          )}
        </div>
        
        {/* UI settings */}
        <div className={cn(
          "border-b",
          theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
        )}>
          {renderSectionButton(
            'ui', 
            <Layout className="h-5 w-5 mr-2 text-amber-500" />, 
            'UI'
          )}
          
          {expandedSections.ui && (
            <div className="p-4 pt-0 space-y-4">
              {/* Theme */}
              <div className="flex flex-col space-y-2 mb-4">
                <label htmlFor="theme" className="text-sm font-medium">Theme</label>
                <select
                  id="theme"
                  value={settings.ui.theme}
                  onChange={(e) => updateUISetting('theme', e.target.value as 'light' | 'dark' | 'system')}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  aria-label="UI theme"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              {/* Zoom Level */}
              <div className="flex flex-col space-y-2 mb-4">
                <label htmlFor="zoomLevel" className="text-sm font-medium">Zoom Level</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="zoomLevel"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.ui.zoomLevel}
                    onChange={(e) => updateUISetting('zoomLevel', parseFloat(e.target.value))}
                    className="w-full"
                    aria-label="Zoom level"
                  />
                  <span className="text-sm w-10 text-center">{(settings.ui.zoomLevel * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              {/* Show Status Bar */}
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="statusBar" className="text-sm font-medium">Show Status Bar</label>
                <Switch
                  id="statusBar"
                  checked={settings.ui.showStatusBar}
                  onCheckedChange={(checked: boolean) => updateUISetting('showStatusBar', checked)}
                />
              </div>
              
              {/* Show Activity Bar */}
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="activityBar" className="text-sm font-medium">Show Activity Bar</label>
                <Switch
                  id="activityBar"
                  checked={settings.ui.showActivityBar}
                  onCheckedChange={(checked: boolean) => updateUISetting('showActivityBar', checked)}
                />
              </div>
              
              {/* Smooth Scrolling */}
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="smoothScrolling" className="text-sm font-medium">Smooth Scrolling</label>
                <Switch
                  id="smoothScrolling"
                  checked={settings.ui.smoothScrolling}
                  onCheckedChange={(checked: boolean) => updateUISetting('smoothScrolling', checked)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className={cn(
        "p-4 border-t flex items-center justify-between",
        theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
      )}>
        <button
          onClick={handleReset}
          className={cn(
            "py-1.5 px-3 rounded text-sm",
            theme === 'dark' 
              ? 'hover:bg-[#3c3c3c]' 
              : 'hover:bg-[#f0f0f0]'
          )}
          aria-label="Reset settings to defaults"
          title="Reset settings to defaults"
        >
          Reset to Defaults
        </button>
        
        <button
          onClick={handleSave}
          className={cn(
            "py-1.5 px-3 rounded text-sm",
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          )}
          aria-label="Save settings"
          title="Save settings"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
} 