import resolve from 'rollup-plugin-node-resolve'
// import allFiles from './rollup/allFiles.js'
// import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

module.exports = [

  {
    input: './material.js',
    output: {
      file: 'distr/material.js', // IIFE ONE FILE
      format: 'iife'
    },
    plugins: [resolve({}), minify({})]
  },

  {
    input: './material.js',
    output: {
      file: 'distr/material-esm.js', // IIFE ONE FILE
      format: 'esm'
    },
    plugins: [resolve({})]
  }
]
