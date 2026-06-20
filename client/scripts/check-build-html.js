import { readFileSync } from "node:fs";

const html = readFileSync("dist/index.html", "utf8");
const absoluteAssetRefs = [...html.matchAll(/\b(?:src|href)="\/assets\//g)].map((match) => match[0]);

if (absoluteAssetRefs.length > 0) {
  console.error("dist/index.html uses root-relative asset URLs. Use Vite base './' so extracted builds can load assets from client/dist.");
  console.error(absoluteAssetRefs.join("\n"));
  process.exit(1);
}

if (!/\b(?:src|href)="\.\/assets\//.test(html)) {
  console.error("dist/index.html does not contain relative ./assets references.");
  process.exit(1);
}

if (!html.includes('id="bootFallback"')) {
  console.error("dist/index.html is missing the boot fallback that prevents a blank page if scripts fail to load.");
  process.exit(1);
}

console.log("Build HTML uses portable relative asset URLs.");
