// utils.js - Helper functions for Neural Nexus API interactions

/**
 * Processes user input before sending to Neural Nexus API
 * @param {string} input - The raw user input to process
 * @returns {string} - The processed input ready for AI consumption
 */
export function processUserInput(input) {
  // Trim whitespace and normalize
  let processed = input.trim().replace(/\s+/g, ' ');
  
  // Add a standard prefix for better AI responses
  processed = `Neural Nexus AI Assistant: ${processed}`;
  
  // Remove any potentially harmful instructions
  processed = processed.replace(/ignore previous instructions/gi, '[instruction removed]');
  
  return processed;
}

/**
 * Filters potentially toxic content from AI responses
 * @param {string} aiResponse - The raw AI response
 * @returns {string} - The filtered response
 */
export function filterResponse(aiResponse) {
  // List of prohibited terms (simplified for demo)
  const prohibitedTerms = [
    'harmful content',
    'offensive language',
    'inappropriate'
  ];
  
  // Check if response contains prohibited terms
  const containsProhibited = prohibitedTerms.some(term => 
    aiResponse.toLowerCase().includes(term.toLowerCase())
  );
  
  if (containsProhibited) {
    return "This response was filtered due to potentially inappropriate content.";
  }
  
  return aiResponse;
}

/**
 * Calculates token usage estimation
 * @param {string} text - The text to estimate token count for
 * @returns {number} - Estimated token count
 */
export function estimateTokenCount(text) {
  // Very rough estimation: average of 4 chars per token
  return Math.ceil(text.length / 4);
}

/**
 * Formats code snippets in the response
 * @param {string} text - Text potentially containing code blocks
 * @returns {string} - Formatted text with proper code highlighting
 */
export function formatCodeSnippets(text) {
  // Regex to find code blocks between triple backticks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  
  // Replace code blocks with formatted versions
  return text.replace(codeBlockRegex, (match, language, code) => {
    // Here we'd apply syntax highlighting
    // This is simplified for the demo
    return `<pre class="code-block ${language || ''}">
${code}
</pre>`;
  });
}

/**
 * Generates a unique request ID for tracking
 * @returns {string} - A unique identifier
 */
export function generateRequestId() {
  return 'req_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Extracts code from AI responses
 * @param {string} response - Full AI response
 * @returns {string|null} - Extracted code or null if none found
 */
export function extractCodeFromResponse(response) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
  const match = response.match(codeBlockRegex);
  
  if (match && match[2]) {
    return match[2].trim();
  }
  
  return null;
}

// Export a helper object with common prompts
export const commonPrompts = {
  EXPLAIN_CODE: "Explain what this code does: ",
  REFACTOR: "Refactor this code to improve performance: ",
  FIX_BUGS: "Fix bugs in this code: ",
  DOCUMENT: "Add documentation to this code: ",
  OPTIMIZE: "Optimize this code for better performance: "
};

// Export default configuration
export const DEFAULT_CONFIG = {
  temperature: 0.7,
  maxTokens: 1000,
  topP: 0.9,
  frequencyPenalty: 0.5,
  presencePenalty: 0.5
}; 