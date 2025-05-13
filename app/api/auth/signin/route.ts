import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    // Here you would typically verify the credentials with your user store
    // For now, we'll just return a success response for testing
    
    // Validate required fields
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400 }
      );
    }
    
    // Mock successful login
    // In a real app, you'd authenticate and create a session here
    return new NextResponse(
      JSON.stringify({ 
        message: 'User signed in successfully',
        user: {
          id: 'mocked-user-id',
          email,
          name: 'Test User'
        }
      }),
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error during sign in:', error);
    return new NextResponse(
      JSON.stringify({ message: 'An error occurred during sign in' }),
      { status: 500 }
    );
  }
}