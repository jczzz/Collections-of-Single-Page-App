// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
//export default 一个对象，have a function called search
exports.default = {
  search: function search(searchTerm, searchLimit, sortBy) {
    return fetch("http://www.reddit.com/search.json?q=" + searchTerm + "&sort=" + sortBy + "&limit=" + searchLimit).then(function (res) {
      return res.json();
    }).then(function (data) {
      return data.data.children.map(function (data) {
        return data.data;
      });
    }).catch(function (err) {
      return console.log(err);
    });
  }
};
},{}],2:[function(require,module,exports) {
'use strict';

var _redditapi = require('./redditapi');

var _redditapi2 = _interopRequireDefault(_redditapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchForm = document.getElementById('search-form'); //bring in this module

var searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', function (e) {
  // Get sort
  var sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // Get limit
  var searchLimit = document.getElementById('limit').value;
  // Get search
  var searchTerm = searchInput.value;
  // Check for input
  if (searchTerm == '') {
    // Show message
    showMessage('Please add a search term', 'alert-danger');
  }
  // Clear field
  searchInput.value = '';

  // Search Reddit
  _redditapi2.default.search(searchTerm, searchLimit, sortBy).then(function (results) {

    var output = '<div class="card-columns">';
    console.log(results);
    results.forEach(function (post) {
      var image = post.preview ? post.preview.images[0].source.url : 'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg';
      output += '\n      <div class="card mb-2">\n      <img class="card-img-top" src="' + image + '" alt="Card image cap">\n      <div class="card-body">\n        <h5 class="card-title">' + post.title + '</h5>\n        <p class="card-text">' + truncateString(post.selftext, 100) + '</p>\n        <a href="' + post.url + '" target="_blank\n        " class="btn btn-primary">Read More</a>\n        <hr>\n        <span class="badge badge-secondary">Subreddit: ' + post.subreddit + '</span> \n        <span class="badge badge-dark">Score: ' + post.score + '</span>\n      </div>\n    </div>\n      ';
    });

    output += '</div>';
    document.getElementById('results').innerHTML = output;
  });

  e.preventDefault();
});

// Show Message Function
function showMessage(message, className) {
  //创建一个提示信息 <div class='alert alert-danger'></div>
  // Create div
  var div = document.createElement('div');
  // Add classes     using the ${ } syntax
  div.className = 'alert ' + className;
  // Add text
  div.appendChild(document.createTextNode(message));

  //指定提示显示位置
  // Get parent
  var searchContainer = document.getElementById('search-container');
  // Get form
  var search = document.getElementById('search');
  // Insert alert
  searchContainer.insertBefore(div, search);

  //设定提示显示时间
  // Timeout after 3 sec
  setTimeout(function () {
    document.querySelector('.alert').remove();
  }, 3000);
}

// Truncate String Function
function truncateString(myString, limit) {
  var shortened = myString.indexOf(' ', limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened);
}
},{"./redditapi":3}],7:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '59515' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
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
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
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
        parents.push(+k);
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
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[7,2])
//# sourceMappingURL=/dist/findreddit.map