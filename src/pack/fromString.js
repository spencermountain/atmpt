import parse from './parse.js';
import { splitDict } from './escape.js';

const fromString = function (str) {
  // split on the first two newlines only — the body may contain escaped ones
  const first = str.indexOf('\n');
  const second = str.indexOf('\n', first + 1);
  if (first === -1 || second === -1) {
    throw new Error('atmpt: packed string must have header, dictionary and body lines');
  }
  const header = str.slice(0, first);
  const dict = str.slice(first + 1, second);
  // literal newlines in words are escaped as \n, so trailing ones are file cruft
  const body = str.slice(second + 1).replace(/[\r\n]+$/, '');

  const [dir, version] = header.split('|');
  const direction = dir === 'pre' ? 'prefix' : 'suffix';
  const dictionary = splitDict(dict);
  const root = parse(body, dictionary);

  return {
    root,
    direction,
    version
  };
}
export default fromString
