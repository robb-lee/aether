import { NextResponse } from 'next/server';
import { config } from '@aether/ai-engine/config';

export async function GET() {
  return NextResponse.json({
    AI_PRIMARY_MODEL: config.AI_PRIMARY_MODEL,
    AI_FALLBACK_MODEL: config.AI_FALLBACK_MODEL,
    AI_IMAGE_MODEL: config.AI_IMAGE_MODEL,
    env_AI_PRIMARY_MODEL: process.env.AI_PRIMARY_MODEL,
    env_AI_FALLBACK_MODEL: process.env.AI_FALLBACK_MODEL,
  });
}