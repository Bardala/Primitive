/**
 * This is PostCSS's configuration file that tells PostCSS which plugins to use
 * PostCSS is a tool for transforming CSS with JavaScript plugins
 * Tailwind CSS uses PostCSS to process your CSS
 */

module.exports = {
  /**
   * plugins: An array of PostCSS plugins to use
   * '@tailwindcss/postcss': The Tailwind CSS plugin for PostCSS
   * This plugin processes your Tailwind classes and generates the final CSS
   * The empty object {} means default options
   */
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
