# D

Simple interpolation module. Inspired by AngularJS handlebars implementation.

## Examples

Create an instance:

```js
var D = require('D'); // Factory
var d = D({ name: 'Alibaster' }); // d instance
```

Use it:

```js
d('Hello, {{name}}!') // => Hello, Alabaster!
```

Add more data:

```js
d.$extend({ hobby: 'alcoholism' });
d('Hello, {{name}}, we see you love {{hobby}}!') // => Hello, Alabaster, we see you love alcoholism!
```

Delete a key:

```js
d.$delete('hobby');
d('{{name}} enjoys {{hobby}}!'); // => Alabaster enjoys !
```

Properties are getters:

```js
console.log(d.name); // => "Alabaster"
```

Not setters (use `$extend` to overwrite):

```js
d.name = 'Quartz';
console.log(d.name); // => "Alabaster"
```

Works w/ nested properties

```js
d.$extend({ a: { b: { c: 'd' }}});
d('/a/b/c/{{a.b.c}}');
// => '/a/b/c/d'
```

## Why `D`?

Originally this was for directory interpolation for build tasks and I wanted it to be as compact as possible, since JS doesn't have string interpolation. It has nothing directory-oriented in its implementation, but `D` is still small. I dunno.

Ironically, this module is written in ES6, which does have string interpolation. Hopefully, this dies sooner rather than later.
