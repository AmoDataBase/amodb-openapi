// Builds postman_collection.json from openapi.yaml with openapi-to-postmanv2.
// Run with: npm run build:postman
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Converter from 'openapi-to-postmanv2';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const specPath = join(root, 'openapi.yaml');
const outPath = join(root, 'postman_collection.json');
const spec = readFileSync(specPath, 'utf8');

const BASE_URL = 'https://api.amodb.dev';
const IMAGE_URL = 'https://img.amodb.dev';

/** Stable UUID so that a rebuild without spec changes gives the same file. */
function uuid(seed) {
  const h = createHash('sha1').update(seed).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

function convert() {
  const options = {
    folderStrategy: 'Tags',
    parametersResolution: 'Example',
    requestParametersResolution: 'Example',
    exampleParametersResolution: 'Example',
    enableOptionalParameters: false,
    includeAuthInfoInExample: false,
  };
  return new Promise((resolve, reject) => {
    Converter.convert({ type: 'string', data: spec }, options, (err, res) => {
      if (err) return reject(err);
      if (!res.result) return reject(new Error(res.reason || 'conversion failed'));
      resolve(res.output[0].data);
    });
  });
}

function finish(items, trail, stats) {
  for (const item of items) {
    const here = `${trail}/${item.name}`;
    item.id = uuid(here);
    if (item.item) {
      finish(item.item, here, stats);
      continue;
    }
    stats.requests += 1;
    // Saved example responses are left out to keep the file small.
    delete item.response;
    const req = item.request;
    const host = (req.url.host || []).join('.');
    const isImage = host === 'img.amodb.dev';
    if (isImage) {
      req.url.host = ['{{imageBaseUrl}}'];
      delete req.url.protocol;
    }
    if (isImage || req.url.path.join('/') === 'plans') {
      req.auth = { type: 'noauth' };
    } else if (req.auth && req.auth.type === 'apikey') {
      stats.omdb += 1;
      for (const q of req.url.query) if (q.key === 'i') q.disabled = false;
    } else {
      delete req.auth; // inherits the collection bearer auth
    }
    if (req.url.path.join('/') === 'plans') stats.plans += 1;
  }
}

const collection = await convert();
const description = (collection.info.description?.content || '').split('\n\nContact Support:')[0];

collection.info = {
  _postman_id: uuid('amodb-openapi'),
  name: collection.info.name,
  description: { content: description, type: 'text/markdown' },
  schema: collection.info.schema,
};
collection.variable = [
  { key: 'baseUrl', value: BASE_URL, type: 'string' },
  { key: 'apiKey', value: '', type: 'string' },
  { key: 'imageBaseUrl', value: IMAGE_URL, type: 'string' },
];
collection.auth = {
  type: 'bearer',
  bearer: [{ key: 'token', value: '{{apiKey}}', type: 'string' }],
};
if (!collection.event || collection.event.length === 0) delete collection.event;

const stats = { requests: 0, omdb: 0, plans: 0 };
finish(collection.item, 'amodb', stats);

const operations = (spec.match(/^\s+operationId: /gm) || []).length;
if (stats.requests !== operations) {
  throw new Error(`Collection has ${stats.requests} requests but the spec has ${operations} operations`);
}
if (stats.omdb !== 1 || stats.plans !== 1) throw new Error('OMDb or plans request is missing');

writeFileSync(outPath, JSON.stringify(collection, null, 2) + '\n');
console.log(`postman_collection.json: ${stats.requests} requests in ${collection.item.length} folders`);
