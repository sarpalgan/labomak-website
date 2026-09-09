import fs from 'node:fs';
import { documents } from '../data/resources.mjs';
fs.writeFileSync(new URL('../data/document-check-input.json',import.meta.url),JSON.stringify(documents.map(d=>({id:d.id,url:d.url})),null,2)+'\n');
console.log(`Prepared ${documents.length} document references for verification.`);
