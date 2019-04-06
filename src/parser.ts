import { ItemType } from './common/enums';
import { TokenType } from './common/enums';
import {
  FUNC,
  varRegExp,
  nameRegExp,
  ARROW,
  COLUMN,
  OPS
} from './common/syntax';

// var ast = {
//   type: 'Program',
//   body: [
//     {
//       type: 'FunctionDeclaration',
//       name: 'add',
//       params: [
//         {
//           type: 'Numberi32',
//           value: 'a'
//         },
//         {
//           type: 'Numberi32',
//           value: 'b'
//         }
//       ],
//       returnValue: {
//         type: 'Expression',
//         value: {
//           type: 'Operation',
//           name: '+',
//           operands: [
//             {
//               type: 'Numberi32',
//               value: 'a'
//             },
//             {
//               type: 'Numberi32',
//               value: 'b'
//             }
//           ]
//         }
//       }
//     }
//   ]
// };

function returnValueBuilder(tokens, startIndex) {
  // we know that the return value spans until the end
  const endIndex = tokens.length - 1;
  return {
    item: {
      type: ItemType.Expression,
      value: 'yup'
    },
    increment: endIndex - startIndex
  };
}

function fnDeclarationBuilder(tokens, startIndex) {
  // we know that a fn dec is like: `fn fnName :`
  const endIndex = startIndex + 2;
  return {
    item: {
      name: tokens[startIndex + 1].value,
      type: ItemType.FnDeclaration
    },
    increment: endIndex - startIndex
  };
}

function paramsBuilder(tokens, startIndex) {
  let endIndex = startIndex;
  // everything before "=>" is a parameter
  while (tokens[endIndex].value !== '=>') {
    endIndex++;
  }
  const params = tokens.slice(startIndex + 1, endIndex);
  return {
    item: params.map(p => ({
      type: ItemType.Number,
      value: p.value
    })),
    increment: endIndex - startIndex
  };
}

