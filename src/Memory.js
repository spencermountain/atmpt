import project from './burn/project.js';
import report from './burn/report.js';
import toString from './pack/toString.js';
import { colorize } from './diff.js';
import VERSION from '../_version.js';

// a node in the working memory: the given val, the evidence, the children
class MemNode {
  constructor() {
    this.val = null;
    this.children = {};
    this.counts = null;
    this.total = 0;
  }
  addCount(val) {
    if (!this.counts) {
      this.counts = new Map();
    }
    this.counts.set(val, (this.counts.get(val) || 0) + 1);
    this.total += 1;
  }
}

// the working memory: words in, burn out. it remembers every word and its
// val, and tallies evidence — but draws no conclusions. no rules exist here.
class Memory {
  constructor(opts = {}) {
    this.direction = opts.direction || 'suffix';
    this.support = opts.support !== undefined ? opts.support : 3;
    this.agreement = opts.agreement !== undefined ? opts.agreement : 0.85;
    this.diff = opts.diff === true;
    this.root = new MemNode();
  }

  add(word, val = true) {
    const chars = [...word];
    if (this.direction === 'suffix') {
      chars.reverse();
    }
    const isNew = [];
    let node = this.root;
    node.addCount(val);
    for (const char of chars) {
      if (!node.children[char]) {
        node.children[char] = new MemNode();
        isNew.push(true);
      } else {
        isNew.push(false);
      }
      node = node.children[char];
      node.addCount(val);
    }
    node.val = val;
    if (this.diff) {
      if (this.direction === 'suffix') {
        chars.reverse();
        isNew.reverse();
      }
      console.log(colorize(chars, isNew)); // eslint-disable-line
    }
    return this;
  }

  // draw conclusions from the complete evidence and pack them into an image.
  // a pure projection: the memory itself is never changed, so re-burning at
  // different knobs is free.
  burn(opts = {}) {
    const knobs = {
      support: opts.support !== undefined ? opts.support : this.support,
      agreement: opts.agreement !== undefined ? opts.agreement : this.agreement,
    };
    const { root, stats } = project(this.root, knobs, this.direction);
    const image = toString(root, this.direction, VERSION);
    if (opts.report) {
      const verbatim = toString(this.root, this.direction, VERSION);
      report(this.root, stats, knobs, this.direction, image, verbatim.length);
    }
    return image;
  }
}

export default Memory;
