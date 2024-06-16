import globals from "globals";

export default [{
    languageOptions: {
        globals: Object.assign({}, globals.browser, globals.commonjs),

        ecmaVersion: 2015,
        sourceType: "module",
    },

    rules: {
        "linebreak-style": 0,

        "no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        quotes: ["error", "double"],
    }
}];