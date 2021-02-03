import resolve from '@rollup/plugin-node-resolve'
import path from 'path'

const local = () => ({
  transform: (code, id) => ({
    code: code.replace(
      "'three'",
      "'../node_modules/three/build/three.module.js'"
    ),
    map: null,
  }),
})

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'build/four.js',
      format: 'cjs',
    },
    external: id => !(id.startsWith('.') || id.startsWith(path.resolve('.'))),
    plugins: [resolve()],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'build/four.module.js',
      format: 'esm',
    },
    external: id => !(id.startsWith('.') || id.startsWith(path.resolve('.'))),
    plugins: [resolve()],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'build/four.local.module.js',
      format: 'esm',
    },
    external: id =>
      id === '../node_modules/three/build/three.module.js' ||
      !(id.startsWith('.') || id.startsWith(path.resolve('.'))),
    plugins: [local(), resolve()],
  },
]
