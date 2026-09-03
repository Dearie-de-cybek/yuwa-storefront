/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep native/server-only packages out of the bundle so they load at runtime.
  serverExternalPackages: ['@prisma/client', 'bcryptjs', 'resend', 'cloudinary'],
};

export default nextConfig;
