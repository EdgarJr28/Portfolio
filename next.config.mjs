// next.config.mjs

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.ed98.online',
        pathname: '**',
      },
    ],
  },
  env: {
    MAP_API_KEY: process.env.MAP_API_KEY,
    MAP_ID: process.env.MAP_ID,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    TO_EMAIL_USER: process.env.TO_EMAIL_USER,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  },
};

export default nextConfig;
