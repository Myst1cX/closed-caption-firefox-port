#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")
);
const version = packageJson.version;
const distDir = path.join(__dirname, "..", "dist");
const buildsDir = path.join(distDir, "builds");

function run(cmd, env = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, {
    stdio: "inherit",
    env: { ...process.env, ...env },
    cwd: path.join(__dirname, ".."),
  });
}

function zipDir(sourceDir, outputZip) {
  if (!fs.existsSync(path.dirname(outputZip))) {
    fs.mkdirSync(path.dirname(outputZip), { recursive: true });
  }
  execSync(`cd "${sourceDir}" && zip -r "${outputZip}" .`, { stdio: "inherit" });
  console.log(`Created: ${outputZip}`);
}

const args = process.argv.slice(2);
const packageOnly = args.includes("--package");
const buildChrome = !packageOnly && (args.includes("--chrome") || args.includes("--all") || args.length === 0);
const buildFirefox = !packageOnly && (args.includes("--firefox") || args.includes("--all") || args.length === 0);
const packageBuilds = packageOnly || buildChrome || buildFirefox;

if (buildChrome) {
  console.log("\n=== Building Chrome ===");
  run("webpack --mode=production", { BROWSER: "chrome", ENV: "production" });
}

if (buildFirefox) {
  console.log("\n=== Building Firefox ===");
  run("webpack --mode=production", { BROWSER: "firefox", ENV: "production" });
}

if (packageBuilds) {
  console.log("\n=== Packaging builds ===");
  fs.mkdirSync(buildsDir, { recursive: true });

  const packageChrome = buildChrome || packageOnly;
  const packageFirefox = buildFirefox || packageOnly;

  if (packageChrome && fs.existsSync(path.join(distDir, "chrome"))) {
    zipDir(
      path.join(distDir, "chrome"),
      path.join(buildsDir, `closed-caption-chrome-v${version}.zip`)
    );
  }

  if (packageFirefox && fs.existsSync(path.join(distDir, "firefox"))) {
    zipDir(
      path.join(distDir, "firefox"),
      path.join(buildsDir, `closed-caption-firefox-v${version}.zip`)
    );
  }

  console.log("\n=== Build complete ===");
  console.log(`Output: ${buildsDir}`);
  fs.readdirSync(buildsDir).forEach((f) => console.log(`  ${f}`));
}
