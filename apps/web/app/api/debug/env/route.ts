import { NextResponse } from 'next/server'

// Ensure this route is always dynamic and not statically evaluated
export const dynamic = 'force-dynamic'

export async function GET() {
  // Avoid importing config at module load to prevent env parse errors during build
  const AI_PRIMARY_MODEL = process.env.AI_PRIMARY_MODEL
  const AI_FALLBACK_MODEL = process.env.AI_FALLBACK_MODEL
  const AI_IMAGE_MODEL = process.env.AI_IMAGE_MODEL

  return NextResponse.json({
    AI_PRIMARY_MODEL,
    AI_FALLBACK_MODEL,
    AI_IMAGE_MODEL,
    env_AI_PRIMARY_MODEL: AI_PRIMARY_MODEL,
    env_AI_FALLBACK_MODEL: AI_FALLBACK_MODEL,
  })
}
