import { Session } from 'next-auth';

// Define types for the AI Agent service
export type AgentRole = 'user' | 'agent' | 'system';

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: Date;
}

export interface AgentQuery {
  query: string;
  history?: AgentMessage[];
  userData?: {
    userId?: string;
    email?: string;
    name?: string;
    isLoggedIn: boolean;
  };
}

export interface AgentResponsePayload {
  message: string;
  suggestedActions?: Array<{
    type: string;
    label: string;
    value: string;
  }>;
  links?: Array<{
    url: string;
    label: string;
  }>;
  additionalContext?: Record<string, any>;
}

export interface WebsiteContent {
  pagePath: string;
  title: string;
  content: string;
  lastUpdated?: Date;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

// Mock database of website content the agent can access
const websiteContent: WebsiteContent[] = [
  {
    pagePath: '/',
    title: 'Neural Nexus - Home',
    content: 'Neural Nexus is a platform for AI developers to create, share, and monetize machine learning models. Our marketplace connects AI creators with businesses and developers who need AI solutions.',
    lastUpdated: new Date('2023-12-01')
  },
  {
    pagePath: '/marketplace',
    title: 'Neural Nexus - Marketplace',
    content: 'Browse AI models, tools, and datasets from leading developers. Find solutions for computer vision, NLP, audio processing, and more. All models are rigorously tested and rated by our community.',
    lastUpdated: new Date('2023-11-15')
  },
  {
    pagePath: '/dashboard',
    title: 'Neural Nexus - Dashboard',
    content: 'Manage your AI models, track performance metrics, view sales statistics, and access your API keys. The dashboard provides a comprehensive view of your Neural Nexus activities.',
    lastUpdated: new Date('2023-12-10')
  },
  {
    pagePath: '/pricing',
    title: 'Neural Nexus - Pricing',
    content: 'Neural Nexus offers flexible pricing tiers for both creators and users. Creators can set their own pricing models, and users can purchase one-time access or subscriptions.',
    lastUpdated: new Date('2023-10-20')
  },
  {
    pagePath: '/api-docs',
    title: 'Neural Nexus - API Documentation',
    content: 'Comprehensive documentation for the Neural Nexus API. Learn how to integrate our models into your applications, authenticate requests, handle responses, and implement webhooks.',
    lastUpdated: new Date('2023-11-30')
  }
];

// Frequently asked questions
export const agentFAQs = [
  {
    question: "What is Neural Nexus?",
    answer: "Neural Nexus is a platform for AI developers to create, share, and monetize their machine learning models. It provides tools for model development, deployment, and marketplace integration.",
    category: "general"
  },
  {
    question: "How do I upload a model?",
    answer: "To upload a model, navigate to the dashboard, click on 'Upload Model' and follow the step-by-step process to provide model details, upload files, and set pricing.",
    category: "models"
  },
  {
    question: "How do payments work?",
    answer: "We support crypto payments through our Web3 integration as well as traditional payment methods. Creators receive 85% of sales revenue, with payouts processed weekly.",
    category: "payments"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use end-to-end encryption and follow industry best practices for data security. Your models and personal information are protected with state-of-the-art security measures.",
    category: "security"
  },
  {
    question: "Can I try before buying?",
    answer: "Many models offer a limited free tier or trial version. Look for the 'Try' button on model listings to test capabilities before purchasing.",
    category: "marketplace"
  },
  {
    question: "How do I get API keys?",
    answer: "API keys can be generated from your dashboard under the 'API Keys' tab. You can create, manage, and revoke keys as needed for different applications.",
    category: "api"
  },
  {
    question: "What AI technologies are supported?",
    answer: "We support a wide range of AI technologies including neural networks, transformers, computer vision models, NLP, reinforcement learning, and more.",
    category: "technical"
  },
  {
    question: "How do I connect my wallet?",
    answer: "Click on the Connect Wallet button in the top navigation bar, and select your preferred Web3 wallet. We support MetaMask, Coinbase Wallet, and WalletConnect.",
    category: "web3"
  },
  {
    question: "What are the system requirements?",
    answer: "For basic usage, a modern web browser and internet connection are sufficient. For model development, requirements vary by model type, but we recommend at least 8GB RAM and a compatible GPU for training.",
    category: "technical"
  },
  {
    question: "How do I become a verified developer?",
    answer: "Verified developer status is awarded to creators with a history of high-quality models, positive reviews, and consistent sales. To apply, you must have at least 3 published models with an average rating of 4+ stars.",
    category: "creators"
  },
  {
    question: "What file formats do you support?",
    answer: "We support common model formats including ONNX, TensorFlow SavedModel, PyTorch JIT, and custom containers. For datasets, we support CSV, JSON, parquet, and structured data archives.",
    category: "technical"
  },
  {
    question: "How long does verification take?",
    answer: "Model verification typically takes 1-3 business days, depending on complexity and queue volume. We thoroughly test each model for security, performance, and compliance with our guidelines.",
    category: "models"
  }
];

// AI Agent service
export class AIAgentService {
  private static instance: AIAgentService;
  private readonly model: string = 'deepseek-coder'; // Explicitly use DeepSeek model
  private readonly systemInstruction: string = 
    `You are a helpful, friendly assistant for the Neural Nexus platform. 
    Your name is Neural Nexus Assistant and you're powered by DeepSeek.
    
    IMPORTANT: You MUST ONLY answer questions related to Neural Nexus, its platform, services, and features.
    For any questions outside of Neural Nexus, politely explain that you can only help with Neural Nexus-related topics.
    
    Respond in a casual, conversational tone like a friendly human assistant would. Use occasional emojis, 
    contractions, and varied sentence structures. Keep responses concise but helpful.
    
    If you're unsure about something, it's okay to admit that you don't know rather than making up information.
    
    When helping users, focus on being practical and solution-oriented.`;
  
