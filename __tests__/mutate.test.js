import { tag, unregister } from 'riot';
import mutate from '../lib/mutate';

describe('mutate', () => {
  it('works on unregsitered tags', () => {
    tag('tag1');
    tag('tag2');
    unregister('tag2');

    let restore;

    expect(() => {
      restore = mutate('tag1');
    }).not.toThrow();
    expect(() => restore()).not.toThrow();
  });
});
