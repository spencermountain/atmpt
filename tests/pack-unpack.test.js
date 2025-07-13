import test from 'node:test';
import assert from 'node:assert';
import atmpt from '../src/index.js';

test('simple has', (t) => {
  let inputs = [
    'spoon',
    'spoons',
    'spooned',
    'fork',
  ]
  let trie = atmpt(inputs, 'prefix')
  let packed = trie.toString()
  let t2 = atmpt.unpack(packed)

  inputs.forEach(word => {
    assert.strictEqual(t2.has(word), true, word)
  })
  // assert.strictEqual(t2.has('spoo'), false)
  // assert.strictEqual(t2.has('f'), false)
})
