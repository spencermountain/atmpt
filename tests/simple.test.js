import test from 'node:test';
import assert from 'node:assert';
import atmpt from '../src/index.js';

test('simple has', (t) => {
  let trie = atmpt('prefix')
  assert.strictEqual(trie.has('apple'), false)
  trie.add('apple')
  assert.strictEqual(trie.has('apple'), true)
  assert.strictEqual(trie.has('apples'), false)
  assert.strictEqual(trie.has('app'), false)
  assert.strictEqual(trie.has('ap'), false)
  assert.strictEqual(trie.has('a'), false)
  assert.strictEqual(trie.has(''), false)
})

test('simple overlap', (t) => {
  let trie = atmpt('prefix')
  trie.add('apple')
  trie.add('apples')
  assert.strictEqual(trie.has('apple'), true)
  assert.strictEqual(trie.has('apples'), true)
  assert.strictEqual(trie.has('applesauce'), false)
  assert.strictEqual(trie.has('applesauce'), false)
  assert.strictEqual(trie.has('app'), false)
  assert.strictEqual(trie.has('elppa'), false)
  assert.strictEqual(trie.has('elppas'), false)
})

test('simple suffix', (t) => {
  let trie = atmpt('suffix')
  trie.add('apple')
  trie.add('apples')
  assert.strictEqual(trie.has('apple'), true)
  assert.strictEqual(trie.has('apples'), true)
  assert.strictEqual(trie.has('applesauce'), false)
  assert.strictEqual(trie.has('applesauce'), false)
  assert.strictEqual(trie.has('app'), false)
  assert.strictEqual(trie.has(''), false)
  assert.strictEqual(trie.has('elppa'), false)
  assert.strictEqual(trie.has('elppas'), false)
  assert.strictEqual(trie.has('elppasauce'), false)
  assert.strictEqual(trie.has('elppasauce'), false)
  assert.strictEqual(trie.has('elpp'), false)
  assert.strictEqual(trie.has('el'), false)
  assert.strictEqual(trie.has('e'), false)
  assert.strictEqual(trie.has(''), false)
})