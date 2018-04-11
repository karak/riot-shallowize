import mutate from './mutate';

/**
 *
 * @param {String} tagName the name of tag. NOT an element or selector as `mount`
 * @param {Object=} opts
 */
export default function shallow(tagName, opts) {
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
