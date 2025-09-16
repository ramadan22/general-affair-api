import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "eol-last": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "array-element-newline": [
        "error",
        { ArrayExpression: "consistent", ArrayPattern: "consistent" },
      ],
      "linebreak-style": "off",
      "max-len": ["error", { code: 100, tabWidth: 2, ignoreUrls: true }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];
