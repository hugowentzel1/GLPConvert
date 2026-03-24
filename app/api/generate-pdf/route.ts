import { NextRequest, NextResponse } from 'next/server';

// Ensure Node.js runtime for this endpoint
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Health check endpoint for monitoring
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'pdf-generator',
    message: 'PDF generation service is available' 
  });
}

export async function POST(request: NextRequest) {
  try {
    const { address, lat, lng, placeId, estimate } = await request.json();
    
    if (!estimate) {
      return NextResponse.json({ error: 'Estimate data required' }, { status: 400 });
    }

    // For now, return a simple text response
    // In production, you'd use a PDF library like puppeteer or @react-pdf/renderer
    const pdfContent = `
Solar Quote Report
================

Address: ${address || 'N/A'}
Location: ${lat}, ${lng}
Date: ${new Date().toLocaleDateString()}

System Details:
- Annual Production: ${typeof estimate.annualProductionKWh === 'object' 
  ? `${estimate.annualProductionKWh.estimate.toLocaleString()} kWh`
  : `${estimate.annualProductionKWh?.toLocaleString() || 'N/A'} kWh`
}
- System Size: ${estimate.systemSizeKW || 'N/A'} kW
- Net Cost: $${estimate.netCostAfterITC?.toLocaleString() || 'N/A'}
- Year 1 Savings: ${typeof estimate.year1Savings === 'object'
  ? `$${estimate.year1Savings.estimate.toLocaleString()}`
  : `$${estimate.year1Savings?.toLocaleString() || 'N/A'}`
}
- Payback Period: ${estimate.paybackYear || 'N/A'} years
- 25-Year NPV: $${estimate.npv25Year?.toLocaleString() || 'N/A'}

Data Sources:
- Solar Data: ${estimate.dataSource || 'NREL NSRDB'}
- Utility Rate: ${estimate.tariff || 'Standard Rate'}
- Shading Analysis: Proxy (estimated)

This is a sample PDF report. In production, this would be a properly formatted PDF.
    `;

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="solar-quote.pdf"'
      }
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
