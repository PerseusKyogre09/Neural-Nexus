// main.js - Neural Nexus Demo
// This file demonstrates modern JavaScript features with Neural Nexus API integration

// Imports
import { NeuralNexus, ModelTypes } from '@neural-nexus/sdk';
import { processUserInput } from './utils.js';

// Initialize the Neural Nexus client with API key
const nn = new NeuralNexus({
  apiKey: process.env.NEURAL_NEXUS_API_KEY,
  maxTokens: 2048,
  temperature: 0.7,
});

// Define async function to get AI completions
async function generateAIResponse(userPrompt, modelPreference = ModelTypes.DEEPSEEK_CODER) {
  try {
    // Log the start of processing
    console.log(`🧠 Processing prompt with ${modelPreference} model...`);
    
    // Pre-process the user input
    const processedInput = processUserInput(userPrompt);
    
    // Get AI completion from Neural Nexus
    const response = await nn.complete({
      prompt: processedInput,
      model: modelPreference,
      maxTokens: 1000,
      stopSequences: ["\n\n"]
    });
    
    // Extract and format the response
    const aiOutput = response.choices[0].text.trim();
    
    // Return processed output
    return {
      status: "success",
      result: aiOutput,
      tokens: response.usage.totalTokens,
      model: modelPreference
    };
  } catch (error) {
    console.error("❌ Neural Nexus API Error:", error.message);
    return {
      status: "error",
      error: error.message,
      model: modelPreference
    };
  }
}

// Cache to store previous responses
const responseCache = new Map();

// Function with cache implementation
export async function getAICompletionWithCache(prompt, model = ModelTypes.DEEPSEEK_CODER) {
  // Create cache key from prompt and model
  const cacheKey = `${prompt}-${model}`;
  
  // Check if we have a cached response
  if (responseCache.has(cacheKey)) {
    console.log("🔄 Using cached response");
    return {
      ...responseCache.get(cacheKey),
      cached: true
    };
  }
  
  // If not in cache, get fresh response
  const response = await generateAIResponse(prompt, model);
  
  // Cache the response for future use
  responseCache.set(cacheKey, response);
  
  return {
    ...response,
    cached: false
  };
}

// Example usage
const examplePrompt = "Write a function to find prime numbers";

getAICompletionWithCache(examplePrompt)
  .then(result => {
    console.log("✅ AI Response:", result);
    console.log("Prime number function:");
    console.log(result.result);
  })
  .catch(err => {
    console.error("💥 Something went wrong:", err);
  });

// Export the public API
export {
  generateAIResponse,
  ModelTypes
}; 