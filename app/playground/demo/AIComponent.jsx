import React, { useState, useEffect, useCallback } from 'react';
import { getAICompletionWithCache, ModelTypes } from './main.js';
import { formatCodeSnippets, extractCodeFromResponse, estimateTokenCount } from './utils.js';

/**
 * AI-powered code assistant component
 * Provides real-time code suggestions and transformations
 */
const AICodeAssistant = ({ code, language, onApplySuggestion }) => {
  // State for the component
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(ModelTypes.DEEPSEEK_CODER);
  const [tokenCount, setTokenCount] = useState(0);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('suggest'); // 'suggest', 'explain', 'refactor'
  
  // Debounce function to avoid too frequent API calls
  const debounce = (func, delay) => {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  // Debounced version of the code analyzer
  const debouncedAnalyzeCode = useCallback(
    debounce((codeToAnalyze, lang, mode) => {
      analyzeCode(codeToAnalyze, lang, mode);
    }, 1000),
    [selectedModel]
  );
  
  // Effect to trigger code analysis when code changes
  useEffect(() => {
    if (code && code.trim().length > 10) {
      setTokenCount(estimateTokenCount(code));
      debouncedAnalyzeCode(code, language, mode);
    } else {
      setSuggestion('');
    }
  }, [code, language, mode, debouncedAnalyzeCode]);
  
  // Main function to analyze code and get AI suggestions
  const analyzeCode = async (codeSnippet, lang, currentMode) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create different prompts based on the mode
      let prompt;
      
      switch (currentMode) {
        case 'explain':
          prompt = `Explain this ${lang} code in clear terms: \n\n\`\`\`${lang}\n${codeSnippet}\n\`\`\``;
          break;
        case 'refactor':
          prompt = `Refactor this ${lang} code to improve its quality and efficiency: \n\n\`\`\`${lang}\n${codeSnippet}\n\`\`\``;
          break;
        case 'suggest':
        default:
          prompt = `Suggest improvements or next steps for this ${lang} code: \n\n\`\`\`${lang}\n${codeSnippet}\n\`\`\``;
          break;
      }
      
      // Get AI response
      const response = await getAICompletionWithCache(prompt, selectedModel);
      
      if (response.status === 'error') {
        throw new Error(response.error);
      }
      
      // Format the suggestion with code highlighting
      const formattedSuggestion = formatCodeSnippets(response.result);
      setSuggestion(formattedSuggestion);
      
    } catch (err) {
      console.error('Error analyzing code:', err);
      setError(err.message);
      setSuggestion('');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to apply the AI suggestion to the code
  const applySuggestion = () => {
    const extractedCode = extractCodeFromResponse(suggestion);
    if (extractedCode && onApplySuggestion) {
      onApplySuggestion(extractedCode);
    }
  };
  
  // Render the component
  return (
    <div className="ai-code-assistant">
      <div className="assistant-header">
        <h3 className="assistant-title">Neural Nexus AI Assistant</h3>
        
        <div className="model-selector">
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-dropdown"
          >
            <option value={ModelTypes.DEEPSEEK_CODER}>DeepSeek Coder</option>
            <option value={ModelTypes.LLAMA3}>Llama 3</option>
            <option value={ModelTypes.MISTRAL}>Mistral</option>
          </select>
        </div>
      </div>
      
      <div className="mode-tabs">
        <button 
          className={`mode-tab ${mode === 'suggest' ? 'active' : ''}`}
          onClick={() => setMode('suggest')}
        >
          Suggest
        </button>
        <button 
          className={`mode-tab ${mode === 'explain' ? 'active' : ''}`}
          onClick={() => setMode('explain')}
        >
          Explain
        </button>
        <button 
          className={`mode-tab ${mode === 'refactor' ? 'active' : ''}`}
          onClick={() => setMode('refactor')}
        >
          Refactor
        </button>
      </div>
      
      <div className="suggestion-container">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Neural Nexus is analyzing your code...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        ) : suggestion ? (
          <>
            <div 
              className="suggestion-content"
              dangerouslySetInnerHTML={{ __html: suggestion }}
            />
            
            <div className="suggestion-actions">
              <button 
                className="apply-button"
                onClick={applySuggestion}
                disabled={!extractCodeFromResponse(suggestion)}
              >
                Apply Suggestion
              </button>
              
              <div className="token-counter">
                {tokenCount} tokens analyzed
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>Type some code to get AI-powered suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICodeAssistant; 