const fs = require("fs");
const path = require("path");

const nm = path.join(__dirname, "..", "node_modules", "@emulatorjs");
const dst = path.join(__dirname, "..", "public", "emulatorjs", "data");

const loaderSrc = path.join(nm, "emulatorjs", "data");
if (!fs.existsSync(loaderSrc)) {
  console.log("[copy-emulatorjs] @emulatorjs/emulatorjs not installed, skipping.");
  process.exit(0);
}

// loader.js + compression tools
fs.mkdirSync(path.join(dst, "compression"), { recursive: true });
fs.copyFileSync(path.join(loaderSrc, "loader.js"), path.join(dst, "loader.js"));
const compFiles = fs.readdirSync(path.join(loaderSrc, "compression")).filter((f) => !f.startsWith("README"));
for (const f of compFiles) {
  fs.copyFileSync(path.join(loaderSrc, "compression", f), path.join(dst, "compression", f));
}

// snes9x core — .data files go into cores/ root, reports/ into cores/reports/
const snesSrc = path.join(nm, "core-snes9x");
if (fs.existsSync(snesSrc)) {
  const coresDir = path.join(dst, "cores");
  const reportsDir = path.join(coresDir, "reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const dataFiles = fs.readdirSync(snesSrc).filter((f) => f.endsWith(".data"));
  for (const f of dataFiles) {
    fs.copyFileSync(path.join(snesSrc, f), path.join(coresDir, f));
  }

  const reportsPath = path.join(snesSrc, "reports");
  if (fs.existsSync(reportsPath)) {
    for (const f of fs.readdirSync(reportsPath)) {
      fs.copyFileSync(path.join(reportsPath, f), path.join(reportsDir, f));
    }
  }
  console.log(`[copy-emulatorjs] Copied snes9x core (${dataFiles.length} .data files)`);
}

// mgba core (GBA)
const mgbaSrc = path.join(nm, "core-mgba");
if (fs.existsSync(mgbaSrc)) {
  const coresDir = path.join(dst, "cores");
  const reportsDir = path.join(coresDir, "reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const dataFiles = fs.readdirSync(mgbaSrc).filter((f) => f.endsWith(".data"));
  for (const f of dataFiles) {
    fs.copyFileSync(path.join(mgbaSrc, f), path.join(coresDir, f));
  }
  const reportsPath = path.join(mgbaSrc, "reports");
  if (fs.existsSync(reportsPath)) {
    for (const f of fs.readdirSync(reportsPath)) {
      fs.copyFileSync(path.join(reportsPath, f), path.join(reportsDir, f));
    }
  }
  console.log(`[copy-emulatorjs] Copied mgba core (${dataFiles.length} .data files)`);
}

console.log("[copy-emulatorjs] Done. Note: emulator.min.js/css must be present in public/emulatorjs/data/ (download once from CDN or GitHub releases).");
