// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/common/enums.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var TokenType;

(function (TokenType) {
  TokenType[TokenType["Arrow"] = 0] = "Arrow";
  TokenType[TokenType["Column"] = 1] = "Column";
  TokenType[TokenType["FnKeyword"] = 2] = "FnKeyword";
  TokenType[TokenType["Name"] = 3] = "Name";
  TokenType[TokenType["Operator"] = 4] = "Operator";
  TokenType[TokenType["Semicolumn"] = 5] = "Semicolumn";
  TokenType[TokenType["Var"] = 6] = "Var";
})(TokenType = exports.TokenType || (exports.TokenType = {}));

var ItemType;

(function (ItemType) {
  ItemType[ItemType["Expression"] = 0] = "Expression";
  ItemType[ItemType["FnDeclaration"] = 1] = "FnDeclaration";
  ItemType[ItemType["Module"] = 2] = "Module";
  ItemType[ItemType["Number"] = 3] = "Number";
  ItemType[ItemType["Operation"] = 4] = "Operation";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
},{}],"src/common/syntax.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;
exports.ARROW = '=>';
exports.COLUMN = ':';
exports.SEMICOLUMN = ';';
exports.FUNC = 'fn'; // in watom input, vars must be lowercase letters of length 1

exports.varRegExp = /^([a-z]){1,1}$/; // in watom input, names must be lowercase letters of length at least 2

exports.nameRegExp = /^([a-z]){3,}$/; // in watom only these operations are supported

exports.OPS = Object.freeze(['+', '-', '/', '*']);
},{}],"src/tokenizer.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var enums_1 = require("./common/enums");

var syntax_1 = require("./common/syntax");

function getTokenType(str) {
  if (str === syntax_1.FUNC) {
    return enums_1.TokenType.FnKeyword;
  } else if (syntax_1.varRegExp.test(str)) {
    return enums_1.TokenType.Var;
  } else if (syntax_1.nameRegExp.test(str)) {
    return enums_1.TokenType.Name;
  } else if (str === syntax_1.ARROW) {
    return enums_1.TokenType.Arrow;
  } else if (str === syntax_1.COLUMN) {
    return enums_1.TokenType.Column;
  } else if (str === syntax_1.SEMICOLUMN) {
    return enums_1.TokenType.Semicolumn;
  } else if (syntax_1.OPS.includes(str)) {
    return enums_1.TokenType.Operator;
  } else {
    throw SyntaxError("Watom doesn't know what " + str + " is.");
  }
}

function tokenize(input) {
  return input.split(' ').map(function (str) {
    var token = {
      type: getTokenType(str),
      value: str
    };
    return token;
  });
}

exports["default"] = tokenize;
},{"./common/enums":"src/common/enums.ts","./common/syntax":"src/common/syntax.ts"}],"src/parser.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__esModule = true;

var enums_1 = require("./common/enums");

var syntax_1 = require("./common/syntax"); // var ast = {
//   type: 'Module',
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
//           operator: '+',
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
// (module
//     (func (param $p i32) (param $q i32)
//       get_local $p
//       get_local $q
//       i32.add)
//     ))


function opBuilder(tokens, startIndex) {
  // everything until the end of tokens is part of the op
  var endIndex = tokens.length - 1;
  var operandsTokens = tokens.slice(startIndex + 1, tokens.length);
  return {
    item: {
      type: enums_1.ItemType.Operation,
      operator: tokens[startIndex].value,
      // +1 in order to ignore `=>`
      operands: operandsTokens.map(function (o) {
        return {
          type: enums_1.ItemType.Number,
          value: o.value
        };
      })
    },
    increment: endIndex - startIndex
  };
}

function returnValueBuilder(tokens, startIndex) {
  var endIndex = startIndex; // everything between `=>` and `;` is part of the return value

  while (tokens[endIndex] && tokens[endIndex].value !== syntax_1.SEMICOLUMN) {
    endIndex++;
  }

  return {
    item: {
      type: enums_1.ItemType.Expression,
      // +1 to ignore `=>`
      value: opBuilder(tokens, startIndex + 1).item
    },
    increment: endIndex - startIndex
  };
}

function fnDeclarationBuilder(tokens, startIndex) {
  // a function declaration looks like: `fn fnName :`
  var endIndex = startIndex + 2;
  return {
    item: {
      name: tokens[startIndex + 1].value,
      type: enums_1.ItemType.FnDeclaration
    },
    increment: endIndex - startIndex
  };
}

function paramsBuilder(tokens, startIndex) {
  var endIndex = startIndex; // everything before `=>` is a parameter

  while (tokens[endIndex].value !== '=>') {
    endIndex++;
  }

  var params = tokens.slice(startIndex + 1, endIndex);
  return {
    item: params.map(function (p) {
      return {
        type: enums_1.ItemType.Number,
        value: p.value
      };
    }),
    increment: endIndex - startIndex
  };
}

function parse(tokens) {
  var current = 0;

  function getAstItem(token, tokens) {
    switch (token.type) {
      case enums_1.TokenType.FnKeyword:
        var tempX = current;
        var fnDeclaration = fnDeclarationBuilder(tokens, tempX);
        var tempX2 = tempX + fnDeclaration.increment;
        var params = paramsBuilder(tokens, tempX2);
        var tempX3 = tempX2 + params.increment;
        var returnValue = returnValueBuilder(tokens, tempX3);
        var tempX4 = tempX3 + returnValue.increment;
        current += tempX4;
        return __assign({}, fnDeclaration.item, {
          params: params.item,
          returnValue: returnValue.item
        });

      default:
        current++;
        return {
          type: enums_1.ItemType.Operation,
          value: token.value
        };
    }
  }

  var ast = {
    type: enums_1.ItemType.Module,
    body: []
  };

  while (current < tokens.length) {
    ast.body.push(getAstItem(tokens[current], tokens));
  }

  return ast;
}

exports["default"] = parse;
},{"./common/enums":"src/common/enums.ts","./common/syntax":"src/common/syntax.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

exports.__esModule = true;

var tokenizer_1 = __importDefault(require("./tokenizer"));

var parser_1 = __importDefault(require("./parser"));

var input = 'fn add : a b => + a b';
var tokens = tokenizer_1["default"](input);
var ast = parser_1["default"](tokens);
console.table(tokens);
console.log(ast);
},{"./tokenizer":"src/tokenizer.ts","./parser":"src/parser.ts"}],"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55266" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.map