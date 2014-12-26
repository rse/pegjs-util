
pegjs-util
===========

Utility class for the [PEG.js](http://pegjs.org/) parser generator.

<p/>
<img src="https://nodei.co/npm/pegjs-util.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/pegjs-util.png" alt=""/>

About
-----

This is a small utility class for the excellent
[PEG.js](http://pegjs.org/) parser generator. It wraps around PEG.js's
central `parse` function and provides three distinct convenience features:

### Parser Tree Token Unrolling

In many PEG.js gammar rule actions one has to concatenate a first token
and a repeated sequence of tokens, where from the sequence of tokens
only relevant ones should be picked:

```
id_seq = id:id ids:(_ "," id)* {
    return unroll(id, ids, 2);
}
```

Here an array of ids is returned, consisting of the first token `id` and
then all 3rd tokens from each element of the `ids` repetition.
The `unroll` function has the following signature:

```
unroll(first: Token, list: Token[], take: Number): Token[]
```

To make the `unroll` method available to your actions code,
place the following at the to of your grammar definition:

```js
{
    var unroll = options.util.makeUnroll(line, column, offset, SyntaxError);
}
```

The `options.util.makeUnroll` is made available automatically
by using `PEGUtil.parse` instead of PEG.js's standard parser method `parse`.

### Abstract Syntax Tree Node Generation

...

### Cooked Error Reporting

...

Installation
------------

### Node/NPM environments:

```shell
npm install pegjs --save-dev
npm install pegjs-util --save-dev
```

### Browser/Bower environments:

```shell
bower install pegjs
bower install pegjs-util
```

Usage
-----

```
{
    /*  import PEGUtil methods into parser scope  */
    var unroll = options.util.makeUnroll(line, column, offset, SyntaxError);
    var ast    = options.util.makeAST(line, column, offset);
}

start
    = ...
```

```js
var result = PEGUtil.parse(parser, source, "start");
if (result.error !== null) {
    ...
}
else {
    ...
}
```

License
-------

Copyright (c) 2014 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

