import * as riot from 'riot';
import { compile } from '@riotjs/compiler';
import each from './each';
import evalModule from './eval-module';

/** Get all of the tag including registered.
 *  @returns {Array<String>} */
function getTagNames() {
  const tags = riot.__.globals.COMPONENTS_IMPLEMENTATION_MAP;
  return [...tags.keys()];
}

/**
 * Get tag implementation
 *
 * @param {String} tagName
 * @returns {Object}
 */
function getTag(tagName) {
  const tags = riot.__.globals.COMPONENTS_IMPLEMENTATION_MAP;
  return tags.get(tagName);
}

/** Get all of the tag registered but `tagName`.
 *  @param {String} tagName
 *  @returns {Array<String>} */
function getAllButTag(tagName) {
  const theOthers = getTagNames();
  theOthers.splice(theOthers.indexOf(tagName), 1);
  return theOthers;
}

const PSUEDO_TAG_IMPL = (function() {
  let { code } = compile('<x><slot></x>');
  return evalModule(code);
})();

/** Overwrite tag by psuedo implementation */
function overwriteTag(tagName) {
  // unregister the tag and destroy its cache
  riot.unregister(tagName);
  // set tag with `<${tagName}><slot><${tagName}>`
  riot.register(tagName, {
    ...PSUEDO_TAG_IMPL,
    name: tagName
  });
}

/** Restore tag by the original implementation */
function restoreTag(tagName, tagImpl) {
  riot.unregister(tagName);
  riot.register(tagName, tagImpl);
}

/** Save tag implementation
 *  @param {String} tagName
 *  @returns {Function|null} restore function if registered, null otherwise
 *  @see restoreTag */
function saveTag(tagName) {
  const tagImpl = getTag(tagName);
  if (!tagImpl) return null;

  return () => restoreTag(tagName, tagImpl);
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
