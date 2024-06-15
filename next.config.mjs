/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['via.placeholder.com', 'media.giphy.com'],
    },
    env: {
        MAP_API_KEY: process.env.MAP_API_KEY,
    },
};

export default nextConfig;
