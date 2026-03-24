import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { domain, tenantSlug } = await request.json();
    
    if (!domain || !tenantSlug) {
      return NextResponse.json({ error: 'Domain and tenantSlug are required' }, { status: 400 });
    }

    const vercelToken = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    
    if (!vercelToken || !projectId) {
      return NextResponse.json({ error: 'Vercel configuration missing' }, { status: 500 });
    }

    // Add domain to Vercel project
    const vercelResponse = await fetch(`https://api.vercel.com/v10/projects/${projectId}/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain,
        redirect: `https://${tenantSlug}.out.sunspire.app`
      })
    });

    if (!vercelResponse.ok) {
      const error = await vercelResponse.text();
      console.error('Vercel domain attachment failed:', error);
      return NextResponse.json({ error: 'Failed to attach domain' }, { status: 500 });
    }

    const result = await vercelResponse.json();
    
    return NextResponse.json({ 
      success: true, 
      domain: result.name,
      tenantSlug 
    });
  } catch (error) {
    console.error('Domain attachment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}