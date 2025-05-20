import axios from 'axios';

// Define Model interface
export interface AIModel {
  id: string;
  name: string;
  description: string;
  url: string;
  downloadCount: number;
  likes: number;
  lastUpdated: string;
  task: string;
  tags: string[];
  owner: string;
  framework: string;
  size: string;
  license: string;
  paperUrl?: string;
  demoUrl?: string;
  isFineTuned: boolean;
}

// Model crawler class for fetching AI models
export class ModelCrawler {
  private cacheKey = 'ai_models_cache';
  private cacheExpiryKey = 'ai_models_cache_expiry';
  private cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  // Main method to get models
  public async getModels(options: {
    searchTerm?: string;
    tasks?: string[];
    tags?: string[];
    framework?: string;
    sortBy?: 'popularity' | 'recency' | 'likes';
    isFineTuned?: boolean;
    forceRefresh?: boolean;
  } = {}): Promise<AIModel[]> {
    const { 
      searchTerm = '',
      tasks = [],
      tags = [],
      framework,
      sortBy = 'popularity',
      isFineTuned,
      forceRefresh = false
    } = options;
    
    try {
      // Check if we need to refresh the cache
      if (forceRefresh) {
        await this.refreshCache();
      }
      
      // Get models from cache
      const models = await this.getCachedModels();
      
      // Filter and sort models
      return this.filterAndSortModels(models, {
        searchTerm,
        tasks,
        tags,
        framework,
        sortBy,
        isFineTuned
      });
    } catch (error) {
      console.error('Error fetching AI models:', error);
      return [];
    }
  }
  
  // Filter and sort models based on provided criteria
  private filterAndSortModels(
    models: AIModel[],
    options: {
      searchTerm?: string;
      tasks?: string[];
      tags?: string[];
      framework?: string;
      sortBy?: 'popularity' | 'recency' | 'likes';
      isFineTuned?: boolean;
    }
  ): AIModel[] {
    const { 
      searchTerm = '',
      tasks = [],
      tags = [],
      framework,
      sortBy = 'popularity',
      isFineTuned
    } = options;
    
    // Filter models
    let filtered = models.filter(model => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by tasks if any are specified
      const matchesTasks = tasks.length === 0 || 
        tasks.includes(model.task);
      
      // Filter by tags if any are specified
      const matchesTags = tags.length === 0 || 
        tags.some(tag => model.tags.includes(tag));
      
      // Filter by framework if specified
      const matchesFramework = !framework || model.framework === framework;
      
      // Filter by fine-tuned status if specified
      const matchesFineTuned = isFineTuned === undefined || model.isFineTuned === isFineTuned;
      
      return matchesSearch && matchesTasks && matchesTags && matchesFramework && matchesFineTuned;
    });
    
    // Sort models
    switch(sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'recency':
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }
    
