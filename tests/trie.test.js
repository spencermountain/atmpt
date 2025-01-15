import test from 'node:test';
import assert from 'node:assert';
import { Trie } from '../src/index.js';
import { prefixes } from '../examples.js';

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
    const trie = new Trie(prefixes.a);
    Object.entries(prefixes.a).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives', () => {
    const trie = new Trie(prefixes.a);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  // Add tests for prefixes.b
  await t.test('prefixes.b', () => {
    const trie = new Trie(prefixes.b);
    Object.entries(prefixes.b).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set b)', () => {
    const trie = new Trie(prefixes.b);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  // Add tests for prefixes.c
  await t.test('prefixes.c', () => {
    const trie = new Trie(prefixes.c);
    Object.entries(prefixes.c).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set c)', () => {
    const trie = new Trie(prefixes.c);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  // Add tests for prefixes.d
  await t.test('prefixes.d', () => {
    const trie = new Trie(prefixes.d);
    Object.entries(prefixes.d).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set d)', () => {
    const trie = new Trie(prefixes.d);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });
});