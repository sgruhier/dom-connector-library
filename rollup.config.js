// Rollup plugins
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
const libraryName = 'dom-connector-library'

export default {
  entry: `compiled/${libraryName}.js`,
  dest: `dist/${libraryName}.js`,
  format: 'iife',
  sourceMap: process.env.NODE_ENV === 'production' ? false : 'inline',
  name: 'DomConnector',
  plugins: [
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};
