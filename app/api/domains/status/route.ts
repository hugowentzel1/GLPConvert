import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const vercelToken = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    
    if (!vercelToken || !projectId) {
      return NextResponse.json({ error: 'Vercel configuration missing' }, { status: 500 });
    }

    // Check domain status in Vercel
    const vercelResponse = await fetch(`https://api.vercel.com/v10/projects/${projectId}/domains/${domain}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
      }
    });

    if (!vercelResponse.ok) {
      return NextResponse.json({ 
        status: 'not_found',
        domain 
      });
    }

    const result = await vercelResponse.json();
    
    return NextResponse.json({ 
      status: result.status || 'active',
      domain: result.name,
      verified: result.verified || false
    });
  } catch (error) {
    console.error('Domain status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}