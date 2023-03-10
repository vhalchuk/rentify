/**
 * @typedef {import('prettier').Options & {
 *   importOrder: string[]
 * }} ExtendedConfig
 */

/** @type {ExtendedConfig} */
const config = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  semi: false,
  singleQuote: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^~/app/(.*)$',
    '^~/widgets/(.*)$',
    '^~/features/(.*)$',
    '^~/entities/(.*)$',
    '^~/shared/(.*)$',
    '^[./]'
  ]
};

module.exports = config;
