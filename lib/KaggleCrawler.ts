import axios from 'axios';

// Define Dataset interface
export interface KaggleDataset {
  id: string;
  title: string;
  description: string;
  url: string;
  downloadCount: number;
  voteCount: number;
  lastUpdated: string;
  size: string;
  fileCount: number;
  tags: string[];
  owner: string;
  license: string;
  thumbnailUrl?: string;
  isTabular: boolean;
  usability: number; // A number from 1-10 representing how easy the dataset is to use
}

// Kaggle crawler class for fetching datasets from Kaggle
export class KaggleCrawler {
  private cacheKey = 'kaggle_datasets_cache';
  private cacheExpiryKey = 'kaggle_datasets_cache_expiry';
  private cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  // Main method to get datasets
  public async getDatasets(options: {
    searchTerm?: string;
    tags?: string[];
    minDownloads?: number;
    sortBy?: 'popularity' | 'recency' | 'usability';
    isTabular?: boolean;
    forceRefresh?: boolean;
  } = {}): Promise<KaggleDataset[]> {
    const { 
      searchTerm = '',
      tags = [],
      minDownloads = 0,
      sortBy = 'popularity',
      isTabular,
      forceRefresh = false
    } = options;
    
    try {
      // Check if we need to refresh the cache
      if (forceRefresh) {
        await this.refreshCache();
      }
      
      // Get datasets from cache
      const datasets = await this.getCachedDatasets();
      
      // Filter and sort datasets
      return this.filterAndSortDatasets(datasets, {
        searchTerm,
        tags,
        minDownloads,
        sortBy,
        isTabular
      });
    } catch (error) {
      console.error('Error fetching Kaggle datasets:', error);
      return [];
    }
  }
  
  // Filter and sort datasets based on provided criteria
  private filterAndSortDatasets(
    datasets: KaggleDataset[],
    options: {
      searchTerm?: string;
      tags?: string[];
      minDownloads?: number;
      sortBy?: 'popularity' | 'recency' | 'usability';
      isTabular?: boolean;
    }
  ): KaggleDataset[] {
    const { 
      searchTerm = '',
      tags = [], 
      minDownloads = 0,
      sortBy = 'popularity',
      isTabular
    } = options;
    
    // Filter datasets
    let filtered = datasets.filter(dataset => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by minimum downloads
      const hasMinDownloads = dataset.downloadCount >= minDownloads;
      
      // Filter by tags if any are specified
      const matchesTags = tags.length === 0 || 
        tags.some(tag => dataset.tags.includes(tag));
      
      // Filter by tabular if specified
      const matchesTabular = isTabular === undefined || dataset.isTabular === isTabular;
      
      return matchesSearch && hasMinDownloads && matchesTags && matchesTabular;
    });
    
    // Sort datasets
    switch(sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'recency':
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'usability':
        filtered.sort((a, b) => b.usability - a.usability);
        break;
    }
    
