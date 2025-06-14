import { FlatCompat } from "@eslint/eslintrc"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { parserOptions: { ecmaVersion: "latest" } },
})

const eslintConfig = [
  {
    files: ["**/*.ts"],
  },
  ...compat.config({ extends: ["@lootopia/eslint-config-server"] }),
]

export default eslintConfig
