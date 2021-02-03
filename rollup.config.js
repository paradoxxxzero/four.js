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
]
