// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // Proxy đến backend
      },
    ];
  },
  devIndicators: {
    autoPrerender: false,
  },
  // images: {
  //   domains: ["res.cloudinary.com"],
  // },
};
