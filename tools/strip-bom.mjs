import { promises as fs } from "fs";
import { join, extname } from "path";

const exts = new Set([".js",".jsx",".ts",".tsx",".json",".css",".html",".md"]);
const BOM = "\uFEFF";

async function walk(dir, acc=[]) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const roots = process.argv.slice(2);
if (!roots.length) roots.push("frontend");

let changed = 0;
for (const root of roots) {
  const files = await walk(root);
  for (const f of files) {
    if (!exts.has(extname(f))) continue;
    const txt = await fs.readFile(f, "utf8");
    if (txt.startsWith(BOM)) {
      await fs.writeFile(f, txt.slice(1), "utf8");
      console.log("Removed BOM:", f);
      changed++;
    }
  }
}
console.log(`Done. BOM removed in ${changed} file(s).`);
