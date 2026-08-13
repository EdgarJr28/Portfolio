const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "node_modules", "@ruffle-rs", "ruffle");
const dst = path.join(__dirname, "..", "public", "ruffle");

if (!fs.existsSync(src)) {
  console.log("[copy-ruffle] @ruffle-rs/ruffle not installed, skipping.");
  process.exit(0);
}

fs.mkdirSync(dst, { recursive: true });

const files = fs.readdirSync(src).filter((f) => /\.(js|wasm|map)$/.test(f));
for (const file of files) {
  fs.copyFileSync(path.join(src, file), path.join(dst, file));
}
console.log(`[copy-ruffle] Copied ${files.length} files to public/ruffle/`);
