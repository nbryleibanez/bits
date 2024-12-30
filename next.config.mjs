/** @type {import('next').NextConfig} */
const nextConfig = {};

if (
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_ENV === "staging"
) {
  nextConfig.logging = {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  };
}

export default nextConfig;
