import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/models/model';

// POST /api/models/version - Add a new version to a model
export async function POST(req: NextRequest) {
  try {
    // In a production app, you would need to authenticate the user here
    // For now, we'll simulate a user context
    const userId = "demo-user-id";
    const userRole = "admin";
    
    const { modelId, version } = await req.json();
    
    if (!modelId || !version) {
      return NextResponse.json(
        { error: 'Model ID and version data are required' },
        { status: 400 }
      );
    }
    
    // Get the model to verify ownership
    const model = await ModelService.getModelById(modelId);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the creator or an admin
    if (model.creator.id !== userId && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only add versions to your own models' },
        { status: 403 }
      );
    }
    
    // Add version to model
    const success = await ModelService.addModelVersion(modelId, version);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to add version' },
        { status: 400 }
      );
    }
    
    // Get updated model
    const updatedModel = await ModelService.getModelById(modelId);
    
    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error('Error adding model version:', error);
    return NextResponse.json(
      { error: 'Failed to add model version' },
      { status: 500 }
    );
  }
} 