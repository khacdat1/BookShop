/** @type {import('next').NextConfig} */
const nextConfig = {
  resolve: {
    caseSensitive: false,
  },
  images: {
    domains: ['res.cloudinary.com', 'salt.tikicdn.com'],
  },
};

module.exports = nextConfig;
