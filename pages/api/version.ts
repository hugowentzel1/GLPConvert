export default function handler(_req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ sha: process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'unknown' });
}