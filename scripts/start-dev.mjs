import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(root, "..");
const commands = [
  {
    name: "api",
    command: process.execPath,
    args: [join(projectRoot, "node_modules", "json-server", "lib", "bin.js"), "db.json", "--port", "3000"]
  },
  {
    name: "app",
    command: process.execPath,
    args: [join(projectRoot, "node_modules", "@angular", "cli", "bin", "ng.js"), "serve"]
  }
];

const children = [];
let shuttingDown = false;

function stopAll(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  process.exitCode = exitCode;
}

for (const item of commands) {
  if (!existsSync(item.command)) {
    console.error(`[start] Missing executable for ${item.name}: ${item.command}`);
    stopAll(1);
    break;
  }

  const child = spawn(item.command, item.args, {
    cwd: projectRoot,
    stdio: "inherit"
  });

  children.push(child);

  child.on("exit", (code, signal) => {
    if (!shuttingDown && code !== 0) {
      console.error(`[start] ${item.name} exited with ${signal ?? `code ${code}`}.`);
      stopAll(code ?? 1);
    }
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
