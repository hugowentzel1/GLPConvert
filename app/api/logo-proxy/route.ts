import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set([
  'logo.clearbit.com',
  'res.cloudinary.com',
  'i.imgur.com',
  'images.unsplash.com',
  'cdn.jsdelivr.net',
]);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const logoUrl = new URL(url);
    
    // Validate hostname
    if (!ALLOWED_HOSTS.has(logoUrl.hostname)) {
      return NextResponse.json({ error: 'Hostname not allowed' }, { status: 403 });
    }

    // Extract domain for fallback (do this before fetch in case it fails)
    let domain = '';
    if (logoUrl.hostname === 'logo.clearbit.com') {
      // Path is like /apple.com, extract domain (remove leading slash)
      domain = logoUrl.pathname.replace(/^\//, '');
    } else {
      domain = logoUrl.hostname;
    }
    
    // Try Clearbit first
    let response: Response | null = null;
    try {
      response = await fetch(logoUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.google.com/',
          'Origin': 'https://www.google.com',
        },
        redirect: 'follow',
      });
    } catch (fetchError) {
      console.warn('Clearbit fetch error:', fetchError);
    }

    // If Clearbit works, use it
    if (response && response.ok) {
      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/png';
      
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Clearbit failed - use Google Favicon API as fallback (this always works)
    console.warn(`Clearbit failed for ${url}, using Google Favicon fallback for domain: ${domain}`);
    
    if (domain) {
      try {
        const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Sunspire/1.0)',
            'Accept': 'image/*',
          },
        });
        
        if (fallbackResponse.ok) {
          const fallbackBuffer = await fallbackResponse.arrayBuffer();
          return new NextResponse(fallbackBuffer, {
            status: 200,
            headers: {
              'Content-Type': fallbackResponse.headers.get('content-type') || 'image/png',
              'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      } catch (fallbackError) {
        console.warn('Google Favicon fallback also failed:', fallbackError);
      }
    }
    
    // Final fallback: return transparent 1x1 PNG
    return new NextResponse(
      Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
      {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Logo proxy error:', error);
    // Return transparent 1x1 PNG on error
    return new NextResponse(
      Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
      {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  }
}
