export function toString(root, direction = 'prefix', version) {
  const valueDict = new Map();
  const frequencies = new Map();
  let nextIndex = 0;

  // Escape pipe characters in values
  const escapeValue = (val) => String(val).replace(/\|/g, '\\|');

  // First pass: count frequencies
  const countFrequencies = (node) => {
    if (node.value !== null) {
      frequencies.set(node.value, (frequencies.get(node.value) || 0) + 1);
    }
    Object.values(node.children).forEach(countFrequencies);
  };

  const assignIndices = () => {
    Array.from(frequencies.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([value]) => {
        valueDict.set(value, nextIndex++);
      });
  };

  const buildString = (node) => {
    if (Object.keys(node.children).length === 0) {
      return node.value !== null ? valueDict.get(node.value).toString() : '';
    }

    let result = '';
    const childEntries = Object.entries(node.children);

    if (node.value !== null) {
      result += valueDict.get(node.value).toString();
    }

    if (childEntries.length === 1) {
      const [char, childNode] = childEntries[0];
      return result + char + buildString(childNode);
    }

    const childStrings = childEntries.map(([char, childNode]) =>
      char + buildString(childNode)
    );
    return result + `(${childStrings.join('')})`;
  };

  countFrequencies(root);
  assignIndices();

  // Create dictionary string with escaped values
  const dictString = Array.from(valueDict.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([value]) => escapeValue(value))
    .join('|');

  // Add header line with type and version
  const directionMap = {
    'prefix': 'pre',
    'suffix': 'post'
  };
  return `${directionMap[direction]}|${version}\n${dictString}\n${buildString(root)}`;
} 