#!/usr/bin/env node
/**
 * upload-media — publishes the site's photos (public/media/**) to Vercel Blob, keeping each file's path
 * (images/todara-hero-fruit.png → <store>/images/todara-hero-fruit.png), so the site only needs the store's
 * address in NEXT_PUBLIC_MEDIA_BASE_URL.
 *
 *   BLOB_READ_WRITE_TOKEN=… node tools/upload-media.mjs [--dry-run]
 *
 * The token comes from the Vercel project (Storage → your Blob store → .env.local tab); it can also sit in
 * .env.local, which this script reads. Never commit it. Re-running overwrites files with the same path.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { put } from '@vercel/blob';

const dryRun = process.argv.includes('--dry-run');
if (existsSync('.env.local')) process.loadEnvFile('.env.local');

const root = path.resolve('public/media');
const types = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', svg: 'image/svg+xml' };

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(abs)));
    else if (types[path.extname(entry.name).slice(1).toLowerCase()]) out.push(abs);
  }
  return out;
}

if (!existsSync(root)) {
  console.error('public/media not found. Copy the photos there first (see README).');
  process.exit(1);
}
const files = await walk(root);
if (!files.length) {
  console.error('No images in public/media.');
  process.exit(1);
}
if (!dryRun && !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN is not set. Add it to .env.local or the environment (never commit it).');
  process.exit(1);
}

let origin = '';
let done = 0;
const queue = [...files];
async function worker() {
  for (let file = queue.shift(); file; file = queue.shift()) {
    const pathname = path.relative(root, file).split(path.sep).join('/');
    const size = (await stat(file)).size;
    if (dryRun) {
      console.log(`would upload ${pathname} (${Math.round(size / 1024)} KB)`);
      continue;
    }
    const blob = await put(pathname, await readFile(file), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      contentType: types[path.extname(file).slice(1).toLowerCase()],
    });
    origin ||= new URL(blob.url).origin;
    done += 1;
    console.log(`uploaded ${pathname} (${Math.round(size / 1024)} KB)`);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));

if (!dryRun) {
  console.log(`\n${done} file(s) uploaded.`);
  console.log(`Set this in Vercel (Production and Preview) and in .env.local:\nNEXT_PUBLIC_MEDIA_BASE_URL=${origin}`);
}
