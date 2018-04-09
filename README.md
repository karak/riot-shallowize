# Riot shallowize

A handy shallow rendering utility for [RiotJS](http://riotjs.com/).

Virtually, `shallow` just replace all the tags but the root by `<nested-tag><yield /></nested-tag>` during mount.

## Intallation

Install via NPM.

```sh
npm i riot-shallowize --dev
```

## Usage

Wrapp the original module.

```js:cjs
var shallowize = require('riot-shallowize');
var riot = shallowize(require('riot'));

// Use shallow
riot.shallow('hello', { data: "Hello" });

// and use as always
riot.mount('*', { data: "Hello" });
```

## Warning about expressions

Templating also works except followings and expressions work with some exceptions.

Context object under the nested tags is *always* a psuedo tag instance on the implementation above, wihtout any attributes, styles, or scripts.

This means that using `this` in child nodes may may be troublesome.
In fact, such tags has technically no apptitude for shallow-rendering
--actually, it may have design issues in modularity because it couldn't resist the mutation of one of the nested tags.

And `<yield to="..." />` never works.
