import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const root = new URL("../", import.meta.url);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const paths = [
  "index.html",
  "styles.css",
  "manifest.webmanifest",
  "service-worker.js",
  ".nojekyll",
  "assets",
  "src"
];

for (const path of paths) {
  await cp(new URL(path, root), new URL(path, dist), { recursive: true });
}

await writeFile(new URL("build-info.txt", dist), "Orthodoxia static build\n");
