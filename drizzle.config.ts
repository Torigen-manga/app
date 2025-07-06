import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/common/src/database/models',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./dev.db'
  }
})
