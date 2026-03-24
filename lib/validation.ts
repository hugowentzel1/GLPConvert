export function validateSolarInputs(inputs: any) {
  const errors: string[] = [];
  
  // Validate coordinates
  if (!inputs.lat || inputs.lat < -90 || inputs.lat > 90) {
    errors.push('Invalid latitude (must be between -90 and 90)');
  }
  if (!inputs.lng || inputs.lng < -180 || inputs.lng > 180) {
    errors.push('Invalid longitude (must be between -180 and 180)');
  }
  
  // Validate system size
  if (!inputs.systemKw || inputs.systemKw < 0.5 || inputs.systemKw > 50) {
    errors.push('System size must be between 0.5 and 50 kW');
  }
  
  // Validate tilt angle
  if (inputs.tilt !== undefined && (inputs.tilt < 0 || inputs.tilt > 90)) {
    errors.push('Tilt angle must be between 0 and 90 degrees');
  }
  
  // Validate azimuth
  if (inputs.azimuth !== undefined && (inputs.azimuth < 0 || inputs.azimuth > 360)) {
    errors.push('Azimuth must be between 0 and 360 degrees');
  }
  
  // Validate losses percentage
  if (inputs.lossesPct !== undefined && (inputs.lossesPct < 5 || inputs.lossesPct > 25)) {
    errors.push('System losses must be between 5% and 25%');
  }
  
  // Validate address
  if (!inputs.address || inputs.address.trim().length < 5) {
    errors.push('Address must be at least 5 characters long');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateStateCode(stateCode: string): boolean {
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];
  return validStates.includes(stateCode?.toUpperCase());
}
