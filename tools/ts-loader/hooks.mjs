/**
 * Module hooks for running src/ code from tools (Node's own type stripping does the TypeScript):
 * - `@/…` resolves to src/… and extensionless relative imports find their .ts/.tsx/index.ts file;
 * - `server-only` becomes an empty module (a tool is server-side by definition);
 * - image imports become `{ src: <absolute file path>, width: 0, height: 0 }`, so a tool can read the file.
 */
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const src = fileURLToPath(new URL('../../src/', import.meta.url));
const IMAGE = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

function findFile(base) {
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return undefined;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'server-only') return { url: 'data:text/javascript,export {};', shortCircuit: true };
  let base;
  if (specifier.startsWith('@/')) base = path.join(src, specifier.slice(2));
  else if (/^\.\.?\//.test(specifier) && context.parentURL?.startsWith('file:')) base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
  const file = base && findFile(base);
  if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && IMAGE.test(url)) {
    const image = { src: fileURLToPath(url), width: 0, height: 0 };
    return { format: 'module', source: `export default ${JSON.stringify(image)};`, shortCircuit: true };
  }
  if (url.startsWith('file:') && /\.tsx?$/.test(url)) return nextLoad(url, { ...context, format: 'module-typescript' });
  return nextLoad(url, context);
}
