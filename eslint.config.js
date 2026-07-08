/*
**  pegjs-util -- Utility Class for Peggy
**  Copyright (c) 2014-2026 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

module.exports = [
    {
        files: [ "PEGUtil.js" ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType:  "script"
        },
        rules: {
            "no-cond-assign":            2,
            "no-console":                2,
            "no-constant-condition":     2,
            "no-debugger":               2,
            "no-delete-var":             2,
            "no-dupe-keys":              2,
            "no-dupe-args":              2,
            "no-duplicate-case":         2,
            "no-empty":                  2,
            "no-empty-character-class":  2,
            "no-ex-assign":              2,
            "no-extra-boolean-cast":     2,
            "no-extra-semi":             2,
            "no-fallthrough":            2,
            "no-func-assign":            2,
            "no-inner-declarations":     [ 2, "functions" ],
            "no-invalid-regexp":         2,
            "no-irregular-whitespace":   2,
            "no-mixed-spaces-and-tabs":  2,
            "no-unsafe-negation":        2,
            "no-obj-calls":              2,
            "no-octal":                  2,
            "no-redeclare":              2,
            "no-regex-spaces":           2,
            "no-sparse-arrays":          2,
            "no-undef":                  2,
            "no-unreachable":            2,
            "no-unused-vars":            [ 2, { "vars": "all", "args": "after-used" } ],
            "comma-dangle":              [ 2, "never" ],
            "use-isnan":                 2,
            "valid-typeof":              2
        }
    }
]
