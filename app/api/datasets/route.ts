import { NextRequest, NextResponse } from 'next/server';
import { DataCrawler } from '@/lib/DataCrawler';

// This makes the route compatible with static exports
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Get DataCrawler instance
    const dataCrawler = DataCrawler.getInstance();
    
    // Get filtered datasets
    let datasets;
    if (category || search) {
      datasets = await dataCrawler.getFilteredDatasets(category, search);
    } else {
      datasets = await dataCrawler.getDatasets(forceRefresh);
    }
    
    return NextResponse.json({ 
      success: true,
      count: datasets.length,
      datasets 
    });
  } catch (error) {
    console.error('Dataset API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch datasets',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 