
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import {terser} from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript'

import * as packageJson from './package.json'

const config = (browser, minify = false) => {

  const plugins = [
    replace({
      'process.env.version': JSON.stringify(packageJson.version),
      'process.env.dbVersion': JSON.stringify(packageJson.dbVersion)
    }),
    typescript({target: browser ? 'es3' : 'es6'})
  ]

  if (browser) {
    plugins.push(
      resolve({
        module: true,
        extensions: ['.js', '.mjs']
      })
    )
  }

  if (minify) {
    plugins.push(terser())
  }

  return {
    input: './src/log-store.ts',
    output: {
      file: `dist/log-store${minify ? '.min' : ''}.${browser ? 'js' : 'mjs'}`,
      name: 'log-store',
      format: browser ? 'umd' : 'es',
      amd: {id: 'log-store'}
    },
    plugins
  }
}

export default [
  config(true, false),  // umd (nodejs, browser)
  config(true, true),   // umd min (nodejs browser)
  config(false)         // es
]
