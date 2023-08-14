const {build} = require('esbuild');

const commonOptions = {
  outbase: './src',
  platform: 'browser',
  bundle: true,
  minify: true,
};

const files = [
  {
    name: 'Standalone',
    entryPoint: './src/browser-standalone.js',
    outfile: './dist/standalone.js',
  },
  {
    name: 'All providers',
    entryPoint: './src/browser-all.js',
    outfile: './dist/all.js',
  },
];

files.forEach((f) =>
  build({
    entryPoints: [f.entryPoint],
    outfile: f.outfile,
    ...commonOptions,
  }).then((r) => console.log(`Finish build: ${f.name}`))
);
