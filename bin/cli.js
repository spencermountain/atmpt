#!/usr/bin/env node
import fs from 'node:fs';
import atmpt from '../src/index.js';

const args = process.argv.slice(2);
const command = args.shift();

function printUsage() {
  console.log(`
Usage: atmpt <command> [arguments]

Commands:
  burn <words.json>     burn a {word: val} JSON file into an image
      --prefix              build a prefix trie (default: suffix)
      --support <n>         words a pattern needs to become a rule (default 3)
      --agreement <n>       fraction that must agree (default 0.85)
      --report              print the burn report to stderr
      --diff                print each word as it is added, colored
  load <image.txt>      expand an image back into JSON
  `);
}

const flag = (name) => {
  const i = args.indexOf('--' + name);
  return i === -1 ? undefined : parseFloat(args[i + 1]);
};

function main() {
  try {
    if (command === 'burn') {
      const file = args.find(a => !a.startsWith('--') && isNaN(parseFloat(a)));
      const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
      // route the diff and report to stderr so the image pipes cleanly
      const log = console.log;
      console.log = console.error;
      let image;
      try {
        const memory = atmpt(obj, {
          direction: args.includes('--prefix') ? 'prefix' : 'suffix',
          diff: args.includes('--diff'),
        });
        image = memory.burn({
          support: flag('support'),
          agreement: flag('agreement'),
          report: args.includes('--report'),
        });
      } finally {
        console.log = log;
      }
      process.stdout.write(image + '\n');
    } else if (command === 'load') {
      const out = atmpt.load(fs.readFileSync(args[0], 'utf8'));
      console.log(JSON.stringify(out.toJSON(), null, 2));
    } else {
      printUsage();
      process.exit(command ? 1 : 0);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
