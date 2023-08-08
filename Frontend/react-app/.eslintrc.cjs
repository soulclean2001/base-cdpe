module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts'],

  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ]
  },
  'no-restricted-imports': 'off',
  '@typescript-eslint/no-restricted-imports': [
    'warn',
    {
      name: 'react-redux',
      importNames: ['useSelector', 'useDispatch'],
      message: 'Use typed hooks `useAppDispatch` and `useAppSelector` instead.'
    }
  ]
}
