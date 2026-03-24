export const addrs = {
  short: '123 W Peachtree St NW, Atlanta, GA 30309, USA',
  medium: 'Absh ile Ln, Tennessee 37323, USA', // intentionally odd spacing, tests balancer
  long: '12345 Sassafras Lane Southwest, Mountain Park, GA 30047, United States of America'
};

export const tenancies = {
  demo: (addr: string) => `/report?address=${encodeURIComponent(addr)}&runsLeft=0&demo=1`,
  paid: (addr: string) => `/paid?address=${encodeURIComponent(addr)}&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`
};

export async function lineCount(locator: any) {
  return locator.evaluate((node: HTMLElement) => {
    const cs = getComputedStyle(node);
    const lh = parseFloat(cs.lineHeight);
    const h = node.getBoundingClientRect().height;
    return Math.round(h / lh);
  });
}

export async function gap(page: any, aSel: string, bSel: string) {
  const a = page.locator(aSel);
  const b = page.locator(bSel);
  const ab = await a.boundingBox();
  const bb = await b.boundingBox();
  return Math.round(bb!.y - (ab!.y + ab!.height)); // vertical gap in px
}

export const companies = {
  google: {
    name: 'Google',
    color: '#4285F4',
    logo: 'https://logo.clearbit.com/google.com'
  },
  apple: {
    name: 'Apple', 
    color: '#0071E3',
    logo: 'https://logo.clearbit.com/apple.com'
  },
  sunrun: {
    name: 'Sunrun',
    color: '#FF6B35', 
    logo: 'https://logo.clearbit.com/sunrun.com'
  },
  tesla: {
    name: 'Tesla',
    color: '#CC0000',
    logo: 'https://logo.clearbit.com/tesla.com'
  }
};
