import test from 'node:test';
import assert from 'node:assert';
import atmpt from '../src/index.js';

// storage semantics: burn with support high enough that no rules mint
const store = (memory) => atmpt.load(memory.burn({ support: 9999 }));

test('simple has', (t) => {
  let out = store(atmpt(['apple']))
  assert.strictEqual(out.has('apple'), true)
  assert.strictEqual(out.has('apples'), false)
  assert.strictEqual(out.has('app'), false)
  assert.strictEqual(out.has('ap'), false)
  assert.strictEqual(out.has('a'), false)
  assert.strictEqual(out.has(''), false)
})

test('simple overlap', (t) => {
  let out = store(atmpt(['apple', 'apples']))
  assert.strictEqual(out.has('apple'), true)
  assert.strictEqual(out.has('apples'), true)
  assert.strictEqual(out.has('applesauce'), false)
  assert.strictEqual(out.has('app'), false)
  assert.strictEqual(out.has('elppa'), false)
  assert.strictEqual(out.has('elppas'), false)
})

test('simple overlap 2', (t) => {
  let inputs = [
    'spoon',
    'spoons',
    'spooned',
    'fork',
  ]
  let out = store(atmpt(inputs, { direction: 'prefix' }))
  inputs.forEach(word => {
    assert.strictEqual(out.has(word), true, word)
  })
  assert.strictEqual(out.has('spoo'), false)
  assert.strictEqual(out.has('f'), false)
})

test('simple suffix', (t) => {
  let out = store(atmpt(['apple', 'apples'], { direction: 'suffix' }))
  assert.strictEqual(out.has('apple'), true)
  assert.strictEqual(out.has('apples'), true)
  assert.strictEqual(out.has('applesauce'), false)
  assert.strictEqual(out.has('app'), false)
  assert.strictEqual(out.has(''), false)
  assert.strictEqual(out.has('elppa'), false)
  assert.strictEqual(out.has('elppas'), false)
  assert.strictEqual(out.has('elpp'), false)
  assert.strictEqual(out.has('el'), false)
  assert.strictEqual(out.has('e'), false)
})

test('one-val word lists collapse to a root rule at default knobs', (t) => {
  // every word has val `true`, so the evidence is 100% pure — the whole
  // trie collapses into a single root rule
  let image = atmpt(['spoon', 'spoons', 'spooned', 'fork']).burn()
  let out = atmpt.load(image)
  assert.ok(image.length < 20, image)
  assert.strictEqual(out.get('spoon'), 'true')
  assert.strictEqual(out.get('anything at all'), 'true')
})
