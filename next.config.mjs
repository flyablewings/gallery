/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['images.unsplash.com'], // For placeholder images
        unoptimized: true, // Allow serving images from public/uploads
    },
};

export default nextConfig;
