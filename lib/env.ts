import 'server-only';

function optional(name: string): string | undefined {
  return process.env[name];
}

export const ENV = {
  /** Optional when GLPConvert runs without solar `/api/estimate` */
  NREL_API_KEY: optional('NREL_API_KEY'),
  EIA_API_KEY: optional('EIA_API_KEY'),
  OPENEI_API_KEY: optional('OPENEI_API_KEY'),
};

