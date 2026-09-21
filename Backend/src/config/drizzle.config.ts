import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path:path.resolve(process.cwd(), '.env') })

export default defineConfig({
  out: './drizzle/migrations',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});