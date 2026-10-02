const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('src/features/dashboard/portfolio.ts', 'utf8');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exportsObject });
const { toHoldings, applyBase, byCategory, byCurrency, cashPosition, sum } = exportsObject;
const user = { netAssets: 10000, liabilities: 2000, emergencyFund: 1000 };
const assets = [
  { label: '株', category: '日本株', currency: 'JPY', value: 5000 },
  { label: '外貨', category: '現金', currency: 'USD', value: 1000 },
  { label: '円現金', category: '現金', currency: 'JPY', value: 2000 },
];
const holdings = toHoldings(assets, user);
test('stored net cash is not charged liabilities twice; every allocation uses net assets', () => {
  const p = cashPosition(applyBase(holdings, 'total', user.emergencyFund));
  assert.equal(sum(holdings), 8000);
  assert.equal(p.total, 8000);
  assert.equal(p.cashTotal, 3000);
  assert.equal(p.cash.find(h => h.currency === 'USD').value, 1000);
  assert.equal(p.cashTotal + p.nonCashTotal, p.total);
});
test('investment base deducts reserve from both cash and denominator', () => {
  const p = cashPosition(applyBase(holdings, 'invest', user.emergencyFund));
  assert.equal(p.cashTotal, 2000);
  assert.equal(p.total, 7000);
  assert.equal(p.canShowAllocation, true);
});
test('zero liabilities preserves the previous cash ratio', () => {
  const p = cashPosition(applyBase(toHoldings(assets, { ...user, liabilities: 0 }), 'invest', user.emergencyFund));
  assert.equal(p.cashTotal, 4000);
  assert.equal(p.total, 9000);
});
test('cash shortage stays negative instead of producing a misleading allocation', () => {
  const p = cashPosition(applyBase(toHoldings(assets, { ...user, liabilities: 5000 }), 'invest', user.emergencyFund));
  assert.equal(p.cash.find(h => h.currency === 'JPY').value, -2000);
  assert.equal(p.cashTotal, -1000);
  assert.equal(p.canShowAllocation, false);
});
test('zero or negative net assets do not render a percentage allocation', () => {
  for (const liabilities of [10000, 11000]) {
    const p = cashPosition(toHoldings(assets, { ...user, liabilities }));
    assert.equal(p.canShowAllocation, false);
    assert.equal(exportsObject.formatPct(p.cashTotal, p.total), '—');
  }
});


test('one million yen in bank and 300k liabilities produces 700k JPY cash', () => {
  const h = toHoldings([
    { label: '株', category: '日本株', currency: 'JPY', value: 2000000 },
    { label: '円現金', category: '現金', currency: 'JPY', value: 700000 },
  ], { netAssets: 3000000, liabilities: 300000, emergencyFund: 0 });
  assert.equal(h.find(h => h.isJpyCash).value, 700000);
  assert.equal(sum(h), 2700000);
});

test('cash, currencies, classes and holdings share a net denominator in both modes', () => {
  for (const base of ['total', 'invest']) {
    const scoped = applyBase(holdings, base, user.emergencyFund);
    const p = cashPosition(scoped);
    assert.equal(sum(scoped), p.total);
    assert.equal(sum(scoped.filter(h => h.category === '現金')), p.cashTotal);
    assert.equal(byCurrency(scoped).reduce((s, h) => s + h.value, 0), p.total);
    assert.equal(byCategory(scoped).reduce((s, h) => s + h.value, 0), p.total);
    assert.equal(byCurrency(scoped).find(h => h.name === 'JPY').value, base === 'total' ? 7000 : 6000);
    assert.equal(exportsObject.formatPct(5000, sum(scoped)), base === 'total' ? '62.5%' : '71.4%');
  }
});

test('cash shortage and excess reserves stay signed in every allocation', () => {
  const u = { ...user, liabilities: 6000, emergencyFund: 5000 };
  const scoped = applyBase(toHoldings(assets, u), 'invest', u.emergencyFund);
  assert.equal(scoped.find(h => h.isJpyCash).value, -7000);
  assert.equal(sum(scoped), -1000);
  assert.equal(byCurrency(scoped).find(h => h.name === 'JPY').value, -2000);
  assert.equal(byCategory(scoped).find(h => h.name === '現金').value, -6000);
  assert.equal(exportsObject.formatPct(5000, sum(scoped)), '—');
});
