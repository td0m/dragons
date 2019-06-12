/* eslint:disable */
const tailwindcss = require("tailwindcss")("./tailwind.js");
const autoprefixer = require("autoprefixer");
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: [
    "./src/**/*.html",
    "./src/**/*.vue",
    "./src/**/*.js",
    "./src/**/*.ts",
    "./src/**/*.tsx",
    "./src/**/*.jsx"
  ],

  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});
const cssnano = require("cssnano")({
  preset: "default"
});

const production = process.env.NODE_ENV === "production";

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    ...(production ? [purgecss, cssnano] : [])
  ]
};
