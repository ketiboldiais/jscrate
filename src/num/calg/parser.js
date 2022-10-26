// parser.js
var input, currToken, pos;

var TOK_OPERATOR = 1;
var TOK_NUMBER = 2;
var TOK_EOF = 3;

function nextToken() {
  var c,
    tok = {};

  while (pos < input.length) {
    c = input.charAt(pos++);
    switch (c) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "(":
      case ")":
        tok.op = c;
        tok.type = TOK_OPERATOR;
        return tok;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        tok.value = c;
        tok.type = TOK_NUMBER;
        return tok;

      default:
        throw "Unexpected character: " + c;
    }
  }
  tok.type = TOK_EOF;
  return tok;
}

function getNextToken() {
  var ret;

  if (currToken) ret = currToken;
  else ret = nextToken();

  currToken = undefined;

  return ret;
}

function peekNextToken() {
  if (!currToken) currToken = nextToken();

  return currToken;
}

function skipNextToken() {
  if (!currToken) currToken = nextToken();
  currToken = undefined;
}

function parseString(str) {
  input = str;
  pos = 0;

  return expression();
}

function expression() {
  return additiveExpression();
}

function additiveExpression() {
  var left = multiplicativeExpression();
  var tok = peekNextToken();
  while (tok.type == TOK_OPERATOR && (tok.op == "+" || tok.op == "-")) {
    skipNextToken();
    var node = {};
    node.op = tok.op;
    node.left = left;
    node.right = multiplicativeExpression();
    left = node;
    tok = peekNextToken();
  }
  return left;
}

function multiplicativeExpression() {
  var left = primaryExpression();
  var tok = peekNextToken();
  while (tok.type == TOK_OPERATOR && (tok.op == "*" || tok.op == "/")) {
    skipNextToken();
    var node = {};
    node.op = tok.op;
    node.left = left;
    node.right = primaryExpression();
    left = node;
    tok = peekNextToken();
  }
  return left;
}

function primaryExpression() {
  var tok = peekNextToken();
  if (tok.type == TOK_NUMBER) {
    skipNextToken();
    node = {};
    node.value = tok.value;
    return node;
  } else if (tok.type == TOK_OPERATOR && tok.op == "(") {
    skipNextToken();
    var node = expression(); // The beauty of recursion
    tok = getNextToken();
    if (tok.type != TOK_OPERATOR || tok.op != ")") throw "Error ) expected";
    return node;
  } else throw "Error " + tok + " not exptected";
}

var tree = parseString("1+2");
console.log(tree);

// module 2

function AstNode(operator, left, right) {
  this.operator = operator;
  this.left = left;
  this.right = right;
}

AstNode.prototype.evaluate = function () {
  return this.operator(this.left.evaluate(), this.right.evaluate());
};

function ValueNode(val) {
  this.value = val;
}

ValueNode.prototype.evaluate = function () {
  return this.value;
};

function VariableNode(context, keyName) {
  this.context = context;
  this.keyName = keyName;
}

VariableNode.prototype.evaluate = function () {
  return this.context.get(this.keyName);
};

var operators = {
  "*": function (left, right) {
    return left * right;
  },
  "/": function (left, right) {
    return left / right;
  },
  "+": function (left, right) {
    return left + right;
  },
  "-": function (left, right) {
    return left - right;
  },
  "^": function (left, right) {
    return Math.pow(left, right);
  },
  "%": function (left, right) {
    return left % right;
  },
};

var operatorDict = {
  "+": [operators["+"], 2, 2],
  "-": [operators["-"], 2, 2],
  "*": [operators["*"], 3, 3],
  "/": [operators["/"], 3, 3],
  "%": [operators["%"], 3, 3],
  "^": [operators["^"], 4, 5],
  "(": [function () {}, 0, 8],
};

function Parser() {
  this.operatorStack = [];
  this.nodeStack = [];
}

