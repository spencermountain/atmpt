import test from 'node:test';
import assert from 'node:assert';
import { Trie } from '../src/index.js';
import { suffixes } from '../examples.js';

const notWords = [
  'xyz',
  'notaword',
  'foodnotfound',
  'namenotfound',
  'y',
  'r',
  's',
];

test('Suffix Trie Tests', async (t) => {
  await t.test('check y-ending words', () => {
    const trie = new Trie(suffixes.y, 'suffix');
    Object.entries(suffixes.y).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set y)', () => {
    const trie = new Trie(suffixes.y, 'suffix');
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  await t.test('check r-ending words', () => {
    const trie = new Trie(suffixes.r, 'suffix');
    Object.entries(suffixes.r).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set r)', () => {
    const trie = new Trie(suffixes.r, 'suffix');
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });

  await t.test('check s-ending words', () => {
    const trie = new Trie(suffixes.s, 'suffix');
    Object.entries(suffixes.s).forEach(([word, val]) => {
      assert.strictEqual(trie.get(word), val);
    });
  });

  await t.test('check false-positives (set s)', () => {
    const trie = new Trie(suffixes.s, 'suffix');
    notWords.forEach(word => {
      assert.strictEqual(trie.get(word), null);
    });
  });
}); 