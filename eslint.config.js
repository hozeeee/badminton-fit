import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  formatters: { css: true, html: true, markdown: true },
  ignores: ['dist/**', 'dist-single/**', '.qoder/**'],
}, {
  rules: {
    'import/no-mutable-exports': 'off',
    'no-alert': 'off',
    'react-dom/no-missing-button-type': 'off',
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    'react-hooks-extra/prefer-use-state-lazy-initialization': 'off',
    'react/no-array-index-key': 'off',
    'react/no-unstable-default-props': 'off',
    'react-refresh/only-export-components': 'off',
    'style/indent': 'off',
    'style/jsx-closing-tag-location': 'off',
    'style/jsx-one-expression-per-line': 'off',
    'style/jsx-wrap-multilines': 'off',
    'style/max-statements-per-line': 'off',
    'style/no-mixed-operators': 'off',
    'style/no-trailing-spaces': 'off',
  },
})
