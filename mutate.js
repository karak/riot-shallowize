import * as riot from 'riot';

function emptyFn() {}
const mock = {
  mock(tagName) {
    riot.unregister(tagName);
    riot.tag(tagName, '<yield />', '', '', emptyFn);
    console.log(`<${tagName}>`);
  },
  reset(tagName) {
    riot.unregister(tagName);
    // TODO: restore?
  }
};

export default mock;
