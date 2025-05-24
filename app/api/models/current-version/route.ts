import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/models/model';

// PATCH /api/models/current-version - Set the current version of a model
export async function PATCH(req: NextRequest) {
  try {
    // In a production app, you would need to authenticate the user here
    // For now, we'll simulate a user context
    const userId = "demo-user-id";
    const userRole = "admin";
    
    const { modelId, version } = await req.json();
    
    if (!modelId || !version) {
      return NextResponse.json(
        { error: 'Model ID and version are required' },
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
        { error: 'Unauthorized - You can only update versions of your own models' },
        { status: 403 }
      );
    }
    
    // Set current version
    const success = await ModelService.setCurrentVersion(modelId, version);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to set current version' },
        { status: 400 }
      );
    }
    
    // Get updated model
    const updatedModel = await ModelService.getModelById(modelId);
    
    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error('Error updating model version:', error);
    return NextResponse.json(
      { error: 'Failed to update model version' },
      { status: 500 }
    );
  }
} 