/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    prependData: `@import "variables";`,
  },
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'index,follow'
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate'
        }
      ]
    }
  ],
  // Optional: Configure allowed image domains if you use next/image
  images: {
    domains: ['alendev.vercel.app'],
  },
  // Optional: Configure redirects if needed
  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    }
  ]
};

export default nextConfig;