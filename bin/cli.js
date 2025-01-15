#!/usr/bin/env node

import { addPrefix, addSuffix, parseTrie, packTrie } from '../src/index.js';

const command = process.argv[2];
const args = process.argv.slice(3);

function printUsage() {
  console.log(`
Usage: atmpt <command> [arguments]

Commands:
  add-prefix <trie> <object>    Add prefix to trie
  add-suffix <trie> <object>    Add suffix to trie
  parse <string>               Parse string to trie
  pack <trie>                  Pack trie to string
  `);
}

async function main() {
  if (!command) {
    printUsage();
    process.exit(1);
  }

  try {
    switch (command) {
      case 'add-prefix':
        console.log(addPrefix(JSON.parse(args[0]), JSON.parse(args[1])));
        break;
      case 'add-suffix':
        console.log(addSuffix(JSON.parse(args[0]), JSON.parse(args[1])));
        break;
      case 'parse':
        console.log(parseTrie(args[0]));
        break;
      case 'pack':
        console.log(packTrie(JSON.parse(args[0])));
        break;
      default:
        console.error('Unknown command:', command);
        printUsage();
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main(); 