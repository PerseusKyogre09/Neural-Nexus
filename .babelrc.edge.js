/**
 * Babel configuration for Edge runtime
 * This configuration intentionally excludes any React-related transformations
 */

module.exports = {
  presets: [
    ['next/babel', {
      'preset-react': false,
      'preset-typescript': {
        transpileOnly: true,
        allowNamespaces: true,
      },
      'transform-runtime': {
        corejs: false,
        helpers: true,
        regenerator: false,
        useESModules: false,
      },
    }]
  ],
  plugins: [
    // No React or JSX transformations for Edge functions
  ],
}; 