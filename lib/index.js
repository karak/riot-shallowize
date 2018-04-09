import mutate from './mutate';
import * as riot from 'riot';

/**
 *
 * @param {String} selector
 * @param {String=} tagName the name of tag. NOT an element or selector as `mount`
 * @param {Object=} opts 
 */
function shallow(selector, tagName, opts) {
  if (typeof tagName !== 'string') {
    opts = tagName;
    tagName = selector;
  }
  const restore = mutate(tagName);
  try {
    return this.mount.apply(this, arguments);
  } finally {
    restore();
  }
}

export default function shallowize(riot) {
  return { ...riot, shallow };
}
