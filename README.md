
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
id_seq = id:id ids:(_ "," _ id)* {
    return unroll(id, ids, 3);
}
```

Here an array of ids is returned, consisting of the first token `id` and
then all 4th tokens from each element of the `ids` repetition.

The `unroll` function has the following signature:

```
unroll(first: Token, list: Token[], take: (Number[] || Number)): Token[]
```

To make the `unroll` function available to your actions code,
place the following at the top of your grammar definition:

```js
{
    var unroll = options.util.makeUnroll(line, column, offset, SyntaxError);
}
```

The `options.util.makeUnroll` is made available automatically
by using `PEGUtil.parse` instead of PEG.js's standard parser method `parse`.

The `unroll` method accepts `first` to be `null` and
`take` can be either just a single position (counting from 0)
or a list of positions.

### Abstract Syntax Tree Node Generation

Usually the result of PEG.js grammar rule actions should
be the generation of an Abstract Syntax Tree (AST) node.
For this PEGUtil provides an AST implementation.

```
id_seq = id:id ids:(_ "," _ id)* {
    return AST("IdentifierSequence").add(unroll(id, ids, 3));
}
```

Here the result is an AST node of type `IdentifierSequence`
which contains all identifiers as child nodes.

The `AST` function has the following signature:

```
AST(type: String): Node
```

Each AST Node has the following methods:

```js
Node#isA(type: String): Boolean
Node#pos(line: Number, column: Number, offset: Number): Node
Node#set(name: String, value: Object): Node
Node#set({ (name: String): (value: Object), [...] }): Node
Node#get(name: String): Object
Node#childs(): Node[]
Node#add(childs: (Node || Node[])[]): Node
Node#del(childs: Node[]): Node
Node#walk(callback: (node: Node, depth: Number) => Void [, after: Boolean]): Node
Node#dump(): String
```

To make the `AST` function available to your actions code,
place the following at the top of your grammar definition:

```js
{
    var AST = options.util.makeAST(line, column, offset);
}
```

### Cooked Error Reporting

Instead of calling `parser.parse(source[, startRule])` you
now should call `PEGUtil.parse(parser, source[, startRule])`.
The result then is always an object consisting of either
an `ast` field (in case of success) or an `error` field
(in case of an error). In case of an error, the `error`
field provides cooked error information which
allow you to print out reasonable human-friendly error
messages (especially because of the `location` field:

```js
result = {
    error: {
        line:     Number, /* line number */
        column:   Number, /* column number */
        message:  String, /* parsing error message */
        found:    String, /* found token during parsing */
        expected: String, /* expected token during parsing */
        location: {
            prolog: String, /* text before the error token */
            token:  String, /* error token */
            epilog: String  /* text after the error token */
        }
    }
}
```

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
    var e = result.error;
    let prefix1 = "line " + e.line + " (col " + e.column + "): ";
    let prefix2 = "";
    for (var i = 0; i < prefix1.length + e.location.prolog.length; i++)
        prefix2 += "-";
    var l = e.location;
    console.log("PARSING FAILED\n" +
        "ERROR: " + prefix1 + l.prolog + l.token + l.epilog + "\n" +
        "ERROR: " + prefix2 + "^" + "\n" +
        "ERROR: " + e.message + "\n"
    );
}
else {
    [...result.ast...]
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

