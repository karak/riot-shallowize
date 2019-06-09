import mutate from './mutate';

/**
 *
 * @param {String|Element} selector selector or element to mount
 * @param {Object=} initialProps initial values of props
 * @param {String=} name the name of tag
 */
export default function shallow(selector, initialProps, name) {
  if (typeof name !== 'string') {
    if (typeof selector === 'string') {
      name = selector;
    } else {
      name = selector.getAttribute('is') || selector.tagName;
    }
  }
  const restore = mutate(name);
  try {
    return this.mount.apply(this, arguments);
  } finally {
    restore();
  }
}
