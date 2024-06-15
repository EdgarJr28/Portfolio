/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'media.giphy.com',
                pathname: '**',
            },
        ],
    },
    env: {
        MAP_API_KEY: process.env.MAP_API_KEY,
    },
};

export default nextConfig;
