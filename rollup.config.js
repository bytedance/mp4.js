import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import filesize from 'rollup-plugin-filesize'
import { uglify } from 'rollup-plugin-uglify'

const config = {
  input: 'src/index.js',
  output: [
    {
      dir: 'dist',
      format: 'cjs'
    }, {
      dir: 'es',
      format: 'esm'
    }, {
      dir: 'lib',
      format: 'umd',
      name: 'MP4'
    }
  ],
  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      plugins: ['wildcard'],
      allowAllFormats: true
    }),
    nodeResolve(),
    commonjs(),
    json(),
    babel({ babelHelpers: 'bundled' }),
    uglify(),
    filesize()
  ]
}

export default config
