// Test demo detection
const isDemoFromSearch = (sp) => {
  return sp.get("demo") === "1" || sp.get("demo") === "true";
};

const sp = new URLSearchParams('company=Apple&demo=1');
console.log('isDemoFromSearch result:', isDemoFromSearch(sp));
console.log('demo param:', sp.get('demo'));
console.log('company param:', sp.get('company'));
console.log('hasCompany:', !!sp.get('company'));
console.log('urlEnabled:', isDemoFromSearch(sp) || !!sp.get('company'));
