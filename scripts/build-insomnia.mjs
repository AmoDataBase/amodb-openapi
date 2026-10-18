// Builds insomnia_export.json (Insomnia v4 export format) from postman_collection.json.
// Run build:postman first. Run with: npm run build:insomnia
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const collection = JSON.parse(readFileSync(join(root, 'postman_collection.json'), 'utf8'));
const outPath = join(root, 'insomnia_export.json');

const STAMP = Date.UTC(2026, 9, 18);
const id = (prefix, seed) => `${prefix}_${createHash('sha1').update(seed).digest('hex').slice(0, 32)}`;
const vars = Object.fromEntries(collection.variable.map((v) => [v.key, v.value]));
const text = (d) => (typeof d === 'string' ? d : d?.content || '');

const workspaceId = id('wrk', 'amodb-openapi');
const resources = [
  {
    _id: workspaceId,
    _type: 'workspace',
    parentId: null,
    name: collection.info.name,
    description: text(collection.info.description),
    scope: 'collection',
    created: STAMP,
    modified: STAMP,
  },
  {
    _id: id('env', 'base'),
    _type: 'environment',
    parentId: workspaceId,
    name: 'Base Environment',
    data: { baseUrl: vars.baseUrl, apiKey: vars.apiKey, imageBaseUrl: vars.imageBaseUrl },
    dataPropertyOrder: { '&': ['baseUrl', 'apiKey', 'imageBaseUrl'] },
    color: null,
    isPrivate: false,
    metaSortKey: STAMP,
    created: STAMP,
    modified: STAMP,
  },
];

/** Postman {{name}} to Insomnia {{ _.name }}. */
const tmpl = (s) => String(s).replace(/\{\{\s*(\w+)\s*\}\}/g, '{{ _.$1 }}');

function buildUrl(url) {
  const pathVars = Object.fromEntries((url.variable || []).map((v) => [v.key, v.value]));
  const path = url.path.map((seg) => (seg.startsWith(':') ? pathVars[seg.slice(1)] ?? seg : seg)).join('/');
  return `${tmpl(url.host.join('.'))}/${path}`;
}

function buildAuth(req) {
  if (req.auth?.type === 'noauth') return {};
  if (req.auth?.type === 'apikey') {
    const get = (k) => req.auth.apikey.find((a) => a.key === k)?.value;
    return { type: 'apikey', key: get('key'), value: tmpl(get('value')), addTo: 'queryParams' };
  }
  const token = collection.auth.bearer.find((b) => b.key === 'token').value;
  return { type: 'bearer', token: tmpl(token), prefix: '' };
}

let order = 0;
let requests = 0;
for (const folder of collection.item) {
  const folderId = id('fld', folder.name);
  order += 1;
  resources.push({
    _id: folderId,
    _type: 'request_group',
    parentId: workspaceId,
    name: folder.name,
    description: text(folder.description),
    environment: {},
    environmentPropertyOrder: null,
    metaSortKey: order * 1000,
    created: STAMP,
    modified: STAMP,
  });
  folder.item.forEach((item, index) => {
    const req = item.request;
    requests += 1;
    resources.push({
      _id: id('req', `${folder.name}/${item.name}`),
      _type: 'request',
      parentId: folderId,
      name: item.name,
      description: text(req.description),
      url: buildUrl(req.url),
      method: req.method,
      body: {},
      parameters: (req.url.query || []).map((q) => ({
        id: id('pair', `${folder.name}/${item.name}/${q.key}`),
        name: q.key,
        value: q.value ?? '',
        description: q.description || '',
        disabled: Boolean(q.disabled),
      })),
      headers: (req.header || []).map((h) => ({ name: h.key, value: h.value })),
      authentication: buildAuth(req),
      metaSortKey: (index + 1) * 100,
      isPrivate: false,
      settingStoreCookies: true,
      settingSendCookies: true,
      settingDisableRenderRequestBody: false,
      settingEncodeUrl: true,
      settingRebuildPath: true,
      settingFollowRedirects: 'global',
      created: STAMP,
      modified: STAMP,
    });
  });
}

const out = {
  _type: 'export',
  __export_format: 4,
  __export_date: new Date(STAMP).toISOString(),
  __export_source: 'amodb-openapi:0.1.0',
  resources,
};
writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(`insomnia_export.json: ${requests} requests in ${collection.item.length} folders`);
