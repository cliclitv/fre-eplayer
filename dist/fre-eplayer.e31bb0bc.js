// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/fre/dist/fre.js":[function(require,module,exports) {
/**
 * by 132yse Copyright 2019-05-31
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const arrayfy = arr => (!arr ? [] : Array.isArray(arr) ? arr : [arr]);
const isNew = (o, n) => k =>
  k !== 'children' && k !== 'key' && o[k] !== n[k];
function hashfy (arr) {
  let out = {};
  let i = 0;
  arrayfy(arr).forEach(item => {
    let key = ((item || {}).props || {}).key;
    key ? (out['.' + key] = item) : (out['.' + i] = item) && i++;
  });
  return out
}
function merge (a, b) {
  let out = {};
  for (var i in a) out[i] = a[i];
  for (var i in b) out[i] = b[i];
  return out
}
const rIC = requestIdleCallback || setTimeout;
const rAF = requestAnimationFrame || setTimeout;

function h (type, props) {
  for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2;) {
    rest.push(arguments[i]);
  }
  while (rest.length) {
    if ((vnode = rest.pop()) && vnode.pop) {
      for (length = vnode.length; length--;) rest.push(vnode[length]);
    } else if (vnode === null || vnode === true || vnode === false) ; else if (typeof vnode === 'function') {
      children = vnode;
    } else {
      children.push(
        typeof vnode === 'object'
          ? vnode
          : { type: 'text', props: { nodeValue: vnode } }
      );
    }
  }
  return {
    type,
    props: merge(props, { children }),
    key: (props || {}).key
  }
}

function updateProperty (element, name, value, newValue) {
  if (name === 'style') {
    for (key in newValue) {
      let style = !newValue || !newValue[key] ? '' : newValue[key];
      element[name][key] = style;
    }
  } else if (name[0] === 'o' && name[1] === 'n') {
    name = name.slice(2).toLowerCase();
    if (value) {
      element.removeEventListener(name, value);
    }
    element.addEventListener(name, newValue);
  } else {
    element.setAttribute(name, newValue);
  }
}
function updateElement (element, props, newProps) {
  Object.keys(newProps)
    .filter(isNew(props, newProps))
    .forEach(key => {
      if (key === 'value' || key === 'nodeValue') {
        element[key] = newProps[key];
      } else {
        updateProperty(element, key, props[key], newProps[key]);
      }
    });
}
function createElement (fiber) {
  const element =
    fiber.type === 'text'
      ? document.createTextNode('')
      : document.createElement(fiber.type);
  updateElement(element, [], fiber.props);
  return element
}

let cursor = 0;
function update (key, reducer, value) {
  const current = this ? this : getCurrentFiber();
  value = reducer ? reducer(current.state[key], value) : value;
  current.state[key] = value;
  scheduleWork(current);
}
function resetCursor () {
  cursor = 0;
}
function useState (initState) {
  return useReducer(null, initState)
}
function useReducer (reducer, initState) {
  let current = getCurrentFiber();
  if (!current) return [initState, setter]
  let key = '$' + cursor;
  let setter = update.bind(current, key, reducer);
  cursor++;
  let state = current.state || {};
  if (key in state) {
    return [state[key], setter]
  } else {
    current.state[key] = initState;
    return [initState, setter]
  }
}
function useEffect (cb, inputs) {
  let current = getCurrentFiber();
  if (current) current.effect = useMemo(cb, inputs);
}
function useMemo (cb, inputs) {
  return () => {
    let current = getCurrentFiber();
    if (current) {
      let hasChaged = inputs
        ? (current.oldInputs || []).some((v, i) => inputs[i] !== v)
        : true;
      if (inputs && !inputs.length && !current.isMounted) {
        hasChaged = true;
        current.isMounted = true;
      }
      if (hasChaged) cb();
      current.oldInputs = inputs;
    }
  }
}
function createContext (initContext = {}) {
  let context = initContext;
  let setters = [];
  const update = newContext => setters.forEach(fn => fn(newContext));
  const subscribe = fn => setters.push(fn);
  const unSubscribe = fn => (setters = setters.filter(f => f !== fn));
  return { context, update, subscribe, unSubscribe }
}
function useContext (ctx) {
  const [context, setContext] = useState(ctx.context);
  ctx.subscribe(setContext);
  useEffect(() => ctx.unSubscribe(setContext));
  return [context, ctx.update]
}

const [HOST, HOOK, ROOT, PLACE, REPLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5, 6];
let updateQueue = [];
let nextWork = null;
let pendingCommit = null;
let currentFiber = null;
function render (vnode, container) {
  let rootFiber = {
    tag: ROOT,
    base: container,
    props: { children: vnode }
  };
  updateQueue.push(rootFiber);
  rIC(workLoop);
}
function scheduleWork (fiber) {
  updateQueue.push(fiber);
  rIC(workLoop);
}
function workLoop (deadline) {
  if (!nextWork && updateQueue.length) {
    const update = updateQueue.shift();
    if (!update) return
    nextWork = update;
  }
  while (nextWork && (!deadline || deadline.timeRemaining() > 1)) {
    nextWork = performWork(nextWork);
  }
  if (nextWork || updateQueue.length > 0) {
    rIC(workLoop);
  }
  rAF(() => {
    if (pendingCommit) commitWork(pendingCommit);
  });
}
function performWork (WIP) {
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP);
  if (WIP.child) return WIP.child
  while (WIP) {
    completeWork(WIP);
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent;
  }
}
function updateHost (WIP) {
  if (!WIP.base) WIP.base = createElement(WIP);
  let parent = WIP.parent || {};
  WIP.insertPoint = parent.oldPoint;
  parent.oldPoint = WIP;
  const children = WIP.props.children;
  reconcileChildren(WIP, children);
}
function updateHOOK (WIP) {
  WIP.props = WIP.props || {};
  WIP.state = WIP.state || {};
  currentFiber = WIP;
  resetCursor();
  const children = WIP.type(WIP.props);
  reconcileChildren(WIP, children);
  currentFiber.patches = WIP.patches;
}
function fiberize (children, WIP) {
  return (WIP.children = hashfy(children))
}
function reconcileChildren (WIP, children) {
  const oldFibers = WIP.children;
  const newFibers = fiberize(children, WIP);
  let reused = {};
  for (let k in oldFibers) {
    let newFiber = newFibers[k];
    let oldFiber = oldFibers[k];
    if (newFiber && oldFiber.type === newFiber.type) {
      reused[k] = oldFiber;
    } else {
      oldFiber.patchTag = DELETE;
      WIP.patches.push(oldFiber);
    }
  }
  let prevFiber = null;
  let alternate = null;
  for (let k in newFibers) {
    let newFiber = newFibers[k];
    let oldFiber = reused[k];
    if (oldFiber) {
      if (oldFiber.type === newFiber.type) {
        alternate = createFiber(oldFiber, {
          patchTag: UPDATE
        });
        newFiber.patchTag = UPDATE;
        newFiber = merge(alternate, newFiber);
        newFiber.alternate = alternate;
        if (oldFiber.key) {
          newFiber.patchTag = REPLACE;
        }
      }
    } else {
      newFiber = createFiber(newFiber, {
        patchTag: PLACE
      });
    }
    newFibers[k] = newFiber;
    newFiber.parent = WIP;
    if (prevFiber) {
      prevFiber.sibling = newFiber;
    } else {
      WIP.child = newFiber;
    }
    prevFiber = newFiber;
  }
  if (prevFiber) prevFiber.sibling = null;
}
function createFiber (vnode, data) {
  data.tag = typeof vnode.type === 'function' ? HOOK : HOST;
  vnode.props = vnode.props || { nodeValue: vnode.nodeValue };
  return merge(vnode, data)
}
function completeWork (fiber) {
  if (fiber.parent) {
    fiber.parent.patches = (fiber.parent.patches || []).concat(
      fiber.patches || [],
      fiber.patchTag ? [fiber] : []
    );
  } else {
    pendingCommit = fiber;
  }
}
function commitWork (WIP) {
  WIP.patches.forEach(p => commit(p));
  currentFiber.effect && currentFiber.effect();
  nextWork = pendingCommit = null;
}
function commit (fiber) {
  let parentFiber = fiber.parent;
  while (parentFiber.tag == HOOK) {
    parentFiber = parentFiber.parent;
  }
  const parent = parentFiber.base;
  let dom = fiber.base || fiber.child.base;
  const { insertPoint, patchTag } = fiber;
  if (fiber.tag == HOOK) {
    if (patchTag == DELETE) parent.removeChild(dom);
  } else if (patchTag == UPDATE) {
    updateElement(dom, fiber.alternate.props, fiber.props);
  } else if (patchTag == DELETE) {
    parent.removeChild(dom);
  } else {
    let after = insertPoint
      ? patchTag == PLACE
        ? insertPoint.base.nextSibling
        : insertPoint.base.nextSibling || parent.firstChild
      : null;
    if (after == dom) return
    parent.insertBefore(dom, after);
  }
  parentFiber.patches = fiber.patches = [];
}
function getCurrentFiber () {
  return currentFiber || null
}

exports.createContext = createContext;
exports.h = h;
exports.render = render;
exports.useContext = useContext;
exports.useEffect = useEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useState = useState;

},{}],"C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/use-routes/dist/use-routes.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fre')) :
  typeof define === 'function' && define.amd ? define(['exports', 'fre'], factory) :
  (global = global || self, factory(global['use-routes'] = {}, global.fre));
}(this, function (exports, fre) { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  let stack = {};
  let prepared = {};
  function useRoutes(routes) {
    const [rid] = fre.useState(Math.random().toString());
    const setter = fre.useState(0)[1];
    let stackObj = stack[rid];

    if (!stackObj) {
      stackObj = {
        routes: Object.entries(routes),
        setter
      };
      stack[rid] = stackObj;
      process(rid);
    }

    return typeof stackObj.component === 'function' ? stackObj.component(stackObj.props) : push(stackObj.component);
  }

  function process(rid) {
    const {
      routes,
      setter
    } = stack[rid];
    const currentPath = location.pathname || '/';
    let path, component, props;

    for (let i = 0; i < routes.length; i++) {
      [path, component] = routes[i];
      const [reg, group] = prepared[path] ? prepared[path] : preparedRoute(path);
      const result = currentPath.match(reg);

      if (!result) {
        component = () => {};

        continue;
      }

      if (group.length) {
        props = {};
        group.forEach((item, index) => props[item] = result[index + 1]);
      }

      break;
    }

    Object.assign(stack[rid], {
      path,
      component,
      props
    });
    setter(Date.now());
  }

  function preparedRoute(route) {
    if (prepared[route]) return prepared[route];
    const prepare = [new RegExp(`${route.substr(0, 1) === '*' ? '' : '^'}${route.replace(/:[a-zA-Z]+/g, '([^/]+)').replace(/\*/g, '')}${route.substr(-1) === '*' ? '' : '$'}`)];
    const props = route.match(/:[a-zA-Z]+/g);
    prepare.push(props ? props.map(name => name.substr(1)) : []);
    prepared[route] = prepare;
    return prepare;
  }

  function push(url) {
    window.history.pushState(null, null, url);
    processStack();
  }

  const processStack = () => Object.keys(stack).forEach(process);

  window.addEventListener('popstate', processStack);
  function A(props) {
    const {
      onClick: onclick,
      children
    } = props;

    const onClick = e => {
      e.preventDefault();
      push(e.target.href);
      if (onclick) onclick(e);
    };

    return fre.h("a", _extends({}, props, {
      onClick: onClick
    }), children);
  }

  exports.A = A;
  exports.push = push;
  exports.useRoutes = useRoutes;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

},{"fre":"node_modules/fre/dist/fre.js","process":"C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel/node_modules/process/browser.js"}],"C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel/src/builtins/bundle-url.js"}],"style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _fre = require("fre");

var _useRoutes = require("use-routes");

require("./style.css");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function EPlayer(_ref) {
  var vid = _ref.vid;

  var _useState = (0, _fre.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      url = _useState2[0],
      setUrl = _useState2[1];

  var av = vid.replace('av', '');
  (0, _fre.useEffect)(function () {
    fetch("https://jx.clicli.us/jx?url=".concat(av, "@dogecloud")).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
      setUrl(data.url);
    });
  }, []);
  return (0, _fre.h)("e-player", {
    src: url,
    type: "hls"
  });
}

var routes = {
  '/video/:vid': EPlayer
};

var App = function App() {
  return (0, _useRoutes.useRoutes)(routes);
};

(0, _fre.render)((0, _fre.h)(App, null), document.getElementById('root'));
},{"fre":"node_modules/fre/dist/fre.js","use-routes":"node_modules/use-routes/dist/use-routes.js","./style.css":"style.css"}],"C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "14081" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
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

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
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
}
},{}]},{},["C:/Users/Administrator/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/fre-eplayer.e31bb0bc.js.map