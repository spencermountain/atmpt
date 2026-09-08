import test from 'node:test';
import assert from 'node:assert';
import atmpt from '../src/index.js';

// deterministic prng (mulberry32) so failures are reproducible
const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const trickyChars = '0123456789()!|\\ \n🍎é';
const vals = ['Noun', 'Verb', 'Adjective', 'Pipe|Val', 'true', 'multi word val'];

const randomWord = (rand, tricky) => {
  const len = 1 + Math.floor(rand() * 10);
  let word = '';
  for (let i = 0; i < len; i += 1) {
    const pool = tricky && rand() < 0.15 ? trickyChars : alphabet;
    word += [...pool][Math.floor(rand() * [...pool].length)];
  }
  return word;
};

// at any knobs, get() must return the exact val for every remembered word
const checkFidelity = (obj, direction, burnOpts) => {
  const image = atmpt(obj, { direction }).burn(burnOpts);
  const out = atmpt.load(image);
  assert.strictEqual(out.direction, direction, 'direction survives');
  for (const [word, val] of Object.entries(obj)) {
    assert.strictEqual(out.get(word), val, `get(${JSON.stringify(word)})`);
  }
  return out;
};

test('round-trip: random word sets, both directions, default knobs', () => {
  const rand = mulberry32(42);
  for (let iter = 0; iter < 25; iter += 1) {
    const obj = {};
    const n = 5 + Math.floor(rand() * 80);
    for (let i = 0; i < n; i += 1) {
      obj[randomWord(rand, false)] = vals[Math.floor(rand() * vals.length)];
    }
    checkFidelity(obj, iter % 2 === 0 ? 'prefix' : 'suffix', {});
  }
});

test('round-trip: pure storage (no rules), has() intact', () => {
  const rand = mulberry32(7);
  for (let iter = 0; iter < 15; iter += 1) {
    const obj = {};
    const n = 5 + Math.floor(rand() * 60);
    for (let i = 0; i < n; i += 1) {
      obj[randomWord(rand, false)] = vals[Math.floor(rand() * vals.length)];
    }
    const out = checkFidelity(obj, iter % 2 === 0 ? 'prefix' : 'suffix', { support: 9999 });
    for (const word of Object.keys(obj)) {
      assert.strictEqual(out.has(word), true, `has(${JSON.stringify(word)})`);
    }
  }
});

test('round-trip: words with reserved and unicode characters', () => {
  const rand = mulberry32(1234);
  for (let iter = 0; iter < 25; iter += 1) {
    const obj = {};
    const n = 5 + Math.floor(rand() * 40);
    for (let i = 0; i < n; i += 1) {
      obj[randomWord(rand, true)] = vals[Math.floor(rand() * vals.length)];
    }
    checkFidelity(obj, iter % 2 === 0 ? 'prefix' : 'suffix', {});
  }
});

test('round-trip: nested words (chains)', () => {
  const obj = {
    walk: 'Verb',
    walked: 'PastTense',
    walker: 'Noun',
    walkers: 'Plural',
    w: 'Letter',
  };
  const out = checkFidelity(obj, 'prefix', { support: 9999 });
  // no phantom words invented by loading
  assert.strictEqual(out.has('ed'), false);
  assert.strictEqual(out.has('er'), false);
  assert.strictEqual(out.has('walke'), false);
});

test('round-trip: identical image bug regression', () => {
  // these two used to pack to the same string
  const a = atmpt({ walk: 'A', walked: 'A', q: 'B' }, { direction: 'prefix' }).burn({ support: 9999 });
  const b = atmpt({ walk: 'A', ed: 'A', q: 'B' }, { direction: 'prefix' }).burn({ support: 9999 });
  assert.notStrictEqual(a, b);
});

test('round-trip: multi-level unnesting', () => {
  const obj = { ab: 'X', acd: 'X', ace: 'X', q: 'Y' };
  const out = checkFidelity(obj, 'prefix', { support: 9999 });
  assert.strictEqual(out.has('aq'), false, 'no phantom aq');
});

test('round-trip: trailing content after last paren', () => {
  const out = checkFidelity({ apple: 'NS', apples: 'NP', applesauce: 'NS' }, 'prefix', { support: 9999 });
  assert.strictEqual(out.get('applesauce'), 'NS');
});

test('round-trip: digits and punctuation in words', () => {
  checkFidelity({ 'mp3': 'Noun', '4th': 'Ordinal', 'b2b': 'Noun', ':-(': 'Emoticon', 'bang!': 'Excl' }, 'prefix', {});
});

test('getNode returns null for missing keys', () => {
  const out = atmpt.load(atmpt({ apple: 'Noun' }, { direction: 'prefix' }).burn({ support: 9999 }));
  assert.strictEqual(out.getNode('banana'), null);
  assert.strictEqual(out.getNode('apples'), null);
});