    return filtered;
  }
  
  // Get models from cache, fetching if necessary
  private async getCachedModels(): Promise<AIModel[]> {
    // In a browser environment, we would use localStorage
    // For server-side, we would use a more appropriate caching method
    let cachedData: AIModel[] = [];
    
    // For the sake of this implementation, we'll simulate a cache check
    const needsRefresh = true; // In a real implementation, we would check the cache expiry
    
    if (needsRefresh) {
      return await this.refreshCache();
    }
    
    return cachedData;
  }
  
  // Refresh the cache of models
  private async refreshCache(): Promise<AIModel[]> {
    try {
      const models = await this.fetchModelsFromHuggingFace();
      
      // In a real implementation, we would store the models in cache
      // and update the expiry time
      
      return models;
    } catch (error) {
      console.error('Error refreshing AI model cache:', error);
      
      // If fetching fails, return mock data
      return this.getMockModels();
    }
  }
  
  // Fetch models from Hugging Face API
  private async fetchModelsFromHuggingFace(): Promise<AIModel[]> {
    try {
      // NOTE: In a real implementation, we would use the Hugging Face API
      // This requires proper authentication and handling of API limits
      
      // For this demo, we'll just return the mock data
      // as if we fetched it from the Hugging Face API
      return this.getMockModels();
      
      // Real implementation would be something like:
      /*
      const response = await axios.get('https://huggingface.co/api/models', {
        params: {
          limit: 100,
          sort: 'downloads',
          direction: -1
        }
      });
      
      return response.data.map(this.mapHuggingFaceModel);
      */
    } catch (error) {
      console.error('Error fetching from Hugging Face API:', error);
      return this.getMockModels();
    }
  }
  
  // Map Hugging Face API response to our AIModel interface
  private mapHuggingFaceModel(apiResponse: any): AIModel {
    return {
      id: apiResponse.id || '',
      name: apiResponse.modelId || '',
      description: apiResponse.description || '',
      url: `https://huggingface.co/${apiResponse.modelId}` || '',
      downloadCount: apiResponse.downloads || 0,
      likes: apiResponse.likes || 0,
      lastUpdated: apiResponse.lastModified || new Date().toISOString(),
      task: apiResponse.pipeline_tag || 'Unknown',
      tags: apiResponse.tags || [],
      owner: apiResponse.author || 'Unknown',
      framework: this.inferFramework(apiResponse) || 'Unknown',
      size: this.formatModelSize(apiResponse.size) || 'Unknown',
      license: apiResponse.license || 'Unknown',
      paperUrl: apiResponse.cardData?.paper || undefined,
      demoUrl: apiResponse.cardData?.demo || undefined,
      isFineTuned: apiResponse.cardData?.fine_tuning || false
    };
  }
  
  // Helper method to infer the framework from the model response
  private inferFramework(apiResponse: any): string {
    // In a real implementation, we would have more sophisticated logic
    // to determine the framework based on the model's metadata
    const tags = (apiResponse.tags || []).map((t: string) => t.toLowerCase());
    
    if (tags.includes('pytorch') || tags.includes('torch')) {
      return 'PyTorch';
    } else if (tags.includes('tensorflow') || tags.includes('tf')) {
      return 'TensorFlow';
    } else if (tags.includes('jax') || tags.includes('flax')) {
      return 'JAX/Flax';
    } else if (tags.includes('onnx')) {
      return 'ONNX';
    }
    
    return 'Unknown';
  }
  
  // Helper method to format model size
  private formatModelSize(sizeInBytes?: number): string {
    if (!sizeInBytes) return 'Unknown';
    
    if (sizeInBytes < 1024 * 1024) {
      return `${Math.round(sizeInBytes / 1024)} KB`;
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return `${Math.round(sizeInBytes / (1024 * 1024))} MB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  }
  
  // Get mock models for development and testing
  private getMockModels(): AIModel[] {
    return [
      {
        id: "bert-base-uncased",
        name: "BERT Base Uncased",
        description: "12-layer, 768-hidden, 12-heads, 110M parameters. Trained on lower-cased English text.",
        url: "https://huggingface.co/bert-base-uncased",
        downloadCount: 5893421,
        likes: 3275,
        lastUpdated: "2023-01-15T10:23:45Z",
        task: "fill-mask",
        tags: ["bert", "text", "fill-mask", "transformer", "pytorch"],
        owner: "Google",
        framework: "PyTorch",
        size: "420 MB",
        license: "Apache 2.0",
        paperUrl: "https://arxiv.org/abs/1810.04805",
        isFineTuned: false
      },
      {
        id: "gpt2",
        name: "GPT-2",
        description: "GPT-2 124M parameter model. The full version of the OpenAI GPT-2 English language model.",
        url: "https://huggingface.co/gpt2",
        downloadCount: 7812345,
        likes: 4562,
        lastUpdated: "2023-02-10T15:34:12Z",
        task: "text-generation",
        tags: ["gpt2", "text-generation", "transformer", "pytorch"],
        owner: "OpenAI",
        framework: "PyTorch",
        size: "548 MB",
        license: "MIT",
        paperUrl: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf",
        isFineTuned: false
      },
      {
        id: "t5-base",
        name: "T5 Base",
        description: "T5 model with the base architecture (220M parameters). T5 is an encoder-decoder model pre-trained on a multi-task mixture of unsupervised and supervised tasks.",
        url: "https://huggingface.co/t5-base",
        downloadCount: 4156728,
        likes: 1867,
        lastUpdated: "2023-03-21T08:17:33Z",
        task: "text2text-generation",
        tags: ["t5", "text2text", "translation", "summarization", "question-answering", "tensorflow"],
        owner: "Google",
        framework: "TensorFlow",
        size: "892 MB",
        license: "Apache 2.0",
        paperUrl: "https://arxiv.org/abs/1910.10683",
        isFineTuned: false
      },
      {
        id: "facebook/bart-large-cnn",
        name: "BART Large CNN",
        description: "BART model fine-tuned on CNN Daily Mail. It achieves state-of-the-art results on the CNN/DailyMail summarization task.",
        url: "https://huggingface.co/facebook/bart-large-cnn",
        downloadCount: 3452168,
        likes: 2154,
        lastUpdated: "2023-01-30T11:45:22Z",
        task: "summarization",
        tags: ["bart", "summarization", "transformer", "pytorch", "cnn"],
        owner: "Facebook AI",
        framework: "PyTorch",
        size: "1.6 GB",
        license: "MIT",
        paperUrl: "https://arxiv.org/abs/1910.13461",
        isFineTuned: true
      },
      {
        id: "valhalla/t5-small-qa-qg-hl",
        name: "T5 for Q&A and Question Generation",
        description: "A t5-small model fine-tuned on different downstream tasks like question answering, question generation and highlight extraction.",
        url: "https://huggingface.co/valhalla/t5-small-qa-qg-hl",
        downloadCount: 1254367,
        likes: 876,
        lastUpdated: "2023-04-05T14:18:56Z",
        task: "question-answering",
        tags: ["t5", "question-answering", "question-generation", "fine-tuned", "pytorch"],
        owner: "valhalla",
        framework: "PyTorch",
        size: "300 MB",
        license: "MIT",
        isFineTuned: true
      },
      {
        id: "microsoft/DialoGPT-medium",
        name: "DialoGPT Medium",
        description: "A GPT-2 medium model fine-tuned on dialogue from Reddit discussions for conversational response generation.",
        url: "https://huggingface.co/microsoft/DialoGPT-medium",
        downloadCount: 2876543,
        likes: 2345,
        lastUpdated: "2023-02-25T09:37:14Z",
        task: "conversational",
        tags: ["gpt2", "dialogue", "conversational", "fine-tuned", "pytorch"],
        owner: "Microsoft",
        framework: "PyTorch",
        size: "1.4 GB",
        license: "MIT",
        paperUrl: "https://arxiv.org/abs/1911.00536",
        isFineTuned: true
      },
      {
        id: "sentence-transformers/all-MiniLM-L6-v2",
        name: "all-MiniLM-L6-v2",
        description: "A small and fast text embedding model that maps sentences & paragraphs to a 384 dimensional dense vector space.",
        url: "https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2",
        downloadCount: 5432178,
        likes: 3156,
        lastUpdated: "2023-03-10T16:28:45Z",
        task: "sentence-similarity",
        tags: ["sentence-transformers", "embedding", "miniLM", "pytorch"],
        owner: "sentence-transformers",
        framework: "PyTorch",
        size: "90 MB",
        license: "Apache 2.0",
        isFineTuned: true
      },
      {
        id: "stabilityai/stable-diffusion-2-1",
        name: "Stable Diffusion 2.1",
        description: "Stable Diffusion is a latent text-to-image diffusion model capable of generating photo-realistic images given any text input.",
        url: "https://huggingface.co/stabilityai/stable-diffusion-2-1",
        downloadCount: 9876543,
        likes: 7654,
        lastUpdated: "2023-05-01T12:34:56Z",
        task: "text-to-image",
        tags: ["stable-diffusion", "text-to-image", "diffusion", "pytorch", "generative"],
        owner: "StabilityAI",
        framework: "PyTorch",
        size: "5.3 GB",
        license: "CreativeML Open RAIL++-M License",
        demoUrl: "https://huggingface.co/spaces/stabilityai/stable-diffusion",
        isFineTuned: false
      },
      {
        id: "openai/clip-vit-base-patch32",
        name: "CLIP ViT-B/32",
        description: "CLIP (Contrastive Language-Image Pre-Training) model with ViT-B/32 architecture. It can be used for zero-shot classification and multimodal embedding.",
        url: "https://huggingface.co/openai/clip-vit-base-patch32",
        downloadCount: 4321987,
        likes: 3421,
        lastUpdated: "2023-02-18T14:25:36Z",
        task: "zero-shot-image-classification",
        tags: ["clip", "vision", "multimodal", "pytorch", "zero-shot"],
        owner: "OpenAI",
        framework: "PyTorch",
        size: "600 MB",
        license: "MIT",
        paperUrl: "https://arxiv.org/abs/2103.00020",
        isFineTuned: false
      },
      {
        id: "meta-llama/Llama-2-7b-hf",
        name: "Llama 2 7B",
        description: "Llama 2 is a collection of pretrained and fine-tuned generative text models ranging from 7B to 70B parameters. This is the 7B parameter base model.",
        url: "https://huggingface.co/meta-llama/Llama-2-7b-hf",
        downloadCount: 8745632,
        likes: 6543,
        lastUpdated: "2023-07-20T10:12:34Z",
        task: "text-generation",
        tags: ["llama", "text-generation", "transformer", "pytorch", "large-language-model"],
        owner: "Meta AI",
        framework: "PyTorch",
        size: "13.5 GB",
        license: "Llama 2 Community License",
        paperUrl: "https://arxiv.org/abs/2307.09288",
        isFineTuned: false
      },
      {
        id: "runwayml/stable-diffusion-v1-5",
        name: "Stable Diffusion v1.5",
        description: "Stable Diffusion is a latent text-to-image diffusion model capable of generating photo-realistic images given any text input.",
        url: "https://huggingface.co/runwayml/stable-diffusion-v1-5",
        downloadCount: 12345678,
        likes: 8765,
        lastUpdated: "2023-03-15T17:45:23Z",
        task: "text-to-image",
        tags: ["stable-diffusion", "text-to-image", "diffusion", "pytorch", "generative"],
        owner: "RunwayML",
        framework: "PyTorch",
        size: "4.2 GB",
        license: "CreativeML Open RAIL License",
        demoUrl: "https://huggingface.co/spaces/stabilityai/stable-diffusion",
        isFineTuned: false
      },
      {
        id: "mistralai/Mixtral-8x7B-v0.1",
        name: "Mixtral 8x7B",
        description: "Mixtral-8x7B is a sparse mixture of experts model with 8 experts, each with 7B parameters. Only 2 experts are active for each token, making it both high quality and efficient.",
        url: "https://huggingface.co/mistralai/Mixtral-8x7B-v0.1",
        downloadCount: 6543210,
        likes: 4567,
        lastUpdated: "2023-12-01T09:23:45Z",
        task: "text-generation",
        tags: ["mixtral", "moe", "sparse", "text-generation", "large-language-model", "pytorch"],
        owner: "MistralAI",
        framework: "PyTorch",
        size: "26.5 GB",
        license: "Apache 2.0",
        isFineTuned: false
      }
    ];
  }
} 