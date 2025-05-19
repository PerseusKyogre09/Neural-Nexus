"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Layers, Settings, ChevronDown, X, Maximize2, Minimize2, Play, Download, GitBranch, Save, RefreshCw, Copy, Loader2, ListFilter, Braces } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  theme: 'dark' | 'light';
  onRun: () => void;
  running: boolean;
  onDownload: () => void;
  onSave?: () => void;
  fontFamily?: string;
  fontSize?: number;
  tabSize?: number;
  wordWrap?: boolean;
  lineNumbers?: boolean;
  bracketPairColorization?: boolean;
  smoothScrolling?: boolean;
}

export default function CodeEditor({
  code,
  onChange,
  language,
  theme,
  onRun,
  running,
  onDownload,
  onSave,
  fontFamily = "'Fira Code', monospace",
  fontSize = 14,
  tabSize = 2,
  wordWrap = true,
  lineNumbers = true,
  bracketPairColorization = true,
  smoothScrolling = true
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFile, setActiveFile] = useState('main');
  const [lineNumbersArray, setLineNumbersArray] = useState<string[]>([]);
  const [cursor, setCursor] = useState<{line: number, column: number}>({line: 1, column: 1});
  const [selection, setSelection] = useState<string>('');
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  
  const files = [
    { id: 'main', name: language === 'javascript' ? 'main.js' : language === 'python' ? 'main.py' : language === 'java' ? 'Main.java' : 'main.txt', active: true },
    { id: 'config', name: 'config.json', active: false },
  ];

  // Generate line numbers whenever code changes
  useEffect(() => {
    const lines = code.split('\n');
    const numbers = lines.map((_, i) => (i + 1).toString());
    setLineNumbersArray(numbers);
    
    // Update cursor position
    if (textareaRef.current) {
      const textBefore = code.substring(0, textareaRef.current.selectionStart);
      const linesBefore = textBefore.split('\n');
      const line = linesBefore.length;
      const column = linesBefore[linesBefore.length - 1].length + 1;
      setCursor({line, column});
    }
    
    // Apply syntax highlighting
    setHighlightedCode(highlightSyntax(code, language));
  }, [code, language]);

  // Handle cursor position changes
  const handleSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        setSelection(code.substring(start, end));
      } else {
        setSelection('');
      }
      
      const textBefore = code.substring(0, start);
      const linesBefore = textBefore.split('\n');
      const line = linesBefore.length;
      const column = linesBefore[linesBefore.length - 1].length + 1;
      setCursor({line, column});
    }
  };

  // Simulate code suggestions based on language
  useEffect(() => {
    const generateSuggestions = () => {
      // This would be much more sophisticated in a real editor
      // Just a simple demonstration
      switch (language) {
        case 'javascript':
          return ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'console.log', 'import', 'export', 'class', 'async', 'await'];
        case 'python':
          return ['def', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'from', 'print', 'try', 'except', 'finally', 'with', 'as'];
        case 'java':
          return ['public', 'private', 'class', 'void', 'int', 'String', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'throws', 'new'];
        case 'typescript':
          return ['interface', 'type', 'const', 'let', 'function', 'class', 'export', 'import', 'from', 'extends', 'implements', 'async', 'await', 'string', 'number', 'boolean'];
        default:
          return [];
      }
    };

    setSuggestions(generateSuggestions());
  }, [language]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Run code with Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onRun();
        return;
      }
      
      // Save with Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
        return;
      }

      // Copy with Ctrl+C or Cmd+C when there's a selection
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selection) {
        // The browser handles the copy, we just show a visual indicator
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
        return;
      }
      
      // Toggle fullscreen with F11
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      
      // Handle tab key for indentation in the textarea
      if (e.key === 'Tab' && document.activeElement === textareaRef.current) {
        e.preventDefault();
        const start = textareaRef.current?.selectionStart || 0;
        const end = textareaRef.current?.selectionEnd || 0;
        
        if (start === end) {
          // Simple tab insertion
          const spaces = ' '.repeat(tabSize);
          const newCode = code.substring(0, start) + spaces + code.substring(end);
          onChange(newCode);
          
          // Move cursor after the inserted tab
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tabSize;
            }
          }, 0);
        } else {
          // Tab for selected lines (indentation)
          const selectedText = code.substring(start, end);
          const lines = selectedText.split('\n');
          const spaces = ' '.repeat(tabSize);
          
          // Add indentation to each line
          const newSelectedText = lines.map(line => spaces + line).join('\n');
          const newCode = code.substring(0, start) + newSelectedText + code.substring(end);
          onChange(newCode);
          
          // Maintain selection after indentation
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = start;
              textareaRef.current.selectionEnd = start + newSelectedText.length;
            }
          }, 0);
        }
      }
      
      // Handle brackets auto-closing
      if (bracketPairColorization && ['(', '[', '{', '"', "'"].includes(e.key) && document.activeElement === textareaRef.current) {
        const start = textareaRef.current?.selectionStart || 0;
        const closingMap: Record<string, string> = {
          '(': ')',
          '[': ']',
          '{': '}',
          '"': '"',
          "'": "'"
        };
        
        // Only auto-close if we're not inside a string/comment (simplified)
        // A real editor would have more sophisticated parsing
        const closingChar = closingMap[e.key];
        const newCode = code.substring(0, start) + e.key + closingChar + code.substring(start);
        
        // Insert the opening and closing brackets
        e.preventDefault();
        onChange(newCode);
        
        // Position cursor between the brackets
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
      }
      
      // Show code suggestions with Ctrl+Space
      if ((e.ctrlKey) && e.key === ' ' && document.activeElement === textareaRef.current) {
        e.preventDefault();
        setShowSuggestions(true);
        return;
      }
      
      // Handle suggestion selection
      if (showSuggestions) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedSuggestion(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault();
          insertSuggestion(suggestions[selectedSuggestion]);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setShowSuggestions(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, onRun, onChange, tabSize, bracketPairColorization, selection, onSave, suggestions, selectedSuggestion, showSuggestions]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Focus back on the editor after toggling
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };
  
  // Insert selected suggestion into code
  const insertSuggestion = (suggestion: string) => {
    if (textareaRef.current) {
      const pos = textareaRef.current.selectionStart;
      const newCode = code.substring(0, pos) + suggestion + code.substring(pos);
      onChange(newCode);
      
      // Position cursor after the inserted suggestion
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = pos + suggestion.length;
        }
      }, 0);
      
      setShowSuggestions(false);
    }
  };
  
  // Syntax highlighting function (simplified)
  const highlightSyntax = (code: string, language: string): string => {
    if (!code) return '';
    
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Basic syntax highlighting for demo purposes
    // In a real editor, you'd use a robust syntax highlighting library like Prism.js or highlight.js
    if (language === 'javascript' || language === 'typescript') {
      // Keywords
      highlighted = highlighted.replace(
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this|super)\b/g,
        '<span class="keyword">$1</span>'
      );
      
      // Strings
      highlighted = highlighted.replace(
        /(["'`])(.*?)\1/g,
        '<span class="string">$1$2$1</span>'
      );
      
      // Numbers
      highlighted = highlighted.replace(
        /\b(\d+)\b/g,
        '<span class="number">$1</span>'
      );
      
      // Comments
      highlighted = highlighted.replace(
        /(\/\/.*)/g,
        '<span class="comment">$1</span>'
      );
      
      // Function calls
      highlighted = highlighted.replace(
        /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\(/g,
        '<span class="function">$1</span>('
      );
    } else if (language === 'python') {
      // Keywords
      highlighted = highlighted.replace(
        /\b(def|class|if|else|elif|for|while|import|from|return|try|except|raise|with|as)\b/g,
        '<span class="keyword">$1</span>'
      );
      
      // Strings
      highlighted = highlighted.replace(
        /(["'`])(.*?)\1/g,
        '<span class="string">$1$2$1</span>'
      );
      
      // Numbers
      highlighted = highlighted.replace(
        /\b(\d+)\b/g,
        '<span class="number">$1</span>'
      );
      
      // Comments
      highlighted = highlighted.replace(
        /(#.*)/g,
        '<span class="comment">$1</span>'
      );
      
      // Function calls
      highlighted = highlighted.replace(
        /\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g,
        '<span class="function">$1</span>('
      );
    }
    
    return highlighted;
  };
  
  // Render minimap content (simplified)
  const renderMinimap = () => {
    if (!showMinimap || !code) return null;
    
    const lines = code.split('\n');
    const totalLines = lines.length;
    const visibleLines = Math.floor(editorRef.current?.clientHeight || 0 / (fontSize * 1.5));
    const scale = 0.2; // Scale factor for minimap
    
    return (
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-[60px] overflow-hidden opacity-50 pointer-events-none",
          theme === 'dark' ? 'bg-[#1a1c1e]' : 'bg-[#f5f5f5]'
        )}
      >
        <div 
          style={{ 
            fontSize: `${fontSize * scale}px`, 
            lineHeight: `${fontSize * scale * 1.5}px`,
            fontFamily
          }} 
          className="w-full h-full text-gray-400 whitespace-pre"
          dangerouslySetInnerHTML={{ 
            __html: lines.map(line => line.substring(0, 100) || ' ').join('\n') 
          }}
        />
        
        {/* Viewport indicator */}
        <div 
          className={cn(
            "absolute right-0 w-1",
            theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#c0c0c0]'
          )}
          style={{ 
            top: `${(cursor.line - 1) / totalLines * 100}%`,
            height: `${Math.min(visibleLines / totalLines * 100, 100)}%`
          }}
        />
      </div>
    );
  };

  return (
    <div 
      ref={editorRef}
      className={cn(
        "relative flex flex-col",
        isFullscreen ? "fixed inset-0 z-50" : "h-full",
        theme === 'dark' ? 'bg-[#1a1c1e]' : 'bg-white'
      )}
    >
      {/* VS Code-like header */}
      <div className={cn(
        "flex items-center justify-between px-2 py-1 border-b",
        theme === 'dark' ? 'bg-[#1a1c1e] border-[#2d2d2d]' : 'bg-[#f3f3f3] border-[#e0e0e0]'
      )}>
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          {/* File tabs */}
          <div className="flex ml-2 text-xs">
            {files.map(file => (
              <button
                key={file.id}
                onClick={() => setActiveFile(file.id)}
                className={cn(
                  "px-3 py-1 flex items-center gap-1 border-r group relative",
                  file.id === activeFile 
                    ? theme === 'dark' 
                      ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' 
                      : 'bg-white text-black border-t-2 border-t-blue-500'
                    : theme === 'dark'
                      ? 'bg-[#252526] text-gray-400 hover:bg-[#2d2d2d]' 
                      : 'bg-[#ececec] text-gray-700 hover:bg-[#e5e5e5]',
                  theme === 'dark' ? 'border-[#2d2d2d]' : 'border-[#e0e0e0]'
                )}
                aria-label={`Open ${file.name}`}
                title={file.name}
              >
                {file.name}
                <button 
                  className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-0.5 rounded-sm",
                    theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle closing tab logic here
                  }}
                  aria-label={`Close ${file.name}`}
                  title="Close"
                >
                  <X className="h-3 w-3" />
                </button>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleFullscreen} 
            className={cn(
              "p-1 rounded-sm transition-colors duration-200",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e8e8e8]'
            )}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      {/* Main editor content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left sidebar - file explorer */}
        <div className={cn(
          "w-10 flex flex-col items-center pt-2 border-r",
          theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-[#f3f3f3] border-[#e0e0e0]'
        )}>
          <button 
            className={cn(
              "p-2 rounded-sm mb-2 transition-colors duration-200",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            aria-label="Explorer"
            title="Explorer"
          >
            <Layers className="h-5 w-5" />
          </button>
          <button 
            className={cn(
              "p-2 rounded-sm mb-2 transition-colors duration-200",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            aria-label="Source Control"
            title="Source Control"
          >
            <GitBranch className="h-5 w-5" />
          </button>
          <button 
            className={cn(
              "p-2 rounded-sm mb-2 transition-colors duration-200",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]'
            )}
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            className={cn(
              "p-2 rounded-sm mb-2 transition-colors duration-200",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e1e1e1]',
              bracketPairColorization ? 'text-blue-500' : ''
            )}
            aria-label={bracketPairColorization ? "Disable bracket pair colorization" : "Enable bracket pair colorization"}
            title={bracketPairColorization ? "Disable bracket pair colorization" : "Enable bracket pair colorization"}
            onClick={() => {}}
          >
            <Braces className="h-5 w-5" />
          </button>
        </div>
        
        {/* Editor main content */}
        <div className={cn(
          "flex-grow flex relative",
          smoothScrolling ? 'scroll-smooth' : ''
        )}>
          {/* Line numbers */}
          {lineNumbers && (
            <div className={cn(
              "p-4 text-xs font-mono text-right pr-2 pt-4 select-none",
              theme === 'dark' ? 'bg-[#1e1e1e] text-gray-500' : 'bg-[#f5f5f5] text-gray-500'
            )}>
              {lineNumbersArray.map((num, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "leading-6",
                    cursor.line === i + 1 ? 'text-white font-medium' : ''
                  )}
                >
                  {num}
                </div>
              ))}
            </div>
          )}
          
          {/* Highlighted code display */}
          <div 
            className={cn(
              "absolute inset-0 py-3 px-4 overflow-hidden pointer-events-none",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            )}
            style={{ 
              fontFamily,
              fontSize,
              lineHeight: `${fontSize * 1.5}px`,
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              tabSize: tabSize
            }}
            dangerouslySetInnerHTML={{ __html: highlightedCode || code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>') }}
          />
          
          {/* Textarea for editing */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleSelect}
            spellCheck={false}
            aria-label="Code editor textarea"
            className={cn(
              "absolute inset-0 py-3 px-4 outline-none resize-none overflow-auto w-full h-full bg-transparent caret-blue-500",
              theme === 'dark' ? 'text-transparent' : 'text-transparent',
              wordWrap ? '' : 'whitespace-nowrap'
            )}
            style={{ 
              fontFamily,
              fontSize,
              lineHeight: `${fontSize * 1.5}px`,
              tabSize: tabSize,
              caretColor: theme === 'dark' ? 'white' : 'black'
            }}
          />
          
          {/* Code suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              className={cn(
                "absolute z-10 max-h-64 overflow-y-auto rounded-md shadow-lg",
                theme === 'dark' ? 'bg-[#252526] border border-[#3d3d3d]' : 'bg-white border border-[#e0e0e0]'
              )}
              style={{ 
                top: `${(cursor.line * fontSize * 1.5) + fontSize}px`,
                left: `${cursor.column * (fontSize * 0.6)}px`
              }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => insertSuggestion(suggestion)}
                  className={cn(
                    "px-3 py-1 cursor-pointer flex items-center",
                    index === selectedSuggestion
                      ? theme === 'dark' ? 'bg-[#04395e]' : 'bg-[#cce5ff]'
                      : theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#f0f0f0]'
                  )}
                >
                  <div className="mr-2">
                    {suggestion.startsWith('function') || suggestion.startsWith('def') ? (
                      <span className="text-purple-500">ƒ</span>
                    ) : suggestion.startsWith('class') ? (
                      <span className="text-yellow-500">C</span>
                    ) : suggestion.startsWith('const') || suggestion.startsWith('let') || suggestion.startsWith('var') ? (
                      <span className="text-blue-500">v</span>
                    ) : (
                      <span className="text-green-500">K</span>
                    )}
                  </div>
                  <span className="font-medium">{suggestion}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Minimap */}
          {renderMinimap()}
        </div>
      </div>
      
      {/* Bottom status bar */}
      <div className={cn(
        "flex justify-between items-center px-4 py-1 text-xs",
        theme === 'dark' ? 'bg-[#007acc] text-white' : 'bg-[#0066b8] text-white'
      )}>
        <div className="flex items-center gap-4">
          <span>{language.toUpperCase()}</span>
          <span>Ln {cursor.line}, Col {cursor.column}</span>
          <span>Spaces: {tabSize}</span>
          <span>UTF-8</span>
          <span>{wordWrap ? 'Word Wrap: On' : 'Word Wrap: Off'}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-1 hover:underline" 
            aria-label="Git branch: main" 
            title="Git branch: main"
          >
            <GitBranch className="h-3 w-3" />
            <span>main</span>
          </button>
          
          <button 
            className="flex items-center gap-1 hover:underline" 
            aria-label="Sync changes" 
            title="Sync changes"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Sync</span>
          </button>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-12 right-4 flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRun}
          disabled={running}
          className={cn(
            "px-4 py-2 rounded-md flex items-center transition-colors duration-200",
            running 
            ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
            : theme === 'dark'
              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
          )}
          aria-label={running ? "Running code..." : "Run code"}
          title={running ? "Running code... (Ctrl+Enter)" : "Run code (Ctrl+Enter)"}
        >
          {running ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-1" />
          )}
          {running ? 'Running...' : 'Run'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDownload}
          className={cn(
            "p-2 rounded-md transition-colors duration-200",
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
          )}
          aria-label="Download code"
          title="Download code"
        >
          <Download className="h-4 w-4" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          className={cn(
            "p-2 rounded-md transition-colors duration-200",
            theme === 'dark' 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
          )}
          aria-label="Save code"
          title="Save code (Ctrl+S)"
        >
          <Save className="h-4 w-4" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyCode}
          className={cn(
            "p-2 rounded-md transition-colors duration-200",
            theme === 'dark' 
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
          )}
          aria-label="Copy code"
          title="Copy code"
        >
          <Copy className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
} 