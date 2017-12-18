/**
 * @description - rollup configuration
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const resolve = require('rollup-plugin-node-resolve');

module.exports = {
  input: 'src/index.js',
  plugins: [
    eslint({
      include: ['src/*.js']
    }),
    resolve({ jsnext: true, main: true }),
    babel({
      exclude: ['**/*.css', '**/*.scss'],
      runtimeHelpers: true
    })
  ],
  external: (id) => {
    return ['echarts', 'angular', 'babel-runtime'].some((name) => id.startsWith(name));
  },
  globals: {
    echarts: 'echarts',
    angular: 'angular'
  },
  output: [
    { file: 'bundle/echarts-ng.common.js', format: 'cjs' },
    { file: 'bundle/echarts-ng.esm.js', format: 'es' }
  ]
};
