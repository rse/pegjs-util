var fs      = require("fs")
var ASTY    = require("asty")
var PEG     = require("pegjs")
var PEGUtil = require("./PEGUtil")

var parser = PEG.buildParser(fs.readFileSync("sample.pegjs", "utf8"))
var result = PEGUtil.parse(parser, fs.readFileSync(process.argv[2], "utf8"), {
    startRule: "start",
    makeAST: function (line, column, offset, args) {
        return ASTY.apply(null, args).pos(line, column, offset)
    }
})
if (result.error !== null)
    console.log("ERROR: Parsing Failure:\n" +
        PEGUtil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "))
else
    console.log(result.ast.dump().replace(/\n$/, ""))