  private constructor() {}
  
  // Singleton pattern
  public static getInstance(): AIAgentService {
    if (!AIAgentService.instance) {
      AIAgentService.instance = new AIAgentService();
    }
    return AIAgentService.instance;
  }
  
  // Process user query
  public async processQuery(query: AgentQuery): Promise<AgentResponsePayload> {
    try {
      // Check if query is off-topic
      if (this.isOffTopic(query.query)) {
        return {
          message: this.generateGenericResponse(query.query)
        };
      }

      // Check for FAQ matches first (for quick responses)
      const faqMatch = this.checkFAQs(query.query);
      if (faqMatch) {
        return {
          message: faqMatch,
          suggestedActions: [
            { 
              type: 'related', 
              label: 'Tell me more about Neural Nexus', 
              value: 'What is Neural Nexus and what can it do for me?' 
            }
          ]
        };
      }

      // Check website content for matches
      const contentMatch = this.checkWebsiteContent(query.query);
      if (contentMatch) {
        return {
          message: contentMatch,
          links: [
            { url: '/docs/getting-started', label: 'Getting Started Guide' },
            { url: '/marketplace', label: 'Browse Marketplace' }
          ]
        };
      }

      // Prepare conversation history for context
      let conversationContext = '';
      if (query.history && query.history.length > 0) {
        // Only include last few messages for context
        const recentHistory = query.history.slice(-5);
        conversationContext = recentHistory.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
      }

      // Prepare user context if available
      let userContext = '';
      if (query.userData && query.userData.isLoggedIn) {
        userContext = `The user is logged in${query.userData.name ? ' as ' + query.userData.name : ''}.`;
      } else {
        userContext = 'The user is not logged in.';
      }

      // Construct the prompt for the AI model
      const prompt = `${this.systemInstruction}

Conversation history:
${conversationContext}

User context:
${userContext}

User query: ${query.query}

Respond in a friendly, conversational way as the Neural Nexus Assistant. Stay focused on Neural Nexus topics only.`;

      // In a real implementation, this would call the DeepSeek API
      // For this demo, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a response based on the query
      let response: string;
      
      // Check for common question patterns
      if (this.checkIntent(query.query, ['what is', 'tell me about', 'explain'])) {
        response = `Neural Nexus is an AI platform where you can discover, use, and share cutting-edge AI models! It's designed to be super easy to use whether you're a developer or just AI-curious. You can explore models in our marketplace, run them through our API, or even upload your own creations.`;
      } 
      else if (this.checkIntent(query.query, ['how to', 'how do i', 'steps', 'guide'])) {
        response = `Getting started is easy! First, create an account on our platform. Then you can browse the marketplace to find models that fit your needs. If you want to use them in your projects, grab an API key from your dashboard. Need more detailed steps? Check out our docs - I can point you to the right section!`;
      }
      else if (this.checkIntent(query.query, ['price', 'cost', 'subscription', 'payment'])) {
        response = `We have several pricing tiers to fit different needs! There's a free tier to get you started, and premium plans starting at $19/month for more API calls and features. You only pay for what you use with our models - most start at just a few cents per 1000 tokens. Want me to break down a specific plan?`;
      }
      else if (this.checkIntent(query.query, ['upload', 'publish', 'share', 'my model'])) {
        response = `Want to share your model? Awesome! Head to your dashboard and click "Upload Model." You'll need to provide some details like model type, description, and sample inputs/outputs. Once approved, you can set your pricing and start earning when others use your creation! The whole process usually takes less than 24 hours.`;
      }
      else {
        // Default to a generic but helpful response
        response = `Thanks for asking about that! While I don't have specific information on this particular question, I can tell you that Neural Nexus offers a wide range of AI models and tools to help with various tasks. Would you like me to point you to our documentation or help you navigate to a specific section of our platform?`;
      }
      
      // Add suggested actions based on query type
      const suggestedActions = [
        { type: 'navigate', label: 'Explore Marketplace', value: '/marketplace' },
        { type: 'navigate', label: 'Documentation', value: '/docs' },
        { type: 'question', label: 'How do I get started?', value: 'How do I get started with Neural Nexus?' }
      ];
      
      return {
        message: response,
        suggestedActions: suggestedActions
      };
      
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        message: "I'm having trouble processing that right now. Could you try asking in a different way?"
      };
    }
  }
  
