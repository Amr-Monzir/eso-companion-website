import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import settings from '../website.config.json';

const routes = [
  { path: 'beta', title: 'Private beta: ESO Companion', description: 'Sign up for the ESO Companion private beta. Your email is used only for beta contact.' },
  { path: 'contact', title: 'Contact: ESO Companion', description: 'Send a question, setup problem, bug report or feedback to the ESO Companion developer.' },
  { path: 'support', title: 'Buy me a coffee: ESO Companion', description: 'Optional support for the ESO Companion developer.' },
  { path: 'installation', title: 'Private beta: ESO Companion', description: 'Private beta signup for ESO Companion.' },
];

const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function staticPages(): Plugin {
  let output = '';
  return {
    name: 'github-pages-static-routes',
    apply: 'build',
    configResolved(config) { output = path.resolve(config.root, config.build.outDir); },
    async closeBundle() {
      const index = await readFile(path.join(output, 'index.html'), 'utf8');
      // GitHub Pages serves directory indexes, so direct links and refreshes need no server rewrite.
      for (const route of routes) {
        const html = index
          .replace(/<title>[^<]*<\/title>/, `<title>${escape(route.title)}</title>`)
          .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(route.description)}$2`)
          .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escape(route.title)}$2`)
          .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escape(route.description)}$2`);
        await mkdir(path.join(output, route.path), { recursive: true });
        await writeFile(path.join(output, route.path, 'index.html'), html);
      }
      await writeFile(path.join(output, '404.html'), index.replace(/<title>[^<]*<\/title>/, '<title>Page not found: ESO Companion</title>'));
      await writeFile(path.join(output, '.nojekyll'), '');
      if (settings.customDomain) {
        if (!/^(?=.{1,253}$)[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(settings.customDomain)) {
          throw new Error('customDomain must be a hostname without a protocol or path.');
        }
        await writeFile(path.join(output, 'CNAME'), `${settings.customDomain}\n`);
      }
    },
  };
}
