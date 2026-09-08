import Memory from './Memory.js';
import Out from './Out.js';

// atmpt(input?, opts?) -> a working Memory: words in, burn out.
// atmpt.load(image)    -> a burned Out: lookups and patches.
const atmpt = function (input, opts = {}) {
  const memory = new Memory(opts);
  if (Array.isArray(input)) {
    input.forEach(word => {
      memory.add(word);
    });
  } else if (input && typeof input === 'object') {
    for (const [word, val] of Object.entries(input)) {
      memory.add(word, val);
    }
  }
  return memory;
};

atmpt.load = function (image) {
  return Out.load(image);
};

export default atmpt;
