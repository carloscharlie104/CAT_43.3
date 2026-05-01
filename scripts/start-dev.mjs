import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(root, "..");

const command = process.execPath;
const args = [
  join(projectRoot, "node_modules", "@angular", "cli", "bin", "ng.js"),
  "serve"
];

if (!existsSync(command)) {
  console.error(`[start] Missing Node executable: ${command}`);
  process.exit(1);
}

const child = spawn(command, args, {
  cwd: projectRoot,
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (code !== 0) {
    console.error(`[start] Angular exited with ${signal ?? `code ${code}`}.`);
    process.exit(code ?? 1);
  }

  process.exit(0);
});

process.on("SIGINT", () => {
  if (!child.killed) {
    child.kill("SIGTERM");
  }
});

process.on("SIGTERM", () => {
  if (!child.killed) {
    child.kill("SIGTERM");
  }
});