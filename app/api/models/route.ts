import { NextRequest, NextResponse } from 'next/server';
import { ModelService, ModelCategory, ModelFramework } from '@/lib/models/model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';

// This can use Edge Runtime since it's a lightweight operation
export const runtime = 'edge';

// GET /api/models - Get all models with optional filters and pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') as ModelCategory | undefined;
    const framework = searchParams.get('framework') as ModelFramework | undefined;
    const sortBy = searchParams.get('sortBy') as 'newest' | 'popular' | 'downloads' | 'stars' | 'rating' || 'newest';
    
    const result = await ModelService.getAllModels(page, limit, category, framework, sortBy);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

// POST /api/models - Create a new model
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to create a model' },
        { status: 401 }
      );
    }
    
    const modelData = await req.json();
    
    // Validate required fields
    if (!modelData.name || !modelData.description || !modelData.category || !modelData.framework) {
      return NextResponse.json(
        { error: 'Name, description, category, and framework are required' },
        { status: 400 }
      );
    }
    
    // Generate slug from name if not provided
    if (!modelData.slug) {
      modelData.slug = slugify(modelData.name, { 
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
    }
    
    // Add creator information from session
    modelData.creator = {
      id: session.user.id,
      name: session.user.name || session.user.username,
      avatar: session.user.image
    };
    
    // Ensure versions array with at least one version
    if (!modelData.versions || !modelData.versions.length) {
      return NextResponse.json(
        { error: 'At least one version is required' },
        { status: 400 }
      );
    }
    
    // Set current version to latest version by default
    if (!modelData.currentVersion) {
      modelData.currentVersion = modelData.versions[0].version;
    }
    
    // Create model in database
    const newModel = await ModelService.createModel(modelData);
    
    return NextResponse.json(newModel, { status: 201 });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    );
  }
}

// PUT /api/models - Update an existing model
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to update a model' },
        { status: 401 }
      );
    }
    
    const { id, ...updates } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }
    
    // Get the model to verify ownership
    const model = await ModelService.getModelById(id);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the creator or an admin
    if (model.creator.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update your own models' },
        { status: 403 }
      );
    }
    
    // Update slug if name is changed and slug isn't explicitly provided
    if (updates.name && !updates.slug) {
      updates.slug = slugify(updates.name, { 
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
    }
    
    // Update model in database
    const success = await ModelService.updateModel(id, updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update model' },
        { status: 400 }
      );
    }
    
    // Get updated model
    const updatedModel = await ModelService.getModelById(id);
    
    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error('Error updating model:', error);
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    );
  }
}

// DELETE /api/models - Delete a model
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to delete a model' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }
    
    // Get the model to verify ownership
    const model = await ModelService.getModelById(id);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the creator or an admin
    if (model.creator.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete your own models' },
        { status: 403 }
      );
    }
    
    // Delete model from database
    const success = await ModelService.deleteModel(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete model' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    );
  }
} 