module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*",
      },
    ];
  },
  devIndicators: {
    autoPrerender: false,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};
