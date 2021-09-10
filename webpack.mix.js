const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Sage application. By default, we are compiling the Sass file
 | for your application, as well as bundling up your JS files.
 |
 */

mix
  .setPublicPath('./public')
  .browserSync({
    https: true,
    proxy: 'avime.test',
  });

mix
  .sass('resources/styles/app.scss', 'styles')
  .options({
    processCssUrls: false,
    postCss: [require('tailwindcss')],
  });

mix
  .js('resources/scripts/app.js', 'scripts');

mix
  .copy('node_modules/web3/dist/web3.min.js', 'public/scripts/web3.js')
  .copy('node_modules/web3modal/dist/index.js', 'public/scripts/web3modal.js')
  .copy('node_modules/@walletconnect/web3-provider/dist/umd/index.min.js', 'public/scripts/web3provider.js')
  .copyDirectory('resources/images', 'public/images')
  .copyDirectory('resources/fonts', 'public/fonts');

mix
  .copy('resources/views/index.html', 'public');

mix
  .sourceMaps()
  .version();
