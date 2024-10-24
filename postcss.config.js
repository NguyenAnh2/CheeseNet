const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./pages/**/*.js", "./components/**/*.js"],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  },
};
