const autoprefixer = require('autoprefixer');
const purgeCSSPlugin = require('@fullhuman/postcss-purgecss');
const tailwind = require('tailwindcss');

const purgecss = purgeCSSPlugin({
  // paths to all of the template files in the project
  content: ['./public/**/*.html', './src/**/*.js'],

  // https://tailwindcss.com/docs/controlling-file-size#setting-up-purgecss
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    tailwind,
    autoprefixer,
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
