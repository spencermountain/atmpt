import test from 'node:test';
import assert from 'node:assert';
import atmpt from '../src/index.js';

const lexicon = {
  walked: 'PastTense', talked: 'PastTense', parked: 'PastTense', helped: 'PastTense',
  naked: 'Adjective',
  // the gerunds keep the root impure, so the rule mints at -d, not the root
  running: 'Gerund', sitting: 'Gerund', jumping: 'Gerund',
};
const burned = () => atmpt.load(atmpt(lexicon).burn({ support: 3, agreement: 0.7 }));

test('patch: adds one exact word', () => {
  const out = burned();
  assert.strictEqual(out.get('zorp'), null);
  out.patch('zorp', 'Noun');
  assert.strictEqual(out.get('zorp'), 'Noun');
  assert.strictEqual(out.has('zorp'), true);
  assert.strictEqual(out.patched, 1);
});

test('patch: never generalizes', () => {
  const out = burned();
  out.patch('blorf', 'Noun');
  assert.strictEqual(out.get('zorf'), null, 'similar unseen word is untouched');
});

test('patch: can override a rule for one word', () => {
  const out = burned();
  assert.strictEqual(out.get('wretched'), 'PastTense', 'covered by the -d rule');
  out.patch('wretched', 'Adjective');
  assert.strictEqual(out.get('wretched'), 'Adjective', 'exception now shadows the rule');
  assert.strictEqual(out.get('zorped'), 'PastTense', 'rule still fires for other words');
});

test('patch: agreeing with a rule is redundant but harmless', () => {
  const out = burned();
  out.patch('zorped', 'PastTense');
  assert.strictEqual(out.get('zorped'), 'PastTense');
});

test('patch: an exact word on a rule node displaces the rule', () => {
  const out = burned();
  out.patch('d', 'Letter'); // the -d rule ends on this exact node
  assert.strictEqual(out.get('d'), 'Letter');
  assert.strictEqual(out.get('zorped'), null, 'the displaced rule no longer fires');
  assert.strictEqual(out.get('walked'), null, 'covered words were deleted at burn — re-burn to recover');
});

test('patch: survives re-serialization', () => {
  const out = burned();
  out.patch('wretched', 'Adjective');
  const again = atmpt.load(out.toString());
  assert.strictEqual(again.get('wretched'), 'Adjective');
  assert.strictEqual(again.get('zorped'), 'PastTense');
});
