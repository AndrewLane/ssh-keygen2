module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "linebreak-style": 0,
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    quotes: ["error", "double"],
  },
  parserOptions: {
    sourceType: "module"
  }
};
