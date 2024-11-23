import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://alendev.vercel.app/sitemap.xml',
    host: 'https://alendev.vercel.app',
  }
}