#!/usr/bin/env node
import fs from 'fs';
import atmpt from '../src/index.js';

const args = process.argv.slice(2);
const command = args.shift();

function printUsage() {
  console.log(`
Usage: atmpt <command> [arguments]

Commands:
  pack <words.json>     pack a {word: tag} JSON file into a trie string
      --prefix              build a prefix trie (default: suffix)
      --generalize          collapse pure subtrees into rules first
  unpack <packed.txt>   expand a packed trie back into JSON
  `);
}

function main() {
  try {
    if (command === 'pack') {
      const file = args.find(a => !a.startsWith('--'));
      const direction = args.includes('--prefix') ? 'prefix' : 'suffix';
      const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
      const trie = atmpt(obj, direction);
      if (args.includes('--generalize')) {
        trie.generalize();
      }
      console.log(trie.toString());
    } else if (command === 'unpack') {
      const trie = atmpt.unpack(fs.readFileSync(args[0], 'utf8'));
      console.log(JSON.stringify(trie.toJSON(), null, 2));
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
