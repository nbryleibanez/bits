import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Add PWA configuration
const pwaConfig = withPWA({
  dest: "public", // Output directory for service worker
  register: true, // Automatically register service worker
  skipWaiting: true, // Activate service worker immediately
  scope: "/",
  sw: "service-worker.js",
  disable: process.env.NODE_ENV === "development", // Disable in development mode
})(nextConfig);

// Additional configuration based on environment
if (
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_ENV === "staging"
) {
  pwaConfig.logging = {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  };
}

export default pwaConfig;
