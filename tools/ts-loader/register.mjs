/**
 * Lets Node run the site's TypeScript modules from a tool script:
 *   node --experimental-strip-types --import ./tools/ts-loader/register.mjs tools/<script>.mts
 * See hooks.mjs for what it resolves.
 */
import { register } from 'node:module';

register('./hooks.mjs', import.meta.url);
