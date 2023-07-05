module.exports = {
  extends: '@terrestris/eslint-config-typescript',
  plugins: ['simple-import-sort'],
  rules: {
    '@typescript-eslint/member-ordering': 'off',
    'no-extra-semi': 'warn',
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': 'warn'
  }
};
