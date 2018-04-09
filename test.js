import mutate from './mutate';
import * as riot from 'riot';

riot.tag2('inner-tag', 'Hello!, {opts.data}!', '', '', () => {});
riot.tag2('tag', '<inner-tag data={"test"}>(child)</inner-tag>', '', '', () => {});

function shallow() {
  const restore = mutate('tag');
  try {
    return this.mount.apply(this, arguments);
  } finally {
    restore();
  }
}

riot.shallow = shallow; // TODO: make wrapper not touch original "riot"

describe('test', () => {
  describe('deep', () => {
    it('mount works', () => {
      const div = document.createElement('tag');
      document.body.appendChild(div);

      const rootTag = riot.mount('tag')[0];

      expect(rootTag.root.querySelectorAll('inner-tag').length).toBe(1)
      expect(rootTag.root.querySelector('inner-tag').innerHTML).toBe('Hello!, test!')

      rootTag.unmount();
    });
  });

  describe('shallow', () => {
    it('shallow works', () => {
      const div = document.createElement('tag');
      document.body.appendChild(div);

      const rootTag = riot.shallow('tag')[0];

      expect(rootTag.root.querySelectorAll('inner-tag').length).toBe(1)
      expect(rootTag.root.querySelector('inner-tag').getAttribute('data')).toBe('test')
      expect(rootTag.root.querySelector('inner-tag').innerHTML).toBe('(child)')

      rootTag.unmount();
    });
  });
});
