import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!genAI) {
      return NextResponse.json({ error: 'Gemini API not configured' }, { status: 500 });
    }

    // Parse request
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Call Gemini Vision
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash' });
    
    const prompt = `You are an expert in American Sign Language (ASL) alphabet recognition.

Look at this image and identify which ASL alphabet letter (A-Z) the hand is showing.

IMPORTANT RULES:
1. Only respond with a SINGLE letter (A-Z)
2. If you see a clear ASL hand shape, respond with that letter
3. If the hand is not showing a clear ASL letter, respond with "NONE"
4. Be confident - ASL letters have distinct hand shapes

Common ASL letters:
- A: Fist with thumb on side
- B: Flat hand, 4 fingers up together
- C: Curved hand like letter C
- D: Index finger up, other fingers touching thumb
- V: Index and middle fingers up in V shape
- L: Index up, thumb out at 90 degrees
- O: All fingers forming circle
- Y: Thumb and pinky out

Respond with ONLY the letter (A-Z) or "NONE". Nothing else.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().trim().toUpperCase();

    // Parse response
    const letter = text.match(/^[A-Z]$/)?.[0] || 'NONE';

    return NextResponse.json({
      letter: letter === 'NONE' ? '' : letter,
      reasoning: text,
    });
  } catch (error) {
    console.error('ASL detection error:', error);
    return NextResponse.json(
      { error: 'Detection failed' },
      { status: 500 }
    );
  }
}
