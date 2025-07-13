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

test('Trie Tests', async (t) => {
  await t.test('check existing words', () => {
    const trie = atmpt(prefixes.a);
    Object.entries(prefixes.a).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives', () => {
    const trie = atmpt(prefixes.a);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  // Add tests for prefixes.b
  await t.test('prefixes.b', () => {
    const trie = atmpt(prefixes.b);
    Object.entries(prefixes.b).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set b)', () => {
    const trie = atmpt(prefixes.b);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  // Add tests for prefixes.c
  await t.test('prefixes.c', () => {
    const trie = atmpt(prefixes.c);
    Object.entries(prefixes.c).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set c)', () => {
    const trie = atmpt(prefixes.c);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  // Add tests for prefixes.d
  await t.test('prefixes.d', () => {
    const trie = atmpt(prefixes.d);
    Object.entries(prefixes.d).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set d)', () => {
    const trie = atmpt(prefixes.d);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });
});