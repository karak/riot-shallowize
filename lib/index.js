import mutate from './mutate';
import * as riot from 'riot';

/**
 * 
 * @param {String} tagName the name of tag. NOT an element or selector as `mount`
 * @param {Object=} opts 
 */
function shallow(tagName, opts) {
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
