module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '~': './app',
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
        },
      ],

      [
        'react-native-unistyles/plugin',
        {
          root: './src',
        },
      ],
    ],
  };
};
