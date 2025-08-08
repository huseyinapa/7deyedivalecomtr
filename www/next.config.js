/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // optimizeCss: true, // Disabled due to missing critters dependency
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },

  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
      return config;
    },
  }),

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [320, 420, 768, 1024, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 yıl cache
    loader: 'default',
    unoptimized: false,
  },

  // Compression
  compress: true,

  // Power by header removal
  poweredByHeader: false,
};

module.exports = nextConfig;