  // Check if a query matches any FAQs
  private checkFAQs(query: string) {
    // This would search through a database of FAQs in a real implementation
    // For demo purposes, we'll just check for some common questions
    
    const faqs: FAQ[] = [
      {
        question: "What is Neural Nexus?",
        answer: "Neural Nexus is a platform that connects AI model creators with users. It provides tools for developing, sharing, and monetizing AI models.",
        category: "general"
      },
      {
        question: "How do I upload a model?",
        answer: "To upload a model, go to your dashboard and click the 'Upload Model' button. You'll need to provide details about your model, including its capabilities, requirements, and pricing.",
        category: "creators"
      },
      {
        question: "How does payment work?",
        answer: "Neural Nexus handles all payment processing. Creators receive 85% of the revenue from their models, with the platform taking a 15% fee. Payments are processed monthly.",
        category: "billing"
      }
    ];
    
    // Simple matching logic - in a real implementation, this would use semantic search
    for (const faq of faqs) {
      if (query.toLowerCase().includes(faq.question.toLowerCase())) {
        return faq.answer;
      }
    }
    
    return null;
  }
  
  // Check if a query relates to website content
  private checkWebsiteContent(query: string) {
    // This would search through website content in a real implementation
    // For demo purposes, we'll just check for some common topics
    
    const websiteContent: WebsiteContent[] = [
      {
        pagePath: "/about",
        title: "About Neural Nexus",
        content: "Neural Nexus is an AI platform founded in 2023 with the mission to democratize access to cutting-edge AI models and provide a marketplace for AI creators."
      },
      {
        pagePath: "/docs/api",
        title: "API Documentation",
        content: "The Neural Nexus API allows you to integrate AI models into your applications. You'll need an API key from your dashboard to get started."
      },
      {
        pagePath: "/marketplace",
        title: "Marketplace",
        content: "Browse and purchase AI models from creators around the world. Models are available for various tasks including text generation, image processing, and data analysis."
      }
    ];
    
    // Simple matching logic - in a real implementation, this would use semantic search
    for (const content of websiteContent) {
      if (query.toLowerCase().includes(content.title.toLowerCase())) {
        return content.content;
      }
    }
    
    return null;
  }
  
  // Check if a query contains any of the given intent keywords
  private checkIntent(query: string, keywords: string[]): boolean {
    return keywords.some(keyword => query.includes(keyword.toLowerCase()));
  }
  
  // Generate a generic response for queries without specific matches
  private generateGenericResponse(query: string): string {
    // Generate friendly responses for off-topic queries
    const responses = [
      "Hey there! 👋 I'm focused on helping with Neural Nexus stuff. Could we chat about the platform, our models, or services instead?",
      "I'd love to help with that, but I'm really just trained on Neural Nexus topics! Is there something about our platform I can help with?",
      "Hmm, that's outside my expertise - I'm your Neural Nexus assistant! Want to know about our AI models, marketplace, or how to use the platform?",
      "I'm sorry, I can only chat about Neural Nexus related topics. But I'd be happy to tell you about our services or answer questions about the platform!",
      "That's a bit outside my lane - I'm specialized in Neural Nexus topics. Can I tell you about our features or help you navigate the platform instead?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Log user interaction for analytics and training (in a real implementation)
  public logInteraction(query: string, response: string, userId?: string): void {
    // In a production environment, this would send data to an analytics service
    console.log(`[AI Agent Log] User${userId ? ' ' + userId : ''} - Query: ${query} - Response: ${response}`);
  }
  
  // Check if a query is outside the scope of Neural Nexus website
  private isOffTopic(query: string): boolean {
    // Simple check for off-topic queries
    const neuralNexusKeywords = [
      'neural nexus', 'platform', 'model', 'api', 'service', 'account', 'pricing',
      'subscription', 'marketplace', 'upload', 'download', 'payment', 'feature',
      'deepseek', 'ai', 'artificial intelligence', 'machine learning', 'ml',
      'neural', 'nexus', 'login', 'sign up', 'register', 'dashboard', 'profile'
    ];
    
    // If query contains any Neural Nexus related keywords, consider it on-topic
    for (const keyword of neuralNexusKeywords) {
      if (query.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    
    // Check if query is a common greeting or simple question
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'howdy', 'what\'s up', 'how are you'];
    for (const greeting of greetings) {
      if (query.toLowerCase().includes(greeting)) {
        return false;
      }
    }
    
    // If no Neural Nexus keywords found, likely off-topic
    return true;
  }
} 