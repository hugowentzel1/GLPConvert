// Sunspire White-Label Solar Tool Embed Script
(function () {
  "use strict";

  // Configuration
  const config = {
    apiUrl: "https://sunspire-web-app.vercel.app",
    defaultTheme: {
      primary: "#16A34A",
      company: "Solar Company",
      logo: null,
    },
  };

  // Extract company info from current page
  function getCompanyInfo() {
    // Try to get company info from meta tags
    const companyMeta = document.querySelector('meta[name="sunspire-company"]');
    const primaryMeta = document.querySelector('meta[name="sunspire-primary"]');
    const logoMeta = document.querySelector('meta[name="sunspire-logo"]');

    return {
      company: companyMeta?.content || config.defaultTheme.company,
      primary: primaryMeta?.content || config.defaultTheme.primary,
      logo: logoMeta?.content || config.defaultTheme.logo,
    };
  }

  // Create the floating CTA button
  function createFloatingCTA() {
    const company = getCompanyInfo();

    const cta = document.createElement("div");
    cta.id = "sunspire-floating-cta";
    cta.innerHTML = `
      <style>
        #sunspire-floating-cta {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #sunspire-cta-button {
          background: ${company.primary};
          color: white;
          border: none;
          border-radius: 50px;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        #sunspire-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.2);
        }
        
        #sunspire-cta-button:active {
          transform: translateY(0);
        }
        
        .sunspire-icon {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
      </style>
      
      <button id="sunspire-cta-button" onclick="openSunspireTool()">
        <span class="sunspire-icon">☀️</span>
        Get Solar Quote
      </button>
    `;

    document.body.appendChild(cta);
  }

  // Open the solar tool in a modal or new window
  function openSunspireTool() {
    const company = getCompanyInfo();
    const url = `${config.apiUrl}/?company=${encodeURIComponent(company.company)}&primary=${encodeURIComponent(company.primary)}${company.logo ? `&logo=${encodeURIComponent(company.logo)}` : ""}`;

    // Open in new window/tab
    window.open(
      url,
      "sunspire-solar-tool",
      "width=1200,height=800,scrollbars=yes,resizable=yes",
    );
  }

  // Make function globally available
  window.openSunspireTool = openSunspireTool;

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createFloatingCTA);
  } else {
    createFloatingCTA();
  }

  // Also add to window load for late-loading sites
  window.addEventListener("load", createFloatingCTA);

  console.log("☀️ Sunspire Solar Tool loaded successfully!");
})();
