# Riot shallowize

A handy shallow rendering utility for [RiotJS](http://riotjs.com/).

Virtually, `shallow` just replace all the tags but the root by `<nested-tag><yield /></nested-tag>` during mount.

## Intallation

Install via NPM.

```sh
npm i riot-shallowize --dev
```

## Usage

```js
// Wrap the original module
var shallowize = require('riot-shallowize');
var riot = shallowize(require('riot'));

// Use new shallow API
riot.shallow('hello', { data: 'Hello' });

// and the others as always
riot.mount('*', { data: 'Hello' });
```

## Example

Minimum example with `jest` and `jquery`, assuming with `riot-jest-transformer`:

Suppose you have the two tags below:

```html
<my-list-item>
  {opts.text}
</my-list-item>
```

```html
<my-list>
  <virtual each={item in items}>
    <my-list-item text={item} />
  </virtual>
  this.items = opts.items
</my-list>
```

You can write the unit-test of the outer tag as following:

```js
describe('my-list', () => {
  it('should accept data', () => {
    const items = ['a', 'b', 'c'];
    const $myList = $(riot.shallow('my-list', { items }).root);

    const $items = $myList.children('my-list-item');
    // test count
    expect($items).toHaveLength(3);
    // test opts
    for (let i = 0; i < $items.length; i += 1) {
      expect($items.eq(i).attr('text')).toBe(items[i]);
    }
  });
});
```

It's clear and robust, for the test is free from the implementation of the nested tag!

## Warning about expressions

Templating also works except followings and expressions work with some exceptions.

Context object under the nested tags is _always_ a psuedo tag instance on the implementation above, wihtout any attributes, styles, or scripts.

This means that using `this` in child nodes may may be troublesome.
In fact, such tags has technically no apptitude for shallow-rendering
--actually, it may have design issues in modularity because it couldn't resist the mutation of one of the nested tags.

And `<yield to="..." />` never works.
