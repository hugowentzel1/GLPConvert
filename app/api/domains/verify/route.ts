import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Check CNAME record
    const cnameTarget = process.env.VERCEL_CNAME_TARGET || 'cname.vercel-dns.com';
    
    try {
      const dns = await import('dns').then(m => m.promises);
      const records = await dns.resolveCname(domain);
      const hasCorrectCname = records.some(record => record.includes(cnameTarget));
      
      return NextResponse.json({ 
        verified: hasCorrectCname,
        domain,
        cnameTarget 
      });
    } catch (error) {
      return NextResponse.json({ 
        verified: false, 
        error: 'DNS lookup failed',
        domain 
      });
    }
  } catch (error) {
    console.error('Domain verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}