import { FlatCompat } from "@eslint/eslintrc"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { parserOptions: { ecmaVersion: "latest" } },
})

const eslintConfig = [
  ...compat.config({ extends: ["@lootopia/eslint-config-client"] }),
  {
    rules: {
      complexity: "off",
    },
  },
]

export default eslintConfig
