/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "export",   // genera carpeta "out"
  assetPrefix: "/",   // 🔹 assegura que les rutes siguin relatives a /
};

export default nextConfig;
