// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          "esmodules": true
        },
      },
    ],
    '@babel/preset-typescript',
  ]
};
