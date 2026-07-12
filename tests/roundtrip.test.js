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
const tags = ['Noun', 'Verb', 'Adjective', 'Pipe|Tag', 'true', 'multi word tag'];

const randomWord = (rand, tricky) => {
  const len = 1 + Math.floor(rand() * 10);
  let word = '';
  for (let i = 0; i < len; i += 1) {
    const pool = tricky && rand() < 0.15 ? trickyChars : alphabet;
    word += [...pool][Math.floor(rand() * [...pool].length)];
  }
  return word;
};

const roundTrip = (obj, direction) => {
  const trie = atmpt(obj, direction);
  const unpacked = atmpt.unpack(trie.toString());
  assert.strictEqual(unpacked.direction, direction, 'direction survives');
  for (const [word, value] of Object.entries(obj)) {
    assert.strictEqual(unpacked.get(word), value, `get(${JSON.stringify(word)})`);
    assert.strictEqual(unpacked.has(word), true, `has(${JSON.stringify(word)})`);
  }
  return unpacked;
};

test('round-trip: random word sets, both directions', () => {
  const rand = mulberry32(42);
  for (let iter = 0; iter < 25; iter += 1) {
    const obj = {};
    const n = 5 + Math.floor(rand() * 80);
    for (let i = 0; i < n; i += 1) {
      obj[randomWord(rand, false)] = tags[Math.floor(rand() * tags.length)];
    }
    roundTrip(obj, iter % 2 === 0 ? 'prefix' : 'suffix');
  }
});

test('round-trip: words with reserved and unicode characters', () => {
  const rand = mulberry32(1234);
  for (let iter = 0; iter < 25; iter += 1) {
    const obj = {};
    const n = 5 + Math.floor(rand() * 40);
    for (let i = 0; i < n; i += 1) {
      obj[randomWord(rand, true)] = tags[Math.floor(rand() * tags.length)];
    }
    roundTrip(obj, iter % 2 === 0 ? 'prefix' : 'suffix');
  }
});

test('round-trip: nested words (chains)', () => {
  // words that are prefixes of each other — the old format was ambiguous here
  const obj = {
    walk: 'Verb',
    walked: 'PastTense',
    walker: 'Noun',
    walkers: 'Plural',
    w: 'Letter',
  };
  const unpacked = roundTrip(obj, 'prefix');
  // no phantom words invented by unpacking
  assert.strictEqual(unpacked.has('ed'), false);
  assert.strictEqual(unpacked.has('er'), false);
  assert.strictEqual(unpacked.has('walke'), false);
});

test('round-trip: identical packing bug regression', () => {
  // these two used to pack to the same string
  const a = atmpt({ walk: 'A', walked: 'A', q: 'B' }, 'prefix').toString();
  const b = atmpt({ walk: 'A', ed: 'A', q: 'B' }, 'prefix').toString();
  assert.notStrictEqual(a, b);
});

test('round-trip: multi-level unnesting', () => {
  const obj = { ab: 'X', acd: 'X', ace: 'X', q: 'Y' };
  const unpacked = roundTrip(obj, 'prefix');
  assert.strictEqual(unpacked.has('aq'), false, 'no phantom aq');
});

test('round-trip: trailing content after last paren', () => {
  // root chain with no parens at all used to tokenize to nothing
  const unpacked = roundTrip({ apple: 'NS', apples: 'NP', applesauce: 'NS' }, 'prefix');
  assert.strictEqual(unpacked.get('applesauce'), 'NS');
});

test('round-trip: suffix direction preserved', () => {
  const obj = { walked: 'PastTense', talked: 'PastTense', running: 'Gerund' };
  const unpacked = roundTrip(obj, 'suffix');
  assert.strictEqual(unpacked.direction, 'suffix');
  assert.strictEqual(unpacked.get('walked'), 'PastTense');
});

test('round-trip: digits and punctuation in words', () => {
  roundTrip({ 'mp3': 'Noun', '4th': 'Ordinal', 'b2b': 'Noun', ':-(': 'Emoticon', 'bang!': 'Excl' }, 'prefix');
});

test('getNode returns null for missing keys', () => {
  const trie = atmpt({ apple: 'Noun' }, 'prefix');
  assert.strictEqual(trie.getNode('banana'), null);
  assert.strictEqual(trie.getNode('apples'), null);
});
