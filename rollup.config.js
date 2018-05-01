import babel from 'rollup-plugin-babel'
import autoExternal from 'rollup-plugin-auto-external'
import prettier from 'rollup-plugin-prettier'

export default {
  input: 'src/index.js',
  output: [
    { format: 'cjs', file: 'dist/index.js', exports: 'named' }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['env', { modules: false }]],
      plugins: ['external-helpers']
    }),
    autoExternal({
      builtins: true,
      dependencies: true
    }),
    prettier({
      tabWidth: 2,
      semi: false,
      singleQuote: true
    })
  ]
}