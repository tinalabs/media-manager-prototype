const { aliasTinaDev, aliasRelative } = require('@tinacms/webpack-helpers')
const path = require('path')
module.exports = {
  env: {
    STRAPI_URL: process.env.STRAPI_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    REPO_FULL_NAME: process.env.REPO_FULL_NAME,
    BASE_BRANCH: process.env.BASE_BRANCH,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  },
  webpack(config) {
    if (process.env.TINA) {
      aliasTinaDev(config, process.env.TINA)
      aliasRelative(
        config,
        'styled-components',
        path.resolve(process.env.TINA, './node_modules/styled-components')
      )
    }
    return config
  },
}
