import test from 'node:test';
import assert from 'node:assert';
import atmpt from '../src/index.js';
import { colorize } from '../src/diff.js';

const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

test('colorize: paints new chars blue, existing chars yellow', () => {
  assert.strictEqual(
    colorize(['w', 'a', 'l', 'k'], [true, true, true, true]),
    `${BLUE}walk${RESET}`
  );
  assert.strictEqual(
    colorize(['w', 'a', 'l', 'k'], [false, false, false, false]),
    `${YELLOW}walk${RESET}`
  );
  assert.strictEqual(
    colorize(['w', 'a', 'l', 'k'], [true, false, false, false]),
    `${BLUE}w${YELLOW}alk${RESET}`
  );
});

test('diff: suffix trie shows shared suffixes in word order', () => {
  const lines = [];
  const original = console.log;
  console.log = (str) => lines.push(String(str));
  try {
    const memory = atmpt(null, { direction: 'suffix', diff: true });
    memory.add('talked', 'PastTense');
    memory.add('walked', 'PastTense');
    memory.add('walked', 'PastTense');
  } finally {
    console.log = original;
  }
  assert.strictEqual(lines[0], `${BLUE}talked${RESET}`, 'first word is all new');
  assert.strictEqual(lines[1], `${BLUE}w${YELLOW}alked${RESET}`, 'shares -alked');
  assert.strictEqual(lines[2], `${YELLOW}walked${RESET}`, 'fully redundant');
});

test('diff: off by default', () => {
  const lines = [];
  const original = console.log;
  console.log = (str) => lines.push(String(str));
  try {
    atmpt(null, { direction: 'suffix' }).add('talked', 'PastTense');
  } finally {
    console.log = original;
  }
  assert.strictEqual(lines.length, 0);
});
