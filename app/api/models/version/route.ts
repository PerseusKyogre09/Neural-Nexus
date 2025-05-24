import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/models/model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/models/version - Add a new version to a model
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to add a model version' },
        { status: 401 }
      );
    }
    
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
    if (model.creator.id !== session.user.id && session.user.role !== 'admin') {
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