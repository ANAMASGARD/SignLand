import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { refineText } from '@/lib/gemini/client';

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { tokens, context, language } = body;

    // Validate input
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return NextResponse.json({ error: 'Invalid tokens' }, { status: 400 });
    }

    // Refine text using Gemini
    const result = await refineText({
      tokens,
      context: context || [],
      language: language || 'en-US',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Refine API error:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Failed to refine text', details: error.message },
      { status: 500 }
    );
  }
}
