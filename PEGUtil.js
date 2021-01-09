/*
**  pegjs-util -- Utility Class for PEG.js
**  Copyright (c) 2014-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  Universal Module Definition (UMD) for Library  */
(function (root, name, factory) {
    /* global define: false */
    /* global module: false */
    if (typeof module === "object" && typeof module.exports === "object")
        /*  CommonJS environment  */
        module.exports = factory(root);
    else if (typeof define === "function" && typeof define.amd !== "undefined")
        /*  AMD environment  */
        define(name, function () { return factory(root); });
    else
        /*  Browser environment  */
        root[name] = factory(root);
}(/* global global: false */
  (typeof global !== "undefined" ? global :
  /* global window: false */
  (typeof window !== "undefined" ? window : this)), "PEGUtil", function (/* root */) {

    var PEGUtil = {};

    /*  helper function for generating a function to generate an AST node  */
    PEGUtil.makeAST = function makeAST (location, options) {
        return function () {
            return options.util.__makeAST.call(
                null,
                location().start.line,
                location().start.column,
                location().start.offset,
                arguments
            );
        };
    };

    /*  helper function for generating a function to unroll the parse stack  */
    PEGUtil.makeUnroll = function (location, options) {
        return function (first, list, take) {
            if (   typeof list !== "object"
                || !(list instanceof Array))
                throw new options.util.__SyntaxError("unroll: invalid list argument for unrolling",
                    (typeof list), "Array", location());
            if (typeof take !== "undefined") {
                if (typeof take === "number")
                    take = [ take ];
                var result = [];
                if (first !== null)
                    result.push(first);
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < take.length; j++)
                        result.push(list[i][take[j]]);
                }
                return result;
            }
            else {
                if (first !== null)
                    list.unshift(first);
                return list;
            }
        };
    };

    /*  utility function: create a source excerpt  */
    var excerpt = function (txt, o) {
        var l = txt.length;
        var b = o - 20; if (b < 0) b = 0;
        var e = o + 20; if (e > l) e = l;
        var hex = function (ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
        };
        var extract = function (txt, pos, len) {
            return txt.substr(pos, len)
                .replace(/\\/g,   "\\\\")
                .replace(/\x08/g, "\\b")
                .replace(/\t/g,   "\\t")
                .replace(/\n/g,   "\\n")
                .replace(/\f/g,   "\\f")
                .replace(/\r/g,   "\\r")
                .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return "\\x0" + hex(ch); })
                .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return "\\x"  + hex(ch); })
                .replace(/[\u0100-\u0FFF]/g,         function(ch) { return "\\u0" + hex(ch); })
                .replace(/[\u1000-\uFFFF]/g,         function(ch) { return "\\u"  + hex(ch); });
        };
        return {
            prolog: extract(txt, b, o - b),
            token:  extract(txt, o, 1),
            epilog: extract(txt, o + 1, e - (o + 1))
        };
    };

    /*  provide top-level parsing functionality  */
    PEGUtil.parse = function (parser, txt, options) {
        if (typeof parser !== "object")
            throw new Error("invalid parser object (not an object)");
        if (typeof parser.parse !== "function")
            throw new Error("invalid parser object (no \"parse\" function)");
        if (typeof txt !== "string")
            throw new Error("invalid input text (not a string)");
        if (typeof options !== "undefined" && typeof options !== "object")
            throw new Error("invalid options (not an object)");
        if (typeof options === "undefined")
            options = {};
        var result = { ast: null, error: null };
        try {
            var makeAST;
            if (typeof options.makeAST === "function")
                makeAST = options.makeAST;
            else {
                makeAST = function (location, args) {
                    return {
                        line:   location().start.line,
                        column: location().start.column,
                        offset: location().start.offset,
                        args:   args
                    };
                };
            }
            options.util = {
                makeUnroll:    PEGUtil.makeUnroll,
                makeAST:       PEGUtil.makeAST,
                __makeAST:     makeAST,
                __SyntaxError: parser.SyntaxError
            };
            result.ast = parser.parse(txt, options);
            result.error = null;
        }
        catch (e) {
            result.ast = null;
            if (e instanceof parser.SyntaxError) {
                var definedOrElse = function (value, fallback) {
                    return (typeof value !== "undefined" ? value : fallback);
                };
                result.error = {
                    line:     definedOrElse(e.location.start.line, 0),
                    column:   definedOrElse(e.location.start.column, 0),
                    message:  e.message,
                    found:    definedOrElse(e.found, ""),
                    expected: definedOrElse(e.expected, ""),
                    location: excerpt(txt, definedOrElse(e.location.start.offset, 0))
                };
            }
            else {
                result.error = {
                    line:     0,
                    column:   0,
                    message:  e.message,
                    found:    "",
                    expected: "",
                    location: excerpt("", 0)
                };
            }
        }
        return result;
    };

    /*  render a useful error message  */
    PEGUtil.errorMessage = function (e, noFinalNewline) {
        var l = e.location;
        var prefix1 = "line " + e.line + " (column " + e.column + "): ";
        var prefix2 = "";
        for (var i = 0; i < prefix1.length + l.prolog.length; i++)
            prefix2 += "-";
        var msg = prefix1 + l.prolog + l.token + l.epilog + "\n" +
            prefix2 + "^" + "\n" +
            e.message + (noFinalNewline ? "" : "\n");
        return msg;
    };

    return PEGUtil;
}));

