#!/usr/bin/env node
/**
 * hover-important — in CSS Modules, marks every `color` declaration inside a
 * :hover rule as !important. That mirrors the design preview, where every
 * hover style is made !important, so a link's own hover colour beats the
 * page-wide hover colour exactly as it does in the design.
 *
 *   node tools/hover-important.mjs <dir-or-file> [...]
 */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

async function files(p) {
  const s = await stat(p);
  if (s.isFile()) return p.endsWith('.module.css') ? [p] : [];
  const out = [];
  for (const e of await readdir(p)) out.push(...(await files(path.join(p, e))));
  return out;
}

let changed = 0;
for (const target of process.argv.slice(2)) {
  for (const f of await files(target)) {
    const css = await readFile(f, 'utf8');
    const next = css.replace(/([^{}]*:hover[^{}]*)\{([^{}]*)\}/g, (m, sel, body) => {
      const nb = body.replace(/(^|;|\n)(\s*)color\s*:\s*([^;!}]+?)\s*;/g, (d, pre, ws, val) => `${pre}${ws}color: ${val.trim()} !important;`);
      return `${sel}{${nb}}`;
    });
    if (next !== css) {
      await writeFile(f, next);
      changed++;
      console.log('updated', f);
    }
  }
}
console.log(`${changed} file(s) updated`);
