import test from 'node:test';
import assert from 'node:assert';
import atmpt from '../src/index.js';

const lexicon = {
  walked: 'PastTense', talked: 'PastTense', parked: 'PastTense', helped: 'PastTense',
  naked: 'Adjective', // exception inside the -d pattern
  running: 'Gerund', sitting: 'Gerund', jumping: 'Gerund',
  the: 'Determiner', // closed-class, never generalizes
};

test('generalize: known words keep their tags', () => {
  const trie = atmpt(lexicon, 'suffix').generalize({ minSupport: 3, minPurity: 0.7 });
  for (const [word, tag] of Object.entries(lexicon)) {
    assert.strictEqual(trie.get(word), tag, word);
  }
});

test('generalize: rules fire for unseen regular words', () => {
  const trie = atmpt(lexicon, 'suffix').generalize({ minSupport: 3, minPurity: 0.7 });
  assert.strictEqual(trie.get('zorped'), 'PastTense');
  assert.strictEqual(trie.get('blorping'), 'Gerund');
});

test('generalize: stored words do NOT fire as suffix matches', () => {
  const trie = atmpt(lexicon, 'suffix').generalize({ minSupport: 3, minPurity: 0.7 });
  // "breathe" ends in "the", but "the" is a stored word, not a rule
  assert.strictEqual(trie.get('breathe'), null);
  assert.strictEqual(trie.get('xyzq'), null);
});

test('generalize: shrinks the packed string', () => {
  const flat = atmpt(lexicon, 'suffix');
  const before = flat.toString().length;
  const after = atmpt(lexicon, 'suffix').generalize({ minSupport: 3, minPurity: 0.7 }).toString().length;
  assert.ok(after < before, `${after} < ${before}`);
});

test('generalize: survives pack/unpack with rules intact', () => {
  const trie = atmpt(lexicon, 'suffix').generalize({ minSupport: 3, minPurity: 0.7 });
  const unpacked = atmpt.unpack(trie.toString());
  for (const [word, tag] of Object.entries(lexicon)) {
    assert.strictEqual(unpacked.get(word), tag, word);
  }
  assert.strictEqual(unpacked.get('zorped'), 'PastTense', 'rule fires after round-trip');
  assert.strictEqual(unpacked.get('breathe'), null, 'word values stay exact-only after round-trip');
});

test('generalize: does not clobber a stored word with a different tag', () => {
  // regression for the old prune() bug
  const trie = atmpt({ run: 'Verb', runs: 'PresentTense', rung: 'PastTense' }, 'prefix');
  trie.generalize({ minSupport: 1, minPurity: 0.5 });
  assert.strictEqual(trie.get('run'), 'Verb');
});

test('generalize: is idempotent', () => {
  const opts = { minSupport: 3, minPurity: 0.7 };
  const once = atmpt(lexicon, 'suffix').generalize(opts).toString();
  const twice = atmpt(lexicon, 'suffix').generalize(opts).generalize(opts).toString();
  assert.strictEqual(once, twice);
});

test('generalize: adding after generalize still works', () => {
  const trie = atmpt(lexicon, 'suffix').generalize({ minSupport: 3, minPurity: 0.7 });
  trie.add('spelunked', 'PastTense');
  trie.generalize({ minSupport: 3, minPurity: 0.7 });
  assert.strictEqual(trie.get('spelunked'), 'PastTense');
  assert.strictEqual(trie.get('naked'), 'Adjective');
});
