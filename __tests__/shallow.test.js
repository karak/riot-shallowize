import shallowize from '../lib';
import $ from 'jquery';
import * as _riot from 'riot';
const riot = shallowize(_riot);
import './tags/tag.riot';
import './tags/inner-tag.riot';
import './tags/inner-elements.riot';
import './tags/each.riot';
import './tags/parent.riot';
import './tags/parent-incomplete.riot';

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
   * @param {String|Element=} selector - selector or element to elements to mount
   * @param {Object=} opts - tag interface
   */
  shallow(selector, opts) {
    this._createElement();
    if (typeof selector === 'string' || selector instanceof HTMLElement) {
      selector = arguments[0];
      opts = arguments[1];
      return (this._rootTag = riot.shallow(selector, this._tagName, opts)[0]);
    } else {
      opts = arguments[0];
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

    it('has "inner-tag" in tags', () => {
      const tag = dom.mount();

      expect(tag.tags).toHaveProperty('inner-tag');
      expect(tag.tags['inner-tag']).toHaveProperty('opts', {
        data: 'test'
      });
    });
  });

  describe('shallow', () => {
    it('shallow works', () => {
      const $root = $(dom.shallow().root);

      expect($root.find('inner-tag').length).toBe(1);
      expect($root.find('inner-tag').attr('data')).toBe('test');
      expect($root.find('inner-tag').html()).toBe('(child)');
    });

    it('selector with tagName opts', () => {
      const $root = $(dom.shallow('*').root);

      expect($root.find('inner-tag').length).toBe(1);
    });

    it('element with tagName opts', () => {
      const element = document.createElement('div');
      const root = dom.shallow(element).root;
      const $root = $(root);

      expect(root).toBe(element);
      expect($root.is('div')).toBeTruthy();
      expect($root.attr('data-is')).toBe('tag');

      expect($root.find('inner-tag').length).toBe(1);
    });

    it('has "inner-tag" in tags', () => {
      const tag = dom.shallow();

      expect(tag.tags).toHaveProperty('inner-tag');
      expect(tag.tags['inner-tag']).toHaveProperty('opts', {
        data: 'test'
      });
    });
  });
});

describe('"each" attribute', () => {
  describe('shallow', () => {
    const dom = new DomEnv('each');

    it('iterate at certain times', () => {
      const items = ['a', 'b', 'c'];
      const $root = $(
        dom.shallow({
          items
        }).root
      );

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

describe('inner-elements', () => {
  const dom = new DomEnv('inner-elements');

  it('completely renders nested HTML elements', () => {
    const $root = $(dom.shallow().root);

    expect($root.find('> div').length).toBe(1);

    expect($root.find('> div > p').length).toBe(1);
    expect($root.find('> div > p').text()).toBe('Hello');
  });
});

describe('parent', () => {
  const dom = new DomEnv('parent');
  describe('shallow', () => {
    it('renders expressions as assuming nest by one-level', () => {
      const $root = $(
        dom.shallow({
          data: 'Hello'
        }).root
      );

      expect($root.find('parent2')).toHaveLength(1);
      expect($root.find('parent2 > p')).toHaveLength(1);
      expect($root.find('parent2 > p').text()).toBe('Hello');
      expect($root.html()).toBe('<parent2><p>Hello</p></parent2>');
    });
  });
});

describe('parent-incomplete', () => {
  const dom = new DomEnv('parent-incomplete');
  let consoleSpy = {};

  beforeEach(() => {
    consoleSpy.log = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleSpy.error = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  describe('shallow', () => {
    it('renders unregisterd tags as plain elements', () => {
      const $root = $(
        dom.shallow({
          data: 'Hello'
        }).root
      );
      // => cause error

      expect($root.find('parent2-incomplete')).toHaveLength(1);
      expect($root.find('parent2-incomplete > p').text()).toBe('');

      expect(consoleSpy.log).toHaveBeenCalledTimes(2);
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });
  });
});
