"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, RefreshCw, ExternalLink, Code, Eye, EyeOff, Smartphone, Tablet, Monitor, DownloadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewWindowProps {
  theme: string;
  code: string;
  language: string;
  onClose: () => void;
}

export default function PreviewWindow({ theme, code, language, onClose }: PreviewWindowProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Function to generate preview HTML
  const generatePreviewHTML = () => {
    let previewHTML = '';
    
    // Handle different languages
    if (language === 'html' || language === 'xml') {
      // Raw HTML
      previewHTML = code;
    } else if (language === 'markdown' || language === 'md') {
      // Convert markdown to HTML (simplified)
      previewHTML = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; padding: 20px;">
          ${code
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
            .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
            .replace(/`(.*?)`/gim, '<code>$1</code>')
            .replace(/^\s*?\n\s*?\*\s(.*$)/gim, '<ul><li>$1</li></ul>')
            .replace(/^\s*?\n\s*?[0-9]+\.\s(.*$)/gim, '<ol><li>$1</li></ol>')
            .replace(/^\s*?\n\s*?---\s*?\n/gim, '<hr />')
            .replace(/\n/gim, '<br />')}
        </div>
      `;
    } else if (language === 'javascript' || language === 'js') {
      // JavaScript execution in a sandbox
      previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>JS Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
              background-color: ${theme === 'dark' ? '#1e1e1e' : '#fff'};
            }
            .output {
              border: 1px solid ${theme === 'dark' ? '#3d3d3d' : '#e0e0e0'};
              padding: 15px;
              border-radius: 4px;
              margin-top: 10px;
              white-space: pre-wrap;
              font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
            }
            .error {
              color: #e53935;
            }
          </style>
        </head>
        <body>
          <h3>JavaScript Output:</h3>
          <div id="output" class="output"></div>
          
          <script>
            // Capture console output
            const output = document.getElementById('output');
            const originalConsole = window.console;
            
            window.console = {
              log: function(...args) {
                originalConsole.log(...args);
                const line = document.createElement('div');
                line.textContent = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                output.appendChild(line);
              },
              error: function(...args) {
                originalConsole.error(...args);
                const line = document.createElement('div');
                line.className = 'error';
                line.textContent = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                output.appendChild(line);
              },
              warn: function(...args) {
                originalConsole.warn(...args);
                const line = document.createElement('div');
                line.style.color = '#ff9800';
                line.textContent = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                output.appendChild(line);
              },
              info: function(...args) {
                originalConsole.info(...args);
                const line = document.createElement('div');
                line.style.color = '#2196f3';
                line.textContent = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                output.appendChild(line);
              }
            };
            
            // Execute the code
            try {
              ${code}
            } catch (error) {
              console.error('Error: ' + error.message);
            }
          </script>
        </body>
        </html>
      `;
    } else if (language === 'css') {
      // CSS preview with a demo HTML structure
      previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CSS Preview</title>
          <style>
            /* Reset styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            /* Demo container */
            .container {
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            
            /* User CSS */
            ${code}
          </style>
        </head>
        <body>
          <div class="container">
            <h1>CSS Preview</h1>
            <p>This is a paragraph to demonstrate text styling.</p>
            
            <div class="demo-elements">
              <h2>Demo Elements</h2>
              <button class="button">Button</button>
              <div class="box">Box Element</div>
              <ul>
                <li>List Item 1</li>
                <li>List Item 2</li>
                <li>List Item 3</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (language === 'jsx' || language === 'tsx') {
      // React preview (simplified, would need Babel in a real implementation)
      previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Preview</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
              background-color: ${theme === 'dark' ? '#1e1e1e' : '#fff'};
            }
            #error {
              color: #e53935;
              padding: 10px;
              border: 1px solid #e53935;
              border-radius: 4px;
              margin-top: 10px;
              display: none;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <div id="error"></div>
          
          <script type="text/babel">
            try {
              ${code}
              
              // Default render if no explicit ReactDOM.render call is found
              if (!${code.includes('ReactDOM.render') || code.includes('createRoot')}) {
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(<App />);
              }
            } catch (error) {
              document.getElementById('error').style.display = 'block';
              document.getElementById('error').textContent = 'Error: ' + error.message;
            }
          </script>
        </body>
        </html>
      `;
    } else if (language === 'json') {
      // JSON viewer
      previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>JSON Preview</title>
          <style>
            body {
              font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
              padding: 20px;
              color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
              background-color: ${theme === 'dark' ? '#1e1e1e' : '#fff'};
            }
            pre {
              white-space: pre-wrap;
            }
            .string { color: #7ec699; }
            .number { color: #f78c6c; }
            .boolean { color: #ff9cac; }
            .null { color: #ff9cac; }
            .key { color: #82aaff; }
          </style>
        </head>
        <body>
          <pre id="json"></pre>
          <script>
            try {
              const obj = ${code};
              const formatted = JSON.stringify(obj, null, 2);
              
              // Syntax highlighting
              document.getElementById('json').innerHTML = formatted
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\\s*:)?|\\b(true|false|null)\\b|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?)/g, function (match) {
                  let cls = 'number';
                  if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                      cls = 'key';
                    } else {
                      cls = 'string';
                    }
                  } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                  } else if (/null/.test(match)) {
                    cls = 'null';
                  }
                  return '<span class="' + cls + '">' + match + '</span>';
                });
            } catch (error) {
              document.body.innerHTML = '<div style="color: #e53935; padding: 20px;">Invalid JSON: ' + error.message + '</div>';
            }
          </script>
        </body>
        </html>
      `;
    } else {
      // Default text display for unsupported languages
      previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            body {
              font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
              padding: 20px;
              white-space: pre-wrap;
              color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
              background-color: ${theme === 'dark' ? '#1e1e1e' : '#fff'};
            }
          </style>
        </head>
        <body>
          ${code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </body>
        </html>
      `;
    }
    
    return previewHTML;
  };
  
  // Refresh preview
  const refreshPreview = () => {
    if (!iframeRef.current) return;
    
    setIsLoading(true);
    
    const previewHTML = generatePreviewHTML();
    
    // Use srcdoc for safety
    iframeRef.current.srcdoc = previewHTML;
    
    iframeRef.current.onload = () => {
      setIsLoading(false);
    };
  };
  
  // Initial load and refresh when code or language changes
  useEffect(() => {
    refreshPreview();
  }, [code, language, theme]);
  
  // Get preview width based on view mode
  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div className={cn(
      "flex flex-col h-full",
      isFullscreen ? "fixed inset-0 z-50 bg-black" : ""
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-3 border-b",
        theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
      )}>
        <div className="flex items-center">
          <Eye className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-base font-semibold">Preview</h2>
        </div>
        
        <div className="flex items-center">
          {/* View mode toggles */}
          <div className="flex items-center mr-2 border rounded overflow-hidden">
            <button
              onClick={() => setViewMode('mobile')}
              className={cn(
                "p-1",
                viewMode === 'mobile' 
                  ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#e0e0e0]'
                  : theme === 'dark' ? 'bg-[#252526]' : 'bg-white',
                theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
              )}
              aria-label="Mobile view"
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setViewMode('tablet')}
              className={cn(
                "p-1 border-l border-r",
                viewMode === 'tablet' 
                  ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#e0e0e0]'
                  : theme === 'dark' ? 'bg-[#252526]' : 'bg-white',
                theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
              )}
              aria-label="Tablet view"
              title="Tablet view"
            >
              <Tablet className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setViewMode('desktop')}
              className={cn(
                "p-1",
                viewMode === 'desktop' 
                  ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#e0e0e0]'
                  : theme === 'dark' ? 'bg-[#252526]' : 'bg-white',
                theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
              )}
              aria-label="Desktop view"
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>
          
          {/* Toggle code view */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={cn(
              "p-1 rounded mr-2",
              showCode
                ? theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#e0e0e0]'
                : theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
            )}
            aria-label={showCode ? "Hide code" : "Show code"}
            title={showCode ? "Hide code" : "Show code"}
          >
            {showCode ? <EyeOff className="h-4 w-4" /> : <Code className="h-4 w-4" />}
          </button>
          
          {/* Refresh button */}
          <button
            onClick={refreshPreview}
            className={cn(
              "p-1 rounded mr-2",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
            )}
            aria-label="Refresh preview"
            title="Refresh preview"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </button>
          
          {/* Open in new window button */}
          <button
            onClick={() => {
              const previewWindow = window.open('', '_blank');
              if (previewWindow) {
                previewWindow.document.write(generatePreviewHTML());
                previewWindow.document.close();
              }
            }}
            className={cn(
              "p-1 rounded mr-2",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
            )}
            aria-label="Open in new window"
            title="Open in new window"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          
          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className={cn(
              "p-1 rounded mr-2",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
            )}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className={cn(
              "p-1 rounded",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
            )}
            aria-label="Close preview"
            title="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {showCode && (
          <div className={cn(
            "border-b p-3 font-mono text-xs overflow-auto whitespace-pre max-h-[200px]",
            theme === 'dark' ? 'bg-[#1e1e1e] border-[#3d3d3d]' : 'bg-[#f5f5f5] border-[#e0e0e0]'
          )}>
            {code}
          </div>
        )}
        
        <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-800">
          <div className={cn(
            getPreviewWidth(),
            "h-full relative transition-all duration-300 mx-auto bg-white shadow-xl overflow-hidden"
          )}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
} 