// Baseline security headers applied to every route. These are the low-risk
// set that does not break wasm, Three.js, embedded emulators or reCAPTCHA.
// A Content-Security-Policy is intentionally NOT set here yet: it needs to be
// tuned against the easter-egg iframes/wasm and rolled out Report-Only first.
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co', pathname: '**' },
      { protocol: 'https', hostname: 'mosaic.scdn.co', pathname: '**' },
      { protocol: 'https', hostname: 'image-cdn-ak.spotifycdn.com', pathname: '**' },
      { protocol: 'https', hostname: 'image-cdn-fa.spotifycdn.com', pathname: '**' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
