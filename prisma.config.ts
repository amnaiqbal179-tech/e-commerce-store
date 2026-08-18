import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";
import path from "path";

// .env.local file se environment variables load karein
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});