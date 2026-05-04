import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content");
const astroBin = path.join(root, "node_modules", ".bin", "astro");
const host = process.env.HOST ?? "127.0.0.1";
const port = process.env.PORT ?? "4321";
const restartDelayMs = 250;

let server;
let restartTimer;
let restarting = false;
let watchers = [];

function startServer() {
  server = spawn(astroBin, ["dev", "--host", host, "--port", port], {
    cwd: root,
    detached: true,
    stdio: "inherit"
  });

  server.on("exit", (code, signal) => {
    if (!restarting && code !== 0 && signal !== "SIGTERM") {
      console.error(`[dev:content] Astro dev server exited with code ${code ?? "unknown"}.`);
    }
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (!server || server.killed) {
      resolve();
      return;
    }

    const current = server;
    const timeout = setTimeout(() => {
      try {
        process.kill(-current.pid, "SIGKILL");
      } catch {
        // The process may already be gone.
      }
      resolve();
    }, 3000);

    current.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });

    try {
      process.kill(-current.pid, "SIGTERM");
    } catch {
      clearTimeout(timeout);
      resolve();
    }
  });
}

async function restartServer(filePath) {
  restarting = true;
  console.log(`[dev:content] ${path.relative(root, filePath)} changed. Restarting Astro...`);
  await stopServer();
  startServer();
  restarting = false;
}

function scheduleRestart(filePath) {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    restartServer(filePath).catch((error) => {
      console.error("[dev:content] Failed to restart Astro dev server.");
      console.error(error);
    });
  }, restartDelayMs);
}

function shouldRestart(filePath) {
  return typeof filePath === "string" && filePath.endsWith(".md");
}

function watchDirectory(directory) {
  const watcher = fs.watch(directory, (eventType, filename) => {
    if (!filename) {
      return;
    }

    const filePath = path.join(directory, filename.toString());

    if (eventType === "rename") {
      refreshFallbackWatchers();
    }

    if (shouldRestart(filePath)) {
      scheduleRestart(filePath);
    }
  });

  watchers.push(watcher);
}

function refreshFallbackWatchers() {
  for (const watcher of watchers) {
    watcher.close();
  }

  watchers = [];
  watchDirectoryTree(contentDir);
}

function watchDirectoryTree(directory) {
  watchDirectory(directory);

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      watchDirectoryTree(path.join(directory, entry.name));
    }
  }
}

function watchContent() {
  try {
    const watcher = fs.watch(contentDir, { recursive: true }, (eventType, filename) => {
      if (!filename) {
        return;
      }

      const filePath = path.join(contentDir, filename.toString());

      if (shouldRestart(filePath)) {
        scheduleRestart(filePath);
      }
    });

    watchers.push(watcher);
  } catch {
    watchDirectoryTree(contentDir);
  }
}

async function shutdown() {
  clearTimeout(restartTimer);

  for (const watcher of watchers) {
    watcher.close();
  }

  await stopServer();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(`[dev:content] Watching content/**/*.md and serving http://localhost:${port}/`);
startServer();
watchContent();
