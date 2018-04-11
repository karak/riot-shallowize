import shallowize from './lib';
import $ from 'jquery';
import * as _riot from 'riot';
const riot = shallowize(_riot);
import './tags/tag.tag';
import './tags/inner-tag.tag';
import './tags/each.tag';

/** Test harness to setup a single tag */
class DomEnv {
  constructor(tagName) {
    this._tagName = tagName;
  }

  /**
   * mount
   *
   * @param {Object=} opts - tag interface
   */
  mount(opts) {
    this._createElement();
    return (this._rootTag = riot.mount(this._tagName, opts)[0]);
  }

  /**
   * shallow alternative to mount
   *
   * @param {String=} selector - selector to elements to mount
   * @param {Object=} opts - tag interface
   */
  shallow(selector, opts) {
    this._createElement();
    if (typeof selector === 'string') {
      return (this._rootTag = riot.shallow(selector, this._tagName, opts)[0]);
    } else {
      opts = selector;
      return (this._rootTag = riot.shallow(this._tagName, opts)[0]);
    }
  }

  /**
   * create container element to mount
   */
  _createElement() {
    if (!this._container) {
      const div = document.createElement(this._tagName);
      document.body.appendChild(div);
      this._container = div;
    }
  }

  /**
   * unmount
   */
  unmount() {
    if (this._rootTag) {
      this._rootTag.unmount();
      delete this._container;
    } else if (this._container) {
      document.body.removeChild(this._container);
      delete this._container;
    }
  }
}

describe('test', () => {
  const dom = new DomEnv('tag');

  afterEach(() => dom.unmount());

  describe('deep', () => {
    it('mount works', () => {
      const $root = $(dom.mount().root);

      expect($root.find('inner-tag').length).toBe(1);
      expect($root.find('inner-tag').html()).toBe('Hello!, test!');
    });
  });

  describe('shallow', () => {
    it('shallow works', () => {
      const $root = $(dom.shallow().root);

      expect($root.find('inner-tag').length).toBe(1);
      expect($root.find('inner-tag').attr('data')).toBe('test');
      expect($root.find('inner-tag').html()).toBe('(child)');
    });

    it('with tagName opts', () => {
      const $root = $(dom.shallow('*').root);

      expect($root.find('inner-tag').length).toBe(1);
    });
  });
});

describe('"each" attribute', () => {
  describe('shallow', () => {
    const dom = new DomEnv('each');

    it('iterate at certain times', () => {
      const items = ['a', 'b', 'c'];
      const $root = $(dom.shallow({ items }).root);

      expect($root.find('li').length).toBe(items.length);
      expect(
        $root
          .find('li')
          .toArray()
          .map(x => x.textContent)
      ).toEqual(items);
    });
  });
});
