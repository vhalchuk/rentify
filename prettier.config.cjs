/**
 * @typedef {import('prettier').Options & {
 *   importOrder: string[]
 * }} ExtendedConfig
 */

/** @type {ExtendedConfig} */
const config = {
  plugins: [],
  semi: false,
  singleQuote: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^~/app/(.*)$',
    '^~/widgets/(.*)$',
    '^~/features/(.*)$',
    '^~/entities/(.*)$',
    '^~/shared/(.*)$',
    '^[./]',
  ],
}

module.exports = config
