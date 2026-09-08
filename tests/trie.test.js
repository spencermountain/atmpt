import test from 'node:test';
import assert from 'node:assert';
import atmpt from '../src/index.js';
import { prefixes } from './_examples.js';

const notWords = [
  'xyz',
  'notaword',
  'foodnotfound',
  'placenotfound',
  'a',
  'b',
  'c',
];

const burned = (obj) => atmpt.load(atmpt(obj, { direction: 'prefix' }).burn());

test('Trie Tests', async (t) => {
  for (const key of Object.keys(prefixes)) {
    await t.test(`check existing words (set ${key})`, () => {
      const out = burned(prefixes[key]);
      Object.entries(prefixes[key]).forEach(([word, val]) => {
        assert.strictEqual(out.get(word), val);
      });
    });

    await t.test(`check false-positives (set ${key})`, () => {
      const out = burned(prefixes[key]);
      notWords.forEach(word => {
        assert.strictEqual(out.get(word), null);
      });
    });
  }
});
