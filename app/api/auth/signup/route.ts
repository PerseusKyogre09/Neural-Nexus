import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, displayName } = await req.json();
    
    // Here you would typically handle user registration with your user store
    // For now, we'll just return a success response for testing
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }
    
    // Mock successful registration
    return new NextResponse(
      JSON.stringify({ 
        message: 'User registered successfully',
        user: {
          id: 'mocked-user-id',
          firstName,
          lastName,
          email,
          displayName: displayName || firstName
        }
      }),
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error during registration:', error);
    return new NextResponse(
      JSON.stringify({ message: 'An error occurred during registration' }),
      { status: 500 }
    );
  }
} 