/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
    "prettier",
    "plugin:@next/next/recommended",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        config: "tsconfig.json",
        alwaysTryTypes: true,
      },
    },
    "react": {
      "version": "detect",
    }
  },
  rules: {
    "@typescript-eslint/no-floating-promises": ["error", { ignoreVoid: true }],
    "import/order": ["error"],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "lf",
      },
    ],
    "react/prop-types": ["off"],
    "react/react-in-jsx-scope": "off",
  },
};
