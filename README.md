
pegjs-util
===========

This is a small utility class for the excellent
[PEG.js](http://pegjs.org/) parser generator which wraps around PEG.js's
central `parse` function and provides three distinct convenience
features: *Parser Tree Token Unrolling*, *Abstract Syntax Tree Node
Generation* and *Cooked Error Reporting*.

<p/>
<img src="https://nodei.co/npm/pegjs-util.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/pegjs-util.png" alt=""/>

Installation
------------

```shell
$ npm install pegjs pegjs-util
```

Usage
-----

#### sample.pegjs

```
{
    var unroll = options.util.makeUnroll(location, options)
    var ast    = options.util.makeAST   (location, options)
}

start
    = _ seq:id_seq _ {
          return ast("Sample").add(seq)
      }

id_seq
    = id:id ids:(_ "," _ id)* {
          return ast("IdentifierSequence").add(unroll(id, ids, 3))
      }

id
    = id:$([a-zA-Z_][a-zA-Z0-9_]*) {
          return ast("Identifier").set("name", id)
      }

_ "blank"
    = (co / ws)*

co "comment"
    = "//" (![\r\n] .)*
    / "/*" (!"*/" .)* "*/"

ws "whitespaces"
    = [ \t\r\n]+
```

#### sample.js

```js
var fs      = require("fs")
var ASTY    = require("asty")
var PEG     = require("pegjs")
var PEGUtil = require("pegjs-util")

var asty = new ASTY()
var parser = PEG.generate(fs.readFileSync("sample.pegjs", "utf8"))
var result = PEGUtil.parse(parser, fs.readFileSync(process.argv[2], "utf8"), {
    startRule: "start",
    makeAST: function (line, column, offset, args) {
        return asty.create.apply(asty, args).pos(line, column, offset)
    }
})
if (result.error !== null)
    console.log("ERROR: Parsing Failure:\n" +
        PEGUtil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "))
else
    console.log(result.ast.dump().replace(/\n$/, ""))
```

#### Example Session

```shell
$ cat sample-input-ok.txt
/*  some ok input  */
foo, bar, quux

$ node sample.js sample-input-ok.txt
Sample [1/1]
    IdentifierSequence [2/1]
        Identifier (name: "foo") [2/1]
        Identifier (name: "bar") [2/6]
        Identifier (name: "quux") [2/11]

$ cat sample-input-bad.txt
/*  some bad input  */
foo, bar, quux baz

$ node sample.js sample-input-bad.txt
ERROR: Parsing Failure:
ERROR: line 2 (column 16):   */\nfoo, bar, quux baz\n
ERROR: -----------------------------------------^
ERROR: Expected "," or end of input but "b" found.
```

Description
-----------

PEGUtil is a small utility class for the excellent
[PEG.js](http://pegjs.org/) parser generator. It wraps around PEG.js's
central `parse` function and provides three distinct convenience features:

### Parser Tree Token Unrolling

In many PEG.js gammar rule actions you have to concatenate a first token
and a repeated sequence of tokens, where from the sequence of tokens
only relevant ones should be picked:

```
id_seq
    = id:id ids:(_ "," _ id)* {
          return unroll(id, ids, 3)
      }
```

Here the `id_seq` rule returns an array of ids, consisting of the first
token `id` and then all 4th tokens from each element of the `ids`
repetition.

The `unroll` function has the following signature:

```
unroll(first: Token, list: Token[], take: Number): Token[]
unroll(first: Token, list: Token[], take: Number[]): Token[]
```

It accepts `first` to be also `null` (and then skips this) and `take`
can be either just a single position (counting from 0) or a list of
positions.

To make the `unroll` function available to your rule actions code,
place the following at the top of your grammar definition:

```js
{
    var unroll = options.util.makeUnroll(location, options)
}
```

The `options.util` above points to the PEGUtil API and is made available
automatically by using `PEGUtil.parse` instead of PEG.js's standard
parser method `parse`.

### Abstract Syntax Tree Node Generation

Usually the result of PEG.js grammar rule actions should
be the generation of an Abstract Syntax Tree (AST) node.
For this libraries like e.g. [ASTy](http://github.com/rse/asty) can be used.

```
id_seq
    = id:id ids:(_ "," _ id)* {
          return ast("IdentifierSequence").add(unroll(id, ids, 3))
      }
```

Here the result is an AST node of type `IdentifierSequence`
which contains no attributes but all identifiers as child nodes.

To make the `ast` function available to your rule actions code,
place the following at the top of your grammar definition:

```js
{
    var ast = options.util.makeAST(location, options)
}
```

Additionally, before performing the parsing step, your
application has to tell PEGUtil how to map this call
onto the underlying AST implementation. For [ASTy](http://github.com/rse/asty) you
can use a `makeAST` function like:

```js
function (line, column, offset, args) {
    return ASTY.apply(null, args).pos(line, column, offset)
}
```

The `args` argument is an array containing all arguments
you supply to the generated `ast()` function. For
[ASTy](http://github.com/rse/asty) this would be
at least the type of the AST node.

The `options.util` above again points to the PEGUtil API and is made available
automatically by using `PEGUtil.parse` instead of PEG.js's standard
parser method `parse`.

### Cooked Error Reporting

Instead of calling the regular PEG.js `parser.parse(source[,
startRule])` you now should call `PEGUtil.parse(parser, source[,
startRule])`. The result then is always an object consisting of either
an `ast` field (in case of success) or an `error` field (in case of an
error).

In case of an error, the `error` field provides cooked error information
which allow you to print out reasonable human-friendly error messages
(especially because of the detailed `location` field):

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

For convenience reasons you can render a standard human-friendly
error message out of this information with
`PEGUtil.errorMessage(result.error)`.

License
-------

Copyright (c) 2014-2021 Dr. Ralf S. Engelschall (http://engelschall.com/)

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

