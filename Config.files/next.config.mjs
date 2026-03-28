/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["date-fns", "lucide-react"],
  },
  reactStrictMode: true,
};

export default nextConfig;
