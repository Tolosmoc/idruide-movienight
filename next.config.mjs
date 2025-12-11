/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  reactStrictMode: true,
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/baseui/ },
    ];
    return config;
  },
};

export default nextConfig;