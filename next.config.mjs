/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        TO_EMAIL_USER: process.env.TO_EMAIL_USER,
    },
};

export default nextConfig;
