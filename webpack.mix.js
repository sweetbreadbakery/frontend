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
  .browserSync('avime.test');

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
  .copy('node_modules/alpinejs/dist/cdn.min.js', 'public/scripts/alpine.js')
  .copyDirectory('resources/data', 'public/data')
  .copyDirectory('resources/fonts', 'public/fonts')
  .copyDirectory('resources/images', 'public/images');

mix
  .copy('resources/views/index.html', 'public');

mix
  .sourceMaps()
  .version();
