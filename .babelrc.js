module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {},
        'preset-react': {
          runtime: 'automatic',
          importSource: process.env.NEXT_RUNTIME === 'edge' ? undefined : 'react',
        },
        'transform-runtime': {
          useESModules: true,
          version: '^7.20.0',
        },
      },
    ],
  ],
  plugins: [],
}; 