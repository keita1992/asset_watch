const assert = require('node:assert/strict');
const fs = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');

const ts = require('typescript');

const load = (file, mocks = {}) => {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(source, { exports, require: (name) => mocks[name] ?? require(name), console });
  return exports;
};

const dates = load('src/utils/lastUpdated.ts');

const createResponse = () => ({
  statusCode: null,
  body: null,
  headers: {},
  setHeader(name, value) { this.headers[name] = value; },
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

test('compares actual instants, ignores missing or invalid values, and formats in Japan time', () => {
  assert.equal(dates.latestUpdatedAt([
    '2026-09-21T00:00:00+09:00',
    '2026-09-20T16:00:00Z',
    'invalid',
    null,
  ]), '2026-09-20T16:00:00Z');
  assert.equal(dates.formatLastUpdated('2026-09-20T16:00:00Z'), '2026/09/21 01:00');
  assert.equal(dates.latestUpdatedAt([null, '', 'invalid']), null);
});

test('last update includes profile changes and deleted assets across every page', async () => {
  const calls = [];
  const client = {
    graphql: async ({ query, variables }) => {
      calls.push({ query, variables });
      if (query === 'getUser') return { data: { getUser: { updatedAt: '2026-09-20T10:00:00Z' } } };
      if (!variables.nextToken) return { data: { listAssets: {
        items: [{ updatedAt: '2026-09-19T10:00:00Z' }], nextToken: 'next',
      } } };
      return { data: { listAssets: {
        items: [{ updatedAt: '2026-09-21T10:00:00Z', deletedAt: '2026-09-21T10:00:00Z' }], nextToken: null,
      } } };
    },
  };
  const { default: handler } = load('src/pages/api/assets/last-updated.ts', {
    '@/graphql/queries': { getUser: 'getUser', listAssets: 'listAssets' },
    '@/libs/amplify': { client },
    '@/utils/constants': { USER_ID: 'test-user' },
    '@/utils/lastUpdated': dates,
  });
  const res = createResponse();
  await handler({ method: 'GET' }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.lastUpdatedAt, '2026-09-21T10:00:00Z');
  assert.equal(res.headers['Cache-Control'], 'no-store');
  const assetCalls = calls.filter(({ query }) => query === 'listAssets');
  assert.equal(assetCalls.length, 2);
  assert.equal(assetCalls[1].variables.nextToken, 'next');
  for (const { variables } of assetCalls) {
    assert.equal(variables.filter.userId.eq, 'test-user');
    assert.equal('deletedAt' in variables.filter, false);
  }
});

test('returns no date if timestamps are unavailable and rejects unsupported methods', async () => {
  const { default: handler } = load('src/pages/api/assets/last-updated.ts', {
    '@/graphql/queries': { getUser: 'getUser', listAssets: 'listAssets' },
    '@/libs/amplify': { client: { graphql: async ({ query }) => query === 'getUser'
      ? { data: { getUser: { updatedAt: null } } }
      : { data: { listAssets: { items: [null], nextToken: null } } } } },
    '@/utils/constants': { USER_ID: 'test-user' },
    '@/utils/lastUpdated': dates,
  });
  const res = createResponse();
  await handler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.lastUpdatedAt, null);
  const unsupported = createResponse();
  await handler({ method: 'POST' }, unsupported);
  assert.equal(unsupported.statusCode, 405);
});
