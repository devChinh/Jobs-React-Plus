/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const removeImports = require("next-remove-imports")();
console.log("URL env", process.env.AUTH0_BASE_URL, process.env.URL )
const rewrites = () => {
  return [
    {
      source: '/auth',
      destination: '/auth'
    },
    {
      source: '/api',
      destination: '/api'
    },
    {
      source: '/graphql',
      destination: process.env.HXB_GRAPHQL_ENDPOINT || "http://beee-graphql/graphql"
    }
  ]
}
module.exports = removeImports({
  experimental: { esmExternals: true },
  i18n,
  reactStrictMode: true,
  publicRuntimeConfig: {
    unAuthRouters: [
      "/auth/login",
      "/auth/signup",
      "/api/auth/login",
      "/api/auth/logout",
      "/api/auth/callback",
      "/api/auth/me",
      "/api/auth/token",
    ],
  },
  experimental: {
    outputStandalone: true,
  },
  env: {
    NEXT_PUBLIC_HOST_GRAPHQL: process.env.HXB_GRAPHQL_ENDPOINT || 'http://beee-graphql/graphql',
    URL: process.env.AUTH0_BASE_URL || process.env.URL || 'https://cloud.hexabase.com',
    // AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || 'http://dev-auth.hexabase.com'
  },
  rewrites,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    }
  }
});

// module.exports = {
//   i18n,
//   reactStrictMode: true,
//   publicRuntimeConfig: {
//     unAuthRouters: [
//       "/auth/login",
//       "/auth/signup",
//       "/api/auth/login",
//       "/api/auth/logout",
//       "/api/auth/callback",
//       "/api/auth/me",
//       "/api/auth/token",
//     ],
//   },
//   experimental: {
//     outputStandalone: true,
//   },
//   env: {
//     NEXT_PUBLIC_HOST_GRAPHQL: process.env.HXB_GRAPHQL_ENDPOINT || 'http://beee-graphql/graphql',
//     URL: process.env.AUTH0_BASE_URL || process.env.URL || 'https://dev-cloud.hexabase.com',
//     // AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || 'http://dev-auth.hexabase.com'
//   },
//   rewrites,
//   exportPathMap: async function (
//     defaultPathMap,
//     { dev, dir, outDir, distDir, buildId }
//   ) {
//     return {
//       '/': { page: '/' },
//       '/about': { page: '/about' },
//       '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
//       '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
//       '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
//     }
//   }
// }
