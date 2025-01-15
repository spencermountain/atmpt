import test from 'node:test';
import assert from 'node:assert';
import { Trie } from '../src/index.js';
import { examples } from '../examples/prefixes.js';

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
    const trie = new Trie(examples.a);
    Object.entries(examples.a).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives', () => {
    const trie = new Trie(examples.a);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  // Add tests for examples.b
  await t.test('examples.b', () => {
    const trie = new Trie(examples.b);
    Object.entries(examples.b).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set b)', () => {
    const trie = new Trie(examples.b);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  // Add tests for examples.c
  await t.test('examples.c', () => {
    const trie = new Trie(examples.c);
    Object.entries(examples.c).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set c)', () => {
    const trie = new Trie(examples.c);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  // Add tests for examples.d
  await t.test('examples.d', () => {
    const trie = new Trie(examples.d);
    Object.entries(examples.d).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set d)', () => {
    const trie = new Trie(examples.d);
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });
});