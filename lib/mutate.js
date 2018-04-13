import * as riot from 'riot';
import each from './each';

/** Get all of the tag including registered.
 *  @returns {Array<String>} */
function getTagNames() {
  return riot.util.tags
    .selectTags()
    .split(/, */)
    .filter(x => !/\[data-is=.*\]/.test(x));
}

/**
 * Get tag implementation
 *
 * @param {String} tagName
 * @returns {Object}
 */
function getTag(tagName) {
  class DummyElement {
    constructor(tagName) {
      this.tagName = tagName;
    }

    getAttribute() {
      return null;
    }
  }

  return riot.util.tags.getTag(new DummyElement(tagName));
}

/** Get all of the tag registered but `tagName`.
 *  @param {String} tagName
 *  @returns {Array<String>} */
function getAllButTag(tagName) {
  const theOthers = getTagNames();
  theOthers.splice(theOthers.indexOf(tagName), 1);
  return theOthers;
}

/** Do nothing */
function emptyFn() {}

/** Overwrite tag by psuedo implementation */
function overwriteTag(tagName) {
  // unregister the tag and destroy its cache
  riot.unregister(tagName);
  // set tag with `<${tagName}><yield /><${tagName}>`
  riot.tag2(tagName, '<yield />', '', '', emptyFn);
}

/** Restore tag by the original implementation */
function restoreTag(tagImpl) {
  riot.unregister(tagImpl.name);
  riot.tag2(tagImpl.name, tagImpl.tmpl, tagImpl.attr, tagImpl.css, tagImpl.fn);
}

/** Save tag implementation
 *  @param {String} tagName
 *  @returns {Function|null} restore function if registered, null otherwise
 *  @see restoreTag */
function saveTag(tagName) {
  const tagImpl = getTag(tagName);
  if (!tagImpl) return null;

  return () => restoreTag(tagImpl);
}

/**
 *  Replace tag implementation by psuedo one.
 *  @param {String} tagName
 *  @returns {Function|null} restore function if registered, null otherwise*/
function replaceTag(tagName) {
  const restore = saveTag(tagName);

  if (!restore) return null;

  overwriteTag(tagName);

  return restore;
}

/* ------ */

/** Make shallow rendering root
 *  @param {String} tagName tag name of the shallow-root
 *  @returns {Function} restore function
 */
export default function mutate(tagName) {
  const restores = [];
  each(getAllButTag(tagName), x => {
    const restore = replaceTag(x);
    if (restore) {
      // push only if registered
      restores.push(restore);
    }
  });

  return () => {
    each(restores, x => x());
    restores.splice(0, restores.length);
  };
}
