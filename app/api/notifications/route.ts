import { NextResponse } from 'next/server'
import { getNotifications } from '@/lib/data'

export async function GET() {
  const notifications = await getNotifications(10)
  return NextResponse.json(notifications)
}
