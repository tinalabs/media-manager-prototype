module.exports = {
  env: {
    STRAPI_URL: process.env.STRAPI_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    REPO_FULL_NAME: process.env.REPO_FULL_NAME,
    BASE_BRANCH: process.env.BASE_BRANCH,
  },
  webpack(config) {
    if (process.env.TINA) {
      aliasTinaDev(config, process.env.TINA)
    }
  },
}
