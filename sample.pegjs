{
    var unroll = options.util.makeUnroll(line, column, offset, SyntaxError)
    var ast    = options.util.makeAST(line, column, offset)
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
