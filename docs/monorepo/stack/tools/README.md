# 🔨 Tooling Overview

> This document outlines the tools used in the project, grouped by their themes and functionality, with details on their purposes and configurations.

---

## 🛡️ Pre-Commit Quality Control Tools

### **Husky**
- **Purpose**: Automates running scripts at specific Git lifecycle events, such as pre-commit or pre-push.
- **Use Case**: Ensures that quality checks (like linting and tests) are enforced before committing or pushing changes.
- **Common Setup**:
  - Install Husky:
    ```bash
    pnpm add husky -D
    ```
  - Enable Husky in your project:
    ```bash
    npx husky install
    ```
  - Add a pre-commit hook:
    ```bash
    npx husky add .husky/pre-commit "pnpm lint-staged"
    ```

### **Lint-Staged**
- **Purpose**: Runs specified commands (e.g., linting or formatting) on staged files only.
- **Use Case**: Ensures that only files being committed are processed, making checks faster and more targeted.
- **Common Setup**:
  - Install Lint-Staged:
    ```bash
    pnpm add lint-staged -D
    ```
  - Create a `.lintstagedrc.json` file:
    ```json
    {
      "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
      "*.json": ["prettier --write"]
    }
    ```

### **Commitlint**
- **Purpose**: Enforces conventional commit messages for better readability and changelog generation.
- **Use Case**: Ensures commit messages follow a standard format like `<type>(<scope>): <subject>`.
- **Common Setup**:
  - Install Commitlint and a config:
    ```bash
    pnpm add @commitlint/cli @commitlint/config-conventional -D
    ```
  - Create a `.commitlintrc.json` file:
    ```json
    {
      "extends": ["@commitlint/config-conventional"]
    }
    ```
  - Add a Git hook for commit messages:
    ```bash
    npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
    ```

---

## 🧹 Code Formatting and Linting

### **Prettier**
- **Purpose**: Ensures consistent code formatting across the project.
- **Use Case**: Automatically formats code based on defined rules.
- **Common Setup**:
  - Install Prettier:
    ```bash
    pnpm add prettier -D
    ```
  - Create a `.prettierrc` file:
    ```json
    {
      "semi": false,
      "singleQuote": false,
      "tabWidth": 2,
      "useTabs": false,
      "arrowParens": "always",
      "trailingComma": "es5",
      "plugins": ["prettier-plugin-tailwindcss"],
      "tailwindFunctions": ["clsx", "cva"]
    }
    ```
  - Add a `.prettierignore` file for files or directories to ignore:
    ```
    node_modules/
    build/
    ```

### **ESLint**
- **Purpose**: Analyzes code to find and fix problems, including potential errors and coding style issues.
- **Use Case**: Linting and ensuring code quality for JavaScript and TypeScript using a shared configuration package.

---

#### **Setup for Shared ESLint Configuration**
1. **Create a Shared ESLint Config Package**:
  - Create a package (e.g., `@lootopia/eslint-config`) to host the shared configuration.
  - Inside the shared config package, create an `index.js` file:

    ```js
    /** @type {import('eslint').Linter.Config} */
    const config = {
     extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
     ],
     parser: "@typescript-eslint/parser",
     plugins: ["@typescript-eslint", "prettier"],
     rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" }
      ]
     }
    };

    module.exports = config;
    ```

  - Add a `package.json` file for the package:
    ```json
    {
     "name": "@lootopia/eslint-config",
     "version": "1.0.0",
     "main": "index.js",
     "peerDependencies": {
      "eslint": "^8.0.0",
      "@typescript-eslint/parser": "^5.0.0",
      "@typescript-eslint/eslint-plugin": "^5.0.0",
      "eslint-config-prettier": "^9.0.0",
      "eslint-plugin-prettier": "^4.0.0",
      "prettier": "^3.0.0"
     }
    }
    ```

  - Publish the package to your preferred package registry (e.g., npm or a private registry).

---

#### **Using the Shared ESLint Config in Projects**

2. **Install the Shared Config in Your Project**:
  In each project where you want to use the shared ESLint config:

  ```bash
  pnpm add @lootopia/eslint-config eslint prettier -D
  ```

3. **Extend the Shared Config**:
  Create an `eslint.config.mjs` file in your project directory:

  ```js
  import eslintConfig from "@lootopia/eslint-config";

  /** @type {import('eslint').Linter.Config} */
  const config = {
    extends: [eslintConfig],
  };

  export default config;
  ```

4. **Add Ignore Rules**:
  Add an `.eslintignore` file to exclude unnecessary files or directories from linting:

  ```
  node_modules/
  build/
  dist/
  ```
---

## 🛠️ Build Automation and Tasks

### **Makefile**
- **Purpose**: Defines reusable and platform-independent task automation scripts.
- **Use Case**: Standardizes workflows such as running tests, linting, and building the project.
- **Common Example**:
  ```makefile
  # Variables
  SHELL := /bin/bash

  # Tasks
  lint:
  	pnpm eslint .

  format:
  	pnpm prettier --write .

  test:
  	pnpm test

  build:
  	pnpm build

  # Default task
  all: lint format test build
