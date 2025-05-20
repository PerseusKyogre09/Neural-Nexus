import { Octokit } from "octokit";

export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  language: string;
  topics: string[];
  owner: {
    login: string;
    avatarUrl: string;
  };
  license?: {
    name: string;
    url: string;
  };
  isOpenSource: boolean;
}

// Define a type for GitHub repository response
interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  language: string | null;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
}

export class GitHubCrawler {
  private static instance: GitHubCrawler;
  private octokit: Octokit | null = null;
  private cache: {
    repos: GitHubRepo[];
    lastUpdated: Date;
  };
  
  private constructor() {
    this.cache = {
      repos: [],
      lastUpdated: new Date(0) // Set to epoch to ensure first fetch
    };
    
    // Initialize Octokit if GitHub token is available
    const token = process.env.GITHUB_API_TOKEN;
    if (token) {
      this.octokit = new Octokit({ auth: token });
    } else {
      console.warn("No GitHub API token found. Using unauthenticated requests (rate limited).");
      this.octokit = new Octokit();
    }
  }
  
  public static getInstance(): GitHubCrawler {
    if (!GitHubCrawler.instance) {
      GitHubCrawler.instance = new GitHubCrawler();
    }
    return GitHubCrawler.instance;
  }
  
  private isCacheStale(): boolean {
    const cacheAge = Date.now() - this.cache.lastUpdated.getTime();
    // Cache is stale after 1 hour
    return cacheAge > 3600000; 
  }
  
  public async getRepositories(forceRefresh = false): Promise<GitHubRepo[]> {
    if (forceRefresh || this.isCacheStale() || this.cache.repos.length === 0) {
      await this.refreshCache();
    }
    return this.cache.repos;
  }
  
  public async getFilteredRepositories(
    searchTerm: string = '',
    language: string = '',
    minStars: number = 0,
    topics: string[] = []
  ): Promise<GitHubRepo[]> {
    const repos = await this.getRepositories();
    
    return repos.filter(repo => {
      // Filter by search term
      const matchesSearch = !searchTerm || 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by language
      const matchesLanguage = !language || repo.language === language;
      
      // Filter by stars
      const hasEnoughStars = repo.stars >= minStars;
      
      // Filter by topics
      const matchesTopics = topics.length === 0 || 
        topics.every(topic => repo.topics.includes(topic));
      
      return matchesSearch && matchesLanguage && hasEnoughStars && matchesTopics;
    });
  }
  
  private async refreshCache(): Promise<void> {
    try {
      if (!this.octokit) {
        throw new Error("GitHub API client not initialized");
      }
      
      console.log("Fetching GitHub repositories...");
      
      // In production, we'd fetch from GitHub API
      // For now, let's use a mix of real API calls and mock data
      
      const repos: GitHubRepo[] = [];
      
      // Fetch AI/ML repositories with "open-source" topic
      const aimlRepos = await this.fetchGitHubRepos("topic:machine-learning topic:open-source");
      repos.push(...aimlRepos);
      
      // Fetch Neural Network repositories
      const nnRepos = await this.fetchGitHubRepos("topic:neural-network topic:open-source");
      repos.push(...nnRepos);
      
      // Fetch Deep Learning repositories
      const dlRepos = await this.fetchGitHubRepos("topic:deep-learning topic:open-source");
      repos.push(...dlRepos);
      
      // Add some popular AI frameworks that might not have the exact topics
      const popularRepos = await this.fetchSpecificRepos([
        "tensorflow/tensorflow",
        "pytorch/pytorch", 
        "huggingface/transformers",
        "scikit-learn/scikit-learn",
        "keras-team/keras"
      ]);
      repos.push(...popularRepos);
      
      // Deduplicate by ID
      const uniqueRepos = Array.from(
        new Map(repos.map(repo => [repo.id, repo])).values()
      );
      
      // Sort by stars
      uniqueRepos.sort((a, b) => b.stars - a.stars);
      
      // Update cache
      this.cache = {
        repos: uniqueRepos,
        lastUpdated: new Date()
      };
      
      console.log(`Fetched ${uniqueRepos.length} repositories from GitHub`);
      
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
      
      // If API fails, use mock data as fallback
      if (this.cache.repos.length === 0) {
        this.cache.repos = this.getMockRepositories();
        this.cache.lastUpdated = new Date();
      }
    }
  }
  
