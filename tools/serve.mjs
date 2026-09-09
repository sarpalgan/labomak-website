import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain' };
export function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    let requested;
    try { requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); res.end('Bad request'); return; }
    const file = path.resolve(root, '.' + requested);
    if (!(file === root || file.startsWith(root + path.sep)) || requested.includes('\\')) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    let target = file;
    try {
      if (fs.statSync(target).isDirectory()) {
        if (!requested.endsWith('/')) { res.writeHead(301, { Location: requested + '/' }); res.end(); return; }
        target = path.join(target, 'index.html');
      }
      const data = fs.readFileSync(target);
      res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!doctype html><html lang="en"><title>Page not found | Labomak</title><h1>Page not found</h1><p><a href="/">Return to Labomak</a></p></html>');
    }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4174);
  createServer().listen(port, '127.0.0.1', () => console.log(`Labomak preview: http://127.0.0.1:${port}`));
}
