// npm run build — generate the Prisma client, then run the Next.js production build.
// Runs the CLIs directly with Node (no npx), so it works on Windows/macOS/Linux,
// including paths that contain spaces.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextCli = require.resolve("next/dist/bin/next");

execFileSync(process.execPath, ["scripts/db-generate.mjs"], { stdio: "inherit" });
execFileSync(process.execPath, [nextCli, "build"], { stdio: "inherit" });
