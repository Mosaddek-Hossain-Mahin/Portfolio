// npm run db:generate — generate the Prisma client (single Postgres schema).
// Runs the Prisma CLI directly with Node (no npx), so it works on Windows/macOS/Linux,
// including paths that contain spaces.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const prismaCli = require.resolve("prisma/build/index.js");
const schema = join(dirname(fileURLToPath(import.meta.url)), "..", "prisma", "schema.prisma");

execFileSync(process.execPath, [prismaCli, "generate", "--schema", schema], { stdio: "inherit" });
