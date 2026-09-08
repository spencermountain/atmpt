import test from 'node:test';
import assert from 'node:assert';
import atmpt from '../src/index.js';

const lexicon = {
  walked: 'PastTense', talked: 'PastTense', parked: 'PastTense', helped: 'PastTense',
  naked: 'Adjective', // exception inside the -d pattern
  running: 'Gerund', sitting: 'Gerund', jumping: 'Gerund',
  the: 'Determiner', // closed-class, never generalizes
};
const knobs = { support: 3, agreement: 0.7 };

test('burn: remembered words keep their vals', () => {
  const out = atmpt.load(atmpt(lexicon).burn(knobs));
  for (const [word, val] of Object.entries(lexicon)) {
    assert.strictEqual(out.get(word), val, word);
  }
});

test('burn: rules fire for unseen regular words', () => {
  const out = atmpt.load(atmpt(lexicon).burn(knobs));
  assert.strictEqual(out.get('zorped'), 'PastTense');
  assert.strictEqual(out.get('blorping'), 'Gerund');
});

test('burn: stored words do NOT fire as suffix matches', () => {
  const out = atmpt.load(atmpt(lexicon).burn(knobs));
  // "breathe" ends in "the", but "the" is a stored word, not a rule
  assert.strictEqual(out.get('breathe'), null);
  assert.strictEqual(out.get('xyzq'), null);
});

test('burn: rules shrink the image', () => {
  const memory = atmpt(lexicon);
  const verbatim = memory.burn({ support: 9999 });
  const ruled = memory.burn(knobs);
  assert.ok(ruled.length < verbatim.length, `${ruled.length} < ${verbatim.length}`);
});

test('burn: a pure projection — memory is never mutated', () => {
  const memory = atmpt(lexicon);
  const first = memory.burn(knobs);
  const second = memory.burn(knobs);
  assert.strictEqual(first, second);
  // different knobs still work afterwards (loose enough to mint a root rule)
  const loose = memory.burn({ support: 1, agreement: 0.3 });
  assert.notStrictEqual(loose, first);
  const third = memory.burn(knobs);
  assert.strictEqual(third, first);
});

test('burn: adding after a burn works', () => {
  const memory = atmpt(lexicon);
  memory.burn(knobs);
  memory.add('spelunked', 'PastTense');
  const out = atmpt.load(memory.burn(knobs));
  assert.strictEqual(out.get('spelunked'), 'PastTense');
  assert.strictEqual(out.get('naked'), 'Adjective');
});

test('burn: does not clobber a stored word with a different val', () => {
  const image = atmpt({ run: 'Verb', runs: 'PresentTense', rung: 'PastTense' }, { direction: 'prefix' })
    .burn({ support: 1, agreement: 0.5 });
  assert.strictEqual(atmpt.load(image).get('run'), 'Verb');
});

test('burn: constructor knobs are the defaults, burn opts override', () => {
  const memory = atmpt(lexicon, { support: 3, agreement: 0.7 });
  const a = memory.burn();
  const b = atmpt(lexicon).burn({ support: 3, agreement: 0.7 });
  assert.strictEqual(a, b);
});

test('burn: report prints rules and spoilers', () => {
  const lines = [];
  const original = console.log;
  console.log = (str) => lines.push(String(str));
  try {
    // at agreement 0.85, -d (4/5 PastTense) misses the bar: a near-rule,
    // and naked is its spoiler
    atmpt(lexicon).burn({ report: true });
  } finally {
    console.log = original;
  }
  const text = lines.join('\n');
  assert.ok(/burn ▸ 9 words/.test(text), text);
  assert.ok(/-g → Gerund/.test(text), text);
  assert.ok(/near-rules:/.test(text), text);
  assert.ok(/-d → PastTense\s+4\/5\s+spoilers: naked \(Adjective\)/.test(text), text);
});
