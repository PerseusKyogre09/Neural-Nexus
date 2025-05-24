import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/models/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime for this route
export const runtime = 'nodejs';

// POST /api/user/avatar - Upload user avatar
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }
    
    // Get the form data
    const formData = await req.formData();
    const avatarFile = formData.get('avatar') as File;
    
    if (!avatarFile) {
      return NextResponse.json(
        { error: 'No avatar file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatarFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }
    
    // Read file as buffer
    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `avatar-${session.user.id}-${timestamp}.${avatarFile.name.split('.').pop()}`;
    
    // In a real app, you would upload to cloud storage here
    // For this example, we'll simulate a successful upload and return a fake URL
    // This would normally be where you'd use Supabase Storage, AWS S3, etc.
    
    // Fake URL for demo purposes - in production replace with actual upload code
    const avatarUrl = `https://yourdomain.com/uploads/${filename}`;
    
    // Update user profile with new avatar URL
    const success = await UserService.updateUser(session.user.id, {
      avatar: avatarUrl
    });
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update user avatar' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      avatar: avatarUrl
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
} 