/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'uk',
    locales: ['en', 'uk'],
  },
  localePath: path.resolve('./public/locales'),
}
