import axios from 'axios';

// Types for the database entries
export interface DatasetEntry {
  id: string;
  name: string;
  description: string;
  source: string; // 'kaggle', 'huggingface', etc.
  url: string;
  tags: string[];
  size?: string;
  downloadCount?: number;
  lastUpdated?: string;
  imageUrl?: string;
  category: string; // 'vision', 'nlp', 'tabular', etc.
}

// Main crawler service to fetch and cache dataset information
export class DataCrawler {
  private static instance: DataCrawler;
  private cache: {
    datasets: DatasetEntry[];
    lastUpdated: Date;
  };

  private constructor() {
    this.cache = {
      datasets: [],
      lastUpdated: new Date(0) // Set to epoch time initially
    };
  }

  public static getInstance(): DataCrawler {
    if (!DataCrawler.instance) {
      DataCrawler.instance = new DataCrawler();
    }
    return DataCrawler.instance;
  }

  // Check if cache needs refreshing (older than 24 hours)
  private isCacheStale(): boolean {
    const now = new Date();
    const cacheAge = now.getTime() - this.cache.lastUpdated.getTime();
    const DAY_IN_MS = 24 * 60 * 60 * 1000;
    return cacheAge > DAY_IN_MS;
  }

  // Main method to get datasets
  public async getDatasets(forceRefresh = false): Promise<DatasetEntry[]> {
    if (forceRefresh || this.isCacheStale() || this.cache.datasets.length === 0) {
      await this.refreshCache();
    }
    return this.cache.datasets;
  }

