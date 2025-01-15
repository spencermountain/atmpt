export class Node {
  constructor() {
    this.children = {};
    this.value = null;
  }

  isLeaf() {
    return Object.keys(this.children).length === 0;
  }

  prune() {
    // First prune children recursively
    for (const child of Object.values(this.children)) {
      child.prune();
    }

    if (this.isLeaf()) {
      return this;
    }

    const childValues = new Set(
      Object.values(this.children)
        .map(child => child.value)
        .filter(value => value !== null)
    );

    if (childValues.size === 1) {
      const commonValue = Array.from(childValues)[0];
      const allLeaves = Object.values(this.children).every(child => child.isLeaf());

      if (allLeaves) {
        this.value = commonValue;
        this.children = {};
      }
    }

    return this;
  }

  toJSON() {
    const result = {};
    if (this.value !== null) {
      result.value = this.value;
    }
    if (!this.isLeaf()) {
      result.children = {};
      for (const [char, node] of Object.entries(this.children)) {
        result.children[char] = node.toJSON();
      }
    }
    return result;
  }

  print(prefix = '') {
    if (this.value !== null) {
      console.log(`${prefix} [${this.value}]`);
    }

    for (const [char, child] of Object.entries(this.children)) {
      console.log(`${prefix}├── ${char}`);
      child.print(prefix + '│   ');
    }
  }
} 