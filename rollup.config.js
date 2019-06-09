import babel from 'rollup-plugin-babel';

export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  external: ['riot'],
  plugins: [
    babel({
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '6.10.0'
            },
            modules: false
          }
        ]
      ]
    })
  ]
};
