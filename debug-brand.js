// Debug script to test brand takeover
const url = "http://localhost:3000/paid?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com";
const urlObj = new URL(url);
const searchParams = urlObj.searchParams;

console.log("URL:", url);
console.log("Search params:");
console.log("company:", searchParams.get("company"));
console.log("brandColor:", searchParams.get("brandColor"));
console.log("logo:", searchParams.get("logo"));

// Test the brand takeover logic
const sp = searchParams;
const companyName = sp.get("company") || sp.get("brand") || "Your Company";
const customColor = sp.get("primary") || sp.get("brandColor");
const logo = sp.get("logo");

console.log("\nBrand takeover values:");
console.log("companyName:", companyName);
console.log("customColor:", customColor);
console.log("logo:", logo);
