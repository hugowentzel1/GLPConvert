"use client";

import Script from "next/script";

/**
 * Optional Meta Pixel + GA4. Set in Vercel / .env.local:
 * NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GA_MEASUREMENT_ID
 */
export default function AttributionPixels() {
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      {metaId ? (
        <>
          <Script id="glp-meta-pixel" strategy="afterInteractive">
            {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaId}');
fbq('track','PageView');
            `.trim()}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              className="hidden"
              alt=""
              src={`https://www.facebook.com/tr?id=${encodeURIComponent(metaId)}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      ) : null}
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="glp-ga4" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config','${gaId}', { send_page_view: true });
            `.trim()}
          </Script>
        </>
      ) : null}
    </>
  );
}
