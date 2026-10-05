/**
 * Copies the prototype's placeholder images into theme/assets so sections can
 * fall back to them (see snippets/responsive-image.liquid) until real photos are uploaded.
 * Runs as part of `npm run build:theme`.
 */
import { cpSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const from = resolve(root, 'public/assets/images/placeholders');
const to = resolve(root, 'theme/assets');
for (const file of readdirSync(from)) cpSync(resolve(from, file), resolve(to, file));
console.log(`placeholders: ${readdirSync(from).length} files → theme/assets`);
