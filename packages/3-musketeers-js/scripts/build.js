const {build} = require('esbuild');

build({
  entryPoints: ['./src/index.js'],
  outbase: './src',
  outdir: './dist',
  platform: 'browser',
  bundle: true,
  // minify: true,
}).then((r) => console.log('Finish build'));