function parse(tokens) {
  let current = 0;
  let count = tokens.length;

  function getAstItem(token, tokens) {
    // console.log(token.type);
    // console.log(current);
    // console.log('----');
    switch (token.type) {
      case TokenType.FnKeyword:
        let tempX = current;
        let tempX2 = tempX + fnDeclarationBuilder(tokens, tempX).increment;
        let tempX3 = tempX2 + paramsBuilder(tokens, tempX2).increment;
        let tempX4 = tempX3 + returnValueBuilder(tokens, tempX3).increment;
        current += tempX4;
        console.log(current);
        return {
          ...fnDeclarationBuilder(tokens, tempX).item,
          params: paramsBuilder(tokens, tempX2).item,
          returnValue: returnValueBuilder(tokens, tempX3).item
        };
      //   name: tokens[tempX + 1].value
      //   params: [
      //     getAstItem(tokens[current + 1], tokens),
      //     getAstItem(tokens[current + 1], tokens)
      //   ],
      //   returnValue: getAstItem(tokens[tempX + 1], tokens);
      //   case TokenType.Var:
      //     console.log('var', tokens[current]);
      //     current++;
      //     return {
      //       type: ItemType.Number,
      //       value: token.value
      //     };
      //   case TokenType.Arrow:
      //     // console.log('arr');
      //     current++;
      //     return {
      //       type: ItemType.ReturnVal,
      //       value: token.value
      //     };
      //   case TokenType.Operator:
      //     console.log('oper', token.type);
      //     console.log(TokenType.Operator);

      //     const tempp = current;
      //     console.log('oper', current);
      //     console.log('oper', tokens[tempp + 1]);
      //     // console.log('oper', current);
      //     current++;
      //     return {
      //       type: ItemType.Operation,
      //       name: token.value,
      //       operands: [
      //         getAstItem(tokens[tempp + 1], tokens),
      //         getAstItem(tokens[tempp + 2], tokens)
      //       ]
      //     };
      default:
        current++;
        return {
          type: 'undefined',
          value: token.value
        };
    }
  }

  console.log('tokens', tokens);
  function walk() {
    const token = tokens[current];
    return getAstItem(token, tokens);
    // switch (token.type) {
    //   case TokenType.Var:
    //     current++;
    //     count--;
    //     return {
    //       type: ItemType.Number,
    //       value: token.value
    //     };
    //   case TokenType.Operator:
    //     count--;
    //     const bla = getAstItem(token, tokens);
    //     current++;
    //     return bla;
    //   default:
    //     current++;
    //     count--;
    //     return {
    //       type: ItemType.Number,
    //       value: token.value
    //     };
    // }
    // if (token.type === TokenType.Var) {
    //   current++;
    //   return {
    //     type: ItemType.Number,
    //     value: token.value
    //   };
    // }

    // else {
    //   current++;
    //   return {
    //     type: '.Number',
    //     value: token.value
    //   };
    // }
  }
  // Next we're going to look for CallExpressions. We start this off when we
  // encounter an open parenthesis.
  // if (token.type === 'paren' && token.value === '(') {
  // We'll increment `current` to skip the parenthesis since we don't care
  // about it in our AST.
  //   token = tokens[++current];

  // We create a base node with the type `CallExpression`, and we're going
  // to set the name as the current token's value since the next token after
  // the open parenthesis is the name of the function.
  //   let node = {
  //     type: 'CallExpression',
  //     name: token.value,
  //     params: []
  //   };

  // We increment `current` *again* to skip the name token.
  //   token = tokens[++current];

  // And now we want to loop through each token that will be the `params` of
  // our `CallExpression` until we encounter a closing parenthesis.
  //
  // Now this is where recursion comes in. Instead of trying to parse a
  // potentially infinitely nested set of nodes we're going to rely on
  // recursion to resolve things.
  //
  // To explain this, let's take our Lisp code. You can see that the
  // parameters of the `add` are a number and a nested `CallExpression` that
  // includes its own numbers.
  //
  //   (add 2 (subtract 4 2))
  //
  // You'll also notice that in our tokens array we have multiple closing
  // parenthesis.
  //
  //   [
  //     { type: 'paren',  value: '('        },
  //     { type: 'name',   value: 'add'      },
  //     { type: 'number', value: '2'        },
  //     { type: 'paren',  value: '('        },
  //     { type: 'name',   value: 'subtract' },
  //     { type: 'number', value: '4'        },
  //     { type: 'number', value: '2'        },
  //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
  //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
  //   ]
  //
  // We're going to rely on the nested `walk` function to increment our
  // `current` variable past any nested `CallExpression`.

  // So we create a `while` loop that will continue until it encounters a
  // token with a `type` of `'paren'` and a `value` of a closing
  // parenthesis.
  //   while (
  //     token.type !== 'paren' ||
  //     (token.type === 'paren' && token.value !== ')')
  //   ) {
  // we'll call the `walk` function which will return a `node` and we'll
  // push it into our `node.params`.
  //     node.params.push(walk());
  //     token = tokens[current];
  //   }

  // Finally we will increment `current` one last time to skip the closing
  // parenthesis.
  //   current++;

  // And return the node.
  //   return node;
  // }

  // Again, if we haven't recognized the token type by now we're going to
  // throw an error.
  // throw new TypeError(token.type);

  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.

  // And we're going to kickstart our `walk` function, pushing nodes to our
  // `ast.body` array.
  //
  // The reason we are doing this inside a loop is because our program can have
  // `CallExpression` after one another instead of being nested.
  //
  //   (add 2 2)
  //   (subtract 4 2)
  //
  let ast = {
    type: ItemType.Module,
    body: []
  };
  while (current < tokens.length - 1) {
    ast.body.push(walk());
  }
  // At the end of our parser we'll return the AST.
  return ast;
}

export default parse;

// (module
//     (func (param $p i32)
//       get_local $p
//       get_local $p
//       i32.add)
//     )

var input = '(add 2 (subtract 4 2))';
var output = 'add(2, subtract(4, 2));';

var tokens = [
  { type: 'paren', value: '(' },
  { type: 'name', value: 'add' },
  { type: 'number', value: '2' },
  { type: 'paren', value: '(' },
  { type: 'name', value: 'subtract' },
  { type: 'number', value: '4' },
  { type: 'number', value: '2' },
  { type: 'paren', value: ')' },
  { type: 'paren', value: ')' }
];

// const input = 'add : a b => a + b';

// var ast = {
//   type: 'Program',
//   body: [
//     {
//       type: 'CallExpression',
//       name: 'add',
//       params: [
//         {
//           type: 'NumberLiteral',
//           value: '2'
//         },
//         {
//           type: 'CallExpression',
//           name: 'subtract',
//           params: [
//             {
//               type: 'NumberLiteral',
//               value: '4'
//             },
//             {
//               type: 'NumberLiteral',
//               value: '2'
//             }
//           ]
//         }
//       ]
//     }
//   ]
// };

var newAst = {
  type: 'Program',
  body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'add'
        },
        arguments: [
          {
            type: 'NumberLiteral',
            value: '2'
          },
          {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'subtract'
            },
            arguments: [
              {
                type: 'NumberLiteral',
                value: '4'
              },
              {
                type: 'NumberLiteral',
                value: '2'
              }
            ]
          }
        ]
      }
    }
  ]
};