    return filtered;
  }
  
  // Get datasets from cache, fetching if necessary
  private async getCachedDatasets(): Promise<KaggleDataset[]> {
    // In a browser environment, we would use localStorage
    // For server-side, we would use a more appropriate caching method
    let cachedData: KaggleDataset[] = [];
    
    // For the sake of this implementation, we'll simulate a cache check
    const needsRefresh = true; // In a real implementation, we would check the cache expiry
    
    if (needsRefresh) {
      return await this.refreshCache();
    }
    
    return cachedData;
  }
  
  // Refresh the cache of datasets
  private async refreshCache(): Promise<KaggleDataset[]> {
    try {
      const datasets = await this.fetchDatasetsFromKaggle();
      
      // In a real implementation, we would store the datasets in cache
      // and update the expiry time
      
      return datasets;
    } catch (error) {
      console.error('Error refreshing Kaggle dataset cache:', error);
      
      // If fetching fails, return mock data
      return this.getMockDatasets();
    }
  }
  
  // Fetch datasets from Kaggle API
  private async fetchDatasetsFromKaggle(): Promise<KaggleDataset[]> {
    try {
      // NOTE: In a real implementation, we would use the Kaggle API
      // This requires API credentials and proper authentication
      
      // For this demo, we'll just return the mock data
      // as if we fetched it from the Kaggle API
      return this.getMockDatasets();
      
      // Real implementation would be something like:
      /*
      const response = await axios.get('https://www.kaggle.com/api/v1/datasets/list', {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${username}:${key}`).toString('base64')}`
        },
        params: {
          // Add any parameters for the API request
        }
      });
      
      return response.data.map(this.mapKaggleDataset);
      */
    } catch (error) {
      console.error('Error fetching from Kaggle API:', error);
      return this.getMockDatasets();
    }
  }
  
  // Map Kaggle API response to our KaggleDataset interface
  private mapKaggleDataset(apiResponse: any): KaggleDataset {
    return {
      id: apiResponse.id || '',
      title: apiResponse.title || '',
      description: apiResponse.description || '',
      url: apiResponse.url || '',
      downloadCount: apiResponse.downloadCount || 0,
      voteCount: apiResponse.voteCount || 0,
      lastUpdated: apiResponse.lastUpdated || new Date().toISOString(),
      size: apiResponse.size || '0 KB',
      fileCount: apiResponse.fileCount || 0,
      tags: apiResponse.tags || [],
      owner: apiResponse.owner?.name || 'Unknown',
      license: apiResponse.license?.name || 'Unknown',
      thumbnailUrl: apiResponse.thumbnailUrl,
      isTabular: apiResponse.isTabular || false,
      usability: apiResponse.usability || 5
    };
  }
  
  // Get mock datasets for development and testing
  private getMockDatasets(): KaggleDataset[] {
    return [
      {
        id: "census-income",
        title: "Census Income Dataset",
        description: "Predict whether income exceeds $50K/yr based on census data. Also known as 'Adult' dataset.",
        url: "https://www.kaggle.com/datasets/census-income-dataset",
        downloadCount: 358423,
        voteCount: 1245,
        lastUpdated: "2023-03-15T14:23:10Z",
        size: "3.8 MB",
        fileCount: 4,
        tags: ["tabular", "census", "income", "prediction", "classification"],
        owner: "US Census Bureau",
        license: "CC0: Public Domain",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/2175/3630/5503f61a5e6a7b7e54ee3c673c689692/dataset-cover.jpg",
        isTabular: true,
        usability: 9
      },
      {
        id: "mnist-handwritten-digits",
        title: "MNIST Handwritten Digits",
        description: "The classic dataset of handwritten digits. Perfect for beginners in computer vision and deep learning.",
        url: "https://www.kaggle.com/datasets/mnist-handwritten-digits",
        downloadCount: 789652,
        voteCount: 2341,
        lastUpdated: "2023-01-10T09:12:45Z",
        size: "11.6 MB",
        fileCount: 8,
        tags: ["computer vision", "deep learning", "digit recognition", "image classification"],
        owner: "Yann LeCun",
        license: "CC BY-SA 3.0",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/2408/4043/b0fbcf1e8e028138929e5301ac7ae758/dataset-cover.png",
        isTabular: false,
        usability: 10
      },
      {
        id: "amazon-product-reviews",
        title: "Amazon Product Reviews",
        description: "Massive dataset of product reviews from Amazon spanning May 1996 to July 2014.",
        url: "https://www.kaggle.com/datasets/amazon-product-reviews",
        downloadCount: 452187,
        voteCount: 1876,
        lastUpdated: "2023-02-28T18:34:22Z",
        size: "11.8 GB",
        fileCount: 24,
        tags: ["NLP", "sentiment analysis", "e-commerce", "product reviews", "text classification"],
        owner: "Amazon",
        license: "CC0: Public Domain",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/1234/5678/amazon-reviews-cover.jpg",
        isTabular: false,
        usability: 7
      },
      {
        id: "covid19-global-data",
        title: "COVID-19 Global Data",
        description: "Comprehensive dataset of COVID-19 cases, deaths, and recoveries worldwide. Updated daily.",
        url: "https://www.kaggle.com/datasets/covid19-global-data",
        downloadCount: 678941,
        voteCount: 2145,
        lastUpdated: "2023-06-01T00:00:00Z",
        size: "250 MB",
        fileCount: 15,
        tags: ["healthcare", "covid-19", "pandemic", "time series", "global"],
        owner: "Johns Hopkins University",
        license: "CC BY 4.0",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/4567/8910/covid19-dataset-cover.png",
        isTabular: true,
        usability: 9
      },
      {
        id: "netflix-movies-shows",
        title: "Netflix Movies and TV Shows",
        description: "Dataset of Netflix movies and TV shows as of 2021, including cast, directors, ratings, release year, duration, etc.",
        url: "https://www.kaggle.com/datasets/netflix-movies-shows",
        downloadCount: 321456,
        voteCount: 1589,
        lastUpdated: "2023-04-17T11:23:45Z",
        size: "5.2 MB",
        fileCount: 2,
        tags: ["entertainment", "streaming", "movies", "TV shows", "recommendation"],
        owner: "Netflix",
        license: "CC BY-NC-SA 4.0",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/7891/2345/netflix-dataset-cover.jpg",
        isTabular: true,
        usability: 8
      },
      {
        id: "stock-market-data",
        title: "Historical Stock Market Data",
        description: "Historical daily price and volume data for major US stocks and ETFs from 1980 to present.",
        url: "https://www.kaggle.com/datasets/stock-market-data",
        downloadCount: 521378,
        voteCount: 1963,
        lastUpdated: "2023-05-12T16:45:30Z",
        size: "4.7 GB",
        fileCount: 32,
        tags: ["finance", "stocks", "time series", "trading", "investment"],
        owner: "Yahoo Finance",
        license: "CC BY 4.0",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/3456/7891/stocks-dataset-cover.png",
        isTabular: true,
        usability: 7
      },
      {
        id: "imdb-movie-reviews",
        title: "IMDB Movie Reviews Sentiment Analysis",
        description: "50,000 movie reviews specifically for sentiment analysis. Labeled as positive or negative.",
        url: "https://www.kaggle.com/datasets/imdb-movie-reviews",
        downloadCount: 412356,
        voteCount: 1784,
        lastUpdated: "2023-01-25T09:17:23Z",
        size: "80 MB",
        fileCount: 3,
        tags: ["NLP", "sentiment analysis", "movie reviews", "text classification", "binary classification"],
        owner: "Stanford University",
        license: "CC BY-SA 4.0",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/5678/9012/imdb-dataset-cover.jpg",
        isTabular: false,
        usability: 9
      },
      {
        id: "house-prices-advanced-regression",
        title: "House Prices: Advanced Regression Techniques",
        description: "Predict house prices with 79 explanatory variables describing (almost) every aspect of residential homes in Ames, Iowa.",
        url: "https://www.kaggle.com/datasets/house-prices-advanced-regression",
        downloadCount: 623145,
        voteCount: 2103,
        lastUpdated: "2023-03-05T13:24:17Z",
        size: "950 KB",
        fileCount: 4,
        tags: ["regression", "housing", "prediction", "real estate", "tabular"],
        owner: "Kaggle",
        license: "CC0: Public Domain",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/6789/1234/house-prices-dataset-cover.jpg",
        isTabular: true,
        usability: 8
      },
      {
        id: "airbnb-listings-global",
        title: "Airbnb Listings Dataset: Global",
        description: "Detailed listings data from Airbnb for major cities worldwide. Includes pricing, availability, location, features, and reviews.",
        url: "https://www.kaggle.com/datasets/airbnb-listings-global",
        downloadCount: 298745,
        voteCount: 1456,
        lastUpdated: "2023-05-01T10:23:45Z",
        size: "2.3 GB",
        fileCount: 12,
        tags: ["accommodation", "travel", "pricing", "geospatial", "tabular"],
        owner: "Inside Airbnb",
        license: "CC BY 4.0",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/9012/3456/airbnb-dataset-cover.png",
        isTabular: true,
        usability: 7
      },
      {
        id: "global-climate-change",
        title: "Global Climate Change Data",
        description: "Comprehensive dataset on global climate indicators including temperature, precipitation, sea levels, and carbon emissions from 1850 to present.",
        url: "https://www.kaggle.com/datasets/global-climate-change",
        downloadCount: 356789,
        voteCount: 1879,
        lastUpdated: "2023-06-10T08:14:35Z",
        size: "1.8 GB",
        fileCount: 18,
        tags: ["climate", "environment", "time series", "global warming", "scientific"],
        owner: "NASA & NOAA",
        license: "CC BY 4.0",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/2345/6789/climate-dataset-cover.jpg",
        isTabular: true,
        usability: 8
      },
      {
        id: "credit-card-fraud",
        title: "Credit Card Fraud Detection",
        description: "Anonymized credit card transactions labeled as fraudulent or genuine. Highly imbalanced dataset great for anomaly detection.",
        url: "https://www.kaggle.com/datasets/credit-card-fraud",
        downloadCount: 487623,
        voteCount: 1936,
        lastUpdated: "2023-02-18T15:45:12Z",
        size: "150 MB",
        fileCount: 2,
        tags: ["fraud detection", "anomaly detection", "imbalanced classification", "financial", "security"],
        owner: "ULB Machine Learning Group",
        license: "CC BY-SA 4.0",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/8901/2345/fraud-dataset-cover.png",
        isTabular: true,
        usability: 9
      },
      {
        id: "open-images-dataset",
        title: "Open Images Dataset",
        description: "Massive dataset of 9M images with image-level labels, object bounding boxes, object segmentation masks, and visual relationships.",
        url: "https://www.kaggle.com/datasets/open-images-dataset",
        downloadCount: 245789,
        voteCount: 1345,
        lastUpdated: "2023-04-30T12:34:56Z",
        size: "565 GB",
        fileCount: 105,
        tags: ["computer vision", "object detection", "image segmentation", "image classification", "visual relationships"],
        owner: "Google",
        license: "CC BY 4.0",
        thumbnailUrl: "https://storage.googleapis.com/kaggle-datasets-images/7890/1234/openimages-dataset-cover.jpg",
        isTabular: false,
        usability: 6
      }
    ];
  }
} 