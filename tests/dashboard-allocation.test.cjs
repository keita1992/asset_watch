const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const load = (file, mocks = {}, cache = new Map()) => {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const localRequire = (name) => {
    if (name in mocks) return mocks[name];
    if (name.startsWith('.') || name.startsWith('@/')) {
      const base = name.startsWith('@/') ? path.resolve('src', name.slice(2)) : path.resolve(path.dirname(file), name);
      const target = ['.ts', '.tsx'].map(ext => base + ext).find(fs.existsSync);
      return load(target, mocks, cache);
    }
    return require(name);
  };
  vm.runInNewContext(source, { exports, require: localRequire });
  return exports;
};

const portfolio = load(path.resolve('src/features/dashboard/portfolio.ts'));
const user = { netAssets: 3000000, liabilities: 300000, emergencyFund: 200000 };
const holdings = portfolio.toHoldings([
  { label: '日本株', category: '日本株', currency: 'JPY', value: 1000000 },
  { label: '米国株', category: '米国株', currency: 'USD', value: 1000000 },
  { label: '円現金', category: '現金', currency: 'JPY', value: 700000 },
], user);

const descendants = (node) => {
  if (!React.isValidElement(node)) return [];
  return [node, ...React.Children.toArray(node.props.children).flatMap(descendants)];
};

test('dashboard passes the net denominator to every allocation, holding and concentration', () => {
  for (const base of ['total', 'invest']) {
    const states = [holdings, user, false, base];
    const mocks = {
      react: { ...React, useState: () => [states.shift(), () => {}], useEffect: () => {}, useMemo: fn => fn() },
      '@/libs/axios': {},
      '@/utils/constants': { USER_ID: 'test' },
    };
    const { Dashboard } = load(path.resolve('src/pages/index.tsx'), mocks);
    const nodes = descendants(Dashboard());
    const expectedTotal = base === 'total' ? 2700000 : 2500000;
    const allocations = nodes.filter(n => n.type.name === 'AllocationBar');
    assert.equal(allocations.length, 4);
    for (const n of allocations) assert.equal(n.props.total, expectedTotal);
    const list = nodes.find(n => n.type.name === 'HoldingList');
    assert.equal(list.props.rows.find(r => r.name === 'キャッシュ').value, base === 'total' ? 700000 : 500000);
    assert.equal(list.props.rows[0].totalPct, base === 'total' ? '37.0%' : '40.0%');
    const stats = nodes.find(n => n.type.name === 'Stats');
    assert.equal(stats.props.items[0].value, base === 'total' ? '37.0%' : '40.0%');
  }
});

test('balance sheet shows gross assets and net assets without subtracting debt twice', () => {
  const { Waterfall } = load(path.resolve('src/features/dashboard/components/Waterfall.tsx'));
  const nodes = descendants(Waterfall({ holdings, liabilities: user.liabilities }));
  const values = nodes.filter(n => n.props.className === 'aw-wf__val').map(n => n.props.children);
  assert.equal(values[0], '300万');
  assert.equal(values[2], '270万');
  const gross = nodes.find(n => n.props.label === '総資産の内訳');
  assert.equal(gross.props.total, 3000000);
  assert.equal(gross.props.segments.find(s => s.name === '現金').value, 1000000);
});

test('negative allocation displays signed values and omits the 100 percent stacked bar', () => {
  const { AllocationBar } = load(path.resolve('src/features/dashboard/components/AllocationBar.tsx'));
  const segments = [
    { key: 'cash', name: '現金', value: -300000, color: 'red', onColor: 'white' },
    { key: 'stock', name: '株', value: 1000000, color: 'blue', onColor: 'white' },
  ];
  for (const total of [700000, 0, -100000]) {
    const html = renderToStaticMarkup(React.createElement(AllocationBar, { label: '構成比', segments, total }));
    assert.match(html, /現金 ¥-300,000/);
    assert.doesNotMatch(html, /aw-alloc__seg/);
    if (total <= 0) assert.doesNotMatch(html, /%/);
  }
});


test('negative JPY cash cannot be hidden by foreign cash or currency aggregation', () => {
  const u = { netAssets: 1500000, liabilities: 300000, emergencyFund: 0 };
  const h = portfolio.toHoldings([
    { label: '日本株', category: '日本株', currency: 'JPY', value: 1000000 },
    { label: '米ドル預金A', category: '現金', currency: 'USD', value: 300000 },
    { label: '米ドル預金B', category: '現金', currency: 'USD', value: 200000 },
  ], u);
  const states = [h, u, false, 'total'];
  const mocks = {
    react: { ...React, useState: () => [states.shift(), () => {}], useEffect: () => {}, useMemo: fn => fn() },
    '@/libs/axios': {}, '@/utils/constants': { USER_ID: 'test' },
  };
  const { Dashboard } = load(path.resolve('src/pages/index.tsx'), mocks);
  const nodes = descendants(Dashboard());
  const allocations = nodes.filter(n => n.type.name === 'AllocationBar');
  assert.equal(allocations.length, 3);
  for (const n of allocations) assert.equal(n.props.canShowAllocation, false);
  const list = nodes.find(n => n.type.name === 'HoldingList');
  assert.equal(list.props.rows.find(r => r.name === '円現金').value, -300000);
  assert.equal(list.props.rows.find(r => r.name === 'USD現金').value, 500000);
});
