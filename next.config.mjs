/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ];
  },
  async rewrites() {
    return [
      { source: "/checkout.html", destination: "/checkout" },
      { source: "/demo.html", destination: "/demo" },
      { source: "/pricing.html", destination: "/pricing" },
      { source: "/docs.html", destination: "/docs" },
      { source: "/use-cases.html", destination: "/use-cases" },
      { source: "/admin", destination: "/v-sec-7x92kp/admin" }
    ];
  }
};

export default nextConfig;