var funcDict = {
  valueFunc: function (value) {
    this.nodeStack.push(value);
    this.__proto__ = protoState2;
  },
  operatorFunc: function (operator) {
    var operatorPrecedence = operatorDict[operator][2];
    this.reduce(operatorPrecedence);
    this.operatorStack.push(operatorDict[operator]);
    this.__proto__ = protoState1;
  },
  closeParenFunc: function () {
    this.reduce(1);
    if (this.operatorStack.length) {
      this.operatorStack.pop();
    } else {
      this.syntaxErr("Error - no open parenthesis matches close parenthesis");
    }
    this.__proto__ = protoState2;
  },
  syntaxErr: function (err) {
    throw new Error(err);
  },
  end: function () {
    this.reduce(0);
    return this.nodeStack.pop();
  },
  reduce: function (precedence) {
    while (this.operatorStack.length) {
      var tailOperator = this.operatorStack[this.operatorStack.length - 1];
      if (tailOperator[1] < precedence) break;
      tailOperator = this.operatorStack.pop();
      var right = this.nodeStack.pop();
      var left = this.nodeStack.pop();
      this.nodeStack.push(new AstNode(tailOperator[0], left, right));
    }
  },
};

var protoState1 = {
  valueFunc: funcDict.valueFunc,
  operatorFunc: funcDict.syntaxErr,
  openParenFunc: funcDict.operatorFunc,
  closeParenFunc: funcDict.syntaxErr,
  syntaxErr: funcDict.syntaxErr,
  end: funcDict.end,
  reduce: funcDict.reduce,
};

var protoState2 = {
  valueFunc: funcDict.syntaxErr,
  operatorFunc: funcDict.operatorFunc,
  openParenFunc: funcDict.syntaxErr,
  closeParenFunc: funcDict.closeParenFunc,
  syntaxErr: funcDict.syntaxErr,
  end: funcDict.end,
  reduce: funcDict.reduce,
};

Parser.prototype.__proto__ = protoState1;

function Lexer(expression, parseObj, context) {
  if (!context) {
    context = {
      get: function (name) {
        return null;
      },
    };
  }
  for (var i = 0, len = expression.length; i < len; ++i) {
    var character = expression.charAt(i);
    switch (character) {
      case " ":
      case "\n":
      case "\t":
        continue;
      case "(":
        parseObj.openParenFunc("(");
        break;
      case ")":
        parseObj.closeParenFunc();
        break;
      case "{":
        var name = "";
        while (i < len) {
          var ch = expression.charAt(++i);
          if (ch === "}") {
            if (/^[\w\.]+$/.test(name)) {
              parseObj.valueFunc(new VariableNode(context, name));
              break;
            } else {
              parseObj.syntaxErr("Invalid character in variable name at " + i);
            }
          } else {
            name += ch;
            if (i === len) {
              parseObj.syntaxErr("Unexpected end of output");
            }
          }
        }
        break;
      case "}":
        parseObj.syntaxErr("Unexpected } found at character" + i);
        break;
      default:
        if (typeof operatorDict[character] !== "undefined") {
          parseObj.operatorFunc(character);
        } else {
          var numDecimals = 0,
            numBuffer = "";
          while (i < len) {
            if (numDecimals > 1)
              parseObj.syntaxErr("Unexpected . found at character " + i);
            if (character === ".") numDecimals++;
            numBuffer += "" + character;
            var nextChar = expression.charAt(i + 1);
            if (nextChar === "." || !isNaN(parseFloat(nextChar))) {
              character = expression.charAt(++i);
            } else {
              break;
            }
          }
          parseObj.valueFunc(new ValueNode(parseFloat(numBuffer)));
          numBuffer = "";
        }
    }
  }
  return parseObj.end();
}

var expr = "4 + (5 + 18.1) * 10 / {Stuff}";
expr = "5 / 10 % 3 + {Merf}";

var context = {
  data: {
    Stuff: 5,
  },
  get: function (name) {
    if (typeof this.data[name] !== "undefined") return this.data[name];
    return null;
  },
};

try {
  var tree = new Lexer(expr, new Parser(), context);
  console.log(tree, tree.evaluate());
} catch (e) {
  console.log(e.stack);
}
