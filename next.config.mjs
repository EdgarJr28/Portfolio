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
};

export default nextConfig;
