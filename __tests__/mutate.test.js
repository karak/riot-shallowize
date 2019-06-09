import { register, unregister } from 'riot';
import mutate from '../lib/mutate';

describe('mutate', () => {
  beforeAll(() => {
    register('tag1', {});
    register('tag2', {});
    unregister('tag2');
  });

  afterAll(() => {
    unregister('tag2');
  });

  it('works on unregsitered tags', () => {
    let restore;

    expect(() => {
      restore = mutate('tag1');
    }).not.toThrow();
    expect(() => restore()).not.toThrow();
  });
});