  // Method to filter datasets by category or search term
  public async getFilteredDatasets(
    category: string = '',
    searchTerm: string = ''
  ): Promise<DatasetEntry[]> {
    const datasets = await this.getDatasets();
    
    return datasets.filter(dataset => {
      const matchesCategory = category === '' || dataset.category === category;
      const matchesSearch = searchTerm === '' || 
        dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }

  // Private method to refresh the cache by fetching from different sources
  private async refreshCache(): Promise<void> {
    console.log('🔄 Refreshing dataset cache...');
    
    try {
      const datasets = [
        ...await this.fetchKaggleDatasets(),
        ...await this.fetchHuggingFaceDatasets(),
        ...await this.fetchPublicDatasets()
      ];
      
      this.cache = {
        datasets,
        lastUpdated: new Date()
      };
      
      console.log(`✅ Cache refreshed with ${datasets.length} datasets`);
    } catch (error) {
      console.error('Error refreshing dataset cache:', error);
      // If cache refresh fails but we have existing data, keep using it
      if (this.cache.datasets.length === 0) {
        // Fallback to mock data if we have nothing
        this.cache.datasets = this.getMockDatasets();
        this.cache.lastUpdated = new Date();
      }
    }
  }

  // In a real implementation, these would use API keys and proper API calls
  private async fetchKaggleDatasets(): Promise<DatasetEntry[]> {
    // In a production app, this would use the Kaggle API with proper authentication
    // For demo purposes, returning mock data
    console.log('Fetching Kaggle datasets...');
    return this.getMockKaggleDatasets();
  }

  private async fetchHuggingFaceDatasets(): Promise<DatasetEntry[]> {
    // In a production app, this would use the HuggingFace API
    console.log('Fetching HuggingFace datasets...');
    return this.getMockHuggingFaceDatasets();
  }

  private async fetchPublicDatasets(): Promise<DatasetEntry[]> {
    // This would fetch from other public dataset repositories
    console.log('Fetching other public datasets...');
    return this.getMockPublicDatasets();
  }

  // Mock data for demonstration purposes
  private getMockDatasets(): DatasetEntry[] {
    return [
      ...this.getMockKaggleDatasets(),
      ...this.getMockHuggingFaceDatasets(),
      ...this.getMockPublicDatasets()
    ];
  }

  private getMockKaggleDatasets(): DatasetEntry[] {
    return [
      {
        id: 'k1',
        name: 'COCO 2017',
        description: 'Common Objects in Context - The dataset for object detection, segmentation, and captioning with over 330K images.',
        source: 'kaggle',
        url: 'https://www.kaggle.com/datasets/awsaf49/coco-2017-dataset',
        tags: ['vision', 'object-detection', 'image-segmentation', 'captioning'],
        size: '19GB',
        downloadCount: 154820,
        lastUpdated: '2023-03-15',
        imageUrl: 'https://storage.googleapis.com/kaggle-datasets-images/1742919/2880949/caeadfdf7d27fe43f5bba09260c25458/dataset-cover.jpg',
        category: 'vision'
      },
      {
        id: 'k2',
        name: 'Sentiment140',
        description: 'Twitter sentiment analysis dataset with 1.6M tweets labeled for sentiment analysis.',
        source: 'kaggle',
        url: 'https://www.kaggle.com/datasets/kazanova/sentiment140',
        tags: ['nlp', 'sentiment-analysis', 'twitter', 'social-media'],
        size: '238MB',
        downloadCount: 98765,
        lastUpdated: '2022-11-02',
        imageUrl: 'https://storage.googleapis.com/kaggle-datasets-images/18/18/default-backgrounds/dataset-card.jpg',
        category: 'nlp'
      },
      {
        id: 'k3',
        name: 'Google Stock Data',
        description: 'Historical stock data for Google/Alphabet with daily prices and trading volumes.',
        source: 'kaggle',
        url: 'https://www.kaggle.com/datasets/shreenidhihipparagi/google-stock-prediction',
        tags: ['finance', 'time-series', 'stock-market', 'prediction'],
        size: '115KB',
        downloadCount: 43210,
        lastUpdated: '2023-05-20',
        imageUrl: 'https://storage.googleapis.com/kaggle-datasets-images/1416523/2440575/99e1166c1d7503f551a01b377c28dea4/dataset-cover.jpg',
        category: 'tabular'
      },
      {
        id: 'k4',
        name: 'Chest X-Ray Images (Pneumonia)',
        description: 'Medical imaging dataset with chest X-rays for pneumonia detection and classification.',
        source: 'kaggle',
        url: 'https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia',
        tags: ['medical', 'vision', 'x-ray', 'healthcare'],
        size: '2.29GB',
        downloadCount: 76543,
        lastUpdated: '2022-09-10',
        imageUrl: 'https://storage.googleapis.com/kaggle-datasets-images/140734/338809/c53df0c328659839579e9a9e7da8c887/dataset-cover.jpg',
        category: 'vision'
      },
      {
        id: 'k5',
        name: 'Bitcoin Historical Data',
        description: 'Comprehensive Bitcoin price and volume data from 2013 to present with minute-level granularity.',
        source: 'kaggle',
        url: 'https://www.kaggle.com/datasets/mczielinski/bitcoin-historical-data',
        tags: ['cryptocurrency', 'finance', 'time-series', 'blockchain'],
        size: '358MB',
        downloadCount: 54321,
        lastUpdated: '2023-06-15',
        imageUrl: 'https://storage.googleapis.com/kaggle-datasets-images/32089/42145/b1ca1d2c48bb5723e9eef9c2fb843a6a/dataset-cover.jpg',
        category: 'tabular'
      }
    ];
  }

  private getMockHuggingFaceDatasets(): DatasetEntry[] {
    return [
      {
        id: 'hf1',
        name: 'GLUE Benchmark',
        description: 'General Language Understanding Evaluation benchmark - collection of resources for training and evaluating NLP systems.',
        source: 'huggingface',
        url: 'https://huggingface.co/datasets/glue',
        tags: ['nlp', 'benchmark', 'language-understanding', 'evaluation'],
        downloadCount: 87654,
        lastUpdated: '2023-01-20',
        category: 'nlp'
      },
      {
        id: 'hf2',
        name: 'SQUAD',
        description: 'Stanford Question Answering Dataset with 100K+ question-answer pairs on Wikipedia articles.',
        source: 'huggingface',
        url: 'https://huggingface.co/datasets/squad',
        tags: ['nlp', 'question-answering', 'reading-comprehension'],
        downloadCount: 65432,
        lastUpdated: '2022-12-05',
        category: 'nlp'
      },
      {
        id: 'hf3',
        name: 'WikiText',
        description: 'Long-term dependency language modeling dataset with over 100M tokens extracted from verified Wikipedia articles.',
        source: 'huggingface',
        url: 'https://huggingface.co/datasets/wikitext',
        tags: ['nlp', 'language-modeling', 'wikipedia', 'long-context'],
        downloadCount: 45678,
        lastUpdated: '2022-10-15',
        category: 'nlp'
      }
    ];
  }

  private getMockPublicDatasets(): DatasetEntry[] {
    return [
      {
        id: 'p1',
        name: 'Berkeley DeepDrive',
        description: 'Large-scale driving dataset for autonomous driving research with 100K videos and 1100 hours of driving experience.',
        source: 'public',
        url: 'https://bdd-data.berkeley.edu/',
        tags: ['vision', 'autonomous-driving', 'object-detection', 'segmentation'],
        size: '1.8TB',
        category: 'vision'
      },
      {
        id: 'p2',
        name: 'Open Images',
        description: 'Dataset of ~9M images with image-level labels, object bounding boxes, visual relationships, and more.',
        source: 'public',
        url: 'https://storage.googleapis.com/openimages/web/index.html',
        tags: ['vision', 'object-detection', 'image-classification', 'segmentation'],
        size: '565GB',
        category: 'vision'
      },
      {
        id: 'p3',
        name: 'UCI Machine Learning Repository',
        description: 'Collection of databases, domain theories, and data generators used by the machine learning community.',
        source: 'public',
        url: 'https://archive.ics.uci.edu/ml/index.php',
        tags: ['tabular', 'classification', 'regression', 'clustering'],
        category: 'tabular'
      }
    ];
  }
}

export default DataCrawler.getInstance(); 