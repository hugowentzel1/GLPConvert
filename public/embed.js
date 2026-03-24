/**
 * GLPConvert / Wellspire — white-label embed launcher (replaces Sunspire solar embed).
 * Meta tags: glpconvert-company, glpconvert-primary, glpconvert-logo
 * Legacy aliases still read: sunspire-company, sunspire-primary, sunspire-logo
 */
(function () {
  "use strict";

  var DEFAULT_ORIGIN =
    (typeof window !== "undefined" && window.__GLPCONVERT_ORIGIN__) ||
    "http://localhost:3000";

  var config = {
    apiUrl: DEFAULT_ORIGIN.replace(/\/$/, ""),
    defaultTheme: {
      primary: "#0f172a",
      company: "Your Clinic",
      logo: null,
    },
  };

  function readMeta(names) {
    for (var i = 0; i < names.length; i++) {
      var el = document.querySelector('meta[name="' + names[i] + '"]');
      if (el && el.getAttribute("content")) return el.getAttribute("content");
    }
    return null;
  }

  function getCompanyInfo() {
    var company =
      readMeta(["glpconvert-company", "sunspire-company"]) ||
      config.defaultTheme.company;
    var primary =
      readMeta(["glpconvert-primary", "sunspire-primary"]) ||
      config.defaultTheme.primary;
    var logo =
      readMeta(["glpconvert-logo", "sunspire-logo"]) || config.defaultTheme.logo;
    return { company: company, primary: primary, logo: logo };
  }

  function createFloatingCTA() {
    if (document.getElementById("glpconvert-floating-cta")) return;

    var company = getCompanyInfo();
    var cta = document.createElement("div");
    cta.id = "glpconvert-floating-cta";
    cta.innerHTML =
      "<style>" +
      "#glpconvert-floating-cta{position:fixed;bottom:20px;right:20px;z-index:999999;font-family:system-ui,-apple-system,sans-serif;}" +
      "#glpconvert-cta-button{background:" +
      company.primary +
      ";color:#fff;border:none;border-radius:50px;padding:14px 22px;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.15);display:flex;align-items:center;gap:8px;}" +
      "#glpconvert-cta-button:hover{transform:translateY(-1px);}" +
      "</style>" +
      '<button type="button" id="glpconvert-cta-button" aria-label="Start intake">' +
      "<span>Book consult</span></button>";

    document.body.appendChild(cta);
    document.getElementById("glpconvert-cta-button").addEventListener("click", openIntake);
  }

  function openIntake() {
    var company = getCompanyInfo();
    var q =
      "company=" +
      encodeURIComponent(company.company) +
      "&primary=" +
      encodeURIComponent(company.primary);
    if (company.logo) q += "&logo=" + encodeURIComponent(company.logo);
    var url = config.apiUrl + "/intake?" + q;
    window.open(
      url,
      "glpconvert-intake",
      "width=1100,height=800,scrollbars=yes,resizable=yes",
    );
  }

  window.openGlpconvertIntake = openIntake;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createFloatingCTA);
  } else {
    createFloatingCTA();
  }
})();
