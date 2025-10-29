// client/src/app/api/chat/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();

    // Forward to Python backend
    const backendResponse = await fetch('https://green-nexus-1.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}