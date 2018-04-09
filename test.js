import mock from './mutate';
import * as riot from 'riot';

riot.tag('inner-tag', 'Hello!, {opts.data}!', '', '', () => {});
riot.tag('tag', '<inner-tag data={"test"}>(child)</inner-tag>', '', '', () => {});

describe('test', () => {
  describe('deep', () => {
    it('mount works', () => {
      const div = document.createElement('tag');
      document.body.appendChild(div);

      const rootTag = riot.mount('tag')[0];

      expect(rootTag.root.querySelectorAll('inner-tag').length).toBe(1)
      expect(rootTag.root.querySelector('inner-tag').textContent).toBe('Hello!, test!')

      rootTag.unmount();
    });
  });

  describe('shallow', () => {
    beforeAll(() => mock.mock('inner-tag'));
    afterAll(() => mock.reset('inner-tag'));

    it('shallow works', () => {
      const div = document.createElement('tag');
      document.body.appendChild(div);

      const rootTag = riot.mount('tag')[0];

      expect(rootTag.root.querySelectorAll('inner-tag').length).toBe(1)
      expect(rootTag.root.querySelector('inner-tag').getAttribute('data')).toBe('test')
      expect(rootTag.root.querySelector('inner-tag').innerHTML).toBe('(child)')

      rootTag.unmount();
    });
  });
});
