module.exports = {
  root: true,
  extends: [
    '@react-native', 
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Això fa que ESLint no es baralli amb Prettier
  ],
  plugins: ['react', 'react-native', 'react-hooks'],
  rules: {
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 1, // Avisa però no atura (warning)
    'react-native/no-color-literals': 0,
    'react-native/no-raw-text': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'warn', // Per evitar deixar console.log en producció
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};