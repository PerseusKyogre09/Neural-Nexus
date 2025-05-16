"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Copy, Download, Trash, XCircle, Terminal, Settings, Menu } from 'lucide-react';
import ModelExplorer from './ModelExplorer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PlaygroundPage() {
  const [code, setCode] = useState('// Drop your code here or select a model to get started...');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [showTerminal, setShowTerminal] = useState(false);
  const [running, setRunning] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [theme, setTheme] = useState('dark');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const models = [
    { id: 'neural-nexus-js', language: 'javascript' },
    { id: 'neural-nexus-py', language: 'python' },
    { id: 'neural-nexus-java', language: 'java' },
    // More models would be loaded from API in a real app
  ];

  const exampleCodes = {
    javascript: `// Neural JS Example
const calculateFactorial = (n) => {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * calculateFactorial(n - 1);
};

// Let's test our function
for (let i = 0; i < 10; i++) {
  console.log(\`Factorial of \${i} is \${calculateFactorial(i)}\`);
}`,
    python: `# Neural Python Example
def calculate_factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * calculate_factorial(n - 1)

# Let's test our function
for i in range(10):
    print(f"Factorial of {i} is {calculate_factorial(i)}")`,
    java: `// Neural Java Example
public class FactorialCalculator {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.println("Factorial of " + i + " is " + calculateFactorial(i));
        }
    }
    
    public static long calculateFactorial(int n) {
        if (n == 0 || n == 1) {
            return 1;
        }
        return n * calculateFactorial(n - 1);
    }
}`
  };

  // Select a model and load example code for that model's language
  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    const selectedModelData = models.find(model => model.id === modelId);
    if (selectedModelData && exampleCodes[selectedModelData.language as keyof typeof exampleCodes]) {
      setCode(exampleCodes[selectedModelData.language as keyof typeof exampleCodes]);
    }
    setActiveTab('editor');
  };

  // Simulate running code (in a real app, this would send code to a backend)
  const runCode = () => {
    if (!selectedModel) {
      setOutput('⚠️ Please select a model first');
      setShowTerminal(true);
      return;
    }
    
    setRunning(true);
    setOutput('Running code...');
    setShowTerminal(true);
    
    // Simulate processing time
    setTimeout(() => {
      const selectedModelData = models.find(model => model.id === selectedModel);
      let simulatedOutput = '';
      
      if (selectedModelData?.language === 'javascript') {
        simulatedOutput = `Factorial of 0 is 1
Factorial of 1 is 1
Factorial of 2 is 2
Factorial of 3 is 6
Factorial of 4 is 24
Factorial of 5 is 120
Factorial of 6 is 720
Factorial of 7 is 5040
Factorial of 8 is 40320
Factorial of 9 is 362880

✅ Code executed successfully in 0.24s`;
      } else if (selectedModelData?.language === 'python') {
        simulatedOutput = `Factorial of 0 is 1
Factorial of 1 is 1
Factorial of 2 is 2
Factorial of 3 is 6
Factorial of 4 is 24
Factorial of 5 is 120
Factorial of 6 is 720
Factorial of 7 is 5040
Factorial of 8 is 40320
Factorial of 9 is 362880

✅ Code executed successfully in 0.31s`;
      } else {
        simulatedOutput = `Factorial of 0 is 1
Factorial of 1 is 1
Factorial of 2 is 2
Factorial of 3 is 6
Factorial of 4 is 24
Factorial of 5 is 120
Factorial of 6 is 720
Factorial of 7 is 5040
Factorial of 8 is 40320
Factorial of 9 is 362880

✅ Code executed successfully in 0.57s`;
      }
      
      setOutput(simulatedOutput);
      setRunning(false);
    }, 1500);
  };

  // Load example code
  const loadExample = () => {
    const selectedModelData = models.find(model => model.id === selectedModel);
    if (selectedModelData && exampleCodes[selectedModelData.language as keyof typeof exampleCodes]) {
      setCode(exampleCodes[selectedModelData.language as keyof typeof exampleCodes]);
    } else {
      setCode('// Please select a model first to load an example');
    }
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  // Clear code
  const clearCode = () => {
    setCode('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Download code
  const downloadCode = () => {
    const selectedModelData = models.find(model => model.id === selectedModel);
    let extension = '.txt';
    
    if (selectedModelData) {
      if (selectedModelData.language === 'javascript') extension = '.js';
      else if (selectedModelData.language === 'python') extension = '.py';
      else if (selectedModelData.language === 'java') extension = '.java';
    }
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neural-nexus-code${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Run code with Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      
      // Handle tab key for indentation in the textarea
      if (e.key === 'Tab' && document.activeElement === textareaRef.current) {
        e.preventDefault();
        const start = textareaRef.current?.selectionStart || 0;
        const end = textareaRef.current?.selectionEnd || 0;
        
        // Insert tab at cursor position
        const newCode = code.substring(0, start) + '  ' + code.substring(end);
        setCode(newCode);
        
        // Move cursor after the inserted tab
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
          }
        }, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, runCode]);

  // JSX for the editor area
  const EditorArea = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-700 p-2">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${activeTab === 'editor' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${activeTab === 'models' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('models')}
          >
            Models
          </button>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={copyCode}
            className="p-1 text-gray-400 hover:text-white rounded"
            aria-label="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={clearCode}
            className="p-1 text-gray-400 hover:text-white rounded"
            aria-label="Clear code"
          >
            <Trash className="h-4 w-4" />
          </button>
          <button
            onClick={downloadCode}
            className="p-1 text-gray-400 hover:text-white rounded"
            aria-label="Download code"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center p-1 text-gray-400 hover:text-white rounded"
          >
            <Settings className="h-4 w-4" />
            <span className="ml-1 text-xs hidden sm:inline">
              {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            </span>
          </button>
        </div>
      </div>
      
      {activeTab === 'editor' ? (
        <div className="relative flex-grow">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`w-full h-full p-4 resize-none focus:outline-none font-mono text-sm ${
              theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'
            }`}
            style={{ minHeight: "300px" }}
            aria-label="Code editor"
          />
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={runCode}
              disabled={running}
              className={`px-4 py-2 rounded-md flex items-center ${
                running 
                ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
              aria-label="Run code"
            >
              <Play className="h-4 w-4 mr-1" />
              {running ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              aria-label="Toggle terminal"
            >
              <Terminal className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-auto">
          <ModelExplorer onSelectModel={handleSelectModel} />
        </div>
      )}
      
      {showTerminal && (
        <div className={`border-t border-gray-700 ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
          <div className="flex justify-between items-center p-2 border-b border-gray-700">
            <h3 className="text-sm font-medium">Terminal Output</h3>
            <button
              onClick={() => setShowTerminal(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close terminal"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
          <pre className={`p-4 font-mono text-sm overflow-auto ${
            theme === 'dark' ? 'text-green-400' : 'text-green-700'
          }`} style={{ maxHeight: "200px" }}>
            {output || 'Terminal ready. Run code to see output.'}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-grow flex flex-col pt-16 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <main className="flex-grow flex overflow-hidden p-4">
          <div className="container mx-auto">
            <div className={`border border-gray-700 rounded-lg overflow-hidden shadow-lg h-[80vh] ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              {EditorArea}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
} 