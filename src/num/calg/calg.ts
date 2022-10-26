/**
 * --- INTEGER ---
 * integer
 *   | 0,1,2,3,4,5,6,7,8,9
 *   | 1,2,3,4,5,6,7,8,9 integer
 * 
 * --- REAL ---
 * real
 *   | integer '.' integer
 * 
 * --- SYMBOL ---
 * symbol
 *   | {a...z}
 *   | {A...Z}
 *   | {a...z} {A...Z}
 *   | {A...Z} {a...z}
 *   | symbol {a...z}
 *   | symbol {A...Z}
 * 
 * --- RESERVED ---
 * reserved
 *   | π
 *   | e
 * 
 * --- OPERATOR ---
 * algebraic operator
 *   | + - ^ * / !
 * 
 * relational operator
 *   | = < > != <= >=
 * 
 * logic operator
 *   | 'and'
 *   | 'or'
 *   | 'not'
 * 
 * set operator
 *   | 'union'
 *   | 'intersection'
 * 
 * ===== Atomic Expression ======
 * atomic expression 
 *   | integer
 *   | real
 *   | symbol
 *   | reserved
 *
 * ===== Basic Algebraic Expression ======
 * BAE
 *   | integer
 *   | fraction
 *   | symbol
 *   | BAE + BAE
 *   | BAE * BAE
 *   | BAE / BAE
 *   | BAE - BAE
 *   | BAE ^ BAE
 *   | BAE !
 *   | symbol '(' BAE ')'
 *
 * '+' and '-' are either unary prefix or binary infix operators
 * '*', '/', and '^' are binary infix operators
 * '!' is a unary postfix operator
 *
 *
 * ==== PRECEDENCE HIERARCHY ==============
 * | level 1 | function names  | <-- highest
 * | level 2 | !               |
 * | level 3 | ^               |
 * | level 4 | * /             |
 * | level 5 | + -             | <-- lowest
 *
 * == General Rule ==
 * For operators at the same level, the operator
 * to the right has lower lower precedence (this is
 * called right associativity).
 *
 * == Exception ==
 * For the '^' operator, the operator to the left
 * has lower precedence.
 *
 * == Parens ==
 * If two operators are at different parentheses levels,
 * the operator outside the pair of parentheses has lower
 * precendence than the operator inside the parentheses.
 */
