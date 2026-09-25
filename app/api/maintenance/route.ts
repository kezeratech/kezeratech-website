import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data } = await supabase
      .from('site_settings')
      .select('maintenance_mode, maintenance_message')
      .limit(1)
      .single();

    return NextResponse.json({
      maintenance_mode: data?.maintenance_mode ?? false,
      maintenance_message: data?.maintenance_message ?? '',
    }, {
      // Tell the browser and middleware never to cache this response
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch {
    return NextResponse.json({ maintenance_mode: false, maintenance_message: '' });
  }
}