  private async fetchGitHubRepos(query: string): Promise<GitHubRepo[]> {
    try {
      if (!this.octokit) {
        throw new Error("GitHub API client not initialized");
      }
      
      const response = await this.octokit.rest.search.repos({
        q: query + " stars:>1000",
        sort: "stars",
        order: "desc",
        per_page: 20
      });
      
      return response.data.items.map(item => this.mapGitHubRepo(item as GitHubRepoResponse));
    } catch (error) {
      console.error(`Error fetching GitHub repos with query "${query}":`, error);
      return [];
    }
  }
  
  private async fetchSpecificRepos(repoFullNames: string[]): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    
    for (const fullName of repoFullNames) {
      try {
        if (!this.octokit) {
          throw new Error("GitHub API client not initialized");
        }
        
        const [owner, repo] = fullName.split('/');
        
        const response = await this.octokit.rest.repos.get({
          owner,
          repo
        });
        
        repos.push(this.mapGitHubRepo(response.data as GitHubRepoResponse));
      } catch (error) {
        console.error(`Error fetching specific repo "${fullName}":`, error);
      }
    }
    
    return repos;
  }
  
  private mapGitHubRepo(item: GitHubRepoResponse): GitHubRepo {
    // Check if it has an open source license
    const hasOpenSourceLicense = item.license && [
      'mit', 'apache-2.0', 'gpl', 'bsd', 'cc0', 'unlicense', 'mpl'
    ].some(license => 
      item.license?.spdx_id?.toLowerCase().includes(license) || 
      item.license?.key?.toLowerCase().includes(license) ||
      item.license?.name?.toLowerCase().includes(license)
    );
    
    // Check if it has open source related topics
    const hasOpenSourceTopics = item.topics && item.topics.some((topic: string) => 
      ['open-source', 'opensource', 'oss'].includes(topic.toLowerCase())
    );
    
    return {
      id: item.id.toString(),
      name: item.name,
      fullName: item.full_name,
      description: item.description || "",
      url: item.html_url,
      stars: item.stargazers_count,
      forks: item.forks_count,
      lastUpdated: item.updated_at,
      language: item.language || "Unknown",
      topics: item.topics || [],
      owner: {
        login: item.owner.login,
        avatarUrl: item.owner.avatar_url
      },
      license: item.license ? {
        name: item.license.name,
        url: item.license.url
      } : undefined,
      isOpenSource: hasOpenSourceLicense || hasOpenSourceTopics
    };
  }
  
  private getMockRepositories(): GitHubRepo[] {
    return [
      {
        id: "1",
        name: "transformers",
        fullName: "huggingface/transformers",
        description: "🤗 Transformers: State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.",
        url: "https://github.com/huggingface/transformers",
        stars: 112000,
        forks: 21000,
        lastUpdated: "2023-08-10T12:00:00Z",
        language: "Python",
        topics: ["nlp", "deep-learning", "machine-learning", "transformers", "open-source"],
        owner: {
          login: "huggingface",
          avatarUrl: "https://avatars.githubusercontent.com/u/25720743?v=4"
        },
        license: {
          name: "Apache License 2.0",
          url: "https://api.github.com/licenses/apache-2.0"
        },
        isOpenSource: true
      },
      {
        id: "2",
        name: "tensorflow",
        fullName: "tensorflow/tensorflow",
        description: "An Open Source Machine Learning Framework for Everyone",
        url: "https://github.com/tensorflow/tensorflow",
        stars: 178000,
        forks: 88000,
        lastUpdated: "2023-08-12T09:30:00Z",
        language: "C++",
        topics: ["machine-learning", "deep-learning", "neural-networks", "open-source"],
        owner: {
          login: "tensorflow",
          avatarUrl: "https://avatars.githubusercontent.com/u/15658638?v=4"
        },
        license: {
          name: "Apache License 2.0",
          url: "https://api.github.com/licenses/apache-2.0"
        },
        isOpenSource: true
      },
      {
        id: "3",
        name: "pytorch",
        fullName: "pytorch/pytorch",
        description: "Tensors and Dynamic neural networks in Python with strong GPU acceleration",
        url: "https://github.com/pytorch/pytorch",
        stars: 69000,
        forks: 19000,
        lastUpdated: "2023-08-11T15:45:00Z",
        language: "Python",
        topics: ["deep-learning", "machine-learning", "neural-networks", "open-source"],
        owner: {
          login: "pytorch",
          avatarUrl: "https://avatars.githubusercontent.com/u/21003710?v=4"
        },
        license: {
          name: "BSD 3-Clause License",
          url: "https://api.github.com/licenses/bsd-3-clause"
        },
        isOpenSource: true
      },
      {
        id: "4",
        name: "scikit-learn",
        fullName: "scikit-learn/scikit-learn",
        description: "scikit-learn: machine learning in Python",
        url: "https://github.com/scikit-learn/scikit-learn",
        stars: 55000,
        forks: 25000,
        lastUpdated: "2023-08-09T11:20:00Z",
        language: "Python",
        topics: ["machine-learning", "data-science", "statistics", "open-source"],
        owner: {
          login: "scikit-learn",
          avatarUrl: "https://avatars.githubusercontent.com/u/365630?v=4"
        },
        license: {
          name: "BSD 3-Clause License",
          url: "https://api.github.com/licenses/bsd-3-clause"
        },
        isOpenSource: true
      },
      {
        id: "5",
        name: "llama",
        fullName: "facebookresearch/llama",
        description: "Inference code for LLaMA models",
        url: "https://github.com/facebookresearch/llama",
        stars: 42000,
        forks: 7000,
        lastUpdated: "2023-08-08T10:15:00Z",
        language: "Python",
        topics: ["llm", "language-model", "ai", "open-source"],
        owner: {
          login: "facebookresearch",
          avatarUrl: "https://avatars.githubusercontent.com/u/16943930?v=4"
        },
        license: {
          name: "MIT License",
          url: "https://api.github.com/licenses/mit"
        },
        isOpenSource: true
      },
      {
        id: "6",
        name: "diffusers",
        fullName: "huggingface/diffusers",
        description: "🤗 Diffusers: State-of-the-art diffusion models for image and audio generation in PyTorch",
        url: "https://github.com/huggingface/diffusers",
        stars: 28000,
        forks: 4500,
        lastUpdated: "2023-08-07T14:30:00Z",
        language: "Python",
        topics: ["diffusion-models", "generative-ai", "stable-diffusion", "open-source"],
        owner: {
          login: "huggingface",
          avatarUrl: "https://avatars.githubusercontent.com/u/25720743?v=4"
        },
        license: {
          name: "Apache License 2.0",
          url: "https://api.github.com/licenses/apache-2.0"
        },
        isOpenSource: true
      },
      {
        id: "7",
        name: "langchain",
        fullName: "langchain-ai/langchain",
        description: "Building applications with LLMs through composability",
        url: "https://github.com/langchain-ai/langchain",
        stars: 65000,
        forks: 9000,
        lastUpdated: "2023-08-13T08:45:00Z",
        language: "Python",
        topics: ["llm", "ai", "agents", "open-source"],
        owner: {
          login: "langchain-ai",
          avatarUrl: "https://avatars.githubusercontent.com/u/126733545?v=4"
        },
        license: {
          name: "MIT License",
          url: "https://api.github.com/licenses/mit"
        },
        isOpenSource: true
      },
      {
        id: "8",
        name: "whisper",
        fullName: "openai/whisper",
        description: "Robust Speech Recognition via Large-Scale Weak Supervision",
        url: "https://github.com/openai/whisper",
        stars: 47000,
        forks: 5600,
        lastUpdated: "2023-08-05T16:20:00Z",
        language: "Python",
        topics: ["speech-recognition", "audio", "machine-learning", "open-source"],
        owner: {
          login: "openai",
          avatarUrl: "https://avatars.githubusercontent.com/u/14957082?v=4"
        },
        license: {
          name: "MIT License",
          url: "https://api.github.com/licenses/mit"
        },
        isOpenSource: true
      },
      {
        id: "9",
        name: "stable-diffusion",
        fullName: "CompVis/stable-diffusion",
        description: "A latent text-to-image diffusion model",
        url: "https://github.com/CompVis/stable-diffusion",
        stars: 58000,
        forks: 8200,
        lastUpdated: "2023-08-04T13:10:00Z",
        language: "Python",
        topics: ["diffusion-models", "generative-ai", "text-to-image", "open-source"],
        owner: {
          login: "CompVis",
          avatarUrl: "https://avatars.githubusercontent.com/u/92435023?v=4"
        },
        license: {
          name: "MIT License",
          url: "https://api.github.com/licenses/mit"
        },
        isOpenSource: true
      },
      {
        id: "10",
        name: "gpt4all",
        fullName: "nomic-ai/gpt4all",
        description: "Open-source assistant-style LLMs that run locally on your CPU",
        url: "https://github.com/nomic-ai/gpt4all",
        stars: 51000,
        forks: 6800,
        lastUpdated: "2023-08-14T09:50:00Z",
        language: "C++",
        topics: ["llm", "language-model", "ai", "open-source"],
        owner: {
          login: "nomic-ai",
          avatarUrl: "https://avatars.githubusercontent.com/u/99365066?v=4"
        },
        license: {
          name: "MIT License",
          url: "https://api.github.com/licenses/mit"
        },
        isOpenSource: true
      }
    ];
  }
} 