/**
 * @description - observable package rollup configuration
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.js',
  plugins: [
    eslint({
      include: ['index.js', 'src/*.js', 'test/*.js']
    }),
    resolve({ jsnext: true, main: true }),
    commonjs({
      include: 'node_modules/@bornkiller/**',
    }),
    babel()
  ],
  moduleId: 'bk.echarts',
  moduleName: 'bk.echarts',
  external: ['echarts'],
  globals: {
    'echarts': 'echarts'
  },
  targets: [
    { format: 'umd', dest: 'dist/bridge.bundle.js' },
    { format: 'es', dest: 'dist/bridge.bundle.esm.js' }
  ]
};