(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * @license
 * Lo-Dash 1.0.2 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.4.4 <http://underscorejs.org/>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
 * Available under MIT license <http://lodash.com/license>
 */
;(function(window, undefined) {

  /** Detect free variable `exports` */
  var freeExports = typeof exports == 'object' && exports;

  /** Detect free variable `module` */
  var freeModule = typeof module == 'object' && module && module.exports == freeExports && module;

  /** Detect free variable `global` and use it as `window` */
  var freeGlobal = typeof global == 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    window = freeGlobal;
  }

  /** Used for array and object method references */
  var arrayRef = [],
      objectRef = {};

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used internally to indicate various things */
  var indicatorObject = objectRef;

  /** Used by `cachedContains` as the default size when optimizations are enabled for large arrays */
  var largeArraySize = 30;

  /** Used to restore the original `_` reference in `noConflict` */
  var oldDash = window._;

  /** Used to match HTML entities */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    (objectRef.valueOf + '')
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/valueOf|for [^\]]+/g, '.+?') + '$'
  );

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-7.8.6
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to match HTML characters */
  var reUnescapedHtml = /[&<>"']/g;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** Native method shortcuts */
  var ceil = Math.ceil,
      concat = arrayRef.concat,
      floor = Math.floor,
      getPrototypeOf = reNative.test(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
      hasOwnProperty = objectRef.hasOwnProperty,
      push = arrayRef.push,
      toString = objectRef.toString;

  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeBind = reNative.test(nativeBind = slice.bind) && nativeBind,
      nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray,
      nativeIsFinite = window.isFinite,
      nativeIsNaN = window.isNaN,
      nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys,
      nativeMax = Math.max,
      nativeMin = Math.min,
      nativeRandom = Math.random;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Detect various environments */
  var isIeOpera = !!window.attachEvent,
      isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera);

  /* Detect if `Function#bind` exists and is inferred to be fast (all but V8) */
  var isBindFast = nativeBind && !isV8;

  /* Detect if `Object.keys` exists and is inferred to be fast (IE, Opera, V8) */
  var isKeysFast = nativeKeys && (isIeOpera || isV8);

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used to lookup a built-in constructor by [[Class]] */
  var ctorByClass = {};
  ctorByClass[arrayClass] = Array;
  ctorByClass[boolClass] = Boolean;
  ctorByClass[dateClass] = Date;
  ctorByClass[objectClass] = Object;
  ctorByClass[numberClass] = Number;
  ctorByClass[regexpClass] = RegExp;
  ctorByClass[stringClass] = String;

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object, that wraps the given `value`, to enable method
   * chaining.
   *
   * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
   * and `unshift`
   *
   * The chainable wrapper functions are:
   * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`, `compose`,
   * `concat`, `countBy`, `debounce`, `defaults`, `defer`, `delay`, `difference`,
   * `filter`, `flatten`, `forEach`, `forIn`, `forOwn`, `functions`, `groupBy`,
   * `initial`, `intersection`, `invert`, `invoke`, `keys`, `map`, `max`, `memoize`,
   * `merge`, `min`, `object`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
   * `pick`, `pluck`, `push`, `range`, `reject`, `rest`, `reverse`, `shuffle`,
   * `slice`, `sort`, `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`,
   * `union`, `uniq`, `unshift`, `values`, `where`, `without`, `wrap`, and `zip`
   *
   * The non-chainable wrapper functions are:
   * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `has`, `identity`,
   * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`, `isEmpty`,
   * `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`, `isObject`,
   * `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`, `lastIndexOf`,
   * `mixin`, `noConflict`, `pop`, `random`, `reduce`, `reduceRight`, `result`,
   * `shift`, `size`, `some`, `sortedIndex`, `template`, `unescape`, and `uniqueId`
   *
   * The wrapper functions `first` and `last` return wrapped values when `n` is
   * passed, otherwise they return unwrapped values.
   *
   * @name _
   * @constructor
   * @category Chaining
   * @param {Mixed} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns a `lodash` instance.
   */
  function lodash(value) {
    // exit early if already wrapped, even if wrapped by a different `lodash` constructor
    if (value && typeof value == 'object' && value.__wrapped__) {
      return value;
    }
    // allow invoking `lodash` without the `new` operator
    if (!(this instanceof lodash)) {
      return new lodash(value);
    }
    this.__wrapped__ = value;
  }

  /**
   * By default, the template delimiters used by Lo-Dash are similar to those in
   * embedded Ruby (ERB). Change the following template settings to use alternative
   * delimiters.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  lodash.templateSettings = {

    /**
     * Used to detect `data` property values to be HTML-escaped.
     *
     * @memberOf _.templateSettings
     * @type RegExp
     */
    'escape': /<%-([\s\S]+?)%>/g,

    /**
     * Used to detect code to be evaluated.
     *
     * @memberOf _.templateSettings
     * @type RegExp
     */
    'evaluate': /<%([\s\S]+?)%>/g,

    /**
     * Used to detect `data` property values to inject.
     *
     * @memberOf _.templateSettings
     * @type RegExp
     */
    'interpolate': reInterpolate,

    /**
     * Used to reference the data object in the template text.
     *
     * @memberOf _.templateSettings
     * @type String
     */
    'variable': '',

    /**
     * Used to import variables into the compiled template.
     *
     * @memberOf _.templateSettings
     * @type Object
     */
    'imports': {

      /**
       * A reference to the `lodash` function.
       *
       * @memberOf _.templateSettings.imports
       * @type Function
       */
      '_': lodash
    }
  };

  /*--------------------------------------------------------------------------*/

  /**
   * The template used to create iterator functions.
   *
   * @private
   * @param {Obect} data The data object used to populate the text.
   * @returns {String} Returns the interpolated text.
   */
  var iteratorTemplate = function(obj) {
    
    var __p = 'var index, iterable = ' +
    (obj.firstArg ) +
    ', result = iterable;\nif (!iterable) return result;\n' +
    (obj.top ) +
    ';\n';
     if (obj.arrays) {
    __p += 'var length = iterable.length; index = -1;\nif (' +
    (obj.arrays ) +
    ') {\n  while (++index < length) {\n    ' +
    (obj.loop ) +
    '\n  }\n}\nelse {  ';
     } ;
    
     if (obj.isKeysFast && obj.useHas) {
    __p += '\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] ? nativeKeys(iterable) : [],\n      length = ownProps.length;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n    ' +
    (obj.loop ) +
    '\n  }  ';
     } else {
    __p += '\n  for (index in iterable) {';
        if (obj.useHas) {
    __p += '\n    if (';
          if (obj.useHas) {
    __p += 'hasOwnProperty.call(iterable, index)';
     }    ;
    __p += ') {    ';
     } ;
    __p += 
    (obj.loop ) +
    ';    ';
     if (obj.useHas) {
    __p += '\n    }';
     } ;
    __p += '\n  }  ';
     } ;
    
     if (obj.arrays) {
    __p += '\n}';
     } ;
    __p += 
    (obj.bottom ) +
    ';\nreturn result';
    
    
    return __p
  };

  /** Reusable iterator options for `assign` and `defaults` */
  var defaultsIteratorOptions = {
    'args': 'object, source, guard',
    'top':
      'var args = arguments,\n' +
      '    argsIndex = 0,\n' +
      "    argsLength = typeof guard == 'number' ? 2 : args.length;\n" +
      'while (++argsIndex < argsLength) {\n' +
      '  iterable = args[argsIndex];\n' +
      '  if (iterable && objectTypes[typeof iterable]) {',
    'loop': "if (typeof result[index] == 'undefined') result[index] = iterable[index]",
    'bottom': '  }\n}'
  };

  /** Reusable iterator options shared by `each`, `forIn`, and `forOwn` */
  var eachIteratorOptions = {
    'args': 'collection, callback, thisArg',
    'top': "callback = callback && typeof thisArg == 'undefined' ? callback : createCallback(callback, thisArg)",
    'arrays': "typeof length == 'number'",
    'loop': 'if (callback(iterable[index], index, collection) === false) return result'
  };

  /** Reusable iterator options for `forIn` and `forOwn` */
  var forOwnIteratorOptions = {
    'top': 'if (!objectTypes[typeof iterable]) return result;\n' + eachIteratorOptions.top,
    'arrays': false
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a function optimized to search large arrays for a given `value`,
   * starting at `fromIndex`, using strict equality for comparisons, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Number} [fromIndex=0] The index to search from.
   * @param {Number} [largeSize=30] The length at which an array is considered large.
   * @returns {Boolean} Returns `true`, if `value` is found, else `false`.
   */
  function cachedContains(array, fromIndex, largeSize) {
    fromIndex || (fromIndex = 0);

    var length = array.length,
        isLarge = (length - fromIndex) >= (largeSize || largeArraySize);

    if (isLarge) {
      var cache = {},
          index = fromIndex - 1;

      while (++index < length) {
        // manually coerce `value` to a string because `hasOwnProperty`, in some
        // older versions of Firefox, coerces objects incorrectly
        var key = array[index] + '';
        (hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = [])).push(array[index]);
      }
    }
    return function(value) {
      if (isLarge) {
        var key = value + '';
        return hasOwnProperty.call(cache, key) && indexOf(cache[key], value) > -1;
      }
      return indexOf(array, value, fromIndex) > -1;
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default `callback` when a given
   * `collection` is a string value.
   *
   * @private
   * @param {String} value The character to inspect.
   * @returns {Number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` values, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {Number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ai = a.index,
        bi = b.index;

    a = a.criteria;
    b = b.criteria;

    // ensure a stable sort in V8 and other engines
    // http://code.google.com/p/v8/issues/detail?id=90
    if (a !== b) {
      if (a > b || typeof a == 'undefined') {
        return 1;
      }
      if (a < b || typeof b == 'undefined') {
        return -1;
      }
    }
    return ai < bi ? -1 : 1;
  }

  /**
   * Creates a function that, when called, invokes `func` with the `this` binding
   * of `thisArg` and prepends any `partialArgs` to the arguments passed to the
   * bound function.
   *
   * @private
   * @param {Function|String} func The function to bind or the method name.
   * @param {Mixed} [thisArg] The `this` binding of `func`.
   * @param {Array} partialArgs An array of arguments to be partially applied.
   * @param {Object} [rightIndicator] Used to indicate partially applying arguments from the right.
   * @returns {Function} Returns the new bound function.
   */
  function createBound(func, thisArg, partialArgs, rightIndicator) {
    var isFunc = isFunction(func),
        isPartial = !partialArgs,
        key = thisArg;

    // juggle arguments
    if (isPartial) {
      partialArgs = thisArg;
    }
    if (!isFunc) {
      thisArg = func;
    }

    function bound() {
      // `Function#bind` spec
      // http://es5.github.com/#x15.3.4.5
      var args = arguments,
          thisBinding = isPartial ? this : thisArg;

      if (!isFunc) {
        func = thisArg[key];
      }
      if (partialArgs.length) {
        args = args.length
          ? (args = slice(args), rightIndicator ? args.concat(partialArgs) : partialArgs.concat(args))
          : partialArgs;
      }
      if (this instanceof bound) {
        // ensure `new bound` is an instance of `bound` and `func`
        noop.prototype = func.prototype;
        thisBinding = new noop;
        noop.prototype = null;

        // mimic the constructor's `return` behavior
        // http://es5.github.com/#x13.2.2
        var result = func.apply(thisBinding, args);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisBinding, args);
    }
    return bound;
  }

  /**
   * Produces a callback bound to an optional `thisArg`. If `func` is a property
   * name, the created callback will return the property value for a given element.
   * If `func` is an object, the created callback will return `true` for elements
   * that contain the equivalent object properties, otherwise it will return `false`.
   *
   * @private
   * @param {Mixed} [func=identity] The value to convert to a callback.
   * @param {Mixed} [thisArg] The `this` binding of the created callback.
   * @param {Number} [argCount=3] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   */
  function createCallback(func, thisArg, argCount) {
    if (func == null) {
      return identity;
    }
    var type = typeof func;
    if (type != 'function') {
      if (type != 'object') {
        return function(object) {
          return object[func];
        };
      }
      var props = keys(func);
      return function(object) {
        var length = props.length,
            result = false;
        while (length--) {
          if (!(result = isEqual(object[props[length]], func[props[length]], indicatorObject))) {
            break;
          }
        }
        return result;
      };
    }
    if (typeof thisArg != 'undefined') {
      if (argCount === 1) {
        return function(value) {
          return func.call(thisArg, value);
        };
      }
      if (argCount === 2) {
        return function(a, b) {
          return func.call(thisArg, a, b);
        };
      }
      if (argCount === 4) {
        return function(accumulator, value, index, object) {
          return func.call(thisArg, accumulator, value, index, object);
        };
      }
      return function(value, index, object) {
        return func.call(thisArg, value, index, object);
      };
    }
    return func;
  }

  /**
   * Creates compiled iteration functions.
   *
   * @private
   * @param {Object} [options1, options2, ...] The compile options object(s).
   *  arrays - A string of code to determine if the iterable is an array or array-like.
   *  useHas - A boolean to specify using `hasOwnProperty` checks in the object loop.
   *  args - A string of comma separated arguments the iteration function will accept.
   *  top - A string of code to execute before the iteration branches.
   *  loop - A string of code to execute in the object loop.
   *  bottom - A string of code to execute after the iteration branches.
   *
   * @returns {Function} Returns the compiled function.
   */
  function createIterator() {
    var data = {
      // support properties
      'isKeysFast': isKeysFast,

      // iterator options
      'arrays': 'isArray(iterable)',
      'bottom': '',
      'loop': '',
      'top': '',
      'useHas': true
    };

    // merge options into a template data object
    for (var object, index = 0; object = arguments[index]; index++) {
      for (var key in object) {
        data[key] = object[key];
      }
    }
    var args = data.args;
    data.firstArg = /^[^,]+/.exec(args)[0];

    // create the function factory
    var factory = Function(
        'createCallback, hasOwnProperty, isArguments, isArray, isString, ' +
        'objectTypes, nativeKeys',
      'return function(' + args + ') {\n' + iteratorTemplate(data) + '\n}'
    );
    // return the compiled function
    return factory(
      createCallback, hasOwnProperty, isArguments, isArray, isString,
      objectTypes, nativeKeys
    );
  }

  /**
   * A function compiled to iterate `arguments` objects, arrays, objects, and
   * strings consistenly across environments, executing the `callback` for each
   * element in the `collection`. The `callback` is bound to `thisArg` and invoked
   * with three arguments; (value, index|key, collection). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @private
   * @type Function
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array|Object|String} Returns `collection`.
   */
  var each = createIterator(eachIteratorOptions);

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Used by `escape` to convert characters to HTML entities.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeHtmlChar(match) {
    return htmlEscapes[match];
  }

  /**
   * Checks if `value` is a DOM node in IE < 9.
   *
   * @private
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a DOM node, else `false`.
   */
  function isNode(value) {
    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
    // methods that are `typeof` "string" and still can coerce nodes to strings
    return typeof value.toString != 'function' && typeof (value + '') == 'string';
  }

  /**
   * A no-operation function.
   *
   * @private
   */
  function noop() {
    // no operation performed
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used, instead of `Array#slice`, to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|String} collection The collection to slice.
   * @param {Number} start The start index.
   * @param {Number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /**
   * Used by `unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {String} match The matched character to unescape.
   * @returns {String} Returns the unescaped character.
   */
  function unescapeHtmlChar(match) {
    return htmlUnescapes[match];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is an `arguments` object, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })(1, 2, 3);
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return toString.call(value) == argsClass;
  }

  /**
   * Iterates over `object`'s own and inherited enumerable properties, executing
   * the `callback` for each property. The `callback` is bound to `thisArg` and
   * invoked with three arguments; (value, key, object). Callbacks may exit iteration
   * early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Dog(name) {
   *   this.name = name;
   * }
   *
   * Dog.prototype.bark = function() {
   *   alert('Woof, woof!');
   * };
   *
   * _.forIn(new Dog('Dagny'), function(value, key) {
   *   alert(key);
   * });
   * // => alerts 'name' and 'bark' (order is not guaranteed)
   */
  var forIn = createIterator(eachIteratorOptions, forOwnIteratorOptions, {
    'useHas': false
  });

  /**
   * Iterates over an object's own enumerable properties, executing the `callback`
   * for each property. The `callback` is bound to `thisArg` and invoked with three
   * arguments; (value, key, object). Callbacks may exit iteration early by explicitly
   * returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
   *   alert(key);
   * });
   * // => alerts '0', '1', and 'length' (order is not guaranteed)
   */
  var forOwn = createIterator(eachIteratorOptions, forOwnIteratorOptions);

  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    // `instanceof` may cause a memory leak in IE 7 if `value` is a host object
    // http://ajaxian.com/archives/working-aroung-the-instanceof-memory-leak
    return value instanceof Array || toString.call(value) == arrayClass;
  };

  /**
   * Creates an array composed of the own enumerable property names of `object`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names.
   * @example
   *
   * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
   * // => ['one', 'two', 'three'] (order is not guaranteed)
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (!isObject(object)) {
      return [];
    }
    return nativeKeys(object);
  };

  /**
   * A fallback implementation of `isPlainObject` that checks if a given `value`
   * is an object created by the `Object` constructor, assuming objects created
   * by the `Object` constructor have no inherited enumerable properties and that
   * there are no `Object.prototype` extensions.
   *
   * @private
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if `value` is a plain object, else `false`.
   */
  function shimIsPlainObject(value) {
    // avoid non-objects and false positives for `arguments` objects
    var result = false;
    if (!(value && typeof value == 'object') || isArguments(value)) {
      return result;
    }
    // check that the constructor is `Object` (i.e. `Object instanceof Object`)
    var ctor = value.constructor;
    if ((!isFunction(ctor)) || ctor instanceof ctor) {
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return result === false || hasOwnProperty.call(value, result);
    }
    return result;
  }

  /**
   * A fallback implementation of `Object.keys` that produces an array of the
   * given object's own enumerable property names.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names.
   */
  function shimKeys(object) {
    var result = [];
    forOwn(object, function(value, key) {
      result.push(key);
    });
    return result;
  }

  /**
   * Used to convert characters to HTML entities:
   *
   * Though the `>` character is escaped for symmetry, characters like `>` and `/`
   * don't require escaping in HTML and have no special meaning unless they're part
   * of a tag or an unquoted attribute value.
   * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
   */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to convert HTML entities to characters */
  var htmlUnescapes = invert(htmlEscapes);

  /*--------------------------------------------------------------------------*/

  /**
   * Assigns own enumerable properties of source object(s) to the destination
   * object. Subsequent sources will overwrite propery assignments of previous
   * sources. If a `callback` function is passed, it will be executed to produce
   * the assigned values. The `callback` is bound to `thisArg` and invoked with
   * two arguments; (objectValue, sourceValue).
   *
   * @static
   * @memberOf _
   * @type Function
   * @alias extend
   * @category Objects
   * @param {Object} object The destination object.
   * @param {Object} [source1, source2, ...] The source objects.
   * @param {Function} [callback] The function to customize assigning values.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * _.assign({ 'name': 'moe' }, { 'age': 40 });
   * // => { 'name': 'moe', 'age': 40 }
   *
   * var defaults = _.partialRight(_.assign, function(a, b) {
   *   return typeof a == 'undefined' ? b : a;
   * });
   *
   * var food = { 'name': 'apple' };
   * defaults(food, { 'name': 'banana', 'type': 'fruit' });
   * // => { 'name': 'apple', 'type': 'fruit' }
   */
  var assign = createIterator(defaultsIteratorOptions, {
    'top':
      defaultsIteratorOptions.top.replace(';',
        ';\n' +
        "if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {\n" +
        '  var callback = createCallback(args[--argsLength - 1], args[argsLength--], 2);\n' +
        "} else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {\n" +
        '  callback = args[--argsLength];\n' +
        '}'
      ),
    'loop': 'result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]'
  });

  /**
   * Creates a clone of `value`. If `deep` is `true`, nested objects will also
   * be cloned, otherwise they will be assigned by reference. If a `callback`
   * function is passed, it will be executed to produce the cloned values. If
   * `callback` returns `undefined`, cloning will be handled by the method instead.
   * The `callback` is bound to `thisArg` and invoked with one argument; (value).
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to clone.
   * @param {Boolean} [deep=false] A flag to indicate a deep clone.
   * @param {Function} [callback] The function to customize cloning values.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @param- {Array} [stackA=[]] Internally used to track traversed source objects.
   * @param- {Array} [stackB=[]] Internally used to associate clones with source counterparts.
   * @returns {Mixed} Returns the cloned `value`.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 }
   * ];
   *
   * var shallow = _.clone(stooges);
   * shallow[0] === stooges[0];
   * // => true
   *
   * var deep = _.clone(stooges, true);
   * deep[0] === stooges[0];
   * // => false
   *
   * _.mixin({
   *   'clone': _.partialRight(_.clone, function(value) {
   *     return _.isElement(value) ? value.cloneNode(false) : undefined;
   *   })
   * });
   *
   * var clone = _.clone(document.body);
   * clone.childNodes.length;
   * // => 0
   */
  function clone(value, deep, callback, thisArg, stackA, stackB) {
    var result = value;

    // allows working with "Collections" methods without using their `callback`
    // argument, `index|key`, for this method's `callback`
    if (typeof deep == 'function') {
      thisArg = callback;
      callback = deep;
      deep = false;
    }
    if (typeof callback == 'function') {
      callback = typeof thisArg == 'undefined' ? callback : createCallback(callback, thisArg, 1);
      result = callback(result);

      var done = typeof result != 'undefined';
      if (!done) {
        result = value;
      }
    }
    // inspect [[Class]]
    var isObj = isObject(result);
    if (isObj) {
      var className = toString.call(result);
      if (!cloneableClasses[className]) {
        return result;
      }
      var isArr = isArray(result);
    }
    // shallow clone
    if (!isObj || !deep) {
      return isObj && !done
        ? (isArr ? slice(result) : assign({}, result))
        : result;
    }
    var ctor = ctorByClass[className];
    switch (className) {
      case boolClass:
      case dateClass:
        return done ? result : new ctor(+result);

      case numberClass:
      case stringClass:
        return done ? result : new ctor(result);

      case regexpClass:
        return done ? result : ctor(result.source, reFlags.exec(result));
    }
    // check for circular references and return corresponding clone
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == value) {
        return stackB[length];
      }
    }
    // init cloned object
    if (!done) {
      result = isArr ? ctor(result.length) : {};

      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
    }
    // add the source value to the stack of traversed objects
    // and associate it with its clone
    stackA.push(value);
    stackB.push(result);

    // recursively populate clone (susceptible to call stack limits)
    (isArr ? forEach : forOwn)(done ? result : value, function(objValue, key) {
      result[key] = clone(objValue, deep, callback, undefined, stackA, stackB);
    });

    return result;
  }

  /**
   * Creates a deep clone of `value`. If a `callback` function is passed, it will
   * be executed to produce the cloned values. If `callback` returns the value it
   * was passed, cloning will be handled by the method instead. The `callback` is
   * bound to `thisArg` and invoked with one argument; (value).
   *
   * Note: This function is loosely based on the structured clone algorithm. Functions
   * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
   * objects created by constructors other than `Object` are cloned to plain `Object` objects.
   * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to deep clone.
   * @param {Function} [callback] The function to customize cloning values.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Mixed} Returns the deep cloned `value`.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 }
   * ];
   *
   * var deep = _.cloneDeep(stooges);
   * deep[0] === stooges[0];
   * // => false
   *
   * var view = {
   *   'label': 'docs',
   *   'node': element
   * };
   *
   * var clone = _.cloneDeep(view, function(value) {
   *   return _.isElement(value) ? value.cloneNode(true) : value;
   * });
   *
   * clone.node == view.node;
   * // => false
   */
  function cloneDeep(value, callback, thisArg) {
    return clone(value, true, callback, thisArg);
  }

  /**
   * Assigns own enumerable properties of source object(s) to the destination
   * object for all destination properties that resolve to `undefined`. Once a
   * property is set, additional defaults of the same property will be ignored.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The destination object.
   * @param {Object} [source1, source2, ...] The source objects.
   * @param- {Object} [guard] Internally used to allow working with `_.reduce`
   *  without using its callback's `key` and `object` arguments as sources.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * var food = { 'name': 'apple' };
   * _.defaults(food, { 'name': 'banana', 'type': 'fruit' });
   * // => { 'name': 'apple', 'type': 'fruit' }
   */
  var defaults = createIterator(defaultsIteratorOptions);

  /**
   * Creates a sorted array of all enumerable properties, own and inherited,
   * of `object` that have function values.
   *
   * @static
   * @memberOf _
   * @alias methods
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names that have function values.
   * @example
   *
   * _.functions(_);
   * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
   */
  function functions(object) {
    var result = [];
    forIn(object, function(value, key) {
      if (isFunction(value)) {
        result.push(key);
      }
    });
    return result.sort();
  }

  /**
   * Checks if the specified object `property` exists and is a direct property,
   * instead of an inherited property.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to check.
   * @param {String} property The property to check for.
   * @returns {Boolean} Returns `true` if key is a direct property, else `false`.
   * @example
   *
   * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
   * // => true
   */
  function has(object, property) {
    return object ? hasOwnProperty.call(object, property) : false;
  }

  /**
   * Creates an object composed of the inverted keys and values of the given `object`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to invert.
   * @returns {Object} Returns the created inverted object.
   * @example
   *
   *  _.invert({ 'first': 'moe', 'second': 'larry' });
   * // => { 'moe': 'first', 'larry': 'second' } (order is not guaranteed)
   */
  function invert(object) {
    var index = -1,
        props = keys(object),
        length = props.length,
        result = {};

    while (++index < length) {
      var key = props[index];
      result[object[key]] = key;
    }
    return result;
  }

  /**
   * Checks if `value` is a boolean value.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is a boolean value, else `false`.
   * @example
   *
   * _.isBoolean(null);
   * // => false
   */
  function isBoolean(value) {
    return value === true || value === false || toString.call(value) == boolClass;
  }

  /**
   * Checks if `value` is a date.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is a date, else `false`.
   * @example
   *
   * _.isDate(new Date);
   * // => true
   */
  function isDate(value) {
    return value instanceof Date || toString.call(value) == dateClass;
  }

  /**
   * Checks if `value` is a DOM element.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is a DOM element, else `false`.
   * @example
   *
   * _.isElement(document.body);
   * // => true
   */
  function isElement(value) {
    return value ? value.nodeType === 1 : false;
  }

  /**
   * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
   * length of `0` and objects with no own enumerable properties are considered
   * "empty".
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Array|Object|String} value The value to inspect.
   * @returns {Boolean} Returns `true`, if the `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({});
   * // => true
   *
   * _.isEmpty('');
   * // => true
   */
  function isEmpty(value) {
    var result = true;
    if (!value) {
      return result;
    }
    var className = toString.call(value),
        length = value.length;

    if ((className == arrayClass || className == stringClass ||
        className == argsClass) ||
        (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
      return !length;
    }
    forOwn(value, function() {
      return (result = false);
    });
    return result;
  }

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent to each other. If `callback` is passed, it will be executed to
   * compare values. If `callback` returns `undefined`, comparisons will be handled
   * by the method instead. The `callback` is bound to `thisArg` and invoked with
   * two arguments; (a, b).
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} a The value to compare.
   * @param {Mixed} b The other value to compare.
   * @param {Function} [callback] The function to customize comparing values.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @param- {Object} [stackA=[]] Internally used track traversed `a` objects.
   * @param- {Object} [stackB=[]] Internally used track traversed `b` objects.
   * @returns {Boolean} Returns `true`, if the values are equvalent, else `false`.
   * @example
   *
   * var moe = { 'name': 'moe', 'age': 40 };
   * var copy = { 'name': 'moe', 'age': 40 };
   *
   * moe == copy;
   * // => false
   *
   * _.isEqual(moe, copy);
   * // => true
   *
   * var words = ['hello', 'goodbye'];
   * var otherWords = ['hi', 'goodbye'];
   *
   * _.isEqual(words, otherWords, function(a, b) {
   *   var reGreet = /^(?:hello|hi)$/i,
   *       aGreet = _.isString(a) && reGreet.test(a),
   *       bGreet = _.isString(b) && reGreet.test(b);
   *
   *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
   * });
   * // => true
   */
  function isEqual(a, b, callback, thisArg, stackA, stackB) {
    // used to indicate that when comparing objects, `a` has at least the properties of `b`
    var whereIndicator = callback === indicatorObject;
    if (callback && !whereIndicator) {
      callback = typeof thisArg == 'undefined' ? callback : createCallback(callback, thisArg, 2);
      var result = callback(a, b);
      if (typeof result != 'undefined') {
        return !!result;
      }
    }
    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || (1 / a == 1 / b);
    }
    var type = typeof a,
        otherType = typeof b;

    // exit early for unlike primitive values
    if (a === a &&
        (!a || (type != 'function' && type != 'object')) &&
        (!b || (otherType != 'function' && otherType != 'object'))) {
      return false;
    }
    // exit early for `null` and `undefined`, avoiding ES3's Function#call behavior
    // http://es5.github.com/#x15.3.4.4
    if (a == null || b == null) {
      return a === b;
    }
    // compare [[Class]] names
    var className = toString.call(a),
        otherClass = toString.call(b);

    if (className == argsClass) {
      className = objectClass;
    }
    if (otherClass == argsClass) {
      otherClass = objectClass;
    }
    if (className != otherClass) {
      return false;
    }
    switch (className) {
      case boolClass:
      case dateClass:
        // coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0`, treating invalid dates coerced to `NaN` as not equal
        return +a == +b;

      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return a != +a
          ? b != +b
          // but treat `+0` vs. `-0` as not equal
          : (a == 0 ? (1 / a == 1 / b) : a == +b);

      case regexpClass:
      case stringClass:
        // coerce regexes to strings (http://es5.github.com/#x15.10.6.4)
        // treat string primitives and their corresponding object instances as equal
        return a == b + '';
    }
    var isArr = className == arrayClass;
    if (!isArr) {
      // unwrap any `lodash` wrapped values
      if (a.__wrapped__ || b.__wrapped__) {
        return isEqual(a.__wrapped__ || a, b.__wrapped__ || b, callback, thisArg, stackA, stackB);
      }
      // exit for functions and DOM nodes
      if (className != objectClass) {
        return false;
      }
      // in older versions of Opera, `arguments` objects have `Array` constructors
      var ctorA = a.constructor,
          ctorB = b.constructor;

      // non `Object` object instances with different constructors are not equal
      if (ctorA != ctorB && !(
            isFunction(ctorA) && ctorA instanceof ctorA &&
            isFunction(ctorB) && ctorB instanceof ctorB
          )) {
        return false;
      }
    }
    // assume cyclic structures are equal
    // the algorithm for detecting cyclic structures is adapted from ES 5.1
    // section 15.12.3, abstract operation `JO` (http://es5.github.com/#x15.12.3)
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == a) {
        return stackB[length] == b;
      }
    }
    var size = 0;
    result = true;

    // add `a` and `b` to the stack of traversed objects
    stackA.push(a);
    stackB.push(b);

    // recursively compare objects and arrays (susceptible to call stack limits)
    if (isArr) {
      length = a.length;
      size = b.length;

      // compare lengths to determine if a deep comparison is necessary
      result = size == a.length;
      if (!result && !whereIndicator) {
        return result;
      }
      // deep compare the contents, ignoring non-numeric properties
      while (size--) {
        var index = length,
            value = b[size];

        if (whereIndicator) {
          while (index--) {
            if ((result = isEqual(a[index], value, callback, thisArg, stackA, stackB))) {
              break;
            }
          }
        } else if (!(result = isEqual(a[size], value, callback, thisArg, stackA, stackB))) {
          break;
        }
      }
      return result;
    }
    // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
    // which, in this case, is more costly
    forIn(b, function(value, key, b) {
      if (hasOwnProperty.call(b, key)) {
        // count the number of properties.
        size++;
        // deep compare each property value.
        return (result = hasOwnProperty.call(a, key) && isEqual(a[key], value, callback, thisArg, stackA, stackB));
      }
    });

    if (result && !whereIndicator) {
      // ensure both objects have the same number of properties
      forIn(a, function(value, key, a) {
        if (hasOwnProperty.call(a, key)) {
          // `size` will be `-1` if `a` has more properties than `b`
          return (result = --size > -1);
        }
      });
    }
    return result;
  }

  /**
   * Checks if `value` is, or can be coerced to, a finite number.
   *
   * Note: This is not the same as native `isFinite`, which will return true for
   * booleans and empty strings. See http://es5.github.com/#x15.1.2.5.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is finite, else `false`.
   * @example
   *
   * _.isFinite(-101);
   * // => true
   *
   * _.isFinite('10');
   * // => true
   *
   * _.isFinite(true);
   * // => false
   *
   * _.isFinite('');
   * // => false
   *
   * _.isFinite(Infinity);
   * // => false
   */
  function isFinite(value) {
    return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
  }

  /**
   * Checks if `value` is a function.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   */
  function isFunction(value) {
    return typeof value == 'function';
  }
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return value instanceof Function || toString.call(value) == funcClass;
    };
  }

  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.com/#x8
    // and avoid a V8 bug
    // http://code.google.com/p/v8/issues/detail?id=2291
    return value ? objectTypes[typeof value] : false;
  }

  /**
   * Checks if `value` is `NaN`.
   *
   * Note: This is not the same as native `isNaN`, which will return `true` for
   * `undefined` and other values. See http://es5.github.com/#x15.1.2.4.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is `NaN`, else `false`.
   * @example
   *
   * _.isNaN(NaN);
   * // => true
   *
   * _.isNaN(new Number(NaN));
   * // => true
   *
   * isNaN(undefined);
   * // => true
   *
   * _.isNaN(undefined);
   * // => false
   */
  function isNaN(value) {
    // `NaN` as a primitive is the only value that is not equal to itself
    // (perform the [[Class]] check first to avoid errors with some host objects in IE)
    return isNumber(value) && value != +value
  }

  /**
   * Checks if `value` is `null`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is `null`, else `false`.
   * @example
   *
   * _.isNull(null);
   * // => true
   *
   * _.isNull(undefined);
   * // => false
   */
  function isNull(value) {
    return value === null;
  }

  /**
   * Checks if `value` is a number.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is a number, else `false`.
   * @example
   *
   * _.isNumber(8.4 * 5);
   * // => true
   */
  function isNumber(value) {
    return typeof value == 'number' || toString.call(value) == numberClass;
  }

  /**
   * Checks if a given `value` is an object created by the `Object` constructor.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if `value` is a plain object, else `false`.
   * @example
   *
   * function Stooge(name, age) {
   *   this.name = name;
   *   this.age = age;
   * }
   *
   * _.isPlainObject(new Stooge('moe', 40));
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'name': 'moe', 'age': 40 });
   * // => true
   */
  var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
    if (!(value && typeof value == 'object')) {
      return false;
    }
    var valueOf = value.valueOf,
        objProto = typeof valueOf == 'function' && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

    return objProto
      ? value == objProto || (getPrototypeOf(value) == objProto && !isArguments(value))
      : shimIsPlainObject(value);
  };

  /**
   * Checks if `value` is a regular expression.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is a regular expression, else `false`.
   * @example
   *
   * _.isRegExp(/moe/);
   * // => true
   */
  function isRegExp(value) {
    return value instanceof RegExp || toString.call(value) == regexpClass;
  }

  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('moe');
   * // => true
   */
  function isString(value) {
    return typeof value == 'string' || toString.call(value) == stringClass;
  }

  /**
   * Checks if `value` is `undefined`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true`, if the `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   */
  function isUndefined(value) {
    return typeof value == 'undefined';
  }

  /**
   * Recursively merges own enumerable properties of the source object(s), that
   * don't resolve to `undefined`, into the destination object. Subsequent sources
   * will overwrite propery assignments of previous sources. If a `callback` function
   * is passed, it will be executed to produce the merged values of the destination
   * and source properties. If `callback` returns `undefined`, merging will be
   * handled by the method instead. The `callback` is bound to `thisArg` and
   * invoked with two arguments; (objectValue, sourceValue).
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The destination object.
   * @param {Object} [source1, source2, ...] The source objects.
   * @param {Function} [callback] The function to customize merging properties.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @param- {Object} [deepIndicator] Internally used to indicate that `stackA`
   *  and `stackB` are arrays of traversed objects instead of source objects.
   * @param- {Array} [stackA=[]] Internally used to track traversed source objects.
   * @param- {Array} [stackB=[]] Internally used to associate values with their
   *  source counterparts.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * var names = {
   *   'stooges': [
   *     { 'name': 'moe' },
   *     { 'name': 'larry' }
   *   ]
   * };
   *
   * var ages = {
   *   'stooges': [
   *     { 'age': 40 },
   *     { 'age': 50 }
   *   ]
   * };
   *
   * _.merge(names, ages);
   * // => { 'stooges': [{ 'name': 'moe', 'age': 40 }, { 'name': 'larry', 'age': 50 }] }
   *
   * var food = {
   *   'fruits': ['apple'],
   *   'vegetables': ['beet']
   * };
   *
   * var otherFood = {
   *   'fruits': ['banana'],
   *   'vegetables': ['carrot']
   * };
   *
   * _.merge(food, otherFood, function(a, b) {
   *   return _.isArray(a) ? a.concat(b) : undefined;
   * });
   * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
   */
  function merge(object, source, deepIndicator) {
    var args = arguments,
        index = 0,
        length = 2;

    if (!isObject(object)) {
      return object;
    }
    if (deepIndicator === indicatorObject) {
      var callback = args[3],
          stackA = args[4],
          stackB = args[5];
    } else {
      stackA = [];
      stackB = [];

      // allows working with `_.reduce` and `_.reduceRight` without
      // using their `callback` arguments, `index|key` and `collection`
      if (typeof deepIndicator != 'number') {
        length = args.length;
      }
      if (length > 3 && typeof args[length - 2] == 'function') {
        callback = createCallback(args[--length - 1], args[length--], 2);
      } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
      }
    }
    while (++index < length) {
      (isArray(args[index]) ? forEach : forOwn)(args[index], function(source, key) {
        var found,
            isArr,
            result = source,
            value = object[key];

        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
          // avoid merging previously merged cyclic sources
          var stackLength = stackA.length;
          while (stackLength--) {
            if ((found = stackA[stackLength] == source)) {
              value = stackB[stackLength];
              break;
            }
          }
          if (!found) {
            value = isArr
              ? (isArray(value) ? value : [])
              : (isPlainObject(value) ? value : {});

            if (callback) {
              result = callback(value, source);
              if (typeof result != 'undefined') {
                value = result;
              }
            }
            // add `source` and associated `value` to the stack of traversed objects
            stackA.push(source);
            stackB.push(value);

            // recursively merge objects and arrays (susceptible to call stack limits)
            if (!callback) {
              value = merge(value, source, indicatorObject, callback, stackA, stackB);
            }
          }
        }
        else {
          if (callback) {
            result = callback(value, source);
            if (typeof result == 'undefined') {
              result = source;
            }
          }
          if (typeof result != 'undefined') {
            value = result;
          }
        }
        object[key] = value;
      });
    }
    return object;
  }

  /**
   * Creates a shallow clone of `object` excluding the specified properties.
   * Property names may be specified as individual arguments or as arrays of
   * property names. If a `callback` function is passed, it will be executed
   * for each property in the `object`, omitting the properties `callback`
   * returns truthy for. The `callback` is bound to `thisArg` and invoked
   * with three arguments; (value, key, object).
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The source object.
   * @param {Function|String} callback|[prop1, prop2, ...] The properties to omit
   *  or the function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns an object without the omitted properties.
   * @example
   *
   * _.omit({ 'name': 'moe', 'age': 40 }, 'age');
   * // => { 'name': 'moe' }
   *
   * _.omit({ 'name': 'moe', 'age': 40 }, function(value) {
   *   return typeof value == 'number';
   * });
   * // => { 'name': 'moe' }
   */
  function omit(object, callback, thisArg) {
    var isFunc = typeof callback == 'function',
        result = {};

    if (isFunc) {
      callback = createCallback(callback, thisArg);
    } else {
      var props = concat.apply(arrayRef, arguments);
    }
    forIn(object, function(value, key, object) {
      if (isFunc
            ? !callback(value, key, object)
            : indexOf(props, key, 1) < 0
          ) {
        result[key] = value;
      }
    });
    return result;
  }

  /**
   * Creates a two dimensional array of the given object's key-value pairs,
   * i.e. `[[key1, value1], [key2, value2]]`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns new array of key-value pairs.
   * @example
   *
   * _.pairs({ 'moe': 30, 'larry': 40 });
   * // => [['moe', 30], ['larry', 40]] (order is not guaranteed)
   */
  function pairs(object) {
    var index = -1,
        props = keys(object),
        length = props.length,
        result = Array(length);

    while (++index < length) {
      var key = props[index];
      result[index] = [key, object[key]];
    }
    return result;
  }

  /**
   * Creates a shallow clone of `object` composed of the specified properties.
   * Property names may be specified as individual arguments or as arrays of property
   * names. If `callback` is passed, it will be executed for each property in the
   * `object`, picking the properties `callback` returns truthy for. The `callback`
   * is bound to `thisArg` and invoked with three arguments; (value, key, object).
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The source object.
   * @param {Array|Function|String} callback|[prop1, prop2, ...] The function called
   *  per iteration or properties to pick, either as individual arguments or arrays.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns an object composed of the picked properties.
   * @example
   *
   * _.pick({ 'name': 'moe', '_userid': 'moe1' }, 'name');
   * // => { 'name': 'moe' }
   *
   * _.pick({ 'name': 'moe', '_userid': 'moe1' }, function(value, key) {
   *   return key.charAt(0) != '_';
   * });
   * // => { 'name': 'moe' }
   */
  function pick(object, callback, thisArg) {
    var result = {};
    if (typeof callback != 'function') {
      var index = 0,
          props = concat.apply(arrayRef, arguments),
          length = isObject(object) ? props.length : 0;

      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
    } else {
      callback = createCallback(callback, thisArg);
      forIn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result[key] = value;
        }
      });
    }
    return result;
  }

  /**
   * Creates an array composed of the own enumerable property values of `object`.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property values.
   * @example
   *
   * _.values({ 'one': 1, 'two': 2, 'three': 3 });
   * // => [1, 2, 3]
   */
  function values(object) {
    var index = -1,
        props = keys(object),
        length = props.length,
        result = Array(length);

    while (++index < length) {
      result[index] = object[props[index]];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates an array of elements from the specified indexes, or keys, of the
   * `collection`. Indexes may be specified as individual arguments or as arrays
   * of indexes.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Array|Number|String} [index1, index2, ...] The indexes of
   *  `collection` to retrieve, either as individual arguments or arrays.
   * @returns {Array} Returns a new array of elements corresponding to the
   *  provided indexes.
   * @example
   *
   * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
   * // => ['a', 'c', 'e']
   *
   * _.at(['moe', 'larry', 'curly'], 0, 2);
   * // => ['moe', 'curly']
   */
  function at(collection) {
    var index = -1,
        props = concat.apply(arrayRef, slice(arguments, 1)),
        length = props.length,
        result = Array(length);

    while(++index < length) {
      result[index] = collection[props[index]];
    }
    return result;
  }

  /**
   * Checks if a given `target` element is present in a `collection` using strict
   * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
   * as the offset from the end of the collection.
   *
   * @static
   * @memberOf _
   * @alias include
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Mixed} target The value to check for.
   * @param {Number} [fromIndex=0] The index to search from.
   * @returns {Boolean} Returns `true` if the `target` element is found, else `false`.
   * @example
   *
   * _.contains([1, 2, 3], 1);
   * // => true
   *
   * _.contains([1, 2, 3], 1, 2);
   * // => false
   *
   * _.contains({ 'name': 'moe', 'age': 40 }, 'moe');
   * // => true
   *
   * _.contains('curly', 'ur');
   * // => true
   */
  function contains(collection, target, fromIndex) {
    var index = -1,
        length = collection ? collection.length : 0,
        result = false;

    fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
    if (typeof length == 'number') {
      result = (isString(collection)
        ? collection.indexOf(target, fromIndex)
        : indexOf(collection, target, fromIndex)
      ) > -1;
    } else {
      each(collection, function(value) {
        if (++index >= fromIndex) {
          return !(result = value === target);
        }
      });
    }
    return result;
  }

  /**
   * Creates an object composed of keys returned from running each element of the
   * `collection` through the given `callback`. The corresponding value of each key
   * is the number of times the key was returned by the `callback`. The `callback`
   * is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns the composed aggregate object.
   * @example
   *
   * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
   * // => { '4': 1, '6': 2 }
   *
   * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
   * // => { '4': 1, '6': 2 }
   *
   * _.countBy(['one', 'two', 'three'], 'length');
   * // => { '3': 2, '5': 1 }
   */
  function countBy(collection, callback, thisArg) {
    var result = {};
    callback = createCallback(callback, thisArg);

    forEach(collection, function(value, key, collection) {
      key = callback(value, key, collection) + '';
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });
    return result;
  }

  /**
   * Checks if the `callback` returns a truthy value for **all** elements of a
   * `collection`. The `callback` is bound to `thisArg` and invoked with three
   * arguments; (value, index|key, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias all
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Boolean} Returns `true` if all elements pass the callback check,
   *  else `false`.
   * @example
   *
   * _.every([true, 1, null, 'yes'], Boolean);
   * // => false
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.every(stooges, 'age');
   * // => true
   *
   * // using "_.where" callback shorthand
   * _.every(stooges, { 'age': 50 });
   * // => false
   */
  function every(collection, callback, thisArg) {
    var result = true;
    callback = createCallback(callback, thisArg);

    if (isArray(collection)) {
      var index = -1,
          length = collection.length;

      while (++index < length) {
        if (!(result = !!callback(collection[index], index, collection))) {
          break;
        }
      }
    } else {
      each(collection, function(value, index, collection) {
        return (result = !!callback(value, index, collection));
      });
    }
    return result;
  }

  /**
   * Examines each element in a `collection`, returning an array of all elements
   * the `callback` returns truthy for. The `callback` is bound to `thisArg` and
   * invoked with three arguments; (value, index|key, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias select
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a new array of elements that passed the callback check.
   * @example
   *
   * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => [2, 4, 6]
   *
   * var food = [
   *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
   *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.filter(food, 'organic');
   * // => [{ 'name': 'carrot', 'organic': true, 'type': 'vegetable' }]
   *
   * // using "_.where" callback shorthand
   * _.filter(food, { 'type': 'fruit' });
   * // => [{ 'name': 'apple', 'organic': false, 'type': 'fruit' }]
   */
  function filter(collection, callback, thisArg) {
    var result = [];
    callback = createCallback(callback, thisArg);

    if (isArray(collection)) {
      var index = -1,
          length = collection.length;

      while (++index < length) {
        var value = collection[index];
        if (callback(value, index, collection)) {
          result.push(value);
        }
      }
    } else {
      each(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result.push(value);
        }
      });
    }
    return result;
  }

  /**
   * Examines each element in a `collection`, returning the first that the `callback`
   * returns truthy for. The `callback` is bound to `thisArg` and invoked with three
   * arguments; (value, index|key, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias detect
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Mixed} Returns the element that passed the callback check,
   *  else `undefined`.
   * @example
   *
   * var even = _.find([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => 2
   *
   * var food = [
   *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
   *   { 'name': 'banana', 'organic': true,  'type': 'fruit' },
   *   { 'name': 'beet',   'organic': false, 'type': 'vegetable' },
   *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
   * ];
   *
   * // using "_.where" callback shorthand
   * var veggie = _.find(food, { 'type': 'vegetable' });
   * // => { 'name': 'beet', 'organic': false, 'type': 'vegetable' }
   *
   * // using "_.pluck" callback shorthand
   * var healthy = _.find(food, 'organic');
   * // => { 'name': 'banana', 'organic': true, 'type': 'fruit' }
   */
  function find(collection, callback, thisArg) {
    var result;
    callback = createCallback(callback, thisArg);

    forEach(collection, function(value, index, collection) {
      if (callback(value, index, collection)) {
        result = value;
        return false;
      }
    });
    return result;
  }

  /**
   * Iterates over a `collection`, executing the `callback` for each element in
   * the `collection`. The `callback` is bound to `thisArg` and invoked with three
   * arguments; (value, index|key, collection). Callbacks may exit iteration early
   * by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array|Object|String} Returns `collection`.
   * @example
   *
   * _([1, 2, 3]).forEach(alert).join(',');
   * // => alerts each number and returns '1,2,3'
   *
   * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, alert);
   * // => alerts each number value (order is not guaranteed)
   */
  function forEach(collection, callback, thisArg) {
    if (callback && typeof thisArg == 'undefined' && isArray(collection)) {
      var index = -1,
          length = collection.length;

      while (++index < length) {
        if (callback(collection[index], index, collection) === false) {
          break;
        }
      }
    } else {
      each(collection, callback, thisArg);
    }
    return collection;
  }

  /**
   * Creates an object composed of keys returned from running each element of the
   * `collection` through the `callback`. The corresponding value of each key is
   * an array of elements passed to `callback` that returned the key. The `callback`
   * is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns the composed aggregate object.
   * @example
   *
   * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
   * // => { '4': [4.2], '6': [6.1, 6.4] }
   *
   * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
   * // => { '4': [4.2], '6': [6.1, 6.4] }
   *
   * // using "_.pluck" callback shorthand
   * _.groupBy(['one', 'two', 'three'], 'length');
   * // => { '3': ['one', 'two'], '5': ['three'] }
   */
  function groupBy(collection, callback, thisArg) {
    var result = {};
    callback = createCallback(callback, thisArg);

    forEach(collection, function(value, key, collection) {
      key = callback(value, key, collection) + '';
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    });
    return result;
  }

  /**
   * Invokes the method named by `methodName` on each element in the `collection`,
   * returning an array of the results of each invoked method. Additional arguments
   * will be passed to each invoked method. If `methodName` is a function, it will
   * be invoked for, and `this` bound to, each element in the `collection`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|String} methodName The name of the method to invoke or
   *  the function invoked per iteration.
   * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the method with.
   * @returns {Array} Returns a new array of the results of each invoked method.
   * @example
   *
   * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
   * // => [[1, 5, 7], [1, 2, 3]]
   *
   * _.invoke([123, 456], String.prototype.split, '');
   * // => [['1', '2', '3'], ['4', '5', '6']]
   */
  function invoke(collection, methodName) {
    var args = slice(arguments, 2),
        index = -1,
        isFunc = typeof methodName == 'function',
        length = collection ? collection.length : 0,
        result = Array(typeof length == 'number' ? length : 0);

    forEach(collection, function(value) {
      result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
    });
    return result;
  }

  /**
   * Creates an array of values by running each element in the `collection`
   * through the `callback`. The `callback` is bound to `thisArg` and invoked with
   * three arguments; (value, index|key, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias collect
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a new array of the results of each `callback` execution.
   * @example
   *
   * _.map([1, 2, 3], function(num) { return num * 3; });
   * // => [3, 6, 9]
   *
   * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
   * // => [3, 6, 9] (order is not guaranteed)
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.map(stooges, 'name');
   * // => ['moe', 'larry']
   */
  function map(collection, callback, thisArg) {
    var index = -1,
        length = collection ? collection.length : 0,
        result = Array(typeof length == 'number' ? length : 0);

    callback = createCallback(callback, thisArg);
    if (isArray(collection)) {
      while (++index < length) {
        result[index] = callback(collection[index], index, collection);
      }
    } else {
      each(collection, function(value, key, collection) {
        result[++index] = callback(value, key, collection);
      });
    }
    return result;
  }

  /**
   * Retrieves the maximum value of an `array`. If `callback` is passed,
   * it will be executed for each value in the `array` to generate the
   * criterion by which the value is ranked. The `callback` is bound to
   * `thisArg` and invoked with three arguments; (value, index, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Mixed} Returns the maximum value.
   * @example
   *
   * _.max([4, 2, 8, 6]);
   * // => 8
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 }
   * ];
   *
   * _.max(stooges, function(stooge) { return stooge.age; });
   * // => { 'name': 'larry', 'age': 50 };
   *
   * // using "_.pluck" callback shorthand
   * _.max(stooges, 'age');
   * // => { 'name': 'larry', 'age': 50 };
   */
  function max(collection, callback, thisArg) {
    var computed = -Infinity,
        result = computed;

    if (!callback && isArray(collection)) {
      var index = -1,
          length = collection.length;

      while (++index < length) {
        var value = collection[index];
        if (value > result) {
          result = value;
        }
      }
    } else {
      callback = !callback && isString(collection)
        ? charAtCallback
        : createCallback(callback, thisArg);

      each(collection, function(value, index, collection) {
        var current = callback(value, index, collection);
        if (current > computed) {
          computed = current;
          result = value;
        }
      });
    }
    return result;
  }

  /**
   * Retrieves the minimum value of an `array`. If `callback` is passed,
   * it will be executed for each value in the `array` to generate the
   * criterion by which the value is ranked. The `callback` is bound to `thisArg`
   * and invoked with three arguments; (value, index, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Mixed} Returns the minimum value.
   * @example
   *
   * _.min([4, 2, 8, 6]);
   * // => 2
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 }
   * ];
   *
   * _.min(stooges, function(stooge) { return stooge.age; });
   * // => { 'name': 'moe', 'age': 40 };
   *
   * // using "_.pluck" callback shorthand
   * _.min(stooges, 'age');
   * // => { 'name': 'moe', 'age': 40 };
   */
  function min(collection, callback, thisArg) {
    var computed = Infinity,
        result = computed;

    if (!callback && isArray(collection)) {
      var index = -1,
          length = collection.length;

      while (++index < length) {
        var value = collection[index];
        if (value < result) {
          result = value;
        }
      }
    } else {
      callback = !callback && isString(collection)
        ? charAtCallback
        : createCallback(callback, thisArg);

      each(collection, function(value, index, collection) {
        var current = callback(value, index, collection);
        if (current < computed) {
          computed = current;
          result = value;
        }
      });
    }
    return result;
  }

  /**
   * Retrieves the value of a specified property from all elements in the `collection`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {String} property The property to pluck.
   * @returns {Array} Returns a new array of property values.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 }
   * ];
   *
   * _.pluck(stooges, 'name');
   * // => ['moe', 'larry']
   */
  var pluck = map;

  /**
   * Reduces a `collection` to a value that is the accumulated result of running
   * each element in the `collection` through the `callback`, where each successive
   * `callback` execution consumes the return value of the previous execution.
   * If `accumulator` is not passed, the first element of the `collection` will be
   * used as the initial `accumulator` value. The `callback` is bound to `thisArg`
   * and invoked with four arguments; (accumulator, value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @alias foldl, inject
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [accumulator] Initial value of the accumulator.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Mixed} Returns the accumulated value.
   * @example
   *
   * var sum = _.reduce([1, 2, 3], function(sum, num) {
   *   return sum + num;
   * });
   * // => 6
   *
   * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
   *   result[key] = num * 3;
   *   return result;
   * }, {});
   * // => { 'a': 3, 'b': 6, 'c': 9 }
   */
  function reduce(collection, callback, accumulator, thisArg) {
    var noaccum = arguments.length < 3;
    callback = createCallback(callback, thisArg, 4);

    if (isArray(collection)) {
      var index = -1,
          length = collection.length;

      if (noaccum) {
        accumulator = collection[++index];
      }
      while (++index < length) {
        accumulator = callback(accumulator, collection[index], index, collection);
      }
    } else {
      each(collection, function(value, index, collection) {
        accumulator = noaccum
          ? (noaccum = false, value)
          : callback(accumulator, value, index, collection)
      });
    }
    return accumulator;
  }

  /**
   * This method is similar to `_.reduce`, except that it iterates over a
   * `collection` from right to left.
   *
   * @static
   * @memberOf _
   * @alias foldr
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [accumulator] Initial value of the accumulator.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Mixed} Returns the accumulated value.
   * @example
   *
   * var list = [[0, 1], [2, 3], [4, 5]];
   * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
   * // => [4, 5, 2, 3, 0, 1]
   */
  function reduceRight(collection, callback, accumulator, thisArg) {
    var iterable = collection,
        length = collection ? collection.length : 0,
        noaccum = arguments.length < 3;

    if (typeof length != 'number') {
      var props = keys(collection);
      length = props.length;
    }
    callback = createCallback(callback, thisArg, 4);
    forEach(collection, function(value, index, collection) {
      index = props ? props[--length] : --length;
      accumulator = noaccum
        ? (noaccum = false, iterable[index])
        : callback(accumulator, iterable[index], index, collection);
    });
    return accumulator;
  }

  /**
   * The opposite of `_.filter`, this method returns the elements of a
   * `collection` that `callback` does **not** return truthy for.
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a new array of elements that did **not** pass the
   *  callback check.
   * @example
   *
   * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
   * // => [1, 3, 5]
   *
   * var food = [
   *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
   *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.reject(food, 'organic');
   * // => [{ 'name': 'apple', 'organic': false, 'type': 'fruit' }]
   *
   * // using "_.where" callback shorthand
   * _.reject(food, { 'type': 'fruit' });
   * // => [{ 'name': 'carrot', 'organic': true, 'type': 'vegetable' }]
   */
  function reject(collection, callback, thisArg) {
    callback = createCallback(callback, thisArg);
    return filter(collection, function(value, index, collection) {
      return !callback(value, index, collection);
    });
  }

  /**
   * Creates an array of shuffled `array` values, using a version of the
   * Fisher-Yates shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to shuffle.
   * @returns {Array} Returns a new shuffled collection.
   * @example
   *
   * _.shuffle([1, 2, 3, 4, 5, 6]);
   * // => [4, 1, 6, 3, 5, 2]
   */
  function shuffle(collection) {
    var index = -1,
        length = collection ? collection.length : 0,
        result = Array(typeof length == 'number' ? length : 0);

    forEach(collection, function(value) {
      var rand = floor(nativeRandom() * (++index + 1));
      result[index] = result[rand];
      result[rand] = value;
    });
    return result;
  }

  /**
   * Gets the size of the `collection` by returning `collection.length` for arrays
   * and array-like objects or the number of own enumerable properties for objects.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to inspect.
   * @returns {Number} Returns `collection.length` or number of own enumerable properties.
   * @example
   *
   * _.size([1, 2]);
   * // => 2
   *
   * _.size({ 'one': 1, 'two': 2, 'three': 3 });
   * // => 3
   *
   * _.size('curly');
   * // => 5
   */
  function size(collection) {
    var length = collection ? collection.length : 0;
    return typeof length == 'number' ? length : keys(collection).length;
  }

  /**
   * Checks if the `callback` returns a truthy value for **any** element of a
   * `collection`. The function returns as soon as it finds passing value, and
   * does not iterate over the entire `collection`. The `callback` is bound to
   * `thisArg` and invoked with three arguments; (value, index|key, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias any
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Boolean} Returns `true` if any element passes the callback check,
   *  else `false`.
   * @example
   *
   * _.some([null, 0, 'yes', false], Boolean);
   * // => true
   *
   * var food = [
   *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
   *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.some(food, 'organic');
   * // => true
   *
   * // using "_.where" callback shorthand
   * _.some(food, { 'type': 'meat' });
   * // => false
   */
  function some(collection, callback, thisArg) {
    var result;
    callback = createCallback(callback, thisArg);

    if (isArray(collection)) {
      var index = -1,
          length = collection.length;

      while (++index < length) {
        if ((result = callback(collection[index], index, collection))) {
          break;
        }
      }
    } else {
      each(collection, function(value, index, collection) {
        return !(result = callback(value, index, collection));
      });
    }
    return !!result;
  }

  /**
   * Creates an array of elements, sorted in ascending order by the results of
   * running each element in the `collection` through the `callback`. This method
   * performs a stable sort, that is, it will preserve the original sort order of
   * equal elements. The `callback` is bound to `thisArg` and invoked with three
   * arguments; (value, index|key, collection).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a new array of sorted elements.
   * @example
   *
   * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
   * // => [3, 1, 2]
   *
   * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
   * // => [3, 1, 2]
   *
   * // using "_.pluck" callback shorthand
   * _.sortBy(['banana', 'strawberry', 'apple'], 'length');
   * // => ['apple', 'banana', 'strawberry']
   */
  function sortBy(collection, callback, thisArg) {
    var index = -1,
        length = collection ? collection.length : 0,
        result = Array(typeof length == 'number' ? length : 0);

    callback = createCallback(callback, thisArg);
    forEach(collection, function(value, key, collection) {
      result[++index] = {
        'criteria': callback(value, key, collection),
        'index': index,
        'value': value
      };
    });

    length = result.length;
    result.sort(compareAscending);
    while (length--) {
      result[length] = result[length].value;
    }
    return result;
  }

  /**
   * Converts the `collection` to an array.
   *
   * @static
   * @memberOf _
   * @category Collections
   * @param {Array|Object|String} collection The collection to convert.
   * @returns {Array} Returns the new converted array.
   * @example
   *
   * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
   * // => [2, 3, 4]
   */
  function toArray(collection) {
    if (collection && typeof collection.length == 'number') {
      return  slice(collection);
    }
    return values(collection);
  }

  /**
   * Examines each element in a `collection`, returning an array of all elements
   * that have the given `properties`. When checking `properties`, this method
   * performs a deep comparison between values to determine if they are equivalent
   * to each other.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Object} properties The object of property values to filter by.
   * @returns {Array} Returns a new array of elements that have the given `properties`.
   * @example
   *
   * var stooges = [
   *   { 'name': 'moe', 'age': 40 },
   *   { 'name': 'larry', 'age': 50 }
   * ];
   *
   * _.where(stooges, { 'age': 40 });
   * // => [{ 'name': 'moe', 'age': 40 }]
   */
  var where = filter;

  /*--------------------------------------------------------------------------*/

  /**
   * Creates an array with all falsey values of `array` removed. The values
   * `false`, `null`, `0`, `""`, `undefined` and `NaN` are all falsey.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to compact.
   * @returns {Array} Returns a new filtered array.
   * @example
   *
   * _.compact([0, 1, false, 2, '', 3]);
   * // => [1, 2, 3]
   */
  function compact(array) {
    var index = -1,
        length = array ? array.length : 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Creates an array of `array` elements not present in the other arrays
   * using strict equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to process.
   * @param {Array} [array1, array2, ...] Arrays to check.
   * @returns {Array} Returns a new array of `array` elements not present in the
   *  other arrays.
   * @example
   *
   * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
   * // => [1, 3, 4]
   */
  function difference(array) {
    var index = -1,
        length = array ? array.length : 0,
        flattened = concat.apply(arrayRef, arguments),
        contains = cachedContains(flattened, length),
        result = [];

    while (++index < length) {
      var value = array[index];
      if (!contains(value)) {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Gets the first element of the `array`. If a number `n` is passed, the first
   * `n` elements of the `array` are returned. If a `callback` function is passed,
   * the first elements the `callback` returns truthy for are returned. The `callback`
   * is bound to `thisArg` and invoked with three arguments; (value, index, array).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias head, take
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Function|Object|Number|String} [callback|n] The function called
   *  per element or the number of elements to return. If a property name or
   *  object is passed, it will be used to create a "_.pluck" or "_.where"
   *  style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Mixed} Returns the first element(s) of `array`.
   * @example
   *
   * _.first([1, 2, 3]);
   * // => 1
   *
   * _.first([1, 2, 3], 2);
   * // => [1, 2]
   *
   * _.first([1, 2, 3], function(num) {
   *   return num < 3;
   * });
   * // => [1, 2]
   *
   * var food = [
   *   { 'name': 'banana', 'organic': true },
   *   { 'name': 'beet',   'organic': false },
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.first(food, 'organic');
   * // => [{ 'name': 'banana', 'organic': true }]
   *
   * var food = [
   *   { 'name': 'apple',  'type': 'fruit' },
   *   { 'name': 'banana', 'type': 'fruit' },
   *   { 'name': 'beet',   'type': 'vegetable' }
   * ];
   *
   * // using "_.where" callback shorthand
   * _.first(food, { 'type': 'fruit' });
   * // => [{ 'name': 'apple', 'type': 'fruit' }, { 'name': 'banana', 'type': 'fruit' }]
   */
  function first(array, callback, thisArg) {
    if (array) {
      var n = 0,
          length = array.length;

      if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = createCallback(callback, thisArg);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array[0];
        }
      }
      return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }
  }

  /**
   * Flattens a nested array (the nesting can be to any depth). If `shallow` is
   * truthy, `array` will only be flattened a single level.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to compact.
   * @param {Boolean} shallow A flag to indicate only flattening a single level.
   * @returns {Array} Returns a new flattened array.
   * @example
   *
   * _.flatten([1, [2], [3, [[4]]]]);
   * // => [1, 2, 3, 4];
   *
   * _.flatten([1, [2], [3, [[4]]]], true);
   * // => [1, 2, 3, [[4]]];
   */
  function flatten(array, shallow) {
    var index = -1,
        length = array ? array.length : 0,
        result = [];

    while (++index < length) {
      var value = array[index];

      // recursively flatten arrays (susceptible to call stack limits)
      if (isArray(value)) {
        push.apply(result, shallow ? value : flatten(value));
      } else {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Gets the index at which the first occurrence of `value` is found using
   * strict equality for comparisons, i.e. `===`. If the `array` is already
   * sorted, passing `true` for `fromIndex` will run a faster binary search.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Boolean|Number} [fromIndex=0] The index to search from or `true` to
   *  perform a binary search on a sorted `array`.
   * @returns {Number} Returns the index of the matched value or `-1`.
   * @example
   *
   * _.indexOf([1, 2, 3, 1, 2, 3], 2);
   * // => 1
   *
   * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
   * // => 4
   *
   * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
   * // => 2
   */
  function indexOf(array, value, fromIndex) {
    var index = -1,
        length = array ? array.length : 0;

    if (typeof fromIndex == 'number') {
      index = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0) - 1;
    } else if (fromIndex) {
      index = sortedIndex(array, value);
      return array[index] === value ? index : -1;
    }
    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Gets all but the last element of `array`. If a number `n` is passed, the
   * last `n` elements are excluded from the result. If a `callback` function
   * is passed, the last elements the `callback` returns truthy for are excluded
   * from the result. The `callback` is bound to `thisArg` and invoked with three
   * arguments; (value, index, array).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Function|Object|Number|String} [callback|n=1] The function called
   *  per element or the number of elements to exclude. If a property name or
   *  object is passed, it will be used to create a "_.pluck" or "_.where"
   *  style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a slice of `array`.
   * @example
   *
   * _.initial([1, 2, 3]);
   * // => [1, 2]
   *
   * _.initial([1, 2, 3], 2);
   * // => [1]
   *
   * _.initial([1, 2, 3], function(num) {
   *   return num > 1;
   * });
   * // => [1]
   *
   * var food = [
   *   { 'name': 'beet',   'organic': false },
   *   { 'name': 'carrot', 'organic': true }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.initial(food, 'organic');
   * // => [{ 'name': 'beet',   'organic': false }]
   *
   * var food = [
   *   { 'name': 'banana', 'type': 'fruit' },
   *   { 'name': 'beet',   'type': 'vegetable' },
   *   { 'name': 'carrot', 'type': 'vegetable' }
   * ];
   *
   * // using "_.where" callback shorthand
   * _.initial(food, { 'type': 'vegetable' });
   * // => [{ 'name': 'banana', 'type': 'fruit' }]
   */
  function initial(array, callback, thisArg) {
    if (!array) {
      return [];
    }
    var n = 0,
        length = array.length;

    if (typeof callback != 'number' && callback != null) {
      var index = length;
      callback = createCallback(callback, thisArg);
      while (index-- && callback(array[index], index, array)) {
        n++;
      }
    } else {
      n = (callback == null || thisArg) ? 1 : callback || n;
    }
    return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
  }

  /**
   * Computes the intersection of all the passed-in arrays using strict equality
   * for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} [array1, array2, ...] Arrays to process.
   * @returns {Array} Returns a new array of unique elements that are present
   *  in **all** of the arrays.
   * @example
   *
   * _.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
   * // => [1, 2]
   */
  function intersection(array) {
    var args = arguments,
        argsLength = args.length,
        cache = { '0': {} },
        index = -1,
        length = array ? array.length : 0,
        isLarge = length >= 100,
        result = [],
        seen = result;

    outer:
    while (++index < length) {
      var value = array[index];
      if (isLarge) {
        var key = value + '';
        var inited = hasOwnProperty.call(cache[0], key)
          ? !(seen = cache[0][key])
          : (seen = cache[0][key] = []);
      }
      if (inited || indexOf(seen, value) < 0) {
        if (isLarge) {
          seen.push(value);
        }
        var argsIndex = argsLength;
        while (--argsIndex) {
          if (!(cache[argsIndex] || (cache[argsIndex] = cachedContains(args[argsIndex], 0, 100)))(value)) {
            continue outer;
          }
        }
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Gets the last element of the `array`. If a number `n` is passed, the last
   * `n` elements of the `array` are returned. If a `callback` function is passed,
   * the last elements the `callback` returns truthy for are returned. The `callback`
   * is bound to `thisArg` and invoked with three arguments; (value, index, array).
   *
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Function|Object|Number|String} [callback|n] The function called
   *  per element or the number of elements to return. If a property name or
   *  object is passed, it will be used to create a "_.pluck" or "_.where"
   *  style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Mixed} Returns the last element(s) of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   *
   * _.last([1, 2, 3], 2);
   * // => [2, 3]
   *
   * _.last([1, 2, 3], function(num) {
   *   return num > 1;
   * });
   * // => [2, 3]
   *
   * var food = [
   *   { 'name': 'beet',   'organic': false },
   *   { 'name': 'carrot', 'organic': true }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.last(food, 'organic');
   * // => [{ 'name': 'carrot', 'organic': true }]
   *
   * var food = [
   *   { 'name': 'banana', 'type': 'fruit' },
   *   { 'name': 'beet',   'type': 'vegetable' },
   *   { 'name': 'carrot', 'type': 'vegetable' }
   * ];
   *
   * // using "_.where" callback shorthand
   * _.last(food, { 'type': 'vegetable' });
   * // => [{ 'name': 'beet', 'type': 'vegetable' }, { 'name': 'carrot', 'type': 'vegetable' }]
   */
  function last(array, callback, thisArg) {
    if (array) {
      var n = 0,
          length = array.length;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = createCallback(callback, thisArg);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array[length - 1];
        }
      }
      return slice(array, nativeMax(0, length - n));
    }
  }

  /**
   * Gets the index at which the last occurrence of `value` is found using strict
   * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
   * as the offset from the end of the collection.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Number} [fromIndex=array.length-1] The index to search from.
   * @returns {Number} Returns the index of the matched value or `-1`.
   * @example
   *
   * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
   * // => 4
   *
   * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
   * // => 1
   */
  function lastIndexOf(array, value, fromIndex) {
    var index = array ? array.length : 0;
    if (typeof fromIndex == 'number') {
      index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
    }
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Creates an object composed from arrays of `keys` and `values`. Pass either
   * a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`, or
   * two arrays, one of `keys` and one of corresponding `values`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} keys The array of keys.
   * @param {Array} [values=[]] The array of values.
   * @returns {Object} Returns an object composed of the given keys and
   *  corresponding values.
   * @example
   *
   * _.object(['moe', 'larry'], [30, 40]);
   * // => { 'moe': 30, 'larry': 40 }
   */
  function object(keys, values) {
    var index = -1,
        length = keys ? keys.length : 0,
        result = {};

    while (++index < length) {
      var key = keys[index];
      if (values) {
        result[key] = values[index];
      } else {
        result[key[0]] = key[1];
      }
    }
    return result;
  }

  /**
   * Creates an array of numbers (positive and/or negative) progressing from
   * `start` up to but not including `end`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Number} [start=0] The start of the range.
   * @param {Number} end The end of the range.
   * @param {Number} [step=1] The value to increment or descrement by.
   * @returns {Array} Returns a new range array.
   * @example
   *
   * _.range(10);
   * // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *
   * _.range(1, 11);
   * // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
   *
   * _.range(0, 30, 5);
   * // => [0, 5, 10, 15, 20, 25]
   *
   * _.range(0, -10, -1);
   * // => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
   *
   * _.range(0);
   * // => []
   */
  function range(start, end, step) {
    start = +start || 0;
    step = +step || 1;

    if (end == null) {
      end = start;
      start = 0;
    }
    // use `Array(length)` so V8 will avoid the slower "dictionary" mode
    // http://youtu.be/XAqIpGU8ZZk#t=17m25s
    var index = -1,
        length = nativeMax(0, ceil((end - start) / step)),
        result = Array(length);

    while (++index < length) {
      result[index] = start;
      start += step;
    }
    return result;
  }

  /**
   * The opposite of `_.initial`, this method gets all but the first value of `array`.
   * If a number `n` is passed, the first `n` values are excluded from the result.
   * If a `callback` function is passed, the first elements the `callback` returns
   * truthy for are excluded from the result. The `callback` is bound to `thisArg`
   * and invoked with three arguments; (value, index, array).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias drop, tail
   * @category Arrays
   * @param {Array} array The array to query.
   * @param {Function|Object|Number|String} [callback|n=1] The function called
   *  per element or the number of elements to exclude. If a property name or
   *  object is passed, it will be used to create a "_.pluck" or "_.where"
   *  style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a slice of `array`.
   * @example
   *
   * _.rest([1, 2, 3]);
   * // => [2, 3]
   *
   * _.rest([1, 2, 3], 2);
   * // => [3]
   *
   * _.rest([1, 2, 3], function(num) {
   *   return num < 3;
   * });
   * // => [3]
   *
   * var food = [
   *   { 'name': 'banana', 'organic': true },
   *   { 'name': 'beet',   'organic': false },
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.rest(food, 'organic');
   * // => [{ 'name': 'beet', 'organic': false }]
   *
   * var food = [
   *   { 'name': 'apple',  'type': 'fruit' },
   *   { 'name': 'banana', 'type': 'fruit' },
   *   { 'name': 'beet',   'type': 'vegetable' }
   * ];
   *
   * // using "_.where" callback shorthand
   * _.rest(food, { 'type': 'fruit' });
   * // => [{ 'name': 'beet', 'type': 'vegetable' }]
   */
  function rest(array, callback, thisArg) {
    if (typeof callback != 'number' && callback != null) {
      var n = 0,
          index = -1,
          length = array ? array.length : 0;

      callback = createCallback(callback, thisArg);
      while (++index < length && callback(array[index], index, array)) {
        n++;
      }
    } else {
      n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
    }
    return slice(array, n);
  }

  /**
   * Uses a binary search to determine the smallest index at which the `value`
   * should be inserted into `array` in order to maintain the sort order of the
   * sorted `array`. If `callback` is passed, it will be executed for `value` and
   * each element in `array` to compute their sort ranking. The `callback` is
   * bound to `thisArg` and invoked with one argument; (value).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to iterate over.
   * @param {Mixed} value The value to evaluate.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Number} Returns the index at which the value should be inserted
   *  into `array`.
   * @example
   *
   * _.sortedIndex([20, 30, 50], 40);
   * // => 2
   *
   * // using "_.pluck" callback shorthand
   * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
   * // => 2
   *
   * var dict = {
   *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
   * };
   *
   * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
   *   return dict.wordToNumber[word];
   * });
   * // => 2
   *
   * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
   *   return this.wordToNumber[word];
   * }, dict);
   * // => 2
   */
  function sortedIndex(array, value, callback, thisArg) {
    var low = 0,
        high = array ? array.length : low;

    // explicitly reference `identity` for better inlining in Firefox
    callback = callback ? createCallback(callback, thisArg, 1) : identity;
    value = callback(value);

    while (low < high) {
      var mid = (low + high) >>> 1;
      callback(array[mid]) < value
        ? low = mid + 1
        : high = mid;
    }
    return low;
  }

  /**
   * Computes the union of the passed-in arrays using strict equality for
   * comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} [array1, array2, ...] Arrays to process.
   * @returns {Array} Returns a new array of unique values, in order, that are
   *  present in one or more of the arrays.
   * @example
   *
   * _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
   * // => [1, 2, 3, 101, 10]
   */
  function union() {
    return uniq(concat.apply(arrayRef, arguments));
  }

  /**
   * Creates a duplicate-value-free version of the `array` using strict equality
   * for comparisons, i.e. `===`. If the `array` is already sorted, passing `true`
   * for `isSorted` will run a faster algorithm. If `callback` is passed, each
   * element of `array` is passed through a callback` before uniqueness is computed.
   * The `callback` is bound to `thisArg` and invoked with three arguments; (value, index, array).
   *
   * If a property name is passed for `callback`, the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is passed for `callback`, the created "_.where" style callback
   * will return `true` for elements that have the propeties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias unique
   * @category Arrays
   * @param {Array} array The array to process.
   * @param {Boolean} [isSorted=false] A flag to indicate that the `array` is already sorted.
   * @param {Function|Object|String} [callback=identity] The function called per
   *  iteration. If a property name or object is passed, it will be used to create
   *  a "_.pluck" or "_.where" style callback, respectively.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a duplicate-value-free array.
   * @example
   *
   * _.uniq([1, 2, 1, 3, 1]);
   * // => [1, 2, 3]
   *
   * _.uniq([1, 1, 2, 2, 3], true);
   * // => [1, 2, 3]
   *
   * _.uniq([1, 2, 1.5, 3, 2.5], function(num) { return Math.floor(num); });
   * // => [1, 2, 3]
   *
   * _.uniq([1, 2, 1.5, 3, 2.5], function(num) { return this.floor(num); }, Math);
   * // => [1, 2, 3]
   *
   * // using "_.pluck" callback shorthand
   * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
   * // => [{ 'x': 1 }, { 'x': 2 }]
   */
  function uniq(array, isSorted, callback, thisArg) {
    var index = -1,
        length = array ? array.length : 0,
        result = [],
        seen = result;

    // juggle arguments
    if (typeof isSorted == 'function') {
      thisArg = callback;
      callback = isSorted;
      isSorted = false;
    }
    // init value cache for large arrays
    var isLarge = !isSorted && length >= 75;
    if (isLarge) {
      var cache = {};
    }
    if (callback) {
      seen = [];
      callback = createCallback(callback, thisArg);
    }
    while (++index < length) {
      var value = array[index],
          computed = callback ? callback(value, index, array) : value;

      if (isLarge) {
        var key = computed + '';
        var inited = hasOwnProperty.call(cache, key)
          ? !(seen = cache[key])
          : (seen = cache[key] = []);
      }
      if (isSorted
            ? !index || seen[seen.length - 1] !== computed
            : inited || indexOf(seen, computed) < 0
          ) {
        if (callback || isLarge) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Creates an array with all occurrences of the passed values removed using
   * strict equality for comparisons, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to filter.
   * @param {Mixed} [value1, value2, ...] Values to remove.
   * @returns {Array} Returns a new filtered array.
   * @example
   *
   * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
   * // => [2, 3, 4]
   */
  function without(array) {
    var index = -1,
        length = array ? array.length : 0,
        contains = cachedContains(arguments, 1),
        result = [];

    while (++index < length) {
      var value = array[index];
      if (!contains(value)) {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Groups the elements of each array at their corresponding indexes. Useful for
   * separate data sources that are coordinated through matching array indexes.
   * For a matrix of nested arrays, `_.zip.apply(...)` can transpose the matrix
   * in a similar fashion.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} [array1, array2, ...] Arrays to process.
   * @returns {Array} Returns a new array of grouped elements.
   * @example
   *
   * _.zip(['moe', 'larry'], [30, 40], [true, false]);
   * // => [['moe', 30, true], ['larry', 40, false]]
   */
  function zip(array) {
    var index = -1,
        length = array ? max(pluck(arguments, 'length')) : 0,
        result = Array(length);

    while (++index < length) {
      result[index] = pluck(arguments, index);
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a function that is restricted to executing `func` only after it is
   * called `n` times. The `func` is executed with the `this` binding of the
   * created function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Number} n The number of times the function must be called before
   * it is executed.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var renderNotes = _.after(notes.length, render);
   * _.forEach(notes, function(note) {
   *   note.asyncSave({ 'success': renderNotes });
   * });
   * // `renderNotes` is run once, after all notes have saved
   */
  function after(n, func) {
    if (n < 1) {
      return func();
    }
    return function() {
      if (--n < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  /**
   * Creates a function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any additional `bind` arguments to those
   * passed to the bound function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to bind.
   * @param {Mixed} [thisArg] The `this` binding of `func`.
   * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var func = function(greeting) {
   *   return greeting + ' ' + this.name;
   * };
   *
   * func = _.bind(func, { 'name': 'moe' }, 'hi');
   * func();
   * // => 'hi moe'
   */
  function bind(func, thisArg) {
    // use `Function#bind` if it exists and is fast
    // (in V8 `Function#bind` is slower except when partially applied)
    return isBindFast || (nativeBind && arguments.length > 2)
      ? nativeBind.call.apply(nativeBind, arguments)
      : createBound(func, thisArg, slice(arguments, 2));
  }

  /**
   * Binds methods on `object` to `object`, overwriting the existing method.
   * Method names may be specified as individual arguments or as arrays of method
   * names. If no method names are provided, all the function properties of `object`
   * will be bound.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Object} object The object to bind and assign the bound methods to.
   * @param {String} [methodName1, methodName2, ...] Method names on the object to bind.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var view = {
   *  'label': 'docs',
   *  'onClick': function() { alert('clicked ' + this.label); }
   * };
   *
   * _.bindAll(view);
   * jQuery('#docs').on('click', view.onClick);
   * // => alerts 'clicked docs', when the button is clicked
   */
  function bindAll(object) {
    var funcs = concat.apply(arrayRef, arguments),
        index = funcs.length > 1 ? 0 : (funcs = functions(object), -1),
        length = funcs.length;

    while (++index < length) {
      var key = funcs[index];
      object[key] = bind(object[key], object);
    }
    return object;
  }

  /**
   * Creates a function that, when called, invokes the method at `object[key]`
   * and prepends any additional `bindKey` arguments to those passed to the bound
   * function. This method differs from `_.bind` by allowing bound functions to
   * reference methods that will be redefined or don't yet exist.
   * See http://michaux.ca/articles/lazy-function-definition-pattern.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Object} object The object the method belongs to.
   * @param {String} key The key of the method.
   * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var object = {
   *   'name': 'moe',
   *   'greet': function(greeting) {
   *     return greeting + ' ' + this.name;
   *   }
   * };
   *
   * var func = _.bindKey(object, 'greet', 'hi');
   * func();
   * // => 'hi moe'
   *
   * object.greet = function(greeting) {
   *   return greeting + ', ' + this.name + '!';
   * };
   *
   * func();
   * // => 'hi, moe!'
   */
  function bindKey(object, key) {
    return createBound(object, key, slice(arguments, 2));
  }

  /**
   * Creates a function that is the composition of the passed functions,
   * where each function consumes the return value of the function that follows.
   * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
   * Each function is executed with the `this` binding of the composed function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} [func1, func2, ...] Functions to compose.
   * @returns {Function} Returns the new composed function.
   * @example
   *
   * var greet = function(name) { return 'hi ' + name; };
   * var exclaim = function(statement) { return statement + '!'; };
   * var welcome = _.compose(exclaim, greet);
   * welcome('moe');
   * // => 'hi moe!'
   */
  function compose() {
    var funcs = arguments;
    return function() {
      var args = arguments,
          length = funcs.length;

      while (length--) {
        args = [funcs[length].apply(this, args)];
      }
      return args[0];
    };
  }

  /**
   * Creates a function that will delay the execution of `func` until after
   * `wait` milliseconds have elapsed since the last time it was invoked. Pass
   * `true` for `immediate` to cause debounce to invoke `func` on the leading,
   * instead of the trailing, edge of the `wait` timeout. Subsequent calls to
   * the debounced function will return the result of the last `func` call.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to debounce.
   * @param {Number} wait The number of milliseconds to delay.
   * @param {Boolean} immediate A flag to indicate execution is on the leading
   *  edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * var lazyLayout = _.debounce(calculateLayout, 300);
   * jQuery(window).on('resize', lazyLayout);
   */
  function debounce(func, wait, immediate) {
    var args,
        result,
        thisArg,
        timeoutId;

    function delayed() {
      timeoutId = null;
      if (!immediate) {
        result = func.apply(thisArg, args);
      }
    }
    return function() {
      var isImmediate = immediate && !timeoutId;
      args = arguments;
      thisArg = this;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(delayed, wait);

      if (isImmediate) {
        result = func.apply(thisArg, args);
      }
      return result;
    };
  }

  /**
   * Executes the `func` function after `wait` milliseconds. Additional arguments
   * will be passed to `func` when it is invoked.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to delay.
   * @param {Number} wait The number of milliseconds to delay execution.
   * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the function with.
   * @returns {Number} Returns the `setTimeout` timeout id.
   * @example
   *
   * var log = _.bind(console.log, console);
   * _.delay(log, 1000, 'logged later');
   * // => 'logged later' (Appears after one second.)
   */
  function delay(func, wait) {
    var args = slice(arguments, 2);
    return setTimeout(function() { func.apply(undefined, args); }, wait);
  }

  /**
   * Defers executing the `func` function until the current call stack has cleared.
   * Additional arguments will be passed to `func` when it is invoked.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to defer.
   * @param {Mixed} [arg1, arg2, ...] Arguments to invoke the function with.
   * @returns {Number} Returns the `setTimeout` timeout id.
   * @example
   *
   * _.defer(function() { alert('deferred'); });
   * // returns from the function before `alert` is called
   */
  function defer(func) {
    var args = slice(arguments, 1);
    return setTimeout(function() { func.apply(undefined, args); }, 1);
  }
  // use `setImmediate` if it's available in Node.js
  if (isV8 && freeModule && typeof setImmediate == 'function') {
    defer = bind(setImmediate, window);
  }

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * passed, it will be used to determine the cache key for storing the result
   * based on the arguments passed to the memoized function. By default, the first
   * argument passed to the memoized function is used as the cache key. The `func`
   * is executed with the `this` binding of the memoized function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] A function used to resolve the cache key.
   * @returns {Function} Returns the new memoizing function.
   * @example
   *
   * var fibonacci = _.memoize(function(n) {
   *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
   * });
   */
  function memoize(func, resolver) {
    var cache = {};
    return function() {
      var key = (resolver ? resolver.apply(this, arguments) : arguments[0]) + '';
      return hasOwnProperty.call(cache, key)
        ? cache[key]
        : (cache[key] = func.apply(this, arguments));
    };
  }

  /**
   * Creates a function that is restricted to execute `func` once. Repeat calls to
   * the function will return the value of the first call. The `func` is executed
   * with the `this` binding of the created function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // `initialize` executes `createApplication` once
   */
  function once(func) {
    var ran,
        result;

    return function() {
      if (ran) {
        return result;
      }
      ran = true;
      result = func.apply(this, arguments);

      // clear the `func` variable so the function may be garbage collected
      func = null;
      return result;
    };
  }

  /**
   * Creates a function that, when called, invokes `func` with any additional
   * `partial` arguments prepended to those passed to the new function. This
   * method is similar to `_.bind`, except it does **not** alter the `this` binding.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to partially apply arguments to.
   * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
   * @returns {Function} Returns the new partially applied function.
   * @example
   *
   * var greet = function(greeting, name) { return greeting + ' ' + name; };
   * var hi = _.partial(greet, 'hi');
   * hi('moe');
   * // => 'hi moe'
   */
  function partial(func) {
    return createBound(func, slice(arguments, 1));
  }

  /**
   * This method is similar to `_.partial`, except that `partial` arguments are
   * appended to those passed to the new function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to partially apply arguments to.
   * @param {Mixed} [arg1, arg2, ...] Arguments to be partially applied.
   * @returns {Function} Returns the new partially applied function.
   * @example
   *
   * var defaultsDeep = _.partialRight(_.merge, _.defaults);
   *
   * var options = {
   *   'variable': 'data',
   *   'imports': { 'jq': $ }
   * };
   *
   * defaultsDeep(options, _.templateSettings);
   *
   * options.variable
   * // => 'data'
   *
   * options.imports
   * // => { '_': _, 'jq': $ }
   */
  function partialRight(func) {
    return createBound(func, slice(arguments, 1), null, indicatorObject);
  }

  /**
   * Creates a function that, when executed, will only call the `func`
   * function at most once per every `wait` milliseconds. If the throttled
   * function is invoked more than once during the `wait` timeout, `func` will
   * also be called on the trailing edge of the timeout. Subsequent calls to the
   * throttled function will return the result of the last `func` call.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to throttle.
   * @param {Number} wait The number of milliseconds to throttle executions to.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * var throttled = _.throttle(updatePosition, 100);
   * jQuery(window).on('scroll', throttled);
   */
  function throttle(func, wait) {
    var args,
        result,
        thisArg,
        timeoutId,
        lastCalled = 0;

    function trailingCall() {
      lastCalled = new Date;
      timeoutId = null;
      result = func.apply(thisArg, args);
    }
    return function() {
      var now = new Date,
          remaining = wait - (now - lastCalled);

      args = arguments;
      thisArg = this;

      if (remaining <= 0) {
        clearTimeout(timeoutId);
        timeoutId = null;
        lastCalled = now;
        result = func.apply(thisArg, args);
      }
      else if (!timeoutId) {
        timeoutId = setTimeout(trailingCall, remaining);
      }
      return result;
    };
  }

  /**
   * Creates a function that passes `value` to the `wrapper` function as its
   * first argument. Additional arguments passed to the function are appended
   * to those passed to the `wrapper` function. The `wrapper` is executed with
   * the `this` binding of the created function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Mixed} value The value to wrap.
   * @param {Function} wrapper The wrapper function.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var hello = function(name) { return 'hello ' + name; };
   * hello = _.wrap(hello, function(func) {
   *   return 'before, ' + func('moe') + ', after';
   * });
   * hello();
   * // => 'before, hello moe, after'
   */
  function wrap(value, wrapper) {
    return function() {
      var args = [value];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
   * corresponding HTML entities.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} string The string to escape.
   * @returns {String} Returns the escaped string.
   * @example
   *
   * _.escape('Moe, Larry & Curly');
   * // => 'Moe, Larry &amp; Curly'
   */
  function escape(string) {
    return string == null ? '' : (string + '').replace(reUnescapedHtml, escapeHtmlChar);
  }

  /**
   * This function returns the first argument passed to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Mixed} value Any value.
   * @returns {Mixed} Returns `value`.
   * @example
   *
   * var moe = { 'name': 'moe' };
   * moe === _.identity(moe);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Adds functions properties of `object` to the `lodash` function and chainable
   * wrapper.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} object The object of function properties to add to `lodash`.
   * @example
   *
   * _.mixin({
   *   'capitalize': function(string) {
   *     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
   *   }
   * });
   *
   * _.capitalize('moe');
   * // => 'Moe'
   *
   * _('moe').capitalize();
   * // => 'Moe'
   */
  function mixin(object) {
    forEach(functions(object), function(methodName) {
      var func = lodash[methodName] = object[methodName];

      lodash.prototype[methodName] = function() {
        var args = [this.__wrapped__];
        push.apply(args, arguments);
        return new lodash(func.apply(lodash, args));
      };
    });
  }

  /**
   * Reverts the '_' variable to its previous value and returns a reference to
   * the `lodash` function.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @returns {Function} Returns the `lodash` function.
   * @example
   *
   * var lodash = _.noConflict();
   */
  function noConflict() {
    window._ = oldDash;
    return this;
  }

  /**
   * Produces a random number between `min` and `max` (inclusive). If only one
   * argument is passed, a number between `0` and the given number will be returned.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Number} [min=0] The minimum possible value.
   * @param {Number} [max=1] The maximum possible value.
   * @returns {Number} Returns a random number.
   * @example
   *
   * _.random(0, 5);
   * // => a number between 0 and 5
   *
   * _.random(5);
   * // => also a number between 0 and 5
   */
  function random(min, max) {
    if (min == null && max == null) {
      max = 1;
    }
    min = +min || 0;
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + floor(nativeRandom() * ((+max || 0) - min + 1));
  }

  /**
   * Resolves the value of `property` on `object`. If `property` is a function,
   * it will be invoked and its result returned, else the property value is
   * returned. If `object` is falsey, then `null` is returned.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} object The object to inspect.
   * @param {String} property The property to get the value of.
   * @returns {Mixed} Returns the resolved value.
   * @example
   *
   * var object = {
   *   'cheese': 'crumpets',
   *   'stuff': function() {
   *     return 'nonsense';
   *   }
   * };
   *
   * _.result(object, 'cheese');
   * // => 'crumpets'
   *
   * _.result(object, 'stuff');
   * // => 'nonsense'
   */
  function result(object, property) {
    var value = object ? object[property] : undefined;
    return isFunction(value) ? object[property]() : value;
  }

  /**
   * A micro-templating method that handles arbitrary delimiters, preserves
   * whitespace, and correctly escapes quotes within interpolated code.
   *
   * Note: In the development build, `_.template` utilizes sourceURLs for easier
   * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
   *
   * Note: Lo-Dash may be used in Chrome extensions by either creating a `lodash csp`
   * build and using precompiled templates, or loading Lo-Dash in a sandbox.
   *
   * For more information on precompiling templates see:
   * http://lodash.com/#custom-builds
   *
   * For more information on Chrome extension sandboxes see:
   * http://developer.chrome.com/stable/extensions/sandboxingEval.html
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} text The template text.
   * @param {Obect} data The data object used to populate the text.
   * @param {Object} options The options object.
   *  escape - The "escape" delimiter regexp.
   *  evaluate - The "evaluate" delimiter regexp.
   *  interpolate - The "interpolate" delimiter regexp.
   *  sourceURL - The sourceURL of the template's compiled source.
   *  variable - The data object variable name.
   *
   * @returns {Function|String} Returns a compiled function when no `data` object
   *  is given, else it returns the interpolated text.
   * @example
   *
   * // using a compiled template
   * var compiled = _.template('hello <%= name %>');
   * compiled({ 'name': 'moe' });
   * // => 'hello moe'
   *
   * var list = '<% _.forEach(people, function(name) { %><li><%= name %></li><% }); %>';
   * _.template(list, { 'people': ['moe', 'larry'] });
   * // => '<li>moe</li><li>larry</li>'
   *
   * // using the "escape" delimiter to escape HTML in data property values
   * _.template('<b><%- value %></b>', { 'value': '<script>' });
   * // => '<b>&lt;script&gt;</b>'
   *
   * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
   * _.template('hello ${ name }', { 'name': 'curly' });
   * // => 'hello curly'
   *
   * // using the internal `print` function in "evaluate" delimiters
   * _.template('<% print("hello " + epithet); %>!', { 'epithet': 'stooge' });
   * // => 'hello stooge!'
   *
   * // using custom template delimiters
   * _.templateSettings = {
   *   'interpolate': /{{([\s\S]+?)}}/g
   * };
   *
   * _.template('hello {{ name }}!', { 'name': 'mustache' });
   * // => 'hello mustache!'
   *
   * // using the `sourceURL` option to specify a custom sourceURL for the template
   * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
   * compiled(data);
   * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
   *
   * // using the `variable` option to ensure a with-statement isn't used in the compiled template
   * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
   * compiled.source;
   * // => function(data) {
   *   var __t, __p = '', __e = _.escape;
   *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
   *   return __p;
   * }
   *
   * // using the `source` property to inline compiled templates for meaningful
   * // line numbers in error messages and a stack trace
   * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
   *   var JST = {\
   *     "main": ' + _.template(mainText).source + '\
   *   };\
   * ');
   */
  function template(text, data, options) {
    // based on John Resig's `tmpl` implementation
    // http://ejohn.org/blog/javascript-micro-templating/
    // and Laura Doktorova's doT.js
    // https://github.com/olado/doT
    var settings = lodash.templateSettings;
    text || (text = '');

    // avoid missing dependencies when `iteratorTemplate` is not defined
    options = defaults({}, options, settings);

    var imports = defaults({}, options.imports, settings.imports),
        importsKeys = keys(imports),
        importsValues = values(imports);

    var isEvaluating,
        index = 0,
        interpolate = options.interpolate || reNoMatch,
        source = "__p += '";

    // compile regexp to match each delimiter
    var reDelimiters = RegExp(
      (options.escape || reNoMatch).source + '|' +
      interpolate.source + '|' +
      (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
      (options.evaluate || reNoMatch).source + '|$'
    , 'g');

    text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
      interpolateValue || (interpolateValue = esTemplateValue);

      // escape characters that cannot be included in string literals
      source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

      // replace delimiters with snippets
      if (escapeValue) {
        source += "' +\n__e(" + escapeValue + ") +\n'";
      }
      if (evaluateValue) {
        isEvaluating = true;
        source += "';\n" + evaluateValue + ";\n__p += '";
      }
      if (interpolateValue) {
        source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
      }
      index = offset + match.length;

      // the JS engine embedded in Adobe products requires returning the `match`
      // string in order to produce the correct `offset` value
      return match;
    });

    source += "';\n";

    // if `variable` is not specified and the template contains "evaluate"
    // delimiters, wrap a with-statement around the generated code to add the
    // data object to the top of the scope chain
    var variable = options.variable,
        hasVariable = variable;

    if (!hasVariable) {
      variable = 'obj';
      source = 'with (' + variable + ') {\n' + source + '\n}\n';
    }
    // cleanup code by stripping empty strings
    source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
      .replace(reEmptyStringMiddle, '$1')
      .replace(reEmptyStringTrailing, '$1;');

    // frame code as the function body
    source = 'function(' + variable + ') {\n' +
      (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
      "var __t, __p = '', __e = _.escape" +
      (isEvaluating
        ? ', __j = Array.prototype.join;\n' +
          "function print() { __p += __j.call(arguments, '') }\n"
        : ';\n'
      ) +
      source +
      'return __p\n}';

    // Use a sourceURL for easier debugging and wrap in a multi-line comment to
    // avoid issues with Narwhal, IE conditional compilation, and the JS engine
    // embedded in Adobe products.
    // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
    var sourceURL = '\n/*\n//@ sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

    try {
      var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
    } catch(e) {
      e.source = source;
      throw e;
    }
    if (data) {
      return result(data);
    }
    // provide the compiled function's source via its `toString` method, in
    // supported environments, or the `source` property as a convenience for
    // inlining compiled templates during the build process
    result.source = source;
    return result;
  }

  /**
   * Executes the `callback` function `n` times, returning an array of the results
   * of each `callback` execution. The `callback` is bound to `thisArg` and invoked
   * with one argument; (index).
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Number} n The number of times to execute the callback.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a new array of the results of each `callback` execution.
   * @example
   *
   * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
   * // => [3, 6, 4]
   *
   * _.times(3, function(n) { mage.castSpell(n); });
   * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
   *
   * _.times(3, function(n) { this.cast(n); }, mage);
   * // => also calls `mage.castSpell(n)` three times
   */
  function times(n, callback, thisArg) {
    n = +n || 0;
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = callback.call(thisArg, index);
    }
    return result;
  }

  /**
   * The opposite of `_.escape`, this method converts the HTML entities
   * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
   * corresponding characters.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} string The string to unescape.
   * @returns {String} Returns the unescaped string.
   * @example
   *
   * _.unescape('Moe, Larry &amp; Curly');
   * // => 'Moe, Larry & Curly'
   */
  function unescape(string) {
    return string == null ? '' : (string + '').replace(reEscapedHtml, unescapeHtmlChar);
  }

  /**
   * Generates a unique ID. If `prefix` is passed, the ID will be appended to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} [prefix] The value to prefix the ID with.
   * @returns {String} Returns the unique ID.
   * @example
   *
   * _.uniqueId('contact_');
   * // => 'contact_104'
   *
   * _.uniqueId();
   * // => '105'
   */
  function uniqueId(prefix) {
    var id = ++idCounter;
    return (prefix == null ? '' : prefix + '') + id;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Invokes `interceptor` with the `value` as the first argument, and then
   * returns `value`. The purpose of this method is to "tap into" a method chain,
   * in order to perform operations on intermediate results within the chain.
   *
   * @static
   * @memberOf _
   * @category Chaining
   * @param {Mixed} value The value to pass to `interceptor`.
   * @param {Function} interceptor The function to invoke.
   * @returns {Mixed} Returns `value`.
   * @example
   *
   * _([1, 2, 3, 4])
   *  .filter(function(num) { return num % 2 == 0; })
   *  .tap(alert)
   *  .map(function(num) { return num * num; })
   *  .value();
   * // => // [2, 4] (alerted)
   * // => [4, 16]
   */
  function tap(value, interceptor) {
    interceptor(value);
    return value;
  }

  /**
   * Produces the `toString` result of the wrapped value.
   *
   * @name toString
   * @memberOf _
   * @category Chaining
   * @returns {String} Returns the string result.
   * @example
   *
   * _([1, 2, 3]).toString();
   * // => '1,2,3'
   */
  function wrapperToString() {
    return this.__wrapped__ + '';
  }

  /**
   * Extracts the wrapped value.
   *
   * @name valueOf
   * @memberOf _
   * @alias value
   * @category Chaining
   * @returns {Mixed} Returns the wrapped value.
   * @example
   *
   * _([1, 2, 3]).valueOf();
   * // => [1, 2, 3]
   */
  function wrapperValueOf() {
    return this.__wrapped__;
  }

  /*--------------------------------------------------------------------------*/

  // add functions that return wrapped values when chaining
  lodash.after = after;
  lodash.assign = assign;
  lodash.at = at;
  lodash.bind = bind;
  lodash.bindAll = bindAll;
  lodash.bindKey = bindKey;
  lodash.compact = compact;
  lodash.compose = compose;
  lodash.countBy = countBy;
  lodash.debounce = debounce;
  lodash.defaults = defaults;
  lodash.defer = defer;
  lodash.delay = delay;
  lodash.difference = difference;
  lodash.filter = filter;
  lodash.flatten = flatten;
  lodash.forEach = forEach;
  lodash.forIn = forIn;
  lodash.forOwn = forOwn;
  lodash.functions = functions;
  lodash.groupBy = groupBy;
  lodash.initial = initial;
  lodash.intersection = intersection;
  lodash.invert = invert;
  lodash.invoke = invoke;
  lodash.keys = keys;
  lodash.map = map;
  lodash.max = max;
  lodash.memoize = memoize;
  lodash.merge = merge;
  lodash.min = min;
  lodash.object = object;
  lodash.omit = omit;
  lodash.once = once;
  lodash.pairs = pairs;
  lodash.partial = partial;
  lodash.partialRight = partialRight;
  lodash.pick = pick;
  lodash.pluck = pluck;
  lodash.range = range;
  lodash.reject = reject;
  lodash.rest = rest;
  lodash.shuffle = shuffle;
  lodash.sortBy = sortBy;
  lodash.tap = tap;
  lodash.throttle = throttle;
  lodash.times = times;
  lodash.toArray = toArray;
  lodash.union = union;
  lodash.uniq = uniq;
  lodash.values = values;
  lodash.where = where;
  lodash.without = without;
  lodash.wrap = wrap;
  lodash.zip = zip;

  // add aliases
  lodash.collect = map;
  lodash.drop = rest;
  lodash.each = forEach;
  lodash.extend = assign;
  lodash.methods = functions;
  lodash.select = filter;
  lodash.tail = rest;
  lodash.unique = uniq;

  // add functions to `lodash.prototype`
  mixin(lodash);

  /*--------------------------------------------------------------------------*/

  // add functions that return unwrapped values when chaining
  lodash.clone = clone;
  lodash.cloneDeep = cloneDeep;
  lodash.contains = contains;
  lodash.escape = escape;
  lodash.every = every;
  lodash.find = find;
  lodash.has = has;
  lodash.identity = identity;
  lodash.indexOf = indexOf;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isBoolean = isBoolean;
  lodash.isDate = isDate;
  lodash.isElement = isElement;
  lodash.isEmpty = isEmpty;
  lodash.isEqual = isEqual;
  lodash.isFinite = isFinite;
  lodash.isFunction = isFunction;
  lodash.isNaN = isNaN;
  lodash.isNull = isNull;
  lodash.isNumber = isNumber;
  lodash.isObject = isObject;
  lodash.isPlainObject = isPlainObject;
  lodash.isRegExp = isRegExp;
  lodash.isString = isString;
  lodash.isUndefined = isUndefined;
  lodash.lastIndexOf = lastIndexOf;
  lodash.mixin = mixin;
  lodash.noConflict = noConflict;
  lodash.random = random;
  lodash.reduce = reduce;
  lodash.reduceRight = reduceRight;
  lodash.result = result;
  lodash.size = size;
  lodash.some = some;
  lodash.sortedIndex = sortedIndex;
  lodash.template = template;
  lodash.unescape = unescape;
  lodash.uniqueId = uniqueId;

  // add aliases
  lodash.all = every;
  lodash.any = some;
  lodash.detect = find;
  lodash.foldl = reduce;
  lodash.foldr = reduceRight;
  lodash.include = contains;
  lodash.inject = reduce;

  forOwn(lodash, function(func, methodName) {
    if (!lodash.prototype[methodName]) {
      lodash.prototype[methodName] = function() {
        var args = [this.__wrapped__];
        push.apply(args, arguments);
        return func.apply(lodash, args);
      };
    }
  });

  /*--------------------------------------------------------------------------*/

  // add functions capable of returning wrapped and unwrapped values when chaining
  lodash.first = first;
  lodash.last = last;

  // add aliases
  lodash.take = first;
  lodash.head = first;

  forOwn(lodash, function(func, methodName) {
    if (!lodash.prototype[methodName]) {
      lodash.prototype[methodName]= function(callback, thisArg) {
        var result = func(this.__wrapped__, callback, thisArg);
        return callback == null || (thisArg && typeof callback != 'function')
          ? result
          : new lodash(result);
      };
    }
  });

  /*--------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type String
   */
  lodash.VERSION = '1.0.2';

  // add "Chaining" functions to the wrapper
  lodash.prototype.toString = wrapperToString;
  lodash.prototype.value = wrapperValueOf;
  lodash.prototype.valueOf = wrapperValueOf;

  // add `Array` functions that return unwrapped values
  each(['join', 'pop', 'shift'], function(methodName) {
    var func = arrayRef[methodName];
    lodash.prototype[methodName] = function() {
      return func.apply(this.__wrapped__, arguments);
    };
  });

  // add `Array` functions that return the wrapped value
  each(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
    var func = arrayRef[methodName];
    lodash.prototype[methodName] = function() {
      func.apply(this.__wrapped__, arguments);
      return this;
    };
  });

  // add `Array` functions that return new wrapped values
  each(['concat', 'slice', 'splice'], function(methodName) {
    var func = arrayRef[methodName];
    lodash.prototype[methodName] = function() {
      return new lodash(func.apply(this.__wrapped__, arguments));
    };
  });

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash was injected by a third-party script and not intended to be
    // loaded as a module. The global assignment can be reverted in the Lo-Dash
    // module via its `noConflict()` method.
    window._ = lodash;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return lodash;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports) {
    // in Node.js or RingoJS v0.8.0+
    if (freeModule) {
      (freeModule.exports = lodash)._ = lodash;
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      freeExports._ = lodash;
    }
  }
  else {
    // in a browser or Rhino
    window._ = lodash;
  }
}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**!
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        SocialBar Plug-in v1.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Easy plugin for simple social bar with support videos, facebook pages, like and other widgets
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        @license: none
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        @author: Michal Koval (MIcQo)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        @preserve
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     **/

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = {
    openedClass: "opened",

    panelMaxHeight: 556,
    panelClass: ".social-panel",
    panelFixedClass: "top-fixed",
    panelPercent: {
        halfPosition: 30,
        fixed: 2
    },

    panelBodyClass: ".panel-content-placeholder",
    boxClass: ".box",

    iconClass: ".social-icon",
    iconActiveClass: "active",

    halfPosition: false,
    halfPositionClass: "half-position",

    toggle: false

};

var SocialBar = function () {
    function SocialBar(userConf) {
        _classCallCheck(this, SocialBar);

        _lodash2.default.forEach(userConf, function (value, key) {
            return config[key] = value;
        });

        this.openBar = this.openBar.bind(this);
        this.closeBar = this.closeBar.bind(this);
        this.setPositionBreakpoints = this.setPositionBreakpoints.bind(this);
        this.calcPercent = this.calcPercent.bind(this);

        this.setPositionBreakpoints();
    }

    _createClass(SocialBar, [{
        key: "openBar",
        value: function openBar(e) {
            var $this = $(e.currentTarget);
            var type = $this.data("box");

            e.stopPropagation();

            if (config.toggle) {
                if ($(config.panelClass).hasClass(config.openedClass) && $this.hasClass(config.iconActiveClass)) {
                    return this.closeBar(e);
                }
            }

            // Change color acorrding by given class
            $(config.panelClass + " " + config.iconClass).removeClass(config.iconActiveClass);
            $this.addClass(config.iconActiveClass);

            // Change content
            $(config.panelClass + " " + config.panelBodyClass + " " + config.boxClass).hide();
            $(config.panelClass + " " + config.panelBodyClass + " ." + type).show();

            // slide content
            $(config.panelClass).addClass(config.openedClass).removeClass(function (index, className) {
                return (className.match(/(^|\s)network-\S+/g) || []).join(' ');
            }).addClass("network-" + type);
        }
    }, {
        key: "closeBar",
        value: function closeBar(e) {
            if (!$(config.panelClass).hasClass(config.openedClass)) return;

            $(config.panelClass).removeClass(config.openedClass);
        }
    }, {
        key: "setPositionBreakpoints",
        value: function setPositionBreakpoints() {
            var panel = $(config.panelClass);
            var panelBody = $(config.panelBodyClass);
            var windowHeight = $(window).height();
            var halfPosition = Math.floor(panelBody.height() + this.calcPercent(windowHeight, config.panelPercent.halfPosition));

            if (windowHeight <= halfPosition) {
                panel.removeClass(config.halfPositionClass).addClass(config.panelFixedClass);

                panelBody.height(windowHeight);
            } else if (config.halfPosition && windowHeight >= halfPosition) {
                panel.addClass(config.halfPositionClass).removeClass(config.panelFixedClass);
            }

            if (panelBody.height() >= config.panelMaxHeight) {
                panelBody.height(config.panelMaxHeight);
            }
        }
    }, {
        key: "calcPercent",
        value: function calcPercent(total, percent) {
            return percent / 100 * total;
        }
    }]);

    return SocialBar;
}();

exports.default = SocialBar;

},{"lodash":1}],3:[function(require,module,exports){
"use strict";

var _SocialBar = require("./modules/SocialBar");

var _SocialBar2 = _interopRequireDefault(_SocialBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {

    var bar = new _SocialBar2.default({
        toggle: true,
        halfPosition: true
    });

    // run after document ready   
    $(".panel-content-placeholder").on("click", function (e) {
        return e.stopPropagation();
    });
    $(".social-panel .social-icon").on("click", bar.openBar);
    $("body").on("click", bar.closeBar);
    $(window).resize(bar.setPositionBreakpoints);
});

},{"./modules/SocialBar":2}]},{},[3])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2Rpc3QvbG9kYXNoLmpzIiwic3JjL2pzL21vZHVsZXMvU29jaWFsQmFyLmpzIiwic3JjL2pzL3NvY2lhbGJhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztxakJDdjNKQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7QUFFQSxJQUFJLFNBQVM7QUFDVCxpQkFBYSxRQURKOztBQUdULG9CQUFnQixHQUhQO0FBSVQsZ0JBQVksZUFKSDtBQUtULHFCQUFpQixXQUxSO0FBTVQsa0JBQWM7QUFDVixzQkFBYyxFQURKO0FBRVYsZUFBTztBQUZHLEtBTkw7O0FBV1Qsb0JBQWdCLDRCQVhQO0FBWVQsY0FBVSxNQVpEOztBQWNULGVBQVcsY0FkRjtBQWVULHFCQUFpQixRQWZSOztBQWlCVCxrQkFBYyxLQWpCTDtBQWtCVCx1QkFBbUIsZUFsQlY7O0FBb0JULFlBQVE7O0FBcEJDLENBQWI7O0lBd0JNLFM7QUFFRix1QkFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQ2xCLHlCQUFFLE9BQUYsQ0FBVSxRQUFWLEVBQW9CLFVBQUMsS0FBRCxFQUFRLEdBQVI7QUFBQSxtQkFBZ0IsT0FBTyxHQUFQLElBQWMsS0FBOUI7QUFBQSxTQUFwQjs7QUFFQSxhQUFLLE9BQUwsR0FBZSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLElBQWxCLENBQWY7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFoQjtBQUNBLGFBQUssc0JBQUwsR0FBOEIsS0FBSyxzQkFBTCxDQUE0QixJQUE1QixDQUFpQyxJQUFqQyxDQUE5QjtBQUNBLGFBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7O0FBRUEsYUFBSyxzQkFBTDtBQUNIOzs7O2dDQUVPLEMsRUFBRztBQUNQLGdCQUFJLFFBQVEsRUFBRSxFQUFFLGFBQUosQ0FBWjtBQUNBLGdCQUFJLE9BQU8sTUFBTSxJQUFOLENBQVcsS0FBWCxDQUFYOztBQUVBLGNBQUUsZUFBRjs7QUFFQSxnQkFBRyxPQUFPLE1BQVYsRUFBa0I7QUFDZCxvQkFBRyxFQUFFLE9BQU8sVUFBVCxFQUFxQixRQUFyQixDQUE4QixPQUFPLFdBQXJDLEtBQXFELE1BQU0sUUFBTixDQUFlLE9BQU8sZUFBdEIsQ0FBeEQsRUFBZ0c7QUFDNUYsMkJBQU8sS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFQO0FBQ0g7QUFDSjs7QUFFRDtBQUNBLGNBQUUsT0FBTyxVQUFQLEdBQW9CLEdBQXBCLEdBQTBCLE9BQU8sU0FBbkMsRUFBOEMsV0FBOUMsQ0FBMEQsT0FBTyxlQUFqRTtBQUNBLGtCQUFNLFFBQU4sQ0FBZSxPQUFPLGVBQXRCOztBQUVBO0FBQ0EsY0FBRSxPQUFPLFVBQVAsR0FBb0IsR0FBcEIsR0FBMEIsT0FBTyxjQUFqQyxHQUFrRCxHQUFsRCxHQUF3RCxPQUFPLFFBQWpFLEVBQTJFLElBQTNFO0FBQ0EsY0FBRSxPQUFPLFVBQVAsR0FBb0IsR0FBcEIsR0FBMEIsT0FBTyxjQUFqQyxHQUFrRCxJQUFsRCxHQUF5RCxJQUEzRCxFQUFpRSxJQUFqRTs7QUFFQTtBQUNBLGNBQUUsT0FBTyxVQUFULEVBQ0ssUUFETCxDQUNjLE9BQU8sV0FEckIsRUFFSyxXQUZMLENBRWlCLFVBQVUsS0FBVixFQUFpQixTQUFqQixFQUE0QjtBQUNyQyx1QkFBTyxDQUFDLFVBQVUsS0FBVixDQUFnQixvQkFBaEIsS0FBeUMsRUFBMUMsRUFBOEMsSUFBOUMsQ0FBbUQsR0FBbkQsQ0FBUDtBQUNILGFBSkwsRUFLSyxRQUxMLENBS2MsYUFBYSxJQUwzQjtBQU1IOzs7aUNBRVEsQyxFQUFHO0FBQ1IsZ0JBQUcsQ0FBQyxFQUFFLE9BQU8sVUFBVCxFQUFxQixRQUFyQixDQUE4QixPQUFPLFdBQXJDLENBQUosRUFDSTs7QUFFSixjQUFFLE9BQU8sVUFBVCxFQUFxQixXQUFyQixDQUFpQyxPQUFPLFdBQXhDO0FBQ0g7OztpREFFd0I7QUFDckIsZ0JBQUksUUFBUSxFQUFFLE9BQU8sVUFBVCxDQUFaO0FBQ0EsZ0JBQUksWUFBWSxFQUFFLE9BQU8sY0FBVCxDQUFoQjtBQUNBLGdCQUFJLGVBQWUsRUFBRSxNQUFGLEVBQVUsTUFBVixFQUFuQjtBQUNBLGdCQUFJLGVBQWUsS0FBSyxLQUFMLENBQVksVUFBVSxNQUFWLEtBQXFCLEtBQUssV0FBTCxDQUFpQixZQUFqQixFQUErQixPQUFPLFlBQVAsQ0FBb0IsWUFBbkQsQ0FBakMsQ0FBbkI7O0FBRUEsZ0JBQUksZ0JBQWdCLFlBQXBCLEVBQWtDO0FBQzlCLHNCQUFNLFdBQU4sQ0FBa0IsT0FBTyxpQkFBekIsRUFDSyxRQURMLENBQ2MsT0FBTyxlQURyQjs7QUFHQSwwQkFBVSxNQUFWLENBQWlCLFlBQWpCO0FBQ0gsYUFMRCxNQUtPLElBQUksT0FBTyxZQUFQLElBQXVCLGdCQUFnQixZQUEzQyxFQUF5RDtBQUM1RCxzQkFBTSxRQUFOLENBQWUsT0FBTyxpQkFBdEIsRUFDSyxXQURMLENBQ2lCLE9BQU8sZUFEeEI7QUFFSDs7QUFFRCxnQkFBSSxVQUFVLE1BQVYsTUFBc0IsT0FBTyxjQUFqQyxFQUFpRDtBQUM3QywwQkFBVSxNQUFWLENBQWlCLE9BQU8sY0FBeEI7QUFDSDtBQUNKOzs7b0NBRVcsSyxFQUFPLE8sRUFBUztBQUN4QixtQkFBUSxVQUFVLEdBQVgsR0FBa0IsS0FBekI7QUFDSDs7Ozs7O2tCQUdVLFM7Ozs7O0FDN0dmOzs7Ozs7QUFFQSxFQUFFLFlBQVk7O0FBRVYsUUFBSSxNQUFNLHdCQUFjO0FBQ3BCLGdCQUFRLElBRFk7QUFFcEIsc0JBQWM7QUFGTSxLQUFkLENBQVY7O0FBS0E7QUFDQSxNQUFFLDRCQUFGLEVBQWdDLEVBQWhDLENBQW1DLE9BQW5DLEVBQTRDLFVBQUMsQ0FBRDtBQUFBLGVBQU8sRUFBRSxlQUFGLEVBQVA7QUFBQSxLQUE1QztBQUNBLE1BQUUsNEJBQUYsRUFBZ0MsRUFBaEMsQ0FBbUMsT0FBbkMsRUFBNEMsSUFBSSxPQUFoRDtBQUNBLE1BQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLElBQUksUUFBMUI7QUFDQSxNQUFFLE1BQUYsRUFBVSxNQUFWLENBQWlCLElBQUksc0JBQXJCO0FBQ0gsQ0FaRCIsImZpbGUiOiJzb2NpYWxiYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIExvLURhc2ggMS4wLjIgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiAtbyAuL2Rpc3QvbG9kYXNoLmpzYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS40LjQgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnLz5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIEluYy5cbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuOyhmdW5jdGlvbih3aW5kb3csIHVuZGVmaW5lZCkge1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AgKi9cbiAgdmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cztcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAgKi9cbiAgdmFyIGZyZWVNb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cyA9PSBmcmVlRXhwb3J0cyAmJiBtb2R1bGU7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGFuZCB1c2UgaXQgYXMgYHdpbmRvd2AgKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcbiAgaWYgKGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsKSB7XG4gICAgd2luZG93ID0gZnJlZUdsb2JhbDtcbiAgfVxuXG4gIC8qKiBVc2VkIGZvciBhcnJheSBhbmQgb2JqZWN0IG1ldGhvZCByZWZlcmVuY2VzICovXG4gIHZhciBhcnJheVJlZiA9IFtdLFxuICAgICAgb2JqZWN0UmVmID0ge307XG5cbiAgLyoqIFVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIElEcyAqL1xuICB2YXIgaWRDb3VudGVyID0gMDtcblxuICAvKiogVXNlZCBpbnRlcm5hbGx5IHRvIGluZGljYXRlIHZhcmlvdXMgdGhpbmdzICovXG4gIHZhciBpbmRpY2F0b3JPYmplY3QgPSBvYmplY3RSZWY7XG5cbiAgLyoqIFVzZWQgYnkgYGNhY2hlZENvbnRhaW5zYCBhcyB0aGUgZGVmYXVsdCBzaXplIHdoZW4gb3B0aW1pemF0aW9ucyBhcmUgZW5hYmxlZCBmb3IgbGFyZ2UgYXJyYXlzICovXG4gIHZhciBsYXJnZUFycmF5U2l6ZSA9IDMwO1xuXG4gIC8qKiBVc2VkIHRvIHJlc3RvcmUgdGhlIG9yaWdpbmFsIGBfYCByZWZlcmVuY2UgaW4gYG5vQ29uZmxpY3RgICovXG4gIHZhciBvbGREYXNoID0gd2luZG93Ll87XG5cbiAgLyoqIFVzZWQgdG8gbWF0Y2ggSFRNTCBlbnRpdGllcyAqL1xuICB2YXIgcmVFc2NhcGVkSHRtbCA9IC8mKD86YW1wfGx0fGd0fHF1b3R8IzM5KTsvZztcblxuICAvKiogVXNlZCB0byBtYXRjaCBlbXB0eSBzdHJpbmcgbGl0ZXJhbHMgaW4gY29tcGlsZWQgdGVtcGxhdGUgc291cmNlICovXG4gIHZhciByZUVtcHR5U3RyaW5nTGVhZGluZyA9IC9cXGJfX3AgXFwrPSAnJzsvZyxcbiAgICAgIHJlRW1wdHlTdHJpbmdNaWRkbGUgPSAvXFxiKF9fcCBcXCs9KSAnJyBcXCsvZyxcbiAgICAgIHJlRW1wdHlTdHJpbmdUcmFpbGluZyA9IC8oX19lXFwoLio/XFwpfFxcYl9fdFxcKSkgXFwrXFxuJyc7L2c7XG5cbiAgLyoqIFVzZWQgdG8gbWF0Y2ggcmVnZXhwIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzICovXG4gIHZhciByZUZsYWdzID0gL1xcdyokLztcblxuICAvKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlICovXG4gIHZhciByZU5hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICAgIChvYmplY3RSZWYudmFsdWVPZiArICcnKVxuICAgICAgLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJylcbiAgICAgIC5yZXBsYWNlKC92YWx1ZU9mfGZvciBbXlxcXV0rL2csICcuKz8nKSArICckJ1xuICApO1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIG1hdGNoIEVTNiB0ZW1wbGF0ZSBkZWxpbWl0ZXJzXG4gICAqIGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLTcuOC42XG4gICAqL1xuICB2YXIgcmVFc1RlbXBsYXRlID0gL1xcJFxceyhbXlxcXFx9XSooPzpcXFxcLlteXFxcXH1dKikqKVxcfS9nO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIFwiaW50ZXJwb2xhdGVcIiB0ZW1wbGF0ZSBkZWxpbWl0ZXJzICovXG4gIHZhciByZUludGVycG9sYXRlID0gLzwlPShbXFxzXFxTXSs/KSU+L2c7XG5cbiAgLyoqIFVzZWQgdG8gZW5zdXJlIGNhcHR1cmluZyBvcmRlciBvZiB0ZW1wbGF0ZSBkZWxpbWl0ZXJzICovXG4gIHZhciByZU5vTWF0Y2ggPSAvKCReKS87XG5cbiAgLyoqIFVzZWQgdG8gbWF0Y2ggSFRNTCBjaGFyYWN0ZXJzICovXG4gIHZhciByZVVuZXNjYXBlZEh0bWwgPSAvWyY8PlwiJ10vZztcblxuICAvKiogVXNlZCB0byBtYXRjaCB1bmVzY2FwZWQgY2hhcmFjdGVycyBpbiBjb21waWxlZCBzdHJpbmcgbGl0ZXJhbHMgKi9cbiAgdmFyIHJlVW5lc2NhcGVkU3RyaW5nID0gL1snXFxuXFxyXFx0XFx1MjAyOFxcdTIwMjlcXFxcXS9nO1xuXG4gIC8qKiBVc2VkIHRvIG1ha2UgdGVtcGxhdGUgc291cmNlVVJMcyBlYXNpZXIgdG8gaWRlbnRpZnkgKi9cbiAgdmFyIHRlbXBsYXRlQ291bnRlciA9IDA7XG5cbiAgLyoqIE5hdGl2ZSBtZXRob2Qgc2hvcnRjdXRzICovXG4gIHZhciBjZWlsID0gTWF0aC5jZWlsLFxuICAgICAgY29uY2F0ID0gYXJyYXlSZWYuY29uY2F0LFxuICAgICAgZmxvb3IgPSBNYXRoLmZsb29yLFxuICAgICAgZ2V0UHJvdG90eXBlT2YgPSByZU5hdGl2ZS50ZXN0KGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKSAmJiBnZXRQcm90b3R5cGVPZixcbiAgICAgIGhhc093blByb3BlcnR5ID0gb2JqZWN0UmVmLmhhc093blByb3BlcnR5LFxuICAgICAgcHVzaCA9IGFycmF5UmVmLnB1c2gsXG4gICAgICB0b1N0cmluZyA9IG9iamVjdFJlZi50b1N0cmluZztcblxuICAvKiBOYXRpdmUgbWV0aG9kIHNob3J0Y3V0cyBmb3IgbWV0aG9kcyB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcyAqL1xuICB2YXIgbmF0aXZlQmluZCA9IHJlTmF0aXZlLnRlc3QobmF0aXZlQmluZCA9IHNsaWNlLmJpbmQpICYmIG5hdGl2ZUJpbmQsXG4gICAgICBuYXRpdmVJc0FycmF5ID0gcmVOYXRpdmUudGVzdChuYXRpdmVJc0FycmF5ID0gQXJyYXkuaXNBcnJheSkgJiYgbmF0aXZlSXNBcnJheSxcbiAgICAgIG5hdGl2ZUlzRmluaXRlID0gd2luZG93LmlzRmluaXRlLFxuICAgICAgbmF0aXZlSXNOYU4gPSB3aW5kb3cuaXNOYU4sXG4gICAgICBuYXRpdmVLZXlzID0gcmVOYXRpdmUudGVzdChuYXRpdmVLZXlzID0gT2JqZWN0LmtleXMpICYmIG5hdGl2ZUtleXMsXG4gICAgICBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluLFxuICAgICAgbmF0aXZlUmFuZG9tID0gTWF0aC5yYW5kb207XG5cbiAgLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCBzaG9ydGN1dHMgKi9cbiAgdmFyIGFyZ3NDbGFzcyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgICAgYXJyYXlDbGFzcyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgICBib29sQ2xhc3MgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgICBkYXRlQ2xhc3MgPSAnW29iamVjdCBEYXRlXScsXG4gICAgICBmdW5jQ2xhc3MgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgICAgbnVtYmVyQ2xhc3MgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICAgIG9iamVjdENsYXNzID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgICByZWdleHBDbGFzcyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgICAgc3RyaW5nQ2xhc3MgPSAnW29iamVjdCBTdHJpbmddJztcblxuICAvKiogRGV0ZWN0IHZhcmlvdXMgZW52aXJvbm1lbnRzICovXG4gIHZhciBpc0llT3BlcmEgPSAhIXdpbmRvdy5hdHRhY2hFdmVudCxcbiAgICAgIGlzVjggPSBuYXRpdmVCaW5kICYmICEvXFxufHRydWUvLnRlc3QobmF0aXZlQmluZCArIGlzSWVPcGVyYSk7XG5cbiAgLyogRGV0ZWN0IGlmIGBGdW5jdGlvbiNiaW5kYCBleGlzdHMgYW5kIGlzIGluZmVycmVkIHRvIGJlIGZhc3QgKGFsbCBidXQgVjgpICovXG4gIHZhciBpc0JpbmRGYXN0ID0gbmF0aXZlQmluZCAmJiAhaXNWODtcblxuICAvKiBEZXRlY3QgaWYgYE9iamVjdC5rZXlzYCBleGlzdHMgYW5kIGlzIGluZmVycmVkIHRvIGJlIGZhc3QgKElFLCBPcGVyYSwgVjgpICovXG4gIHZhciBpc0tleXNGYXN0ID0gbmF0aXZlS2V5cyAmJiAoaXNJZU9wZXJhIHx8IGlzVjgpO1xuXG4gIC8qKiBVc2VkIHRvIGlkZW50aWZ5IG9iamVjdCBjbGFzc2lmaWNhdGlvbnMgdGhhdCBgXy5jbG9uZWAgc3VwcG9ydHMgKi9cbiAgdmFyIGNsb25lYWJsZUNsYXNzZXMgPSB7fTtcbiAgY2xvbmVhYmxlQ2xhc3Nlc1tmdW5jQ2xhc3NdID0gZmFsc2U7XG4gIGNsb25lYWJsZUNsYXNzZXNbYXJnc0NsYXNzXSA9IGNsb25lYWJsZUNsYXNzZXNbYXJyYXlDbGFzc10gPVxuICBjbG9uZWFibGVDbGFzc2VzW2Jvb2xDbGFzc10gPSBjbG9uZWFibGVDbGFzc2VzW2RhdGVDbGFzc10gPVxuICBjbG9uZWFibGVDbGFzc2VzW251bWJlckNsYXNzXSA9IGNsb25lYWJsZUNsYXNzZXNbb2JqZWN0Q2xhc3NdID1cbiAgY2xvbmVhYmxlQ2xhc3Nlc1tyZWdleHBDbGFzc10gPSBjbG9uZWFibGVDbGFzc2VzW3N0cmluZ0NsYXNzXSA9IHRydWU7XG5cbiAgLyoqIFVzZWQgdG8gbG9va3VwIGEgYnVpbHQtaW4gY29uc3RydWN0b3IgYnkgW1tDbGFzc11dICovXG4gIHZhciBjdG9yQnlDbGFzcyA9IHt9O1xuICBjdG9yQnlDbGFzc1thcnJheUNsYXNzXSA9IEFycmF5O1xuICBjdG9yQnlDbGFzc1tib29sQ2xhc3NdID0gQm9vbGVhbjtcbiAgY3RvckJ5Q2xhc3NbZGF0ZUNsYXNzXSA9IERhdGU7XG4gIGN0b3JCeUNsYXNzW29iamVjdENsYXNzXSA9IE9iamVjdDtcbiAgY3RvckJ5Q2xhc3NbbnVtYmVyQ2xhc3NdID0gTnVtYmVyO1xuICBjdG9yQnlDbGFzc1tyZWdleHBDbGFzc10gPSBSZWdFeHA7XG4gIGN0b3JCeUNsYXNzW3N0cmluZ0NsYXNzXSA9IFN0cmluZztcblxuICAvKiogVXNlZCB0byBkZXRlcm1pbmUgaWYgdmFsdWVzIGFyZSBvZiB0aGUgbGFuZ3VhZ2UgdHlwZSBPYmplY3QgKi9cbiAgdmFyIG9iamVjdFR5cGVzID0ge1xuICAgICdib29sZWFuJzogZmFsc2UsXG4gICAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgICAnb2JqZWN0JzogdHJ1ZSxcbiAgICAnbnVtYmVyJzogZmFsc2UsXG4gICAgJ3N0cmluZyc6IGZhbHNlLFxuICAgICd1bmRlZmluZWQnOiBmYWxzZVxuICB9O1xuXG4gIC8qKiBVc2VkIHRvIGVzY2FwZSBjaGFyYWN0ZXJzIGZvciBpbmNsdXNpb24gaW4gY29tcGlsZWQgc3RyaW5nIGxpdGVyYWxzICovXG4gIHZhciBzdHJpbmdFc2NhcGVzID0ge1xuICAgICdcXFxcJzogJ1xcXFwnLFxuICAgIFwiJ1wiOiBcIidcIixcbiAgICAnXFxuJzogJ24nLFxuICAgICdcXHInOiAncicsXG4gICAgJ1xcdCc6ICd0JyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgbG9kYXNoYCBvYmplY3QsIHRoYXQgd3JhcHMgdGhlIGdpdmVuIGB2YWx1ZWAsIHRvIGVuYWJsZSBtZXRob2RcbiAgICogY2hhaW5pbmcuXG4gICAqXG4gICAqIEluIGFkZGl0aW9uIHRvIExvLURhc2ggbWV0aG9kcywgd3JhcHBlcnMgYWxzbyBoYXZlIHRoZSBmb2xsb3dpbmcgYEFycmF5YCBtZXRob2RzOlxuICAgKiBgY29uY2F0YCwgYGpvaW5gLCBgcG9wYCwgYHB1c2hgLCBgcmV2ZXJzZWAsIGBzaGlmdGAsIGBzbGljZWAsIGBzb3J0YCwgYHNwbGljZWAsXG4gICAqIGFuZCBgdW5zaGlmdGBcbiAgICpcbiAgICogVGhlIGNoYWluYWJsZSB3cmFwcGVyIGZ1bmN0aW9ucyBhcmU6XG4gICAqIGBhZnRlcmAsIGBhc3NpZ25gLCBgYmluZGAsIGBiaW5kQWxsYCwgYGJpbmRLZXlgLCBgY2hhaW5gLCBgY29tcGFjdGAsIGBjb21wb3NlYCxcbiAgICogYGNvbmNhdGAsIGBjb3VudEJ5YCwgYGRlYm91bmNlYCwgYGRlZmF1bHRzYCwgYGRlZmVyYCwgYGRlbGF5YCwgYGRpZmZlcmVuY2VgLFxuICAgKiBgZmlsdGVyYCwgYGZsYXR0ZW5gLCBgZm9yRWFjaGAsIGBmb3JJbmAsIGBmb3JPd25gLCBgZnVuY3Rpb25zYCwgYGdyb3VwQnlgLFxuICAgKiBgaW5pdGlhbGAsIGBpbnRlcnNlY3Rpb25gLCBgaW52ZXJ0YCwgYGludm9rZWAsIGBrZXlzYCwgYG1hcGAsIGBtYXhgLCBgbWVtb2l6ZWAsXG4gICAqIGBtZXJnZWAsIGBtaW5gLCBgb2JqZWN0YCwgYG9taXRgLCBgb25jZWAsIGBwYWlyc2AsIGBwYXJ0aWFsYCwgYHBhcnRpYWxSaWdodGAsXG4gICAqIGBwaWNrYCwgYHBsdWNrYCwgYHB1c2hgLCBgcmFuZ2VgLCBgcmVqZWN0YCwgYHJlc3RgLCBgcmV2ZXJzZWAsIGBzaHVmZmxlYCxcbiAgICogYHNsaWNlYCwgYHNvcnRgLCBgc29ydEJ5YCwgYHNwbGljZWAsIGB0YXBgLCBgdGhyb3R0bGVgLCBgdGltZXNgLCBgdG9BcnJheWAsXG4gICAqIGB1bmlvbmAsIGB1bmlxYCwgYHVuc2hpZnRgLCBgdmFsdWVzYCwgYHdoZXJlYCwgYHdpdGhvdXRgLCBgd3JhcGAsIGFuZCBgemlwYFxuICAgKlxuICAgKiBUaGUgbm9uLWNoYWluYWJsZSB3cmFwcGVyIGZ1bmN0aW9ucyBhcmU6XG4gICAqIGBjbG9uZWAsIGBjbG9uZURlZXBgLCBgY29udGFpbnNgLCBgZXNjYXBlYCwgYGV2ZXJ5YCwgYGZpbmRgLCBgaGFzYCwgYGlkZW50aXR5YCxcbiAgICogYGluZGV4T2ZgLCBgaXNBcmd1bWVudHNgLCBgaXNBcnJheWAsIGBpc0Jvb2xlYW5gLCBgaXNEYXRlYCwgYGlzRWxlbWVudGAsIGBpc0VtcHR5YCxcbiAgICogYGlzRXF1YWxgLCBgaXNGaW5pdGVgLCBgaXNGdW5jdGlvbmAsIGBpc05hTmAsIGBpc051bGxgLCBgaXNOdW1iZXJgLCBgaXNPYmplY3RgLFxuICAgKiBgaXNQbGFpbk9iamVjdGAsIGBpc1JlZ0V4cGAsIGBpc1N0cmluZ2AsIGBpc1VuZGVmaW5lZGAsIGBqb2luYCwgYGxhc3RJbmRleE9mYCxcbiAgICogYG1peGluYCwgYG5vQ29uZmxpY3RgLCBgcG9wYCwgYHJhbmRvbWAsIGByZWR1Y2VgLCBgcmVkdWNlUmlnaHRgLCBgcmVzdWx0YCxcbiAgICogYHNoaWZ0YCwgYHNpemVgLCBgc29tZWAsIGBzb3J0ZWRJbmRleGAsIGB0ZW1wbGF0ZWAsIGB1bmVzY2FwZWAsIGFuZCBgdW5pcXVlSWRgXG4gICAqXG4gICAqIFRoZSB3cmFwcGVyIGZ1bmN0aW9ucyBgZmlyc3RgIGFuZCBgbGFzdGAgcmV0dXJuIHdyYXBwZWQgdmFsdWVzIHdoZW4gYG5gIGlzXG4gICAqIHBhc3NlZCwgb3RoZXJ3aXNlIHRoZXkgcmV0dXJuIHVud3JhcHBlZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBuYW1lIF9cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGBsb2Rhc2hgIGluc3RhbmNlLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGEgYGxvZGFzaGAgaW5zdGFuY2UuXG4gICAqL1xuICBmdW5jdGlvbiBsb2Rhc2godmFsdWUpIHtcbiAgICAvLyBleGl0IGVhcmx5IGlmIGFscmVhZHkgd3JhcHBlZCwgZXZlbiBpZiB3cmFwcGVkIGJ5IGEgZGlmZmVyZW50IGBsb2Rhc2hgIGNvbnN0cnVjdG9yXG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB2YWx1ZS5fX3dyYXBwZWRfXykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICAvLyBhbGxvdyBpbnZva2luZyBgbG9kYXNoYCB3aXRob3V0IHRoZSBgbmV3YCBvcGVyYXRvclxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBsb2Rhc2gpKSB7XG4gICAgICByZXR1cm4gbmV3IGxvZGFzaCh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuX193cmFwcGVkX18gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgdGVtcGxhdGUgZGVsaW1pdGVycyB1c2VkIGJ5IExvLURhc2ggYXJlIHNpbWlsYXIgdG8gdGhvc2UgaW5cbiAgICogZW1iZWRkZWQgUnVieSAoRVJCKS4gQ2hhbmdlIHRoZSBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlXG4gICAqIGRlbGltaXRlcnMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHR5cGUgT2JqZWN0XG4gICAqL1xuICBsb2Rhc2gudGVtcGxhdGVTZXR0aW5ncyA9IHtcblxuICAgIC8qKlxuICAgICAqIFVzZWQgdG8gZGV0ZWN0IGBkYXRhYCBwcm9wZXJ0eSB2YWx1ZXMgdG8gYmUgSFRNTC1lc2NhcGVkLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5nc1xuICAgICAqIEB0eXBlIFJlZ0V4cFxuICAgICAqL1xuICAgICdlc2NhcGUnOiAvPCUtKFtcXHNcXFNdKz8pJT4vZyxcblxuICAgIC8qKlxuICAgICAqIFVzZWQgdG8gZGV0ZWN0IGNvZGUgdG8gYmUgZXZhbHVhdGVkLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5nc1xuICAgICAqIEB0eXBlIFJlZ0V4cFxuICAgICAqL1xuICAgICdldmFsdWF0ZSc6IC88JShbXFxzXFxTXSs/KSU+L2csXG5cbiAgICAvKipcbiAgICAgKiBVc2VkIHRvIGRldGVjdCBgZGF0YWAgcHJvcGVydHkgdmFsdWVzIHRvIGluamVjdC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBfLnRlbXBsYXRlU2V0dGluZ3NcbiAgICAgKiBAdHlwZSBSZWdFeHBcbiAgICAgKi9cbiAgICAnaW50ZXJwb2xhdGUnOiByZUludGVycG9sYXRlLFxuXG4gICAgLyoqXG4gICAgICogVXNlZCB0byByZWZlcmVuY2UgdGhlIGRhdGEgb2JqZWN0IGluIHRoZSB0ZW1wbGF0ZSB0ZXh0LlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5nc1xuICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAqL1xuICAgICd2YXJpYWJsZSc6ICcnLFxuXG4gICAgLyoqXG4gICAgICogVXNlZCB0byBpbXBvcnQgdmFyaWFibGVzIGludG8gdGhlIGNvbXBpbGVkIHRlbXBsYXRlLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5nc1xuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgICdpbXBvcnRzJzoge1xuXG4gICAgICAvKipcbiAgICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzLmltcG9ydHNcbiAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgKi9cbiAgICAgICdfJzogbG9kYXNoXG4gICAgfVxuICB9O1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBUaGUgdGVtcGxhdGUgdXNlZCB0byBjcmVhdGUgaXRlcmF0b3IgZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iZWN0fSBkYXRhIFRoZSBkYXRhIG9iamVjdCB1c2VkIHRvIHBvcHVsYXRlIHRoZSB0ZXh0LlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm5zIHRoZSBpbnRlcnBvbGF0ZWQgdGV4dC5cbiAgICovXG4gIHZhciBpdGVyYXRvclRlbXBsYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgXG4gICAgdmFyIF9fcCA9ICd2YXIgaW5kZXgsIGl0ZXJhYmxlID0gJyArXG4gICAgKG9iai5maXJzdEFyZyApICtcbiAgICAnLCByZXN1bHQgPSBpdGVyYWJsZTtcXG5pZiAoIWl0ZXJhYmxlKSByZXR1cm4gcmVzdWx0O1xcbicgK1xuICAgIChvYmoudG9wICkgK1xuICAgICc7XFxuJztcbiAgICAgaWYgKG9iai5hcnJheXMpIHtcbiAgICBfX3AgKz0gJ3ZhciBsZW5ndGggPSBpdGVyYWJsZS5sZW5ndGg7IGluZGV4ID0gLTE7XFxuaWYgKCcgK1xuICAgIChvYmouYXJyYXlzICkgK1xuICAgICcpIHtcXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XFxuICAgICcgK1xuICAgIChvYmoubG9vcCApICtcbiAgICAnXFxuICB9XFxufVxcbmVsc2UgeyAgJztcbiAgICAgfSA7XG4gICAgXG4gICAgIGlmIChvYmouaXNLZXlzRmFzdCAmJiBvYmoudXNlSGFzKSB7XG4gICAgX19wICs9ICdcXG4gIHZhciBvd25JbmRleCA9IC0xLFxcbiAgICAgIG93blByb3BzID0gb2JqZWN0VHlwZXNbdHlwZW9mIGl0ZXJhYmxlXSA/IG5hdGl2ZUtleXMoaXRlcmFibGUpIDogW10sXFxuICAgICAgbGVuZ3RoID0gb3duUHJvcHMubGVuZ3RoO1xcblxcbiAgd2hpbGUgKCsrb3duSW5kZXggPCBsZW5ndGgpIHtcXG4gICAgaW5kZXggPSBvd25Qcm9wc1tvd25JbmRleF07XFxuICAgICcgK1xuICAgIChvYmoubG9vcCApICtcbiAgICAnXFxuICB9ICAnO1xuICAgICB9IGVsc2Uge1xuICAgIF9fcCArPSAnXFxuICBmb3IgKGluZGV4IGluIGl0ZXJhYmxlKSB7JztcbiAgICAgICAgaWYgKG9iai51c2VIYXMpIHtcbiAgICBfX3AgKz0gJ1xcbiAgICBpZiAoJztcbiAgICAgICAgICBpZiAob2JqLnVzZUhhcykge1xuICAgIF9fcCArPSAnaGFzT3duUHJvcGVydHkuY2FsbChpdGVyYWJsZSwgaW5kZXgpJztcbiAgICAgfSAgICA7XG4gICAgX19wICs9ICcpIHsgICAgJztcbiAgICAgfSA7XG4gICAgX19wICs9IFxuICAgIChvYmoubG9vcCApICtcbiAgICAnOyAgICAnO1xuICAgICBpZiAob2JqLnVzZUhhcykge1xuICAgIF9fcCArPSAnXFxuICAgIH0nO1xuICAgICB9IDtcbiAgICBfX3AgKz0gJ1xcbiAgfSAgJztcbiAgICAgfSA7XG4gICAgXG4gICAgIGlmIChvYmouYXJyYXlzKSB7XG4gICAgX19wICs9ICdcXG59JztcbiAgICAgfSA7XG4gICAgX19wICs9IFxuICAgIChvYmouYm90dG9tICkgK1xuICAgICc7XFxucmV0dXJuIHJlc3VsdCc7XG4gICAgXG4gICAgXG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIC8qKiBSZXVzYWJsZSBpdGVyYXRvciBvcHRpb25zIGZvciBgYXNzaWduYCBhbmQgYGRlZmF1bHRzYCAqL1xuICB2YXIgZGVmYXVsdHNJdGVyYXRvck9wdGlvbnMgPSB7XG4gICAgJ2FyZ3MnOiAnb2JqZWN0LCBzb3VyY2UsIGd1YXJkJyxcbiAgICAndG9wJzpcbiAgICAgICd2YXIgYXJncyA9IGFyZ3VtZW50cyxcXG4nICtcbiAgICAgICcgICAgYXJnc0luZGV4ID0gMCxcXG4nICtcbiAgICAgIFwiICAgIGFyZ3NMZW5ndGggPSB0eXBlb2YgZ3VhcmQgPT0gJ251bWJlcicgPyAyIDogYXJncy5sZW5ndGg7XFxuXCIgK1xuICAgICAgJ3doaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcXG4nICtcbiAgICAgICcgIGl0ZXJhYmxlID0gYXJnc1thcmdzSW5kZXhdO1xcbicgK1xuICAgICAgJyAgaWYgKGl0ZXJhYmxlICYmIG9iamVjdFR5cGVzW3R5cGVvZiBpdGVyYWJsZV0pIHsnLFxuICAgICdsb29wJzogXCJpZiAodHlwZW9mIHJlc3VsdFtpbmRleF0gPT0gJ3VuZGVmaW5lZCcpIHJlc3VsdFtpbmRleF0gPSBpdGVyYWJsZVtpbmRleF1cIixcbiAgICAnYm90dG9tJzogJyAgfVxcbn0nXG4gIH07XG5cbiAgLyoqIFJldXNhYmxlIGl0ZXJhdG9yIG9wdGlvbnMgc2hhcmVkIGJ5IGBlYWNoYCwgYGZvckluYCwgYW5kIGBmb3JPd25gICovXG4gIHZhciBlYWNoSXRlcmF0b3JPcHRpb25zID0ge1xuICAgICdhcmdzJzogJ2NvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnJyxcbiAgICAndG9wJzogXCJjYWxsYmFjayA9IGNhbGxiYWNrICYmIHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnID8gY2FsbGJhY2sgOiBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZylcIixcbiAgICAnYXJyYXlzJzogXCJ0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInXCIsXG4gICAgJ2xvb3AnOiAnaWYgKGNhbGxiYWNrKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGNvbGxlY3Rpb24pID09PSBmYWxzZSkgcmV0dXJuIHJlc3VsdCdcbiAgfTtcblxuICAvKiogUmV1c2FibGUgaXRlcmF0b3Igb3B0aW9ucyBmb3IgYGZvckluYCBhbmQgYGZvck93bmAgKi9cbiAgdmFyIGZvck93bkl0ZXJhdG9yT3B0aW9ucyA9IHtcbiAgICAndG9wJzogJ2lmICghb2JqZWN0VHlwZXNbdHlwZW9mIGl0ZXJhYmxlXSkgcmV0dXJuIHJlc3VsdDtcXG4nICsgZWFjaEl0ZXJhdG9yT3B0aW9ucy50b3AsXG4gICAgJ2FycmF5cyc6IGZhbHNlXG4gIH07XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiBvcHRpbWl6ZWQgdG8gc2VhcmNoIGxhcmdlIGFycmF5cyBmb3IgYSBnaXZlbiBgdmFsdWVgLFxuICAgKiBzdGFydGluZyBhdCBgZnJvbUluZGV4YCwgdXNpbmcgc3RyaWN0IGVxdWFsaXR5IGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtsYXJnZVNpemU9MzBdIFRoZSBsZW5ndGggYXQgd2hpY2ggYW4gYXJyYXkgaXMgY29uc2lkZXJlZCBsYXJnZS5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgYHRydWVgLCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBjYWNoZWRDb250YWlucyhhcnJheSwgZnJvbUluZGV4LCBsYXJnZVNpemUpIHtcbiAgICBmcm9tSW5kZXggfHwgKGZyb21JbmRleCA9IDApO1xuXG4gICAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgICAgaXNMYXJnZSA9IChsZW5ndGggLSBmcm9tSW5kZXgpID49IChsYXJnZVNpemUgfHwgbGFyZ2VBcnJheVNpemUpO1xuXG4gICAgaWYgKGlzTGFyZ2UpIHtcbiAgICAgIHZhciBjYWNoZSA9IHt9LFxuICAgICAgICAgIGluZGV4ID0gZnJvbUluZGV4IC0gMTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgLy8gbWFudWFsbHkgY29lcmNlIGB2YWx1ZWAgdG8gYSBzdHJpbmcgYmVjYXVzZSBgaGFzT3duUHJvcGVydHlgLCBpbiBzb21lXG4gICAgICAgIC8vIG9sZGVyIHZlcnNpb25zIG9mIEZpcmVmb3gsIGNvZXJjZXMgb2JqZWN0cyBpbmNvcnJlY3RseVxuICAgICAgICB2YXIga2V5ID0gYXJyYXlbaW5kZXhdICsgJyc7XG4gICAgICAgIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNhY2hlLCBrZXkpID8gY2FjaGVba2V5XSA6IChjYWNoZVtrZXldID0gW10pKS5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKGlzTGFyZ2UpIHtcbiAgICAgICAgdmFyIGtleSA9IHZhbHVlICsgJyc7XG4gICAgICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGNhY2hlLCBrZXkpICYmIGluZGV4T2YoY2FjaGVba2V5XSwgdmFsdWUpID4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkgPiAtMTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBieSBgXy5tYXhgIGFuZCBgXy5taW5gIGFzIHRoZSBkZWZhdWx0IGBjYWxsYmFja2Agd2hlbiBhIGdpdmVuXG4gICAqIGBjb2xsZWN0aW9uYCBpcyBhIHN0cmluZyB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFRoZSBjaGFyYWN0ZXIgdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge051bWJlcn0gUmV0dXJucyB0aGUgY29kZSB1bml0IG9mIGdpdmVuIGNoYXJhY3Rlci5cbiAgICovXG4gIGZ1bmN0aW9uIGNoYXJBdENhbGxiYWNrKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLmNoYXJDb2RlQXQoMCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBieSBgc29ydEJ5YCB0byBjb21wYXJlIHRyYW5zZm9ybWVkIGBjb2xsZWN0aW9uYCB2YWx1ZXMsIHN0YWJsZSBzb3J0aW5nXG4gICAqIHRoZW0gaW4gYXNjZW5kaW5nIG9yZGVyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGNvbXBhcmUgdG8gYGJgLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvbXBhcmUgdG8gYGFgLlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm5zIHRoZSBzb3J0IG9yZGVyIGluZGljYXRvciBvZiBgMWAgb3IgYC0xYC5cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmVBc2NlbmRpbmcoYSwgYikge1xuICAgIHZhciBhaSA9IGEuaW5kZXgsXG4gICAgICAgIGJpID0gYi5pbmRleDtcblxuICAgIGEgPSBhLmNyaXRlcmlhO1xuICAgIGIgPSBiLmNyaXRlcmlhO1xuXG4gICAgLy8gZW5zdXJlIGEgc3RhYmxlIHNvcnQgaW4gVjggYW5kIG90aGVyIGVuZ2luZXNcbiAgICAvLyBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD05MFxuICAgIGlmIChhICE9PSBiKSB7XG4gICAgICBpZiAoYSA+IGIgfHwgdHlwZW9mIGEgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICBpZiAoYSA8IGIgfHwgdHlwZW9mIGIgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYWkgPCBiaSA/IC0xIDogMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsIGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nXG4gICAqIG9mIGB0aGlzQXJnYCBhbmQgcHJlcGVuZHMgYW55IGBwYXJ0aWFsQXJnc2AgdG8gdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlXG4gICAqIGJvdW5kIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYmluZCBvciB0aGUgbWV0aG9kIG5hbWUuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICAgKiBAcGFyYW0ge0FycmF5fSBwYXJ0aWFsQXJncyBBbiBhcnJheSBvZiBhcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcmlnaHRJbmRpY2F0b3JdIFVzZWQgdG8gaW5kaWNhdGUgcGFydGlhbGx5IGFwcGx5aW5nIGFyZ3VtZW50cyBmcm9tIHRoZSByaWdodC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYm91bmQgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVCb3VuZChmdW5jLCB0aGlzQXJnLCBwYXJ0aWFsQXJncywgcmlnaHRJbmRpY2F0b3IpIHtcbiAgICB2YXIgaXNGdW5jID0gaXNGdW5jdGlvbihmdW5jKSxcbiAgICAgICAgaXNQYXJ0aWFsID0gIXBhcnRpYWxBcmdzLFxuICAgICAgICBrZXkgPSB0aGlzQXJnO1xuXG4gICAgLy8ganVnZ2xlIGFyZ3VtZW50c1xuICAgIGlmIChpc1BhcnRpYWwpIHtcbiAgICAgIHBhcnRpYWxBcmdzID0gdGhpc0FyZztcbiAgICB9XG4gICAgaWYgKCFpc0Z1bmMpIHtcbiAgICAgIHRoaXNBcmcgPSBmdW5jO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJvdW5kKCkge1xuICAgICAgLy8gYEZ1bmN0aW9uI2JpbmRgIHNwZWNcbiAgICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjMuNC41XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICB0aGlzQmluZGluZyA9IGlzUGFydGlhbCA/IHRoaXMgOiB0aGlzQXJnO1xuXG4gICAgICBpZiAoIWlzRnVuYykge1xuICAgICAgICBmdW5jID0gdGhpc0FyZ1trZXldO1xuICAgICAgfVxuICAgICAgaWYgKHBhcnRpYWxBcmdzLmxlbmd0aCkge1xuICAgICAgICBhcmdzID0gYXJncy5sZW5ndGhcbiAgICAgICAgICA/IChhcmdzID0gc2xpY2UoYXJncyksIHJpZ2h0SW5kaWNhdG9yID8gYXJncy5jb25jYXQocGFydGlhbEFyZ3MpIDogcGFydGlhbEFyZ3MuY29uY2F0KGFyZ3MpKVxuICAgICAgICAgIDogcGFydGlhbEFyZ3M7XG4gICAgICB9XG4gICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgIC8vIGVuc3VyZSBgbmV3IGJvdW5kYCBpcyBhbiBpbnN0YW5jZSBvZiBgYm91bmRgIGFuZCBgZnVuY2BcbiAgICAgICAgbm9vcC5wcm90b3R5cGUgPSBmdW5jLnByb3RvdHlwZTtcbiAgICAgICAgdGhpc0JpbmRpbmcgPSBuZXcgbm9vcDtcbiAgICAgICAgbm9vcC5wcm90b3R5cGUgPSBudWxsO1xuXG4gICAgICAgIC8vIG1pbWljIHRoZSBjb25zdHJ1Y3RvcidzIGByZXR1cm5gIGJlaGF2aW9yXG4gICAgICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDEzLjIuMlxuICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQmluZGluZywgYXJncyk7XG4gICAgICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogdGhpc0JpbmRpbmc7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQmluZGluZywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiBib3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlcyBhIGNhbGxiYWNrIGJvdW5kIHRvIGFuIG9wdGlvbmFsIGB0aGlzQXJnYC4gSWYgYGZ1bmNgIGlzIGEgcHJvcGVydHlcbiAgICogbmFtZSwgdGhlIGNyZWF0ZWQgY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIGZvciBhIGdpdmVuIGVsZW1lbnQuXG4gICAqIElmIGBmdW5jYCBpcyBhbiBvYmplY3QsIHRoZSBjcmVhdGVkIGNhbGxiYWNrIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHNcbiAgICogdGhhdCBjb250YWluIHRoZSBlcXVpdmFsZW50IG9iamVjdCBwcm9wZXJ0aWVzLCBvdGhlcndpc2UgaXQgd2lsbCByZXR1cm4gYGZhbHNlYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtNaXhlZH0gW2Z1bmM9aWRlbnRpdHldIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGEgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIGNyZWF0ZWQgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbYXJnQ291bnQ9M10gVGhlIG51bWJlciBvZiBhcmd1bWVudHMgdGhlIGNhbGxiYWNrIGFjY2VwdHMuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlQ2FsbGJhY2soZnVuYywgdGhpc0FyZywgYXJnQ291bnQpIHtcbiAgICBpZiAoZnVuYyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaWRlbnRpdHk7XG4gICAgfVxuICAgIHZhciB0eXBlID0gdHlwZW9mIGZ1bmM7XG4gICAgaWYgKHR5cGUgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKHR5cGUgIT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBvYmplY3RbZnVuY107XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB2YXIgcHJvcHMgPSBrZXlzKGZ1bmMpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICB2YXIgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAgIGlmICghKHJlc3VsdCA9IGlzRXF1YWwob2JqZWN0W3Byb3BzW2xlbmd0aF1dLCBmdW5jW3Byb3BzW2xlbmd0aF1dLCBpbmRpY2F0b3JPYmplY3QpKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXNBcmcgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmIChhcmdDb3VudCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChhcmdDb3VudCA9PT0gMikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYSwgYik7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoYXJnQ291bnQgPT09IDQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgb2JqZWN0KTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpbmRleCwgb2JqZWN0KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgY29tcGlsZWQgaXRlcmF0aW9uIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zMSwgb3B0aW9uczIsIC4uLl0gVGhlIGNvbXBpbGUgb3B0aW9ucyBvYmplY3QocykuXG4gICAqICBhcnJheXMgLSBBIHN0cmluZyBvZiBjb2RlIHRvIGRldGVybWluZSBpZiB0aGUgaXRlcmFibGUgaXMgYW4gYXJyYXkgb3IgYXJyYXktbGlrZS5cbiAgICogIHVzZUhhcyAtIEEgYm9vbGVhbiB0byBzcGVjaWZ5IHVzaW5nIGBoYXNPd25Qcm9wZXJ0eWAgY2hlY2tzIGluIHRoZSBvYmplY3QgbG9vcC5cbiAgICogIGFyZ3MgLSBBIHN0cmluZyBvZiBjb21tYSBzZXBhcmF0ZWQgYXJndW1lbnRzIHRoZSBpdGVyYXRpb24gZnVuY3Rpb24gd2lsbCBhY2NlcHQuXG4gICAqICB0b3AgLSBBIHN0cmluZyBvZiBjb2RlIHRvIGV4ZWN1dGUgYmVmb3JlIHRoZSBpdGVyYXRpb24gYnJhbmNoZXMuXG4gICAqICBsb29wIC0gQSBzdHJpbmcgb2YgY29kZSB0byBleGVjdXRlIGluIHRoZSBvYmplY3QgbG9vcC5cbiAgICogIGJvdHRvbSAtIEEgc3RyaW5nIG9mIGNvZGUgdG8gZXhlY3V0ZSBhZnRlciB0aGUgaXRlcmF0aW9uIGJyYW5jaGVzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlSXRlcmF0b3IoKSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAvLyBzdXBwb3J0IHByb3BlcnRpZXNcbiAgICAgICdpc0tleXNGYXN0JzogaXNLZXlzRmFzdCxcblxuICAgICAgLy8gaXRlcmF0b3Igb3B0aW9uc1xuICAgICAgJ2FycmF5cyc6ICdpc0FycmF5KGl0ZXJhYmxlKScsXG4gICAgICAnYm90dG9tJzogJycsXG4gICAgICAnbG9vcCc6ICcnLFxuICAgICAgJ3RvcCc6ICcnLFxuICAgICAgJ3VzZUhhcyc6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gbWVyZ2Ugb3B0aW9ucyBpbnRvIGEgdGVtcGxhdGUgZGF0YSBvYmplY3RcbiAgICBmb3IgKHZhciBvYmplY3QsIGluZGV4ID0gMDsgb2JqZWN0ID0gYXJndW1lbnRzW2luZGV4XTsgaW5kZXgrKykge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAgICBkYXRhW2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGFyZ3MgPSBkYXRhLmFyZ3M7XG4gICAgZGF0YS5maXJzdEFyZyA9IC9eW14sXSsvLmV4ZWMoYXJncylbMF07XG5cbiAgICAvLyBjcmVhdGUgdGhlIGZ1bmN0aW9uIGZhY3RvcnlcbiAgICB2YXIgZmFjdG9yeSA9IEZ1bmN0aW9uKFxuICAgICAgICAnY3JlYXRlQ2FsbGJhY2ssIGhhc093blByb3BlcnR5LCBpc0FyZ3VtZW50cywgaXNBcnJheSwgaXNTdHJpbmcsICcgK1xuICAgICAgICAnb2JqZWN0VHlwZXMsIG5hdGl2ZUtleXMnLFxuICAgICAgJ3JldHVybiBmdW5jdGlvbignICsgYXJncyArICcpIHtcXG4nICsgaXRlcmF0b3JUZW1wbGF0ZShkYXRhKSArICdcXG59J1xuICAgICk7XG4gICAgLy8gcmV0dXJuIHRoZSBjb21waWxlZCBmdW5jdGlvblxuICAgIHJldHVybiBmYWN0b3J5KFxuICAgICAgY3JlYXRlQ2FsbGJhY2ssIGhhc093blByb3BlcnR5LCBpc0FyZ3VtZW50cywgaXNBcnJheSwgaXNTdHJpbmcsXG4gICAgICBvYmplY3RUeXBlcywgbmF0aXZlS2V5c1xuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQSBmdW5jdGlvbiBjb21waWxlZCB0byBpdGVyYXRlIGBhcmd1bWVudHNgIG9iamVjdHMsIGFycmF5cywgb2JqZWN0cywgYW5kXG4gICAqIHN0cmluZ3MgY29uc2lzdGVubHkgYWNyb3NzIGVudmlyb25tZW50cywgZXhlY3V0aW5nIHRoZSBgY2FsbGJhY2tgIGZvciBlYWNoXG4gICAqIGVsZW1lbnQgaW4gdGhlIGBjb2xsZWN0aW9uYC4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkXG4gICAqIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuIENhbGxiYWNrcyBtYXkgZXhpdFxuICAgKiBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHR5cGUgRnVuY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICAgKi9cbiAgdmFyIGVhY2ggPSBjcmVhdGVJdGVyYXRvcihlYWNoSXRlcmF0b3JPcHRpb25zKTtcblxuICAvKipcbiAgICogVXNlZCBieSBgdGVtcGxhdGVgIHRvIGVzY2FwZSBjaGFyYWN0ZXJzIGZvciBpbmNsdXNpb24gaW4gY29tcGlsZWRcbiAgICogc3RyaW5nIGxpdGVyYWxzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWF0Y2ggVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAqL1xuICBmdW5jdGlvbiBlc2NhcGVTdHJpbmdDaGFyKG1hdGNoKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIHN0cmluZ0VzY2FwZXNbbWF0Y2hdO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgYGVzY2FwZWAgdG8gY29udmVydCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtYXRjaCBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICovXG4gIGZ1bmN0aW9uIGVzY2FwZUh0bWxDaGFyKG1hdGNoKSB7XG4gICAgcmV0dXJuIGh0bWxFc2NhcGVzW21hdGNoXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIERPTSBub2RlIGluIElFIDwgOS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBET00gbm9kZSwgZWxzZSBgZmFsc2VgLlxuICAgKi9cbiAgZnVuY3Rpb24gaXNOb2RlKHZhbHVlKSB7XG4gICAgLy8gSUUgPCA5IHByZXNlbnRzIERPTSBub2RlcyBhcyBgT2JqZWN0YCBvYmplY3RzIGV4Y2VwdCB0aGV5IGhhdmUgYHRvU3RyaW5nYFxuICAgIC8vIG1ldGhvZHMgdGhhdCBhcmUgYHR5cGVvZmAgXCJzdHJpbmdcIiBhbmQgc3RpbGwgY2FuIGNvZXJjZSBub2RlcyB0byBzdHJpbmdzXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZS50b1N0cmluZyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiAodmFsdWUgKyAnJykgPT0gJ3N0cmluZyc7XG4gIH1cblxuICAvKipcbiAgICogQSBuby1vcGVyYXRpb24gZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBub29wKCkge1xuICAgIC8vIG5vIG9wZXJhdGlvbiBwZXJmb3JtZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBTbGljZXMgdGhlIGBjb2xsZWN0aW9uYCBmcm9tIHRoZSBgc3RhcnRgIGluZGV4IHVwIHRvLCBidXQgbm90IGluY2x1ZGluZyxcbiAgICogdGhlIGBlbmRgIGluZGV4LlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQsIGluc3RlYWQgb2YgYEFycmF5I3NsaWNlYCwgdG8gc3VwcG9ydCBub2RlIGxpc3RzXG4gICAqIGluIElFIDwgOSBhbmQgdG8gZW5zdXJlIGRlbnNlIGFycmF5cyBhcmUgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBzbGljZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0IFRoZSBzdGFydCBpbmRleC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGVuZCBUaGUgZW5kIGluZGV4LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheS5cbiAgICovXG4gIGZ1bmN0aW9uIHNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gICAgc3RhcnQgfHwgKHN0YXJ0ID0gMCk7XG4gICAgaWYgKHR5cGVvZiBlbmQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGVuZCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGVuZCAtIHN0YXJ0IHx8IDAsXG4gICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gYXJyYXlbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBieSBgdW5lc2NhcGVgIHRvIGNvbnZlcnQgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWF0Y2ggVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIHVuZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm5zIHRoZSB1bmVzY2FwZWQgY2hhcmFjdGVyLlxuICAgKi9cbiAgZnVuY3Rpb24gdW5lc2NhcGVIdG1sQ2hhcihtYXRjaCkge1xuICAgIHJldHVybiBodG1sVW5lc2NhcGVzW21hdGNoXTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAsIGlmIHRoZSBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoZnVuY3Rpb24oKSB7IHJldHVybiBfLmlzQXJndW1lbnRzKGFyZ3VtZW50cyk7IH0pKDEsIDIsIDMpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFyZ3NDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIGBvYmplY3RgJ3Mgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLCBleGVjdXRpbmdcbiAgICogdGhlIGBjYWxsYmFja2AgZm9yIGVhY2ggcHJvcGVydHkuIFRoZSBgY2FsbGJhY2tgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmRcbiAgICogaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBrZXksIG9iamVjdCkuIENhbGxiYWNrcyBtYXkgZXhpdCBpdGVyYXRpb25cbiAgICogZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAdHlwZSBGdW5jdGlvblxuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiBEb2cobmFtZSkge1xuICAgKiAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAqIH1cbiAgICpcbiAgICogRG9nLnByb3RvdHlwZS5iYXJrID0gZnVuY3Rpb24oKSB7XG4gICAqICAgYWxlcnQoJ1dvb2YsIHdvb2YhJyk7XG4gICAqIH07XG4gICAqXG4gICAqIF8uZm9ySW4obmV3IERvZygnRGFnbnknKSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgKiAgIGFsZXJ0KGtleSk7XG4gICAqIH0pO1xuICAgKiAvLyA9PiBhbGVydHMgJ25hbWUnIGFuZCAnYmFyaycgKG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICAgKi9cbiAgdmFyIGZvckluID0gY3JlYXRlSXRlcmF0b3IoZWFjaEl0ZXJhdG9yT3B0aW9ucywgZm9yT3duSXRlcmF0b3JPcHRpb25zLCB7XG4gICAgJ3VzZUhhcyc6IGZhbHNlXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIGFuIG9iamVjdCdzIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMsIGV4ZWN1dGluZyB0aGUgYGNhbGxiYWNrYFxuICAgKiBmb3IgZWFjaCBwcm9wZXJ0eS4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWVcbiAgICogYXJndW1lbnRzOyAodmFsdWUsIGtleSwgb2JqZWN0KS4gQ2FsbGJhY2tzIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5XG4gICAqIHJldHVybmluZyBgZmFsc2VgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZm9yT3duKHsgJzAnOiAnemVybycsICcxJzogJ29uZScsICdsZW5ndGgnOiAyIH0sIGZ1bmN0aW9uKG51bSwga2V5KSB7XG4gICAqICAgYWxlcnQoa2V5KTtcbiAgICogfSk7XG4gICAqIC8vID0+IGFsZXJ0cyAnMCcsICcxJywgYW5kICdsZW5ndGgnIChvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAgICovXG4gIHZhciBmb3JPd24gPSBjcmVhdGVJdGVyYXRvcihlYWNoSXRlcmF0b3JPcHRpb25zLCBmb3JPd25JdGVyYXRvck9wdGlvbnMpO1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBSZXR1cm5zIGB0cnVlYCwgaWYgdGhlIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKGZ1bmN0aW9uKCkgeyByZXR1cm4gXy5pc0FycmF5KGFyZ3VtZW50cyk7IH0pKCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICB2YXIgaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBgaW5zdGFuY2VvZmAgbWF5IGNhdXNlIGEgbWVtb3J5IGxlYWsgaW4gSUUgNyBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3RcbiAgICAvLyBodHRwOi8vYWpheGlhbi5jb20vYXJjaGl2ZXMvd29ya2luZy1hcm91bmctdGhlLWluc3RhbmNlb2YtbWVtb3J5LWxlYWtcbiAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBcnJheSB8fCB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcnJheUNsYXNzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFycmF5IGNvbXBvc2VkIG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmtleXMoeyAnb25lJzogMSwgJ3R3byc6IDIsICd0aHJlZSc6IDMgfSk7XG4gICAqIC8vID0+IFsnb25lJywgJ3R3bycsICd0aHJlZSddIChvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAgICovXG4gIHZhciBrZXlzID0gIW5hdGl2ZUtleXMgPyBzaGltS2V5cyA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIG9mIGBpc1BsYWluT2JqZWN0YCB0aGF0IGNoZWNrcyBpZiBhIGdpdmVuIGB2YWx1ZWBcbiAgICogaXMgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLCBhc3N1bWluZyBvYmplY3RzIGNyZWF0ZWRcbiAgICogYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yIGhhdmUgbm8gaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcyBhbmQgdGhhdFxuICAgKiB0aGVyZSBhcmUgbm8gYE9iamVjdC5wcm90b3R5cGVgIGV4dGVuc2lvbnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgYHRydWVgLCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBzaGltSXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICAgIC8vIGF2b2lkIG5vbi1vYmplY3RzIGFuZCBmYWxzZSBwb3NpdGl2ZXMgZm9yIGBhcmd1bWVudHNgIG9iamVjdHNcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKCEodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIGNoZWNrIHRoYXQgdGhlIGNvbnN0cnVjdG9yIGlzIGBPYmplY3RgIChpLmUuIGBPYmplY3QgaW5zdGFuY2VvZiBPYmplY3RgKVxuICAgIHZhciBjdG9yID0gdmFsdWUuY29uc3RydWN0b3I7XG4gICAgaWYgKCghaXNGdW5jdGlvbihjdG9yKSkgfHwgY3RvciBpbnN0YW5jZW9mIGN0b3IpIHtcbiAgICAgIC8vIEluIG1vc3QgZW52aXJvbm1lbnRzIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzIGFyZSBpdGVyYXRlZCBiZWZvcmVcbiAgICAgIC8vIGl0cyBpbmhlcml0ZWQgcHJvcGVydGllcy4gSWYgdGhlIGxhc3QgaXRlcmF0ZWQgcHJvcGVydHkgaXMgYW4gb2JqZWN0J3NcbiAgICAgIC8vIG93biBwcm9wZXJ0eSB0aGVuIHRoZXJlIGFyZSBubyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICAgICAgZm9ySW4odmFsdWUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmVzdWx0ID0ga2V5O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0ID09PSBmYWxzZSB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEEgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5rZXlzYCB0aGF0IHByb2R1Y2VzIGFuIGFycmF5IG9mIHRoZVxuICAgKiBnaXZlbiBvYmplY3QncyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAgICovXG4gIGZ1bmN0aW9uIHNoaW1LZXlzKG9iamVjdCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3JPd24ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBjb252ZXJ0IGNoYXJhY3RlcnMgdG8gSFRNTCBlbnRpdGllczpcbiAgICpcbiAgICogVGhvdWdoIHRoZSBgPmAgY2hhcmFjdGVyIGlzIGVzY2FwZWQgZm9yIHN5bW1ldHJ5LCBjaGFyYWN0ZXJzIGxpa2UgYD5gIGFuZCBgL2BcbiAgICogZG9uJ3QgcmVxdWlyZSBlc2NhcGluZyBpbiBIVE1MIGFuZCBoYXZlIG5vIHNwZWNpYWwgbWVhbmluZyB1bmxlc3MgdGhleSdyZSBwYXJ0XG4gICAqIG9mIGEgdGFnIG9yIGFuIHVucXVvdGVkIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICogaHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvYW1iaWd1b3VzLWFtcGVyc2FuZHMgKHVuZGVyIFwic2VtaS1yZWxhdGVkIGZ1biBmYWN0XCIpXG4gICAqL1xuICB2YXIgaHRtbEVzY2FwZXMgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnXG4gIH07XG5cbiAgLyoqIFVzZWQgdG8gY29udmVydCBIVE1MIGVudGl0aWVzIHRvIGNoYXJhY3RlcnMgKi9cbiAgdmFyIGh0bWxVbmVzY2FwZXMgPSBpbnZlcnQoaHRtbEVzY2FwZXMpO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAgICogb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXMgd2lsbCBvdmVyd3JpdGUgcHJvcGVyeSBhc3NpZ25tZW50cyBvZiBwcmV2aW91c1xuICAgKiBzb3VyY2VzLiBJZiBhIGBjYWxsYmFja2AgZnVuY3Rpb24gaXMgcGFzc2VkLCBpdCB3aWxsIGJlIGV4ZWN1dGVkIHRvIHByb2R1Y2VcbiAgICogdGhlIGFzc2lnbmVkIHZhbHVlcy4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGhcbiAgICogdHdvIGFyZ3VtZW50czsgKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHR5cGUgRnVuY3Rpb25cbiAgICogQGFsaWFzIGV4dGVuZFxuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc291cmNlMSwgc291cmNlMiwgLi4uXSBUaGUgc291cmNlIG9iamVjdHMuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25pbmcgdmFsdWVzLlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5hc3NpZ24oeyAnbmFtZSc6ICdtb2UnIH0sIHsgJ2FnZSc6IDQwIH0pO1xuICAgKiAvLyA9PiB7ICduYW1lJzogJ21vZScsICdhZ2UnOiA0MCB9XG4gICAqXG4gICAqIHZhciBkZWZhdWx0cyA9IF8ucGFydGlhbFJpZ2h0KF8uYXNzaWduLCBmdW5jdGlvbihhLCBiKSB7XG4gICAqICAgcmV0dXJuIHR5cGVvZiBhID09ICd1bmRlZmluZWQnID8gYiA6IGE7XG4gICAqIH0pO1xuICAgKlxuICAgKiB2YXIgZm9vZCA9IHsgJ25hbWUnOiAnYXBwbGUnIH07XG4gICAqIGRlZmF1bHRzKGZvb2QsIHsgJ25hbWUnOiAnYmFuYW5hJywgJ3R5cGUnOiAnZnJ1aXQnIH0pO1xuICAgKiAvLyA9PiB7ICduYW1lJzogJ2FwcGxlJywgJ3R5cGUnOiAnZnJ1aXQnIH1cbiAgICovXG4gIHZhciBhc3NpZ24gPSBjcmVhdGVJdGVyYXRvcihkZWZhdWx0c0l0ZXJhdG9yT3B0aW9ucywge1xuICAgICd0b3AnOlxuICAgICAgZGVmYXVsdHNJdGVyYXRvck9wdGlvbnMudG9wLnJlcGxhY2UoJzsnLFxuICAgICAgICAnO1xcbicgK1xuICAgICAgICBcImlmIChhcmdzTGVuZ3RoID4gMyAmJiB0eXBlb2YgYXJnc1thcmdzTGVuZ3RoIC0gMl0gPT0gJ2Z1bmN0aW9uJykge1xcblwiICtcbiAgICAgICAgJyAgdmFyIGNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2soYXJnc1stLWFyZ3NMZW5ndGggLSAxXSwgYXJnc1thcmdzTGVuZ3RoLS1dLCAyKTtcXG4nICtcbiAgICAgICAgXCJ9IGVsc2UgaWYgKGFyZ3NMZW5ndGggPiAyICYmIHR5cGVvZiBhcmdzW2FyZ3NMZW5ndGggLSAxXSA9PSAnZnVuY3Rpb24nKSB7XFxuXCIgK1xuICAgICAgICAnICBjYWxsYmFjayA9IGFyZ3NbLS1hcmdzTGVuZ3RoXTtcXG4nICtcbiAgICAgICAgJ30nXG4gICAgICApLFxuICAgICdsb29wJzogJ3Jlc3VsdFtpbmRleF0gPSBjYWxsYmFjayA/IGNhbGxiYWNrKHJlc3VsdFtpbmRleF0sIGl0ZXJhYmxlW2luZGV4XSkgOiBpdGVyYWJsZVtpbmRleF0nXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHZhbHVlYC4gSWYgYGRlZXBgIGlzIGB0cnVlYCwgbmVzdGVkIG9iamVjdHMgd2lsbCBhbHNvXG4gICAqIGJlIGNsb25lZCwgb3RoZXJ3aXNlIHRoZXkgd2lsbCBiZSBhc3NpZ25lZCBieSByZWZlcmVuY2UuIElmIGEgYGNhbGxiYWNrYFxuICAgKiBmdW5jdGlvbiBpcyBwYXNzZWQsIGl0IHdpbGwgYmUgZXhlY3V0ZWQgdG8gcHJvZHVjZSB0aGUgY2xvbmVkIHZhbHVlcy4gSWZcbiAgICogYGNhbGxiYWNrYCByZXR1cm5zIGB1bmRlZmluZWRgLCBjbG9uaW5nIHdpbGwgYmUgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuXG4gICAqIFRoZSBgY2FsbGJhY2tgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDsgKHZhbHVlKS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2RlZXA9ZmFsc2VdIEEgZmxhZyB0byBpbmRpY2F0ZSBhIGRlZXAgY2xvbmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcGFyYW0tIHtBcnJheX0gW3N0YWNrQT1bXV0gSW50ZXJuYWxseSB1c2VkIHRvIHRyYWNrIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHBhcmFtLSB7QXJyYXl9IFtzdGFja0I9W11dIEludGVybmFsbHkgdXNlZCB0byBhc3NvY2lhdGUgY2xvbmVzIHdpdGggc291cmNlIGNvdW50ZXJwYXJ0cy5cbiAgICogQHJldHVybnMge01peGVkfSBSZXR1cm5zIHRoZSBjbG9uZWQgYHZhbHVlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIHN0b29nZXMgPSBbXG4gICAqICAgeyAnbmFtZSc6ICdtb2UnLCAnYWdlJzogNDAgfSxcbiAgICogICB7ICduYW1lJzogJ2xhcnJ5JywgJ2FnZSc6IDUwIH1cbiAgICogXTtcbiAgICpcbiAgICogdmFyIHNoYWxsb3cgPSBfLmNsb25lKHN0b29nZXMpO1xuICAgKiBzaGFsbG93WzBdID09PSBzdG9vZ2VzWzBdO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIHZhciBkZWVwID0gXy5jbG9uZShzdG9vZ2VzLCB0cnVlKTtcbiAgICogZGVlcFswXSA9PT0gc3Rvb2dlc1swXTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5taXhpbih7XG4gICAqICAgJ2Nsb25lJzogXy5wYXJ0aWFsUmlnaHQoXy5jbG9uZSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICogICAgIHJldHVybiBfLmlzRWxlbWVudCh2YWx1ZSkgPyB2YWx1ZS5jbG9uZU5vZGUoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgKiAgIH0pXG4gICAqIH0pO1xuICAgKlxuICAgKiB2YXIgY2xvbmUgPSBfLmNsb25lKGRvY3VtZW50LmJvZHkpO1xuICAgKiBjbG9uZS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICogLy8gPT4gMFxuICAgKi9cbiAgZnVuY3Rpb24gY2xvbmUodmFsdWUsIGRlZXAsIGNhbGxiYWNrLCB0aGlzQXJnLCBzdGFja0EsIHN0YWNrQikge1xuICAgIHZhciByZXN1bHQgPSB2YWx1ZTtcblxuICAgIC8vIGFsbG93cyB3b3JraW5nIHdpdGggXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMgd2l0aG91dCB1c2luZyB0aGVpciBgY2FsbGJhY2tgXG4gICAgLy8gYXJndW1lbnQsIGBpbmRleHxrZXlgLCBmb3IgdGhpcyBtZXRob2QncyBgY2FsbGJhY2tgXG4gICAgaWYgKHR5cGVvZiBkZWVwID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXNBcmcgPSBjYWxsYmFjaztcbiAgICAgIGNhbGxiYWNrID0gZGVlcDtcbiAgICAgIGRlZXAgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnID8gY2FsbGJhY2sgOiBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMSk7XG4gICAgICByZXN1bHQgPSBjYWxsYmFjayhyZXN1bHQpO1xuXG4gICAgICB2YXIgZG9uZSA9IHR5cGVvZiByZXN1bHQgIT0gJ3VuZGVmaW5lZCc7XG4gICAgICBpZiAoIWRvbmUpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGluc3BlY3QgW1tDbGFzc11dXG4gICAgdmFyIGlzT2JqID0gaXNPYmplY3QocmVzdWx0KTtcbiAgICBpZiAoaXNPYmopIHtcbiAgICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKHJlc3VsdCk7XG4gICAgICBpZiAoIWNsb25lYWJsZUNsYXNzZXNbY2xhc3NOYW1lXSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgdmFyIGlzQXJyID0gaXNBcnJheShyZXN1bHQpO1xuICAgIH1cbiAgICAvLyBzaGFsbG93IGNsb25lXG4gICAgaWYgKCFpc09iaiB8fCAhZGVlcCkge1xuICAgICAgcmV0dXJuIGlzT2JqICYmICFkb25lXG4gICAgICAgID8gKGlzQXJyID8gc2xpY2UocmVzdWx0KSA6IGFzc2lnbih7fSwgcmVzdWx0KSlcbiAgICAgICAgOiByZXN1bHQ7XG4gICAgfVxuICAgIHZhciBjdG9yID0gY3RvckJ5Q2xhc3NbY2xhc3NOYW1lXTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgY2FzZSBib29sQ2xhc3M6XG4gICAgICBjYXNlIGRhdGVDbGFzczpcbiAgICAgICAgcmV0dXJuIGRvbmUgPyByZXN1bHQgOiBuZXcgY3RvcigrcmVzdWx0KTtcblxuICAgICAgY2FzZSBudW1iZXJDbGFzczpcbiAgICAgIGNhc2Ugc3RyaW5nQ2xhc3M6XG4gICAgICAgIHJldHVybiBkb25lID8gcmVzdWx0IDogbmV3IGN0b3IocmVzdWx0KTtcblxuICAgICAgY2FzZSByZWdleHBDbGFzczpcbiAgICAgICAgcmV0dXJuIGRvbmUgPyByZXN1bHQgOiBjdG9yKHJlc3VsdC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhyZXN1bHQpKTtcbiAgICB9XG4gICAgLy8gY2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBjb3JyZXNwb25kaW5nIGNsb25lXG4gICAgc3RhY2tBIHx8IChzdGFja0EgPSBbXSk7XG4gICAgc3RhY2tCIHx8IChzdGFja0IgPSBbXSk7XG5cbiAgICB2YXIgbGVuZ3RoID0gc3RhY2tBLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIGlmIChzdGFja0FbbGVuZ3RoXSA9PSB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gc3RhY2tCW2xlbmd0aF07XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGluaXQgY2xvbmVkIG9iamVjdFxuICAgIGlmICghZG9uZSkge1xuICAgICAgcmVzdWx0ID0gaXNBcnIgPyBjdG9yKHJlc3VsdC5sZW5ndGgpIDoge307XG5cbiAgICAgIC8vIGFkZCBhcnJheSBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2BcbiAgICAgIGlmIChpc0Fycikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2luZGV4JykpIHtcbiAgICAgICAgICByZXN1bHQuaW5kZXggPSB2YWx1ZS5pbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2lucHV0JykpIHtcbiAgICAgICAgICByZXN1bHQuaW5wdXQgPSB2YWx1ZS5pbnB1dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBhZGQgdGhlIHNvdXJjZSB2YWx1ZSB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHNcbiAgICAvLyBhbmQgYXNzb2NpYXRlIGl0IHdpdGggaXRzIGNsb25lXG4gICAgc3RhY2tBLnB1c2godmFsdWUpO1xuICAgIHN0YWNrQi5wdXNoKHJlc3VsdCk7XG5cbiAgICAvLyByZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpXG4gICAgKGlzQXJyID8gZm9yRWFjaCA6IGZvck93bikoZG9uZSA/IHJlc3VsdCA6IHZhbHVlLCBmdW5jdGlvbihvYmpWYWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHRba2V5XSA9IGNsb25lKG9ialZhbHVlLCBkZWVwLCBjYWxsYmFjaywgdW5kZWZpbmVkLCBzdGFja0EsIHN0YWNrQik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBkZWVwIGNsb25lIG9mIGB2YWx1ZWAuIElmIGEgYGNhbGxiYWNrYCBmdW5jdGlvbiBpcyBwYXNzZWQsIGl0IHdpbGxcbiAgICogYmUgZXhlY3V0ZWQgdG8gcHJvZHVjZSB0aGUgY2xvbmVkIHZhbHVlcy4gSWYgYGNhbGxiYWNrYCByZXR1cm5zIHRoZSB2YWx1ZSBpdFxuICAgKiB3YXMgcGFzc2VkLCBjbG9uaW5nIHdpbGwgYmUgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY2FsbGJhY2tgIGlzXG4gICAqIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDsgKHZhbHVlKS5cbiAgICpcbiAgICogTm90ZTogVGhpcyBmdW5jdGlvbiBpcyBsb29zZWx5IGJhc2VkIG9uIHRoZSBzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobS4gRnVuY3Rpb25zXG4gICAqIGFuZCBET00gbm9kZXMgYXJlICoqbm90KiogY2xvbmVkLiBUaGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGBhcmd1bWVudHNgIG9iamVjdHMgYW5kXG4gICAqIG9iamVjdHMgY3JlYXRlZCBieSBjb25zdHJ1Y3RvcnMgb3RoZXIgdGhhbiBgT2JqZWN0YCBhcmUgY2xvbmVkIHRvIHBsYWluIGBPYmplY3RgIG9iamVjdHMuXG4gICAqIFNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9pbmZyYXN0cnVjdHVyZS5odG1sI2ludGVybmFsLXN0cnVjdHVyZWQtY2xvbmluZy1hbGdvcml0aG0uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIGRlZXAgY2xvbmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IFJldHVybnMgdGhlIGRlZXAgY2xvbmVkIGB2YWx1ZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBzdG9vZ2VzID0gW1xuICAgKiAgIHsgJ25hbWUnOiAnbW9lJywgJ2FnZSc6IDQwIH0sXG4gICAqICAgeyAnbmFtZSc6ICdsYXJyeScsICdhZ2UnOiA1MCB9XG4gICAqIF07XG4gICAqXG4gICAqIHZhciBkZWVwID0gXy5jbG9uZURlZXAoc3Rvb2dlcyk7XG4gICAqIGRlZXBbMF0gPT09IHN0b29nZXNbMF07XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIHZhciB2aWV3ID0ge1xuICAgKiAgICdsYWJlbCc6ICdkb2NzJyxcbiAgICogICAnbm9kZSc6IGVsZW1lbnRcbiAgICogfTtcbiAgICpcbiAgICogdmFyIGNsb25lID0gXy5jbG9uZURlZXAodmlldywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICogICByZXR1cm4gXy5pc0VsZW1lbnQodmFsdWUpID8gdmFsdWUuY2xvbmVOb2RlKHRydWUpIDogdmFsdWU7XG4gICAqIH0pO1xuICAgKlxuICAgKiBjbG9uZS5ub2RlID09IHZpZXcubm9kZTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGNsb25lRGVlcCh2YWx1ZSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gY2xvbmUodmFsdWUsIHRydWUsIGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAgICogb2JqZWN0IGZvciBhbGwgZGVzdGluYXRpb24gcHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAuIE9uY2UgYVxuICAgKiBwcm9wZXJ0eSBpcyBzZXQsIGFkZGl0aW9uYWwgZGVmYXVsdHMgb2YgdGhlIHNhbWUgcHJvcGVydHkgd2lsbCBiZSBpZ25vcmVkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtzb3VyY2UxLCBzb3VyY2UyLCAuLi5dIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEludGVybmFsbHkgdXNlZCB0byBhbGxvdyB3b3JraW5nIHdpdGggYF8ucmVkdWNlYFxuICAgKiAgd2l0aG91dCB1c2luZyBpdHMgY2FsbGJhY2sncyBga2V5YCBhbmQgYG9iamVjdGAgYXJndW1lbnRzIGFzIHNvdXJjZXMuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIGZvb2QgPSB7ICduYW1lJzogJ2FwcGxlJyB9O1xuICAgKiBfLmRlZmF1bHRzKGZvb2QsIHsgJ25hbWUnOiAnYmFuYW5hJywgJ3R5cGUnOiAnZnJ1aXQnIH0pO1xuICAgKiAvLyA9PiB7ICduYW1lJzogJ2FwcGxlJywgJ3R5cGUnOiAnZnJ1aXQnIH1cbiAgICovXG4gIHZhciBkZWZhdWx0cyA9IGNyZWF0ZUl0ZXJhdG9yKGRlZmF1bHRzSXRlcmF0b3JPcHRpb25zKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHNvcnRlZCBhcnJheSBvZiBhbGwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLCBvd24gYW5kIGluaGVyaXRlZCxcbiAgICogb2YgYG9iamVjdGAgdGhhdCBoYXZlIGZ1bmN0aW9uIHZhbHVlcy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAYWxpYXMgbWV0aG9kc1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBmdW5jdGlvbiB2YWx1ZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZnVuY3Rpb25zKF8pO1xuICAgKiAvLyA9PiBbJ2FsbCcsICdhbnknLCAnYmluZCcsICdiaW5kQWxsJywgJ2Nsb25lJywgJ2NvbXBhY3QnLCAnY29tcG9zZScsIC4uLl1cbiAgICovXG4gIGZ1bmN0aW9uIGZ1bmN0aW9ucyhvYmplY3QpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9ySW4ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnNvcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCBvYmplY3QgYHByb3BlcnR5YCBleGlzdHMgYW5kIGlzIGEgZGlyZWN0IHByb3BlcnR5LFxuICAgKiBpbnN0ZWFkIG9mIGFuIGluaGVyaXRlZCBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2hlY2suXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gY2hlY2sgZm9yLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYga2V5IGlzIGEgZGlyZWN0IHByb3BlcnR5LCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaGFzKHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMyB9LCAnYicpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBoYXMob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIHJldHVybiBvYmplY3QgPyBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIGludmVydGVkIGtleXMgYW5kIHZhbHVlcyBvZiB0aGUgZ2l2ZW4gYG9iamVjdGAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGludmVydC5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY3JlYXRlZCBpbnZlcnRlZCBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICBfLmludmVydCh7ICdmaXJzdCc6ICdtb2UnLCAnc2Vjb25kJzogJ2xhcnJ5JyB9KTtcbiAgICogLy8gPT4geyAnbW9lJzogJ2ZpcnN0JywgJ2xhcnJ5JzogJ3NlY29uZCcgfSAob3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gICAqL1xuICBmdW5jdGlvbiBpbnZlcnQob2JqZWN0KSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIHByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgICByZXN1bHRbb2JqZWN0W2tleV1dID0ga2V5O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYm9vbGVhbiB2YWx1ZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBSZXR1cm5zIGB0cnVlYCwgaWYgdGhlIGB2YWx1ZWAgaXMgYSBib29sZWFuIHZhbHVlLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNCb29sZWFuKG51bGwpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNCb29sZWFuKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBib29sQ2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBkYXRlLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgYHRydWVgLCBpZiB0aGUgYHZhbHVlYCBpcyBhIGRhdGUsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc0RhdGUobmV3IERhdGUpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlIHx8IHRvU3RyaW5nLmNhbGwodmFsdWUpID09IGRhdGVDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIERPTSBlbGVtZW50LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgYHRydWVgLCBpZiB0aGUgYHZhbHVlYCBpcyBhIERPTSBlbGVtZW50LCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNFbGVtZW50KGRvY3VtZW50LmJvZHkpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBpc0VsZW1lbnQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPyB2YWx1ZS5ub2RlVHlwZSA9PT0gMSA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGVtcHR5LiBBcnJheXMsIHN0cmluZ3MsIG9yIGBhcmd1bWVudHNgIG9iamVjdHMgd2l0aCBhXG4gICAqIGxlbmd0aCBvZiBgMGAgYW5kIG9iamVjdHMgd2l0aCBubyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGFyZSBjb25zaWRlcmVkXG4gICAqIFwiZW1wdHlcIi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAsIGlmIHRoZSBgdmFsdWVgIGlzIGVtcHR5LCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNFbXB0eShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzRW1wdHkoe30pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNFbXB0eSgnJyk7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIGZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcblxuICAgIGlmICgoY2xhc3NOYW1lID09IGFycmF5Q2xhc3MgfHwgY2xhc3NOYW1lID09IHN0cmluZ0NsYXNzIHx8XG4gICAgICAgIGNsYXNzTmFtZSA9PSBhcmdzQ2xhc3MpIHx8XG4gICAgICAgIChjbGFzc05hbWUgPT0gb2JqZWN0Q2xhc3MgJiYgdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBpc0Z1bmN0aW9uKHZhbHVlLnNwbGljZSkpKSB7XG4gICAgICByZXR1cm4gIWxlbmd0aDtcbiAgICB9XG4gICAgZm9yT3duKHZhbHVlLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAocmVzdWx0ID0gZmFsc2UpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZVxuICAgKiBlcXVpdmFsZW50IHRvIGVhY2ggb3RoZXIuIElmIGBjYWxsYmFja2AgaXMgcGFzc2VkLCBpdCB3aWxsIGJlIGV4ZWN1dGVkIHRvXG4gICAqIGNvbXBhcmUgdmFsdWVzLiBJZiBgY2FsbGJhY2tgIHJldHVybnMgYHVuZGVmaW5lZGAsIGNvbXBhcmlzb25zIHdpbGwgYmUgaGFuZGxlZFxuICAgKiBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY2FsbGJhY2tgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoXG4gICAqIHR3byBhcmd1bWVudHM7IChhLCBiKS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge01peGVkfSBhIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0ge01peGVkfSBiIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaW5nIHZhbHVlcy5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcGFyYW0tIHtPYmplY3R9IFtzdGFja0E9W11dIEludGVybmFsbHkgdXNlZCB0cmFjayB0cmF2ZXJzZWQgYGFgIG9iamVjdHMuXG4gICAqIEBwYXJhbS0ge09iamVjdH0gW3N0YWNrQj1bXV0gSW50ZXJuYWxseSB1c2VkIHRyYWNrIHRyYXZlcnNlZCBgYmAgb2JqZWN0cy5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgYHRydWVgLCBpZiB0aGUgdmFsdWVzIGFyZSBlcXV2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG1vZSA9IHsgJ25hbWUnOiAnbW9lJywgJ2FnZSc6IDQwIH07XG4gICAqIHZhciBjb3B5ID0geyAnbmFtZSc6ICdtb2UnLCAnYWdlJzogNDAgfTtcbiAgICpcbiAgICogbW9lID09IGNvcHk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNFcXVhbChtb2UsIGNvcHkpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIHZhciB3b3JkcyA9IFsnaGVsbG8nLCAnZ29vZGJ5ZSddO1xuICAgKiB2YXIgb3RoZXJXb3JkcyA9IFsnaGknLCAnZ29vZGJ5ZSddO1xuICAgKlxuICAgKiBfLmlzRXF1YWwod29yZHMsIG90aGVyV29yZHMsIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICogICB2YXIgcmVHcmVldCA9IC9eKD86aGVsbG98aGkpJC9pLFxuICAgKiAgICAgICBhR3JlZXQgPSBfLmlzU3RyaW5nKGEpICYmIHJlR3JlZXQudGVzdChhKSxcbiAgICogICAgICAgYkdyZWV0ID0gXy5pc1N0cmluZyhiKSAmJiByZUdyZWV0LnRlc3QoYik7XG4gICAqXG4gICAqICAgcmV0dXJuIChhR3JlZXQgfHwgYkdyZWV0KSA/IChhR3JlZXQgPT0gYkdyZWV0KSA6IHVuZGVmaW5lZDtcbiAgICogfSk7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIGZ1bmN0aW9uIGlzRXF1YWwoYSwgYiwgY2FsbGJhY2ssIHRoaXNBcmcsIHN0YWNrQSwgc3RhY2tCKSB7XG4gICAgLy8gdXNlZCB0byBpbmRpY2F0ZSB0aGF0IHdoZW4gY29tcGFyaW5nIG9iamVjdHMsIGBhYCBoYXMgYXQgbGVhc3QgdGhlIHByb3BlcnRpZXMgb2YgYGJgXG4gICAgdmFyIHdoZXJlSW5kaWNhdG9yID0gY2FsbGJhY2sgPT09IGluZGljYXRvck9iamVjdDtcbiAgICBpZiAoY2FsbGJhY2sgJiYgIXdoZXJlSW5kaWNhdG9yKSB7XG4gICAgICBjYWxsYmFjayA9IHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnID8gY2FsbGJhY2sgOiBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMik7XG4gICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2soYSwgYik7XG4gICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gISFyZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGV4aXQgZWFybHkgZm9yIGlkZW50aWNhbCB2YWx1ZXNcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgLy8gdHJlYXQgYCswYCB2cy4gYC0wYCBhcyBub3QgZXF1YWxcbiAgICAgIHJldHVybiBhICE9PSAwIHx8ICgxIC8gYSA9PSAxIC8gYik7XG4gICAgfVxuICAgIHZhciB0eXBlID0gdHlwZW9mIGEsXG4gICAgICAgIG90aGVyVHlwZSA9IHR5cGVvZiBiO1xuXG4gICAgLy8gZXhpdCBlYXJseSBmb3IgdW5saWtlIHByaW1pdGl2ZSB2YWx1ZXNcbiAgICBpZiAoYSA9PT0gYSAmJlxuICAgICAgICAoIWEgfHwgKHR5cGUgIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlICE9ICdvYmplY3QnKSkgJiZcbiAgICAgICAgKCFiIHx8IChvdGhlclR5cGUgIT0gJ2Z1bmN0aW9uJyAmJiBvdGhlclR5cGUgIT0gJ29iamVjdCcpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBleGl0IGVhcmx5IGZvciBgbnVsbGAgYW5kIGB1bmRlZmluZWRgLCBhdm9pZGluZyBFUzMncyBGdW5jdGlvbiNjYWxsIGJlaGF2aW9yXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMy40LjRcbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgfVxuICAgIC8vIGNvbXBhcmUgW1tDbGFzc11dIG5hbWVzXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSksXG4gICAgICAgIG90aGVyQ2xhc3MgPSB0b1N0cmluZy5jYWxsKGIpO1xuXG4gICAgaWYgKGNsYXNzTmFtZSA9PSBhcmdzQ2xhc3MpIHtcbiAgICAgIGNsYXNzTmFtZSA9IG9iamVjdENsYXNzO1xuICAgIH1cbiAgICBpZiAob3RoZXJDbGFzcyA9PSBhcmdzQ2xhc3MpIHtcbiAgICAgIG90aGVyQ2xhc3MgPSBvYmplY3RDbGFzcztcbiAgICB9XG4gICAgaWYgKGNsYXNzTmFtZSAhPSBvdGhlckNsYXNzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICBjYXNlIGJvb2xDbGFzczpcbiAgICAgIGNhc2UgZGF0ZUNsYXNzOlxuICAgICAgICAvLyBjb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWJlcnMsIGRhdGVzIHRvIG1pbGxpc2Vjb25kcyBhbmQgYm9vbGVhbnNcbiAgICAgICAgLy8gdG8gYDFgIG9yIGAwYCwgdHJlYXRpbmcgaW52YWxpZCBkYXRlcyBjb2VyY2VkIHRvIGBOYU5gIGFzIG5vdCBlcXVhbFxuICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG5cbiAgICAgIGNhc2UgbnVtYmVyQ2xhc3M6XG4gICAgICAgIC8vIHRyZWF0IGBOYU5gIHZzLiBgTmFOYCBhcyBlcXVhbFxuICAgICAgICByZXR1cm4gYSAhPSArYVxuICAgICAgICAgID8gYiAhPSArYlxuICAgICAgICAgIC8vIGJ1dCB0cmVhdCBgKzBgIHZzLiBgLTBgIGFzIG5vdCBlcXVhbFxuICAgICAgICAgIDogKGEgPT0gMCA/ICgxIC8gYSA9PSAxIC8gYikgOiBhID09ICtiKTtcblxuICAgICAgY2FzZSByZWdleHBDbGFzczpcbiAgICAgIGNhc2Ugc3RyaW5nQ2xhc3M6XG4gICAgICAgIC8vIGNvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgKGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjEwLjYuNClcbiAgICAgICAgLy8gdHJlYXQgc3RyaW5nIHByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IGluc3RhbmNlcyBhcyBlcXVhbFxuICAgICAgICByZXR1cm4gYSA9PSBiICsgJyc7XG4gICAgfVxuICAgIHZhciBpc0FyciA9IGNsYXNzTmFtZSA9PSBhcnJheUNsYXNzO1xuICAgIGlmICghaXNBcnIpIHtcbiAgICAgIC8vIHVud3JhcCBhbnkgYGxvZGFzaGAgd3JhcHBlZCB2YWx1ZXNcbiAgICAgIGlmIChhLl9fd3JhcHBlZF9fIHx8IGIuX193cmFwcGVkX18pIHtcbiAgICAgICAgcmV0dXJuIGlzRXF1YWwoYS5fX3dyYXBwZWRfXyB8fCBhLCBiLl9fd3JhcHBlZF9fIHx8IGIsIGNhbGxiYWNrLCB0aGlzQXJnLCBzdGFja0EsIHN0YWNrQik7XG4gICAgICB9XG4gICAgICAvLyBleGl0IGZvciBmdW5jdGlvbnMgYW5kIERPTSBub2Rlc1xuICAgICAgaWYgKGNsYXNzTmFtZSAhPSBvYmplY3RDbGFzcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBPcGVyYSwgYGFyZ3VtZW50c2Agb2JqZWN0cyBoYXZlIGBBcnJheWAgY29uc3RydWN0b3JzXG4gICAgICB2YXIgY3RvckEgPSBhLmNvbnN0cnVjdG9yLFxuICAgICAgICAgIGN0b3JCID0gYi5jb25zdHJ1Y3RvcjtcblxuICAgICAgLy8gbm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWxcbiAgICAgIGlmIChjdG9yQSAhPSBjdG9yQiAmJiAhKFxuICAgICAgICAgICAgaXNGdW5jdGlvbihjdG9yQSkgJiYgY3RvckEgaW5zdGFuY2VvZiBjdG9yQSAmJlxuICAgICAgICAgICAgaXNGdW5jdGlvbihjdG9yQikgJiYgY3RvckIgaW5zdGFuY2VvZiBjdG9yQlxuICAgICAgICAgICkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhc3N1bWUgY3ljbGljIHN0cnVjdHVyZXMgYXJlIGVxdWFsXG4gICAgLy8gdGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpYyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjFcbiAgICAvLyBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gIChodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4xMi4zKVxuICAgIHN0YWNrQSB8fCAoc3RhY2tBID0gW10pO1xuICAgIHN0YWNrQiB8fCAoc3RhY2tCID0gW10pO1xuXG4gICAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICBpZiAoc3RhY2tBW2xlbmd0aF0gPT0gYSkge1xuICAgICAgICByZXR1cm4gc3RhY2tCW2xlbmd0aF0gPT0gYjtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHNpemUgPSAwO1xuICAgIHJlc3VsdCA9IHRydWU7XG5cbiAgICAvLyBhZGQgYGFgIGFuZCBgYmAgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzXG4gICAgc3RhY2tBLnB1c2goYSk7XG4gICAgc3RhY2tCLnB1c2goYik7XG5cbiAgICAvLyByZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpXG4gICAgaWYgKGlzQXJyKSB7XG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIHNpemUgPSBiLmxlbmd0aDtcblxuICAgICAgLy8gY29tcGFyZSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnlcbiAgICAgIHJlc3VsdCA9IHNpemUgPT0gYS5sZW5ndGg7XG4gICAgICBpZiAoIXJlc3VsdCAmJiAhd2hlcmVJbmRpY2F0b3IpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIC8vIGRlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXNcbiAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgdmFyIGluZGV4ID0gbGVuZ3RoLFxuICAgICAgICAgICAgdmFsdWUgPSBiW3NpemVdO1xuXG4gICAgICAgIGlmICh3aGVyZUluZGljYXRvcikge1xuICAgICAgICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICAgICAgICBpZiAoKHJlc3VsdCA9IGlzRXF1YWwoYVtpbmRleF0sIHZhbHVlLCBjYWxsYmFjaywgdGhpc0FyZywgc3RhY2tBLCBzdGFja0IpKSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIShyZXN1bHQgPSBpc0VxdWFsKGFbc2l6ZV0sIHZhbHVlLCBjYWxsYmFjaywgdGhpc0FyZywgc3RhY2tBLCBzdGFja0IpKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyBkZWVwIGNvbXBhcmUgb2JqZWN0cyB1c2luZyBgZm9ySW5gLCBpbnN0ZWFkIG9mIGBmb3JPd25gLCB0byBhdm9pZCBgT2JqZWN0LmtleXNgXG4gICAgLy8gd2hpY2gsIGluIHRoaXMgY2FzZSwgaXMgbW9yZSBjb3N0bHlcbiAgICBmb3JJbihiLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBiKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChiLCBrZXkpKSB7XG4gICAgICAgIC8vIGNvdW50IHRoZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgc2l6ZSsrO1xuICAgICAgICAvLyBkZWVwIGNvbXBhcmUgZWFjaCBwcm9wZXJ0eSB2YWx1ZS5cbiAgICAgICAgcmV0dXJuIChyZXN1bHQgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGtleSkgJiYgaXNFcXVhbChhW2tleV0sIHZhbHVlLCBjYWxsYmFjaywgdGhpc0FyZywgc3RhY2tBLCBzdGFja0IpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChyZXN1bHQgJiYgIXdoZXJlSW5kaWNhdG9yKSB7XG4gICAgICAvLyBlbnN1cmUgYm90aCBvYmplY3RzIGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXNcbiAgICAgIGZvckluKGEsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGEpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYSwga2V5KSkge1xuICAgICAgICAgIC8vIGBzaXplYCB3aWxsIGJlIGAtMWAgaWYgYGFgIGhhcyBtb3JlIHByb3BlcnRpZXMgdGhhbiBgYmBcbiAgICAgICAgICByZXR1cm4gKHJlc3VsdCA9IC0tc2l6ZSA+IC0xKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMsIG9yIGNhbiBiZSBjb2VyY2VkIHRvLCBhIGZpbml0ZSBudW1iZXIuXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgaXMgbm90IHRoZSBzYW1lIGFzIG5hdGl2ZSBgaXNGaW5pdGVgLCB3aGljaCB3aWxsIHJldHVybiB0cnVlIGZvclxuICAgKiBib29sZWFucyBhbmQgZW1wdHkgc3RyaW5ncy4gU2VlIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjEuMi41LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgYHRydWVgLCBpZiB0aGUgYHZhbHVlYCBpcyBmaW5pdGUsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc0Zpbml0ZSgtMTAxKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzRmluaXRlKCcxMCcpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNGaW5pdGUodHJ1ZSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNGaW5pdGUoJycpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzRmluaXRlKEluZmluaXR5KTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzRmluaXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUlzRmluaXRlKHZhbHVlKSAmJiAhbmF0aXZlSXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAsIGlmIHRoZSBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc0Z1bmN0aW9uKF8pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nO1xuICB9XG4gIC8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuICBpZiAoaXNGdW5jdGlvbigveC8pKSB7XG4gICAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbiB8fCB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBmdW5jQ2xhc3M7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgbGFuZ3VhZ2UgdHlwZSBvZiBPYmplY3QuXG4gICAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgYHRydWVgLCBpZiB0aGUgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc09iamVjdCh7fSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNPYmplY3QoMSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAgIC8vIGNoZWNrIGlmIHRoZSB2YWx1ZSBpcyB0aGUgRUNNQVNjcmlwdCBsYW5ndWFnZSB0eXBlIG9mIE9iamVjdFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDhcbiAgICAvLyBhbmQgYXZvaWQgYSBWOCBidWdcbiAgICAvLyBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxXG4gICAgcmV0dXJuIHZhbHVlID8gb2JqZWN0VHlwZXNbdHlwZW9mIHZhbHVlXSA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGBOYU5gLlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIGlzIG5vdCB0aGUgc2FtZSBhcyBuYXRpdmUgYGlzTmFOYCwgd2hpY2ggd2lsbCByZXR1cm4gYHRydWVgIGZvclxuICAgKiBgdW5kZWZpbmVkYCBhbmQgb3RoZXIgdmFsdWVzLiBTZWUgaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMS4yLjQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAsIGlmIHRoZSBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNOYU4oTmFOKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzTmFOKG5ldyBOdW1iZXIoTmFOKSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogaXNOYU4odW5kZWZpbmVkKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzTmFOKHVuZGVmaW5lZCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc05hTih2YWx1ZSkge1xuICAgIC8vIGBOYU5gIGFzIGEgcHJpbWl0aXZlIGlzIHRoZSBvbmx5IHZhbHVlIHRoYXQgaXMgbm90IGVxdWFsIHRvIGl0c2VsZlxuICAgIC8vIChwZXJmb3JtIHRoZSBbW0NsYXNzXV0gY2hlY2sgZmlyc3QgdG8gYXZvaWQgZXJyb3JzIHdpdGggc29tZSBob3N0IG9iamVjdHMgaW4gSUUpXG4gICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSAhPSArdmFsdWVcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgbnVsbGAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAsIGlmIHRoZSBgdmFsdWVgIGlzIGBudWxsYCwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzTnVsbChudWxsKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzTnVsbCh1bmRlZmluZWQpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNOdWxsKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbnVtYmVyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgYHRydWVgLCBpZiB0aGUgYHZhbHVlYCBpcyBhIG51bWJlciwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzTnVtYmVyKDguNCAqIDUpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gbnVtYmVyQ2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgZ2l2ZW4gYHZhbHVlYCBpcyBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAsIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogZnVuY3Rpb24gU3Rvb2dlKG5hbWUsIGFnZSkge1xuICAgKiAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAqICAgdGhpcy5hZ2UgPSBhZ2U7XG4gICAqIH1cbiAgICpcbiAgICogXy5pc1BsYWluT2JqZWN0KG5ldyBTdG9vZ2UoJ21vZScsIDQwKSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNQbGFpbk9iamVjdChbMSwgMiwgM10pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzUGxhaW5PYmplY3QoeyAnbmFtZSc6ICdtb2UnLCAnYWdlJzogNDAgfSk7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIHZhciBpc1BsYWluT2JqZWN0ID0gIWdldFByb3RvdHlwZU9mID8gc2hpbUlzUGxhaW5PYmplY3QgOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICghKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHZhbHVlT2YgPSB2YWx1ZS52YWx1ZU9mLFxuICAgICAgICBvYmpQcm90byA9IHR5cGVvZiB2YWx1ZU9mID09ICdmdW5jdGlvbicgJiYgKG9ialByb3RvID0gZ2V0UHJvdG90eXBlT2YodmFsdWVPZikpICYmIGdldFByb3RvdHlwZU9mKG9ialByb3RvKTtcblxuICAgIHJldHVybiBvYmpQcm90b1xuICAgICAgPyB2YWx1ZSA9PSBvYmpQcm90byB8fCAoZ2V0UHJvdG90eXBlT2YodmFsdWUpID09IG9ialByb3RvICYmICFpc0FyZ3VtZW50cyh2YWx1ZSkpXG4gICAgICA6IHNoaW1Jc1BsYWluT2JqZWN0KHZhbHVlKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAsIGlmIHRoZSBgdmFsdWVgIGlzIGEgcmVndWxhciBleHByZXNzaW9uLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNSZWdFeHAoL21vZS8pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBpc1JlZ0V4cCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCB8fCB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSByZWdleHBDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHN0cmluZy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBSZXR1cm5zIGB0cnVlYCwgaWYgdGhlIGB2YWx1ZWAgaXMgYSBzdHJpbmcsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc1N0cmluZygnbW9lJyk7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgdW5kZWZpbmVkYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBSZXR1cm5zIGB0cnVlYCwgaWYgdGhlIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc1VuZGVmaW5lZCh2b2lkIDApO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCc7XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgbWVyZ2VzIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgdGhlIHNvdXJjZSBvYmplY3QocyksIHRoYXRcbiAgICogZG9uJ3QgcmVzb2x2ZSB0byBgdW5kZWZpbmVkYCwgaW50byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXNcbiAgICogd2lsbCBvdmVyd3JpdGUgcHJvcGVyeSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLiBJZiBhIGBjYWxsYmFja2AgZnVuY3Rpb25cbiAgICogaXMgcGFzc2VkLCBpdCB3aWxsIGJlIGV4ZWN1dGVkIHRvIHByb2R1Y2UgdGhlIG1lcmdlZCB2YWx1ZXMgb2YgdGhlIGRlc3RpbmF0aW9uXG4gICAqIGFuZCBzb3VyY2UgcHJvcGVydGllcy4gSWYgYGNhbGxiYWNrYCByZXR1cm5zIGB1bmRlZmluZWRgLCBtZXJnaW5nIHdpbGwgYmVcbiAgICogaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY2FsbGJhY2tgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmRcbiAgICogaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM7IChvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtzb3VyY2UxLCBzb3VyY2UyLCAuLi5dIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdpbmcgcHJvcGVydGllcy5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcGFyYW0tIHtPYmplY3R9IFtkZWVwSW5kaWNhdG9yXSBJbnRlcm5hbGx5IHVzZWQgdG8gaW5kaWNhdGUgdGhhdCBgc3RhY2tBYFxuICAgKiAgYW5kIGBzdGFja0JgIGFyZSBhcnJheXMgb2YgdHJhdmVyc2VkIG9iamVjdHMgaW5zdGVhZCBvZiBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHBhcmFtLSB7QXJyYXl9IFtzdGFja0E9W11dIEludGVybmFsbHkgdXNlZCB0byB0cmFjayB0cmF2ZXJzZWQgc291cmNlIG9iamVjdHMuXG4gICAqIEBwYXJhbS0ge0FycmF5fSBbc3RhY2tCPVtdXSBJbnRlcm5hbGx5IHVzZWQgdG8gYXNzb2NpYXRlIHZhbHVlcyB3aXRoIHRoZWlyXG4gICAqICBzb3VyY2UgY291bnRlcnBhcnRzLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBuYW1lcyA9IHtcbiAgICogICAnc3Rvb2dlcyc6IFtcbiAgICogICAgIHsgJ25hbWUnOiAnbW9lJyB9LFxuICAgKiAgICAgeyAnbmFtZSc6ICdsYXJyeScgfVxuICAgKiAgIF1cbiAgICogfTtcbiAgICpcbiAgICogdmFyIGFnZXMgPSB7XG4gICAqICAgJ3N0b29nZXMnOiBbXG4gICAqICAgICB7ICdhZ2UnOiA0MCB9LFxuICAgKiAgICAgeyAnYWdlJzogNTAgfVxuICAgKiAgIF1cbiAgICogfTtcbiAgICpcbiAgICogXy5tZXJnZShuYW1lcywgYWdlcyk7XG4gICAqIC8vID0+IHsgJ3N0b29nZXMnOiBbeyAnbmFtZSc6ICdtb2UnLCAnYWdlJzogNDAgfSwgeyAnbmFtZSc6ICdsYXJyeScsICdhZ2UnOiA1MCB9XSB9XG4gICAqXG4gICAqIHZhciBmb29kID0ge1xuICAgKiAgICdmcnVpdHMnOiBbJ2FwcGxlJ10sXG4gICAqICAgJ3ZlZ2V0YWJsZXMnOiBbJ2JlZXQnXVxuICAgKiB9O1xuICAgKlxuICAgKiB2YXIgb3RoZXJGb29kID0ge1xuICAgKiAgICdmcnVpdHMnOiBbJ2JhbmFuYSddLFxuICAgKiAgICd2ZWdldGFibGVzJzogWydjYXJyb3QnXVxuICAgKiB9O1xuICAgKlxuICAgKiBfLm1lcmdlKGZvb2QsIG90aGVyRm9vZCwgZnVuY3Rpb24oYSwgYikge1xuICAgKiAgIHJldHVybiBfLmlzQXJyYXkoYSkgPyBhLmNvbmNhdChiKSA6IHVuZGVmaW5lZDtcbiAgICogfSk7XG4gICAqIC8vID0+IHsgJ2ZydWl0cyc6IFsnYXBwbGUnLCAnYmFuYW5hJ10sICd2ZWdldGFibGVzJzogWydiZWV0JywgJ2NhcnJvdF0gfVxuICAgKi9cbiAgZnVuY3Rpb24gbWVyZ2Uob2JqZWN0LCBzb3VyY2UsIGRlZXBJbmRpY2F0b3IpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICBsZW5ndGggPSAyO1xuXG4gICAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBpZiAoZGVlcEluZGljYXRvciA9PT0gaW5kaWNhdG9yT2JqZWN0KSB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzWzNdLFxuICAgICAgICAgIHN0YWNrQSA9IGFyZ3NbNF0sXG4gICAgICAgICAgc3RhY2tCID0gYXJnc1s1XTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhY2tBID0gW107XG4gICAgICBzdGFja0IgPSBbXTtcblxuICAgICAgLy8gYWxsb3dzIHdvcmtpbmcgd2l0aCBgXy5yZWR1Y2VgIGFuZCBgXy5yZWR1Y2VSaWdodGAgd2l0aG91dFxuICAgICAgLy8gdXNpbmcgdGhlaXIgYGNhbGxiYWNrYCBhcmd1bWVudHMsIGBpbmRleHxrZXlgIGFuZCBgY29sbGVjdGlvbmBcbiAgICAgIGlmICh0eXBlb2YgZGVlcEluZGljYXRvciAhPSAnbnVtYmVyJykge1xuICAgICAgICBsZW5ndGggPSBhcmdzLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIGlmIChsZW5ndGggPiAzICYmIHR5cGVvZiBhcmdzW2xlbmd0aCAtIDJdID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjcmVhdGVDYWxsYmFjayhhcmdzWy0tbGVuZ3RoIC0gMV0sIGFyZ3NbbGVuZ3RoLS1dLCAyKTtcbiAgICAgIH0gZWxzZSBpZiAobGVuZ3RoID4gMiAmJiB0eXBlb2YgYXJnc1tsZW5ndGggLSAxXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gYXJnc1stLWxlbmd0aF07XG4gICAgICB9XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAoaXNBcnJheShhcmdzW2luZGV4XSkgPyBmb3JFYWNoIDogZm9yT3duKShhcmdzW2luZGV4XSwgZnVuY3Rpb24oc291cmNlLCBrZXkpIHtcbiAgICAgICAgdmFyIGZvdW5kLFxuICAgICAgICAgICAgaXNBcnIsXG4gICAgICAgICAgICByZXN1bHQgPSBzb3VyY2UsXG4gICAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgICAgIGlmIChzb3VyY2UgJiYgKChpc0FyciA9IGlzQXJyYXkoc291cmNlKSkgfHwgaXNQbGFpbk9iamVjdChzb3VyY2UpKSkge1xuICAgICAgICAgIC8vIGF2b2lkIG1lcmdpbmcgcHJldmlvdXNseSBtZXJnZWQgY3ljbGljIHNvdXJjZXNcbiAgICAgICAgICB2YXIgc3RhY2tMZW5ndGggPSBzdGFja0EubGVuZ3RoO1xuICAgICAgICAgIHdoaWxlIChzdGFja0xlbmd0aC0tKSB7XG4gICAgICAgICAgICBpZiAoKGZvdW5kID0gc3RhY2tBW3N0YWNrTGVuZ3RoXSA9PSBzb3VyY2UpKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gc3RhY2tCW3N0YWNrTGVuZ3RoXTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gaXNBcnJcbiAgICAgICAgICAgICAgPyAoaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFtdKVxuICAgICAgICAgICAgICA6IChpc1BsYWluT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDoge30pO1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gY2FsbGJhY2sodmFsdWUsIHNvdXJjZSk7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFkZCBgc291cmNlYCBhbmQgYXNzb2NpYXRlZCBgdmFsdWVgIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0c1xuICAgICAgICAgICAgc3RhY2tBLnB1c2goc291cmNlKTtcbiAgICAgICAgICAgIHN0YWNrQi5wdXNoKHZhbHVlKTtcblxuICAgICAgICAgICAgLy8gcmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cylcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBtZXJnZSh2YWx1ZSwgc291cmNlLCBpbmRpY2F0b3JPYmplY3QsIGNhbGxiYWNrLCBzdGFja0EsIHN0YWNrQik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgcmVzdWx0ID0gY2FsbGJhY2sodmFsdWUsIHNvdXJjZSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICByZXN1bHQgPSBzb3VyY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBzaGFsbG93IGNsb25lIG9mIGBvYmplY3RgIGV4Y2x1ZGluZyB0aGUgc3BlY2lmaWVkIHByb3BlcnRpZXMuXG4gICAqIFByb3BlcnR5IG5hbWVzIG1heSBiZSBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBhcmd1bWVudHMgb3IgYXMgYXJyYXlzIG9mXG4gICAqIHByb3BlcnR5IG5hbWVzLiBJZiBhIGBjYWxsYmFja2AgZnVuY3Rpb24gaXMgcGFzc2VkLCBpdCB3aWxsIGJlIGV4ZWN1dGVkXG4gICAqIGZvciBlYWNoIHByb3BlcnR5IGluIHRoZSBgb2JqZWN0YCwgb21pdHRpbmcgdGhlIHByb3BlcnRpZXMgYGNhbGxiYWNrYFxuICAgKiByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBgY2FsbGJhY2tgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZFxuICAgKiB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBrZXksIG9iamVjdCkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IGNhbGxiYWNrfFtwcm9wMSwgcHJvcDIsIC4uLl0gVGhlIHByb3BlcnRpZXMgdG8gb21pdFxuICAgKiAgb3IgdGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGhvdXQgdGhlIG9taXR0ZWQgcHJvcGVydGllcy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5vbWl0KHsgJ25hbWUnOiAnbW9lJywgJ2FnZSc6IDQwIH0sICdhZ2UnKTtcbiAgICogLy8gPT4geyAnbmFtZSc6ICdtb2UnIH1cbiAgICpcbiAgICogXy5vbWl0KHsgJ25hbWUnOiAnbW9lJywgJ2FnZSc6IDQwIH0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAqICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJztcbiAgICogfSk7XG4gICAqIC8vID0+IHsgJ25hbWUnOiAnbW9lJyB9XG4gICAqL1xuICBmdW5jdGlvbiBvbWl0KG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgaXNGdW5jID0gdHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicsXG4gICAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgaWYgKGlzRnVuYykge1xuICAgICAgY2FsbGJhY2sgPSBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBwcm9wcyA9IGNvbmNhdC5hcHBseShhcnJheVJlZiwgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgZm9ySW4ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICAgIGlmIChpc0Z1bmNcbiAgICAgICAgICAgID8gIWNhbGxiYWNrKHZhbHVlLCBrZXksIG9iamVjdClcbiAgICAgICAgICAgIDogaW5kZXhPZihwcm9wcywga2V5LCAxKSA8IDBcbiAgICAgICAgICApIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB0d28gZGltZW5zaW9uYWwgYXJyYXkgb2YgdGhlIGdpdmVuIG9iamVjdCdzIGtleS12YWx1ZSBwYWlycyxcbiAgICogaS5lLiBgW1trZXkxLCB2YWx1ZTFdLCBba2V5MiwgdmFsdWUyXV1gLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgbmV3IGFycmF5IG9mIGtleS12YWx1ZSBwYWlycy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5wYWlycyh7ICdtb2UnOiAzMCwgJ2xhcnJ5JzogNDAgfSk7XG4gICAqIC8vID0+IFtbJ21vZScsIDMwXSwgWydsYXJyeScsIDQwXV0gKG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICAgKi9cbiAgZnVuY3Rpb24gcGFpcnMob2JqZWN0KSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIHByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBba2V5LCBvYmplY3Rba2V5XV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYG9iamVjdGAgY29tcG9zZWQgb2YgdGhlIHNwZWNpZmllZCBwcm9wZXJ0aWVzLlxuICAgKiBQcm9wZXJ0eSBuYW1lcyBtYXkgYmUgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgYXJndW1lbnRzIG9yIGFzIGFycmF5cyBvZiBwcm9wZXJ0eVxuICAgKiBuYW1lcy4gSWYgYGNhbGxiYWNrYCBpcyBwYXNzZWQsIGl0IHdpbGwgYmUgZXhlY3V0ZWQgZm9yIGVhY2ggcHJvcGVydHkgaW4gdGhlXG4gICAqIGBvYmplY3RgLCBwaWNraW5nIHRoZSBwcm9wZXJ0aWVzIGBjYWxsYmFja2AgcmV0dXJucyB0cnV0aHkgZm9yLiBUaGUgYGNhbGxiYWNrYFxuICAgKiBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwga2V5LCBvYmplY3QpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258U3RyaW5nfSBjYWxsYmFja3xbcHJvcDEsIHByb3AyLCAuLi5dIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICogIHBlciBpdGVyYXRpb24gb3IgcHJvcGVydGllcyB0byBwaWNrLCBlaXRoZXIgYXMgaW5kaXZpZHVhbCBhcmd1bWVudHMgb3IgYXJyYXlzLlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBwaWNrZWQgcHJvcGVydGllcy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5waWNrKHsgJ25hbWUnOiAnbW9lJywgJ191c2VyaWQnOiAnbW9lMScgfSwgJ25hbWUnKTtcbiAgICogLy8gPT4geyAnbmFtZSc6ICdtb2UnIH1cbiAgICpcbiAgICogXy5waWNrKHsgJ25hbWUnOiAnbW9lJywgJ191c2VyaWQnOiAnbW9lMScgfSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgKiAgIHJldHVybiBrZXkuY2hhckF0KDApICE9ICdfJztcbiAgICogfSk7XG4gICAqIC8vID0+IHsgJ25hbWUnOiAnbW9lJyB9XG4gICAqL1xuICBmdW5jdGlvbiBwaWNrKG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICAgIHByb3BzID0gY29uY2F0LmFwcGx5KGFycmF5UmVmLCBhcmd1bWVudHMpLFxuICAgICAgICAgIGxlbmd0aCA9IGlzT2JqZWN0KG9iamVjdCkgPyBwcm9wcy5sZW5ndGggOiAwO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2sgPSBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICBmb3JJbihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWUsIGtleSwgb2JqZWN0KSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgY29tcG9zZWQgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IHZhbHVlcyBvZiBgb2JqZWN0YC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy52YWx1ZXMoeyAnb25lJzogMSwgJ3R3byc6IDIsICd0aHJlZSc6IDMgfSk7XG4gICAqIC8vID0+IFsxLCAyLCAzXVxuICAgKi9cbiAgZnVuY3Rpb24gdmFsdWVzKG9iamVjdCkge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBwcm9wcyA9IGtleXMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBvYmplY3RbcHJvcHNbaW5kZXhdXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIGVsZW1lbnRzIGZyb20gdGhlIHNwZWNpZmllZCBpbmRleGVzLCBvciBrZXlzLCBvZiB0aGVcbiAgICogYGNvbGxlY3Rpb25gLiBJbmRleGVzIG1heSBiZSBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBhcmd1bWVudHMgb3IgYXMgYXJyYXlzXG4gICAqIG9mIGluZGV4ZXMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7QXJyYXl8TnVtYmVyfFN0cmluZ30gW2luZGV4MSwgaW5kZXgyLCAuLi5dIFRoZSBpbmRleGVzIG9mXG4gICAqICBgY29sbGVjdGlvbmAgdG8gcmV0cmlldmUsIGVpdGhlciBhcyBpbmRpdmlkdWFsIGFyZ3VtZW50cyBvciBhcnJheXMuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBlbGVtZW50cyBjb3JyZXNwb25kaW5nIHRvIHRoZVxuICAgKiAgcHJvdmlkZWQgaW5kZXhlcy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5hdChbJ2EnLCAnYicsICdjJywgJ2QnLCAnZSddLCBbMCwgMiwgNF0pO1xuICAgKiAvLyA9PiBbJ2EnLCAnYycsICdlJ11cbiAgICpcbiAgICogXy5hdChbJ21vZScsICdsYXJyeScsICdjdXJseSddLCAwLCAyKTtcbiAgICogLy8gPT4gWydtb2UnLCAnY3VybHknXVxuICAgKi9cbiAgZnVuY3Rpb24gYXQoY29sbGVjdGlvbikge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBwcm9wcyA9IGNvbmNhdC5hcHBseShhcnJheVJlZiwgc2xpY2UoYXJndW1lbnRzLCAxKSksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBjb2xsZWN0aW9uW3Byb3BzW2luZGV4XV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgZ2l2ZW4gYHRhcmdldGAgZWxlbWVudCBpcyBwcmVzZW50IGluIGEgYGNvbGxlY3Rpb25gIHVzaW5nIHN0cmljdFxuICAgKiBlcXVhbGl0eSBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuIElmIGBmcm9tSW5kZXhgIGlzIG5lZ2F0aXZlLCBpdCBpcyB1c2VkXG4gICAqIGFzIHRoZSBvZmZzZXQgZnJvbSB0aGUgZW5kIG9mIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBhbGlhcyBpbmNsdWRlXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge01peGVkfSB0YXJnZXQgVGhlIHZhbHVlIHRvIGNoZWNrIGZvci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB0YXJnZXRgIGVsZW1lbnQgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5jb250YWlucyhbMSwgMiwgM10sIDEpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uY29udGFpbnMoWzEsIDIsIDNdLCAxLCAyKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5jb250YWlucyh7ICduYW1lJzogJ21vZScsICdhZ2UnOiA0MCB9LCAnbW9lJyk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5jb250YWlucygnY3VybHknLCAndXInKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKi9cbiAgZnVuY3Rpb24gY29udGFpbnMoY29sbGVjdGlvbiwgdGFyZ2V0LCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMCxcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICBmcm9tSW5kZXggPSAoZnJvbUluZGV4IDwgMCA/IG5hdGl2ZU1heCgwLCBsZW5ndGggKyBmcm9tSW5kZXgpIDogZnJvbUluZGV4KSB8fCAwO1xuICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInKSB7XG4gICAgICByZXN1bHQgPSAoaXNTdHJpbmcoY29sbGVjdGlvbilcbiAgICAgICAgPyBjb2xsZWN0aW9uLmluZGV4T2YodGFyZ2V0LCBmcm9tSW5kZXgpXG4gICAgICAgIDogaW5kZXhPZihjb2xsZWN0aW9uLCB0YXJnZXQsIGZyb21JbmRleClcbiAgICAgICkgPiAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoKytpbmRleCA+PSBmcm9tSW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gIShyZXN1bHQgPSB2YWx1ZSA9PT0gdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2Yga2V5cyByZXR1cm5lZCBmcm9tIHJ1bm5pbmcgZWFjaCBlbGVtZW50IG9mIHRoZVxuICAgKiBgY29sbGVjdGlvbmAgdGhyb3VnaCB0aGUgZ2l2ZW4gYGNhbGxiYWNrYC4gVGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgb2YgZWFjaCBrZXlcbiAgICogaXMgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUga2V5IHdhcyByZXR1cm5lZCBieSB0aGUgYGNhbGxiYWNrYC4gVGhlIGBjYWxsYmFja2BcbiAgICogaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogSWYgYW4gb2JqZWN0IGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BldGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgKiBlbHNlIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fFN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlclxuICAgKiAgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHBhc3NlZCwgaXQgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZVxuICAgKiAgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbXBvc2VkIGFnZ3JlZ2F0ZSBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uY291bnRCeShbNC4zLCA2LjEsIDYuNF0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gTWF0aC5mbG9vcihudW0pOyB9KTtcbiAgICogLy8gPT4geyAnNCc6IDEsICc2JzogMiB9XG4gICAqXG4gICAqIF8uY291bnRCeShbNC4zLCA2LjEsIDYuNF0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gdGhpcy5mbG9vcihudW0pOyB9LCBNYXRoKTtcbiAgICogLy8gPT4geyAnNCc6IDEsICc2JzogMiB9XG4gICAqXG4gICAqIF8uY291bnRCeShbJ29uZScsICd0d28nLCAndGhyZWUnXSwgJ2xlbmd0aCcpO1xuICAgKiAvLyA9PiB7ICczJzogMiwgJzUnOiAxIH1cbiAgICovXG4gIGZ1bmN0aW9uIGNvdW50QnkoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgY2FsbGJhY2sgPSBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZyk7XG5cbiAgICBmb3JFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pIHtcbiAgICAgIGtleSA9IGNhbGxiYWNrKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pICsgJyc7XG4gICAgICAoaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSsrIDogcmVzdWx0W2tleV0gPSAxKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgYGNhbGxiYWNrYCByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlIGZvciAqKmFsbCoqIGVsZW1lbnRzIG9mIGFcbiAgICogYGNvbGxlY3Rpb25gLiBUaGUgYGNhbGxiYWNrYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICAgKiBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAgICpcbiAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBJZiBhbiBvYmplY3QgaXMgcGFzc2VkIGZvciBgY2FsbGJhY2tgLCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGV0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAqIGVsc2UgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAYWxpYXMgYWxsXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxTdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXJcbiAgICogIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwYXNzZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGVcbiAgICogIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYWxsIGVsZW1lbnRzIHBhc3MgdGhlIGNhbGxiYWNrIGNoZWNrLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmV2ZXJ5KFt0cnVlLCAxLCBudWxsLCAneWVzJ10sIEJvb2xlYW4pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiB2YXIgc3Rvb2dlcyA9IFtcbiAgICogICB7ICduYW1lJzogJ21vZScsICdhZ2UnOiA0MCB9LFxuICAgKiAgIHsgJ25hbWUnOiAnbGFycnknLCAnYWdlJzogNTAgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5ldmVyeShzdG9vZ2VzLCAnYWdlJyk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAqIF8uZXZlcnkoc3Rvb2dlcywgeyAnYWdlJzogNTAgfSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBldmVyeShjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIGNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcpO1xuXG4gICAgaWYgKGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBpZiAoIShyZXN1bHQgPSAhIWNhbGxiYWNrKGNvbGxlY3Rpb25baW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIChyZXN1bHQgPSAhIWNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogRXhhbWluZXMgZWFjaCBlbGVtZW50IGluIGEgYGNvbGxlY3Rpb25gLCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgYWxsIGVsZW1lbnRzXG4gICAqIHRoZSBgY2FsbGJhY2tgIHJldHVybnMgdHJ1dGh5IGZvci4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZFxuICAgKiBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogSWYgYW4gb2JqZWN0IGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BldGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgKiBlbHNlIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGFsaWFzIHNlbGVjdFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8U3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyXG4gICAqICBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcGFzc2VkLCBpdCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlXG4gICAqICBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgcGFzc2VkIHRoZSBjYWxsYmFjayBjaGVjay5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIGV2ZW5zID0gXy5maWx0ZXIoWzEsIDIsIDMsIDQsIDUsIDZdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIG51bSAlIDIgPT0gMDsgfSk7XG4gICAqIC8vID0+IFsyLCA0LCA2XVxuICAgKlxuICAgKiB2YXIgZm9vZCA9IFtcbiAgICogICB7ICduYW1lJzogJ2FwcGxlJywgICdvcmdhbmljJzogZmFsc2UsICd0eXBlJzogJ2ZydWl0JyB9LFxuICAgKiAgIHsgJ25hbWUnOiAnY2Fycm90JywgJ29yZ2FuaWMnOiB0cnVlLCAgJ3R5cGUnOiAndmVnZXRhYmxlJyB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgKiBfLmZpbHRlcihmb29kLCAnb3JnYW5pYycpO1xuICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdjYXJyb3QnLCAnb3JnYW5pYyc6IHRydWUsICd0eXBlJzogJ3ZlZ2V0YWJsZScgfV1cbiAgICpcbiAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAqIF8uZmlsdGVyKGZvb2QsIHsgJ3R5cGUnOiAnZnJ1aXQnIH0pO1xuICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdhcHBsZScsICdvcmdhbmljJzogZmFsc2UsICd0eXBlJzogJ2ZydWl0JyB9XVxuICAgKi9cbiAgZnVuY3Rpb24gZmlsdGVyKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcpO1xuXG4gICAgaWYgKGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBjb2xsZWN0aW9uW2luZGV4XTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4YW1pbmVzIGVhY2ggZWxlbWVudCBpbiBhIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIHRoZSBmaXJzdCB0aGF0IHRoZSBgY2FsbGJhY2tgXG4gICAqIHJldHVybnMgdHJ1dGh5IGZvci4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWVcbiAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogSWYgYW4gb2JqZWN0IGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BldGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgKiBlbHNlIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGFsaWFzIGRldGVjdFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8U3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyXG4gICAqICBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcGFzc2VkLCBpdCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlXG4gICAqICBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMge01peGVkfSBSZXR1cm5zIHRoZSBlbGVtZW50IHRoYXQgcGFzc2VkIHRoZSBjYWxsYmFjayBjaGVjayxcbiAgICogIGVsc2UgYHVuZGVmaW5lZGAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBldmVuID0gXy5maW5kKFsxLCAyLCAzLCA0LCA1LCA2XSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiBudW0gJSAyID09IDA7IH0pO1xuICAgKiAvLyA9PiAyXG4gICAqXG4gICAqIHZhciBmb29kID0gW1xuICAgKiAgIHsgJ25hbWUnOiAnYXBwbGUnLCAgJ29yZ2FuaWMnOiBmYWxzZSwgJ3R5cGUnOiAnZnJ1aXQnIH0sXG4gICAqICAgeyAnbmFtZSc6ICdiYW5hbmEnLCAnb3JnYW5pYyc6IHRydWUsICAndHlwZSc6ICdmcnVpdCcgfSxcbiAgICogICB7ICduYW1lJzogJ2JlZXQnLCAgICdvcmdhbmljJzogZmFsc2UsICd0eXBlJzogJ3ZlZ2V0YWJsZScgfSxcbiAgICogICB7ICduYW1lJzogJ2NhcnJvdCcsICdvcmdhbmljJzogdHJ1ZSwgICd0eXBlJzogJ3ZlZ2V0YWJsZScgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogdmFyIHZlZ2dpZSA9IF8uZmluZChmb29kLCB7ICd0eXBlJzogJ3ZlZ2V0YWJsZScgfSk7XG4gICAqIC8vID0+IHsgJ25hbWUnOiAnYmVldCcsICdvcmdhbmljJzogZmFsc2UsICd0eXBlJzogJ3ZlZ2V0YWJsZScgfVxuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogdmFyIGhlYWx0aHkgPSBfLmZpbmQoZm9vZCwgJ29yZ2FuaWMnKTtcbiAgICogLy8gPT4geyAnbmFtZSc6ICdiYW5hbmEnLCAnb3JnYW5pYyc6IHRydWUsICd0eXBlJzogJ2ZydWl0JyB9XG4gICAqL1xuICBmdW5jdGlvbiBmaW5kKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBjYWxsYmFjayA9IGNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnKTtcblxuICAgIGZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICBpZiAoY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgb3ZlciBhIGBjb2xsZWN0aW9uYCwgZXhlY3V0aW5nIHRoZSBgY2FsbGJhY2tgIGZvciBlYWNoIGVsZW1lbnQgaW5cbiAgICogdGhlIGBjb2xsZWN0aW9uYC4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWVcbiAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuIENhbGxiYWNrcyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHlcbiAgICogYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAYWxpYXMgZWFjaFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfKFsxLCAyLCAzXSkuZm9yRWFjaChhbGVydCkuam9pbignLCcpO1xuICAgKiAvLyA9PiBhbGVydHMgZWFjaCBudW1iZXIgYW5kIHJldHVybnMgJzEsMiwzJ1xuICAgKlxuICAgKiBfLmZvckVhY2goeyAnb25lJzogMSwgJ3R3byc6IDIsICd0aHJlZSc6IDMgfSwgYWxlcnQpO1xuICAgKiAvLyA9PiBhbGVydHMgZWFjaCBudW1iZXIgdmFsdWUgKG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICAgKi9cbiAgZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGlmIChjYWxsYmFjayAmJiB0eXBlb2YgdGhpc0FyZyA9PSAndW5kZWZpbmVkJyAmJiBpc0FycmF5KGNvbGxlY3Rpb24pKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKGNvbGxlY3Rpb25baW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWFjaChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIGtleXMgcmV0dXJuZWQgZnJvbSBydW5uaW5nIGVhY2ggZWxlbWVudCBvZiB0aGVcbiAgICogYGNvbGxlY3Rpb25gIHRocm91Z2ggdGhlIGBjYWxsYmFja2AuIFRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIG9mIGVhY2gga2V5IGlzXG4gICAqIGFuIGFycmF5IG9mIGVsZW1lbnRzIHBhc3NlZCB0byBgY2FsbGJhY2tgIHRoYXQgcmV0dXJuZWQgdGhlIGtleS4gVGhlIGBjYWxsYmFja2BcbiAgICogaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogSWYgYW4gb2JqZWN0IGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BldGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgKiBlbHNlIGBmYWxzZWBcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8U3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyXG4gICAqICBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcGFzc2VkLCBpdCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlXG4gICAqICBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29tcG9zZWQgYWdncmVnYXRlIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5ncm91cEJ5KFs0LjIsIDYuMSwgNi40XSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiBNYXRoLmZsb29yKG51bSk7IH0pO1xuICAgKiAvLyA9PiB7ICc0JzogWzQuMl0sICc2JzogWzYuMSwgNi40XSB9XG4gICAqXG4gICAqIF8uZ3JvdXBCeShbNC4yLCA2LjEsIDYuNF0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gdGhpcy5mbG9vcihudW0pOyB9LCBNYXRoKTtcbiAgICogLy8gPT4geyAnNCc6IFs0LjJdLCAnNic6IFs2LjEsIDYuNF0gfVxuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5ncm91cEJ5KFsnb25lJywgJ3R3bycsICd0aHJlZSddLCAnbGVuZ3RoJyk7XG4gICAqIC8vID0+IHsgJzMnOiBbJ29uZScsICd0d28nXSwgJzUnOiBbJ3RocmVlJ10gfVxuICAgKi9cbiAgZnVuY3Rpb24gZ3JvdXBCeShjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBjYWxsYmFjayA9IGNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnKTtcblxuICAgIGZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSwgY29sbGVjdGlvbikge1xuICAgICAga2V5ID0gY2FsbGJhY2sodmFsdWUsIGtleSwgY29sbGVjdGlvbikgKyAnJztcbiAgICAgIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdCwga2V5KSA/IHJlc3VsdFtrZXldIDogcmVzdWx0W2tleV0gPSBbXSkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZva2VzIHRoZSBtZXRob2QgbmFtZWQgYnkgYG1ldGhvZE5hbWVgIG9uIGVhY2ggZWxlbWVudCBpbiB0aGUgYGNvbGxlY3Rpb25gLFxuICAgKiByZXR1cm5pbmcgYW4gYXJyYXkgb2YgdGhlIHJlc3VsdHMgb2YgZWFjaCBpbnZva2VkIG1ldGhvZC4gQWRkaXRpb25hbCBhcmd1bWVudHNcbiAgICogd2lsbCBiZSBwYXNzZWQgdG8gZWFjaCBpbnZva2VkIG1ldGhvZC4gSWYgYG1ldGhvZE5hbWVgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGxcbiAgICogYmUgaW52b2tlZCBmb3IsIGFuZCBgdGhpc2AgYm91bmQgdG8sIGVhY2ggZWxlbWVudCBpbiB0aGUgYGNvbGxlY3Rpb25gLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gbWV0aG9kTmFtZSBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHRvIGludm9rZSBvclxuICAgKiAgdGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHtNaXhlZH0gW2FyZzEsIGFyZzIsIC4uLl0gQXJndW1lbnRzIHRvIGludm9rZSB0aGUgbWV0aG9kIHdpdGguXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiBlYWNoIGludm9rZWQgbWV0aG9kLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmludm9rZShbWzUsIDEsIDddLCBbMywgMiwgMV1dLCAnc29ydCcpO1xuICAgKiAvLyA9PiBbWzEsIDUsIDddLCBbMSwgMiwgM11dXG4gICAqXG4gICAqIF8uaW52b2tlKFsxMjMsIDQ1Nl0sIFN0cmluZy5wcm90b3R5cGUuc3BsaXQsICcnKTtcbiAgICogLy8gPT4gW1snMScsICcyJywgJzMnXSwgWyc0JywgJzUnLCAnNiddXVxuICAgKi9cbiAgZnVuY3Rpb24gaW52b2tlKGNvbGxlY3Rpb24sIG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlKGFyZ3VtZW50cywgMiksXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGlzRnVuYyA9IHR5cGVvZiBtZXRob2ROYW1lID09ICdmdW5jdGlvbicsXG4gICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDAsXG4gICAgICAgIHJlc3VsdCA9IEFycmF5KHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgPyBsZW5ndGggOiAwKTtcblxuICAgIGZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJlc3VsdFsrK2luZGV4XSA9IChpc0Z1bmMgPyBtZXRob2ROYW1lIDogdmFsdWVbbWV0aG9kTmFtZV0pLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdmFsdWVzIGJ5IHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIHRoZSBgY29sbGVjdGlvbmBcbiAgICogdGhyb3VnaCB0aGUgYGNhbGxiYWNrYC4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGhcbiAgICogdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogSWYgYW4gb2JqZWN0IGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BldGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgKiBlbHNlIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGFsaWFzIGNvbGxlY3RcbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fFN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlclxuICAgKiAgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHBhc3NlZCwgaXQgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZVxuICAgKiAgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiBlYWNoIGBjYWxsYmFja2AgZXhlY3V0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLm1hcChbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICogMzsgfSk7XG4gICAqIC8vID0+IFszLCA2LCA5XVxuICAgKlxuICAgKiBfLm1hcCh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9LCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIG51bSAqIDM7IH0pO1xuICAgKiAvLyA9PiBbMywgNiwgOV0gKG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICAgKlxuICAgKiB2YXIgc3Rvb2dlcyA9IFtcbiAgICogICB7ICduYW1lJzogJ21vZScsICdhZ2UnOiA0MCB9LFxuICAgKiAgIHsgJ25hbWUnOiAnbGFycnknLCAnYWdlJzogNTAgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5tYXAoc3Rvb2dlcywgJ25hbWUnKTtcbiAgICogLy8gPT4gWydtb2UnLCAnbGFycnknXVxuICAgKi9cbiAgZnVuY3Rpb24gbWFwKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDAsXG4gICAgICAgIHJlc3VsdCA9IEFycmF5KHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgPyBsZW5ndGggOiAwKTtcblxuICAgIGNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgIGlmIChpc0FycmF5KGNvbGxlY3Rpb24pKSB7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gY2FsbGJhY2soY29sbGVjdGlvbltpbmRleF0sIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJlc3VsdFsrK2luZGV4XSA9IGNhbGxiYWNrKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBtYXhpbXVtIHZhbHVlIG9mIGFuIGBhcnJheWAuIElmIGBjYWxsYmFja2AgaXMgcGFzc2VkLFxuICAgKiBpdCB3aWxsIGJlIGV4ZWN1dGVkIGZvciBlYWNoIHZhbHVlIGluIHRoZSBgYXJyYXlgIHRvIGdlbmVyYXRlIHRoZVxuICAgKiBjcml0ZXJpb24gYnkgd2hpY2ggdGhlIHZhbHVlIGlzIHJhbmtlZC4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG9cbiAgICogYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKS5cbiAgICpcbiAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBJZiBhbiBvYmplY3QgaXMgcGFzc2VkIGZvciBgY2FsbGJhY2tgLCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGV0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAqIGVsc2UgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8U3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyXG4gICAqICBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcGFzc2VkLCBpdCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlXG4gICAqICBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMge01peGVkfSBSZXR1cm5zIHRoZSBtYXhpbXVtIHZhbHVlLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLm1heChbNCwgMiwgOCwgNl0pO1xuICAgKiAvLyA9PiA4XG4gICAqXG4gICAqIHZhciBzdG9vZ2VzID0gW1xuICAgKiAgIHsgJ25hbWUnOiAnbW9lJywgJ2FnZSc6IDQwIH0sXG4gICAqICAgeyAnbmFtZSc6ICdsYXJyeScsICdhZ2UnOiA1MCB9XG4gICAqIF07XG4gICAqXG4gICAqIF8ubWF4KHN0b29nZXMsIGZ1bmN0aW9uKHN0b29nZSkgeyByZXR1cm4gc3Rvb2dlLmFnZTsgfSk7XG4gICAqIC8vID0+IHsgJ25hbWUnOiAnbGFycnknLCAnYWdlJzogNTAgfTtcbiAgICpcbiAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAqIF8ubWF4KHN0b29nZXMsICdhZ2UnKTtcbiAgICogLy8gPT4geyAnbmFtZSc6ICdsYXJyeScsICdhZ2UnOiA1MCB9O1xuICAgKi9cbiAgZnVuY3Rpb24gbWF4KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIGNvbXB1dGVkID0gLUluZmluaXR5LFxuICAgICAgICByZXN1bHQgPSBjb21wdXRlZDtcblxuICAgIGlmICghY2FsbGJhY2sgJiYgaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICBpZiAodmFsdWUgPiByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayA9ICFjYWxsYmFjayAmJiBpc1N0cmluZyhjb2xsZWN0aW9uKVxuICAgICAgICA/IGNoYXJBdENhbGxiYWNrXG4gICAgICAgIDogY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcpO1xuXG4gICAgICBlYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICB2YXIgY3VycmVudCA9IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICAgIGlmIChjdXJyZW50ID4gY29tcHV0ZWQpIHtcbiAgICAgICAgICBjb21wdXRlZCA9IGN1cnJlbnQ7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgbWluaW11bSB2YWx1ZSBvZiBhbiBgYXJyYXlgLiBJZiBgY2FsbGJhY2tgIGlzIHBhc3NlZCxcbiAgICogaXQgd2lsbCBiZSBleGVjdXRlZCBmb3IgZWFjaCB2YWx1ZSBpbiB0aGUgYGFycmF5YCB0byBnZW5lcmF0ZSB0aGVcbiAgICogY3JpdGVyaW9uIGJ5IHdoaWNoIHRoZSB2YWx1ZSBpcyByYW5rZWQuIFRoZSBgY2FsbGJhY2tgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYFxuICAgKiBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogSWYgYW4gb2JqZWN0IGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BldGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgKiBlbHNlIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fFN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlclxuICAgKiAgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHBhc3NlZCwgaXQgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZVxuICAgKiAgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtNaXhlZH0gUmV0dXJucyB0aGUgbWluaW11bSB2YWx1ZS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5taW4oWzQsIDIsIDgsIDZdKTtcbiAgICogLy8gPT4gMlxuICAgKlxuICAgKiB2YXIgc3Rvb2dlcyA9IFtcbiAgICogICB7ICduYW1lJzogJ21vZScsICdhZ2UnOiA0MCB9LFxuICAgKiAgIHsgJ25hbWUnOiAnbGFycnknLCAnYWdlJzogNTAgfVxuICAgKiBdO1xuICAgKlxuICAgKiBfLm1pbihzdG9vZ2VzLCBmdW5jdGlvbihzdG9vZ2UpIHsgcmV0dXJuIHN0b29nZS5hZ2U7IH0pO1xuICAgKiAvLyA9PiB7ICduYW1lJzogJ21vZScsICdhZ2UnOiA0MCB9O1xuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5taW4oc3Rvb2dlcywgJ2FnZScpO1xuICAgKiAvLyA9PiB7ICduYW1lJzogJ21vZScsICdhZ2UnOiA0MCB9O1xuICAgKi9cbiAgZnVuY3Rpb24gbWluKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIGNvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHJlc3VsdCA9IGNvbXB1dGVkO1xuXG4gICAgaWYgKCFjYWxsYmFjayAmJiBpc0FycmF5KGNvbGxlY3Rpb24pKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gY29sbGVjdGlvbltpbmRleF07XG4gICAgICAgIGlmICh2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrID0gIWNhbGxiYWNrICYmIGlzU3RyaW5nKGNvbGxlY3Rpb24pXG4gICAgICAgID8gY2hhckF0Q2FsbGJhY2tcbiAgICAgICAgOiBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZyk7XG5cbiAgICAgIGVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgaWYgKGN1cnJlbnQgPCBjb21wdXRlZCkge1xuICAgICAgICAgIGNvbXB1dGVkID0gY3VycmVudDtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHNwZWNpZmllZCBwcm9wZXJ0eSBmcm9tIGFsbCBlbGVtZW50cyBpbiB0aGUgYGNvbGxlY3Rpb25gLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIHBsdWNrLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgcHJvcGVydHkgdmFsdWVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgc3Rvb2dlcyA9IFtcbiAgICogICB7ICduYW1lJzogJ21vZScsICdhZ2UnOiA0MCB9LFxuICAgKiAgIHsgJ25hbWUnOiAnbGFycnknLCAnYWdlJzogNTAgfVxuICAgKiBdO1xuICAgKlxuICAgKiBfLnBsdWNrKHN0b29nZXMsICduYW1lJyk7XG4gICAqIC8vID0+IFsnbW9lJywgJ2xhcnJ5J11cbiAgICovXG4gIHZhciBwbHVjayA9IG1hcDtcblxuICAvKipcbiAgICogUmVkdWNlcyBhIGBjb2xsZWN0aW9uYCB0byBhIHZhbHVlIHRoYXQgaXMgdGhlIGFjY3VtdWxhdGVkIHJlc3VsdCBvZiBydW5uaW5nXG4gICAqIGVhY2ggZWxlbWVudCBpbiB0aGUgYGNvbGxlY3Rpb25gIHRocm91Z2ggdGhlIGBjYWxsYmFja2AsIHdoZXJlIGVhY2ggc3VjY2Vzc2l2ZVxuICAgKiBgY2FsbGJhY2tgIGV4ZWN1dGlvbiBjb25zdW1lcyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBwcmV2aW91cyBleGVjdXRpb24uXG4gICAqIElmIGBhY2N1bXVsYXRvcmAgaXMgbm90IHBhc3NlZCwgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGBjb2xsZWN0aW9uYCB3aWxsIGJlXG4gICAqIHVzZWQgYXMgdGhlIGluaXRpYWwgYGFjY3VtdWxhdG9yYCB2YWx1ZS4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgXG4gICAqIGFuZCBpbnZva2VkIHdpdGggZm91ciBhcmd1bWVudHM7IChhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGFsaWFzIGZvbGRsLCBpbmplY3RcbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcGFyYW0ge01peGVkfSBbYWNjdW11bGF0b3JdIEluaXRpYWwgdmFsdWUgb2YgdGhlIGFjY3VtdWxhdG9yLlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtNaXhlZH0gUmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBzdW0gPSBfLnJlZHVjZShbMSwgMiwgM10sIGZ1bmN0aW9uKHN1bSwgbnVtKSB7XG4gICAqICAgcmV0dXJuIHN1bSArIG51bTtcbiAgICogfSk7XG4gICAqIC8vID0+IDZcbiAgICpcbiAgICogdmFyIG1hcHBlZCA9IF8ucmVkdWNlKHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMyB9LCBmdW5jdGlvbihyZXN1bHQsIG51bSwga2V5KSB7XG4gICAqICAgcmVzdWx0W2tleV0gPSBudW0gKiAzO1xuICAgKiAgIHJldHVybiByZXN1bHQ7XG4gICAqIH0sIHt9KTtcbiAgICogLy8gPT4geyAnYSc6IDMsICdiJzogNiwgJ2MnOiA5IH1cbiAgICovXG4gIGZ1bmN0aW9uIHJlZHVjZShjb2xsZWN0aW9uLCBjYWxsYmFjaywgYWNjdW11bGF0b3IsIHRoaXNBcmcpIHtcbiAgICB2YXIgbm9hY2N1bSA9IGFyZ3VtZW50cy5sZW5ndGggPCAzO1xuICAgIGNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDQpO1xuXG4gICAgaWYgKGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgICBpZiAobm9hY2N1bSkge1xuICAgICAgICBhY2N1bXVsYXRvciA9IGNvbGxlY3Rpb25bKytpbmRleF07XG4gICAgICB9XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCBjb2xsZWN0aW9uW2luZGV4XSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICBhY2N1bXVsYXRvciA9IG5vYWNjdW1cbiAgICAgICAgICA/IChub2FjY3VtID0gZmFsc2UsIHZhbHVlKVxuICAgICAgICAgIDogY2FsbGJhY2soYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbilcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgc2ltaWxhciB0byBgXy5yZWR1Y2VgLCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIGFcbiAgICogYGNvbGxlY3Rpb25gIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAYWxpYXMgZm9sZHJcbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcGFyYW0ge01peGVkfSBbYWNjdW11bGF0b3JdIEluaXRpYWwgdmFsdWUgb2YgdGhlIGFjY3VtdWxhdG9yLlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtNaXhlZH0gUmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBsaXN0ID0gW1swLCAxXSwgWzIsIDNdLCBbNCwgNV1dO1xuICAgKiB2YXIgZmxhdCA9IF8ucmVkdWNlUmlnaHQobGlzdCwgZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS5jb25jYXQoYik7IH0sIFtdKTtcbiAgICogLy8gPT4gWzQsIDUsIDIsIDMsIDAsIDFdXG4gICAqL1xuICBmdW5jdGlvbiByZWR1Y2VSaWdodChjb2xsZWN0aW9uLCBjYWxsYmFjaywgYWNjdW11bGF0b3IsIHRoaXNBcmcpIHtcbiAgICB2YXIgaXRlcmFibGUgPSBjb2xsZWN0aW9uLFxuICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwLFxuICAgICAgICBub2FjY3VtID0gYXJndW1lbnRzLmxlbmd0aCA8IDM7XG5cbiAgICBpZiAodHlwZW9mIGxlbmd0aCAhPSAnbnVtYmVyJykge1xuICAgICAgdmFyIHByb3BzID0ga2V5cyhjb2xsZWN0aW9uKTtcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICB9XG4gICAgY2FsbGJhY2sgPSBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgNCk7XG4gICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIGluZGV4ID0gcHJvcHMgPyBwcm9wc1stLWxlbmd0aF0gOiAtLWxlbmd0aDtcbiAgICAgIGFjY3VtdWxhdG9yID0gbm9hY2N1bVxuICAgICAgICA/IChub2FjY3VtID0gZmFsc2UsIGl0ZXJhYmxlW2luZGV4XSlcbiAgICAgICAgOiBjYWxsYmFjayhhY2N1bXVsYXRvciwgaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBvcHBvc2l0ZSBvZiBgXy5maWx0ZXJgLCB0aGlzIG1ldGhvZCByZXR1cm5zIHRoZSBlbGVtZW50cyBvZiBhXG4gICAqIGBjb2xsZWN0aW9uYCB0aGF0IGBjYWxsYmFja2AgZG9lcyAqKm5vdCoqIHJldHVybiB0cnV0aHkgZm9yLlxuICAgKlxuICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcGFzc2VkIGZvciBgY2FsbGJhY2tgLCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIElmIGFuIG9iamVjdCBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICogZWxzZSBgZmFsc2VgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxTdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXJcbiAgICogIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwYXNzZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGVcbiAgICogIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZWxlbWVudHMgdGhhdCBkaWQgKipub3QqKiBwYXNzIHRoZVxuICAgKiAgY2FsbGJhY2sgY2hlY2suXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBvZGRzID0gXy5yZWplY3QoWzEsIDIsIDMsIDQsIDUsIDZdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIG51bSAlIDIgPT0gMDsgfSk7XG4gICAqIC8vID0+IFsxLCAzLCA1XVxuICAgKlxuICAgKiB2YXIgZm9vZCA9IFtcbiAgICogICB7ICduYW1lJzogJ2FwcGxlJywgICdvcmdhbmljJzogZmFsc2UsICd0eXBlJzogJ2ZydWl0JyB9LFxuICAgKiAgIHsgJ25hbWUnOiAnY2Fycm90JywgJ29yZ2FuaWMnOiB0cnVlLCAgJ3R5cGUnOiAndmVnZXRhYmxlJyB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgKiBfLnJlamVjdChmb29kLCAnb3JnYW5pYycpO1xuICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdhcHBsZScsICdvcmdhbmljJzogZmFsc2UsICd0eXBlJzogJ2ZydWl0JyB9XVxuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5yZWplY3QoZm9vZCwgeyAndHlwZSc6ICdmcnVpdCcgfSk7XG4gICAqIC8vID0+IFt7ICduYW1lJzogJ2NhcnJvdCcsICdvcmdhbmljJzogdHJ1ZSwgJ3R5cGUnOiAndmVnZXRhYmxlJyB9XVxuICAgKi9cbiAgZnVuY3Rpb24gcmVqZWN0KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgY2FsbGJhY2sgPSBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgcmV0dXJuIGZpbHRlcihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiAhY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIHNodWZmbGVkIGBhcnJheWAgdmFsdWVzLCB1c2luZyBhIHZlcnNpb24gb2YgdGhlXG4gICAqIEZpc2hlci1ZYXRlcyBzaHVmZmxlLiBTZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXItWWF0ZXNfc2h1ZmZsZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNodWZmbGUuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBzaHVmZmxlZCBjb2xsZWN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnNodWZmbGUoWzEsIDIsIDMsIDQsIDUsIDZdKTtcbiAgICogLy8gPT4gWzQsIDEsIDYsIDMsIDUsIDJdXG4gICAqL1xuICBmdW5jdGlvbiBzaHVmZmxlKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMCxcbiAgICAgICAgcmVzdWx0ID0gQXJyYXkodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyA/IGxlbmd0aCA6IDApO1xuXG4gICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIHJhbmQgPSBmbG9vcihuYXRpdmVSYW5kb20oKSAqICgrK2luZGV4ICsgMSkpO1xuICAgICAgcmVzdWx0W2luZGV4XSA9IHJlc3VsdFtyYW5kXTtcbiAgICAgIHJlc3VsdFtyYW5kXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc2l6ZSBvZiB0aGUgYGNvbGxlY3Rpb25gIGJ5IHJldHVybmluZyBgY29sbGVjdGlvbi5sZW5ndGhgIGZvciBhcnJheXNcbiAgICogYW5kIGFycmF5LWxpa2Ugb2JqZWN0cyBvciB0aGUgbnVtYmVyIG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgZm9yIG9iamVjdHMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpbnNwZWN0LlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm5zIGBjb2xsZWN0aW9uLmxlbmd0aGAgb3IgbnVtYmVyIG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uc2l6ZShbMSwgMl0pO1xuICAgKiAvLyA9PiAyXG4gICAqXG4gICAqIF8uc2l6ZSh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9KTtcbiAgICogLy8gPT4gM1xuICAgKlxuICAgKiBfLnNpemUoJ2N1cmx5Jyk7XG4gICAqIC8vID0+IDVcbiAgICovXG4gIGZ1bmN0aW9uIHNpemUoY29sbGVjdGlvbikge1xuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwO1xuICAgIHJldHVybiB0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInID8gbGVuZ3RoIDoga2V5cyhjb2xsZWN0aW9uKS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBgY2FsbGJhY2tgIHJldHVybnMgYSB0cnV0aHkgdmFsdWUgZm9yICoqYW55KiogZWxlbWVudCBvZiBhXG4gICAqIGBjb2xsZWN0aW9uYC4gVGhlIGZ1bmN0aW9uIHJldHVybnMgYXMgc29vbiBhcyBpdCBmaW5kcyBwYXNzaW5nIHZhbHVlLCBhbmRcbiAgICogZG9lcyBub3QgaXRlcmF0ZSBvdmVyIHRoZSBlbnRpcmUgYGNvbGxlY3Rpb25gLiBUaGUgYGNhbGxiYWNrYCBpcyBib3VuZCB0b1xuICAgKiBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAgICpcbiAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBJZiBhbiBvYmplY3QgaXMgcGFzc2VkIGZvciBgY2FsbGJhY2tgLCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGV0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAqIGVsc2UgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAYWxpYXMgYW55XG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxTdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXJcbiAgICogIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwYXNzZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGVcbiAgICogIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW55IGVsZW1lbnQgcGFzc2VzIHRoZSBjYWxsYmFjayBjaGVjayxcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5zb21lKFtudWxsLCAwLCAneWVzJywgZmFsc2VdLCBCb29sZWFuKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiB2YXIgZm9vZCA9IFtcbiAgICogICB7ICduYW1lJzogJ2FwcGxlJywgICdvcmdhbmljJzogZmFsc2UsICd0eXBlJzogJ2ZydWl0JyB9LFxuICAgKiAgIHsgJ25hbWUnOiAnY2Fycm90JywgJ29yZ2FuaWMnOiB0cnVlLCAgJ3R5cGUnOiAndmVnZXRhYmxlJyB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgKiBfLnNvbWUoZm9vZCwgJ29yZ2FuaWMnKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5zb21lKGZvb2QsIHsgJ3R5cGUnOiAnbWVhdCcgfSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBzb21lKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBjYWxsYmFjayA9IGNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnKTtcblxuICAgIGlmIChpc0FycmF5KGNvbGxlY3Rpb24pKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgaWYgKChyZXN1bHQgPSBjYWxsYmFjayhjb2xsZWN0aW9uW2luZGV4XSwgaW5kZXgsIGNvbGxlY3Rpb24pKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiAhKHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIGVsZW1lbnRzLCBzb3J0ZWQgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSByZXN1bHRzIG9mXG4gICAqIHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIHRoZSBgY29sbGVjdGlvbmAgdGhyb3VnaCB0aGUgYGNhbGxiYWNrYC4gVGhpcyBtZXRob2RcbiAgICogcGVyZm9ybXMgYSBzdGFibGUgc29ydCwgdGhhdCBpcywgaXQgd2lsbCBwcmVzZXJ2ZSB0aGUgb3JpZ2luYWwgc29ydCBvcmRlciBvZlxuICAgKiBlcXVhbCBlbGVtZW50cy4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWVcbiAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogSWYgYW4gb2JqZWN0IGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BldGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgKiBlbHNlIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fFN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlclxuICAgKiAgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHBhc3NlZCwgaXQgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZVxuICAgKiAgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBzb3J0ZWQgZWxlbWVudHMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uc29ydEJ5KFsxLCAyLCAzXSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiBNYXRoLnNpbihudW0pOyB9KTtcbiAgICogLy8gPT4gWzMsIDEsIDJdXG4gICAqXG4gICAqIF8uc29ydEJ5KFsxLCAyLCAzXSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiB0aGlzLnNpbihudW0pOyB9LCBNYXRoKTtcbiAgICogLy8gPT4gWzMsIDEsIDJdXG4gICAqXG4gICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgKiBfLnNvcnRCeShbJ2JhbmFuYScsICdzdHJhd2JlcnJ5JywgJ2FwcGxlJ10sICdsZW5ndGgnKTtcbiAgICogLy8gPT4gWydhcHBsZScsICdiYW5hbmEnLCAnc3RyYXdiZXJyeSddXG4gICAqL1xuICBmdW5jdGlvbiBzb3J0QnkoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMCxcbiAgICAgICAgcmVzdWx0ID0gQXJyYXkodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyA/IGxlbmd0aCA6IDApO1xuXG4gICAgY2FsbGJhY2sgPSBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXN1bHRbKytpbmRleF0gPSB7XG4gICAgICAgICdjcml0ZXJpYSc6IGNhbGxiYWNrKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pLFxuICAgICAgICAnaW5kZXgnOiBpbmRleCxcbiAgICAgICAgJ3ZhbHVlJzogdmFsdWVcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuICAgIHJlc3VsdC5zb3J0KGNvbXBhcmVBc2NlbmRpbmcpO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgcmVzdWx0W2xlbmd0aF0gPSByZXN1bHRbbGVuZ3RoXS52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgYGNvbGxlY3Rpb25gIHRvIGFuIGFycmF5LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gY29udmVydC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgY29udmVydGVkIGFycmF5LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoZnVuY3Rpb24oKSB7IHJldHVybiBfLnRvQXJyYXkoYXJndW1lbnRzKS5zbGljZSgxKTsgfSkoMSwgMiwgMywgNCk7XG4gICAqIC8vID0+IFsyLCAzLCA0XVxuICAgKi9cbiAgZnVuY3Rpb24gdG9BcnJheShjb2xsZWN0aW9uKSB7XG4gICAgaWYgKGNvbGxlY3Rpb24gJiYgdHlwZW9mIGNvbGxlY3Rpb24ubGVuZ3RoID09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gIHNsaWNlKGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzKGNvbGxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4YW1pbmVzIGVhY2ggZWxlbWVudCBpbiBhIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGFsbCBlbGVtZW50c1xuICAgKiB0aGF0IGhhdmUgdGhlIGdpdmVuIGBwcm9wZXJ0aWVzYC4gV2hlbiBjaGVja2luZyBgcHJvcGVydGllc2AsIHRoaXMgbWV0aG9kXG4gICAqIHBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50XG4gICAqIHRvIGVhY2ggb3RoZXIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHR5cGUgRnVuY3Rpb25cbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIGZpbHRlciBieS5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgZ2l2ZW4gYHByb3BlcnRpZXNgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgc3Rvb2dlcyA9IFtcbiAgICogICB7ICduYW1lJzogJ21vZScsICdhZ2UnOiA0MCB9LFxuICAgKiAgIHsgJ25hbWUnOiAnbGFycnknLCAnYWdlJzogNTAgfVxuICAgKiBdO1xuICAgKlxuICAgKiBfLndoZXJlKHN0b29nZXMsIHsgJ2FnZSc6IDQwIH0pO1xuICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdtb2UnLCAnYWdlJzogNDAgfV1cbiAgICovXG4gIHZhciB3aGVyZSA9IGZpbHRlcjtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhcnJheSB3aXRoIGFsbCBmYWxzZXkgdmFsdWVzIG9mIGBhcnJheWAgcmVtb3ZlZC4gVGhlIHZhbHVlc1xuICAgKiBgZmFsc2VgLCBgbnVsbGAsIGAwYCwgYFwiXCJgLCBgdW5kZWZpbmVkYCBhbmQgYE5hTmAgYXJlIGFsbCBmYWxzZXkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFjdC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGZpbHRlcmVkIGFycmF5LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmNvbXBhY3QoWzAsIDEsIGZhbHNlLCAyLCAnJywgM10pO1xuICAgKiAvLyA9PiBbMSwgMiwgM11cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhY3QoYXJyYXkpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgYGFycmF5YCBlbGVtZW50cyBub3QgcHJlc2VudCBpbiB0aGUgb3RoZXIgYXJyYXlzXG4gICAqIHVzaW5nIHN0cmljdCBlcXVhbGl0eSBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcHJvY2Vzcy5cbiAgICogQHBhcmFtIHtBcnJheX0gW2FycmF5MSwgYXJyYXkyLCAuLi5dIEFycmF5cyB0byBjaGVjay5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGBhcnJheWAgZWxlbWVudHMgbm90IHByZXNlbnQgaW4gdGhlXG4gICAqICBvdGhlciBhcnJheXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZGlmZmVyZW5jZShbMSwgMiwgMywgNCwgNV0sIFs1LCAyLCAxMF0pO1xuICAgKiAvLyA9PiBbMSwgMywgNF1cbiAgICovXG4gIGZ1bmN0aW9uIGRpZmZlcmVuY2UoYXJyYXkpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICBmbGF0dGVuZWQgPSBjb25jYXQuYXBwbHkoYXJyYXlSZWYsIGFyZ3VtZW50cyksXG4gICAgICAgIGNvbnRhaW5zID0gY2FjaGVkQ29udGFpbnMoZmxhdHRlbmVkLCBsZW5ndGgpLFxuICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgICBpZiAoIWNvbnRhaW5zKHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgYGFycmF5YC4gSWYgYSBudW1iZXIgYG5gIGlzIHBhc3NlZCwgdGhlIGZpcnN0XG4gICAqIGBuYCBlbGVtZW50cyBvZiB0aGUgYGFycmF5YCBhcmUgcmV0dXJuZWQuIElmIGEgYGNhbGxiYWNrYCBmdW5jdGlvbiBpcyBwYXNzZWQsXG4gICAqIHRoZSBmaXJzdCBlbGVtZW50cyB0aGUgYGNhbGxiYWNrYCByZXR1cm5zIHRydXRoeSBmb3IgYXJlIHJldHVybmVkLiBUaGUgYGNhbGxiYWNrYFxuICAgKiBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXgsIGFycmF5KS5cbiAgICpcbiAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBJZiBhbiBvYmplY3QgaXMgcGFzc2VkIGZvciBgY2FsbGJhY2tgLCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGV0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAqIGVsc2UgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAYWxpYXMgaGVhZCwgdGFrZVxuICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8TnVtYmVyfFN0cmluZ30gW2NhbGxiYWNrfG5dIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICogIHBlciBlbGVtZW50IG9yIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gcmV0dXJuLiBJZiBhIHByb3BlcnR5IG5hbWUgb3JcbiAgICogIG9iamVjdCBpcyBwYXNzZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIlxuICAgKiAgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQocykgb2YgYGFycmF5YC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5maXJzdChbMSwgMiwgM10pO1xuICAgKiAvLyA9PiAxXG4gICAqXG4gICAqIF8uZmlyc3QoWzEsIDIsIDNdLCAyKTtcbiAgICogLy8gPT4gWzEsIDJdXG4gICAqXG4gICAqIF8uZmlyc3QoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHtcbiAgICogICByZXR1cm4gbnVtIDwgMztcbiAgICogfSk7XG4gICAqIC8vID0+IFsxLCAyXVxuICAgKlxuICAgKiB2YXIgZm9vZCA9IFtcbiAgICogICB7ICduYW1lJzogJ2JhbmFuYScsICdvcmdhbmljJzogdHJ1ZSB9LFxuICAgKiAgIHsgJ25hbWUnOiAnYmVldCcsICAgJ29yZ2FuaWMnOiBmYWxzZSB9LFxuICAgKiBdO1xuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5maXJzdChmb29kLCAnb3JnYW5pYycpO1xuICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdiYW5hbmEnLCAnb3JnYW5pYyc6IHRydWUgfV1cbiAgICpcbiAgICogdmFyIGZvb2QgPSBbXG4gICAqICAgeyAnbmFtZSc6ICdhcHBsZScsICAndHlwZSc6ICdmcnVpdCcgfSxcbiAgICogICB7ICduYW1lJzogJ2JhbmFuYScsICd0eXBlJzogJ2ZydWl0JyB9LFxuICAgKiAgIHsgJ25hbWUnOiAnYmVldCcsICAgJ3R5cGUnOiAndmVnZXRhYmxlJyB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgKiBfLmZpcnN0KGZvb2QsIHsgJ3R5cGUnOiAnZnJ1aXQnIH0pO1xuICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdhcHBsZScsICd0eXBlJzogJ2ZydWl0JyB9LCB7ICduYW1lJzogJ2JhbmFuYScsICd0eXBlJzogJ2ZydWl0JyB9XVxuICAgKi9cbiAgZnVuY3Rpb24gZmlyc3QoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKGFycmF5KSB7XG4gICAgICB2YXIgbiA9IDAsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdudW1iZXInICYmIGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XG4gICAgICAgIGNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCAmJiBjYWxsYmFjayhhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgICAgICBuKys7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG4gPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKG4gPT0gbnVsbCB8fCB0aGlzQXJnKSB7XG4gICAgICAgICAgcmV0dXJuIGFycmF5WzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc2xpY2UoYXJyYXksIDAsIG5hdGl2ZU1pbihuYXRpdmVNYXgoMCwgbiksIGxlbmd0aCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGbGF0dGVucyBhIG5lc3RlZCBhcnJheSAodGhlIG5lc3RpbmcgY2FuIGJlIHRvIGFueSBkZXB0aCkuIElmIGBzaGFsbG93YCBpc1xuICAgKiB0cnV0aHksIGBhcnJheWAgd2lsbCBvbmx5IGJlIGZsYXR0ZW5lZCBhIHNpbmdsZSBsZXZlbC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYWN0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IHNoYWxsb3cgQSBmbGFnIHRvIGluZGljYXRlIG9ubHkgZmxhdHRlbmluZyBhIHNpbmdsZSBsZXZlbC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5mbGF0dGVuKFsxLCBbMl0sIFszLCBbWzRdXV1dKTtcbiAgICogLy8gPT4gWzEsIDIsIDMsIDRdO1xuICAgKlxuICAgKiBfLmZsYXR0ZW4oWzEsIFsyXSwgWzMsIFtbNF1dXV0sIHRydWUpO1xuICAgKiAvLyA9PiBbMSwgMiwgMywgW1s0XV1dO1xuICAgKi9cbiAgZnVuY3Rpb24gZmxhdHRlbihhcnJheSwgc2hhbGxvdykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcblxuICAgICAgLy8gcmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKVxuICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHB1c2guYXBwbHkocmVzdWx0LCBzaGFsbG93ID8gdmFsdWUgOiBmbGF0dGVuKHZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYHZhbHVlYCBpcyBmb3VuZCB1c2luZ1xuICAgKiBzdHJpY3QgZXF1YWxpdHkgZm9yIGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLiBJZiB0aGUgYGFycmF5YCBpcyBhbHJlYWR5XG4gICAqIHNvcnRlZCwgcGFzc2luZyBgdHJ1ZWAgZm9yIGBmcm9tSW5kZXhgIHdpbGwgcnVuIGEgZmFzdGVyIGJpbmFyeSBzZWFyY2guXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAgICogQHBhcmFtIHtCb29sZWFufE51bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20gb3IgYHRydWVgIHRvXG4gICAqICBwZXJmb3JtIGEgYmluYXJ5IHNlYXJjaCBvbiBhIHNvcnRlZCBgYXJyYXlgLlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSBvciBgLTFgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmluZGV4T2YoWzEsIDIsIDMsIDEsIDIsIDNdLCAyKTtcbiAgICogLy8gPT4gMVxuICAgKlxuICAgKiBfLmluZGV4T2YoWzEsIDIsIDMsIDEsIDIsIDNdLCAyLCAzKTtcbiAgICogLy8gPT4gNFxuICAgKlxuICAgKiBfLmluZGV4T2YoWzEsIDEsIDIsIDIsIDMsIDNdLCAyLCB0cnVlKTtcbiAgICogLy8gPT4gMlxuICAgKi9cbiAgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgICBpZiAodHlwZW9mIGZyb21JbmRleCA9PSAnbnVtYmVyJykge1xuICAgICAgaW5kZXggPSAoZnJvbUluZGV4IDwgMCA/IG5hdGl2ZU1heCgwLCBsZW5ndGggKyBmcm9tSW5kZXgpIDogZnJvbUluZGV4IHx8IDApIC0gMTtcbiAgICB9IGVsc2UgaWYgKGZyb21JbmRleCkge1xuICAgICAgaW5kZXggPSBzb3J0ZWRJbmRleChhcnJheSwgdmFsdWUpO1xuICAgICAgcmV0dXJuIGFycmF5W2luZGV4XSA9PT0gdmFsdWUgPyBpbmRleCA6IC0xO1xuICAgIH1cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKGFycmF5W2luZGV4XSA9PT0gdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbGwgYnV0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYGFycmF5YC4gSWYgYSBudW1iZXIgYG5gIGlzIHBhc3NlZCwgdGhlXG4gICAqIGxhc3QgYG5gIGVsZW1lbnRzIGFyZSBleGNsdWRlZCBmcm9tIHRoZSByZXN1bHQuIElmIGEgYGNhbGxiYWNrYCBmdW5jdGlvblxuICAgKiBpcyBwYXNzZWQsIHRoZSBsYXN0IGVsZW1lbnRzIHRoZSBgY2FsbGJhY2tgIHJldHVybnMgdHJ1dGh5IGZvciBhcmUgZXhjbHVkZWRcbiAgICogZnJvbSB0aGUgcmVzdWx0LiBUaGUgYGNhbGxiYWNrYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICAgKiBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXgsIGFycmF5KS5cbiAgICpcbiAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBJZiBhbiBvYmplY3QgaXMgcGFzc2VkIGZvciBgY2FsbGJhY2tgLCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGV0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAqIGVsc2UgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8TnVtYmVyfFN0cmluZ30gW2NhbGxiYWNrfG49MV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgKiAgcGVyIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBleGNsdWRlLiBJZiBhIHByb3BlcnR5IG5hbWUgb3JcbiAgICogIG9iamVjdCBpcyBwYXNzZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIlxuICAgKiAgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBzbGljZSBvZiBgYXJyYXlgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmluaXRpYWwoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gWzEsIDJdXG4gICAqXG4gICAqIF8uaW5pdGlhbChbMSwgMiwgM10sIDIpO1xuICAgKiAvLyA9PiBbMV1cbiAgICpcbiAgICogXy5pbml0aWFsKFsxLCAyLCAzXSwgZnVuY3Rpb24obnVtKSB7XG4gICAqICAgcmV0dXJuIG51bSA+IDE7XG4gICAqIH0pO1xuICAgKiAvLyA9PiBbMV1cbiAgICpcbiAgICogdmFyIGZvb2QgPSBbXG4gICAqICAgeyAnbmFtZSc6ICdiZWV0JywgICAnb3JnYW5pYyc6IGZhbHNlIH0sXG4gICAqICAgeyAnbmFtZSc6ICdjYXJyb3QnLCAnb3JnYW5pYyc6IHRydWUgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5pbml0aWFsKGZvb2QsICdvcmdhbmljJyk7XG4gICAqIC8vID0+IFt7ICduYW1lJzogJ2JlZXQnLCAgICdvcmdhbmljJzogZmFsc2UgfV1cbiAgICpcbiAgICogdmFyIGZvb2QgPSBbXG4gICAqICAgeyAnbmFtZSc6ICdiYW5hbmEnLCAndHlwZSc6ICdmcnVpdCcgfSxcbiAgICogICB7ICduYW1lJzogJ2JlZXQnLCAgICd0eXBlJzogJ3ZlZ2V0YWJsZScgfSxcbiAgICogICB7ICduYW1lJzogJ2NhcnJvdCcsICd0eXBlJzogJ3ZlZ2V0YWJsZScgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5pbml0aWFsKGZvb2QsIHsgJ3R5cGUnOiAndmVnZXRhYmxlJyB9KTtcbiAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFuYW5hJywgJ3R5cGUnOiAnZnJ1aXQnIH1dXG4gICAqL1xuICBmdW5jdGlvbiBpbml0aWFsKGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgdmFyIG4gPSAwLFxuICAgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdudW1iZXInICYmIGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgIHZhciBpbmRleCA9IGxlbmd0aDtcbiAgICAgIGNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgd2hpbGUgKGluZGV4LS0gJiYgY2FsbGJhY2soYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgIG4rKztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbiA9IChjYWxsYmFjayA9PSBudWxsIHx8IHRoaXNBcmcpID8gMSA6IGNhbGxiYWNrIHx8IG47XG4gICAgfVxuICAgIHJldHVybiBzbGljZShhcnJheSwgMCwgbmF0aXZlTWluKG5hdGl2ZU1heCgwLCBsZW5ndGggLSBuKSwgbGVuZ3RoKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIGludGVyc2VjdGlvbiBvZiBhbGwgdGhlIHBhc3NlZC1pbiBhcnJheXMgdXNpbmcgc3RyaWN0IGVxdWFsaXR5XG4gICAqIGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAqIEBwYXJhbSB7QXJyYXl9IFthcnJheTEsIGFycmF5MiwgLi4uXSBBcnJheXMgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHVuaXF1ZSBlbGVtZW50cyB0aGF0IGFyZSBwcmVzZW50XG4gICAqICBpbiAqKmFsbCoqIG9mIHRoZSBhcnJheXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaW50ZXJzZWN0aW9uKFsxLCAyLCAzXSwgWzEwMSwgMiwgMSwgMTBdLCBbMiwgMV0pO1xuICAgKiAvLyA9PiBbMSwgMl1cbiAgICovXG4gIGZ1bmN0aW9uIGludGVyc2VjdGlvbihhcnJheSkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBhcmdzTGVuZ3RoID0gYXJncy5sZW5ndGgsXG4gICAgICAgIGNhY2hlID0geyAnMCc6IHt9IH0sXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgaXNMYXJnZSA9IGxlbmd0aCA+PSAxMDAsXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBzZWVuID0gcmVzdWx0O1xuXG4gICAgb3V0ZXI6XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICAgIGlmIChpc0xhcmdlKSB7XG4gICAgICAgIHZhciBrZXkgPSB2YWx1ZSArICcnO1xuICAgICAgICB2YXIgaW5pdGVkID0gaGFzT3duUHJvcGVydHkuY2FsbChjYWNoZVswXSwga2V5KVxuICAgICAgICAgID8gIShzZWVuID0gY2FjaGVbMF1ba2V5XSlcbiAgICAgICAgICA6IChzZWVuID0gY2FjaGVbMF1ba2V5XSA9IFtdKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbml0ZWQgfHwgaW5kZXhPZihzZWVuLCB2YWx1ZSkgPCAwKSB7XG4gICAgICAgIGlmIChpc0xhcmdlKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXJnc0luZGV4ID0gYXJnc0xlbmd0aDtcbiAgICAgICAgd2hpbGUgKC0tYXJnc0luZGV4KSB7XG4gICAgICAgICAgaWYgKCEoY2FjaGVbYXJnc0luZGV4XSB8fCAoY2FjaGVbYXJnc0luZGV4XSA9IGNhY2hlZENvbnRhaW5zKGFyZ3NbYXJnc0luZGV4XSwgMCwgMTAwKSkpKHZhbHVlKSkge1xuICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsYXN0IGVsZW1lbnQgb2YgdGhlIGBhcnJheWAuIElmIGEgbnVtYmVyIGBuYCBpcyBwYXNzZWQsIHRoZSBsYXN0XG4gICAqIGBuYCBlbGVtZW50cyBvZiB0aGUgYGFycmF5YCBhcmUgcmV0dXJuZWQuIElmIGEgYGNhbGxiYWNrYCBmdW5jdGlvbiBpcyBwYXNzZWQsXG4gICAqIHRoZSBsYXN0IGVsZW1lbnRzIHRoZSBgY2FsbGJhY2tgIHJldHVybnMgdHJ1dGh5IGZvciBhcmUgcmV0dXJuZWQuIFRoZSBgY2FsbGJhY2tgXG4gICAqIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICAgKlxuICAgKlxuICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcGFzc2VkIGZvciBgY2FsbGJhY2tgLCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIElmIGFuIG9iamVjdCBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICogZWxzZSBgZmFsc2VgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxOdW1iZXJ8U3RyaW5nfSBbY2FsbGJhY2t8bl0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgKiAgcGVyIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uIElmIGEgcHJvcGVydHkgbmFtZSBvclxuICAgKiAgb2JqZWN0IGlzIHBhc3NlZCwgaXQgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiXG4gICAqICBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgKiBAcGFyYW0ge01peGVkfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtNaXhlZH0gUmV0dXJucyB0aGUgbGFzdCBlbGVtZW50KHMpIG9mIGBhcnJheWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8ubGFzdChbMSwgMiwgM10pO1xuICAgKiAvLyA9PiAzXG4gICAqXG4gICAqIF8ubGFzdChbMSwgMiwgM10sIDIpO1xuICAgKiAvLyA9PiBbMiwgM11cbiAgICpcbiAgICogXy5sYXN0KFsxLCAyLCAzXSwgZnVuY3Rpb24obnVtKSB7XG4gICAqICAgcmV0dXJuIG51bSA+IDE7XG4gICAqIH0pO1xuICAgKiAvLyA9PiBbMiwgM11cbiAgICpcbiAgICogdmFyIGZvb2QgPSBbXG4gICAqICAgeyAnbmFtZSc6ICdiZWV0JywgICAnb3JnYW5pYyc6IGZhbHNlIH0sXG4gICAqICAgeyAnbmFtZSc6ICdjYXJyb3QnLCAnb3JnYW5pYyc6IHRydWUgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICogXy5sYXN0KGZvb2QsICdvcmdhbmljJyk7XG4gICAqIC8vID0+IFt7ICduYW1lJzogJ2NhcnJvdCcsICdvcmdhbmljJzogdHJ1ZSB9XVxuICAgKlxuICAgKiB2YXIgZm9vZCA9IFtcbiAgICogICB7ICduYW1lJzogJ2JhbmFuYScsICd0eXBlJzogJ2ZydWl0JyB9LFxuICAgKiAgIHsgJ25hbWUnOiAnYmVldCcsICAgJ3R5cGUnOiAndmVnZXRhYmxlJyB9LFxuICAgKiAgIHsgJ25hbWUnOiAnY2Fycm90JywgJ3R5cGUnOiAndmVnZXRhYmxlJyB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgKiBfLmxhc3QoZm9vZCwgeyAndHlwZSc6ICd2ZWdldGFibGUnIH0pO1xuICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdiZWV0JywgJ3R5cGUnOiAndmVnZXRhYmxlJyB9LCB7ICduYW1lJzogJ2NhcnJvdCcsICd0eXBlJzogJ3ZlZ2V0YWJsZScgfV1cbiAgICovXG4gIGZ1bmN0aW9uIGxhc3QoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKGFycmF5KSB7XG4gICAgICB2YXIgbiA9IDAsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdudW1iZXInICYmIGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gbGVuZ3RoO1xuICAgICAgICBjYWxsYmFjayA9IGNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgICAgd2hpbGUgKGluZGV4LS0gJiYgY2FsbGJhY2soYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgICAgbisrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuID0gY2FsbGJhY2s7XG4gICAgICAgIGlmIChuID09IG51bGwgfHwgdGhpc0FyZykge1xuICAgICAgICAgIHJldHVybiBhcnJheVtsZW5ndGggLSAxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWNlKGFycmF5LCBuYXRpdmVNYXgoMCwgbGVuZ3RoIC0gbikpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgbGFzdCBvY2N1cnJlbmNlIG9mIGB2YWx1ZWAgaXMgZm91bmQgdXNpbmcgc3RyaWN0XG4gICAqIGVxdWFsaXR5IGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC4gSWYgYGZyb21JbmRleGAgaXMgbmVnYXRpdmUsIGl0IGlzIHVzZWRcbiAgICogYXMgdGhlIG9mZnNldCBmcm9tIHRoZSBlbmQgb2YgdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtmcm9tSW5kZXg9YXJyYXkubGVuZ3RoLTFdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAgICogQHJldHVybnMge051bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUgb3IgYC0xYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5sYXN0SW5kZXhPZihbMSwgMiwgMywgMSwgMiwgM10sIDIpO1xuICAgKiAvLyA9PiA0XG4gICAqXG4gICAqIF8ubGFzdEluZGV4T2YoWzEsIDIsIDMsIDEsIDIsIDNdLCAyLCAzKTtcbiAgICogLy8gPT4gMVxuICAgKi9cbiAgZnVuY3Rpb24gbGFzdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgaW5kZXggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggPT0gJ251bWJlcicpIHtcbiAgICAgIGluZGV4ID0gKGZyb21JbmRleCA8IDAgPyBuYXRpdmVNYXgoMCwgaW5kZXggKyBmcm9tSW5kZXgpIDogbmF0aXZlTWluKGZyb21JbmRleCwgaW5kZXggLSAxKSkgKyAxO1xuICAgIH1cbiAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgaWYgKGFycmF5W2luZGV4XSA9PT0gdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgZnJvbSBhcnJheXMgb2YgYGtleXNgIGFuZCBgdmFsdWVzYC4gUGFzcyBlaXRoZXJcbiAgICogYSBzaW5nbGUgdHdvIGRpbWVuc2lvbmFsIGFycmF5LCBpLmUuIGBbW2tleTEsIHZhbHVlMV0sIFtrZXkyLCB2YWx1ZTJdXWAsIG9yXG4gICAqIHR3byBhcnJheXMsIG9uZSBvZiBga2V5c2AgYW5kIG9uZSBvZiBjb3JyZXNwb25kaW5nIGB2YWx1ZXNgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBUaGUgYXJyYXkgb2Yga2V5cy5cbiAgICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlcz1bXV0gVGhlIGFycmF5IG9mIHZhbHVlcy5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIGdpdmVuIGtleXMgYW5kXG4gICAqICBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5vYmplY3QoWydtb2UnLCAnbGFycnknXSwgWzMwLCA0MF0pO1xuICAgKiAvLyA9PiB7ICdtb2UnOiAzMCwgJ2xhcnJ5JzogNDAgfVxuICAgKi9cbiAgZnVuY3Rpb24gb2JqZWN0KGtleXMsIHZhbHVlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBrZXlzID8ga2V5cy5sZW5ndGggOiAwLFxuICAgICAgICByZXN1bHQgPSB7fTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVzW2luZGV4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXlbMF1dID0ga2V5WzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgbnVtYmVycyAocG9zaXRpdmUgYW5kL29yIG5lZ2F0aXZlKSBwcm9ncmVzc2luZyBmcm9tXG4gICAqIGBzdGFydGAgdXAgdG8gYnV0IG5vdCBpbmNsdWRpbmcgYGVuZGAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgKiBAcGFyYW0ge051bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBvZiB0aGUgcmFuZ2UuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBlbmQgVGhlIGVuZCBvZiB0aGUgcmFuZ2UuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbc3RlcD0xXSBUaGUgdmFsdWUgdG8gaW5jcmVtZW50IG9yIGRlc2NyZW1lbnQgYnkuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyByYW5nZSBhcnJheS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5yYW5nZSgxMCk7XG4gICAqIC8vID0+IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XVxuICAgKlxuICAgKiBfLnJhbmdlKDEsIDExKTtcbiAgICogLy8gPT4gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwXVxuICAgKlxuICAgKiBfLnJhbmdlKDAsIDMwLCA1KTtcbiAgICogLy8gPT4gWzAsIDUsIDEwLCAxNSwgMjAsIDI1XVxuICAgKlxuICAgKiBfLnJhbmdlKDAsIC0xMCwgLTEpO1xuICAgKiAvLyA9PiBbMCwgLTEsIC0yLCAtMywgLTQsIC01LCAtNiwgLTcsIC04LCAtOV1cbiAgICpcbiAgICogXy5yYW5nZSgwKTtcbiAgICogLy8gPT4gW11cbiAgICovXG4gIGZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICBzdGFydCA9ICtzdGFydCB8fCAwO1xuICAgIHN0ZXAgPSArc3RlcCB8fCAxO1xuXG4gICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgLy8gdXNlIGBBcnJheShsZW5ndGgpYCBzbyBWOCB3aWxsIGF2b2lkIHRoZSBzbG93ZXIgXCJkaWN0aW9uYXJ5XCIgbW9kZVxuICAgIC8vIGh0dHA6Ly95b3V0dS5iZS9YQXFJcEdVOFpaayN0PTE3bTI1c1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoMCwgY2VpbCgoZW5kIC0gc3RhcnQpIC8gc3RlcCkpLFxuICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBzdGFydDtcbiAgICAgIHN0YXJ0ICs9IHN0ZXA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG9wcG9zaXRlIG9mIGBfLmluaXRpYWxgLCB0aGlzIG1ldGhvZCBnZXRzIGFsbCBidXQgdGhlIGZpcnN0IHZhbHVlIG9mIGBhcnJheWAuXG4gICAqIElmIGEgbnVtYmVyIGBuYCBpcyBwYXNzZWQsIHRoZSBmaXJzdCBgbmAgdmFsdWVzIGFyZSBleGNsdWRlZCBmcm9tIHRoZSByZXN1bHQuXG4gICAqIElmIGEgYGNhbGxiYWNrYCBmdW5jdGlvbiBpcyBwYXNzZWQsIHRoZSBmaXJzdCBlbGVtZW50cyB0aGUgYGNhbGxiYWNrYCByZXR1cm5zXG4gICAqIHRydXRoeSBmb3IgYXJlIGV4Y2x1ZGVkIGZyb20gdGhlIHJlc3VsdC4gVGhlIGBjYWxsYmFja2AgaXMgYm91bmQgdG8gYHRoaXNBcmdgXG4gICAqIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBhcnJheSkuXG4gICAqXG4gICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogSWYgYW4gb2JqZWN0IGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BldGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgKiBlbHNlIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGFsaWFzIGRyb3AsIHRhaWxcbiAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fE51bWJlcnxTdHJpbmd9IFtjYWxsYmFja3xuPTFdIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICogIHBlciBlbGVtZW50IG9yIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gZXhjbHVkZS4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yXG4gICAqICBvYmplY3QgaXMgcGFzc2VkLCBpdCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCJcbiAgICogIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgc2xpY2Ugb2YgYGFycmF5YC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5yZXN0KFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IFsyLCAzXVxuICAgKlxuICAgKiBfLnJlc3QoWzEsIDIsIDNdLCAyKTtcbiAgICogLy8gPT4gWzNdXG4gICAqXG4gICAqIF8ucmVzdChbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkge1xuICAgKiAgIHJldHVybiBudW0gPCAzO1xuICAgKiB9KTtcbiAgICogLy8gPT4gWzNdXG4gICAqXG4gICAqIHZhciBmb29kID0gW1xuICAgKiAgIHsgJ25hbWUnOiAnYmFuYW5hJywgJ29yZ2FuaWMnOiB0cnVlIH0sXG4gICAqICAgeyAnbmFtZSc6ICdiZWV0JywgICAnb3JnYW5pYyc6IGZhbHNlIH0sXG4gICAqIF07XG4gICAqXG4gICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgKiBfLnJlc3QoZm9vZCwgJ29yZ2FuaWMnKTtcbiAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmVldCcsICdvcmdhbmljJzogZmFsc2UgfV1cbiAgICpcbiAgICogdmFyIGZvb2QgPSBbXG4gICAqICAgeyAnbmFtZSc6ICdhcHBsZScsICAndHlwZSc6ICdmcnVpdCcgfSxcbiAgICogICB7ICduYW1lJzogJ2JhbmFuYScsICd0eXBlJzogJ2ZydWl0JyB9LFxuICAgKiAgIHsgJ25hbWUnOiAnYmVldCcsICAgJ3R5cGUnOiAndmVnZXRhYmxlJyB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgKiBfLnJlc3QoZm9vZCwgeyAndHlwZSc6ICdmcnVpdCcgfSk7XG4gICAqIC8vID0+IFt7ICduYW1lJzogJ2JlZXQnLCAndHlwZSc6ICd2ZWdldGFibGUnIH1dXG4gICAqL1xuICBmdW5jdGlvbiByZXN0KGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ251bWJlcicgJiYgY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgdmFyIG4gPSAwLFxuICAgICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gICAgICBjYWxsYmFjayA9IGNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoICYmIGNhbGxiYWNrKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgICBuKys7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG4gPSAoY2FsbGJhY2sgPT0gbnVsbCB8fCB0aGlzQXJnKSA/IDEgOiBuYXRpdmVNYXgoMCwgY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gc2xpY2UoYXJyYXksIG4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZXMgYSBiaW5hcnkgc2VhcmNoIHRvIGRldGVybWluZSB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2ggdGhlIGB2YWx1ZWBcbiAgICogc2hvdWxkIGJlIGluc2VydGVkIGludG8gYGFycmF5YCBpbiBvcmRlciB0byBtYWludGFpbiB0aGUgc29ydCBvcmRlciBvZiB0aGVcbiAgICogc29ydGVkIGBhcnJheWAuIElmIGBjYWxsYmFja2AgaXMgcGFzc2VkLCBpdCB3aWxsIGJlIGV4ZWN1dGVkIGZvciBgdmFsdWVgIGFuZFxuICAgKiBlYWNoIGVsZW1lbnQgaW4gYGFycmF5YCB0byBjb21wdXRlIHRoZWlyIHNvcnQgcmFua2luZy4gVGhlIGBjYWxsYmFja2AgaXNcbiAgICogYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OyAodmFsdWUpLlxuICAgKlxuICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcGFzc2VkIGZvciBgY2FsbGJhY2tgLCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIElmIGFuIG9iamVjdCBpcyBwYXNzZWQgZm9yIGBjYWxsYmFja2AsIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICogZWxzZSBgZmFsc2VgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIGV2YWx1YXRlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxTdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXJcbiAgICogIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwYXNzZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGVcbiAgICogIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICogQHBhcmFtIHtNaXhlZH0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgdmFsdWUgc2hvdWxkIGJlIGluc2VydGVkXG4gICAqICBpbnRvIGBhcnJheWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uc29ydGVkSW5kZXgoWzIwLCAzMCwgNTBdLCA0MCk7XG4gICAqIC8vID0+IDJcbiAgICpcbiAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAqIF8uc29ydGVkSW5kZXgoW3sgJ3gnOiAyMCB9LCB7ICd4JzogMzAgfSwgeyAneCc6IDUwIH1dLCB7ICd4JzogNDAgfSwgJ3gnKTtcbiAgICogLy8gPT4gMlxuICAgKlxuICAgKiB2YXIgZGljdCA9IHtcbiAgICogICAnd29yZFRvTnVtYmVyJzogeyAndHdlbnR5JzogMjAsICd0aGlydHknOiAzMCwgJ2ZvdXJ0eSc6IDQwLCAnZmlmdHknOiA1MCB9XG4gICAqIH07XG4gICAqXG4gICAqIF8uc29ydGVkSW5kZXgoWyd0d2VudHknLCAndGhpcnR5JywgJ2ZpZnR5J10sICdmb3VydHknLCBmdW5jdGlvbih3b3JkKSB7XG4gICAqICAgcmV0dXJuIGRpY3Qud29yZFRvTnVtYmVyW3dvcmRdO1xuICAgKiB9KTtcbiAgICogLy8gPT4gMlxuICAgKlxuICAgKiBfLnNvcnRlZEluZGV4KFsndHdlbnR5JywgJ3RoaXJ0eScsICdmaWZ0eSddLCAnZm91cnR5JywgZnVuY3Rpb24od29yZCkge1xuICAgKiAgIHJldHVybiB0aGlzLndvcmRUb051bWJlclt3b3JkXTtcbiAgICogfSwgZGljdCk7XG4gICAqIC8vID0+IDJcbiAgICovXG4gIGZ1bmN0aW9uIHNvcnRlZEluZGV4KGFycmF5LCB2YWx1ZSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgbG93ID0gMCxcbiAgICAgICAgaGlnaCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogbG93O1xuXG4gICAgLy8gZXhwbGljaXRseSByZWZlcmVuY2UgYGlkZW50aXR5YCBmb3IgYmV0dGVyIGlubGluaW5nIGluIEZpcmVmb3hcbiAgICBjYWxsYmFjayA9IGNhbGxiYWNrID8gY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDEpIDogaWRlbnRpdHk7XG4gICAgdmFsdWUgPSBjYWxsYmFjayh2YWx1ZSk7XG5cbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+Pj4gMTtcbiAgICAgIGNhbGxiYWNrKGFycmF5W21pZF0pIDwgdmFsdWVcbiAgICAgICAgPyBsb3cgPSBtaWQgKyAxXG4gICAgICAgIDogaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgdW5pb24gb2YgdGhlIHBhc3NlZC1pbiBhcnJheXMgdXNpbmcgc3RyaWN0IGVxdWFsaXR5IGZvclxuICAgKiBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAqIEBwYXJhbSB7QXJyYXl9IFthcnJheTEsIGFycmF5MiwgLi4uXSBBcnJheXMgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMsIGluIG9yZGVyLCB0aGF0IGFyZVxuICAgKiAgcHJlc2VudCBpbiBvbmUgb3IgbW9yZSBvZiB0aGUgYXJyYXlzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnVuaW9uKFsxLCAyLCAzXSwgWzEwMSwgMiwgMSwgMTBdLCBbMiwgMV0pO1xuICAgKiAvLyA9PiBbMSwgMiwgMywgMTAxLCAxMF1cbiAgICovXG4gIGZ1bmN0aW9uIHVuaW9uKCkge1xuICAgIHJldHVybiB1bmlxKGNvbmNhdC5hcHBseShhcnJheVJlZiwgYXJndW1lbnRzKSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGR1cGxpY2F0ZS12YWx1ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGBhcnJheWAgdXNpbmcgc3RyaWN0IGVxdWFsaXR5XG4gICAqIGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC4gSWYgdGhlIGBhcnJheWAgaXMgYWxyZWFkeSBzb3J0ZWQsIHBhc3NpbmcgYHRydWVgXG4gICAqIGZvciBgaXNTb3J0ZWRgIHdpbGwgcnVuIGEgZmFzdGVyIGFsZ29yaXRobS4gSWYgYGNhbGxiYWNrYCBpcyBwYXNzZWQsIGVhY2hcbiAgICogZWxlbWVudCBvZiBgYXJyYXlgIGlzIHBhc3NlZCB0aHJvdWdoIGEgY2FsbGJhY2tgIGJlZm9yZSB1bmlxdWVuZXNzIGlzIGNvbXB1dGVkLlxuICAgKiBUaGUgYGNhbGxiYWNrYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXgsIGFycmF5KS5cbiAgICpcbiAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHBhc3NlZCBmb3IgYGNhbGxiYWNrYCwgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBJZiBhbiBvYmplY3QgaXMgcGFzc2VkIGZvciBgY2FsbGJhY2tgLCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGV0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAqIGVsc2UgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAYWxpYXMgdW5pcXVlXG4gICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHByb2Nlc3MuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2lzU29ydGVkPWZhbHNlXSBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCB0aGUgYGFycmF5YCBpcyBhbHJlYWR5IHNvcnRlZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8U3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyXG4gICAqICBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcGFzc2VkLCBpdCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlXG4gICAqICBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgZHVwbGljYXRlLXZhbHVlLWZyZWUgYXJyYXkuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8udW5pcShbMSwgMiwgMSwgMywgMV0pO1xuICAgKiAvLyA9PiBbMSwgMiwgM11cbiAgICpcbiAgICogXy51bmlxKFsxLCAxLCAyLCAyLCAzXSwgdHJ1ZSk7XG4gICAqIC8vID0+IFsxLCAyLCAzXVxuICAgKlxuICAgKiBfLnVuaXEoWzEsIDIsIDEuNSwgMywgMi41XSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiBNYXRoLmZsb29yKG51bSk7IH0pO1xuICAgKiAvLyA9PiBbMSwgMiwgM11cbiAgICpcbiAgICogXy51bmlxKFsxLCAyLCAxLjUsIDMsIDIuNV0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gdGhpcy5mbG9vcihudW0pOyB9LCBNYXRoKTtcbiAgICogLy8gPT4gWzEsIDIsIDNdXG4gICAqXG4gICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgKiBfLnVuaXEoW3sgJ3gnOiAxIH0sIHsgJ3gnOiAyIH0sIHsgJ3gnOiAxIH1dLCAneCcpO1xuICAgKiAvLyA9PiBbeyAneCc6IDEgfSwgeyAneCc6IDIgfV1cbiAgICovXG4gIGZ1bmN0aW9uIHVuaXEoYXJyYXksIGlzU29ydGVkLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBzZWVuID0gcmVzdWx0O1xuXG4gICAgLy8ganVnZ2xlIGFyZ3VtZW50c1xuICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpc0FyZyA9IGNhbGxiYWNrO1xuICAgICAgY2FsbGJhY2sgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIGluaXQgdmFsdWUgY2FjaGUgZm9yIGxhcmdlIGFycmF5c1xuICAgIHZhciBpc0xhcmdlID0gIWlzU29ydGVkICYmIGxlbmd0aCA+PSA3NTtcbiAgICBpZiAoaXNMYXJnZSkge1xuICAgICAgdmFyIGNhY2hlID0ge307XG4gICAgfVxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgc2VlbiA9IFtdO1xuICAgICAgY2FsbGJhY2sgPSBjcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgICAgY29tcHV0ZWQgPSBjYWxsYmFjayA/IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgYXJyYXkpIDogdmFsdWU7XG5cbiAgICAgIGlmIChpc0xhcmdlKSB7XG4gICAgICAgIHZhciBrZXkgPSBjb21wdXRlZCArICcnO1xuICAgICAgICB2YXIgaW5pdGVkID0gaGFzT3duUHJvcGVydHkuY2FsbChjYWNoZSwga2V5KVxuICAgICAgICAgID8gIShzZWVuID0gY2FjaGVba2V5XSlcbiAgICAgICAgICA6IChzZWVuID0gY2FjaGVba2V5XSA9IFtdKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1NvcnRlZFxuICAgICAgICAgICAgPyAhaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSBjb21wdXRlZFxuICAgICAgICAgICAgOiBpbml0ZWQgfHwgaW5kZXhPZihzZWVuLCBjb21wdXRlZCkgPCAwXG4gICAgICAgICAgKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayB8fCBpc0xhcmdlKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhcnJheSB3aXRoIGFsbCBvY2N1cnJlbmNlcyBvZiB0aGUgcGFzc2VkIHZhbHVlcyByZW1vdmVkIHVzaW5nXG4gICAqIHN0cmljdCBlcXVhbGl0eSBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmlsdGVyLlxuICAgKiBAcGFyYW0ge01peGVkfSBbdmFsdWUxLCB2YWx1ZTIsIC4uLl0gVmFsdWVzIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGZpbHRlcmVkIGFycmF5LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLndpdGhvdXQoWzEsIDIsIDEsIDAsIDMsIDEsIDRdLCAwLCAxKTtcbiAgICogLy8gPT4gWzIsIDMsIDRdXG4gICAqL1xuICBmdW5jdGlvbiB3aXRob3V0KGFycmF5KSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgY29udGFpbnMgPSBjYWNoZWRDb250YWlucyhhcmd1bWVudHMsIDEpLFxuICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgICBpZiAoIWNvbnRhaW5zKHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogR3JvdXBzIHRoZSBlbGVtZW50cyBvZiBlYWNoIGFycmF5IGF0IHRoZWlyIGNvcnJlc3BvbmRpbmcgaW5kZXhlcy4gVXNlZnVsIGZvclxuICAgKiBzZXBhcmF0ZSBkYXRhIHNvdXJjZXMgdGhhdCBhcmUgY29vcmRpbmF0ZWQgdGhyb3VnaCBtYXRjaGluZyBhcnJheSBpbmRleGVzLlxuICAgKiBGb3IgYSBtYXRyaXggb2YgbmVzdGVkIGFycmF5cywgYF8uemlwLmFwcGx5KC4uLilgIGNhbiB0cmFuc3Bvc2UgdGhlIG1hdHJpeFxuICAgKiBpbiBhIHNpbWlsYXIgZmFzaGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAqIEBwYXJhbSB7QXJyYXl9IFthcnJheTEsIGFycmF5MiwgLi4uXSBBcnJheXMgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGdyb3VwZWQgZWxlbWVudHMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uemlwKFsnbW9lJywgJ2xhcnJ5J10sIFszMCwgNDBdLCBbdHJ1ZSwgZmFsc2VdKTtcbiAgICogLy8gPT4gW1snbW9lJywgMzAsIHRydWVdLCBbJ2xhcnJ5JywgNDAsIGZhbHNlXV1cbiAgICovXG4gIGZ1bmN0aW9uIHppcChhcnJheSkge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhcnJheSA/IG1heChwbHVjayhhcmd1bWVudHMsICdsZW5ndGgnKSkgOiAwLFxuICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBwbHVjayhhcmd1bWVudHMsIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGV4ZWN1dGluZyBgZnVuY2Agb25seSBhZnRlciBpdCBpc1xuICAgKiBjYWxsZWQgYG5gIHRpbWVzLiBUaGUgYGZ1bmNgIGlzIGV4ZWN1dGVkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZVxuICAgKiBjcmVhdGVkIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0aGUgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYmVmb3JlXG4gICAqIGl0IGlzIGV4ZWN1dGVkLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcmVzdHJpY3RlZCBmdW5jdGlvbi5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIHJlbmRlck5vdGVzID0gXy5hZnRlcihub3Rlcy5sZW5ndGgsIHJlbmRlcik7XG4gICAqIF8uZm9yRWFjaChub3RlcywgZnVuY3Rpb24obm90ZSkge1xuICAgKiAgIG5vdGUuYXN5bmNTYXZlKHsgJ3N1Y2Nlc3MnOiByZW5kZXJOb3RlcyB9KTtcbiAgICogfSk7XG4gICAqIC8vIGByZW5kZXJOb3Rlc2AgaXMgcnVuIG9uY2UsIGFmdGVyIGFsbCBub3RlcyBoYXZlIHNhdmVkXG4gICAqL1xuICBmdW5jdGlvbiBhZnRlcihuLCBmdW5jKSB7XG4gICAgaWYgKG4gPCAxKSB7XG4gICAgICByZXR1cm4gZnVuYygpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS1uIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2BcbiAgICogYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHByZXBlbmRzIGFueSBhZGRpdGlvbmFsIGBiaW5kYCBhcmd1bWVudHMgdG8gdGhvc2VcbiAgICogcGFzc2VkIHRvIHRoZSBib3VuZCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGJpbmQuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICAgKiBAcGFyYW0ge01peGVkfSBbYXJnMSwgYXJnMiwgLi4uXSBBcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJvdW5kIGZ1bmN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgZnVuYyA9IGZ1bmN0aW9uKGdyZWV0aW5nKSB7XG4gICAqICAgcmV0dXJuIGdyZWV0aW5nICsgJyAnICsgdGhpcy5uYW1lO1xuICAgKiB9O1xuICAgKlxuICAgKiBmdW5jID0gXy5iaW5kKGZ1bmMsIHsgJ25hbWUnOiAnbW9lJyB9LCAnaGknKTtcbiAgICogZnVuYygpO1xuICAgKiAvLyA9PiAnaGkgbW9lJ1xuICAgKi9cbiAgZnVuY3Rpb24gYmluZChmdW5jLCB0aGlzQXJnKSB7XG4gICAgLy8gdXNlIGBGdW5jdGlvbiNiaW5kYCBpZiBpdCBleGlzdHMgYW5kIGlzIGZhc3RcbiAgICAvLyAoaW4gVjggYEZ1bmN0aW9uI2JpbmRgIGlzIHNsb3dlciBleGNlcHQgd2hlbiBwYXJ0aWFsbHkgYXBwbGllZClcbiAgICByZXR1cm4gaXNCaW5kRmFzdCB8fCAobmF0aXZlQmluZCAmJiBhcmd1bWVudHMubGVuZ3RoID4gMilcbiAgICAgID8gbmF0aXZlQmluZC5jYWxsLmFwcGx5KG5hdGl2ZUJpbmQsIGFyZ3VtZW50cylcbiAgICAgIDogY3JlYXRlQm91bmQoZnVuYywgdGhpc0FyZywgc2xpY2UoYXJndW1lbnRzLCAyKSk7XG4gIH1cblxuICAvKipcbiAgICogQmluZHMgbWV0aG9kcyBvbiBgb2JqZWN0YCB0byBgb2JqZWN0YCwgb3ZlcndyaXRpbmcgdGhlIGV4aXN0aW5nIG1ldGhvZC5cbiAgICogTWV0aG9kIG5hbWVzIG1heSBiZSBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBhcmd1bWVudHMgb3IgYXMgYXJyYXlzIG9mIG1ldGhvZFxuICAgKiBuYW1lcy4gSWYgbm8gbWV0aG9kIG5hbWVzIGFyZSBwcm92aWRlZCwgYWxsIHRoZSBmdW5jdGlvbiBwcm9wZXJ0aWVzIG9mIGBvYmplY3RgXG4gICAqIHdpbGwgYmUgYm91bmQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmluZCBhbmQgYXNzaWduIHRoZSBib3VuZCBtZXRob2RzIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW21ldGhvZE5hbWUxLCBtZXRob2ROYW1lMiwgLi4uXSBNZXRob2QgbmFtZXMgb24gdGhlIG9iamVjdCB0byBiaW5kLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgdmlldyA9IHtcbiAgICogICdsYWJlbCc6ICdkb2NzJyxcbiAgICogICdvbkNsaWNrJzogZnVuY3Rpb24oKSB7IGFsZXJ0KCdjbGlja2VkICcgKyB0aGlzLmxhYmVsKTsgfVxuICAgKiB9O1xuICAgKlxuICAgKiBfLmJpbmRBbGwodmlldyk7XG4gICAqIGpRdWVyeSgnI2RvY3MnKS5vbignY2xpY2snLCB2aWV3Lm9uQ2xpY2spO1xuICAgKiAvLyA9PiBhbGVydHMgJ2NsaWNrZWQgZG9jcycsIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAqL1xuICBmdW5jdGlvbiBiaW5kQWxsKG9iamVjdCkge1xuICAgIHZhciBmdW5jcyA9IGNvbmNhdC5hcHBseShhcnJheVJlZiwgYXJndW1lbnRzKSxcbiAgICAgICAgaW5kZXggPSBmdW5jcy5sZW5ndGggPiAxID8gMCA6IChmdW5jcyA9IGZ1bmN0aW9ucyhvYmplY3QpLCAtMSksXG4gICAgICAgIGxlbmd0aCA9IGZ1bmNzLmxlbmd0aDtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIga2V5ID0gZnVuY3NbaW5kZXhdO1xuICAgICAgb2JqZWN0W2tleV0gPSBiaW5kKG9iamVjdFtrZXldLCBvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCwgaW52b2tlcyB0aGUgbWV0aG9kIGF0IGBvYmplY3Rba2V5XWBcbiAgICogYW5kIHByZXBlbmRzIGFueSBhZGRpdGlvbmFsIGBiaW5kS2V5YCBhcmd1bWVudHMgdG8gdGhvc2UgcGFzc2VkIHRvIHRoZSBib3VuZFxuICAgKiBmdW5jdGlvbi4gVGhpcyBtZXRob2QgZGlmZmVycyBmcm9tIGBfLmJpbmRgIGJ5IGFsbG93aW5nIGJvdW5kIGZ1bmN0aW9ucyB0b1xuICAgKiByZWZlcmVuY2UgbWV0aG9kcyB0aGF0IHdpbGwgYmUgcmVkZWZpbmVkIG9yIGRvbid0IHlldCBleGlzdC5cbiAgICogU2VlIGh0dHA6Ly9taWNoYXV4LmNhL2FydGljbGVzL2xhenktZnVuY3Rpb24tZGVmaW5pdGlvbi1wYXR0ZXJuLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRoZSBtZXRob2QgYmVsb25ncyB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFthcmcxLCBhcmcyLCAuLi5dIEFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYm91bmQgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBvYmplY3QgPSB7XG4gICAqICAgJ25hbWUnOiAnbW9lJyxcbiAgICogICAnZ3JlZXQnOiBmdW5jdGlvbihncmVldGluZykge1xuICAgKiAgICAgcmV0dXJuIGdyZWV0aW5nICsgJyAnICsgdGhpcy5uYW1lO1xuICAgKiAgIH1cbiAgICogfTtcbiAgICpcbiAgICogdmFyIGZ1bmMgPSBfLmJpbmRLZXkob2JqZWN0LCAnZ3JlZXQnLCAnaGknKTtcbiAgICogZnVuYygpO1xuICAgKiAvLyA9PiAnaGkgbW9lJ1xuICAgKlxuICAgKiBvYmplY3QuZ3JlZXQgPSBmdW5jdGlvbihncmVldGluZykge1xuICAgKiAgIHJldHVybiBncmVldGluZyArICcsICcgKyB0aGlzLm5hbWUgKyAnISc7XG4gICAqIH07XG4gICAqXG4gICAqIGZ1bmMoKTtcbiAgICogLy8gPT4gJ2hpLCBtb2UhJ1xuICAgKi9cbiAgZnVuY3Rpb24gYmluZEtleShvYmplY3QsIGtleSkge1xuICAgIHJldHVybiBjcmVhdGVCb3VuZChvYmplY3QsIGtleSwgc2xpY2UoYXJndW1lbnRzLCAyKSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIHRoZSBwYXNzZWQgZnVuY3Rpb25zLFxuICAgKiB3aGVyZSBlYWNoIGZ1bmN0aW9uIGNvbnN1bWVzIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgICogRm9yIGV4YW1wbGUsIGNvbXBvc2luZyB0aGUgZnVuY3Rpb25zIGBmKClgLCBgZygpYCwgYW5kIGBoKClgIHByb2R1Y2VzIGBmKGcoaCgpKSlgLlxuICAgKiBFYWNoIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtmdW5jMSwgZnVuYzIsIC4uLl0gRnVuY3Rpb25zIHRvIGNvbXBvc2UuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbXBvc2VkIGZ1bmN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgZ3JlZXQgPSBmdW5jdGlvbihuYW1lKSB7IHJldHVybiAnaGkgJyArIG5hbWU7IH07XG4gICAqIHZhciBleGNsYWltID0gZnVuY3Rpb24oc3RhdGVtZW50KSB7IHJldHVybiBzdGF0ZW1lbnQgKyAnISc7IH07XG4gICAqIHZhciB3ZWxjb21lID0gXy5jb21wb3NlKGV4Y2xhaW0sIGdyZWV0KTtcbiAgICogd2VsY29tZSgnbW9lJyk7XG4gICAqIC8vID0+ICdoaSBtb2UhJ1xuICAgKi9cbiAgZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgICB2YXIgZnVuY3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgbGVuZ3RoID0gZnVuY3MubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgYXJncyA9IFtmdW5jc1tsZW5ndGhdLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBkZWxheSB0aGUgZXhlY3V0aW9uIG9mIGBmdW5jYCB1bnRpbCBhZnRlclxuICAgKiBgd2FpdGAgbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIGl0IHdhcyBpbnZva2VkLiBQYXNzXG4gICAqIGB0cnVlYCBmb3IgYGltbWVkaWF0ZWAgdG8gY2F1c2UgZGVib3VuY2UgdG8gaW52b2tlIGBmdW5jYCBvbiB0aGUgbGVhZGluZyxcbiAgICogaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcsIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBTdWJzZXF1ZW50IGNhbGxzIHRvXG4gICAqIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgY2FsbC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBpbW1lZGlhdGUgQSBmbGFnIHRvIGluZGljYXRlIGV4ZWN1dGlvbiBpcyBvbiB0aGUgbGVhZGluZ1xuICAgKiAgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgbGF6eUxheW91dCA9IF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAzMDApO1xuICAgKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgbGF6eUxheW91dCk7XG4gICAqL1xuICBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgYXJncyxcbiAgICAgICAgcmVzdWx0LFxuICAgICAgICB0aGlzQXJnLFxuICAgICAgICB0aW1lb3V0SWQ7XG5cbiAgICBmdW5jdGlvbiBkZWxheWVkKCkge1xuICAgICAgdGltZW91dElkID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpc0ltbWVkaWF0ZSA9IGltbWVkaWF0ZSAmJiAhdGltZW91dElkO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHRoaXNBcmcgPSB0aGlzO1xuXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgd2FpdCk7XG5cbiAgICAgIGlmIChpc0ltbWVkaWF0ZSkge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHRoZSBgZnVuY2AgZnVuY3Rpb24gYWZ0ZXIgYHdhaXRgIG1pbGxpc2Vjb25kcy4gQWRkaXRpb25hbCBhcmd1bWVudHNcbiAgICogd2lsbCBiZSBwYXNzZWQgdG8gYGZ1bmNgIHdoZW4gaXQgaXMgaW52b2tlZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlbGF5LlxuICAgKiBAcGFyYW0ge051bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSBleGVjdXRpb24uXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFthcmcxLCBhcmcyLCAuLi5dIEFyZ3VtZW50cyB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGguXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IFJldHVybnMgdGhlIGBzZXRUaW1lb3V0YCB0aW1lb3V0IGlkLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgbG9nID0gXy5iaW5kKGNvbnNvbGUubG9nLCBjb25zb2xlKTtcbiAgICogXy5kZWxheShsb2csIDEwMDAsICdsb2dnZWQgbGF0ZXInKTtcbiAgICogLy8gPT4gJ2xvZ2dlZCBsYXRlcicgKEFwcGVhcnMgYWZ0ZXIgb25lIHNlY29uZC4pXG4gICAqL1xuICBmdW5jdGlvbiBkZWxheShmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZShhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7IH0sIHdhaXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmVycyBleGVjdXRpbmcgdGhlIGBmdW5jYCBmdW5jdGlvbiB1bnRpbCB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhcyBjbGVhcmVkLlxuICAgKiBBZGRpdGlvbmFsIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCB0byBgZnVuY2Agd2hlbiBpdCBpcyBpbnZva2VkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVmZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFthcmcxLCBhcmcyLCAuLi5dIEFyZ3VtZW50cyB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGguXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IFJldHVybnMgdGhlIGBzZXRUaW1lb3V0YCB0aW1lb3V0IGlkLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmRlZmVyKGZ1bmN0aW9uKCkgeyBhbGVydCgnZGVmZXJyZWQnKTsgfSk7XG4gICAqIC8vIHJldHVybnMgZnJvbSB0aGUgZnVuY3Rpb24gYmVmb3JlIGBhbGVydGAgaXMgY2FsbGVkXG4gICAqL1xuICBmdW5jdGlvbiBkZWZlcihmdW5jKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZShhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7IH0sIDEpO1xuICB9XG4gIC8vIHVzZSBgc2V0SW1tZWRpYXRlYCBpZiBpdCdzIGF2YWlsYWJsZSBpbiBOb2RlLmpzXG4gIGlmIChpc1Y4ICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIHNldEltbWVkaWF0ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgZGVmZXIgPSBiaW5kKHNldEltbWVkaWF0ZSwgd2luZG93KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICAgKiBwYXNzZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBkZXRlcm1pbmUgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0XG4gICAqIGJhc2VkIG9uIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0XG4gICAqIGFyZ3VtZW50IHBhc3NlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gICAqIGlzIGV4ZWN1dGVkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBBIGZ1bmN0aW9uIHVzZWQgdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXppbmcgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBmaWJvbmFjY2kgPSBfLm1lbW9pemUoZnVuY3Rpb24obikge1xuICAgKiAgIHJldHVybiBuIDwgMiA/IG4gOiBmaWJvbmFjY2kobiAtIDEpICsgZmlib25hY2NpKG4gLSAyKTtcbiAgICogfSk7XG4gICAqL1xuICBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gICAgdmFyIGNhY2hlID0ge307XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSA9IChyZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBhcmd1bWVudHNbMF0pICsgJyc7XG4gICAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChjYWNoZSwga2V5KVxuICAgICAgICA/IGNhY2hlW2tleV1cbiAgICAgICAgOiAoY2FjaGVba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGV4ZWN1dGUgYGZ1bmNgIG9uY2UuIFJlcGVhdCBjYWxscyB0b1xuICAgKiB0aGUgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBjYWxsLiBUaGUgYGZ1bmNgIGlzIGV4ZWN1dGVkXG4gICAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJlc3RyaWN0ZWQgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBpbml0aWFsaXplID0gXy5vbmNlKGNyZWF0ZUFwcGxpY2F0aW9uKTtcbiAgICogaW5pdGlhbGl6ZSgpO1xuICAgKiBpbml0aWFsaXplKCk7XG4gICAqIC8vIGBpbml0aWFsaXplYCBleGVjdXRlcyBgY3JlYXRlQXBwbGljYXRpb25gIG9uY2VcbiAgICovXG4gIGZ1bmN0aW9uIG9uY2UoZnVuYykge1xuICAgIHZhciByYW4sXG4gICAgICAgIHJlc3VsdDtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyYW4pIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJhbiA9IHRydWU7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgIC8vIGNsZWFyIHRoZSBgZnVuY2AgdmFyaWFibGUgc28gdGhlIGZ1bmN0aW9uIG1heSBiZSBnYXJiYWdlIGNvbGxlY3RlZFxuICAgICAgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCBpbnZva2VzIGBmdW5jYCB3aXRoIGFueSBhZGRpdGlvbmFsXG4gICAqIGBwYXJ0aWFsYCBhcmd1bWVudHMgcHJlcGVuZGVkIHRvIHRob3NlIHBhc3NlZCB0byB0aGUgbmV3IGZ1bmN0aW9uLiBUaGlzXG4gICAqIG1ldGhvZCBpcyBzaW1pbGFyIHRvIGBfLmJpbmRgLCBleGNlcHQgaXQgZG9lcyAqKm5vdCoqIGFsdGVyIHRoZSBgdGhpc2AgYmluZGluZy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHBhcnRpYWxseSBhcHBseSBhcmd1bWVudHMgdG8uXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFthcmcxLCBhcmcyLCAuLi5dIEFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcGFydGlhbGx5IGFwcGxpZWQgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBncmVldCA9IGZ1bmN0aW9uKGdyZWV0aW5nLCBuYW1lKSB7IHJldHVybiBncmVldGluZyArICcgJyArIG5hbWU7IH07XG4gICAqIHZhciBoaSA9IF8ucGFydGlhbChncmVldCwgJ2hpJyk7XG4gICAqIGhpKCdtb2UnKTtcbiAgICogLy8gPT4gJ2hpIG1vZSdcbiAgICovXG4gIGZ1bmN0aW9uIHBhcnRpYWwoZnVuYykge1xuICAgIHJldHVybiBjcmVhdGVCb3VuZChmdW5jLCBzbGljZShhcmd1bWVudHMsIDEpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBzaW1pbGFyIHRvIGBfLnBhcnRpYWxgLCBleGNlcHQgdGhhdCBgcGFydGlhbGAgYXJndW1lbnRzIGFyZVxuICAgKiBhcHBlbmRlZCB0byB0aG9zZSBwYXNzZWQgdG8gdGhlIG5ldyBmdW5jdGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHBhcnRpYWxseSBhcHBseSBhcmd1bWVudHMgdG8uXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFthcmcxLCBhcmcyLCAuLi5dIEFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcGFydGlhbGx5IGFwcGxpZWQgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBkZWZhdWx0c0RlZXAgPSBfLnBhcnRpYWxSaWdodChfLm1lcmdlLCBfLmRlZmF1bHRzKTtcbiAgICpcbiAgICogdmFyIG9wdGlvbnMgPSB7XG4gICAqICAgJ3ZhcmlhYmxlJzogJ2RhdGEnLFxuICAgKiAgICdpbXBvcnRzJzogeyAnanEnOiAkIH1cbiAgICogfTtcbiAgICpcbiAgICogZGVmYXVsdHNEZWVwKG9wdGlvbnMsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG4gICAqXG4gICAqIG9wdGlvbnMudmFyaWFibGVcbiAgICogLy8gPT4gJ2RhdGEnXG4gICAqXG4gICAqIG9wdGlvbnMuaW1wb3J0c1xuICAgKiAvLyA9PiB7ICdfJzogXywgJ2pxJzogJCB9XG4gICAqL1xuICBmdW5jdGlvbiBwYXJ0aWFsUmlnaHQoZnVuYykge1xuICAgIHJldHVybiBjcmVhdGVCb3VuZChmdW5jLCBzbGljZShhcmd1bWVudHMsIDEpLCBudWxsLCBpbmRpY2F0b3JPYmplY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGV4ZWN1dGVkLCB3aWxsIG9ubHkgY2FsbCB0aGUgYGZ1bmNgXG4gICAqIGZ1bmN0aW9uIGF0IG1vc3Qgb25jZSBwZXIgZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gSWYgdGhlIHRocm90dGxlZFxuICAgKiBmdW5jdGlvbiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQsIGBmdW5jYCB3aWxsXG4gICAqIGFsc28gYmUgY2FsbGVkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZVxuICAgKiB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgY2FsbC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB0aHJvdHRsZSBleGVjdXRpb25zIHRvLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApO1xuICAgKiBqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJywgdGhyb3R0bGVkKTtcbiAgICovXG4gIGZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyxcbiAgICAgICAgcmVzdWx0LFxuICAgICAgICB0aGlzQXJnLFxuICAgICAgICB0aW1lb3V0SWQsXG4gICAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXG4gICAgZnVuY3Rpb24gdHJhaWxpbmdDYWxsKCkge1xuICAgICAgbGFzdENhbGxlZCA9IG5ldyBEYXRlO1xuICAgICAgdGltZW91dElkID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSxcbiAgICAgICAgICByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIGxhc3RDYWxsZWQpO1xuXG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGhpc0FyZyA9IHRoaXM7XG5cbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgdGltZW91dElkID0gbnVsbDtcbiAgICAgICAgbGFzdENhbGxlZCA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCF0aW1lb3V0SWQpIHtcbiAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCh0cmFpbGluZ0NhbGwsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcGFzc2VzIGB2YWx1ZWAgdG8gdGhlIGB3cmFwcGVyYCBmdW5jdGlvbiBhcyBpdHNcbiAgICogZmlyc3QgYXJndW1lbnQuIEFkZGl0aW9uYWwgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgZnVuY3Rpb24gYXJlIGFwcGVuZGVkXG4gICAqIHRvIHRob3NlIHBhc3NlZCB0byB0aGUgYHdyYXBwZXJgIGZ1bmN0aW9uLiBUaGUgYHdyYXBwZXJgIGlzIGV4ZWN1dGVkIHdpdGhcbiAgICogdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHdyYXBwZXIgVGhlIHdyYXBwZXIgZnVuY3Rpb24uXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgaGVsbG8gPSBmdW5jdGlvbihuYW1lKSB7IHJldHVybiAnaGVsbG8gJyArIG5hbWU7IH07XG4gICAqIGhlbGxvID0gXy53cmFwKGhlbGxvLCBmdW5jdGlvbihmdW5jKSB7XG4gICAqICAgcmV0dXJuICdiZWZvcmUsICcgKyBmdW5jKCdtb2UnKSArICcsIGFmdGVyJztcbiAgICogfSk7XG4gICAqIGhlbGxvKCk7XG4gICAqIC8vID0+ICdiZWZvcmUsIGhlbGxvIG1vZSwgYWZ0ZXInXG4gICAqL1xuICBmdW5jdGlvbiB3cmFwKHZhbHVlLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbdmFsdWVdO1xuICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHdyYXBwZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgY2hhcmFjdGVycyBgJmAsIGA8YCwgYD5gLCBgXCJgLCBhbmQgYCdgIGluIGBzdHJpbmdgIHRvIHRoZWlyXG4gICAqIGNvcnJlc3BvbmRpbmcgSFRNTCBlbnRpdGllcy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJldHVybnMgdGhlIGVzY2FwZWQgc3RyaW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmVzY2FwZSgnTW9lLCBMYXJyeSAmIEN1cmx5Jyk7XG4gICAqIC8vID0+ICdNb2UsIExhcnJ5ICZhbXA7IEN1cmx5J1xuICAgKi9cbiAgZnVuY3Rpb24gZXNjYXBlKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcgPT0gbnVsbCA/ICcnIDogKHN0cmluZyArICcnKS5yZXBsYWNlKHJlVW5lc2NhcGVkSHRtbCwgZXNjYXBlSHRtbENoYXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIHRvIGl0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgQW55IHZhbHVlLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IFJldHVybnMgYHZhbHVlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG1vZSA9IHsgJ25hbWUnOiAnbW9lJyB9O1xuICAgKiBtb2UgPT09IF8uaWRlbnRpdHkobW9lKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKi9cbiAgZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBmdW5jdGlvbnMgcHJvcGVydGllcyBvZiBgb2JqZWN0YCB0byB0aGUgYGxvZGFzaGAgZnVuY3Rpb24gYW5kIGNoYWluYWJsZVxuICAgKiB3cmFwcGVyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IG9mIGZ1bmN0aW9uIHByb3BlcnRpZXMgdG8gYWRkIHRvIGBsb2Rhc2hgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLm1peGluKHtcbiAgICogICAnY2FwaXRhbGl6ZSc6IGZ1bmN0aW9uKHN0cmluZykge1xuICAgKiAgICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICAgKiAgIH1cbiAgICogfSk7XG4gICAqXG4gICAqIF8uY2FwaXRhbGl6ZSgnbW9lJyk7XG4gICAqIC8vID0+ICdNb2UnXG4gICAqXG4gICAqIF8oJ21vZScpLmNhcGl0YWxpemUoKTtcbiAgICogLy8gPT4gJ01vZSdcbiAgICovXG4gIGZ1bmN0aW9uIG1peGluKG9iamVjdCkge1xuICAgIGZvckVhY2goZnVuY3Rpb25zKG9iamVjdCksIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gbG9kYXNoW21ldGhvZE5hbWVdID0gb2JqZWN0W21ldGhvZE5hbWVdO1xuXG4gICAgICBsb2Rhc2gucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX193cmFwcGVkX19dO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBuZXcgbG9kYXNoKGZ1bmMuYXBwbHkobG9kYXNoLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmVydHMgdGhlICdfJyB2YXJpYWJsZSB0byBpdHMgcHJldmlvdXMgdmFsdWUgYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG9cbiAgICogdGhlIGBsb2Rhc2hgIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIGxvZGFzaCA9IF8ubm9Db25mbGljdCgpO1xuICAgKi9cbiAgZnVuY3Rpb24gbm9Db25mbGljdCgpIHtcbiAgICB3aW5kb3cuXyA9IG9sZERhc2g7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZXMgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gYG1pbmAgYW5kIGBtYXhgIChpbmNsdXNpdmUpLiBJZiBvbmx5IG9uZVxuICAgKiBhcmd1bWVudCBpcyBwYXNzZWQsIGEgbnVtYmVyIGJldHdlZW4gYDBgIGFuZCB0aGUgZ2l2ZW4gbnVtYmVyIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgKiBAcGFyYW0ge051bWJlcn0gW21pbj0wXSBUaGUgbWluaW11bSBwb3NzaWJsZSB2YWx1ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFttYXg9MV0gVGhlIG1heGltdW0gcG9zc2libGUgdmFsdWUuXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IFJldHVybnMgYSByYW5kb20gbnVtYmVyLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnJhbmRvbSgwLCA1KTtcbiAgICogLy8gPT4gYSBudW1iZXIgYmV0d2VlbiAwIGFuZCA1XG4gICAqXG4gICAqIF8ucmFuZG9tKDUpO1xuICAgKiAvLyA9PiBhbHNvIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgNVxuICAgKi9cbiAgZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1pbiA9PSBudWxsICYmIG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSAxO1xuICAgIH1cbiAgICBtaW4gPSArbWluIHx8IDA7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgZmxvb3IobmF0aXZlUmFuZG9tKCkgKiAoKCttYXggfHwgMCkgLSBtaW4gKyAxKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXMgdGhlIHZhbHVlIG9mIGBwcm9wZXJ0eWAgb24gYG9iamVjdGAuIElmIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbixcbiAgICogaXQgd2lsbCBiZSBpbnZva2VkIGFuZCBpdHMgcmVzdWx0IHJldHVybmVkLCBlbHNlIHRoZSBwcm9wZXJ0eSB2YWx1ZSBpc1xuICAgKiByZXR1cm5lZC4gSWYgYG9iamVjdGAgaXMgZmFsc2V5LCB0aGVuIGBudWxsYCBpcyByZXR1cm5lZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGdldCB0aGUgdmFsdWUgb2YuXG4gICAqIEByZXR1cm5zIHtNaXhlZH0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBvYmplY3QgPSB7XG4gICAqICAgJ2NoZWVzZSc6ICdjcnVtcGV0cycsXG4gICAqICAgJ3N0dWZmJzogZnVuY3Rpb24oKSB7XG4gICAqICAgICByZXR1cm4gJ25vbnNlbnNlJztcbiAgICogICB9XG4gICAqIH07XG4gICAqXG4gICAqIF8ucmVzdWx0KG9iamVjdCwgJ2NoZWVzZScpO1xuICAgKiAvLyA9PiAnY3J1bXBldHMnXG4gICAqXG4gICAqIF8ucmVzdWx0KG9iamVjdCwgJ3N0dWZmJyk7XG4gICAqIC8vID0+ICdub25zZW5zZSdcbiAgICovXG4gIGZ1bmN0aW9uIHJlc3VsdChvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0ID8gb2JqZWN0W3Byb3BlcnR5XSA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gaXNGdW5jdGlvbih2YWx1ZSkgPyBvYmplY3RbcHJvcGVydHldKCkgOiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1pY3JvLXRlbXBsYXRpbmcgbWV0aG9kIHRoYXQgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzXG4gICAqIHdoaXRlc3BhY2UsIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICAgKlxuICAgKiBOb3RlOiBJbiB0aGUgZGV2ZWxvcG1lbnQgYnVpbGQsIGBfLnRlbXBsYXRlYCB1dGlsaXplcyBzb3VyY2VVUkxzIGZvciBlYXNpZXJcbiAgICogZGVidWdnaW5nLiBTZWUgaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi90dXRvcmlhbHMvZGV2ZWxvcGVydG9vbHMvc291cmNlbWFwcy8jdG9jLXNvdXJjZXVybFxuICAgKlxuICAgKiBOb3RlOiBMby1EYXNoIG1heSBiZSB1c2VkIGluIENocm9tZSBleHRlbnNpb25zIGJ5IGVpdGhlciBjcmVhdGluZyBhIGBsb2Rhc2ggY3NwYFxuICAgKiBidWlsZCBhbmQgdXNpbmcgcHJlY29tcGlsZWQgdGVtcGxhdGVzLCBvciBsb2FkaW5nIExvLURhc2ggaW4gYSBzYW5kYm94LlxuICAgKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBwcmVjb21waWxpbmcgdGVtcGxhdGVzIHNlZTpcbiAgICogaHR0cDovL2xvZGFzaC5jb20vI2N1c3RvbS1idWlsZHNcbiAgICpcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gQ2hyb21lIGV4dGVuc2lvbiBzYW5kYm94ZXMgc2VlOlxuICAgKiBodHRwOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vc3RhYmxlL2V4dGVuc2lvbnMvc2FuZGJveGluZ0V2YWwuaHRtbFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRlbXBsYXRlIHRleHQuXG4gICAqIEBwYXJhbSB7T2JlY3R9IGRhdGEgVGhlIGRhdGEgb2JqZWN0IHVzZWQgdG8gcG9wdWxhdGUgdGhlIHRleHQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zIG9iamVjdC5cbiAgICogIGVzY2FwZSAtIFRoZSBcImVzY2FwZVwiIGRlbGltaXRlciByZWdleHAuXG4gICAqICBldmFsdWF0ZSAtIFRoZSBcImV2YWx1YXRlXCIgZGVsaW1pdGVyIHJlZ2V4cC5cbiAgICogIGludGVycG9sYXRlIC0gVGhlIFwiaW50ZXJwb2xhdGVcIiBkZWxpbWl0ZXIgcmVnZXhwLlxuICAgKiAgc291cmNlVVJMIC0gVGhlIHNvdXJjZVVSTCBvZiB0aGUgdGVtcGxhdGUncyBjb21waWxlZCBzb3VyY2UuXG4gICAqICB2YXJpYWJsZSAtIFRoZSBkYXRhIG9iamVjdCB2YXJpYWJsZSBuYW1lLlxuICAgKlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb258U3RyaW5nfSBSZXR1cm5zIGEgY29tcGlsZWQgZnVuY3Rpb24gd2hlbiBubyBgZGF0YWAgb2JqZWN0XG4gICAqICBpcyBnaXZlbiwgZWxzZSBpdCByZXR1cm5zIHRoZSBpbnRlcnBvbGF0ZWQgdGV4dC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogLy8gdXNpbmcgYSBjb21waWxlZCB0ZW1wbGF0ZVxuICAgKiB2YXIgY29tcGlsZWQgPSBfLnRlbXBsYXRlKCdoZWxsbyA8JT0gbmFtZSAlPicpO1xuICAgKiBjb21waWxlZCh7ICduYW1lJzogJ21vZScgfSk7XG4gICAqIC8vID0+ICdoZWxsbyBtb2UnXG4gICAqXG4gICAqIHZhciBsaXN0ID0gJzwlIF8uZm9yRWFjaChwZW9wbGUsIGZ1bmN0aW9uKG5hbWUpIHsgJT48bGk+PCU9IG5hbWUgJT48L2xpPjwlIH0pOyAlPic7XG4gICAqIF8udGVtcGxhdGUobGlzdCwgeyAncGVvcGxlJzogWydtb2UnLCAnbGFycnknXSB9KTtcbiAgICogLy8gPT4gJzxsaT5tb2U8L2xpPjxsaT5sYXJyeTwvbGk+J1xuICAgKlxuICAgKiAvLyB1c2luZyB0aGUgXCJlc2NhcGVcIiBkZWxpbWl0ZXIgdG8gZXNjYXBlIEhUTUwgaW4gZGF0YSBwcm9wZXJ0eSB2YWx1ZXNcbiAgICogXy50ZW1wbGF0ZSgnPGI+PCUtIHZhbHVlICU+PC9iPicsIHsgJ3ZhbHVlJzogJzxzY3JpcHQ+JyB9KTtcbiAgICogLy8gPT4gJzxiPiZsdDtzY3JpcHQmZ3Q7PC9iPidcbiAgICpcbiAgICogLy8gdXNpbmcgdGhlIEVTNiBkZWxpbWl0ZXIgYXMgYW4gYWx0ZXJuYXRpdmUgdG8gdGhlIGRlZmF1bHQgXCJpbnRlcnBvbGF0ZVwiIGRlbGltaXRlclxuICAgKiBfLnRlbXBsYXRlKCdoZWxsbyAkeyBuYW1lIH0nLCB7ICduYW1lJzogJ2N1cmx5JyB9KTtcbiAgICogLy8gPT4gJ2hlbGxvIGN1cmx5J1xuICAgKlxuICAgKiAvLyB1c2luZyB0aGUgaW50ZXJuYWwgYHByaW50YCBmdW5jdGlvbiBpbiBcImV2YWx1YXRlXCIgZGVsaW1pdGVyc1xuICAgKiBfLnRlbXBsYXRlKCc8JSBwcmludChcImhlbGxvIFwiICsgZXBpdGhldCk7ICU+IScsIHsgJ2VwaXRoZXQnOiAnc3Rvb2dlJyB9KTtcbiAgICogLy8gPT4gJ2hlbGxvIHN0b29nZSEnXG4gICAqXG4gICAqIC8vIHVzaW5nIGN1c3RvbSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzXG4gICAqIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICogICAnaW50ZXJwb2xhdGUnOiAve3soW1xcc1xcU10rPyl9fS9nXG4gICAqIH07XG4gICAqXG4gICAqIF8udGVtcGxhdGUoJ2hlbGxvIHt7IG5hbWUgfX0hJywgeyAnbmFtZSc6ICdtdXN0YWNoZScgfSk7XG4gICAqIC8vID0+ICdoZWxsbyBtdXN0YWNoZSEnXG4gICAqXG4gICAqIC8vIHVzaW5nIHRoZSBgc291cmNlVVJMYCBvcHRpb24gdG8gc3BlY2lmeSBhIGN1c3RvbSBzb3VyY2VVUkwgZm9yIHRoZSB0ZW1wbGF0ZVxuICAgKiB2YXIgY29tcGlsZWQgPSBfLnRlbXBsYXRlKCdoZWxsbyA8JT0gbmFtZSAlPicsIG51bGwsIHsgJ3NvdXJjZVVSTCc6ICcvYmFzaWMvZ3JlZXRpbmcuanN0JyB9KTtcbiAgICogY29tcGlsZWQoZGF0YSk7XG4gICAqIC8vID0+IGZpbmQgdGhlIHNvdXJjZSBvZiBcImdyZWV0aW5nLmpzdFwiIHVuZGVyIHRoZSBTb3VyY2VzIHRhYiBvciBSZXNvdXJjZXMgcGFuZWwgb2YgdGhlIHdlYiBpbnNwZWN0b3JcbiAgICpcbiAgICogLy8gdXNpbmcgdGhlIGB2YXJpYWJsZWAgb3B0aW9uIHRvIGVuc3VyZSBhIHdpdGgtc3RhdGVtZW50IGlzbid0IHVzZWQgaW4gdGhlIGNvbXBpbGVkIHRlbXBsYXRlXG4gICAqIHZhciBjb21waWxlZCA9IF8udGVtcGxhdGUoJ2hpIDwlPSBkYXRhLm5hbWUgJT4hJywgbnVsbCwgeyAndmFyaWFibGUnOiAnZGF0YScgfSk7XG4gICAqIGNvbXBpbGVkLnNvdXJjZTtcbiAgICogLy8gPT4gZnVuY3Rpb24oZGF0YSkge1xuICAgKiAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbiAgICogICBfX3AgKz0gJ2hpICcgKyAoKF9fdCA9ICggZGF0YS5uYW1lICkpID09IG51bGwgPyAnJyA6IF9fdCkgKyAnISc7XG4gICAqICAgcmV0dXJuIF9fcDtcbiAgICogfVxuICAgKlxuICAgKiAvLyB1c2luZyB0aGUgYHNvdXJjZWAgcHJvcGVydHkgdG8gaW5saW5lIGNvbXBpbGVkIHRlbXBsYXRlcyBmb3IgbWVhbmluZ2Z1bFxuICAgKiAvLyBsaW5lIG51bWJlcnMgaW4gZXJyb3IgbWVzc2FnZXMgYW5kIGEgc3RhY2sgdHJhY2VcbiAgICogZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oY3dkLCAnanN0LmpzJyksICdcXFxuICAgKiAgIHZhciBKU1QgPSB7XFxcbiAgICogICAgIFwibWFpblwiOiAnICsgXy50ZW1wbGF0ZShtYWluVGV4dCkuc291cmNlICsgJ1xcXG4gICAqICAgfTtcXFxuICAgKiAnKTtcbiAgICovXG4gIGZ1bmN0aW9uIHRlbXBsYXRlKHRleHQsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAvLyBiYXNlZCBvbiBKb2huIFJlc2lnJ3MgYHRtcGxgIGltcGxlbWVudGF0aW9uXG4gICAgLy8gaHR0cDovL2Vqb2huLm9yZy9ibG9nL2phdmFzY3JpcHQtbWljcm8tdGVtcGxhdGluZy9cbiAgICAvLyBhbmQgTGF1cmEgRG9rdG9yb3ZhJ3MgZG9ULmpzXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL29sYWRvL2RvVFxuICAgIHZhciBzZXR0aW5ncyA9IGxvZGFzaC50ZW1wbGF0ZVNldHRpbmdzO1xuICAgIHRleHQgfHwgKHRleHQgPSAnJyk7XG5cbiAgICAvLyBhdm9pZCBtaXNzaW5nIGRlcGVuZGVuY2llcyB3aGVuIGBpdGVyYXRvclRlbXBsYXRlYCBpcyBub3QgZGVmaW5lZFxuICAgIG9wdGlvbnMgPSBkZWZhdWx0cyh7fSwgb3B0aW9ucywgc2V0dGluZ3MpO1xuXG4gICAgdmFyIGltcG9ydHMgPSBkZWZhdWx0cyh7fSwgb3B0aW9ucy5pbXBvcnRzLCBzZXR0aW5ncy5pbXBvcnRzKSxcbiAgICAgICAgaW1wb3J0c0tleXMgPSBrZXlzKGltcG9ydHMpLFxuICAgICAgICBpbXBvcnRzVmFsdWVzID0gdmFsdWVzKGltcG9ydHMpO1xuXG4gICAgdmFyIGlzRXZhbHVhdGluZyxcbiAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICBpbnRlcnBvbGF0ZSA9IG9wdGlvbnMuaW50ZXJwb2xhdGUgfHwgcmVOb01hdGNoLFxuICAgICAgICBzb3VyY2UgPSBcIl9fcCArPSAnXCI7XG5cbiAgICAvLyBjb21waWxlIHJlZ2V4cCB0byBtYXRjaCBlYWNoIGRlbGltaXRlclxuICAgIHZhciByZURlbGltaXRlcnMgPSBSZWdFeHAoXG4gICAgICAob3B0aW9ucy5lc2NhcGUgfHwgcmVOb01hdGNoKS5zb3VyY2UgKyAnfCcgK1xuICAgICAgaW50ZXJwb2xhdGUuc291cmNlICsgJ3wnICtcbiAgICAgIChpbnRlcnBvbGF0ZSA9PT0gcmVJbnRlcnBvbGF0ZSA/IHJlRXNUZW1wbGF0ZSA6IHJlTm9NYXRjaCkuc291cmNlICsgJ3wnICtcbiAgICAgIChvcHRpb25zLmV2YWx1YXRlIHx8IHJlTm9NYXRjaCkuc291cmNlICsgJ3wkJ1xuICAgICwgJ2cnKTtcblxuICAgIHRleHQucmVwbGFjZShyZURlbGltaXRlcnMsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGVWYWx1ZSwgaW50ZXJwb2xhdGVWYWx1ZSwgZXNUZW1wbGF0ZVZhbHVlLCBldmFsdWF0ZVZhbHVlLCBvZmZzZXQpIHtcbiAgICAgIGludGVycG9sYXRlVmFsdWUgfHwgKGludGVycG9sYXRlVmFsdWUgPSBlc1RlbXBsYXRlVmFsdWUpO1xuXG4gICAgICAvLyBlc2NhcGUgY2hhcmFjdGVycyB0aGF0IGNhbm5vdCBiZSBpbmNsdWRlZCBpbiBzdHJpbmcgbGl0ZXJhbHNcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UocmVVbmVzY2FwZWRTdHJpbmcsIGVzY2FwZVN0cmluZ0NoYXIpO1xuXG4gICAgICAvLyByZXBsYWNlIGRlbGltaXRlcnMgd2l0aCBzbmlwcGV0c1xuICAgICAgaWYgKGVzY2FwZVZhbHVlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicgK1xcbl9fZShcIiArIGVzY2FwZVZhbHVlICsgXCIpICtcXG4nXCI7XG4gICAgICB9XG4gICAgICBpZiAoZXZhbHVhdGVWYWx1ZSkge1xuICAgICAgICBpc0V2YWx1YXRpbmcgPSB0cnVlO1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGVWYWx1ZSArIFwiO1xcbl9fcCArPSAnXCI7XG4gICAgICB9XG4gICAgICBpZiAoaW50ZXJwb2xhdGVWYWx1ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInICtcXG4oKF9fdCA9IChcIiArIGludGVycG9sYXRlVmFsdWUgKyBcIikpID09IG51bGwgPyAnJyA6IF9fdCkgK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICAvLyB0aGUgSlMgZW5naW5lIGVtYmVkZGVkIGluIEFkb2JlIHByb2R1Y3RzIHJlcXVpcmVzIHJldHVybmluZyB0aGUgYG1hdGNoYFxuICAgICAgLy8gc3RyaW5nIGluIG9yZGVyIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3QgYG9mZnNldGAgdmFsdWVcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcblxuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBpZiBgdmFyaWFibGVgIGlzIG5vdCBzcGVjaWZpZWQgYW5kIHRoZSB0ZW1wbGF0ZSBjb250YWlucyBcImV2YWx1YXRlXCJcbiAgICAvLyBkZWxpbWl0ZXJzLCB3cmFwIGEgd2l0aC1zdGF0ZW1lbnQgYXJvdW5kIHRoZSBnZW5lcmF0ZWQgY29kZSB0byBhZGQgdGhlXG4gICAgLy8gZGF0YSBvYmplY3QgdG8gdGhlIHRvcCBvZiB0aGUgc2NvcGUgY2hhaW5cbiAgICB2YXIgdmFyaWFibGUgPSBvcHRpb25zLnZhcmlhYmxlLFxuICAgICAgICBoYXNWYXJpYWJsZSA9IHZhcmlhYmxlO1xuXG4gICAgaWYgKCFoYXNWYXJpYWJsZSkge1xuICAgICAgdmFyaWFibGUgPSAnb2JqJztcbiAgICAgIHNvdXJjZSA9ICd3aXRoICgnICsgdmFyaWFibGUgKyAnKSB7XFxuJyArIHNvdXJjZSArICdcXG59XFxuJztcbiAgICB9XG4gICAgLy8gY2xlYW51cCBjb2RlIGJ5IHN0cmlwcGluZyBlbXB0eSBzdHJpbmdzXG4gICAgc291cmNlID0gKGlzRXZhbHVhdGluZyA/IHNvdXJjZS5yZXBsYWNlKHJlRW1wdHlTdHJpbmdMZWFkaW5nLCAnJykgOiBzb3VyY2UpXG4gICAgICAucmVwbGFjZShyZUVtcHR5U3RyaW5nTWlkZGxlLCAnJDEnKVxuICAgICAgLnJlcGxhY2UocmVFbXB0eVN0cmluZ1RyYWlsaW5nLCAnJDE7Jyk7XG5cbiAgICAvLyBmcmFtZSBjb2RlIGFzIHRoZSBmdW5jdGlvbiBib2R5XG4gICAgc291cmNlID0gJ2Z1bmN0aW9uKCcgKyB2YXJpYWJsZSArICcpIHtcXG4nICtcbiAgICAgIChoYXNWYXJpYWJsZSA/ICcnIDogdmFyaWFibGUgKyAnIHx8ICgnICsgdmFyaWFibGUgKyAnID0ge30pO1xcbicpICtcbiAgICAgIFwidmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlXCIgK1xuICAgICAgKGlzRXZhbHVhdGluZ1xuICAgICAgICA/ICcsIF9faiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xcbicgK1xuICAgICAgICAgIFwiZnVuY3Rpb24gcHJpbnQoKSB7IF9fcCArPSBfX2ouY2FsbChhcmd1bWVudHMsICcnKSB9XFxuXCJcbiAgICAgICAgOiAnO1xcbidcbiAgICAgICkgK1xuICAgICAgc291cmNlICtcbiAgICAgICdyZXR1cm4gX19wXFxufSc7XG5cbiAgICAvLyBVc2UgYSBzb3VyY2VVUkwgZm9yIGVhc2llciBkZWJ1Z2dpbmcgYW5kIHdyYXAgaW4gYSBtdWx0aS1saW5lIGNvbW1lbnQgdG9cbiAgICAvLyBhdm9pZCBpc3N1ZXMgd2l0aCBOYXJ3aGFsLCBJRSBjb25kaXRpb25hbCBjb21waWxhdGlvbiwgYW5kIHRoZSBKUyBlbmdpbmVcbiAgICAvLyBlbWJlZGRlZCBpbiBBZG9iZSBwcm9kdWN0cy5cbiAgICAvLyBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL3R1dG9yaWFscy9kZXZlbG9wZXJ0b29scy9zb3VyY2VtYXBzLyN0b2Mtc291cmNldXJsXG4gICAgdmFyIHNvdXJjZVVSTCA9ICdcXG4vKlxcbi8vQCBzb3VyY2VVUkw9JyArIChvcHRpb25zLnNvdXJjZVVSTCB8fCAnL2xvZGFzaC90ZW1wbGF0ZS9zb3VyY2VbJyArICh0ZW1wbGF0ZUNvdW50ZXIrKykgKyAnXScpICsgJ1xcbiovJztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVzdWx0ID0gRnVuY3Rpb24oaW1wb3J0c0tleXMsICdyZXR1cm4gJyArIHNvdXJjZSArIHNvdXJjZVVSTCkuYXBwbHkodW5kZWZpbmVkLCBpbXBvcnRzVmFsdWVzKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHJldHVybiByZXN1bHQoZGF0YSk7XG4gICAgfVxuICAgIC8vIHByb3ZpZGUgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uJ3Mgc291cmNlIHZpYSBpdHMgYHRvU3RyaW5nYCBtZXRob2QsIGluXG4gICAgLy8gc3VwcG9ydGVkIGVudmlyb25tZW50cywgb3IgdGhlIGBzb3VyY2VgIHByb3BlcnR5IGFzIGEgY29udmVuaWVuY2UgZm9yXG4gICAgLy8gaW5saW5pbmcgY29tcGlsZWQgdGVtcGxhdGVzIGR1cmluZyB0aGUgYnVpbGQgcHJvY2Vzc1xuICAgIHJlc3VsdC5zb3VyY2UgPSBzb3VyY2U7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyB0aGUgYGNhbGxiYWNrYCBmdW5jdGlvbiBgbmAgdGltZXMsIHJldHVybmluZyBhbiBhcnJheSBvZiB0aGUgcmVzdWx0c1xuICAgKiBvZiBlYWNoIGBjYWxsYmFja2AgZXhlY3V0aW9uLiBUaGUgYGNhbGxiYWNrYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWRcbiAgICogd2l0aCBvbmUgYXJndW1lbnQ7IChpbmRleCkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgKiBAcGFyYW0ge051bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGV4ZWN1dGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHRoZSByZXN1bHRzIG9mIGVhY2ggYGNhbGxiYWNrYCBleGVjdXRpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBkaWNlUm9sbHMgPSBfLnRpbWVzKDMsIF8ucGFydGlhbChfLnJhbmRvbSwgMSwgNikpO1xuICAgKiAvLyA9PiBbMywgNiwgNF1cbiAgICpcbiAgICogXy50aW1lcygzLCBmdW5jdGlvbihuKSB7IG1hZ2UuY2FzdFNwZWxsKG4pOyB9KTtcbiAgICogLy8gPT4gY2FsbHMgYG1hZ2UuY2FzdFNwZWxsKG4pYCB0aHJlZSB0aW1lcywgcGFzc2luZyBgbmAgb2YgYDBgLCBgMWAsIGFuZCBgMmAgcmVzcGVjdGl2ZWx5XG4gICAqXG4gICAqIF8udGltZXMoMywgZnVuY3Rpb24obikgeyB0aGlzLmNhc3Qobik7IH0sIG1hZ2UpO1xuICAgKiAvLyA9PiBhbHNvIGNhbGxzIGBtYWdlLmNhc3RTcGVsbChuKWAgdGhyZWUgdGltZXNcbiAgICovXG4gIGZ1bmN0aW9uIHRpbWVzKG4sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgbiA9ICtuIHx8IDA7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG9wcG9zaXRlIG9mIGBfLmVzY2FwZWAsIHRoaXMgbWV0aG9kIGNvbnZlcnRzIHRoZSBIVE1MIGVudGl0aWVzXG4gICAqIGAmYW1wO2AsIGAmbHQ7YCwgYCZndDtgLCBgJnF1b3Q7YCwgYW5kIGAmIzM5O2AgaW4gYHN0cmluZ2AgdG8gdGhlaXJcbiAgICogY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHVuZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm5zIHRoZSB1bmVzY2FwZWQgc3RyaW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnVuZXNjYXBlKCdNb2UsIExhcnJ5ICZhbXA7IEN1cmx5Jyk7XG4gICAqIC8vID0+ICdNb2UsIExhcnJ5ICYgQ3VybHknXG4gICAqL1xuICBmdW5jdGlvbiB1bmVzY2FwZShzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nID09IG51bGwgPyAnJyA6IChzdHJpbmcgKyAnJykucmVwbGFjZShyZUVzY2FwZWRIdG1sLCB1bmVzY2FwZUh0bWxDaGFyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSB1bmlxdWUgSUQuIElmIGBwcmVmaXhgIGlzIHBhc3NlZCwgdGhlIElEIHdpbGwgYmUgYXBwZW5kZWQgdG8gaXQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgKiBAcGFyYW0ge1N0cmluZ30gW3ByZWZpeF0gVGhlIHZhbHVlIHRvIHByZWZpeCB0aGUgSUQgd2l0aC5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJucyB0aGUgdW5pcXVlIElELlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnVuaXF1ZUlkKCdjb250YWN0XycpO1xuICAgKiAvLyA9PiAnY29udGFjdF8xMDQnXG4gICAqXG4gICAqIF8udW5pcXVlSWQoKTtcbiAgICogLy8gPT4gJzEwNSdcbiAgICovXG4gIGZ1bmN0aW9uIHVuaXF1ZUlkKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyO1xuICAgIHJldHVybiAocHJlZml4ID09IG51bGwgPyAnJyA6IHByZWZpeCArICcnKSArIGlkO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIEludm9rZXMgYGludGVyY2VwdG9yYCB3aXRoIHRoZSBgdmFsdWVgIGFzIHRoZSBmaXJzdCBhcmd1bWVudCwgYW5kIHRoZW5cbiAgICogcmV0dXJucyBgdmFsdWVgLiBUaGUgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sXG4gICAqIGluIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcGFzcyB0byBgaW50ZXJjZXB0b3JgLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpbnRlcmNlcHRvciBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IFJldHVybnMgYHZhbHVlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXyhbMSwgMiwgMywgNF0pXG4gICAqICAuZmlsdGVyKGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICUgMiA9PSAwOyB9KVxuICAgKiAgLnRhcChhbGVydClcbiAgICogIC5tYXAoZnVuY3Rpb24obnVtKSB7IHJldHVybiBudW0gKiBudW07IH0pXG4gICAqICAudmFsdWUoKTtcbiAgICogLy8gPT4gLy8gWzIsIDRdIChhbGVydGVkKVxuICAgKiAvLyA9PiBbNCwgMTZdXG4gICAqL1xuICBmdW5jdGlvbiB0YXAodmFsdWUsIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3IodmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlcyB0aGUgYHRvU3RyaW5nYCByZXN1bHQgb2YgdGhlIHdyYXBwZWQgdmFsdWUuXG4gICAqXG4gICAqIEBuYW1lIHRvU3RyaW5nXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcgcmVzdWx0LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfKFsxLCAyLCAzXSkudG9TdHJpbmcoKTtcbiAgICogLy8gPT4gJzEsMiwzJ1xuICAgKi9cbiAgZnVuY3Rpb24gd3JhcHBlclRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9fd3JhcHBlZF9fICsgJyc7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdHMgdGhlIHdyYXBwZWQgdmFsdWUuXG4gICAqXG4gICAqIEBuYW1lIHZhbHVlT2ZcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGFsaWFzIHZhbHVlXG4gICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgKiBAcmV0dXJucyB7TWl4ZWR9IFJldHVybnMgdGhlIHdyYXBwZWQgdmFsdWUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8oWzEsIDIsIDNdKS52YWx1ZU9mKCk7XG4gICAqIC8vID0+IFsxLCAyLCAzXVxuICAgKi9cbiAgZnVuY3Rpb24gd3JhcHBlclZhbHVlT2YoKSB7XG4gICAgcmV0dXJuIHRoaXMuX193cmFwcGVkX187XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvLyBhZGQgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIHdyYXBwZWQgdmFsdWVzIHdoZW4gY2hhaW5pbmdcbiAgbG9kYXNoLmFmdGVyID0gYWZ0ZXI7XG4gIGxvZGFzaC5hc3NpZ24gPSBhc3NpZ247XG4gIGxvZGFzaC5hdCA9IGF0O1xuICBsb2Rhc2guYmluZCA9IGJpbmQ7XG4gIGxvZGFzaC5iaW5kQWxsID0gYmluZEFsbDtcbiAgbG9kYXNoLmJpbmRLZXkgPSBiaW5kS2V5O1xuICBsb2Rhc2guY29tcGFjdCA9IGNvbXBhY3Q7XG4gIGxvZGFzaC5jb21wb3NlID0gY29tcG9zZTtcbiAgbG9kYXNoLmNvdW50QnkgPSBjb3VudEJ5O1xuICBsb2Rhc2guZGVib3VuY2UgPSBkZWJvdW5jZTtcbiAgbG9kYXNoLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gIGxvZGFzaC5kZWZlciA9IGRlZmVyO1xuICBsb2Rhc2guZGVsYXkgPSBkZWxheTtcbiAgbG9kYXNoLmRpZmZlcmVuY2UgPSBkaWZmZXJlbmNlO1xuICBsb2Rhc2guZmlsdGVyID0gZmlsdGVyO1xuICBsb2Rhc2guZmxhdHRlbiA9IGZsYXR0ZW47XG4gIGxvZGFzaC5mb3JFYWNoID0gZm9yRWFjaDtcbiAgbG9kYXNoLmZvckluID0gZm9ySW47XG4gIGxvZGFzaC5mb3JPd24gPSBmb3JPd247XG4gIGxvZGFzaC5mdW5jdGlvbnMgPSBmdW5jdGlvbnM7XG4gIGxvZGFzaC5ncm91cEJ5ID0gZ3JvdXBCeTtcbiAgbG9kYXNoLmluaXRpYWwgPSBpbml0aWFsO1xuICBsb2Rhc2guaW50ZXJzZWN0aW9uID0gaW50ZXJzZWN0aW9uO1xuICBsb2Rhc2guaW52ZXJ0ID0gaW52ZXJ0O1xuICBsb2Rhc2guaW52b2tlID0gaW52b2tlO1xuICBsb2Rhc2gua2V5cyA9IGtleXM7XG4gIGxvZGFzaC5tYXAgPSBtYXA7XG4gIGxvZGFzaC5tYXggPSBtYXg7XG4gIGxvZGFzaC5tZW1vaXplID0gbWVtb2l6ZTtcbiAgbG9kYXNoLm1lcmdlID0gbWVyZ2U7XG4gIGxvZGFzaC5taW4gPSBtaW47XG4gIGxvZGFzaC5vYmplY3QgPSBvYmplY3Q7XG4gIGxvZGFzaC5vbWl0ID0gb21pdDtcbiAgbG9kYXNoLm9uY2UgPSBvbmNlO1xuICBsb2Rhc2gucGFpcnMgPSBwYWlycztcbiAgbG9kYXNoLnBhcnRpYWwgPSBwYXJ0aWFsO1xuICBsb2Rhc2gucGFydGlhbFJpZ2h0ID0gcGFydGlhbFJpZ2h0O1xuICBsb2Rhc2gucGljayA9IHBpY2s7XG4gIGxvZGFzaC5wbHVjayA9IHBsdWNrO1xuICBsb2Rhc2gucmFuZ2UgPSByYW5nZTtcbiAgbG9kYXNoLnJlamVjdCA9IHJlamVjdDtcbiAgbG9kYXNoLnJlc3QgPSByZXN0O1xuICBsb2Rhc2guc2h1ZmZsZSA9IHNodWZmbGU7XG4gIGxvZGFzaC5zb3J0QnkgPSBzb3J0Qnk7XG4gIGxvZGFzaC50YXAgPSB0YXA7XG4gIGxvZGFzaC50aHJvdHRsZSA9IHRocm90dGxlO1xuICBsb2Rhc2gudGltZXMgPSB0aW1lcztcbiAgbG9kYXNoLnRvQXJyYXkgPSB0b0FycmF5O1xuICBsb2Rhc2gudW5pb24gPSB1bmlvbjtcbiAgbG9kYXNoLnVuaXEgPSB1bmlxO1xuICBsb2Rhc2gudmFsdWVzID0gdmFsdWVzO1xuICBsb2Rhc2gud2hlcmUgPSB3aGVyZTtcbiAgbG9kYXNoLndpdGhvdXQgPSB3aXRob3V0O1xuICBsb2Rhc2gud3JhcCA9IHdyYXA7XG4gIGxvZGFzaC56aXAgPSB6aXA7XG5cbiAgLy8gYWRkIGFsaWFzZXNcbiAgbG9kYXNoLmNvbGxlY3QgPSBtYXA7XG4gIGxvZGFzaC5kcm9wID0gcmVzdDtcbiAgbG9kYXNoLmVhY2ggPSBmb3JFYWNoO1xuICBsb2Rhc2guZXh0ZW5kID0gYXNzaWduO1xuICBsb2Rhc2gubWV0aG9kcyA9IGZ1bmN0aW9ucztcbiAgbG9kYXNoLnNlbGVjdCA9IGZpbHRlcjtcbiAgbG9kYXNoLnRhaWwgPSByZXN0O1xuICBsb2Rhc2gudW5pcXVlID0gdW5pcTtcblxuICAvLyBhZGQgZnVuY3Rpb25zIHRvIGBsb2Rhc2gucHJvdG90eXBlYFxuICBtaXhpbihsb2Rhc2gpO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIGFkZCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gdW53cmFwcGVkIHZhbHVlcyB3aGVuIGNoYWluaW5nXG4gIGxvZGFzaC5jbG9uZSA9IGNsb25lO1xuICBsb2Rhc2guY2xvbmVEZWVwID0gY2xvbmVEZWVwO1xuICBsb2Rhc2guY29udGFpbnMgPSBjb250YWlucztcbiAgbG9kYXNoLmVzY2FwZSA9IGVzY2FwZTtcbiAgbG9kYXNoLmV2ZXJ5ID0gZXZlcnk7XG4gIGxvZGFzaC5maW5kID0gZmluZDtcbiAgbG9kYXNoLmhhcyA9IGhhcztcbiAgbG9kYXNoLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4gIGxvZGFzaC5pbmRleE9mID0gaW5kZXhPZjtcbiAgbG9kYXNoLmlzQXJndW1lbnRzID0gaXNBcmd1bWVudHM7XG4gIGxvZGFzaC5pc0FycmF5ID0gaXNBcnJheTtcbiAgbG9kYXNoLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcbiAgbG9kYXNoLmlzRGF0ZSA9IGlzRGF0ZTtcbiAgbG9kYXNoLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbiAgbG9kYXNoLmlzRW1wdHkgPSBpc0VtcHR5O1xuICBsb2Rhc2guaXNFcXVhbCA9IGlzRXF1YWw7XG4gIGxvZGFzaC5pc0Zpbml0ZSA9IGlzRmluaXRlO1xuICBsb2Rhc2guaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG4gIGxvZGFzaC5pc05hTiA9IGlzTmFOO1xuICBsb2Rhc2guaXNOdWxsID0gaXNOdWxsO1xuICBsb2Rhc2guaXNOdW1iZXIgPSBpc051bWJlcjtcbiAgbG9kYXNoLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG4gIGxvZGFzaC5pc1BsYWluT2JqZWN0ID0gaXNQbGFpbk9iamVjdDtcbiAgbG9kYXNoLmlzUmVnRXhwID0gaXNSZWdFeHA7XG4gIGxvZGFzaC5pc1N0cmluZyA9IGlzU3RyaW5nO1xuICBsb2Rhc2guaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcbiAgbG9kYXNoLmxhc3RJbmRleE9mID0gbGFzdEluZGV4T2Y7XG4gIGxvZGFzaC5taXhpbiA9IG1peGluO1xuICBsb2Rhc2gubm9Db25mbGljdCA9IG5vQ29uZmxpY3Q7XG4gIGxvZGFzaC5yYW5kb20gPSByYW5kb207XG4gIGxvZGFzaC5yZWR1Y2UgPSByZWR1Y2U7XG4gIGxvZGFzaC5yZWR1Y2VSaWdodCA9IHJlZHVjZVJpZ2h0O1xuICBsb2Rhc2gucmVzdWx0ID0gcmVzdWx0O1xuICBsb2Rhc2guc2l6ZSA9IHNpemU7XG4gIGxvZGFzaC5zb21lID0gc29tZTtcbiAgbG9kYXNoLnNvcnRlZEluZGV4ID0gc29ydGVkSW5kZXg7XG4gIGxvZGFzaC50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICBsb2Rhc2gudW5lc2NhcGUgPSB1bmVzY2FwZTtcbiAgbG9kYXNoLnVuaXF1ZUlkID0gdW5pcXVlSWQ7XG5cbiAgLy8gYWRkIGFsaWFzZXNcbiAgbG9kYXNoLmFsbCA9IGV2ZXJ5O1xuICBsb2Rhc2guYW55ID0gc29tZTtcbiAgbG9kYXNoLmRldGVjdCA9IGZpbmQ7XG4gIGxvZGFzaC5mb2xkbCA9IHJlZHVjZTtcbiAgbG9kYXNoLmZvbGRyID0gcmVkdWNlUmlnaHQ7XG4gIGxvZGFzaC5pbmNsdWRlID0gY29udGFpbnM7XG4gIGxvZGFzaC5pbmplY3QgPSByZWR1Y2U7XG5cbiAgZm9yT3duKGxvZGFzaCwgZnVuY3Rpb24oZnVuYywgbWV0aG9kTmFtZSkge1xuICAgIGlmICghbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXSkge1xuICAgICAgbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl9fd3JhcHBlZF9fXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseShsb2Rhc2gsIGFyZ3MpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIGFkZCBmdW5jdGlvbnMgY2FwYWJsZSBvZiByZXR1cm5pbmcgd3JhcHBlZCBhbmQgdW53cmFwcGVkIHZhbHVlcyB3aGVuIGNoYWluaW5nXG4gIGxvZGFzaC5maXJzdCA9IGZpcnN0O1xuICBsb2Rhc2gubGFzdCA9IGxhc3Q7XG5cbiAgLy8gYWRkIGFsaWFzZXNcbiAgbG9kYXNoLnRha2UgPSBmaXJzdDtcbiAgbG9kYXNoLmhlYWQgPSBmaXJzdDtcblxuICBmb3JPd24obG9kYXNoLCBmdW5jdGlvbihmdW5jLCBtZXRob2ROYW1lKSB7XG4gICAgaWYgKCFsb2Rhc2gucHJvdG90eXBlW21ldGhvZE5hbWVdKSB7XG4gICAgICBsb2Rhc2gucHJvdG90eXBlW21ldGhvZE5hbWVdPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYyh0aGlzLl9fd3JhcHBlZF9fLCBjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayA9PSBudWxsIHx8ICh0aGlzQXJnICYmIHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKVxuICAgICAgICAgID8gcmVzdWx0XG4gICAgICAgICAgOiBuZXcgbG9kYXNoKHJlc3VsdCk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIFRoZSBzZW1hbnRpYyB2ZXJzaW9uIG51bWJlci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAdHlwZSBTdHJpbmdcbiAgICovXG4gIGxvZGFzaC5WRVJTSU9OID0gJzEuMC4yJztcblxuICAvLyBhZGQgXCJDaGFpbmluZ1wiIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlclxuICBsb2Rhc2gucHJvdG90eXBlLnRvU3RyaW5nID0gd3JhcHBlclRvU3RyaW5nO1xuICBsb2Rhc2gucHJvdG90eXBlLnZhbHVlID0gd3JhcHBlclZhbHVlT2Y7XG4gIGxvZGFzaC5wcm90b3R5cGUudmFsdWVPZiA9IHdyYXBwZXJWYWx1ZU9mO1xuXG4gIC8vIGFkZCBgQXJyYXlgIGZ1bmN0aW9ucyB0aGF0IHJldHVybiB1bndyYXBwZWQgdmFsdWVzXG4gIGVhY2goWydqb2luJywgJ3BvcCcsICdzaGlmdCddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgdmFyIGZ1bmMgPSBhcnJheVJlZlttZXRob2ROYW1lXTtcbiAgICBsb2Rhc2gucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIGFkZCBgQXJyYXlgIGZ1bmN0aW9ucyB0aGF0IHJldHVybiB0aGUgd3JhcHBlZCB2YWx1ZVxuICBlYWNoKFsncHVzaCcsICdyZXZlcnNlJywgJ3NvcnQnLCAndW5zaGlmdCddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgdmFyIGZ1bmMgPSBhcnJheVJlZlttZXRob2ROYW1lXTtcbiAgICBsb2Rhc2gucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICBmdW5jLmFwcGx5KHRoaXMuX193cmFwcGVkX18sIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9KTtcblxuICAvLyBhZGQgYEFycmF5YCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gbmV3IHdyYXBwZWQgdmFsdWVzXG4gIGVhY2goWydjb25jYXQnLCAnc2xpY2UnLCAnc3BsaWNlJ10sIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgZnVuYyA9IGFycmF5UmVmW21ldGhvZE5hbWVdO1xuICAgIGxvZGFzaC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgbG9kYXNoKGZ1bmMuYXBwbHkodGhpcy5fX3dyYXBwZWRfXywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLy8gZXhwb3NlIExvLURhc2hcbiAgLy8gc29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3Igc3BlY2lmaWMgY29uZGl0aW9uIHBhdHRlcm5zIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gRXhwb3NlIExvLURhc2ggdG8gdGhlIGdsb2JhbCBvYmplY3QgZXZlbiB3aGVuIGFuIEFNRCBsb2FkZXIgaXMgcHJlc2VudCBpblxuICAgIC8vIGNhc2UgTG8tRGFzaCB3YXMgaW5qZWN0ZWQgYnkgYSB0aGlyZC1wYXJ0eSBzY3JpcHQgYW5kIG5vdCBpbnRlbmRlZCB0byBiZVxuICAgIC8vIGxvYWRlZCBhcyBhIG1vZHVsZS4gVGhlIGdsb2JhbCBhc3NpZ25tZW50IGNhbiBiZSByZXZlcnRlZCBpbiB0aGUgTG8tRGFzaFxuICAgIC8vIG1vZHVsZSB2aWEgaXRzIGBub0NvbmZsaWN0KClgIG1ldGhvZC5cbiAgICB3aW5kb3cuXyA9IGxvZGFzaDtcblxuICAgIC8vIGRlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHNvLCB0aHJvdWdoIHBhdGggbWFwcGluZywgaXQgY2FuIGJlXG4gICAgLy8gcmVmZXJlbmNlZCBhcyB0aGUgXCJ1bmRlcnNjb3JlXCIgbW9kdWxlXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGxvZGFzaDtcbiAgICB9KTtcbiAgfVxuICAvLyBjaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0XG4gIGVsc2UgaWYgKGZyZWVFeHBvcnRzKSB7XG4gICAgLy8gaW4gTm9kZS5qcyBvciBSaW5nb0pTIHYwLjguMCtcbiAgICBpZiAoZnJlZU1vZHVsZSkge1xuICAgICAgKGZyZWVNb2R1bGUuZXhwb3J0cyA9IGxvZGFzaCkuXyA9IGxvZGFzaDtcbiAgICB9XG4gICAgLy8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cbiAgICBlbHNlIHtcbiAgICAgIGZyZWVFeHBvcnRzLl8gPSBsb2Rhc2g7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIGluIGEgYnJvd3NlciBvciBSaGlub1xuICAgIHdpbmRvdy5fID0gbG9kYXNoO1xuICB9XG59KHRoaXMpKTtcbiIsIi8qKiFcclxuICAgU29jaWFsQmFyIFBsdWctaW4gdjEuMFxyXG4gICBFYXN5IHBsdWdpbiBmb3Igc2ltcGxlIHNvY2lhbCBiYXIgd2l0aCBzdXBwb3J0IHZpZGVvcywgZmFjZWJvb2sgcGFnZXMsIGxpa2UgYW5kIG90aGVyIHdpZGdldHNcclxuICAgQGxpY2Vuc2U6IG5vbmVcclxuICAgQGF1dGhvcjogTWljaGFsIEtvdmFsIChNSWNRbylcclxuICAgQHByZXNlcnZlXHJcbioqL1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmxldCBjb25maWcgPSB7XHJcbiAgICBvcGVuZWRDbGFzczogXCJvcGVuZWRcIixcclxuICAgIFxyXG4gICAgcGFuZWxNYXhIZWlnaHQ6IDU1NixcclxuICAgIHBhbmVsQ2xhc3M6IFwiLnNvY2lhbC1wYW5lbFwiLFxyXG4gICAgcGFuZWxGaXhlZENsYXNzOiBcInRvcC1maXhlZFwiLFxyXG4gICAgcGFuZWxQZXJjZW50OiB7XHJcbiAgICAgICAgaGFsZlBvc2l0aW9uOiAzMCxcclxuICAgICAgICBmaXhlZDogMlxyXG4gICAgfSxcclxuXHJcbiAgICBwYW5lbEJvZHlDbGFzczogXCIucGFuZWwtY29udGVudC1wbGFjZWhvbGRlclwiLFxyXG4gICAgYm94Q2xhc3M6IFwiLmJveFwiLFxyXG4gICAgXHJcbiAgICBpY29uQ2xhc3M6IFwiLnNvY2lhbC1pY29uXCIsXHJcbiAgICBpY29uQWN0aXZlQ2xhc3M6IFwiYWN0aXZlXCIsXHJcbiAgICBcclxuICAgIGhhbGZQb3NpdGlvbjogZmFsc2UsXHJcbiAgICBoYWxmUG9zaXRpb25DbGFzczogXCJoYWxmLXBvc2l0aW9uXCIsXHJcblxyXG4gICAgdG9nZ2xlOiBmYWxzZVxyXG5cclxufTtcclxuXHJcbmNsYXNzIFNvY2lhbEJhciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXNlckNvbmYpIHtcclxuICAgICAgICBfLmZvckVhY2godXNlckNvbmYsICh2YWx1ZSwga2V5KSA9PiBjb25maWdba2V5XSA9IHZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5vcGVuQmFyID0gdGhpcy5vcGVuQmFyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZUJhciA9IHRoaXMuY2xvc2VCYXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uQnJlYWtwb2ludHMgPSB0aGlzLnNldFBvc2l0aW9uQnJlYWtwb2ludHMuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNhbGNQZXJjZW50ID0gdGhpcy5jYWxjUGVyY2VudC5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uQnJlYWtwb2ludHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBvcGVuQmFyKGUpIHtcclxuICAgICAgICBsZXQgJHRoaXMgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgbGV0IHR5cGUgPSAkdGhpcy5kYXRhKFwiYm94XCIpO1xyXG5cclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICBpZihjb25maWcudG9nZ2xlKSB7XHJcbiAgICAgICAgICAgIGlmKCQoY29uZmlnLnBhbmVsQ2xhc3MpLmhhc0NsYXNzKGNvbmZpZy5vcGVuZWRDbGFzcykgJiYgJHRoaXMuaGFzQ2xhc3MoY29uZmlnLmljb25BY3RpdmVDbGFzcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlQmFyKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGFuZ2UgY29sb3IgYWNvcnJkaW5nIGJ5IGdpdmVuIGNsYXNzXHJcbiAgICAgICAgJChjb25maWcucGFuZWxDbGFzcyArIFwiIFwiICsgY29uZmlnLmljb25DbGFzcykucmVtb3ZlQ2xhc3MoY29uZmlnLmljb25BY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgJHRoaXMuYWRkQ2xhc3MoY29uZmlnLmljb25BY3RpdmVDbGFzcyk7XHJcblxyXG4gICAgICAgIC8vIENoYW5nZSBjb250ZW50XHJcbiAgICAgICAgJChjb25maWcucGFuZWxDbGFzcyArIFwiIFwiICsgY29uZmlnLnBhbmVsQm9keUNsYXNzICsgXCIgXCIgKyBjb25maWcuYm94Q2xhc3MpLmhpZGUoKTtcclxuICAgICAgICAkKGNvbmZpZy5wYW5lbENsYXNzICsgXCIgXCIgKyBjb25maWcucGFuZWxCb2R5Q2xhc3MgKyBcIiAuXCIgKyB0eXBlKS5zaG93KCk7XHJcblxyXG4gICAgICAgIC8vIHNsaWRlIGNvbnRlbnRcclxuICAgICAgICAkKGNvbmZpZy5wYW5lbENsYXNzKVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoY29uZmlnLm9wZW5lZENsYXNzKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoZnVuY3Rpb24gKGluZGV4LCBjbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoY2xhc3NOYW1lLm1hdGNoKC8oXnxcXHMpbmV0d29yay1cXFMrL2cpIHx8IFtdKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcIm5ldHdvcmstXCIgKyB0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZUJhcihlKSB7XHJcbiAgICAgICAgaWYoISQoY29uZmlnLnBhbmVsQ2xhc3MpLmhhc0NsYXNzKGNvbmZpZy5vcGVuZWRDbGFzcykpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgJChjb25maWcucGFuZWxDbGFzcykucmVtb3ZlQ2xhc3MoY29uZmlnLm9wZW5lZENsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb3NpdGlvbkJyZWFrcG9pbnRzKCkge1xyXG4gICAgICAgIGxldCBwYW5lbCA9ICQoY29uZmlnLnBhbmVsQ2xhc3MpO1xyXG4gICAgICAgIGxldCBwYW5lbEJvZHkgPSAkKGNvbmZpZy5wYW5lbEJvZHlDbGFzcyk7XHJcbiAgICAgICAgbGV0IHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuICAgICAgICBsZXQgaGFsZlBvc2l0aW9uID0gTWF0aC5mbG9vcigocGFuZWxCb2R5LmhlaWdodCgpICsgdGhpcy5jYWxjUGVyY2VudCh3aW5kb3dIZWlnaHQsIGNvbmZpZy5wYW5lbFBlcmNlbnQuaGFsZlBvc2l0aW9uKSkpO1xyXG5cclxuICAgICAgICBpZiAod2luZG93SGVpZ2h0IDw9IGhhbGZQb3NpdGlvbikge1xyXG4gICAgICAgICAgICBwYW5lbC5yZW1vdmVDbGFzcyhjb25maWcuaGFsZlBvc2l0aW9uQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoY29uZmlnLnBhbmVsRml4ZWRDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICBwYW5lbEJvZHkuaGVpZ2h0KHdpbmRvd0hlaWdodCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb25maWcuaGFsZlBvc2l0aW9uICYmIHdpbmRvd0hlaWdodCA+PSBoYWxmUG9zaXRpb24pIHtcclxuICAgICAgICAgICAgcGFuZWwuYWRkQ2xhc3MoY29uZmlnLmhhbGZQb3NpdGlvbkNsYXNzKVxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKGNvbmZpZy5wYW5lbEZpeGVkQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhbmVsQm9keS5oZWlnaHQoKSA+PSBjb25maWcucGFuZWxNYXhIZWlnaHQpIHtcclxuICAgICAgICAgICAgcGFuZWxCb2R5LmhlaWdodChjb25maWcucGFuZWxNYXhIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjYWxjUGVyY2VudCh0b3RhbCwgcGVyY2VudCkge1xyXG4gICAgICAgIHJldHVybiAocGVyY2VudCAvIDEwMCkgKiB0b3RhbDsgXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNvY2lhbEJhcjsiLCJpbXBvcnQgU29jaWFsQmFyIGZyb20gJy4vbW9kdWxlcy9Tb2NpYWxCYXInO1xyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICBcclxuICAgIGxldCBiYXIgPSBuZXcgU29jaWFsQmFyKHtcclxuICAgICAgICB0b2dnbGU6IHRydWUsXHJcbiAgICAgICAgaGFsZlBvc2l0aW9uOiB0cnVlXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBydW4gYWZ0ZXIgZG9jdW1lbnQgcmVhZHkgICBcclxuICAgICQoXCIucGFuZWwtY29udGVudC1wbGFjZWhvbGRlclwiKS5vbihcImNsaWNrXCIsIChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpKTtcclxuICAgICQoXCIuc29jaWFsLXBhbmVsIC5zb2NpYWwtaWNvblwiKS5vbihcImNsaWNrXCIsIGJhci5vcGVuQmFyKTtcclxuICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgYmFyLmNsb3NlQmFyKTtcclxuICAgICQod2luZG93KS5yZXNpemUoYmFyLnNldFBvc2l0aW9uQnJlYWtwb2ludHMpO1xyXG59KTtcclxuIl0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p1YjJSbFgyMXZaSFZzWlhNdmJHOWtZWE5vTDJScGMzUXZiRzlrWVhOb0xtcHpJaXdpYzNKalhGeHFjMXhjYlc5a2RXeGxjMXhjVTI5amFXRnNRbUZ5TG1weklpd2ljM0pqWEZ4cWMxeGNjMjlqYVdGc1ltRnlMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRMEZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96czdPenM3T3pzN08zRnFRa04yTTBwQk96czdPenM3T3p0QlFWRkJPenM3T3pzN096dEJRVVZCTEVsQlFVa3NVMEZCVXp0QlFVTlVMR2xDUVVGaExGRkJSRW83TzBGQlIxUXNiMEpCUVdkQ0xFZEJTRkE3UVVGSlZDeG5Ra0ZCV1N4bFFVcElPMEZCUzFRc2NVSkJRV2xDTEZkQlRGSTdRVUZOVkN4clFrRkJZenRCUVVOV0xITkNRVUZqTEVWQlJFbzdRVUZGVml4bFFVRlBPMEZCUmtjc1MwRk9URHM3UVVGWFZDeHZRa0ZCWjBJc05FSkJXRkE3UVVGWlZDeGpRVUZWTEUxQldrUTdPMEZCWTFRc1pVRkJWeXhqUVdSR08wRkJaVlFzY1VKQlFXbENMRkZCWmxJN08wRkJhVUpVTEd0Q1FVRmpMRXRCYWtKTU8wRkJhMEpVTEhWQ1FVRnRRaXhsUVd4Q1ZqczdRVUZ2UWxRc1dVRkJVVHM3UVVGd1FrTXNRMEZCWWpzN1NVRjNRazBzVXp0QlFVVkdMSFZDUVVGWkxGRkJRVm9zUlVGQmMwSTdRVUZCUVRzN1FVRkRiRUlzZVVKQlFVVXNUMEZCUml4RFFVRlZMRkZCUVZZc1JVRkJiMElzVlVGQlF5eExRVUZFTEVWQlFWRXNSMEZCVWp0QlFVRkJMRzFDUVVGblFpeFBRVUZQTEVkQlFWQXNTVUZCWXl4TFFVRTVRanRCUVVGQkxGTkJRWEJDT3p0QlFVVkJMR0ZCUVVzc1QwRkJUQ3hIUVVGbExFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFXSXNRMEZCYTBJc1NVRkJiRUlzUTBGQlpqdEJRVU5CTEdGQlFVc3NVVUZCVEN4SFFVRm5RaXhMUVVGTExGRkJRVXdzUTBGQll5eEpRVUZrTEVOQlFXMUNMRWxCUVc1Q0xFTkJRV2hDTzBGQlEwRXNZVUZCU3l4elFrRkJUQ3hIUVVFNFFpeExRVUZMTEhOQ1FVRk1MRU5CUVRSQ0xFbEJRVFZDTEVOQlFXbERMRWxCUVdwRExFTkJRVGxDTzBGQlEwRXNZVUZCU3l4WFFVRk1MRWRCUVcxQ0xFdEJRVXNzVjBGQlRDeERRVUZwUWl4SlFVRnFRaXhEUVVGelFpeEpRVUYwUWl4RFFVRnVRanM3UVVGRlFTeGhRVUZMTEhOQ1FVRk1PMEZCUTBnN096czdaME5CUlU4c1F5eEZRVUZITzBGQlExQXNaMEpCUVVrc1VVRkJVU3hGUVVGRkxFVkJRVVVzWVVGQlNpeERRVUZhTzBGQlEwRXNaMEpCUVVrc1QwRkJUeXhOUVVGTkxFbEJRVTRzUTBGQlZ5eExRVUZZTEVOQlFWZzdPMEZCUlVFc1kwRkJSU3hsUVVGR096dEJRVVZCTEdkQ1FVRkhMRTlCUVU4c1RVRkJWaXhGUVVGclFqdEJRVU5rTEc5Q1FVRkhMRVZCUVVVc1QwRkJUeXhWUVVGVUxFVkJRWEZDTEZGQlFYSkNMRU5CUVRoQ0xFOUJRVThzVjBGQmNrTXNTMEZCY1VRc1RVRkJUU3hSUVVGT0xFTkJRV1VzVDBGQlR5eGxRVUYwUWl4RFFVRjRSQ3hGUVVGblJ6dEJRVU0xUml3eVFrRkJUeXhMUVVGTExGRkJRVXdzUTBGQll5eERRVUZrTEVOQlFWQTdRVUZEU0R0QlFVTktPenRCUVVWRU8wRkJRMEVzWTBGQlJTeFBRVUZQTEZWQlFWQXNSMEZCYjBJc1IwRkJjRUlzUjBGQk1FSXNUMEZCVHl4VFFVRnVReXhGUVVFNFF5eFhRVUU1UXl4RFFVRXdSQ3hQUVVGUExHVkJRV3BGTzBGQlEwRXNhMEpCUVUwc1VVRkJUaXhEUVVGbExFOUJRVThzWlVGQmRFSTdPMEZCUlVFN1FVRkRRU3hqUVVGRkxFOUJRVThzVlVGQlVDeEhRVUZ2UWl4SFFVRndRaXhIUVVFd1FpeFBRVUZQTEdOQlFXcERMRWRCUVd0RUxFZEJRV3hFTEVkQlFYZEVMRTlCUVU4c1VVRkJha1VzUlVGQk1rVXNTVUZCTTBVN1FVRkRRU3hqUVVGRkxFOUJRVThzVlVGQlVDeEhRVUZ2UWl4SFFVRndRaXhIUVVFd1FpeFBRVUZQTEdOQlFXcERMRWRCUVd0RUxFbEJRV3hFTEVkQlFYbEVMRWxCUVRORUxFVkJRV2xGTEVsQlFXcEZPenRCUVVWQk8wRkJRMEVzWTBGQlJTeFBRVUZQTEZWQlFWUXNSVUZEU3l4UlFVUk1MRU5CUTJNc1QwRkJUeXhYUVVSeVFpeEZRVVZMTEZkQlJrd3NRMEZGYVVJc1ZVRkJWU3hMUVVGV0xFVkJRV2xDTEZOQlFXcENMRVZCUVRSQ08wRkJRM0pETEhWQ1FVRlBMRU5CUVVNc1ZVRkJWU3hMUVVGV0xFTkJRV2RDTEc5Q1FVRm9RaXhMUVVGNVF5eEZRVUV4UXl4RlFVRTRReXhKUVVFNVF5eERRVUZ0UkN4SFFVRnVSQ3hEUVVGUU8wRkJRMGdzWVVGS1RDeEZRVXRMTEZGQlRFd3NRMEZMWXl4aFFVRmhMRWxCVEROQ08wRkJUVWc3T3p0cFEwRkZVU3hETEVWQlFVYzdRVUZEVWl4blFrRkJSeXhEUVVGRExFVkJRVVVzVDBGQlR5eFZRVUZVTEVWQlFYRkNMRkZCUVhKQ0xFTkJRVGhDTEU5QlFVOHNWMEZCY2tNc1EwRkJTaXhGUVVOSk96dEJRVVZLTEdOQlFVVXNUMEZCVHl4VlFVRlVMRVZCUVhGQ0xGZEJRWEpDTEVOQlFXbERMRTlCUVU4c1YwRkJlRU03UVVGRFNEczdPMmxFUVVWM1FqdEJRVU55UWl4blFrRkJTU3hSUVVGUkxFVkJRVVVzVDBGQlR5eFZRVUZVTEVOQlFWbzdRVUZEUVN4blFrRkJTU3haUVVGWkxFVkJRVVVzVDBGQlR5eGpRVUZVTEVOQlFXaENPMEZCUTBFc1owSkJRVWtzWlVGQlpTeEZRVUZGTEUxQlFVWXNSVUZCVlN4TlFVRldMRVZCUVc1Q08wRkJRMEVzWjBKQlFVa3NaVUZCWlN4TFFVRkxMRXRCUVV3c1EwRkJXU3hWUVVGVkxFMUJRVllzUzBGQmNVSXNTMEZCU3l4WFFVRk1MRU5CUVdsQ0xGbEJRV3BDTEVWQlFTdENMRTlCUVU4c1dVRkJVQ3hEUVVGdlFpeFpRVUZ1UkN4RFFVRnFReXhEUVVGdVFqczdRVUZGUVN4blFrRkJTU3huUWtGQlowSXNXVUZCY0VJc1JVRkJhME03UVVGRE9VSXNjMEpCUVUwc1YwRkJUaXhEUVVGclFpeFBRVUZQTEdsQ1FVRjZRaXhGUVVOTExGRkJSRXdzUTBGRFl5eFBRVUZQTEdWQlJISkNPenRCUVVkQkxEQkNRVUZWTEUxQlFWWXNRMEZCYVVJc1dVRkJha0k3UVVGRFNDeGhRVXhFTEUxQlMwOHNTVUZCU1N4UFFVRlBMRmxCUVZBc1NVRkJkVUlzWjBKQlFXZENMRmxCUVRORExFVkJRWGxFTzBGQlF6VkVMSE5DUVVGTkxGRkJRVTRzUTBGQlpTeFBRVUZQTEdsQ1FVRjBRaXhGUVVOTExGZEJSRXdzUTBGRGFVSXNUMEZCVHl4bFFVUjRRanRCUVVWSU96dEJRVVZFTEdkQ1FVRkpMRlZCUVZVc1RVRkJWaXhOUVVGelFpeFBRVUZQTEdOQlFXcERMRVZCUVdsRU8wRkJRemRETERCQ1FVRlZMRTFCUVZZc1EwRkJhVUlzVDBGQlR5eGpRVUY0UWp0QlFVTklPMEZCUTBvN096dHZRMEZGVnl4TExFVkJRVThzVHl4RlFVRlRPMEZCUTNoQ0xHMUNRVUZSTEZWQlFWVXNSMEZCV0N4SFFVRnJRaXhMUVVGNlFqdEJRVU5JT3pzN096czdhMEpCUjFVc1V6czdPenM3UVVNM1IyWTdPenM3T3p0QlFVVkJMRVZCUVVVc1dVRkJXVHM3UVVGRlZpeFJRVUZKTEUxQlFVMHNkMEpCUVdNN1FVRkRjRUlzWjBKQlFWRXNTVUZFV1R0QlFVVndRaXh6UWtGQll6dEJRVVpOTEV0QlFXUXNRMEZCVmpzN1FVRkxRVHRCUVVOQkxFMUJRVVVzTkVKQlFVWXNSVUZCWjBNc1JVRkJhRU1zUTBGQmJVTXNUMEZCYmtNc1JVRkJORU1zVlVGQlF5eERRVUZFTzBGQlFVRXNaVUZCVHl4RlFVRkZMR1ZCUVVZc1JVRkJVRHRCUVVGQkxFdEJRVFZETzBGQlEwRXNUVUZCUlN3MFFrRkJSaXhGUVVGblF5eEZRVUZvUXl4RFFVRnRReXhQUVVGdVF5eEZRVUUwUXl4SlFVRkpMRTlCUVdoRU8wRkJRMEVzVFVGQlJTeE5RVUZHTEVWQlFWVXNSVUZCVml4RFFVRmhMRTlCUVdJc1JVRkJjMElzU1VGQlNTeFJRVUV4UWp0QlFVTkJMRTFCUVVVc1RVRkJSaXhGUVVGVkxFMUJRVllzUTBGQmFVSXNTVUZCU1N4elFrRkJja0k3UVVGRFNDeERRVnBFSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW9ablZ1WTNScGIyNGdaU2gwTEc0c2NpbDdablZ1WTNScGIyNGdjeWh2TEhVcGUybG1LQ0Z1VzI5ZEtYdHBaaWdoZEZ0dlhTbDdkbUZ5SUdFOWRIbHdaVzltSUhKbGNYVnBjbVU5UFZ3aVpuVnVZM1JwYjI1Y0lpWW1jbVZ4ZFdseVpUdHBaaWdoZFNZbVlTbHlaWFIxY200Z1lTaHZMQ0V3S1R0cFppaHBLWEpsZEhWeWJpQnBLRzhzSVRBcE8zWmhjaUJtUFc1bGR5QkZjbkp2Y2loY0lrTmhibTV2ZENCbWFXNWtJRzF2WkhWc1pTQW5YQ0lyYnl0Y0lpZGNJaWs3ZEdoeWIzY2daaTVqYjJSbFBWd2lUVTlFVlV4RlgwNVBWRjlHVDFWT1JGd2lMR1o5ZG1GeUlHdzlibHR2WFQxN1pYaHdiM0owY3pwN2ZYMDdkRnR2WFZzd1hTNWpZV3hzS0d3dVpYaHdiM0owY3l4bWRXNWpkR2x2YmlobEtYdDJZWElnYmoxMFcyOWRXekZkVzJWZE8zSmxkSFZ5YmlCektHNC9ianBsS1gwc2JDeHNMbVY0Y0c5eWRITXNaU3gwTEc0c2NpbDljbVYwZFhKdUlHNWJiMTB1Wlhod2IzSjBjMzEyWVhJZ2FUMTBlWEJsYjJZZ2NtVnhkV2x5WlQwOVhDSm1kVzVqZEdsdmJsd2lKaVp5WlhGMWFYSmxPMlp2Y2loMllYSWdiejB3TzI4OGNpNXNaVzVuZEdnN2J5c3JLWE1vY2x0dlhTazdjbVYwZFhKdUlITjlLU0lzSWk4cUtseHVJQ29nUUd4cFkyVnVjMlZjYmlBcUlFeHZMVVJoYzJnZ01TNHdMaklnS0VOMWMzUnZiU0JDZFdsc1pDa2dQR2gwZEhBNkx5OXNiMlJoYzJndVkyOXRMejVjYmlBcUlFSjFhV3hrT2lCZ2JHOWtZWE5vSUcxdlpHVnliaUF0YnlBdUwyUnBjM1F2Ykc5a1lYTm9MbXB6WUZ4dUlDb2dRMjl3ZVhKcFoyaDBJREl3TVRJdE1qQXhNeUJVYUdVZ1JHOXFieUJHYjNWdVpHRjBhVzl1SUR4b2RIUndPaTh2Wkc5cWIyWnZkVzVrWVhScGIyNHViM0puTHo1Y2JpQXFJRUpoYzJWa0lHOXVJRlZ1WkdWeWMyTnZjbVV1YW5NZ01TNDBMalFnUEdoMGRIQTZMeTkxYm1SbGNuTmpiM0psYW5NdWIzSm5MejVjYmlBcUlFTnZjSGx5YVdkb2RDQXlNREE1TFRJd01UTWdTbVZ5WlcxNUlFRnphR3RsYm1GekxDQkViMk4xYldWdWRFTnNiM1ZrSUVsdVl5NWNiaUFxSUVGMllXbHNZV0pzWlNCMWJtUmxjaUJOU1ZRZ2JHbGpaVzV6WlNBOGFIUjBjRG92TDJ4dlpHRnphQzVqYjIwdmJHbGpaVzV6WlQ1Y2JpQXFMMXh1T3lobWRXNWpkR2x2YmloM2FXNWtiM2NzSUhWdVpHVm1hVzVsWkNrZ2UxeHVYRzRnSUM4cUtpQkVaWFJsWTNRZ1puSmxaU0IyWVhKcFlXSnNaU0JnWlhod2IzSjBjMkFnS2k5Y2JpQWdkbUZ5SUdaeVpXVkZlSEJ2Y25SeklEMGdkSGx3Wlc5bUlHVjRjRzl5ZEhNZ1BUMGdKMjlpYW1WamRDY2dKaVlnWlhod2IzSjBjenRjYmx4dUlDQXZLaW9nUkdWMFpXTjBJR1p5WldVZ2RtRnlhV0ZpYkdVZ1lHMXZaSFZzWldBZ0tpOWNiaUFnZG1GeUlHWnlaV1ZOYjJSMWJHVWdQU0IwZVhCbGIyWWdiVzlrZFd4bElEMDlJQ2R2WW1wbFkzUW5JQ1ltSUcxdlpIVnNaU0FtSmlCdGIyUjFiR1V1Wlhod2IzSjBjeUE5UFNCbWNtVmxSWGh3YjNKMGN5QW1KaUJ0YjJSMWJHVTdYRzVjYmlBZ0x5b3FJRVJsZEdWamRDQm1jbVZsSUhaaGNtbGhZbXhsSUdCbmJHOWlZV3hnSUdGdVpDQjFjMlVnYVhRZ1lYTWdZSGRwYm1SdmQyQWdLaTljYmlBZ2RtRnlJR1p5WldWSGJHOWlZV3dnUFNCMGVYQmxiMllnWjJ4dlltRnNJRDA5SUNkdlltcGxZM1FuSUNZbUlHZHNiMkpoYkR0Y2JpQWdhV1lnS0daeVpXVkhiRzlpWVd3dVoyeHZZbUZzSUQwOVBTQm1jbVZsUjJ4dlltRnNLU0I3WEc0Z0lDQWdkMmx1Wkc5M0lEMGdabkpsWlVkc2IySmhiRHRjYmlBZ2ZWeHVYRzRnSUM4cUtpQlZjMlZrSUdadmNpQmhjbkpoZVNCaGJtUWdiMkpxWldOMElHMWxkR2h2WkNCeVpXWmxjbVZ1WTJWeklDb3ZYRzRnSUhaaGNpQmhjbkpoZVZKbFppQTlJRnRkTEZ4dUlDQWdJQ0FnYjJKcVpXTjBVbVZtSUQwZ2UzMDdYRzVjYmlBZ0x5b3FJRlZ6WldRZ2RHOGdaMlZ1WlhKaGRHVWdkVzVwY1hWbElFbEVjeUFxTDF4dUlDQjJZWElnYVdSRGIzVnVkR1Z5SUQwZ01EdGNibHh1SUNBdktpb2dWWE5sWkNCcGJuUmxjbTVoYkd4NUlIUnZJR2x1WkdsallYUmxJSFpoY21sdmRYTWdkR2hwYm1keklDb3ZYRzRnSUhaaGNpQnBibVJwWTJGMGIzSlBZbXBsWTNRZ1BTQnZZbXBsWTNSU1pXWTdYRzVjYmlBZ0x5b3FJRlZ6WldRZ1lua2dZR05oWTJobFpFTnZiblJoYVc1ellDQmhjeUIwYUdVZ1pHVm1ZWFZzZENCemFYcGxJSGRvWlc0Z2IzQjBhVzFwZW1GMGFXOXVjeUJoY21VZ1pXNWhZbXhsWkNCbWIzSWdiR0Z5WjJVZ1lYSnlZWGx6SUNvdlhHNGdJSFpoY2lCc1lYSm5aVUZ5Y21GNVUybDZaU0E5SURNd08xeHVYRzRnSUM4cUtpQlZjMlZrSUhSdklISmxjM1J2Y21VZ2RHaGxJRzl5YVdkcGJtRnNJR0JmWUNCeVpXWmxjbVZ1WTJVZ2FXNGdZRzV2UTI5dVpteHBZM1JnSUNvdlhHNGdJSFpoY2lCdmJHUkVZWE5vSUQwZ2QybHVaRzkzTGw4N1hHNWNiaUFnTHlvcUlGVnpaV1FnZEc4Z2JXRjBZMmdnU0ZSTlRDQmxiblJwZEdsbGN5QXFMMXh1SUNCMllYSWdjbVZGYzJOaGNHVmtTSFJ0YkNBOUlDOG1LRDg2WVcxd2ZHeDBmR2QwZkhGMWIzUjhJek01S1Rzdlp6dGNibHh1SUNBdktpb2dWWE5sWkNCMGJ5QnRZWFJqYUNCbGJYQjBlU0J6ZEhKcGJtY2diR2wwWlhKaGJITWdhVzRnWTI5dGNHbHNaV1FnZEdWdGNHeGhkR1VnYzI5MWNtTmxJQ292WEc0Z0lIWmhjaUJ5WlVWdGNIUjVVM1J5YVc1blRHVmhaR2x1WnlBOUlDOWNYR0pmWDNBZ1hGd3JQU0FuSnpzdlp5eGNiaUFnSUNBZ0lISmxSVzF3ZEhsVGRISnBibWROYVdSa2JHVWdQU0F2WEZ4aUtGOWZjQ0JjWENzOUtTQW5KeUJjWENzdlp5eGNiaUFnSUNBZ0lISmxSVzF3ZEhsVGRISnBibWRVY21GcGJHbHVaeUE5SUM4b1gxOWxYRndvTGlvL1hGd3BmRnhjWWw5ZmRGeGNLU2tnWEZ3clhGeHVKeWM3TDJjN1hHNWNiaUFnTHlvcUlGVnpaV1FnZEc4Z2JXRjBZMmdnY21WblpYaHdJR1pzWVdkeklHWnliMjBnZEdobGFYSWdZMjlsY21ObFpDQnpkSEpwYm1jZ2RtRnNkV1Z6SUNvdlhHNGdJSFpoY2lCeVpVWnNZV2R6SUQwZ0wxeGNkeW9rTHp0Y2JseHVJQ0F2S2lvZ1ZYTmxaQ0IwYnlCa1pYUmxZM1FnYVdZZ1lTQnRaWFJvYjJRZ2FYTWdibUYwYVhabElDb3ZYRzRnSUhaaGNpQnlaVTVoZEdsMlpTQTlJRkpsWjBWNGNDZ25YaWNnSzF4dUlDQWdJQ2h2WW1wbFkzUlNaV1l1ZG1Gc2RXVlBaaUFySUNjbktWeHVJQ0FnSUNBZ0xuSmxjR3hoWTJVb0wxc3VLaXMvWGlSN2ZTZ3BmRnRjWEYxY1hGeGNYUzluTENBblhGeGNYQ1FtSnlsY2JpQWdJQ0FnSUM1eVpYQnNZV05sS0M5MllXeDFaVTltZkdadmNpQmJYbHhjWFYwckwyY3NJQ2N1S3o4bktTQXJJQ2NrSjF4dUlDQXBPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlZjMlZrSUhSdklHMWhkR05vSUVWVE5pQjBaVzF3YkdGMFpTQmtaV3hwYldsMFpYSnpYRzRnSUNBcUlHaDBkSEE2THk5d1pXOXdiR1V1Ylc5NmFXeHNZUzV2Y21jdmZtcHZjbVZ1Wkc5eVptWXZaWE0yTFdSeVlXWjBMbWgwYld3amMyVmpMVGN1T0M0MlhHNGdJQ0FxTDF4dUlDQjJZWElnY21WRmMxUmxiWEJzWVhSbElEMGdMMXhjSkZ4Y2V5aGJYbHhjWEZ4OVhTb29QenBjWEZ4Y0xsdGVYRnhjWEgxZEtpa3FLVnhjZlM5bk8xeHVYRzRnSUM4cUtpQlZjMlZrSUhSdklHMWhkR05vSUZ3aWFXNTBaWEp3YjJ4aGRHVmNJaUIwWlcxd2JHRjBaU0JrWld4cGJXbDBaWEp6SUNvdlhHNGdJSFpoY2lCeVpVbHVkR1Z5Y0c5c1lYUmxJRDBnTHp3bFBTaGJYRnh6WEZ4VFhTcy9LU1UrTDJjN1hHNWNiaUFnTHlvcUlGVnpaV1FnZEc4Z1pXNXpkWEpsSUdOaGNIUjFjbWx1WnlCdmNtUmxjaUJ2WmlCMFpXMXdiR0YwWlNCa1pXeHBiV2wwWlhKeklDb3ZYRzRnSUhaaGNpQnlaVTV2VFdGMFkyZ2dQU0F2S0NSZUtTODdYRzVjYmlBZ0x5b3FJRlZ6WldRZ2RHOGdiV0YwWTJnZ1NGUk5UQ0JqYUdGeVlXTjBaWEp6SUNvdlhHNGdJSFpoY2lCeVpWVnVaWE5qWVhCbFpFaDBiV3dnUFNBdld5WThQbHdpSjEwdlp6dGNibHh1SUNBdktpb2dWWE5sWkNCMGJ5QnRZWFJqYUNCMWJtVnpZMkZ3WldRZ1kyaGhjbUZqZEdWeWN5QnBiaUJqYjIxd2FXeGxaQ0J6ZEhKcGJtY2diR2wwWlhKaGJITWdLaTljYmlBZ2RtRnlJSEpsVlc1bGMyTmhjR1ZrVTNSeWFXNW5JRDBnTDFzblhGeHVYRnh5WEZ4MFhGeDFNakF5T0Z4Y2RUSXdNamxjWEZ4Y1hTOW5PMXh1WEc0Z0lDOHFLaUJWYzJWa0lIUnZJRzFoYTJVZ2RHVnRjR3hoZEdVZ2MyOTFjbU5sVlZKTWN5QmxZWE5wWlhJZ2RHOGdhV1JsYm5ScFpua2dLaTljYmlBZ2RtRnlJSFJsYlhCc1lYUmxRMjkxYm5SbGNpQTlJREE3WEc1Y2JpQWdMeW9xSUU1aGRHbDJaU0J0WlhSb2IyUWdjMmh2Y25SamRYUnpJQ292WEc0Z0lIWmhjaUJqWldsc0lEMGdUV0YwYUM1alpXbHNMRnh1SUNBZ0lDQWdZMjl1WTJGMElEMGdZWEp5WVhsU1pXWXVZMjl1WTJGMExGeHVJQ0FnSUNBZ1pteHZiM0lnUFNCTllYUm9MbVpzYjI5eUxGeHVJQ0FnSUNBZ1oyVjBVSEp2ZEc5MGVYQmxUMllnUFNCeVpVNWhkR2wyWlM1MFpYTjBLR2RsZEZCeWIzUnZkSGx3WlU5bUlEMGdUMkpxWldOMExtZGxkRkJ5YjNSdmRIbHdaVTltS1NBbUppQm5aWFJRY205MGIzUjVjR1ZQWml4Y2JpQWdJQ0FnSUdoaGMwOTNibEJ5YjNCbGNuUjVJRDBnYjJKcVpXTjBVbVZtTG1oaGMwOTNibEJ5YjNCbGNuUjVMRnh1SUNBZ0lDQWdjSFZ6YUNBOUlHRnljbUY1VW1WbUxuQjFjMmdzWEc0Z0lDQWdJQ0IwYjFOMGNtbHVaeUE5SUc5aWFtVmpkRkpsWmk1MGIxTjBjbWx1Wnp0Y2JseHVJQ0F2S2lCT1lYUnBkbVVnYldWMGFHOWtJSE5vYjNKMFkzVjBjeUJtYjNJZ2JXVjBhRzlrY3lCM2FYUm9JSFJvWlNCellXMWxJRzVoYldVZ1lYTWdiM1JvWlhJZ1lHeHZaR0Z6YUdBZ2JXVjBhRzlrY3lBcUwxeHVJQ0IyWVhJZ2JtRjBhWFpsUW1sdVpDQTlJSEpsVG1GMGFYWmxMblJsYzNRb2JtRjBhWFpsUW1sdVpDQTlJSE5zYVdObExtSnBibVFwSUNZbUlHNWhkR2wyWlVKcGJtUXNYRzRnSUNBZ0lDQnVZWFJwZG1WSmMwRnljbUY1SUQwZ2NtVk9ZWFJwZG1VdWRHVnpkQ2h1WVhScGRtVkpjMEZ5Y21GNUlEMGdRWEp5WVhrdWFYTkJjbkpoZVNrZ0ppWWdibUYwYVhabFNYTkJjbkpoZVN4Y2JpQWdJQ0FnSUc1aGRHbDJaVWx6Um1sdWFYUmxJRDBnZDJsdVpHOTNMbWx6Um1sdWFYUmxMRnh1SUNBZ0lDQWdibUYwYVhabFNYTk9ZVTRnUFNCM2FXNWtiM2N1YVhOT1lVNHNYRzRnSUNBZ0lDQnVZWFJwZG1WTFpYbHpJRDBnY21WT1lYUnBkbVV1ZEdWemRDaHVZWFJwZG1WTFpYbHpJRDBnVDJKcVpXTjBMbXRsZVhNcElDWW1JRzVoZEdsMlpVdGxlWE1zWEc0Z0lDQWdJQ0J1WVhScGRtVk5ZWGdnUFNCTllYUm9MbTFoZUN4Y2JpQWdJQ0FnSUc1aGRHbDJaVTFwYmlBOUlFMWhkR2d1YldsdUxGeHVJQ0FnSUNBZ2JtRjBhWFpsVW1GdVpHOXRJRDBnVFdGMGFDNXlZVzVrYjIwN1hHNWNiaUFnTHlvcUlHQlBZbXBsWTNRamRHOVRkSEpwYm1kZ0lISmxjM1ZzZENCemFHOXlkR04xZEhNZ0tpOWNiaUFnZG1GeUlHRnlaM05EYkdGemN5QTlJQ2RiYjJKcVpXTjBJRUZ5WjNWdFpXNTBjMTBuTEZ4dUlDQWdJQ0FnWVhKeVlYbERiR0Z6Y3lBOUlDZGJiMkpxWldOMElFRnljbUY1WFNjc1hHNGdJQ0FnSUNCaWIyOXNRMnhoYzNNZ1BTQW5XMjlpYW1WamRDQkNiMjlzWldGdVhTY3NYRzRnSUNBZ0lDQmtZWFJsUTJ4aGMzTWdQU0FuVzI5aWFtVmpkQ0JFWVhSbFhTY3NYRzRnSUNBZ0lDQm1kVzVqUTJ4aGMzTWdQU0FuVzI5aWFtVmpkQ0JHZFc1amRHbHZibDBuTEZ4dUlDQWdJQ0FnYm5WdFltVnlRMnhoYzNNZ1BTQW5XMjlpYW1WamRDQk9kVzFpWlhKZEp5eGNiaUFnSUNBZ0lHOWlhbVZqZEVOc1lYTnpJRDBnSjF0dlltcGxZM1FnVDJKcVpXTjBYU2NzWEc0Z0lDQWdJQ0J5WldkbGVIQkRiR0Z6Y3lBOUlDZGJiMkpxWldOMElGSmxaMFY0Y0YwbkxGeHVJQ0FnSUNBZ2MzUnlhVzVuUTJ4aGMzTWdQU0FuVzI5aWFtVmpkQ0JUZEhKcGJtZGRKenRjYmx4dUlDQXZLaW9nUkdWMFpXTjBJSFpoY21sdmRYTWdaVzUyYVhKdmJtMWxiblJ6SUNvdlhHNGdJSFpoY2lCcGMwbGxUM0JsY21FZ1BTQWhJWGRwYm1SdmR5NWhkSFJoWTJoRmRtVnVkQ3hjYmlBZ0lDQWdJR2x6VmpnZ1BTQnVZWFJwZG1WQ2FXNWtJQ1ltSUNFdlhGeHVmSFJ5ZFdVdkxuUmxjM1FvYm1GMGFYWmxRbWx1WkNBcklHbHpTV1ZQY0dWeVlTazdYRzVjYmlBZ0x5b2dSR1YwWldOMElHbG1JR0JHZFc1amRHbHZiaU5pYVc1a1lDQmxlR2x6ZEhNZ1lXNWtJR2x6SUdsdVptVnljbVZrSUhSdklHSmxJR1poYzNRZ0tHRnNiQ0JpZFhRZ1ZqZ3BJQ292WEc0Z0lIWmhjaUJwYzBKcGJtUkdZWE4wSUQwZ2JtRjBhWFpsUW1sdVpDQW1KaUFoYVhOV09EdGNibHh1SUNBdktpQkVaWFJsWTNRZ2FXWWdZRTlpYW1WamRDNXJaWGx6WUNCbGVHbHpkSE1nWVc1a0lHbHpJR2x1Wm1WeWNtVmtJSFJ2SUdKbElHWmhjM1FnS0VsRkxDQlBjR1Z5WVN3Z1ZqZ3BJQ292WEc0Z0lIWmhjaUJwYzB0bGVYTkdZWE4wSUQwZ2JtRjBhWFpsUzJWNWN5QW1KaUFvYVhOSlpVOXdaWEpoSUh4OElHbHpWamdwTzF4dVhHNGdJQzhxS2lCVmMyVmtJSFJ2SUdsa1pXNTBhV1o1SUc5aWFtVmpkQ0JqYkdGemMybG1hV05oZEdsdmJuTWdkR2hoZENCZ1h5NWpiRzl1WldBZ2MzVndjRzl5ZEhNZ0tpOWNiaUFnZG1GeUlHTnNiMjVsWVdKc1pVTnNZWE56WlhNZ1BTQjdmVHRjYmlBZ1kyeHZibVZoWW14bFEyeGhjM05sYzF0bWRXNWpRMnhoYzNOZElEMGdabUZzYzJVN1hHNGdJR05zYjI1bFlXSnNaVU5zWVhOelpYTmJZWEpuYzBOc1lYTnpYU0E5SUdOc2IyNWxZV0pzWlVOc1lYTnpaWE5iWVhKeVlYbERiR0Z6YzEwZ1BWeHVJQ0JqYkc5dVpXRmliR1ZEYkdGemMyVnpXMkp2YjJ4RGJHRnpjMTBnUFNCamJHOXVaV0ZpYkdWRGJHRnpjMlZ6VzJSaGRHVkRiR0Z6YzEwZ1BWeHVJQ0JqYkc5dVpXRmliR1ZEYkdGemMyVnpXMjUxYldKbGNrTnNZWE56WFNBOUlHTnNiMjVsWVdKc1pVTnNZWE56WlhOYmIySnFaV04wUTJ4aGMzTmRJRDFjYmlBZ1kyeHZibVZoWW14bFEyeGhjM05sYzF0eVpXZGxlSEJEYkdGemMxMGdQU0JqYkc5dVpXRmliR1ZEYkdGemMyVnpXM04wY21sdVowTnNZWE56WFNBOUlIUnlkV1U3WEc1Y2JpQWdMeW9xSUZWelpXUWdkRzhnYkc5dmEzVndJR0VnWW5WcGJIUXRhVzRnWTI5dWMzUnlkV04wYjNJZ1lua2dXMXREYkdGemMxMWRJQ292WEc0Z0lIWmhjaUJqZEc5eVFubERiR0Z6Y3lBOUlIdDlPMXh1SUNCamRHOXlRbmxEYkdGemMxdGhjbkpoZVVOc1lYTnpYU0E5SUVGeWNtRjVPMXh1SUNCamRHOXlRbmxEYkdGemMxdGliMjlzUTJ4aGMzTmRJRDBnUW05dmJHVmhianRjYmlBZ1kzUnZja0o1UTJ4aGMzTmJaR0YwWlVOc1lYTnpYU0E5SUVSaGRHVTdYRzRnSUdOMGIzSkNlVU5zWVhOelcyOWlhbVZqZEVOc1lYTnpYU0E5SUU5aWFtVmpkRHRjYmlBZ1kzUnZja0o1UTJ4aGMzTmJiblZ0WW1WeVEyeGhjM05kSUQwZ1RuVnRZbVZ5TzF4dUlDQmpkRzl5UW5sRGJHRnpjMXR5WldkbGVIQkRiR0Z6YzEwZ1BTQlNaV2RGZUhBN1hHNGdJR04wYjNKQ2VVTnNZWE56VzNOMGNtbHVaME5zWVhOelhTQTlJRk4wY21sdVp6dGNibHh1SUNBdktpb2dWWE5sWkNCMGJ5QmtaWFJsY20xcGJtVWdhV1lnZG1Gc2RXVnpJR0Z5WlNCdlppQjBhR1VnYkdGdVozVmhaMlVnZEhsd1pTQlBZbXBsWTNRZ0tpOWNiaUFnZG1GeUlHOWlhbVZqZEZSNWNHVnpJRDBnZTF4dUlDQWdJQ2RpYjI5c1pXRnVKem9nWm1Gc2MyVXNYRzRnSUNBZ0oyWjFibU4wYVc5dUp6b2dkSEoxWlN4Y2JpQWdJQ0FuYjJKcVpXTjBKem9nZEhKMVpTeGNiaUFnSUNBbmJuVnRZbVZ5SnpvZ1ptRnNjMlVzWEc0Z0lDQWdKM04wY21sdVp5YzZJR1poYkhObExGeHVJQ0FnSUNkMWJtUmxabWx1WldRbk9pQm1ZV3h6WlZ4dUlDQjlPMXh1WEc0Z0lDOHFLaUJWYzJWa0lIUnZJR1Z6WTJGd1pTQmphR0Z5WVdOMFpYSnpJR1p2Y2lCcGJtTnNkWE5wYjI0Z2FXNGdZMjl0Y0dsc1pXUWdjM1J5YVc1bklHeHBkR1Z5WVd4eklDb3ZYRzRnSUhaaGNpQnpkSEpwYm1kRmMyTmhjR1Z6SUQwZ2UxeHVJQ0FnSUNkY1hGeGNKem9nSjF4Y1hGd25MRnh1SUNBZ0lGd2lKMXdpT2lCY0lpZGNJaXhjYmlBZ0lDQW5YRnh1SnpvZ0oyNG5MRnh1SUNBZ0lDZGNYSEluT2lBbmNpY3NYRzRnSUNBZ0oxeGNkQ2M2SUNkMEp5eGNiaUFnSUNBblhGeDFNakF5T0NjNklDZDFNakF5T0Njc1hHNGdJQ0FnSjF4Y2RUSXdNamtuT2lBbmRUSXdNamtuWEc0Z0lIMDdYRzVjYmlBZ0x5b3RMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMU292WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU55WldGMFpYTWdZU0JnYkc5a1lYTm9ZQ0J2WW1wbFkzUXNJSFJvWVhRZ2QzSmhjSE1nZEdobElHZHBkbVZ1SUdCMllXeDFaV0FzSUhSdklHVnVZV0pzWlNCdFpYUm9iMlJjYmlBZ0lDb2dZMmhoYVc1cGJtY3VYRzRnSUNBcVhHNGdJQ0FxSUVsdUlHRmtaR2wwYVc5dUlIUnZJRXh2TFVSaGMyZ2diV1YwYUc5a2N5d2dkM0poY0hCbGNuTWdZV3h6YnlCb1lYWmxJSFJvWlNCbWIyeHNiM2RwYm1jZ1lFRnljbUY1WUNCdFpYUm9iMlJ6T2x4dUlDQWdLaUJnWTI5dVkyRjBZQ3dnWUdwdmFXNWdMQ0JnY0c5d1lDd2dZSEIxYzJoZ0xDQmdjbVYyWlhKelpXQXNJR0J6YUdsbWRHQXNJR0J6YkdsalpXQXNJR0J6YjNKMFlDd2dZSE53YkdsalpXQXNYRzRnSUNBcUlHRnVaQ0JnZFc1emFHbG1kR0JjYmlBZ0lDcGNiaUFnSUNvZ1ZHaGxJR05vWVdsdVlXSnNaU0IzY21Gd2NHVnlJR1oxYm1OMGFXOXVjeUJoY21VNlhHNGdJQ0FxSUdCaFpuUmxjbUFzSUdCaGMzTnBaMjVnTENCZ1ltbHVaR0FzSUdCaWFXNWtRV3hzWUN3Z1lHSnBibVJMWlhsZ0xDQmdZMmhoYVc1Z0xDQmdZMjl0Y0dGamRHQXNJR0JqYjIxd2IzTmxZQ3hjYmlBZ0lDb2dZR052Ym1OaGRHQXNJR0JqYjNWdWRFSjVZQ3dnWUdSbFltOTFibU5sWUN3Z1lHUmxabUYxYkhSellDd2dZR1JsWm1WeVlDd2dZR1JsYkdGNVlDd2dZR1JwWm1abGNtVnVZMlZnTEZ4dUlDQWdLaUJnWm1sc2RHVnlZQ3dnWUdac1lYUjBaVzVnTENCZ1ptOXlSV0ZqYUdBc0lHQm1iM0pKYm1Bc0lHQm1iM0pQZDI1Z0xDQmdablZ1WTNScGIyNXpZQ3dnWUdkeWIzVndRbmxnTEZ4dUlDQWdLaUJnYVc1cGRHbGhiR0FzSUdCcGJuUmxjbk5sWTNScGIyNWdMQ0JnYVc1MlpYSjBZQ3dnWUdsdWRtOXJaV0FzSUdCclpYbHpZQ3dnWUcxaGNHQXNJR0J0WVhoZ0xDQmdiV1Z0YjJsNlpXQXNYRzRnSUNBcUlHQnRaWEpuWldBc0lHQnRhVzVnTENCZ2IySnFaV04wWUN3Z1lHOXRhWFJnTENCZ2IyNWpaV0FzSUdCd1lXbHljMkFzSUdCd1lYSjBhV0ZzWUN3Z1lIQmhjblJwWVd4U2FXZG9kR0FzWEc0Z0lDQXFJR0J3YVdOcllDd2dZSEJzZFdOcllDd2dZSEIxYzJoZ0xDQmdjbUZ1WjJWZ0xDQmdjbVZxWldOMFlDd2dZSEpsYzNSZ0xDQmdjbVYyWlhKelpXQXNJR0J6YUhWbVpteGxZQ3hjYmlBZ0lDb2dZSE5zYVdObFlDd2dZSE52Y25SZ0xDQmdjMjl5ZEVKNVlDd2dZSE53YkdsalpXQXNJR0IwWVhCZ0xDQmdkR2h5YjNSMGJHVmdMQ0JnZEdsdFpYTmdMQ0JnZEc5QmNuSmhlV0FzWEc0Z0lDQXFJR0IxYm1sdmJtQXNJR0IxYm1seFlDd2dZSFZ1YzJocFpuUmdMQ0JnZG1Gc2RXVnpZQ3dnWUhkb1pYSmxZQ3dnWUhkcGRHaHZkWFJnTENCZ2QzSmhjR0FzSUdGdVpDQmdlbWx3WUZ4dUlDQWdLbHh1SUNBZ0tpQlVhR1VnYm05dUxXTm9ZV2x1WVdKc1pTQjNjbUZ3Y0dWeUlHWjFibU4wYVc5dWN5QmhjbVU2WEc0Z0lDQXFJR0JqYkc5dVpXQXNJR0JqYkc5dVpVUmxaWEJnTENCZ1kyOXVkR0ZwYm5OZ0xDQmdaWE5qWVhCbFlDd2dZR1YyWlhKNVlDd2dZR1pwYm1SZ0xDQmdhR0Z6WUN3Z1lHbGtaVzUwYVhSNVlDeGNiaUFnSUNvZ1lHbHVaR1Y0VDJaZ0xDQmdhWE5CY21kMWJXVnVkSE5nTENCZ2FYTkJjbkpoZVdBc0lHQnBjMEp2YjJ4bFlXNWdMQ0JnYVhORVlYUmxZQ3dnWUdselJXeGxiV1Z1ZEdBc0lHQnBjMFZ0Y0hSNVlDeGNiaUFnSUNvZ1lHbHpSWEYxWVd4Z0xDQmdhWE5HYVc1cGRHVmdMQ0JnYVhOR2RXNWpkR2x2Ym1Bc0lHQnBjMDVoVG1Bc0lHQnBjMDUxYkd4Z0xDQmdhWE5PZFcxaVpYSmdMQ0JnYVhOUFltcGxZM1JnTEZ4dUlDQWdLaUJnYVhOUWJHRnBiazlpYW1WamRHQXNJR0JwYzFKbFowVjRjR0FzSUdCcGMxTjBjbWx1WjJBc0lHQnBjMVZ1WkdWbWFXNWxaR0FzSUdCcWIybHVZQ3dnWUd4aGMzUkpibVJsZUU5bVlDeGNiaUFnSUNvZ1lHMXBlR2x1WUN3Z1lHNXZRMjl1Wm14cFkzUmdMQ0JnY0c5d1lDd2dZSEpoYm1SdmJXQXNJR0J5WldSMVkyVmdMQ0JnY21Wa2RXTmxVbWxuYUhSZ0xDQmdjbVZ6ZFd4MFlDeGNiaUFnSUNvZ1lITm9hV1owWUN3Z1lITnBlbVZnTENCZ2MyOXRaV0FzSUdCemIzSjBaV1JKYm1SbGVHQXNJR0IwWlcxd2JHRjBaV0FzSUdCMWJtVnpZMkZ3WldBc0lHRnVaQ0JnZFc1cGNYVmxTV1JnWEc0Z0lDQXFYRzRnSUNBcUlGUm9aU0IzY21Gd2NHVnlJR1oxYm1OMGFXOXVjeUJnWm1seWMzUmdJR0Z1WkNCZ2JHRnpkR0FnY21WMGRYSnVJSGR5WVhCd1pXUWdkbUZzZFdWeklIZG9aVzRnWUc1Z0lHbHpYRzRnSUNBcUlIQmhjM05sWkN3Z2IzUm9aWEozYVhObElIUm9aWGtnY21WMGRYSnVJSFZ1ZDNKaGNIQmxaQ0IyWVd4MVpYTXVYRzRnSUNBcVhHNGdJQ0FxSUVCdVlXMWxJRjljYmlBZ0lDb2dRR052Ym5OMGNuVmpkRzl5WEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JEYUdGcGJtbHVaMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwMXBlR1ZrZlNCMllXeDFaU0JVYUdVZ2RtRnNkV1VnZEc4Z2QzSmhjQ0JwYmlCaElHQnNiMlJoYzJoZ0lHbHVjM1JoYm1ObExseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1QySnFaV04wZlNCU1pYUjFjbTV6SUdFZ1lHeHZaR0Z6YUdBZ2FXNXpkR0Z1WTJVdVhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQnNiMlJoYzJnb2RtRnNkV1VwSUh0Y2JpQWdJQ0F2THlCbGVHbDBJR1ZoY214NUlHbG1JR0ZzY21WaFpIa2dkM0poY0hCbFpDd2daWFpsYmlCcFppQjNjbUZ3Y0dWa0lHSjVJR0VnWkdsbVptVnlaVzUwSUdCc2IyUmhjMmhnSUdOdmJuTjBjblZqZEc5eVhHNGdJQ0FnYVdZZ0tIWmhiSFZsSUNZbUlIUjVjR1Z2WmlCMllXeDFaU0E5UFNBbmIySnFaV04wSnlBbUppQjJZV3gxWlM1ZlgzZHlZWEJ3WldSZlh5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIWmhiSFZsTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJoYkd4dmR5QnBiblp2YTJsdVp5QmdiRzlrWVhOb1lDQjNhWFJvYjNWMElIUm9aU0JnYm1WM1lDQnZjR1Z5WVhSdmNseHVJQ0FnSUdsbUlDZ2hLSFJvYVhNZ2FXNXpkR0Z1WTJWdlppQnNiMlJoYzJncEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2JtVjNJR3h2WkdGemFDaDJZV3gxWlNrN1hHNGdJQ0FnZlZ4dUlDQWdJSFJvYVhNdVgxOTNjbUZ3Y0dWa1gxOGdQU0IyWVd4MVpUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJDZVNCa1pXWmhkV3gwTENCMGFHVWdkR1Z0Y0d4aGRHVWdaR1ZzYVcxcGRHVnljeUIxYzJWa0lHSjVJRXh2TFVSaGMyZ2dZWEpsSUhOcGJXbHNZWElnZEc4Z2RHaHZjMlVnYVc1Y2JpQWdJQ29nWlcxaVpXUmtaV1FnVW5WaWVTQW9SVkpDS1M0Z1EyaGhibWRsSUhSb1pTQm1iMnhzYjNkcGJtY2dkR1Z0Y0d4aGRHVWdjMlYwZEdsdVozTWdkRzhnZFhObElHRnNkR1Z5Ym1GMGFYWmxYRzRnSUNBcUlHUmxiR2x0YVhSbGNuTXVYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRSFI1Y0dVZ1QySnFaV04wWEc0Z0lDQXFMMXh1SUNCc2IyUmhjMmd1ZEdWdGNHeGhkR1ZUWlhSMGFXNW5jeUE5SUh0Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGVnpaV1FnZEc4Z1pHVjBaV04wSUdCa1lYUmhZQ0J3Y205d1pYSjBlU0IyWVd4MVpYTWdkRzhnWW1VZ1NGUk5UQzFsYzJOaGNHVmtMbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRRzFsYldKbGNrOW1JRjh1ZEdWdGNHeGhkR1ZUWlhSMGFXNW5jMXh1SUNBZ0lDQXFJRUIwZVhCbElGSmxaMFY0Y0Z4dUlDQWdJQ0FxTDF4dUlDQWdJQ2RsYzJOaGNHVW5PaUF2UENVdEtGdGNYSE5jWEZOZEt6OHBKVDR2Wnl4Y2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGVnpaV1FnZEc4Z1pHVjBaV04wSUdOdlpHVWdkRzhnWW1VZ1pYWmhiSFZoZEdWa0xseHVJQ0FnSUNBcVhHNGdJQ0FnSUNvZ1FHMWxiV0psY2s5bUlGOHVkR1Z0Y0d4aGRHVlRaWFIwYVc1bmMxeHVJQ0FnSUNBcUlFQjBlWEJsSUZKbFowVjRjRnh1SUNBZ0lDQXFMMXh1SUNBZ0lDZGxkbUZzZFdGMFpTYzZJQzg4SlNoYlhGeHpYRnhUWFNzL0tTVStMMmNzWEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCVmMyVmtJSFJ2SUdSbGRHVmpkQ0JnWkdGMFlXQWdjSEp2Y0dWeWRIa2dkbUZzZFdWeklIUnZJR2x1YW1WamRDNWNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQnRaVzFpWlhKUFppQmZMblJsYlhCc1lYUmxVMlYwZEdsdVozTmNiaUFnSUNBZ0tpQkFkSGx3WlNCU1pXZEZlSEJjYmlBZ0lDQWdLaTljYmlBZ0lDQW5hVzUwWlhKd2IyeGhkR1VuT2lCeVpVbHVkR1Z5Y0c5c1lYUmxMRnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVlhObFpDQjBieUJ5WldabGNtVnVZMlVnZEdobElHUmhkR0VnYjJKcVpXTjBJR2x1SUhSb1pTQjBaVzF3YkdGMFpTQjBaWGgwTGx4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUcxbGJXSmxjazltSUY4dWRHVnRjR3hoZEdWVFpYUjBhVzVuYzF4dUlDQWdJQ0FxSUVCMGVYQmxJRk4wY21sdVoxeHVJQ0FnSUNBcUwxeHVJQ0FnSUNkMllYSnBZV0pzWlNjNklDY25MRnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVlhObFpDQjBieUJwYlhCdmNuUWdkbUZ5YVdGaWJHVnpJR2x1ZEc4Z2RHaGxJR052YlhCcGJHVmtJSFJsYlhCc1lYUmxMbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRRzFsYldKbGNrOW1JRjh1ZEdWdGNHeGhkR1ZUWlhSMGFXNW5jMXh1SUNBZ0lDQXFJRUIwZVhCbElFOWlhbVZqZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJQ2RwYlhCdmNuUnpKem9nZTF4dVhHNGdJQ0FnSUNBdktpcGNiaUFnSUNBZ0lDQXFJRUVnY21WbVpYSmxibU5sSUhSdklIUm9aU0JnYkc5a1lYTm9ZQ0JtZFc1amRHbHZiaTVjYmlBZ0lDQWdJQ0FxWEc0Z0lDQWdJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1h5NTBaVzF3YkdGMFpWTmxkSFJwYm1kekxtbHRjRzl5ZEhOY2JpQWdJQ0FnSUNBcUlFQjBlWEJsSUVaMWJtTjBhVzl1WEc0Z0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUNkZkp6b2diRzlrWVhOb1hHNGdJQ0FnZlZ4dUlDQjlPMXh1WEc0Z0lDOHFMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzBxTDF4dVhHNGdJQzhxS2x4dUlDQWdLaUJVYUdVZ2RHVnRjR3hoZEdVZ2RYTmxaQ0IwYnlCamNtVmhkR1VnYVhSbGNtRjBiM0lnWm5WdVkzUnBiMjV6TGx4dUlDQWdLbHh1SUNBZ0tpQkFjSEpwZG1GMFpWeHVJQ0FnS2lCQWNHRnlZVzBnZTA5aVpXTjBmU0JrWVhSaElGUm9aU0JrWVhSaElHOWlhbVZqZENCMWMyVmtJSFJ2SUhCdmNIVnNZWFJsSUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3VTNSeWFXNW5mU0JTWlhSMWNtNXpJSFJvWlNCcGJuUmxjbkJ2YkdGMFpXUWdkR1Y0ZEM1Y2JpQWdJQ292WEc0Z0lIWmhjaUJwZEdWeVlYUnZjbFJsYlhCc1lYUmxJRDBnWm5WdVkzUnBiMjRvYjJKcUtTQjdYRzRnSUNBZ1hHNGdJQ0FnZG1GeUlGOWZjQ0E5SUNkMllYSWdhVzVrWlhnc0lHbDBaWEpoWW14bElEMGdKeUFyWEc0Z0lDQWdLRzlpYWk1bWFYSnpkRUZ5WnlBcElDdGNiaUFnSUNBbkxDQnlaWE4xYkhRZ1BTQnBkR1Z5WVdKc1pUdGNYRzVwWmlBb0lXbDBaWEpoWW14bEtTQnlaWFIxY200Z2NtVnpkV3gwTzF4Y2JpY2dLMXh1SUNBZ0lDaHZZbW91ZEc5d0lDa2dLMXh1SUNBZ0lDYzdYRnh1Snp0Y2JpQWdJQ0FnYVdZZ0tHOWlhaTVoY25KaGVYTXBJSHRjYmlBZ0lDQmZYM0FnS3owZ0ozWmhjaUJzWlc1bmRHZ2dQU0JwZEdWeVlXSnNaUzVzWlc1bmRHZzdJR2x1WkdWNElEMGdMVEU3WEZ4dWFXWWdLQ2NnSzF4dUlDQWdJQ2h2WW1vdVlYSnlZWGx6SUNrZ0sxeHVJQ0FnSUNjcElIdGNYRzRnSUhkb2FXeGxJQ2dySzJsdVpHVjRJRHdnYkdWdVozUm9LU0I3WEZ4dUlDQWdJQ2NnSzF4dUlDQWdJQ2h2WW1vdWJHOXZjQ0FwSUN0Y2JpQWdJQ0FuWEZ4dUlDQjlYRnh1ZlZ4Y2JtVnNjMlVnZXlBZ0p6dGNiaUFnSUNBZ2ZTQTdYRzRnSUNBZ1hHNGdJQ0FnSUdsbUlDaHZZbW91YVhOTFpYbHpSbUZ6ZENBbUppQnZZbW91ZFhObFNHRnpLU0I3WEc0Z0lDQWdYMTl3SUNzOUlDZGNYRzRnSUhaaGNpQnZkMjVKYm1SbGVDQTlJQzB4TEZ4Y2JpQWdJQ0FnSUc5M2JsQnliM0J6SUQwZ2IySnFaV04wVkhsd1pYTmJkSGx3Wlc5bUlHbDBaWEpoWW14bFhTQS9JRzVoZEdsMlpVdGxlWE1vYVhSbGNtRmliR1VwSURvZ1cxMHNYRnh1SUNBZ0lDQWdiR1Z1WjNSb0lEMGdiM2R1VUhKdmNITXViR1Z1WjNSb08xeGNibHhjYmlBZ2QyaHBiR1VnS0NzcmIzZHVTVzVrWlhnZ1BDQnNaVzVuZEdncElIdGNYRzRnSUNBZ2FXNWtaWGdnUFNCdmQyNVFjbTl3YzF0dmQyNUpibVJsZUYwN1hGeHVJQ0FnSUNjZ0sxeHVJQ0FnSUNodlltb3ViRzl2Y0NBcElDdGNiaUFnSUNBblhGeHVJQ0I5SUNBbk8xeHVJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJRjlmY0NBclBTQW5YRnh1SUNCbWIzSWdLR2x1WkdWNElHbHVJR2wwWlhKaFlteGxLU0I3Snp0Y2JpQWdJQ0FnSUNBZ2FXWWdLRzlpYWk1MWMyVklZWE1wSUh0Y2JpQWdJQ0JmWDNBZ0t6MGdKMXhjYmlBZ0lDQnBaaUFvSnp0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYjJKcUxuVnpaVWhoY3lrZ2UxeHVJQ0FnSUY5ZmNDQXJQU0FuYUdGelQzZHVVSEp2Y0dWeWRIa3VZMkZzYkNocGRHVnlZV0pzWlN3Z2FXNWtaWGdwSnp0Y2JpQWdJQ0FnZlNBZ0lDQTdYRzRnSUNBZ1gxOXdJQ3M5SUNjcElIc2dJQ0FnSnp0Y2JpQWdJQ0FnZlNBN1hHNGdJQ0FnWDE5d0lDczlJRnh1SUNBZ0lDaHZZbW91Ykc5dmNDQXBJQ3RjYmlBZ0lDQW5PeUFnSUNBbk8xeHVJQ0FnSUNCcFppQW9iMkpxTG5WelpVaGhjeWtnZTF4dUlDQWdJRjlmY0NBclBTQW5YRnh1SUNBZ0lIMG5PMXh1SUNBZ0lDQjlJRHRjYmlBZ0lDQmZYM0FnS3owZ0oxeGNiaUFnZlNBZ0p6dGNiaUFnSUNBZ2ZTQTdYRzRnSUNBZ1hHNGdJQ0FnSUdsbUlDaHZZbW91WVhKeVlYbHpLU0I3WEc0Z0lDQWdYMTl3SUNzOUlDZGNYRzU5Snp0Y2JpQWdJQ0FnZlNBN1hHNGdJQ0FnWDE5d0lDczlJRnh1SUNBZ0lDaHZZbW91WW05MGRHOXRJQ2tnSzF4dUlDQWdJQ2M3WEZ4dWNtVjBkWEp1SUhKbGMzVnNkQ2M3WEc0Z0lDQWdYRzRnSUNBZ1hHNGdJQ0FnY21WMGRYSnVJRjlmY0Z4dUlDQjlPMXh1WEc0Z0lDOHFLaUJTWlhWellXSnNaU0JwZEdWeVlYUnZjaUJ2Y0hScGIyNXpJR1p2Y2lCZ1lYTnphV2R1WUNCaGJtUWdZR1JsWm1GMWJIUnpZQ0FxTDF4dUlDQjJZWElnWkdWbVlYVnNkSE5KZEdWeVlYUnZjazl3ZEdsdmJuTWdQU0I3WEc0Z0lDQWdKMkZ5WjNNbk9pQW5iMkpxWldOMExDQnpiM1Z5WTJVc0lHZDFZWEprSnl4Y2JpQWdJQ0FuZEc5d0p6cGNiaUFnSUNBZ0lDZDJZWElnWVhKbmN5QTlJR0Z5WjNWdFpXNTBjeXhjWEc0bklDdGNiaUFnSUNBZ0lDY2dJQ0FnWVhKbmMwbHVaR1Y0SUQwZ01DeGNYRzRuSUN0Y2JpQWdJQ0FnSUZ3aUlDQWdJR0Z5WjNOTVpXNW5kR2dnUFNCMGVYQmxiMllnWjNWaGNtUWdQVDBnSjI1MWJXSmxjaWNnUHlBeUlEb2dZWEpuY3k1c1pXNW5kR2c3WEZ4dVhDSWdLMXh1SUNBZ0lDQWdKM2RvYVd4bElDZ3JLMkZ5WjNOSmJtUmxlQ0E4SUdGeVozTk1aVzVuZEdncElIdGNYRzRuSUN0Y2JpQWdJQ0FnSUNjZ0lHbDBaWEpoWW14bElEMGdZWEpuYzF0aGNtZHpTVzVrWlhoZE8xeGNiaWNnSzF4dUlDQWdJQ0FnSnlBZ2FXWWdLR2wwWlhKaFlteGxJQ1ltSUc5aWFtVmpkRlI1Y0dWelczUjVjR1Z2WmlCcGRHVnlZV0pzWlYwcElIc25MRnh1SUNBZ0lDZHNiMjl3SnpvZ1hDSnBaaUFvZEhsd1pXOW1JSEpsYzNWc2RGdHBibVJsZUYwZ1BUMGdKM1Z1WkdWbWFXNWxaQ2NwSUhKbGMzVnNkRnRwYm1SbGVGMGdQU0JwZEdWeVlXSnNaVnRwYm1SbGVGMWNJaXhjYmlBZ0lDQW5ZbTkwZEc5dEp6b2dKeUFnZlZ4Y2JuMG5YRzRnSUgwN1hHNWNiaUFnTHlvcUlGSmxkWE5oWW14bElHbDBaWEpoZEc5eUlHOXdkR2x2Ym5NZ2MyaGhjbVZrSUdKNUlHQmxZV05vWUN3Z1lHWnZja2x1WUN3Z1lXNWtJR0JtYjNKUGQyNWdJQ292WEc0Z0lIWmhjaUJsWVdOb1NYUmxjbUYwYjNKUGNIUnBiMjV6SUQwZ2UxeHVJQ0FnSUNkaGNtZHpKem9nSjJOdmJHeGxZM1JwYjI0c0lHTmhiR3hpWVdOckxDQjBhR2x6UVhKbkp5eGNiaUFnSUNBbmRHOXdKem9nWENKallXeHNZbUZqYXlBOUlHTmhiR3hpWVdOcklDWW1JSFI1Y0dWdlppQjBhR2x6UVhKbklEMDlJQ2QxYm1SbFptbHVaV1FuSUQ4Z1kyRnNiR0poWTJzZ09pQmpjbVZoZEdWRFlXeHNZbUZqYXloallXeHNZbUZqYXl3Z2RHaHBjMEZ5WnlsY0lpeGNiaUFnSUNBbllYSnlZWGx6SnpvZ1hDSjBlWEJsYjJZZ2JHVnVaM1JvSUQwOUlDZHVkVzFpWlhJblhDSXNYRzRnSUNBZ0oyeHZiM0FuT2lBbmFXWWdLR05oYkd4aVlXTnJLR2wwWlhKaFlteGxXMmx1WkdWNFhTd2dhVzVrWlhnc0lHTnZiR3hsWTNScGIyNHBJRDA5UFNCbVlXeHpaU2tnY21WMGRYSnVJSEpsYzNWc2RDZGNiaUFnZlR0Y2JseHVJQ0F2S2lvZ1VtVjFjMkZpYkdVZ2FYUmxjbUYwYjNJZ2IzQjBhVzl1Y3lCbWIzSWdZR1p2Y2tsdVlDQmhibVFnWUdadmNrOTNibUFnS2k5Y2JpQWdkbUZ5SUdadmNrOTNia2wwWlhKaGRHOXlUM0IwYVc5dWN5QTlJSHRjYmlBZ0lDQW5kRzl3SnpvZ0oybG1JQ2doYjJKcVpXTjBWSGx3WlhOYmRIbHdaVzltSUdsMFpYSmhZbXhsWFNrZ2NtVjBkWEp1SUhKbGMzVnNkRHRjWEc0bklDc2daV0ZqYUVsMFpYSmhkRzl5VDNCMGFXOXVjeTUwYjNBc1hHNGdJQ0FnSjJGeWNtRjVjeWM2SUdaaGJITmxYRzRnSUgwN1hHNWNiaUFnTHlvdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTb3ZYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTnlaV0YwWlhNZ1lTQm1kVzVqZEdsdmJpQnZjSFJwYldsNlpXUWdkRzhnYzJWaGNtTm9JR3hoY21kbElHRnljbUY1Y3lCbWIzSWdZU0JuYVhabGJpQmdkbUZzZFdWZ0xGeHVJQ0FnS2lCemRHRnlkR2x1WnlCaGRDQmdabkp2YlVsdVpHVjRZQ3dnZFhOcGJtY2djM1J5YVdOMElHVnhkV0ZzYVhSNUlHWnZjaUJqYjIxd1lYSnBjMjl1Y3l3Z2FTNWxMaUJnUFQwOVlDNWNiaUFnSUNwY2JpQWdJQ29nUUhCeWFYWmhkR1ZjYmlBZ0lDb2dRSEJoY21GdElIdEJjbkpoZVgwZ1lYSnlZWGtnVkdobElHRnljbUY1SUhSdklITmxZWEpqYUM1Y2JpQWdJQ29nUUhCaGNtRnRJSHROYVhobFpIMGdkbUZzZFdVZ1ZHaGxJSFpoYkhWbElIUnZJSE5sWVhKamFDQm1iM0l1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUblZ0WW1WeWZTQmJabkp2YlVsdVpHVjRQVEJkSUZSb1pTQnBibVJsZUNCMGJ5QnpaV0Z5WTJnZ1puSnZiUzVjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlGdHNZWEpuWlZOcGVtVTlNekJkSUZSb1pTQnNaVzVuZEdnZ1lYUWdkMmhwWTJnZ1lXNGdZWEp5WVhrZ2FYTWdZMjl1YzJsa1pYSmxaQ0JzWVhKblpTNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwSnZiMnhsWVc1OUlGSmxkSFZ5Ym5NZ1lIUnlkV1ZnTENCcFppQmdkbUZzZFdWZ0lHbHpJR1p2ZFc1a0xDQmxiSE5sSUdCbVlXeHpaV0F1WEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCallXTm9aV1JEYjI1MFlXbHVjeWhoY25KaGVTd2dabkp2YlVsdVpHVjRMQ0JzWVhKblpWTnBlbVVwSUh0Y2JpQWdJQ0JtY205dFNXNWtaWGdnZkh3Z0tHWnliMjFKYm1SbGVDQTlJREFwTzF4dVhHNGdJQ0FnZG1GeUlHeGxibWQwYUNBOUlHRnljbUY1TG14bGJtZDBhQ3hjYmlBZ0lDQWdJQ0FnYVhOTVlYSm5aU0E5SUNoc1pXNW5kR2dnTFNCbWNtOXRTVzVrWlhncElENDlJQ2hzWVhKblpWTnBlbVVnZkh3Z2JHRnlaMlZCY25KaGVWTnBlbVVwTzF4dVhHNGdJQ0FnYVdZZ0tHbHpUR0Z5WjJVcElIdGNiaUFnSUNBZ0lIWmhjaUJqWVdOb1pTQTlJSHQ5TEZ4dUlDQWdJQ0FnSUNBZ0lHbHVaR1Y0SUQwZ1puSnZiVWx1WkdWNElDMGdNVHRjYmx4dUlDQWdJQ0FnZDJocGJHVWdLQ3NyYVc1a1pYZ2dQQ0JzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnTHk4Z2JXRnVkV0ZzYkhrZ1kyOWxjbU5sSUdCMllXeDFaV0FnZEc4Z1lTQnpkSEpwYm1jZ1ltVmpZWFZ6WlNCZ2FHRnpUM2R1VUhKdmNHVnlkSGxnTENCcGJpQnpiMjFsWEc0Z0lDQWdJQ0FnSUM4dklHOXNaR1Z5SUhabGNuTnBiMjV6SUc5bUlFWnBjbVZtYjNnc0lHTnZaWEpqWlhNZ2IySnFaV04wY3lCcGJtTnZjbkpsWTNSc2VWeHVJQ0FnSUNBZ0lDQjJZWElnYTJWNUlEMGdZWEp5WVhsYmFXNWtaWGhkSUNzZ0p5YzdYRzRnSUNBZ0lDQWdJQ2hvWVhOUGQyNVFjbTl3WlhKMGVTNWpZV3hzS0dOaFkyaGxMQ0JyWlhrcElEOGdZMkZqYUdWYmEyVjVYU0E2SUNoallXTm9aVnRyWlhsZElEMGdXMTBwS1M1d2RYTm9LR0Z5Y21GNVcybHVaR1Y0WFNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQm1kVzVqZEdsdmJpaDJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ2FXWWdLR2x6VEdGeVoyVXBJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlHdGxlU0E5SUhaaGJIVmxJQ3NnSnljN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCb1lYTlBkMjVRY205d1pYSjBlUzVqWVd4c0tHTmhZMmhsTENCclpYa3BJQ1ltSUdsdVpHVjRUMllvWTJGamFHVmJhMlY1WFN3Z2RtRnNkV1VwSUQ0Z0xURTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnlaWFIxY200Z2FXNWtaWGhQWmloaGNuSmhlU3dnZG1Gc2RXVXNJR1p5YjIxSmJtUmxlQ2tnUGlBdE1UdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dWWE5sWkNCaWVTQmdYeTV0WVhoZ0lHRnVaQ0JnWHk1dGFXNWdJR0Z6SUhSb1pTQmtaV1poZFd4MElHQmpZV3hzWW1GamEyQWdkMmhsYmlCaElHZHBkbVZ1WEc0Z0lDQXFJR0JqYjJ4c1pXTjBhVzl1WUNCcGN5QmhJSE4wY21sdVp5QjJZV3gxWlM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUhaaGJIVmxJRlJvWlNCamFHRnlZV04wWlhJZ2RHOGdhVzV6Y0dWamRDNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwNTFiV0psY24wZ1VtVjBkWEp1Y3lCMGFHVWdZMjlrWlNCMWJtbDBJRzltSUdkcGRtVnVJR05vWVhKaFkzUmxjaTVjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUdOb1lYSkJkRU5oYkd4aVlXTnJLSFpoYkhWbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhaaGJIVmxMbU5vWVhKRGIyUmxRWFFvTUNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dWWE5sWkNCaWVTQmdjMjl5ZEVKNVlDQjBieUJqYjIxd1lYSmxJSFJ5WVc1elptOXliV1ZrSUdCamIyeHNaV04wYVc5dVlDQjJZV3gxWlhNc0lITjBZV0pzWlNCemIzSjBhVzVuWEc0Z0lDQXFJSFJvWlcwZ2FXNGdZWE5qWlc1a2FXNW5JRzl5WkdWeUxseHVJQ0FnS2x4dUlDQWdLaUJBY0hKcGRtRjBaVnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ1lTQlVhR1VnYjJKcVpXTjBJSFJ2SUdOdmJYQmhjbVVnZEc4Z1lHSmdMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ1lpQlVhR1VnYjJKcVpXTjBJSFJ2SUdOdmJYQmhjbVVnZEc4Z1lHRmdMbHh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdUblZ0WW1WeWZTQlNaWFIxY201eklIUm9aU0J6YjNKMElHOXlaR1Z5SUdsdVpHbGpZWFJ2Y2lCdlppQmdNV0FnYjNJZ1lDMHhZQzVjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUdOdmJYQmhjbVZCYzJObGJtUnBibWNvWVN3Z1lpa2dlMXh1SUNBZ0lIWmhjaUJoYVNBOUlHRXVhVzVrWlhnc1hHNGdJQ0FnSUNBZ0lHSnBJRDBnWWk1cGJtUmxlRHRjYmx4dUlDQWdJR0VnUFNCaExtTnlhWFJsY21saE8xeHVJQ0FnSUdJZ1BTQmlMbU55YVhSbGNtbGhPMXh1WEc0Z0lDQWdMeThnWlc1emRYSmxJR0VnYzNSaFlteGxJSE52Y25RZ2FXNGdWamdnWVc1a0lHOTBhR1Z5SUdWdVoybHVaWE5jYmlBZ0lDQXZMeUJvZEhSd09pOHZZMjlrWlM1bmIyOW5iR1V1WTI5dEwzQXZkamd2YVhOemRXVnpMMlJsZEdGcGJEOXBaRDA1TUZ4dUlDQWdJR2xtSUNoaElDRTlQU0JpS1NCN1hHNGdJQ0FnSUNCcFppQW9ZU0ErSUdJZ2ZId2dkSGx3Wlc5bUlHRWdQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlERTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnBaaUFvWVNBOElHSWdmSHdnZEhsd1pXOW1JR0lnUFQwZ0ozVnVaR1ZtYVc1bFpDY3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJQzB4TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ0lDQnlaWFIxY200Z1lXa2dQQ0JpYVNBL0lDMHhJRG9nTVR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRjbVZoZEdWeklHRWdablZ1WTNScGIyNGdkR2hoZEN3Z2QyaGxiaUJqWVd4c1pXUXNJR2x1ZG05clpYTWdZR1oxYm1OZ0lIZHBkR2dnZEdobElHQjBhR2x6WUNCaWFXNWthVzVuWEc0Z0lDQXFJRzltSUdCMGFHbHpRWEpuWUNCaGJtUWdjSEpsY0dWdVpITWdZVzU1SUdCd1lYSjBhV0ZzUVhKbmMyQWdkRzhnZEdobElHRnlaM1Z0Wlc1MGN5QndZWE56WldRZ2RHOGdkR2hsWEc0Z0lDQXFJR0p2ZFc1a0lHWjFibU4wYVc5dUxseHVJQ0FnS2x4dUlDQWdLaUJBY0hKcGRtRjBaVnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwWjFibU4wYVc5dWZGTjBjbWx1WjMwZ1puVnVZeUJVYUdVZ1puVnVZM1JwYjI0Z2RHOGdZbWx1WkNCdmNpQjBhR1VnYldWMGFHOWtJRzVoYldVdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VFdsNFpXUjlJRnQwYUdselFYSm5YU0JVYUdVZ1lIUm9hWE5nSUdKcGJtUnBibWNnYjJZZ1lHWjFibU5nTGx4dUlDQWdLaUJBY0dGeVlXMGdlMEZ5Y21GNWZTQndZWEowYVdGc1FYSm5jeUJCYmlCaGNuSmhlU0J2WmlCaGNtZDFiV1Z1ZEhNZ2RHOGdZbVVnY0dGeWRHbGhiR3g1SUdGd2NHeHBaV1F1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQmJjbWxuYUhSSmJtUnBZMkYwYjNKZElGVnpaV1FnZEc4Z2FXNWthV05oZEdVZ2NHRnlkR2xoYkd4NUlHRndjR3g1YVc1bklHRnlaM1Z0Wlc1MGN5Qm1jbTl0SUhSb1pTQnlhV2RvZEM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBaMWJtTjBhVzl1ZlNCU1pYUjFjbTV6SUhSb1pTQnVaWGNnWW05MWJtUWdablZ1WTNScGIyNHVYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJqY21WaGRHVkNiM1Z1WkNobWRXNWpMQ0IwYUdselFYSm5MQ0J3WVhKMGFXRnNRWEpuY3l3Z2NtbG5hSFJKYm1ScFkyRjBiM0lwSUh0Y2JpQWdJQ0IyWVhJZ2FYTkdkVzVqSUQwZ2FYTkdkVzVqZEdsdmJpaG1kVzVqS1N4Y2JpQWdJQ0FnSUNBZ2FYTlFZWEowYVdGc0lEMGdJWEJoY25ScFlXeEJjbWR6TEZ4dUlDQWdJQ0FnSUNCclpYa2dQU0IwYUdselFYSm5PMXh1WEc0Z0lDQWdMeThnYW5WbloyeGxJR0Z5WjNWdFpXNTBjMXh1SUNBZ0lHbG1JQ2hwYzFCaGNuUnBZV3dwSUh0Y2JpQWdJQ0FnSUhCaGNuUnBZV3hCY21keklEMGdkR2hwYzBGeVp6dGNiaUFnSUNCOVhHNGdJQ0FnYVdZZ0tDRnBjMFoxYm1NcElIdGNiaUFnSUNBZ0lIUm9hWE5CY21jZ1BTQm1kVzVqTzF4dUlDQWdJSDFjYmx4dUlDQWdJR1oxYm1OMGFXOXVJR0p2ZFc1a0tDa2dlMXh1SUNBZ0lDQWdMeThnWUVaMWJtTjBhVzl1STJKcGJtUmdJSE53WldOY2JpQWdJQ0FnSUM4dklHaDBkSEE2THk5bGN6VXVaMmwwYUhWaUxtTnZiUzhqZURFMUxqTXVOQzQxWEc0Z0lDQWdJQ0IyWVhJZ1lYSm5jeUE5SUdGeVozVnRaVzUwY3l4Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6UW1sdVpHbHVaeUE5SUdselVHRnlkR2xoYkNBL0lIUm9hWE1nT2lCMGFHbHpRWEpuTzF4dVhHNGdJQ0FnSUNCcFppQW9JV2x6Um5WdVl5a2dlMXh1SUNBZ0lDQWdJQ0JtZFc1aklEMGdkR2hwYzBGeVoxdHJaWGxkTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnYVdZZ0tIQmhjblJwWVd4QmNtZHpMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0JoY21keklEMGdZWEpuY3k1c1pXNW5kR2hjYmlBZ0lDQWdJQ0FnSUNBL0lDaGhjbWR6SUQwZ2MyeHBZMlVvWVhKbmN5a3NJSEpwWjJoMFNXNWthV05oZEc5eUlEOGdZWEpuY3k1amIyNWpZWFFvY0dGeWRHbGhiRUZ5WjNNcElEb2djR0Z5ZEdsaGJFRnlaM011WTI5dVkyRjBLR0Z5WjNNcEtWeHVJQ0FnSUNBZ0lDQWdJRG9nY0dGeWRHbGhiRUZ5WjNNN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCcFppQW9kR2hwY3lCcGJuTjBZVzVqWlc5bUlHSnZkVzVrS1NCN1hHNGdJQ0FnSUNBZ0lDOHZJR1Z1YzNWeVpTQmdibVYzSUdKdmRXNWtZQ0JwY3lCaGJpQnBibk4wWVc1alpTQnZaaUJnWW05MWJtUmdJR0Z1WkNCZ1puVnVZMkJjYmlBZ0lDQWdJQ0FnYm05dmNDNXdjbTkwYjNSNWNHVWdQU0JtZFc1akxuQnliM1J2ZEhsd1pUdGNiaUFnSUNBZ0lDQWdkR2hwYzBKcGJtUnBibWNnUFNCdVpYY2dibTl2Y0R0Y2JpQWdJQ0FnSUNBZ2JtOXZjQzV3Y205MGIzUjVjR1VnUFNCdWRXeHNPMXh1WEc0Z0lDQWdJQ0FnSUM4dklHMXBiV2xqSUhSb1pTQmpiMjV6ZEhKMVkzUnZjaWR6SUdCeVpYUjFjbTVnSUdKbGFHRjJhVzl5WEc0Z0lDQWdJQ0FnSUM4dklHaDBkSEE2THk5bGN6VXVaMmwwYUhWaUxtTnZiUzhqZURFekxqSXVNbHh1SUNBZ0lDQWdJQ0IyWVhJZ2NtVnpkV3gwSUQwZ1puVnVZeTVoY0hCc2VTaDBhR2x6UW1sdVpHbHVaeXdnWVhKbmN5azdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnBjMDlpYW1WamRDaHlaWE4xYkhRcElEOGdjbVZ6ZFd4MElEb2dkR2hwYzBKcGJtUnBibWM3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdablZ1WXk1aGNIQnNlU2gwYUdselFtbHVaR2x1Wnl3Z1lYSm5jeWs3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCaWIzVnVaRHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCUWNtOWtkV05sY3lCaElHTmhiR3hpWVdOcklHSnZkVzVrSUhSdklHRnVJRzl3ZEdsdmJtRnNJR0IwYUdselFYSm5ZQzRnU1dZZ1lHWjFibU5nSUdseklHRWdjSEp2Y0dWeWRIbGNiaUFnSUNvZ2JtRnRaU3dnZEdobElHTnlaV0YwWldRZ1kyRnNiR0poWTJzZ2QybHNiQ0J5WlhSMWNtNGdkR2hsSUhCeWIzQmxjblI1SUhaaGJIVmxJR1p2Y2lCaElHZHBkbVZ1SUdWc1pXMWxiblF1WEc0Z0lDQXFJRWxtSUdCbWRXNWpZQ0JwY3lCaGJpQnZZbXBsWTNRc0lIUm9aU0JqY21WaGRHVmtJR05oYkd4aVlXTnJJSGRwYkd3Z2NtVjBkWEp1SUdCMGNuVmxZQ0JtYjNJZ1pXeGxiV1Z1ZEhOY2JpQWdJQ29nZEdoaGRDQmpiMjUwWVdsdUlIUm9aU0JsY1hWcGRtRnNaVzUwSUc5aWFtVmpkQ0J3Y205d1pYSjBhV1Z6TENCdmRHaGxjbmRwYzJVZ2FYUWdkMmxzYkNCeVpYUjFjbTRnWUdaaGJITmxZQzVjYmlBZ0lDcGNiaUFnSUNvZ1FIQnlhWFpoZEdWY2JpQWdJQ29nUUhCaGNtRnRJSHROYVhobFpIMGdXMloxYm1NOWFXUmxiblJwZEhsZElGUm9aU0IyWVd4MVpTQjBieUJqYjI1MlpYSjBJSFJ2SUdFZ1kyRnNiR0poWTJzdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VFdsNFpXUjlJRnQwYUdselFYSm5YU0JVYUdVZ1lIUm9hWE5nSUdKcGJtUnBibWNnYjJZZ2RHaGxJR055WldGMFpXUWdZMkZzYkdKaFkyc3VYRzRnSUNBcUlFQndZWEpoYlNCN1RuVnRZbVZ5ZlNCYllYSm5RMjkxYm5ROU0xMGdWR2hsSUc1MWJXSmxjaUJ2WmlCaGNtZDFiV1Z1ZEhNZ2RHaGxJR05oYkd4aVlXTnJJR0ZqWTJWd2RITXVYRzRnSUNBcUlFQnlaWFIxY201eklIdEdkVzVqZEdsdmJuMGdVbVYwZFhKdWN5QmhJR05oYkd4aVlXTnJJR1oxYm1OMGFXOXVMbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnWTNKbFlYUmxRMkZzYkdKaFkyc29ablZ1WXl3Z2RHaHBjMEZ5Wnl3Z1lYSm5RMjkxYm5RcElIdGNiaUFnSUNCcFppQW9ablZ1WXlBOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYVdSbGJuUnBkSGs3WEc0Z0lDQWdmVnh1SUNBZ0lIWmhjaUIwZVhCbElEMGdkSGx3Wlc5bUlHWjFibU03WEc0Z0lDQWdhV1lnS0hSNWNHVWdJVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFI1Y0dVZ0lUMGdKMjlpYW1WamRDY3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1oxYm1OMGFXOXVLRzlpYW1WamRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJ2WW1wbFkzUmJablZ1WTEwN1hHNGdJQ0FnSUNBZ0lIMDdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQjJZWElnY0hKdmNITWdQU0JyWlhsektHWjFibU1wTzF4dUlDQWdJQ0FnY21WMGRYSnVJR1oxYm1OMGFXOXVLRzlpYW1WamRDa2dlMXh1SUNBZ0lDQWdJQ0IyWVhJZ2JHVnVaM1JvSUQwZ2NISnZjSE11YkdWdVozUm9MRnh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVnpkV3gwSUQwZ1ptRnNjMlU3WEc0Z0lDQWdJQ0FnSUhkb2FXeGxJQ2hzWlc1bmRHZ3RMU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2doS0hKbGMzVnNkQ0E5SUdselJYRjFZV3dvYjJKcVpXTjBXM0J5YjNCelcyeGxibWQwYUYxZExDQm1kVzVqVzNCeWIzQnpXMnhsYm1kMGFGMWRMQ0JwYm1ScFkyRjBiM0pQWW1wbFkzUXBLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUNBZ0lDQjlPMXh1SUNBZ0lIMWNiaUFnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE5CY21jZ0lUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdJQ0FnSUdsbUlDaGhjbWREYjNWdWRDQTlQVDBnTVNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1puVnVZM1JwYjI0b2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1puVnVZeTVqWVd4c0tIUm9hWE5CY21jc0lIWmhiSFZsS1R0Y2JpQWdJQ0FnSUNBZ2ZUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbG1JQ2hoY21kRGIzVnVkQ0E5UFQwZ01pa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdablZ1WTNScGIyNG9ZU3dnWWlrZ2UxeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQm1kVzVqTG1OaGJHd29kR2hwYzBGeVp5d2dZU3dnWWlrN1hHNGdJQ0FnSUNBZ0lIMDdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnBaaUFvWVhKblEyOTFiblFnUFQwOUlEUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1oxYm1OMGFXOXVLR0ZqWTNWdGRXeGhkRzl5TENCMllXeDFaU3dnYVc1a1pYZ3NJRzlpYW1WamRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtZFc1akxtTmhiR3dvZEdocGMwRnlaeXdnWVdOamRXMTFiR0YwYjNJc0lIWmhiSFZsTENCcGJtUmxlQ3dnYjJKcVpXTjBLVHRjYmlBZ0lDQWdJQ0FnZlR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhKbGRIVnliaUJtZFc1amRHbHZiaWgyWVd4MVpTd2dhVzVrWlhnc0lHOWlhbVZqZENrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1puVnVZeTVqWVd4c0tIUm9hWE5CY21jc0lIWmhiSFZsTENCcGJtUmxlQ3dnYjJKcVpXTjBLVHRjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCbWRXNWpPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVOeVpXRjBaWE1nWTI5dGNHbHNaV1FnYVhSbGNtRjBhVzl1SUdaMWJtTjBhVzl1Y3k1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUZ0dmNIUnBiMjV6TVN3Z2IzQjBhVzl1Y3pJc0lDNHVMbDBnVkdobElHTnZiWEJwYkdVZ2IzQjBhVzl1Y3lCdlltcGxZM1FvY3lrdVhHNGdJQ0FxSUNCaGNuSmhlWE1nTFNCQklITjBjbWx1WnlCdlppQmpiMlJsSUhSdklHUmxkR1Z5YldsdVpTQnBaaUIwYUdVZ2FYUmxjbUZpYkdVZ2FYTWdZVzRnWVhKeVlYa2diM0lnWVhKeVlYa3RiR2xyWlM1Y2JpQWdJQ29nSUhWelpVaGhjeUF0SUVFZ1ltOXZiR1ZoYmlCMGJ5QnpjR1ZqYVdaNUlIVnphVzVuSUdCb1lYTlBkMjVRY205d1pYSjBlV0FnWTJobFkydHpJR2x1SUhSb1pTQnZZbXBsWTNRZ2JHOXZjQzVjYmlBZ0lDb2dJR0Z5WjNNZ0xTQkJJSE4wY21sdVp5QnZaaUJqYjIxdFlTQnpaWEJoY21GMFpXUWdZWEpuZFcxbGJuUnpJSFJvWlNCcGRHVnlZWFJwYjI0Z1puVnVZM1JwYjI0Z2QybHNiQ0JoWTJObGNIUXVYRzRnSUNBcUlDQjBiM0FnTFNCQklITjBjbWx1WnlCdlppQmpiMlJsSUhSdklHVjRaV04xZEdVZ1ltVm1iM0psSUhSb1pTQnBkR1Z5WVhScGIyNGdZbkpoYm1Ob1pYTXVYRzRnSUNBcUlDQnNiMjl3SUMwZ1FTQnpkSEpwYm1jZ2IyWWdZMjlrWlNCMGJ5QmxlR1ZqZFhSbElHbHVJSFJvWlNCdlltcGxZM1FnYkc5dmNDNWNiaUFnSUNvZ0lHSnZkSFJ2YlNBdElFRWdjM1J5YVc1bklHOW1JR052WkdVZ2RHOGdaWGhsWTNWMFpTQmhablJsY2lCMGFHVWdhWFJsY21GMGFXOXVJR0p5WVc1amFHVnpMbHh1SUNBZ0tseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1JuVnVZM1JwYjI1OUlGSmxkSFZ5Ym5NZ2RHaGxJR052YlhCcGJHVmtJR1oxYm1OMGFXOXVMbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnWTNKbFlYUmxTWFJsY21GMGIzSW9LU0I3WEc0Z0lDQWdkbUZ5SUdSaGRHRWdQU0I3WEc0Z0lDQWdJQ0F2THlCemRYQndiM0owSUhCeWIzQmxjblJwWlhOY2JpQWdJQ0FnSUNkcGMwdGxlWE5HWVhOMEp6b2dhWE5MWlhselJtRnpkQ3hjYmx4dUlDQWdJQ0FnTHk4Z2FYUmxjbUYwYjNJZ2IzQjBhVzl1YzF4dUlDQWdJQ0FnSjJGeWNtRjVjeWM2SUNkcGMwRnljbUY1S0dsMFpYSmhZbXhsS1Njc1hHNGdJQ0FnSUNBblltOTBkRzl0SnpvZ0p5Y3NYRzRnSUNBZ0lDQW5iRzl2Y0NjNklDY25MRnh1SUNBZ0lDQWdKM1J2Y0NjNklDY25MRnh1SUNBZ0lDQWdKM1Z6WlVoaGN5YzZJSFJ5ZFdWY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnTHk4Z2JXVnlaMlVnYjNCMGFXOXVjeUJwYm5SdklHRWdkR1Z0Y0d4aGRHVWdaR0YwWVNCdlltcGxZM1JjYmlBZ0lDQm1iM0lnS0haaGNpQnZZbXBsWTNRc0lHbHVaR1Y0SUQwZ01Ec2diMkpxWldOMElEMGdZWEpuZFcxbGJuUnpXMmx1WkdWNFhUc2dhVzVrWlhnckt5a2dlMXh1SUNBZ0lDQWdabTl5SUNoMllYSWdhMlY1SUdsdUlHOWlhbVZqZENrZ2UxeHVJQ0FnSUNBZ0lDQmtZWFJoVzJ0bGVWMGdQU0J2WW1wbFkzUmJhMlY1WFR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lDQWdkbUZ5SUdGeVozTWdQU0JrWVhSaExtRnlaM003WEc0Z0lDQWdaR0YwWVM1bWFYSnpkRUZ5WnlBOUlDOWVXMTRzWFNzdkxtVjRaV01vWVhKbmN5bGJNRjA3WEc1Y2JpQWdJQ0F2THlCamNtVmhkR1VnZEdobElHWjFibU4wYVc5dUlHWmhZM1J2Y25sY2JpQWdJQ0IyWVhJZ1ptRmpkRzl5ZVNBOUlFWjFibU4wYVc5dUtGeHVJQ0FnSUNBZ0lDQW5ZM0psWVhSbFEyRnNiR0poWTJzc0lHaGhjMDkzYmxCeWIzQmxjblI1TENCcGMwRnlaM1Z0Wlc1MGN5d2dhWE5CY25KaGVTd2dhWE5UZEhKcGJtY3NJQ2NnSzF4dUlDQWdJQ0FnSUNBbmIySnFaV04wVkhsd1pYTXNJRzVoZEdsMlpVdGxlWE1uTEZ4dUlDQWdJQ0FnSjNKbGRIVnliaUJtZFc1amRHbHZiaWduSUNzZ1lYSm5jeUFySUNjcElIdGNYRzRuSUNzZ2FYUmxjbUYwYjNKVVpXMXdiR0YwWlNoa1lYUmhLU0FySUNkY1hHNTlKMXh1SUNBZ0lDazdYRzRnSUNBZ0x5OGdjbVYwZFhKdUlIUm9aU0JqYjIxd2FXeGxaQ0JtZFc1amRHbHZibHh1SUNBZ0lISmxkSFZ5YmlCbVlXTjBiM0o1S0Z4dUlDQWdJQ0FnWTNKbFlYUmxRMkZzYkdKaFkyc3NJR2hoYzA5M2JsQnliM0JsY25SNUxDQnBjMEZ5WjNWdFpXNTBjeXdnYVhOQmNuSmhlU3dnYVhOVGRISnBibWNzWEc0Z0lDQWdJQ0J2WW1wbFkzUlVlWEJsY3l3Z2JtRjBhWFpsUzJWNWMxeHVJQ0FnSUNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRU0JtZFc1amRHbHZiaUJqYjIxd2FXeGxaQ0IwYnlCcGRHVnlZWFJsSUdCaGNtZDFiV1Z1ZEhOZ0lHOWlhbVZqZEhNc0lHRnljbUY1Y3l3Z2IySnFaV04wY3l3Z1lXNWtYRzRnSUNBcUlITjBjbWx1WjNNZ1kyOXVjMmx6ZEdWdWJIa2dZV055YjNOeklHVnVkbWx5YjI1dFpXNTBjeXdnWlhobFkzVjBhVzVuSUhSb1pTQmdZMkZzYkdKaFkydGdJR1p2Y2lCbFlXTm9YRzRnSUNBcUlHVnNaVzFsYm5RZ2FXNGdkR2hsSUdCamIyeHNaV04wYVc5dVlDNGdWR2hsSUdCallXeHNZbUZqYTJBZ2FYTWdZbTkxYm1RZ2RHOGdZSFJvYVhOQmNtZGdJR0Z1WkNCcGJuWnZhMlZrWEc0Z0lDQXFJSGRwZEdnZ2RHaHlaV1VnWVhKbmRXMWxiblJ6T3lBb2RtRnNkV1VzSUdsdVpHVjRmR3RsZVN3Z1kyOXNiR1ZqZEdsdmJpa3VJRU5oYkd4aVlXTnJjeUJ0WVhrZ1pYaHBkRnh1SUNBZ0tpQnBkR1Z5WVhScGIyNGdaV0Z5YkhrZ1lua2daWGh3YkdsamFYUnNlU0J5WlhSMWNtNXBibWNnWUdaaGJITmxZQzVjYmlBZ0lDcGNiaUFnSUNvZ1FIQnlhWFpoZEdWY2JpQWdJQ29nUUhSNWNHVWdSblZ1WTNScGIyNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0QmNuSmhlWHhQWW1wbFkzUjhVM1J5YVc1bmZTQmpiMnhzWldOMGFXOXVJRlJvWlNCamIyeHNaV04wYVc5dUlIUnZJR2wwWlhKaGRHVWdiM1psY2k1Y2JpQWdJQ29nUUhCaGNtRnRJSHRHZFc1amRHbHZibjBnVzJOaGJHeGlZV05yUFdsa1pXNTBhWFI1WFNCVWFHVWdablZ1WTNScGIyNGdZMkZzYkdWa0lIQmxjaUJwZEdWeVlYUnBiMjR1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUV2w0WldSOUlGdDBhR2x6UVhKblhTQlVhR1VnWUhSb2FYTmdJR0pwYm1ScGJtY2diMllnWUdOaGJHeGlZV05yWUM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBGeWNtRjVmRTlpYW1WamRIeFRkSEpwYm1kOUlGSmxkSFZ5Ym5NZ1lHTnZiR3hsWTNScGIyNWdMbHh1SUNBZ0tpOWNiaUFnZG1GeUlHVmhZMmdnUFNCamNtVmhkR1ZKZEdWeVlYUnZjaWhsWVdOb1NYUmxjbUYwYjNKUGNIUnBiMjV6S1R0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nVlhObFpDQmllU0JnZEdWdGNHeGhkR1ZnSUhSdklHVnpZMkZ3WlNCamFHRnlZV04wWlhKeklHWnZjaUJwYm1Oc2RYTnBiMjRnYVc0Z1kyOXRjR2xzWldSY2JpQWdJQ29nYzNSeWFXNW5JR3hwZEdWeVlXeHpMbHh1SUNBZ0tseHVJQ0FnS2lCQWNISnBkbUYwWlZ4dUlDQWdLaUJBY0dGeVlXMGdlMU4wY21sdVozMGdiV0YwWTJnZ1ZHaGxJRzFoZEdOb1pXUWdZMmhoY21GamRHVnlJSFJ2SUdWelkyRndaUzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMU4wY21sdVozMGdVbVYwZFhKdWN5QjBhR1VnWlhOallYQmxaQ0JqYUdGeVlXTjBaWEl1WEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCbGMyTmhjR1ZUZEhKcGJtZERhR0Z5S0cxaGRHTm9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDZGNYRnhjSnlBcklITjBjbWx1WjBWelkyRndaWE5iYldGMFkyaGRPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZWelpXUWdZbmtnWUdWelkyRndaV0FnZEc4Z1kyOXVkbVZ5ZENCamFHRnlZV04wWlhKeklIUnZJRWhVVFV3Z1pXNTBhWFJwWlhNdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3Y21sMllYUmxYRzRnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCdFlYUmphQ0JVYUdVZ2JXRjBZMmhsWkNCamFHRnlZV04wWlhJZ2RHOGdaWE5qWVhCbExseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1UzUnlhVzVuZlNCU1pYUjFjbTV6SUhSb1pTQmxjMk5oY0dWa0lHTm9ZWEpoWTNSbGNpNWNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJR1Z6WTJGd1pVaDBiV3hEYUdGeUtHMWhkR05vS1NCN1hHNGdJQ0FnY21WMGRYSnVJR2gwYld4RmMyTmhjR1Z6VzIxaGRHTm9YVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCRGFHVmphM01nYVdZZ1lIWmhiSFZsWUNCcGN5QmhJRVJQVFNCdWIyUmxJR2x1SUVsRklEd2dPUzVjYmlBZ0lDcGNiaUFnSUNvZ1FIQnlhWFpoZEdWY2JpQWdJQ29nUUhCaGNtRnRJSHROYVhobFpIMGdkbUZzZFdVZ1ZHaGxJSFpoYkhWbElIUnZJR05vWldOckxseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1FtOXZiR1ZoYm4wZ1VtVjBkWEp1Y3lCZ2RISjFaV0FnYVdZZ2RHaGxJR0IyWVd4MVpXQWdhWE1nWVNCRVQwMGdibTlrWlN3Z1pXeHpaU0JnWm1Gc2MyVmdMbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnYVhOT2IyUmxLSFpoYkhWbEtTQjdYRzRnSUNBZ0x5OGdTVVVnUENBNUlIQnlaWE5sYm5SeklFUlBUU0J1YjJSbGN5QmhjeUJnVDJKcVpXTjBZQ0J2WW1wbFkzUnpJR1Y0WTJWd2RDQjBhR1Y1SUdoaGRtVWdZSFJ2VTNSeWFXNW5ZRnh1SUNBZ0lDOHZJRzFsZEdodlpITWdkR2hoZENCaGNtVWdZSFI1Y0dWdlptQWdYQ0p6ZEhKcGJtZGNJaUJoYm1RZ2MzUnBiR3dnWTJGdUlHTnZaWEpqWlNCdWIyUmxjeUIwYnlCemRISnBibWR6WEc0Z0lDQWdjbVYwZFhKdUlIUjVjR1Z2WmlCMllXeDFaUzUwYjFOMGNtbHVaeUFoUFNBblpuVnVZM1JwYjI0bklDWW1JSFI1Y0dWdlppQW9kbUZzZFdVZ0t5QW5KeWtnUFQwZ0ozTjBjbWx1WnljN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRU0J1YnkxdmNHVnlZWFJwYjI0Z1puVnVZM1JwYjI0dVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3Y21sMllYUmxYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJ1YjI5d0tDa2dlMXh1SUNBZ0lDOHZJRzV2SUc5d1pYSmhkR2x2YmlCd1pYSm1iM0p0WldSY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlRiR2xqWlhNZ2RHaGxJR0JqYjJ4c1pXTjBhVzl1WUNCbWNtOXRJSFJvWlNCZ2MzUmhjblJnSUdsdVpHVjRJSFZ3SUhSdkxDQmlkWFFnYm05MElHbHVZMngxWkdsdVp5eGNiaUFnSUNvZ2RHaGxJR0JsYm1SZ0lHbHVaR1Y0TGx4dUlDQWdLbHh1SUNBZ0tpQk9iM1JsT2lCVWFHbHpJR1oxYm1OMGFXOXVJR2x6SUhWelpXUXNJR2x1YzNSbFlXUWdiMllnWUVGeWNtRjVJM05zYVdObFlDd2dkRzhnYzNWd2NHOXlkQ0J1YjJSbElHeHBjM1J6WEc0Z0lDQXFJR2x1SUVsRklEd2dPU0JoYm1RZ2RHOGdaVzV6ZFhKbElHUmxibk5sSUdGeWNtRjVjeUJoY21VZ2NtVjBkWEp1WldRdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ3Y21sMllYUmxYRzRnSUNBcUlFQndZWEpoYlNCN1FYSnlZWGw4VDJKcVpXTjBmRk4wY21sdVozMGdZMjlzYkdWamRHbHZiaUJVYUdVZ1kyOXNiR1ZqZEdsdmJpQjBieUJ6YkdsalpTNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUhOMFlYSjBJRlJvWlNCemRHRnlkQ0JwYm1SbGVDNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUdWdVpDQlVhR1VnWlc1a0lHbHVaR1Y0TGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UVhKeVlYbDlJRkpsZEhWeWJuTWdkR2hsSUc1bGR5QmhjbkpoZVM1Y2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlITnNhV05sS0dGeWNtRjVMQ0J6ZEdGeWRDd2daVzVrS1NCN1hHNGdJQ0FnYzNSaGNuUWdmSHdnS0hOMFlYSjBJRDBnTUNrN1hHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCbGJtUWdQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNiaUFnSUNBZ0lHVnVaQ0E5SUdGeWNtRjVJRDhnWVhKeVlYa3ViR1Z1WjNSb0lEb2dNRHRjYmlBZ0lDQjlYRzRnSUNBZ2RtRnlJR2x1WkdWNElEMGdMVEVzWEc0Z0lDQWdJQ0FnSUd4bGJtZDBhQ0E5SUdWdVpDQXRJSE4wWVhKMElIeDhJREFzWEc0Z0lDQWdJQ0FnSUhKbGMzVnNkQ0E5SUVGeWNtRjVLR3hsYm1kMGFDQThJREFnUHlBd0lEb2diR1Z1WjNSb0tUdGNibHh1SUNBZ0lIZG9hV3hsSUNncksybHVaR1Y0SUR3Z2JHVnVaM1JvS1NCN1hHNGdJQ0FnSUNCeVpYTjFiSFJiYVc1a1pYaGRJRDBnWVhKeVlYbGJjM1JoY25RZ0t5QnBibVJsZUYwN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnlaWE4xYkhRN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dWWE5sWkNCaWVTQmdkVzVsYzJOaGNHVmdJSFJ2SUdOdmJuWmxjblFnU0ZSTlRDQmxiblJwZEdsbGN5QjBieUJqYUdGeVlXTjBaWEp6TGx4dUlDQWdLbHh1SUNBZ0tpQkFjSEpwZG1GMFpWeHVJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnYldGMFkyZ2dWR2hsSUcxaGRHTm9aV1FnWTJoaGNtRmpkR1Z5SUhSdklIVnVaWE5qWVhCbExseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1UzUnlhVzVuZlNCU1pYUjFjbTV6SUhSb1pTQjFibVZ6WTJGd1pXUWdZMmhoY21GamRHVnlMbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnZFc1bGMyTmhjR1ZJZEcxc1EyaGhjaWh0WVhSamFDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCb2RHMXNWVzVsYzJOaGNHVnpXMjFoZEdOb1hUdGNiaUFnZlZ4dVhHNGdJQzhxTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwcUwxeHVYRzRnSUM4cUtseHVJQ0FnS2lCRGFHVmphM01nYVdZZ1lIWmhiSFZsWUNCcGN5QmhiaUJnWVhKbmRXMWxiblJ6WUNCdlltcGxZM1F1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUU5aWFtVmpkSE5jYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ2RtRnNkV1VnVkdobElIWmhiSFZsSUhSdklHTm9aV05yTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQXNJR2xtSUhSb1pTQmdkbUZzZFdWZ0lHbHpJR0Z1SUdCaGNtZDFiV1Z1ZEhOZ0lHOWlhbVZqZEN3Z1pXeHpaU0JnWm1Gc2MyVmdMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUFvWm5WdVkzUnBiMjRvS1NCN0lISmxkSFZ5YmlCZkxtbHpRWEpuZFcxbGJuUnpLR0Z5WjNWdFpXNTBjeWs3SUgwcEtERXNJRElzSURNcE8xeHVJQ0FnS2lBdkx5QTlQaUIwY25WbFhHNGdJQ0FxWEc0Z0lDQXFJRjh1YVhOQmNtZDFiV1Z1ZEhNb1d6RXNJRElzSUROZEtUdGNiaUFnSUNvZ0x5OGdQVDRnWm1Gc2MyVmNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJR2x6UVhKbmRXMWxiblJ6S0haaGJIVmxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUnZVM1J5YVc1bkxtTmhiR3dvZG1Gc2RXVXBJRDA5SUdGeVozTkRiR0Z6Y3p0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkpkR1Z5WVhSbGN5QnZkbVZ5SUdCdlltcGxZM1JnSjNNZ2IzZHVJR0Z1WkNCcGJtaGxjbWwwWldRZ1pXNTFiV1Z5WVdKc1pTQndjbTl3WlhKMGFXVnpMQ0JsZUdWamRYUnBibWRjYmlBZ0lDb2dkR2hsSUdCallXeHNZbUZqYTJBZ1ptOXlJR1ZoWTJnZ2NISnZjR1Z5ZEhrdUlGUm9aU0JnWTJGc2JHSmhZMnRnSUdseklHSnZkVzVrSUhSdklHQjBhR2x6UVhKbllDQmhibVJjYmlBZ0lDb2dhVzUyYjJ0bFpDQjNhWFJvSUhSb2NtVmxJR0Z5WjNWdFpXNTBjenNnS0haaGJIVmxMQ0JyWlhrc0lHOWlhbVZqZENrdUlFTmhiR3hpWVdOcmN5QnRZWGtnWlhocGRDQnBkR1Z5WVhScGIyNWNiaUFnSUNvZ1pXRnliSGtnWW5rZ1pYaHdiR2xqYVhSc2VTQnlaWFIxY201cGJtY2dZR1poYkhObFlDNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFkSGx3WlNCR2RXNWpkR2x2Ymx4dUlDQWdLaUJBWTJGMFpXZHZjbmtnVDJKcVpXTjBjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ2IySnFaV04wSUZSb1pTQnZZbXBsWTNRZ2RHOGdhWFJsY21GMFpTQnZkbVZ5TGx4dUlDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0JiWTJGc2JHSmhZMnM5YVdSbGJuUnBkSGxkSUZSb1pTQm1kVzVqZEdsdmJpQmpZV3hzWldRZ2NHVnlJR2wwWlhKaGRHbHZiaTVjYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ1czUm9hWE5CY21kZElGUm9aU0JnZEdocGMyQWdZbWx1WkdsdVp5QnZaaUJnWTJGc2JHSmhZMnRnTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3VDJKcVpXTjBmU0JTWlhSMWNtNXpJR0J2WW1wbFkzUmdMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUJtZFc1amRHbHZiaUJFYjJjb2JtRnRaU2tnZTF4dUlDQWdLaUFnSUhSb2FYTXVibUZ0WlNBOUlHNWhiV1U3WEc0Z0lDQXFJSDFjYmlBZ0lDcGNiaUFnSUNvZ1JHOW5MbkJ5YjNSdmRIbHdaUzVpWVhKcklEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQXFJQ0FnWVd4bGNuUW9KMWR2YjJZc0lIZHZiMlloSnlrN1hHNGdJQ0FxSUgwN1hHNGdJQ0FxWEc0Z0lDQXFJRjh1Wm05eVNXNG9ibVYzSUVSdlp5Z25SR0ZuYm5rbktTd2dablZ1WTNScGIyNG9kbUZzZFdVc0lHdGxlU2tnZTF4dUlDQWdLaUFnSUdGc1pYSjBLR3RsZVNrN1hHNGdJQ0FxSUgwcE8xeHVJQ0FnS2lBdkx5QTlQaUJoYkdWeWRITWdKMjVoYldVbklHRnVaQ0FuWW1GeWF5Y2dLRzl5WkdWeUlHbHpJRzV2ZENCbmRXRnlZVzUwWldWa0tWeHVJQ0FnS2k5Y2JpQWdkbUZ5SUdadmNrbHVJRDBnWTNKbFlYUmxTWFJsY21GMGIzSW9aV0ZqYUVsMFpYSmhkRzl5VDNCMGFXOXVjeXdnWm05eVQzZHVTWFJsY21GMGIzSlBjSFJwYjI1ekxDQjdYRzRnSUNBZ0ozVnpaVWhoY3ljNklHWmhiSE5sWEc0Z0lIMHBPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkpkR1Z5WVhSbGN5QnZkbVZ5SUdGdUlHOWlhbVZqZENkeklHOTNiaUJsYm5WdFpYSmhZbXhsSUhCeWIzQmxjblJwWlhNc0lHVjRaV04xZEdsdVp5QjBhR1VnWUdOaGJHeGlZV05yWUZ4dUlDQWdLaUJtYjNJZ1pXRmphQ0J3Y205d1pYSjBlUzRnVkdobElHQmpZV3hzWW1GamEyQWdhWE1nWW05MWJtUWdkRzhnWUhSb2FYTkJjbWRnSUdGdVpDQnBiblp2YTJWa0lIZHBkR2dnZEdoeVpXVmNiaUFnSUNvZ1lYSm5kVzFsYm5Sek95QW9kbUZzZFdVc0lHdGxlU3dnYjJKcVpXTjBLUzRnUTJGc2JHSmhZMnR6SUcxaGVTQmxlR2wwSUdsMFpYSmhkR2x2YmlCbFlYSnNlU0JpZVNCbGVIQnNhV05wZEd4NVhHNGdJQ0FxSUhKbGRIVnlibWx1WnlCZ1ptRnNjMlZnTGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCMGVYQmxJRVoxYm1OMGFXOXVYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQlBZbXBsWTNSelhHNGdJQ0FxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0J2WW1wbFkzUWdWR2hsSUc5aWFtVmpkQ0IwYnlCcGRHVnlZWFJsSUc5MlpYSXVYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlGdGpZV3hzWW1GamF6MXBaR1Z1ZEdsMGVWMGdWR2hsSUdaMWJtTjBhVzl1SUdOaGJHeGxaQ0J3WlhJZ2FYUmxjbUYwYVc5dUxseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0JiZEdocGMwRnlaMTBnVkdobElHQjBhR2x6WUNCaWFXNWthVzVuSUc5bUlHQmpZV3hzWW1GamEyQXVYRzRnSUNBcUlFQnlaWFIxY201eklIdFBZbXBsWTNSOUlGSmxkSFZ5Ym5NZ1lHOWlhbVZqZEdBdVhHNGdJQ0FxSUVCbGVHRnRjR3hsWEc0Z0lDQXFYRzRnSUNBcUlGOHVabTl5VDNkdUtIc2dKekFuT2lBbmVtVnlieWNzSUNjeEp6b2dKMjl1WlNjc0lDZHNaVzVuZEdnbk9pQXlJSDBzSUdaMWJtTjBhVzl1S0c1MWJTd2dhMlY1S1NCN1hHNGdJQ0FxSUNBZ1lXeGxjblFvYTJWNUtUdGNiaUFnSUNvZ2ZTazdYRzRnSUNBcUlDOHZJRDArSUdGc1pYSjBjeUFuTUNjc0lDY3hKeXdnWVc1a0lDZHNaVzVuZEdnbklDaHZjbVJsY2lCcGN5QnViM1FnWjNWaGNtRnVkR1ZsWkNsY2JpQWdJQ292WEc0Z0lIWmhjaUJtYjNKUGQyNGdQU0JqY21WaGRHVkpkR1Z5WVhSdmNpaGxZV05vU1hSbGNtRjBiM0pQY0hScGIyNXpMQ0JtYjNKUGQyNUpkR1Z5WVhSdmNrOXdkR2x2Ym5NcE8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCRGFHVmphM01nYVdZZ1lIWmhiSFZsWUNCcGN5QmhiaUJoY25KaGVTNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dUMkpxWldOMGMxeHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0IyWVd4MVpTQlVhR1VnZG1Gc2RXVWdkRzhnWTJobFkyc3VYRzRnSUNBcUlFQnlaWFIxY201eklIdENiMjlzWldGdWZTQlNaWFIxY201eklHQjBjblZsWUN3Z2FXWWdkR2hsSUdCMllXeDFaV0FnYVhNZ1lXNGdZWEp5WVhrc0lHVnNjMlVnWUdaaGJITmxZQzVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nS0daMWJtTjBhVzl1S0NrZ2V5QnlaWFIxY200Z1h5NXBjMEZ5Y21GNUtHRnlaM1Z0Wlc1MGN5azdJSDBwS0NrN1hHNGdJQ0FxSUM4dklEMCtJR1poYkhObFhHNGdJQ0FxWEc0Z0lDQXFJRjh1YVhOQmNuSmhlU2hiTVN3Z01pd2dNMTBwTzF4dUlDQWdLaUF2THlBOVBpQjBjblZsWEc0Z0lDQXFMMXh1SUNCMllYSWdhWE5CY25KaGVTQTlJRzVoZEdsMlpVbHpRWEp5WVhrZ2ZId2dablZ1WTNScGIyNG9kbUZzZFdVcElIdGNiaUFnSUNBdkx5QmdhVzV6ZEdGdVkyVnZabUFnYldGNUlHTmhkWE5sSUdFZ2JXVnRiM0o1SUd4bFlXc2dhVzRnU1VVZ055QnBaaUJnZG1Gc2RXVmdJR2x6SUdFZ2FHOXpkQ0J2WW1wbFkzUmNiaUFnSUNBdkx5Qm9kSFJ3T2k4dllXcGhlR2xoYmk1amIyMHZZWEpqYUdsMlpYTXZkMjl5YTJsdVp5MWhjbTkxYm1jdGRHaGxMV2x1YzNSaGJtTmxiMll0YldWdGIzSjVMV3hsWVd0Y2JpQWdJQ0J5WlhSMWNtNGdkbUZzZFdVZ2FXNXpkR0Z1WTJWdlppQkJjbkpoZVNCOGZDQjBiMU4wY21sdVp5NWpZV3hzS0haaGJIVmxLU0E5UFNCaGNuSmhlVU5zWVhOek8xeHVJQ0I5TzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJEY21WaGRHVnpJR0Z1SUdGeWNtRjVJR052YlhCdmMyVmtJRzltSUhSb1pTQnZkMjRnWlc1MWJXVnlZV0pzWlNCd2NtOXdaWEowZVNCdVlXMWxjeUJ2WmlCZ2IySnFaV04wWUM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1QySnFaV04wYzF4dUlDQWdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdiMkpxWldOMElGUm9aU0J2WW1wbFkzUWdkRzhnYVc1emNHVmpkQzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMEZ5Y21GNWZTQlNaWFIxY201eklHRWdibVYzSUdGeWNtRjVJRzltSUhCeWIzQmxjblI1SUc1aGJXVnpMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUJmTG10bGVYTW9leUFuYjI1bEp6b2dNU3dnSjNSM2J5YzZJRElzSUNkMGFISmxaU2M2SURNZ2ZTazdYRzRnSUNBcUlDOHZJRDArSUZzbmIyNWxKeXdnSjNSM2J5Y3NJQ2QwYUhKbFpTZGRJQ2h2Y21SbGNpQnBjeUJ1YjNRZ1ozVmhjbUZ1ZEdWbFpDbGNiaUFnSUNvdlhHNGdJSFpoY2lCclpYbHpJRDBnSVc1aGRHbDJaVXRsZVhNZ1B5QnphR2x0UzJWNWN5QTZJR1oxYm1OMGFXOXVLRzlpYW1WamRDa2dlMXh1SUNBZ0lHbG1JQ2doYVhOUFltcGxZM1FvYjJKcVpXTjBLU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRnRkTzF4dUlDQWdJSDFjYmlBZ0lDQnlaWFIxY200Z2JtRjBhWFpsUzJWNWN5aHZZbXBsWTNRcE8xeHVJQ0I5TzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJCSUdaaGJHeGlZV05ySUdsdGNHeGxiV1Z1ZEdGMGFXOXVJRzltSUdCcGMxQnNZV2x1VDJKcVpXTjBZQ0IwYUdGMElHTm9aV05yY3lCcFppQmhJR2RwZG1WdUlHQjJZV3gxWldCY2JpQWdJQ29nYVhNZ1lXNGdiMkpxWldOMElHTnlaV0YwWldRZ1lua2dkR2hsSUdCUFltcGxZM1JnSUdOdmJuTjBjblZqZEc5eUxDQmhjM04xYldsdVp5QnZZbXBsWTNSeklHTnlaV0YwWldSY2JpQWdJQ29nWW5rZ2RHaGxJR0JQWW1wbFkzUmdJR052Ym5OMGNuVmpkRzl5SUdoaGRtVWdibThnYVc1b1pYSnBkR1ZrSUdWdWRXMWxjbUZpYkdVZ2NISnZjR1Z5ZEdsbGN5QmhibVFnZEdoaGRGeHVJQ0FnS2lCMGFHVnlaU0JoY21VZ2JtOGdZRTlpYW1WamRDNXdjbTkwYjNSNWNHVmdJR1Y0ZEdWdWMybHZibk11WEc0Z0lDQXFYRzRnSUNBcUlFQndjbWwyWVhSbFhHNGdJQ0FxSUVCd1lYSmhiU0I3VFdsNFpXUjlJSFpoYkhWbElGUm9aU0IyWVd4MVpTQjBieUJqYUdWamF5NWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwSnZiMnhsWVc1OUlGSmxkSFZ5Ym5NZ1lIUnlkV1ZnTENCcFppQmdkbUZzZFdWZ0lHbHpJR0VnY0d4aGFXNGdiMkpxWldOMExDQmxiSE5sSUdCbVlXeHpaV0F1WEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCemFHbHRTWE5RYkdGcGJrOWlhbVZqZENoMllXeDFaU2tnZTF4dUlDQWdJQzh2SUdGMmIybGtJRzV2YmkxdlltcGxZM1J6SUdGdVpDQm1ZV3h6WlNCd2IzTnBkR2wyWlhNZ1ptOXlJR0JoY21kMWJXVnVkSE5nSUc5aWFtVmpkSE5jYmlBZ0lDQjJZWElnY21WemRXeDBJRDBnWm1Gc2MyVTdYRzRnSUNBZ2FXWWdLQ0VvZG1Gc2RXVWdKaVlnZEhsd1pXOW1JSFpoYkhWbElEMDlJQ2R2WW1wbFkzUW5LU0I4ZkNCcGMwRnlaM1Z0Wlc1MGN5aDJZV3gxWlNrcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJR05vWldOcklIUm9ZWFFnZEdobElHTnZibk4wY25WamRHOXlJR2x6SUdCUFltcGxZM1JnSUNocExtVXVJR0JQWW1wbFkzUWdhVzV6ZEdGdVkyVnZaaUJQWW1wbFkzUmdLVnh1SUNBZ0lIWmhjaUJqZEc5eUlEMGdkbUZzZFdVdVkyOXVjM1J5ZFdOMGIzSTdYRzRnSUNBZ2FXWWdLQ2doYVhOR2RXNWpkR2x2YmloamRHOXlLU2tnZkh3Z1kzUnZjaUJwYm5OMFlXNWpaVzltSUdOMGIzSXBJSHRjYmlBZ0lDQWdJQzh2SUVsdUlHMXZjM1FnWlc1MmFYSnZibTFsYm5SeklHRnVJRzlpYW1WamRDZHpJRzkzYmlCd2NtOXdaWEowYVdWeklHRnlaU0JwZEdWeVlYUmxaQ0JpWldadmNtVmNiaUFnSUNBZ0lDOHZJR2wwY3lCcGJtaGxjbWwwWldRZ2NISnZjR1Z5ZEdsbGN5NGdTV1lnZEdobElHeGhjM1FnYVhSbGNtRjBaV1FnY0hKdmNHVnlkSGtnYVhNZ1lXNGdiMkpxWldOMEozTmNiaUFnSUNBZ0lDOHZJRzkzYmlCd2NtOXdaWEowZVNCMGFHVnVJSFJvWlhKbElHRnlaU0J1YnlCcGJtaGxjbWwwWldRZ1pXNTFiV1Z5WVdKc1pTQndjbTl3WlhKMGFXVnpMbHh1SUNBZ0lDQWdabTl5U1c0b2RtRnNkV1VzSUdaMWJtTjBhVzl1S0haaGJIVmxMQ0JyWlhrcElIdGNiaUFnSUNBZ0lDQWdjbVZ6ZFd4MElEMGdhMlY1TzF4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNCeVpYUjFjbTRnY21WemRXeDBJRDA5UFNCbVlXeHpaU0I4ZkNCb1lYTlBkMjVRY205d1pYSjBlUzVqWVd4c0tIWmhiSFZsTENCeVpYTjFiSFFwTzF4dUlDQWdJSDFjYmlBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFRWdabUZzYkdKaFkyc2dhVzF3YkdWdFpXNTBZWFJwYjI0Z2IyWWdZRTlpYW1WamRDNXJaWGx6WUNCMGFHRjBJSEJ5YjJSMVkyVnpJR0Z1SUdGeWNtRjVJRzltSUhSb1pWeHVJQ0FnS2lCbmFYWmxiaUJ2WW1wbFkzUW5jeUJ2ZDI0Z1pXNTFiV1Z5WVdKc1pTQndjbTl3WlhKMGVTQnVZVzFsY3k1Y2JpQWdJQ3BjYmlBZ0lDb2dRSEJ5YVhaaGRHVmNiaUFnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUc5aWFtVmpkQ0JVYUdVZ2IySnFaV04wSUhSdklHbHVjM0JsWTNRdVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0QmNuSmhlWDBnVW1WMGRYSnVjeUJoSUc1bGR5QmhjbkpoZVNCdlppQndjbTl3WlhKMGVTQnVZVzFsY3k1Y2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlITm9hVzFMWlhsektHOWlhbVZqZENrZ2UxeHVJQ0FnSUhaaGNpQnlaWE4xYkhRZ1BTQmJYVHRjYmlBZ0lDQm1iM0pQZDI0b2IySnFaV04wTENCbWRXNWpkR2x2YmloMllXeDFaU3dnYTJWNUtTQjdYRzRnSUNBZ0lDQnlaWE4xYkhRdWNIVnphQ2hyWlhrcE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVlhObFpDQjBieUJqYjI1MlpYSjBJR05vWVhKaFkzUmxjbk1nZEc4Z1NGUk5UQ0JsYm5ScGRHbGxjenBjYmlBZ0lDcGNiaUFnSUNvZ1ZHaHZkV2RvSUhSb1pTQmdQbUFnWTJoaGNtRmpkR1Z5SUdseklHVnpZMkZ3WldRZ1ptOXlJSE41YlcxbGRISjVMQ0JqYUdGeVlXTjBaWEp6SUd4cGEyVWdZRDVnSUdGdVpDQmdMMkJjYmlBZ0lDb2daRzl1SjNRZ2NtVnhkV2x5WlNCbGMyTmhjR2x1WnlCcGJpQklWRTFNSUdGdVpDQm9ZWFpsSUc1dklITndaV05wWVd3Z2JXVmhibWx1WnlCMWJteGxjM01nZEdobGVTZHlaU0J3WVhKMFhHNGdJQ0FxSUc5bUlHRWdkR0ZuSUc5eUlHRnVJSFZ1Y1hWdmRHVmtJR0YwZEhKcFluVjBaU0IyWVd4MVpTNWNiaUFnSUNvZ2FIUjBjRG92TDIxaGRHaHBZWE5pZVc1bGJuTXVZbVV2Ym05MFpYTXZZVzFpYVdkMWIzVnpMV0Z0Y0dWeWMyRnVaSE1nS0hWdVpHVnlJRndpYzJWdGFTMXlaV3hoZEdWa0lHWjFiaUJtWVdOMFhDSXBYRzRnSUNBcUwxeHVJQ0IyWVhJZ2FIUnRiRVZ6WTJGd1pYTWdQU0I3WEc0Z0lDQWdKeVluT2lBbkptRnRjRHNuTEZ4dUlDQWdJQ2M4SnpvZ0p5WnNkRHNuTEZ4dUlDQWdJQ2MrSnpvZ0p5Wm5kRHNuTEZ4dUlDQWdJQ2RjSWljNklDY21jWFZ2ZERzbkxGeHVJQ0FnSUZ3aUoxd2lPaUFuSmlNek9Uc25YRzRnSUgwN1hHNWNiaUFnTHlvcUlGVnpaV1FnZEc4Z1kyOXVkbVZ5ZENCSVZFMU1JR1Z1ZEdsMGFXVnpJSFJ2SUdOb1lYSmhZM1JsY25NZ0tpOWNiaUFnZG1GeUlHaDBiV3hWYm1WelkyRndaWE1nUFNCcGJuWmxjblFvYUhSdGJFVnpZMkZ3WlhNcE8xeHVYRzRnSUM4cUxTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHFMMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkJjM05wWjI1eklHOTNiaUJsYm5WdFpYSmhZbXhsSUhCeWIzQmxjblJwWlhNZ2IyWWdjMjkxY21ObElHOWlhbVZqZENoektTQjBieUIwYUdVZ1pHVnpkR2x1WVhScGIyNWNiaUFnSUNvZ2IySnFaV04wTGlCVGRXSnpaWEYxWlc1MElITnZkWEpqWlhNZ2QybHNiQ0J2ZG1WeWQzSnBkR1VnY0hKdmNHVnllU0JoYzNOcFoyNXRaVzUwY3lCdlppQndjbVYyYVc5MWMxeHVJQ0FnS2lCemIzVnlZMlZ6TGlCSlppQmhJR0JqWVd4c1ltRmphMkFnWm5WdVkzUnBiMjRnYVhNZ2NHRnpjMlZrTENCcGRDQjNhV3hzSUdKbElHVjRaV04xZEdWa0lIUnZJSEJ5YjJSMVkyVmNiaUFnSUNvZ2RHaGxJR0Z6YzJsbmJtVmtJSFpoYkhWbGN5NGdWR2hsSUdCallXeHNZbUZqYTJBZ2FYTWdZbTkxYm1RZ2RHOGdZSFJvYVhOQmNtZGdJR0Z1WkNCcGJuWnZhMlZrSUhkcGRHaGNiaUFnSUNvZ2RIZHZJR0Z5WjNWdFpXNTBjenNnS0c5aWFtVmpkRlpoYkhWbExDQnpiM1Z5WTJWV1lXeDFaU2t1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUhSNWNHVWdSblZ1WTNScGIyNWNiaUFnSUNvZ1FHRnNhV0Z6SUdWNGRHVnVaRnh1SUNBZ0tpQkFZMkYwWldkdmNua2dUMkpxWldOMGMxeHVJQ0FnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnYjJKcVpXTjBJRlJvWlNCa1pYTjBhVzVoZEdsdmJpQnZZbXBsWTNRdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0JiYzI5MWNtTmxNU3dnYzI5MWNtTmxNaXdnTGk0dVhTQlVhR1VnYzI5MWNtTmxJRzlpYW1WamRITXVYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlGdGpZV3hzWW1GamExMGdWR2hsSUdaMWJtTjBhVzl1SUhSdklHTjFjM1J2YldsNlpTQmhjM05wWjI1cGJtY2dkbUZzZFdWekxseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0JiZEdocGMwRnlaMTBnVkdobElHQjBhR2x6WUNCaWFXNWthVzVuSUc5bUlHQmpZV3hzWW1GamEyQXVYRzRnSUNBcUlFQnlaWFIxY201eklIdFBZbXBsWTNSOUlGSmxkSFZ5Ym5NZ2RHaGxJR1JsYzNScGJtRjBhVzl1SUc5aWFtVmpkQzVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nWHk1aGMzTnBaMjRvZXlBbmJtRnRaU2M2SUNkdGIyVW5JSDBzSUhzZ0oyRm5aU2M2SURRd0lIMHBPMXh1SUNBZ0tpQXZMeUE5UGlCN0lDZHVZVzFsSnpvZ0oyMXZaU2NzSUNkaFoyVW5PaUEwTUNCOVhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCa1pXWmhkV3gwY3lBOUlGOHVjR0Z5ZEdsaGJGSnBaMmgwS0Y4dVlYTnphV2R1TENCbWRXNWpkR2x2YmloaExDQmlLU0I3WEc0Z0lDQXFJQ0FnY21WMGRYSnVJSFI1Y0dWdlppQmhJRDA5SUNkMWJtUmxabWx1WldRbklEOGdZaUE2SUdFN1hHNGdJQ0FxSUgwcE8xeHVJQ0FnS2x4dUlDQWdLaUIyWVhJZ1ptOXZaQ0E5SUhzZ0oyNWhiV1VuT2lBbllYQndiR1VuSUgwN1hHNGdJQ0FxSUdSbFptRjFiSFJ6S0dadmIyUXNJSHNnSjI1aGJXVW5PaUFuWW1GdVlXNWhKeXdnSjNSNWNHVW5PaUFuWm5KMWFYUW5JSDBwTzF4dUlDQWdLaUF2THlBOVBpQjdJQ2R1WVcxbEp6b2dKMkZ3Y0d4bEp5d2dKM1I1Y0dVbk9pQW5abkoxYVhRbklIMWNiaUFnSUNvdlhHNGdJSFpoY2lCaGMzTnBaMjRnUFNCamNtVmhkR1ZKZEdWeVlYUnZjaWhrWldaaGRXeDBjMGwwWlhKaGRHOXlUM0IwYVc5dWN5d2dlMXh1SUNBZ0lDZDBiM0FuT2x4dUlDQWdJQ0FnWkdWbVlYVnNkSE5KZEdWeVlYUnZjazl3ZEdsdmJuTXVkRzl3TG5KbGNHeGhZMlVvSnpzbkxGeHVJQ0FnSUNBZ0lDQW5PMXhjYmljZ0sxeHVJQ0FnSUNBZ0lDQmNJbWxtSUNoaGNtZHpUR1Z1WjNSb0lENGdNeUFtSmlCMGVYQmxiMllnWVhKbmMxdGhjbWR6VEdWdVozUm9JQzBnTWwwZ1BUMGdKMloxYm1OMGFXOXVKeWtnZTF4Y2Jsd2lJQ3RjYmlBZ0lDQWdJQ0FnSnlBZ2RtRnlJR05oYkd4aVlXTnJJRDBnWTNKbFlYUmxRMkZzYkdKaFkyc29ZWEpuYzFzdExXRnlaM05NWlc1bmRHZ2dMU0F4WFN3Z1lYSm5jMXRoY21kelRHVnVaM1JvTFMxZExDQXlLVHRjWEc0bklDdGNiaUFnSUNBZ0lDQWdYQ0o5SUdWc2MyVWdhV1lnS0dGeVozTk1aVzVuZEdnZ1BpQXlJQ1ltSUhSNWNHVnZaaUJoY21kelcyRnlaM05NWlc1bmRHZ2dMU0F4WFNBOVBTQW5ablZ1WTNScGIyNG5LU0I3WEZ4dVhDSWdLMXh1SUNBZ0lDQWdJQ0FuSUNCallXeHNZbUZqYXlBOUlHRnlaM05iTFMxaGNtZHpUR1Z1WjNSb1hUdGNYRzRuSUN0Y2JpQWdJQ0FnSUNBZ0ozMG5YRzRnSUNBZ0lDQXBMRnh1SUNBZ0lDZHNiMjl3SnpvZ0ozSmxjM1ZzZEZ0cGJtUmxlRjBnUFNCallXeHNZbUZqYXlBL0lHTmhiR3hpWVdOcktISmxjM1ZzZEZ0cGJtUmxlRjBzSUdsMFpYSmhZbXhsVzJsdVpHVjRYU2tnT2lCcGRHVnlZV0pzWlZ0cGJtUmxlRjBuWEc0Z0lIMHBPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRjbVZoZEdWeklHRWdZMnh2Ym1VZ2IyWWdZSFpoYkhWbFlDNGdTV1lnWUdSbFpYQmdJR2x6SUdCMGNuVmxZQ3dnYm1WemRHVmtJRzlpYW1WamRITWdkMmxzYkNCaGJITnZYRzRnSUNBcUlHSmxJR05zYjI1bFpDd2diM1JvWlhKM2FYTmxJSFJvWlhrZ2QybHNiQ0JpWlNCaGMzTnBaMjVsWkNCaWVTQnlaV1psY21WdVkyVXVJRWxtSUdFZ1lHTmhiR3hpWVdOcllGeHVJQ0FnS2lCbWRXNWpkR2x2YmlCcGN5QndZWE56WldRc0lHbDBJSGRwYkd3Z1ltVWdaWGhsWTNWMFpXUWdkRzhnY0hKdlpIVmpaU0IwYUdVZ1kyeHZibVZrSUhaaGJIVmxjeTRnU1daY2JpQWdJQ29nWUdOaGJHeGlZV05yWUNCeVpYUjFjbTV6SUdCMWJtUmxabWx1WldSZ0xDQmpiRzl1YVc1bklIZHBiR3dnWW1VZ2FHRnVaR3hsWkNCaWVTQjBhR1VnYldWMGFHOWtJR2x1YzNSbFlXUXVYRzRnSUNBcUlGUm9aU0JnWTJGc2JHSmhZMnRnSUdseklHSnZkVzVrSUhSdklHQjBhR2x6UVhKbllDQmhibVFnYVc1MmIydGxaQ0IzYVhSb0lHOXVaU0JoY21kMWJXVnVkRHNnS0haaGJIVmxLUzVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnVDJKcVpXTjBjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwMXBlR1ZrZlNCMllXeDFaU0JVYUdVZ2RtRnNkV1VnZEc4Z1kyeHZibVV1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdRbTl2YkdWaGJuMGdXMlJsWlhBOVptRnNjMlZkSUVFZ1pteGhaeUIwYnlCcGJtUnBZMkYwWlNCaElHUmxaWEFnWTJ4dmJtVXVYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlGdGpZV3hzWW1GamExMGdWR2hsSUdaMWJtTjBhVzl1SUhSdklHTjFjM1J2YldsNlpTQmpiRzl1YVc1bklIWmhiSFZsY3k1Y2JpQWdJQ29nUUhCaGNtRnRJSHROYVhobFpIMGdXM1JvYVhOQmNtZGRJRlJvWlNCZ2RHaHBjMkFnWW1sdVpHbHVaeUJ2WmlCZ1kyRnNiR0poWTJ0Z0xseHVJQ0FnS2lCQWNHRnlZVzB0SUh0QmNuSmhlWDBnVzNOMFlXTnJRVDFiWFYwZ1NXNTBaWEp1WVd4c2VTQjFjMlZrSUhSdklIUnlZV05ySUhSeVlYWmxjbk5sWkNCemIzVnlZMlVnYjJKcVpXTjBjeTVjYmlBZ0lDb2dRSEJoY21GdExTQjdRWEp5WVhsOUlGdHpkR0ZqYTBJOVcxMWRJRWx1ZEdWeWJtRnNiSGtnZFhObFpDQjBieUJoYzNOdlkybGhkR1VnWTJ4dmJtVnpJSGRwZEdnZ2MyOTFjbU5sSUdOdmRXNTBaWEp3WVhKMGN5NWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwMXBlR1ZrZlNCU1pYUjFjbTV6SUhSb1pTQmpiRzl1WldRZ1lIWmhiSFZsWUM1Y2JpQWdJQ29nUUdWNFlXMXdiR1ZjYmlBZ0lDcGNiaUFnSUNvZ2RtRnlJSE4wYjI5blpYTWdQU0JiWEc0Z0lDQXFJQ0FnZXlBbmJtRnRaU2M2SUNkdGIyVW5MQ0FuWVdkbEp6b2dOREFnZlN4Y2JpQWdJQ29nSUNCN0lDZHVZVzFsSnpvZ0oyeGhjbko1Snl3Z0oyRm5aU2M2SURVd0lIMWNiaUFnSUNvZ1hUdGNiaUFnSUNwY2JpQWdJQ29nZG1GeUlITm9ZV3hzYjNjZ1BTQmZMbU5zYjI1bEtITjBiMjluWlhNcE8xeHVJQ0FnS2lCemFHRnNiRzkzV3pCZElEMDlQU0J6ZEc5dloyVnpXekJkTzF4dUlDQWdLaUF2THlBOVBpQjBjblZsWEc0Z0lDQXFYRzRnSUNBcUlIWmhjaUJrWldWd0lEMGdYeTVqYkc5dVpTaHpkRzl2WjJWekxDQjBjblZsS1R0Y2JpQWdJQ29nWkdWbGNGc3dYU0E5UFQwZ2MzUnZiMmRsYzFzd1hUdGNiaUFnSUNvZ0x5OGdQVDRnWm1Gc2MyVmNiaUFnSUNwY2JpQWdJQ29nWHk1dGFYaHBiaWg3WEc0Z0lDQXFJQ0FnSjJOc2IyNWxKem9nWHk1d1lYSjBhV0ZzVW1sbmFIUW9YeTVqYkc5dVpTd2dablZ1WTNScGIyNG9kbUZzZFdVcElIdGNiaUFnSUNvZ0lDQWdJSEpsZEhWeWJpQmZMbWx6Uld4bGJXVnVkQ2gyWVd4MVpTa2dQeUIyWVd4MVpTNWpiRzl1WlU1dlpHVW9abUZzYzJVcElEb2dkVzVrWldacGJtVmtPMXh1SUNBZ0tpQWdJSDBwWEc0Z0lDQXFJSDBwTzF4dUlDQWdLbHh1SUNBZ0tpQjJZWElnWTJ4dmJtVWdQU0JmTG1Oc2IyNWxLR1J2WTNWdFpXNTBMbUp2WkhrcE8xeHVJQ0FnS2lCamJHOXVaUzVqYUdsc1pFNXZaR1Z6TG14bGJtZDBhRHRjYmlBZ0lDb2dMeThnUFQ0Z01GeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdZMnh2Ym1Vb2RtRnNkV1VzSUdSbFpYQXNJR05oYkd4aVlXTnJMQ0IwYUdselFYSm5MQ0J6ZEdGamEwRXNJSE4wWVdOclFpa2dlMXh1SUNBZ0lIWmhjaUJ5WlhOMWJIUWdQU0IyWVd4MVpUdGNibHh1SUNBZ0lDOHZJR0ZzYkc5M2N5QjNiM0pyYVc1bklIZHBkR2dnWENKRGIyeHNaV04wYVc5dWMxd2lJRzFsZEdodlpITWdkMmwwYUc5MWRDQjFjMmx1WnlCMGFHVnBjaUJnWTJGc2JHSmhZMnRnWEc0Z0lDQWdMeThnWVhKbmRXMWxiblFzSUdCcGJtUmxlSHhyWlhsZ0xDQm1iM0lnZEdocGN5QnRaWFJvYjJRbmN5QmdZMkZzYkdKaFkydGdYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQmtaV1Z3SUQwOUlDZG1kVzVqZEdsdmJpY3BJSHRjYmlBZ0lDQWdJSFJvYVhOQmNtY2dQU0JqWVd4c1ltRmphenRjYmlBZ0lDQWdJR05oYkd4aVlXTnJJRDBnWkdWbGNEdGNiaUFnSUNBZ0lHUmxaWEFnUFNCbVlXeHpaVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQmpZV3hzWW1GamF5QTlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNCallXeHNZbUZqYXlBOUlIUjVjR1Z2WmlCMGFHbHpRWEpuSUQwOUlDZDFibVJsWm1sdVpXUW5JRDhnWTJGc2JHSmhZMnNnT2lCamNtVmhkR1ZEWVd4c1ltRmpheWhqWVd4c1ltRmpheXdnZEdocGMwRnlaeXdnTVNrN1hHNGdJQ0FnSUNCeVpYTjFiSFFnUFNCallXeHNZbUZqYXloeVpYTjFiSFFwTzF4dVhHNGdJQ0FnSUNCMllYSWdaRzl1WlNBOUlIUjVjR1Z2WmlCeVpYTjFiSFFnSVQwZ0ozVnVaR1ZtYVc1bFpDYzdYRzRnSUNBZ0lDQnBaaUFvSVdSdmJtVXBJSHRjYmlBZ0lDQWdJQ0FnY21WemRXeDBJRDBnZG1Gc2RXVTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklHbHVjM0JsWTNRZ1cxdERiR0Z6YzExZFhHNGdJQ0FnZG1GeUlHbHpUMkpxSUQwZ2FYTlBZbXBsWTNRb2NtVnpkV3gwS1R0Y2JpQWdJQ0JwWmlBb2FYTlBZbW9wSUh0Y2JpQWdJQ0FnSUhaaGNpQmpiR0Z6YzA1aGJXVWdQU0IwYjFOMGNtbHVaeTVqWVd4c0tISmxjM1ZzZENrN1hHNGdJQ0FnSUNCcFppQW9JV05zYjI1bFlXSnNaVU5zWVhOelpYTmJZMnhoYzNOT1lXMWxYU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdkbUZ5SUdselFYSnlJRDBnYVhOQmNuSmhlU2h5WlhOMWJIUXBPMXh1SUNBZ0lIMWNiaUFnSUNBdkx5QnphR0ZzYkc5M0lHTnNiMjVsWEc0Z0lDQWdhV1lnS0NGcGMwOWlhaUI4ZkNBaFpHVmxjQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR2x6VDJKcUlDWW1JQ0ZrYjI1bFhHNGdJQ0FnSUNBZ0lEOGdLR2x6UVhKeUlEOGdjMnhwWTJVb2NtVnpkV3gwS1NBNklHRnpjMmxuYmloN2ZTd2djbVZ6ZFd4MEtTbGNiaUFnSUNBZ0lDQWdPaUJ5WlhOMWJIUTdYRzRnSUNBZ2ZWeHVJQ0FnSUhaaGNpQmpkRzl5SUQwZ1kzUnZja0o1UTJ4aGMzTmJZMnhoYzNOT1lXMWxYVHRjYmlBZ0lDQnpkMmwwWTJnZ0tHTnNZWE56VG1GdFpTa2dlMXh1SUNBZ0lDQWdZMkZ6WlNCaWIyOXNRMnhoYzNNNlhHNGdJQ0FnSUNCallYTmxJR1JoZEdWRGJHRnpjenBjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1J2Ym1VZ1B5QnlaWE4xYkhRZ09pQnVaWGNnWTNSdmNpZ3JjbVZ6ZFd4MEtUdGNibHh1SUNBZ0lDQWdZMkZ6WlNCdWRXMWlaWEpEYkdGemN6cGNiaUFnSUNBZ0lHTmhjMlVnYzNSeWFXNW5RMnhoYzNNNlhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCa2IyNWxJRDhnY21WemRXeDBJRG9nYm1WM0lHTjBiM0lvY21WemRXeDBLVHRjYmx4dUlDQWdJQ0FnWTJGelpTQnlaV2RsZUhCRGJHRnpjenBjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1J2Ym1VZ1B5QnlaWE4xYkhRZ09pQmpkRzl5S0hKbGMzVnNkQzV6YjNWeVkyVXNJSEpsUm14aFozTXVaWGhsWXloeVpYTjFiSFFwS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnWTJobFkyc2dabTl5SUdOcGNtTjFiR0Z5SUhKbFptVnlaVzVqWlhNZ1lXNWtJSEpsZEhWeWJpQmpiM0p5WlhOd2IyNWthVzVuSUdOc2IyNWxYRzRnSUNBZ2MzUmhZMnRCSUh4OElDaHpkR0ZqYTBFZ1BTQmJYU2s3WEc0Z0lDQWdjM1JoWTJ0Q0lIeDhJQ2h6ZEdGamEwSWdQU0JiWFNrN1hHNWNiaUFnSUNCMllYSWdiR1Z1WjNSb0lEMGdjM1JoWTJ0QkxteGxibWQwYUR0Y2JpQWdJQ0IzYUdsc1pTQW9iR1Z1WjNSb0xTMHBJSHRjYmlBZ0lDQWdJR2xtSUNoemRHRmphMEZiYkdWdVozUm9YU0E5UFNCMllXeDFaU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYzNSaFkydENXMnhsYm1kMGFGMDdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklHbHVhWFFnWTJ4dmJtVmtJRzlpYW1WamRGeHVJQ0FnSUdsbUlDZ2haRzl1WlNrZ2UxeHVJQ0FnSUNBZ2NtVnpkV3gwSUQwZ2FYTkJjbklnUHlCamRHOXlLSEpsYzNWc2RDNXNaVzVuZEdncElEb2dlMzA3WEc1Y2JpQWdJQ0FnSUM4dklHRmtaQ0JoY25KaGVTQndjbTl3WlhKMGFXVnpJR0Z6YzJsbmJtVmtJR0o1SUdCU1pXZEZlSEFqWlhobFkyQmNiaUFnSUNBZ0lHbG1JQ2hwYzBGeWNpa2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb2FHRnpUM2R1VUhKdmNHVnlkSGt1WTJGc2JDaDJZV3gxWlN3Z0oybHVaR1Y0SnlrcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhOMWJIUXVhVzVrWlhnZ1BTQjJZV3gxWlM1cGJtUmxlRHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCcFppQW9hR0Z6VDNkdVVISnZjR1Z5ZEhrdVkyRnNiQ2gyWVd4MVpTd2dKMmx1Y0hWMEp5a3BJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYTjFiSFF1YVc1d2RYUWdQU0IyWVd4MVpTNXBibkIxZER0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdJQ0F2THlCaFpHUWdkR2hsSUhOdmRYSmpaU0IyWVd4MVpTQjBieUIwYUdVZ2MzUmhZMnNnYjJZZ2RISmhkbVZ5YzJWa0lHOWlhbVZqZEhOY2JpQWdJQ0F2THlCaGJtUWdZWE56YjJOcFlYUmxJR2wwSUhkcGRHZ2dhWFJ6SUdOc2IyNWxYRzRnSUNBZ2MzUmhZMnRCTG5CMWMyZ29kbUZzZFdVcE8xeHVJQ0FnSUhOMFlXTnJRaTV3ZFhOb0tISmxjM1ZzZENrN1hHNWNiaUFnSUNBdkx5QnlaV04xY25OcGRtVnNlU0J3YjNCMWJHRjBaU0JqYkc5dVpTQW9jM1Z6WTJWd2RHbGliR1VnZEc4Z1kyRnNiQ0J6ZEdGamF5QnNhVzFwZEhNcFhHNGdJQ0FnS0dselFYSnlJRDhnWm05eVJXRmphQ0E2SUdadmNrOTNiaWtvWkc5dVpTQS9JSEpsYzNWc2RDQTZJSFpoYkhWbExDQm1kVzVqZEdsdmJpaHZZbXBXWVd4MVpTd2dhMlY1S1NCN1hHNGdJQ0FnSUNCeVpYTjFiSFJiYTJWNVhTQTlJR05zYjI1bEtHOWlhbFpoYkhWbExDQmtaV1Z3TENCallXeHNZbUZqYXl3Z2RXNWtaV1pwYm1Wa0xDQnpkR0ZqYTBFc0lITjBZV05yUWlrN1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVOeVpXRjBaWE1nWVNCa1pXVndJR05zYjI1bElHOW1JR0IyWVd4MVpXQXVJRWxtSUdFZ1lHTmhiR3hpWVdOcllDQm1kVzVqZEdsdmJpQnBjeUJ3WVhOelpXUXNJR2wwSUhkcGJHeGNiaUFnSUNvZ1ltVWdaWGhsWTNWMFpXUWdkRzhnY0hKdlpIVmpaU0IwYUdVZ1kyeHZibVZrSUhaaGJIVmxjeTRnU1dZZ1lHTmhiR3hpWVdOcllDQnlaWFIxY201eklIUm9aU0IyWVd4MVpTQnBkRnh1SUNBZ0tpQjNZWE1nY0dGemMyVmtMQ0JqYkc5dWFXNW5JSGRwYkd3Z1ltVWdhR0Z1Wkd4bFpDQmllU0IwYUdVZ2JXVjBhRzlrSUdsdWMzUmxZV1F1SUZSb1pTQmdZMkZzYkdKaFkydGdJR2x6WEc0Z0lDQXFJR0p2ZFc1a0lIUnZJR0IwYUdselFYSm5ZQ0JoYm1RZ2FXNTJiMnRsWkNCM2FYUm9JRzl1WlNCaGNtZDFiV1Z1ZERzZ0tIWmhiSFZsS1M1Y2JpQWdJQ3BjYmlBZ0lDb2dUbTkwWlRvZ1ZHaHBjeUJtZFc1amRHbHZiaUJwY3lCc2IyOXpaV3g1SUdKaGMyVmtJRzl1SUhSb1pTQnpkSEoxWTNSMWNtVmtJR05zYjI1bElHRnNaMjl5YVhSb2JTNGdSblZ1WTNScGIyNXpYRzRnSUNBcUlHRnVaQ0JFVDAwZ2JtOWtaWE1nWVhKbElDb3FibTkwS2lvZ1kyeHZibVZrTGlCVWFHVWdaVzUxYldWeVlXSnNaU0J3Y205d1pYSjBhV1Z6SUc5bUlHQmhjbWQxYldWdWRITmdJRzlpYW1WamRITWdZVzVrWEc0Z0lDQXFJRzlpYW1WamRITWdZM0psWVhSbFpDQmllU0JqYjI1emRISjFZM1J2Y25NZ2IzUm9aWElnZEdoaGJpQmdUMkpxWldOMFlDQmhjbVVnWTJ4dmJtVmtJSFJ2SUhCc1lXbHVJR0JQWW1wbFkzUmdJRzlpYW1WamRITXVYRzRnSUNBcUlGTmxaU0JvZEhSd09pOHZkM2QzTG5jekxtOXlaeTlVVWk5b2RHMXNOUzlwYm1aeVlYTjBjblZqZEhWeVpTNW9kRzFzSTJsdWRHVnlibUZzTFhOMGNuVmpkSFZ5WldRdFkyeHZibWx1WnkxaGJHZHZjbWwwYUcwdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ6ZEdGMGFXTmNiaUFnSUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFnSUNvZ1FHTmhkR1ZuYjNKNUlFOWlhbVZqZEhOY2JpQWdJQ29nUUhCaGNtRnRJSHROYVhobFpIMGdkbUZzZFdVZ1ZHaGxJSFpoYkhWbElIUnZJR1JsWlhBZ1kyeHZibVV1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdSblZ1WTNScGIyNTlJRnRqWVd4c1ltRmphMTBnVkdobElHWjFibU4wYVc5dUlIUnZJR04xYzNSdmJXbDZaU0JqYkc5dWFXNW5JSFpoYkhWbGN5NWNiaUFnSUNvZ1FIQmhjbUZ0SUh0TmFYaGxaSDBnVzNSb2FYTkJjbWRkSUZSb1pTQmdkR2hwYzJBZ1ltbHVaR2x1WnlCdlppQmdZMkZzYkdKaFkydGdMbHh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdUV2w0WldSOUlGSmxkSFZ5Ym5NZ2RHaGxJR1JsWlhBZ1kyeHZibVZrSUdCMllXeDFaV0F1WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUhaaGNpQnpkRzl2WjJWeklEMGdXMXh1SUNBZ0tpQWdJSHNnSjI1aGJXVW5PaUFuYlc5bEp5d2dKMkZuWlNjNklEUXdJSDBzWEc0Z0lDQXFJQ0FnZXlBbmJtRnRaU2M2SUNkc1lYSnllU2NzSUNkaFoyVW5PaUExTUNCOVhHNGdJQ0FxSUYwN1hHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCa1pXVndJRDBnWHk1amJHOXVaVVJsWlhBb2MzUnZiMmRsY3lrN1hHNGdJQ0FxSUdSbFpYQmJNRjBnUFQwOUlITjBiMjluWlhOYk1GMDdYRzRnSUNBcUlDOHZJRDArSUdaaGJITmxYRzRnSUNBcVhHNGdJQ0FxSUhaaGNpQjJhV1YzSUQwZ2UxeHVJQ0FnS2lBZ0lDZHNZV0psYkNjNklDZGtiMk56Snl4Y2JpQWdJQ29nSUNBbmJtOWtaU2M2SUdWc1pXMWxiblJjYmlBZ0lDb2dmVHRjYmlBZ0lDcGNiaUFnSUNvZ2RtRnlJR05zYjI1bElEMGdYeTVqYkc5dVpVUmxaWEFvZG1sbGR5d2dablZ1WTNScGIyNG9kbUZzZFdVcElIdGNiaUFnSUNvZ0lDQnlaWFIxY200Z1h5NXBjMFZzWlcxbGJuUW9kbUZzZFdVcElEOGdkbUZzZFdVdVkyeHZibVZPYjJSbEtIUnlkV1VwSURvZ2RtRnNkV1U3WEc0Z0lDQXFJSDBwTzF4dUlDQWdLbHh1SUNBZ0tpQmpiRzl1WlM1dWIyUmxJRDA5SUhacFpYY3VibTlrWlR0Y2JpQWdJQ29nTHk4Z1BUNGdabUZzYzJWY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlHTnNiMjVsUkdWbGNDaDJZV3gxWlN3Z1kyRnNiR0poWTJzc0lIUm9hWE5CY21jcElIdGNiaUFnSUNCeVpYUjFjbTRnWTJ4dmJtVW9kbUZzZFdVc0lIUnlkV1VzSUdOaGJHeGlZV05yTENCMGFHbHpRWEpuS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkJjM05wWjI1eklHOTNiaUJsYm5WdFpYSmhZbXhsSUhCeWIzQmxjblJwWlhNZ2IyWWdjMjkxY21ObElHOWlhbVZqZENoektTQjBieUIwYUdVZ1pHVnpkR2x1WVhScGIyNWNiaUFnSUNvZ2IySnFaV04wSUdadmNpQmhiR3dnWkdWemRHbHVZWFJwYjI0Z2NISnZjR1Z5ZEdsbGN5QjBhR0YwSUhKbGMyOXNkbVVnZEc4Z1lIVnVaR1ZtYVc1bFpHQXVJRTl1WTJVZ1lWeHVJQ0FnS2lCd2NtOXdaWEowZVNCcGN5QnpaWFFzSUdGa1pHbDBhVzl1WVd3Z1pHVm1ZWFZzZEhNZ2IyWWdkR2hsSUhOaGJXVWdjSEp2Y0dWeWRIa2dkMmxzYkNCaVpTQnBaMjV2Y21Wa0xseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQjBlWEJsSUVaMWJtTjBhVzl1WEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JQWW1wbFkzUnpYRzRnSUNBcUlFQndZWEpoYlNCN1QySnFaV04wZlNCdlltcGxZM1FnVkdobElHUmxjM1JwYm1GMGFXOXVJRzlpYW1WamRDNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUZ0emIzVnlZMlV4TENCemIzVnlZMlV5TENBdUxpNWRJRlJvWlNCemIzVnlZMlVnYjJKcVpXTjBjeTVjYmlBZ0lDb2dRSEJoY21GdExTQjdUMkpxWldOMGZTQmJaM1ZoY21SZElFbHVkR1Z5Ym1Gc2JIa2dkWE5sWkNCMGJ5QmhiR3h2ZHlCM2IzSnJhVzVuSUhkcGRHZ2dZRjh1Y21Wa2RXTmxZRnh1SUNBZ0tpQWdkMmwwYUc5MWRDQjFjMmx1WnlCcGRITWdZMkZzYkdKaFkyc25jeUJnYTJWNVlDQmhibVFnWUc5aWFtVmpkR0FnWVhKbmRXMWxiblJ6SUdGeklITnZkWEpqWlhNdVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0UFltcGxZM1I5SUZKbGRIVnlibk1nZEdobElHUmxjM1JwYm1GMGFXOXVJRzlpYW1WamRDNWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dkbUZ5SUdadmIyUWdQU0I3SUNkdVlXMWxKem9nSjJGd2NHeGxKeUI5TzF4dUlDQWdLaUJmTG1SbFptRjFiSFJ6S0dadmIyUXNJSHNnSjI1aGJXVW5PaUFuWW1GdVlXNWhKeXdnSjNSNWNHVW5PaUFuWm5KMWFYUW5JSDBwTzF4dUlDQWdLaUF2THlBOVBpQjdJQ2R1WVcxbEp6b2dKMkZ3Y0d4bEp5d2dKM1I1Y0dVbk9pQW5abkoxYVhRbklIMWNiaUFnSUNvdlhHNGdJSFpoY2lCa1pXWmhkV3gwY3lBOUlHTnlaV0YwWlVsMFpYSmhkRzl5S0dSbFptRjFiSFJ6U1hSbGNtRjBiM0pQY0hScGIyNXpLVHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRM0psWVhSbGN5QmhJSE52Y25SbFpDQmhjbkpoZVNCdlppQmhiR3dnWlc1MWJXVnlZV0pzWlNCd2NtOXdaWEowYVdWekxDQnZkMjRnWVc1a0lHbHVhR1Z5YVhSbFpDeGNiaUFnSUNvZ2IyWWdZRzlpYW1WamRHQWdkR2hoZENCb1lYWmxJR1oxYm1OMGFXOXVJSFpoYkhWbGN5NWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZV3hwWVhNZ2JXVjBhRzlrYzF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnVDJKcVpXTjBjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ2IySnFaV04wSUZSb1pTQnZZbXBsWTNRZ2RHOGdhVzV6Y0dWamRDNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwRnljbUY1ZlNCU1pYUjFjbTV6SUdFZ2JtVjNJR0Z5Y21GNUlHOW1JSEJ5YjNCbGNuUjVJRzVoYldWeklIUm9ZWFFnYUdGMlpTQm1kVzVqZEdsdmJpQjJZV3gxWlhNdVhHNGdJQ0FxSUVCbGVHRnRjR3hsWEc0Z0lDQXFYRzRnSUNBcUlGOHVablZ1WTNScGIyNXpLRjhwTzF4dUlDQWdLaUF2THlBOVBpQmJKMkZzYkNjc0lDZGhibmtuTENBblltbHVaQ2NzSUNkaWFXNWtRV3hzSnl3Z0oyTnNiMjVsSnl3Z0oyTnZiWEJoWTNRbkxDQW5ZMjl0Y0c5elpTY3NJQzR1TGwxY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlHWjFibU4wYVc5dWN5aHZZbXBsWTNRcElIdGNiaUFnSUNCMllYSWdjbVZ6ZFd4MElEMGdXMTA3WEc0Z0lDQWdabTl5U1c0b2IySnFaV04wTENCbWRXNWpkR2x2YmloMllXeDFaU3dnYTJWNUtTQjdYRzRnSUNBZ0lDQnBaaUFvYVhOR2RXNWpkR2x2YmloMllXeDFaU2twSUh0Y2JpQWdJQ0FnSUNBZ2NtVnpkV3gwTG5CMWMyZ29hMlY1S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1R0Y2JpQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4MExuTnZjblFvS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRhR1ZqYTNNZ2FXWWdkR2hsSUhOd1pXTnBabWxsWkNCdlltcGxZM1FnWUhCeWIzQmxjblI1WUNCbGVHbHpkSE1nWVc1a0lHbHpJR0VnWkdseVpXTjBJSEJ5YjNCbGNuUjVMRnh1SUNBZ0tpQnBibk4wWldGa0lHOW1JR0Z1SUdsdWFHVnlhWFJsWkNCd2NtOXdaWEowZVM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1QySnFaV04wYzF4dUlDQWdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdiMkpxWldOMElGUm9aU0J2WW1wbFkzUWdkRzhnWTJobFkyc3VYRzRnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCd2NtOXdaWEowZVNCVWFHVWdjSEp2Y0dWeWRIa2dkRzhnWTJobFkyc2dabTl5TGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQWdhV1lnYTJWNUlHbHpJR0VnWkdseVpXTjBJSEJ5YjNCbGNuUjVMQ0JsYkhObElHQm1ZV3h6WldBdVhHNGdJQ0FxSUVCbGVHRnRjR3hsWEc0Z0lDQXFYRzRnSUNBcUlGOHVhR0Z6S0hzZ0oyRW5PaUF4TENBbllpYzZJRElzSUNkakp6b2dNeUI5TENBbllpY3BPMXh1SUNBZ0tpQXZMeUE5UGlCMGNuVmxYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJvWVhNb2IySnFaV04wTENCd2NtOXdaWEowZVNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ2WW1wbFkzUWdQeUJvWVhOUGQyNVFjbTl3WlhKMGVTNWpZV3hzS0c5aWFtVmpkQ3dnY0hKdmNHVnlkSGtwSURvZ1ptRnNjMlU3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1EzSmxZWFJsY3lCaGJpQnZZbXBsWTNRZ1kyOXRjRzl6WldRZ2IyWWdkR2hsSUdsdWRtVnlkR1ZrSUd0bGVYTWdZVzVrSUhaaGJIVmxjeUJ2WmlCMGFHVWdaMmwyWlc0Z1lHOWlhbVZqZEdBdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ6ZEdGMGFXTmNiaUFnSUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFnSUNvZ1FHTmhkR1ZuYjNKNUlFOWlhbVZqZEhOY2JpQWdJQ29nUUhCaGNtRnRJSHRQWW1wbFkzUjlJRzlpYW1WamRDQlVhR1VnYjJKcVpXTjBJSFJ2SUdsdWRtVnlkQzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMDlpYW1WamRIMGdVbVYwZFhKdWN5QjBhR1VnWTNKbFlYUmxaQ0JwYm5abGNuUmxaQ0J2WW1wbFkzUXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJQ0JmTG1sdWRtVnlkQ2g3SUNkbWFYSnpkQ2M2SUNkdGIyVW5MQ0FuYzJWamIyNWtKem9nSjJ4aGNuSjVKeUI5S1R0Y2JpQWdJQ29nTHk4Z1BUNGdleUFuYlc5bEp6b2dKMlpwY25OMEp5d2dKMnhoY25KNUp6b2dKM05sWTI5dVpDY2dmU0FvYjNKa1pYSWdhWE1nYm05MElHZDFZWEpoYm5SbFpXUXBYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJwYm5abGNuUW9iMkpxWldOMEtTQjdYRzRnSUNBZ2RtRnlJR2x1WkdWNElEMGdMVEVzWEc0Z0lDQWdJQ0FnSUhCeWIzQnpJRDBnYTJWNWN5aHZZbXBsWTNRcExGeHVJQ0FnSUNBZ0lDQnNaVzVuZEdnZ1BTQndjbTl3Y3k1c1pXNW5kR2dzWEc0Z0lDQWdJQ0FnSUhKbGMzVnNkQ0E5SUh0OU8xeHVYRzRnSUNBZ2QyaHBiR1VnS0NzcmFXNWtaWGdnUENCc1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUhaaGNpQnJaWGtnUFNCd2NtOXdjMXRwYm1SbGVGMDdYRzRnSUNBZ0lDQnlaWE4xYkhSYmIySnFaV04wVzJ0bGVWMWRJRDBnYTJWNU8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4ME8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU5vWldOcmN5QnBaaUJnZG1Gc2RXVmdJR2x6SUdFZ1ltOXZiR1ZoYmlCMllXeDFaUzVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnVDJKcVpXTjBjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwMXBlR1ZrZlNCMllXeDFaU0JVYUdVZ2RtRnNkV1VnZEc4Z1kyaGxZMnN1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHRDYjI5c1pXRnVmU0JTWlhSMWNtNXpJR0IwY25WbFlDd2dhV1lnZEdobElHQjJZV3gxWldBZ2FYTWdZU0JpYjI5c1pXRnVJSFpoYkhWbExDQmxiSE5sSUdCbVlXeHpaV0F1WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUY4dWFYTkNiMjlzWldGdUtHNTFiR3dwTzF4dUlDQWdLaUF2THlBOVBpQm1ZV3h6WlZ4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z2FYTkNiMjlzWldGdUtIWmhiSFZsS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFpoYkhWbElEMDlQU0IwY25WbElIeDhJSFpoYkhWbElEMDlQU0JtWVd4elpTQjhmQ0IwYjFOMGNtbHVaeTVqWVd4c0tIWmhiSFZsS1NBOVBTQmliMjlzUTJ4aGMzTTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUTJobFkydHpJR2xtSUdCMllXeDFaV0FnYVhNZ1lTQmtZWFJsTGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCUFltcGxZM1J6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUV2w0WldSOUlIWmhiSFZsSUZSb1pTQjJZV3gxWlNCMGJ5QmphR1ZqYXk1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBKdmIyeGxZVzU5SUZKbGRIVnlibk1nWUhSeWRXVmdMQ0JwWmlCMGFHVWdZSFpoYkhWbFlDQnBjeUJoSUdSaGRHVXNJR1ZzYzJVZ1lHWmhiSE5sWUM1Y2JpQWdJQ29nUUdWNFlXMXdiR1ZjYmlBZ0lDcGNiaUFnSUNvZ1h5NXBjMFJoZEdVb2JtVjNJRVJoZEdVcE8xeHVJQ0FnS2lBdkx5QTlQaUIwY25WbFhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQnBjMFJoZEdVb2RtRnNkV1VwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkbUZzZFdVZ2FXNXpkR0Z1WTJWdlppQkVZWFJsSUh4OElIUnZVM1J5YVc1bkxtTmhiR3dvZG1Gc2RXVXBJRDA5SUdSaGRHVkRiR0Z6Y3p0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRhR1ZqYTNNZ2FXWWdZSFpoYkhWbFlDQnBjeUJoSUVSUFRTQmxiR1Z0Wlc1MExseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQlBZbXBsWTNSelhHNGdJQ0FxSUVCd1lYSmhiU0I3VFdsNFpXUjlJSFpoYkhWbElGUm9aU0IyWVd4MVpTQjBieUJqYUdWamF5NWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwSnZiMnhsWVc1OUlGSmxkSFZ5Ym5NZ1lIUnlkV1ZnTENCcFppQjBhR1VnWUhaaGJIVmxZQ0JwY3lCaElFUlBUU0JsYkdWdFpXNTBMQ0JsYkhObElHQm1ZV3h6WldBdVhHNGdJQ0FxSUVCbGVHRnRjR3hsWEc0Z0lDQXFYRzRnSUNBcUlGOHVhWE5GYkdWdFpXNTBLR1J2WTNWdFpXNTBMbUp2WkhrcE8xeHVJQ0FnS2lBdkx5QTlQaUIwY25WbFhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQnBjMFZzWlcxbGJuUW9kbUZzZFdVcElIdGNiaUFnSUNCeVpYUjFjbTRnZG1Gc2RXVWdQeUIyWVd4MVpTNXViMlJsVkhsd1pTQTlQVDBnTVNBNklHWmhiSE5sTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTm9aV05yY3lCcFppQmdkbUZzZFdWZ0lHbHpJR1Z0Y0hSNUxpQkJjbkpoZVhNc0lITjBjbWx1WjNNc0lHOXlJR0JoY21kMWJXVnVkSE5nSUc5aWFtVmpkSE1nZDJsMGFDQmhYRzRnSUNBcUlHeGxibWQwYUNCdlppQmdNR0FnWVc1a0lHOWlhbVZqZEhNZ2QybDBhQ0J1YnlCdmQyNGdaVzUxYldWeVlXSnNaU0J3Y205d1pYSjBhV1Z6SUdGeVpTQmpiMjV6YVdSbGNtVmtYRzRnSUNBcUlGd2laVzF3ZEhsY0lpNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dUMkpxWldOMGMxeHVJQ0FnS2lCQWNHRnlZVzBnZTBGeWNtRjVmRTlpYW1WamRIeFRkSEpwYm1kOUlIWmhiSFZsSUZSb1pTQjJZV3gxWlNCMGJ5QnBibk53WldOMExseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1FtOXZiR1ZoYm4wZ1VtVjBkWEp1Y3lCZ2RISjFaV0FzSUdsbUlIUm9aU0JnZG1Gc2RXVmdJR2x6SUdWdGNIUjVMQ0JsYkhObElHQm1ZV3h6WldBdVhHNGdJQ0FxSUVCbGVHRnRjR3hsWEc0Z0lDQXFYRzRnSUNBcUlGOHVhWE5GYlhCMGVTaGJNU3dnTWl3Z00xMHBPMXh1SUNBZ0tpQXZMeUE5UGlCbVlXeHpaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtbHpSVzF3ZEhrb2UzMHBPMXh1SUNBZ0tpQXZMeUE5UGlCMGNuVmxYRzRnSUNBcVhHNGdJQ0FxSUY4dWFYTkZiWEIwZVNnbkp5azdYRzRnSUNBcUlDOHZJRDArSUhSeWRXVmNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJR2x6Ulcxd2RIa29kbUZzZFdVcElIdGNiaUFnSUNCMllYSWdjbVZ6ZFd4MElEMGdkSEoxWlR0Y2JpQWdJQ0JwWmlBb0lYWmhiSFZsS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNBZ0lIMWNiaUFnSUNCMllYSWdZMnhoYzNOT1lXMWxJRDBnZEc5VGRISnBibWN1WTJGc2JDaDJZV3gxWlNrc1hHNGdJQ0FnSUNBZ0lHeGxibWQwYUNBOUlIWmhiSFZsTG14bGJtZDBhRHRjYmx4dUlDQWdJR2xtSUNnb1kyeGhjM05PWVcxbElEMDlJR0Z5Y21GNVEyeGhjM01nZkh3Z1kyeGhjM05PWVcxbElEMDlJSE4wY21sdVowTnNZWE56SUh4OFhHNGdJQ0FnSUNBZ0lHTnNZWE56VG1GdFpTQTlQU0JoY21kelEyeGhjM01wSUh4OFhHNGdJQ0FnSUNBZ0lDaGpiR0Z6YzA1aGJXVWdQVDBnYjJKcVpXTjBRMnhoYzNNZ0ppWWdkSGx3Wlc5bUlHeGxibWQwYUNBOVBTQW5iblZ0WW1WeUp5QW1KaUJwYzBaMWJtTjBhVzl1S0haaGJIVmxMbk53YkdsalpTa3BLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdJV3hsYm1kMGFEdGNiaUFnSUNCOVhHNGdJQ0FnWm05eVQzZHVLSFpoYkhWbExDQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQW9jbVZ6ZFd4MElEMGdabUZzYzJVcE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVUdWeVptOXliWE1nWVNCa1pXVndJR052YlhCaGNtbHpiMjRnWW1WMGQyVmxiaUIwZDI4Z2RtRnNkV1Z6SUhSdklHUmxkR1Z5YldsdVpTQnBaaUIwYUdWNUlHRnlaVnh1SUNBZ0tpQmxjWFZwZG1Gc1pXNTBJSFJ2SUdWaFkyZ2diM1JvWlhJdUlFbG1JR0JqWVd4c1ltRmphMkFnYVhNZ2NHRnpjMlZrTENCcGRDQjNhV3hzSUdKbElHVjRaV04xZEdWa0lIUnZYRzRnSUNBcUlHTnZiWEJoY21VZ2RtRnNkV1Z6TGlCSlppQmdZMkZzYkdKaFkydGdJSEpsZEhWeWJuTWdZSFZ1WkdWbWFXNWxaR0FzSUdOdmJYQmhjbWx6YjI1eklIZHBiR3dnWW1VZ2FHRnVaR3hsWkZ4dUlDQWdLaUJpZVNCMGFHVWdiV1YwYUc5a0lHbHVjM1JsWVdRdUlGUm9aU0JnWTJGc2JHSmhZMnRnSUdseklHSnZkVzVrSUhSdklHQjBhR2x6UVhKbllDQmhibVFnYVc1MmIydGxaQ0IzYVhSb1hHNGdJQ0FxSUhSM2J5QmhjbWQxYldWdWRITTdJQ2hoTENCaUtTNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dUMkpxWldOMGMxeHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0JoSUZSb1pTQjJZV3gxWlNCMGJ5QmpiMjF3WVhKbExseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0JpSUZSb1pTQnZkR2hsY2lCMllXeDFaU0IwYnlCamIyMXdZWEpsTGx4dUlDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0JiWTJGc2JHSmhZMnRkSUZSb1pTQm1kVzVqZEdsdmJpQjBieUJqZFhOMGIyMXBlbVVnWTI5dGNHRnlhVzVuSUhaaGJIVmxjeTVjYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ1czUm9hWE5CY21kZElGUm9aU0JnZEdocGMyQWdZbWx1WkdsdVp5QnZaaUJnWTJGc2JHSmhZMnRnTGx4dUlDQWdLaUJBY0dGeVlXMHRJSHRQWW1wbFkzUjlJRnR6ZEdGamEwRTlXMTFkSUVsdWRHVnlibUZzYkhrZ2RYTmxaQ0IwY21GamF5QjBjbUYyWlhKelpXUWdZR0ZnSUc5aWFtVmpkSE11WEc0Z0lDQXFJRUJ3WVhKaGJTMGdlMDlpYW1WamRIMGdXM04wWVdOclFqMWJYVjBnU1c1MFpYSnVZV3hzZVNCMWMyVmtJSFJ5WVdOcklIUnlZWFpsY25ObFpDQmdZbUFnYjJKcVpXTjBjeTVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMEp2YjJ4bFlXNTlJRkpsZEhWeWJuTWdZSFJ5ZFdWZ0xDQnBaaUIwYUdVZ2RtRnNkV1Z6SUdGeVpTQmxjWFYyWVd4bGJuUXNJR1ZzYzJVZ1lHWmhiSE5sWUM1Y2JpQWdJQ29nUUdWNFlXMXdiR1ZjYmlBZ0lDcGNiaUFnSUNvZ2RtRnlJRzF2WlNBOUlIc2dKMjVoYldVbk9pQW5iVzlsSnl3Z0oyRm5aU2M2SURRd0lIMDdYRzRnSUNBcUlIWmhjaUJqYjNCNUlEMGdleUFuYm1GdFpTYzZJQ2R0YjJVbkxDQW5ZV2RsSnpvZ05EQWdmVHRjYmlBZ0lDcGNiaUFnSUNvZ2JXOWxJRDA5SUdOdmNIazdYRzRnSUNBcUlDOHZJRDArSUdaaGJITmxYRzRnSUNBcVhHNGdJQ0FxSUY4dWFYTkZjWFZoYkNodGIyVXNJR052Y0hrcE8xeHVJQ0FnS2lBdkx5QTlQaUIwY25WbFhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCM2IzSmtjeUE5SUZzbmFHVnNiRzhuTENBbloyOXZaR0o1WlNkZE8xeHVJQ0FnS2lCMllYSWdiM1JvWlhKWGIzSmtjeUE5SUZzbmFHa25MQ0FuWjI5dlpHSjVaU2RkTzF4dUlDQWdLbHh1SUNBZ0tpQmZMbWx6UlhGMVlXd29kMjl5WkhNc0lHOTBhR1Z5VjI5eVpITXNJR1oxYm1OMGFXOXVLR0VzSUdJcElIdGNiaUFnSUNvZ0lDQjJZWElnY21WSGNtVmxkQ0E5SUM5ZUtEODZhR1ZzYkc5OGFHa3BKQzlwTEZ4dUlDQWdLaUFnSUNBZ0lDQmhSM0psWlhRZ1BTQmZMbWx6VTNSeWFXNW5LR0VwSUNZbUlISmxSM0psWlhRdWRHVnpkQ2hoS1N4Y2JpQWdJQ29nSUNBZ0lDQWdZa2R5WldWMElEMGdYeTVwYzFOMGNtbHVaeWhpS1NBbUppQnlaVWR5WldWMExuUmxjM1FvWWlrN1hHNGdJQ0FxWEc0Z0lDQXFJQ0FnY21WMGRYSnVJQ2hoUjNKbFpYUWdmSHdnWWtkeVpXVjBLU0EvSUNoaFIzSmxaWFFnUFQwZ1lrZHlaV1YwS1NBNklIVnVaR1ZtYVc1bFpEdGNiaUFnSUNvZ2ZTazdYRzRnSUNBcUlDOHZJRDArSUhSeWRXVmNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJR2x6UlhGMVlXd29ZU3dnWWl3Z1kyRnNiR0poWTJzc0lIUm9hWE5CY21jc0lITjBZV05yUVN3Z2MzUmhZMnRDS1NCN1hHNGdJQ0FnTHk4Z2RYTmxaQ0IwYnlCcGJtUnBZMkYwWlNCMGFHRjBJSGRvWlc0Z1kyOXRjR0Z5YVc1bklHOWlhbVZqZEhNc0lHQmhZQ0JvWVhNZ1lYUWdiR1ZoYzNRZ2RHaGxJSEJ5YjNCbGNuUnBaWE1nYjJZZ1lHSmdYRzRnSUNBZ2RtRnlJSGRvWlhKbFNXNWthV05oZEc5eUlEMGdZMkZzYkdKaFkyc2dQVDA5SUdsdVpHbGpZWFJ2Y2s5aWFtVmpkRHRjYmlBZ0lDQnBaaUFvWTJGc2JHSmhZMnNnSmlZZ0lYZG9aWEpsU1c1a2FXTmhkRzl5S1NCN1hHNGdJQ0FnSUNCallXeHNZbUZqYXlBOUlIUjVjR1Z2WmlCMGFHbHpRWEpuSUQwOUlDZDFibVJsWm1sdVpXUW5JRDhnWTJGc2JHSmhZMnNnT2lCamNtVmhkR1ZEWVd4c1ltRmpheWhqWVd4c1ltRmpheXdnZEdocGMwRnlaeXdnTWlrN1hHNGdJQ0FnSUNCMllYSWdjbVZ6ZFd4MElEMGdZMkZzYkdKaFkyc29ZU3dnWWlrN1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlISmxjM1ZzZENBaFBTQW5kVzVrWldacGJtVmtKeWtnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnSVNGeVpYTjFiSFE3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJR1Y0YVhRZ1pXRnliSGtnWm05eUlHbGtaVzUwYVdOaGJDQjJZV3gxWlhOY2JpQWdJQ0JwWmlBb1lTQTlQVDBnWWlrZ2UxeHVJQ0FnSUNBZ0x5OGdkSEpsWVhRZ1lDc3dZQ0IyY3k0Z1lDMHdZQ0JoY3lCdWIzUWdaWEYxWVd4Y2JpQWdJQ0FnSUhKbGRIVnliaUJoSUNFOVBTQXdJSHg4SUNneElDOGdZU0E5UFNBeElDOGdZaWs3WEc0Z0lDQWdmVnh1SUNBZ0lIWmhjaUIwZVhCbElEMGdkSGx3Wlc5bUlHRXNYRzRnSUNBZ0lDQWdJRzkwYUdWeVZIbHdaU0E5SUhSNWNHVnZaaUJpTzF4dVhHNGdJQ0FnTHk4Z1pYaHBkQ0JsWVhKc2VTQm1iM0lnZFc1c2FXdGxJSEJ5YVcxcGRHbDJaU0IyWVd4MVpYTmNiaUFnSUNCcFppQW9ZU0E5UFQwZ1lTQW1KbHh1SUNBZ0lDQWdJQ0FvSVdFZ2ZId2dLSFI1Y0dVZ0lUMGdKMloxYm1OMGFXOXVKeUFtSmlCMGVYQmxJQ0U5SUNkdlltcGxZM1FuS1NrZ0ppWmNiaUFnSUNBZ0lDQWdLQ0ZpSUh4OElDaHZkR2hsY2xSNWNHVWdJVDBnSjJaMWJtTjBhVzl1SnlBbUppQnZkR2hsY2xSNWNHVWdJVDBnSjI5aWFtVmpkQ2NwS1NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNBZ0lIMWNiaUFnSUNBdkx5QmxlR2wwSUdWaGNteDVJR1p2Y2lCZ2JuVnNiR0FnWVc1a0lHQjFibVJsWm1sdVpXUmdMQ0JoZG05cFpHbHVaeUJGVXpNbmN5QkdkVzVqZEdsdmJpTmpZV3hzSUdKbGFHRjJhVzl5WEc0Z0lDQWdMeThnYUhSMGNEb3ZMMlZ6TlM1bmFYUm9kV0l1WTI5dEx5TjRNVFV1TXk0MExqUmNiaUFnSUNCcFppQW9ZU0E5UFNCdWRXeHNJSHg4SUdJZ1BUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdFZ1BUMDlJR0k3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJR052YlhCaGNtVWdXMXREYkdGemMxMWRJRzVoYldWelhHNGdJQ0FnZG1GeUlHTnNZWE56VG1GdFpTQTlJSFJ2VTNSeWFXNW5MbU5oYkd3b1lTa3NYRzRnSUNBZ0lDQWdJRzkwYUdWeVEyeGhjM01nUFNCMGIxTjBjbWx1Wnk1allXeHNLR0lwTzF4dVhHNGdJQ0FnYVdZZ0tHTnNZWE56VG1GdFpTQTlQU0JoY21kelEyeGhjM01wSUh0Y2JpQWdJQ0FnSUdOc1lYTnpUbUZ0WlNBOUlHOWlhbVZqZEVOc1lYTnpPMXh1SUNBZ0lIMWNiaUFnSUNCcFppQW9iM1JvWlhKRGJHRnpjeUE5UFNCaGNtZHpRMnhoYzNNcElIdGNiaUFnSUNBZ0lHOTBhR1Z5UTJ4aGMzTWdQU0J2WW1wbFkzUkRiR0Z6Y3p0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0dOc1lYTnpUbUZ0WlNBaFBTQnZkR2hsY2tOc1lYTnpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJQ0FnZlZ4dUlDQWdJSE4zYVhSamFDQW9ZMnhoYzNOT1lXMWxLU0I3WEc0Z0lDQWdJQ0JqWVhObElHSnZiMnhEYkdGemN6cGNiaUFnSUNBZ0lHTmhjMlVnWkdGMFpVTnNZWE56T2x4dUlDQWdJQ0FnSUNBdkx5QmpiMlZ5WTJVZ1pHRjBaWE1nWVc1a0lHSnZiMnhsWVc1eklIUnZJRzUxYldKbGNuTXNJR1JoZEdWeklIUnZJRzFwYkd4cGMyVmpiMjVrY3lCaGJtUWdZbTl2YkdWaGJuTmNiaUFnSUNBZ0lDQWdMeThnZEc4Z1lERmdJRzl5SUdBd1lDd2dkSEpsWVhScGJtY2dhVzUyWVd4cFpDQmtZWFJsY3lCamIyVnlZMlZrSUhSdklHQk9ZVTVnSUdGeklHNXZkQ0JsY1hWaGJGeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z0syRWdQVDBnSzJJN1hHNWNiaUFnSUNBZ0lHTmhjMlVnYm5WdFltVnlRMnhoYzNNNlhHNGdJQ0FnSUNBZ0lDOHZJSFJ5WldGMElHQk9ZVTVnSUhaekxpQmdUbUZPWUNCaGN5QmxjWFZoYkZ4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWVNBaFBTQXJZVnh1SUNBZ0lDQWdJQ0FnSUQ4Z1lpQWhQU0FyWWx4dUlDQWdJQ0FnSUNBZ0lDOHZJR0oxZENCMGNtVmhkQ0JnS3pCZ0lIWnpMaUJnTFRCZ0lHRnpJRzV2ZENCbGNYVmhiRnh1SUNBZ0lDQWdJQ0FnSURvZ0tHRWdQVDBnTUNBL0lDZ3hJQzhnWVNBOVBTQXhJQzhnWWlrZ09pQmhJRDA5SUN0aUtUdGNibHh1SUNBZ0lDQWdZMkZ6WlNCeVpXZGxlSEJEYkdGemN6cGNiaUFnSUNBZ0lHTmhjMlVnYzNSeWFXNW5RMnhoYzNNNlhHNGdJQ0FnSUNBZ0lDOHZJR052WlhKalpTQnlaV2RsZUdWeklIUnZJSE4wY21sdVozTWdLR2gwZEhBNkx5OWxjelV1WjJsMGFIVmlMbU52YlM4amVERTFMakV3TGpZdU5DbGNiaUFnSUNBZ0lDQWdMeThnZEhKbFlYUWdjM1J5YVc1bklIQnlhVzFwZEdsMlpYTWdZVzVrSUhSb1pXbHlJR052Y25KbGMzQnZibVJwYm1jZ2IySnFaV04wSUdsdWMzUmhibU5sY3lCaGN5QmxjWFZoYkZ4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWVNBOVBTQmlJQ3NnSnljN1hHNGdJQ0FnZlZ4dUlDQWdJSFpoY2lCcGMwRnljaUE5SUdOc1lYTnpUbUZ0WlNBOVBTQmhjbkpoZVVOc1lYTnpPMXh1SUNBZ0lHbG1JQ2doYVhOQmNuSXBJSHRjYmlBZ0lDQWdJQzh2SUhWdWQzSmhjQ0JoYm5rZ1lHeHZaR0Z6YUdBZ2QzSmhjSEJsWkNCMllXeDFaWE5jYmlBZ0lDQWdJR2xtSUNoaExsOWZkM0poY0hCbFpGOWZJSHg4SUdJdVgxOTNjbUZ3Y0dWa1gxOHBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR2x6UlhGMVlXd29ZUzVmWDNkeVlYQndaV1JmWHlCOGZDQmhMQ0JpTGw5ZmQzSmhjSEJsWkY5ZklIeDhJR0lzSUdOaGJHeGlZV05yTENCMGFHbHpRWEpuTENCemRHRmphMEVzSUhOMFlXTnJRaWs3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0F2THlCbGVHbDBJR1p2Y2lCbWRXNWpkR2x2Ym5NZ1lXNWtJRVJQVFNCdWIyUmxjMXh1SUNBZ0lDQWdhV1lnS0dOc1lYTnpUbUZ0WlNBaFBTQnZZbXBsWTNSRGJHRnpjeWtnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQXZMeUJwYmlCdmJHUmxjaUIyWlhKemFXOXVjeUJ2WmlCUGNHVnlZU3dnWUdGeVozVnRaVzUwYzJBZ2IySnFaV04wY3lCb1lYWmxJR0JCY25KaGVXQWdZMjl1YzNSeWRXTjBiM0p6WEc0Z0lDQWdJQ0IyWVhJZ1kzUnZja0VnUFNCaExtTnZibk4wY25WamRHOXlMRnh1SUNBZ0lDQWdJQ0FnSUdOMGIzSkNJRDBnWWk1amIyNXpkSEoxWTNSdmNqdGNibHh1SUNBZ0lDQWdMeThnYm05dUlHQlBZbXBsWTNSZ0lHOWlhbVZqZENCcGJuTjBZVzVqWlhNZ2QybDBhQ0JrYVdabVpYSmxiblFnWTI5dWMzUnlkV04wYjNKeklHRnlaU0J1YjNRZ1pYRjFZV3hjYmlBZ0lDQWdJR2xtSUNoamRHOXlRU0FoUFNCamRHOXlRaUFtSmlBaEtGeHVJQ0FnSUNBZ0lDQWdJQ0FnYVhOR2RXNWpkR2x2YmloamRHOXlRU2tnSmlZZ1kzUnZja0VnYVc1emRHRnVZMlZ2WmlCamRHOXlRU0FtSmx4dUlDQWdJQ0FnSUNBZ0lDQWdhWE5HZFc1amRHbHZiaWhqZEc5eVFpa2dKaVlnWTNSdmNrSWdhVzV6ZEdGdVkyVnZaaUJqZEc5eVFseHVJQ0FnSUNBZ0lDQWdJQ2twSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNBdkx5QmhjM04xYldVZ1kzbGpiR2xqSUhOMGNuVmpkSFZ5WlhNZ1lYSmxJR1Z4ZFdGc1hHNGdJQ0FnTHk4Z2RHaGxJR0ZzWjI5eWFYUm9iU0JtYjNJZ1pHVjBaV04wYVc1bklHTjVZMnhwWXlCemRISjFZM1IxY21WeklHbHpJR0ZrWVhCMFpXUWdabkp2YlNCRlV5QTFMakZjYmlBZ0lDQXZMeUJ6WldOMGFXOXVJREUxTGpFeUxqTXNJR0ZpYzNSeVlXTjBJRzl3WlhKaGRHbHZiaUJnU2s5Z0lDaG9kSFJ3T2k4dlpYTTFMbWRwZEdoMVlpNWpiMjB2STNneE5TNHhNaTR6S1Z4dUlDQWdJSE4wWVdOclFTQjhmQ0FvYzNSaFkydEJJRDBnVzEwcE8xeHVJQ0FnSUhOMFlXTnJRaUI4ZkNBb2MzUmhZMnRDSUQwZ1cxMHBPMXh1WEc0Z0lDQWdkbUZ5SUd4bGJtZDBhQ0E5SUhOMFlXTnJRUzVzWlc1bmRHZzdYRzRnSUNBZ2QyaHBiR1VnS0d4bGJtZDBhQzB0S1NCN1hHNGdJQ0FnSUNCcFppQW9jM1JoWTJ0QlcyeGxibWQwYUYwZ1BUMGdZU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYzNSaFkydENXMnhsYm1kMGFGMGdQVDBnWWp0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lDQWdkbUZ5SUhOcGVtVWdQU0F3TzF4dUlDQWdJSEpsYzNWc2RDQTlJSFJ5ZFdVN1hHNWNiaUFnSUNBdkx5QmhaR1FnWUdGZ0lHRnVaQ0JnWW1BZ2RHOGdkR2hsSUhOMFlXTnJJRzltSUhSeVlYWmxjbk5sWkNCdlltcGxZM1J6WEc0Z0lDQWdjM1JoWTJ0QkxuQjFjMmdvWVNrN1hHNGdJQ0FnYzNSaFkydENMbkIxYzJnb1lpazdYRzVjYmlBZ0lDQXZMeUJ5WldOMWNuTnBkbVZzZVNCamIyMXdZWEpsSUc5aWFtVmpkSE1nWVc1a0lHRnljbUY1Y3lBb2MzVnpZMlZ3ZEdsaWJHVWdkRzhnWTJGc2JDQnpkR0ZqYXlCc2FXMXBkSE1wWEc0Z0lDQWdhV1lnS0dselFYSnlLU0I3WEc0Z0lDQWdJQ0JzWlc1bmRHZ2dQU0JoTG14bGJtZDBhRHRjYmlBZ0lDQWdJSE5wZW1VZ1BTQmlMbXhsYm1kMGFEdGNibHh1SUNBZ0lDQWdMeThnWTI5dGNHRnlaU0JzWlc1bmRHaHpJSFJ2SUdSbGRHVnliV2x1WlNCcFppQmhJR1JsWlhBZ1kyOXRjR0Z5YVhOdmJpQnBjeUJ1WldObGMzTmhjbmxjYmlBZ0lDQWdJSEpsYzNWc2RDQTlJSE5wZW1VZ1BUMGdZUzVzWlc1bmRHZzdYRzRnSUNBZ0lDQnBaaUFvSVhKbGMzVnNkQ0FtSmlBaGQyaGxjbVZKYm1ScFkyRjBiM0lwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhKbGMzVnNkRHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJQzh2SUdSbFpYQWdZMjl0Y0dGeVpTQjBhR1VnWTI5dWRHVnVkSE1zSUdsbmJtOXlhVzVuSUc1dmJpMXVkVzFsY21saklIQnliM0JsY25ScFpYTmNiaUFnSUNBZ0lIZG9hV3hsSUNoemFYcGxMUzBwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJR2x1WkdWNElEMGdiR1Z1WjNSb0xGeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1Gc2RXVWdQU0JpVzNOcGVtVmRPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDNhR1Z5WlVsdVpHbGpZWFJ2Y2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJSGRvYVd4bElDaHBibVJsZUMwdEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9LSEpsYzNWc2RDQTlJR2x6UlhGMVlXd29ZVnRwYm1SbGVGMHNJSFpoYkhWbExDQmpZV3hzWW1GamF5d2dkR2hwYzBGeVp5d2djM1JoWTJ0QkxDQnpkR0ZqYTBJcEtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMGdaV3h6WlNCcFppQW9JU2h5WlhOMWJIUWdQU0JwYzBWeGRXRnNLR0ZiYzJsNlpWMHNJSFpoYkhWbExDQmpZV3hzWW1GamF5d2dkR2hwYzBGeVp5d2djM1JoWTJ0QkxDQnpkR0ZqYTBJcEtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4ME8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCa1pXVndJR052YlhCaGNtVWdiMkpxWldOMGN5QjFjMmx1WnlCZ1ptOXlTVzVnTENCcGJuTjBaV0ZrSUc5bUlHQm1iM0pQZDI1Z0xDQjBieUJoZG05cFpDQmdUMkpxWldOMExtdGxlWE5nWEc0Z0lDQWdMeThnZDJocFkyZ3NJR2x1SUhSb2FYTWdZMkZ6WlN3Z2FYTWdiVzl5WlNCamIzTjBiSGxjYmlBZ0lDQm1iM0pKYmloaUxDQm1kVzVqZEdsdmJpaDJZV3gxWlN3Z2EyVjVMQ0JpS1NCN1hHNGdJQ0FnSUNCcFppQW9hR0Z6VDNkdVVISnZjR1Z5ZEhrdVkyRnNiQ2hpTENCclpYa3BLU0I3WEc0Z0lDQWdJQ0FnSUM4dklHTnZkVzUwSUhSb1pTQnVkVzFpWlhJZ2IyWWdjSEp2Y0dWeWRHbGxjeTVjYmlBZ0lDQWdJQ0FnYzJsNlpTc3JPMXh1SUNBZ0lDQWdJQ0F2THlCa1pXVndJR052YlhCaGNtVWdaV0ZqYUNCd2NtOXdaWEowZVNCMllXeDFaUzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJQ2h5WlhOMWJIUWdQU0JvWVhOUGQyNVFjbTl3WlhKMGVTNWpZV3hzS0dFc0lHdGxlU2tnSmlZZ2FYTkZjWFZoYkNoaFcydGxlVjBzSUhaaGJIVmxMQ0JqWVd4c1ltRmpheXdnZEdocGMwRnlaeXdnYzNSaFkydEJMQ0J6ZEdGamEwSXBLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJR2xtSUNoeVpYTjFiSFFnSmlZZ0lYZG9aWEpsU1c1a2FXTmhkRzl5S1NCN1hHNGdJQ0FnSUNBdkx5Qmxibk4xY21VZ1ltOTBhQ0J2WW1wbFkzUnpJR2hoZG1VZ2RHaGxJSE5oYldVZ2JuVnRZbVZ5SUc5bUlIQnliM0JsY25ScFpYTmNiaUFnSUNBZ0lHWnZja2x1S0dFc0lHWjFibU4wYVc5dUtIWmhiSFZsTENCclpYa3NJR0VwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLR2hoYzA5M2JsQnliM0JsY25SNUxtTmhiR3dvWVN3Z2EyVjVLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJR0J6YVhwbFlDQjNhV3hzSUdKbElHQXRNV0FnYVdZZ1lHRmdJR2hoY3lCdGIzSmxJSEJ5YjNCbGNuUnBaWE1nZEdoaGJpQmdZbUJjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnS0hKbGMzVnNkQ0E5SUMwdGMybDZaU0ErSUMweEtUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1EyaGxZMnR6SUdsbUlHQjJZV3gxWldBZ2FYTXNJRzl5SUdOaGJpQmlaU0JqYjJWeVkyVmtJSFJ2TENCaElHWnBibWwwWlNCdWRXMWlaWEl1WEc0Z0lDQXFYRzRnSUNBcUlFNXZkR1U2SUZSb2FYTWdhWE1nYm05MElIUm9aU0J6WVcxbElHRnpJRzVoZEdsMlpTQmdhWE5HYVc1cGRHVmdMQ0IzYUdsamFDQjNhV3hzSUhKbGRIVnliaUIwY25WbElHWnZjbHh1SUNBZ0tpQmliMjlzWldGdWN5QmhibVFnWlcxd2RIa2djM1J5YVc1bmN5NGdVMlZsSUdoMGRIQTZMeTlsY3pVdVoybDBhSFZpTG1OdmJTOGplREUxTGpFdU1pNDFMbHh1SUNBZ0tseHVJQ0FnS2lCQWMzUmhkR2xqWEc0Z0lDQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JQWW1wbFkzUnpYRzRnSUNBcUlFQndZWEpoYlNCN1RXbDRaV1I5SUhaaGJIVmxJRlJvWlNCMllXeDFaU0IwYnlCamFHVmpheTVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMEp2YjJ4bFlXNTlJRkpsZEhWeWJuTWdZSFJ5ZFdWZ0xDQnBaaUIwYUdVZ1lIWmhiSFZsWUNCcGN5Qm1hVzVwZEdVc0lHVnNjMlVnWUdaaGJITmxZQzVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nWHk1cGMwWnBibWwwWlNndE1UQXhLVHRjYmlBZ0lDb2dMeThnUFQ0Z2RISjFaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtbHpSbWx1YVhSbEtDY3hNQ2NwTzF4dUlDQWdLaUF2THlBOVBpQjBjblZsWEc0Z0lDQXFYRzRnSUNBcUlGOHVhWE5HYVc1cGRHVW9kSEoxWlNrN1hHNGdJQ0FxSUM4dklEMCtJR1poYkhObFhHNGdJQ0FxWEc0Z0lDQXFJRjh1YVhOR2FXNXBkR1VvSnljcE8xeHVJQ0FnS2lBdkx5QTlQaUJtWVd4elpWeHVJQ0FnS2x4dUlDQWdLaUJmTG1selJtbHVhWFJsS0VsdVptbHVhWFI1S1R0Y2JpQWdJQ29nTHk4Z1BUNGdabUZzYzJWY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlHbHpSbWx1YVhSbEtIWmhiSFZsS1NCN1hHNGdJQ0FnY21WMGRYSnVJRzVoZEdsMlpVbHpSbWx1YVhSbEtIWmhiSFZsS1NBbUppQWhibUYwYVhabFNYTk9ZVTRvY0dGeWMyVkdiRzloZENoMllXeDFaU2twTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTm9aV05yY3lCcFppQmdkbUZzZFdWZ0lHbHpJR0VnWm5WdVkzUnBiMjR1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUU5aWFtVmpkSE5jYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ2RtRnNkV1VnVkdobElIWmhiSFZsSUhSdklHTm9aV05yTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQXNJR2xtSUhSb1pTQmdkbUZzZFdWZ0lHbHpJR0VnWm5WdVkzUnBiMjRzSUdWc2MyVWdZR1poYkhObFlDNWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dYeTVwYzBaMWJtTjBhVzl1S0Y4cE8xeHVJQ0FnS2lBdkx5QTlQaUIwY25WbFhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQnBjMFoxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSNWNHVnZaaUIyWVd4MVpTQTlQU0FuWm5WdVkzUnBiMjRuTzF4dUlDQjlYRzRnSUM4dklHWmhiR3hpWVdOcklHWnZjaUJ2YkdSbGNpQjJaWEp6YVc5dWN5QnZaaUJEYUhKdmJXVWdZVzVrSUZOaFptRnlhVnh1SUNCcFppQW9hWE5HZFc1amRHbHZiaWd2ZUM4cEtTQjdYRzRnSUNBZ2FYTkdkVzVqZEdsdmJpQTlJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RtRnNkV1VnYVc1emRHRnVZMlZ2WmlCR2RXNWpkR2x2YmlCOGZDQjBiMU4wY21sdVp5NWpZV3hzS0haaGJIVmxLU0E5UFNCbWRXNWpRMnhoYzNNN1hHNGdJQ0FnZlR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRhR1ZqYTNNZ2FXWWdZSFpoYkhWbFlDQnBjeUIwYUdVZ2JHRnVaM1ZoWjJVZ2RIbHdaU0J2WmlCUFltcGxZM1F1WEc0Z0lDQXFJQ2hsTG1jdUlHRnljbUY1Y3l3Z1puVnVZM1JwYjI1ekxDQnZZbXBsWTNSekxDQnlaV2RsZUdWekxDQmdibVYzSUU1MWJXSmxjaWd3S1dBc0lHRnVaQ0JnYm1WM0lGTjBjbWx1Wnlnbkp5bGdLVnh1SUNBZ0tseHVJQ0FnS2lCQWMzUmhkR2xqWEc0Z0lDQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JQWW1wbFkzUnpYRzRnSUNBcUlFQndZWEpoYlNCN1RXbDRaV1I5SUhaaGJIVmxJRlJvWlNCMllXeDFaU0IwYnlCamFHVmpheTVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMEp2YjJ4bFlXNTlJRkpsZEhWeWJuTWdZSFJ5ZFdWZ0xDQnBaaUIwYUdVZ1lIWmhiSFZsWUNCcGN5QmhiaUJ2WW1wbFkzUXNJR1ZzYzJVZ1lHWmhiSE5sWUM1Y2JpQWdJQ29nUUdWNFlXMXdiR1ZjYmlBZ0lDcGNiaUFnSUNvZ1h5NXBjMDlpYW1WamRDaDdmU2s3WEc0Z0lDQXFJQzh2SUQwK0lIUnlkV1ZjYmlBZ0lDcGNiaUFnSUNvZ1h5NXBjMDlpYW1WamRDaGJNU3dnTWl3Z00xMHBPMXh1SUNBZ0tpQXZMeUE5UGlCMGNuVmxYRzRnSUNBcVhHNGdJQ0FxSUY4dWFYTlBZbXBsWTNRb01TazdYRzRnSUNBcUlDOHZJRDArSUdaaGJITmxYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJwYzA5aWFtVmpkQ2gyWVd4MVpTa2dlMXh1SUNBZ0lDOHZJR05vWldOcklHbG1JSFJvWlNCMllXeDFaU0JwY3lCMGFHVWdSVU5OUVZOamNtbHdkQ0JzWVc1bmRXRm5aU0IwZVhCbElHOW1JRTlpYW1WamRGeHVJQ0FnSUM4dklHaDBkSEE2THk5bGN6VXVaMmwwYUhWaUxtTnZiUzhqZURoY2JpQWdJQ0F2THlCaGJtUWdZWFp2YVdRZ1lTQldPQ0JpZFdkY2JpQWdJQ0F2THlCb2RIUndPaTh2WTI5a1pTNW5iMjluYkdVdVkyOXRMM0F2ZGpndmFYTnpkV1Z6TDJSbGRHRnBiRDlwWkQweU1qa3hYRzRnSUNBZ2NtVjBkWEp1SUhaaGJIVmxJRDhnYjJKcVpXTjBWSGx3WlhOYmRIbHdaVzltSUhaaGJIVmxYU0E2SUdaaGJITmxPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVOb1pXTnJjeUJwWmlCZ2RtRnNkV1ZnSUdseklHQk9ZVTVnTGx4dUlDQWdLbHh1SUNBZ0tpQk9iM1JsT2lCVWFHbHpJR2x6SUc1dmRDQjBhR1VnYzJGdFpTQmhjeUJ1WVhScGRtVWdZR2x6VG1GT1lDd2dkMmhwWTJnZ2QybHNiQ0J5WlhSMWNtNGdZSFJ5ZFdWZ0lHWnZjbHh1SUNBZ0tpQmdkVzVrWldacGJtVmtZQ0JoYm1RZ2IzUm9aWElnZG1Gc2RXVnpMaUJUWldVZ2FIUjBjRG92TDJWek5TNW5hWFJvZFdJdVkyOXRMeU40TVRVdU1TNHlMalF1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUU5aWFtVmpkSE5jYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ2RtRnNkV1VnVkdobElIWmhiSFZsSUhSdklHTm9aV05yTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQXNJR2xtSUhSb1pTQmdkbUZzZFdWZ0lHbHpJR0JPWVU1Z0xDQmxiSE5sSUdCbVlXeHpaV0F1WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUY4dWFYTk9ZVTRvVG1GT0tUdGNiaUFnSUNvZ0x5OGdQVDRnZEhKMVpWeHVJQ0FnS2x4dUlDQWdLaUJmTG1selRtRk9LRzVsZHlCT2RXMWlaWElvVG1GT0tTazdYRzRnSUNBcUlDOHZJRDArSUhSeWRXVmNiaUFnSUNwY2JpQWdJQ29nYVhOT1lVNG9kVzVrWldacGJtVmtLVHRjYmlBZ0lDb2dMeThnUFQ0Z2RISjFaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtbHpUbUZPS0hWdVpHVm1hVzVsWkNrN1hHNGdJQ0FxSUM4dklEMCtJR1poYkhObFhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQnBjMDVoVGloMllXeDFaU2tnZTF4dUlDQWdJQzh2SUdCT1lVNWdJR0Z6SUdFZ2NISnBiV2wwYVhabElHbHpJSFJvWlNCdmJteDVJSFpoYkhWbElIUm9ZWFFnYVhNZ2JtOTBJR1Z4ZFdGc0lIUnZJR2wwYzJWc1pseHVJQ0FnSUM4dklDaHdaWEptYjNKdElIUm9aU0JiVzBOc1lYTnpYVjBnWTJobFkyc2dabWx5YzNRZ2RHOGdZWFp2YVdRZ1pYSnliM0p6SUhkcGRHZ2djMjl0WlNCb2IzTjBJRzlpYW1WamRITWdhVzRnU1VVcFhHNGdJQ0FnY21WMGRYSnVJR2x6VG5WdFltVnlLSFpoYkhWbEtTQW1KaUIyWVd4MVpTQWhQU0FyZG1Gc2RXVmNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJEYUdWamEzTWdhV1lnWUhaaGJIVmxZQ0JwY3lCZ2JuVnNiR0F1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUU5aWFtVmpkSE5jYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ2RtRnNkV1VnVkdobElIWmhiSFZsSUhSdklHTm9aV05yTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQXNJR2xtSUhSb1pTQmdkbUZzZFdWZ0lHbHpJR0J1ZFd4c1lDd2daV3h6WlNCZ1ptRnNjMlZnTGx4dUlDQWdLaUJBWlhoaGJYQnNaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtbHpUblZzYkNodWRXeHNLVHRjYmlBZ0lDb2dMeThnUFQ0Z2RISjFaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtbHpUblZzYkNoMWJtUmxabWx1WldRcE8xeHVJQ0FnS2lBdkx5QTlQaUJtWVd4elpWeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdhWE5PZFd4c0tIWmhiSFZsS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFpoYkhWbElEMDlQU0J1ZFd4c08xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU5vWldOcmN5QnBaaUJnZG1Gc2RXVmdJR2x6SUdFZ2JuVnRZbVZ5TGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCUFltcGxZM1J6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUV2w0WldSOUlIWmhiSFZsSUZSb1pTQjJZV3gxWlNCMGJ5QmphR1ZqYXk1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBKdmIyeGxZVzU5SUZKbGRIVnlibk1nWUhSeWRXVmdMQ0JwWmlCMGFHVWdZSFpoYkhWbFlDQnBjeUJoSUc1MWJXSmxjaXdnWld4elpTQmdabUZzYzJWZ0xseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQmZMbWx6VG5WdFltVnlLRGd1TkNBcUlEVXBPMXh1SUNBZ0tpQXZMeUE5UGlCMGNuVmxYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJwYzA1MWJXSmxjaWgyWVd4MVpTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGVYQmxiMllnZG1Gc2RXVWdQVDBnSjI1MWJXSmxjaWNnZkh3Z2RHOVRkSEpwYm1jdVkyRnNiQ2gyWVd4MVpTa2dQVDBnYm5WdFltVnlRMnhoYzNNN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMmhsWTJ0eklHbG1JR0VnWjJsMlpXNGdZSFpoYkhWbFlDQnBjeUJoYmlCdlltcGxZM1FnWTNKbFlYUmxaQ0JpZVNCMGFHVWdZRTlpYW1WamRHQWdZMjl1YzNSeWRXTjBiM0l1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUU5aWFtVmpkSE5jYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ2RtRnNkV1VnVkdobElIWmhiSFZsSUhSdklHTm9aV05yTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQXNJR2xtSUdCMllXeDFaV0FnYVhNZ1lTQndiR0ZwYmlCdlltcGxZM1FzSUdWc2MyVWdZR1poYkhObFlDNWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dablZ1WTNScGIyNGdVM1J2YjJkbEtHNWhiV1VzSUdGblpTa2dlMXh1SUNBZ0tpQWdJSFJvYVhNdWJtRnRaU0E5SUc1aGJXVTdYRzRnSUNBcUlDQWdkR2hwY3k1aFoyVWdQU0JoWjJVN1hHNGdJQ0FxSUgxY2JpQWdJQ3BjYmlBZ0lDb2dYeTVwYzFCc1lXbHVUMkpxWldOMEtHNWxkeUJUZEc5dloyVW9KMjF2WlNjc0lEUXdLU2s3WEc0Z0lDQXFJQzh2SUQwK0lHWmhiSE5sWEc0Z0lDQXFYRzRnSUNBcUlGOHVhWE5RYkdGcGJrOWlhbVZqZENoYk1Td2dNaXdnTTEwcE8xeHVJQ0FnS2lBdkx5QTlQaUJtWVd4elpWeHVJQ0FnS2x4dUlDQWdLaUJmTG1selVHeGhhVzVQWW1wbFkzUW9leUFuYm1GdFpTYzZJQ2R0YjJVbkxDQW5ZV2RsSnpvZ05EQWdmU2s3WEc0Z0lDQXFJQzh2SUQwK0lIUnlkV1ZjYmlBZ0lDb3ZYRzRnSUhaaGNpQnBjMUJzWVdsdVQySnFaV04wSUQwZ0lXZGxkRkJ5YjNSdmRIbHdaVTltSUQ4Z2MyaHBiVWx6VUd4aGFXNVBZbXBsWTNRZ09pQm1kVzVqZEdsdmJpaDJZV3gxWlNrZ2UxeHVJQ0FnSUdsbUlDZ2hLSFpoYkhWbElDWW1JSFI1Y0dWdlppQjJZV3gxWlNBOVBTQW5iMkpxWldOMEp5a3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdJQ0I5WEc0Z0lDQWdkbUZ5SUhaaGJIVmxUMllnUFNCMllXeDFaUzUyWVd4MVpVOW1MRnh1SUNBZ0lDQWdJQ0J2WW1wUWNtOTBieUE5SUhSNWNHVnZaaUIyWVd4MVpVOW1JRDA5SUNkbWRXNWpkR2x2YmljZ0ppWWdLRzlpYWxCeWIzUnZJRDBnWjJWMFVISnZkRzkwZVhCbFQyWW9kbUZzZFdWUFppa3BJQ1ltSUdkbGRGQnliM1J2ZEhsd1pVOW1LRzlpYWxCeWIzUnZLVHRjYmx4dUlDQWdJSEpsZEhWeWJpQnZZbXBRY205MGIxeHVJQ0FnSUNBZ1B5QjJZV3gxWlNBOVBTQnZZbXBRY205MGJ5QjhmQ0FvWjJWMFVISnZkRzkwZVhCbFQyWW9kbUZzZFdVcElEMDlJRzlpYWxCeWIzUnZJQ1ltSUNGcGMwRnlaM1Z0Wlc1MGN5aDJZV3gxWlNrcFhHNGdJQ0FnSUNBNklITm9hVzFKYzFCc1lXbHVUMkpxWldOMEtIWmhiSFZsS1R0Y2JpQWdmVHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMmhsWTJ0eklHbG1JR0IyWVd4MVpXQWdhWE1nWVNCeVpXZDFiR0Z5SUdWNGNISmxjM05wYjI0dVhHNGdJQ0FxWEc0Z0lDQXFJRUJ6ZEdGMGFXTmNiaUFnSUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFnSUNvZ1FHTmhkR1ZuYjNKNUlFOWlhbVZqZEhOY2JpQWdJQ29nUUhCaGNtRnRJSHROYVhobFpIMGdkbUZzZFdVZ1ZHaGxJSFpoYkhWbElIUnZJR05vWldOckxseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1FtOXZiR1ZoYm4wZ1VtVjBkWEp1Y3lCZ2RISjFaV0FzSUdsbUlIUm9aU0JnZG1Gc2RXVmdJR2x6SUdFZ2NtVm5kV3hoY2lCbGVIQnlaWE56YVc5dUxDQmxiSE5sSUdCbVlXeHpaV0F1WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUY4dWFYTlNaV2RGZUhBb0wyMXZaUzhwTzF4dUlDQWdLaUF2THlBOVBpQjBjblZsWEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCcGMxSmxaMFY0Y0NoMllXeDFaU2tnZTF4dUlDQWdJSEpsZEhWeWJpQjJZV3gxWlNCcGJuTjBZVzVqWlc5bUlGSmxaMFY0Y0NCOGZDQjBiMU4wY21sdVp5NWpZV3hzS0haaGJIVmxLU0E5UFNCeVpXZGxlSEJEYkdGemN6dGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJEYUdWamEzTWdhV1lnWUhaaGJIVmxZQ0JwY3lCaElITjBjbWx1Wnk1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1QySnFaV04wYzF4dUlDQWdLaUJBY0dGeVlXMGdlMDFwZUdWa2ZTQjJZV3gxWlNCVWFHVWdkbUZzZFdVZ2RHOGdZMmhsWTJzdVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0Q2IyOXNaV0Z1ZlNCU1pYUjFjbTV6SUdCMGNuVmxZQ3dnYVdZZ2RHaGxJR0IyWVd4MVpXQWdhWE1nWVNCemRISnBibWNzSUdWc2MyVWdZR1poYkhObFlDNWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dYeTVwYzFOMGNtbHVaeWduYlc5bEp5azdYRzRnSUNBcUlDOHZJRDArSUhSeWRXVmNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJR2x6VTNSeWFXNW5LSFpoYkhWbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSNWNHVnZaaUIyWVd4MVpTQTlQU0FuYzNSeWFXNW5KeUI4ZkNCMGIxTjBjbWx1Wnk1allXeHNLSFpoYkhWbEtTQTlQU0J6ZEhKcGJtZERiR0Z6Y3p0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRhR1ZqYTNNZ2FXWWdZSFpoYkhWbFlDQnBjeUJnZFc1a1pXWnBibVZrWUM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1QySnFaV04wYzF4dUlDQWdLaUJBY0dGeVlXMGdlMDFwZUdWa2ZTQjJZV3gxWlNCVWFHVWdkbUZzZFdVZ2RHOGdZMmhsWTJzdVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0Q2IyOXNaV0Z1ZlNCU1pYUjFjbTV6SUdCMGNuVmxZQ3dnYVdZZ2RHaGxJR0IyWVd4MVpXQWdhWE1nWUhWdVpHVm1hVzVsWkdBc0lHVnNjMlVnWUdaaGJITmxZQzVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nWHk1cGMxVnVaR1ZtYVc1bFpDaDJiMmxrSURBcE8xeHVJQ0FnS2lBdkx5QTlQaUIwY25WbFhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQnBjMVZ1WkdWbWFXNWxaQ2gyWVd4MVpTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGVYQmxiMllnZG1Gc2RXVWdQVDBnSjNWdVpHVm1hVzVsWkNjN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbVZqZFhKemFYWmxiSGtnYldWeVoyVnpJRzkzYmlCbGJuVnRaWEpoWW14bElIQnliM0JsY25ScFpYTWdiMllnZEdobElITnZkWEpqWlNCdlltcGxZM1FvY3lrc0lIUm9ZWFJjYmlBZ0lDb2daRzl1SjNRZ2NtVnpiMngyWlNCMGJ5QmdkVzVrWldacGJtVmtZQ3dnYVc1MGJ5QjBhR1VnWkdWemRHbHVZWFJwYjI0Z2IySnFaV04wTGlCVGRXSnpaWEYxWlc1MElITnZkWEpqWlhOY2JpQWdJQ29nZDJsc2JDQnZkbVZ5ZDNKcGRHVWdjSEp2Y0dWeWVTQmhjM05wWjI1dFpXNTBjeUJ2WmlCd2NtVjJhVzkxY3lCemIzVnlZMlZ6TGlCSlppQmhJR0JqWVd4c1ltRmphMkFnWm5WdVkzUnBiMjVjYmlBZ0lDb2dhWE1nY0dGemMyVmtMQ0JwZENCM2FXeHNJR0psSUdWNFpXTjFkR1ZrSUhSdklIQnliMlIxWTJVZ2RHaGxJRzFsY21kbFpDQjJZV3gxWlhNZ2IyWWdkR2hsSUdSbGMzUnBibUYwYVc5dVhHNGdJQ0FxSUdGdVpDQnpiM1Z5WTJVZ2NISnZjR1Z5ZEdsbGN5NGdTV1lnWUdOaGJHeGlZV05yWUNCeVpYUjFjbTV6SUdCMWJtUmxabWx1WldSZ0xDQnRaWEpuYVc1bklIZHBiR3dnWW1WY2JpQWdJQ29nYUdGdVpHeGxaQ0JpZVNCMGFHVWdiV1YwYUc5a0lHbHVjM1JsWVdRdUlGUm9aU0JnWTJGc2JHSmhZMnRnSUdseklHSnZkVzVrSUhSdklHQjBhR2x6UVhKbllDQmhibVJjYmlBZ0lDb2dhVzUyYjJ0bFpDQjNhWFJvSUhSM2J5QmhjbWQxYldWdWRITTdJQ2h2WW1wbFkzUldZV3gxWlN3Z2MyOTFjbU5sVm1Gc2RXVXBMbHh1SUNBZ0tseHVJQ0FnS2lCQWMzUmhkR2xqWEc0Z0lDQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JQWW1wbFkzUnpYRzRnSUNBcUlFQndZWEpoYlNCN1QySnFaV04wZlNCdlltcGxZM1FnVkdobElHUmxjM1JwYm1GMGFXOXVJRzlpYW1WamRDNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUZ0emIzVnlZMlV4TENCemIzVnlZMlV5TENBdUxpNWRJRlJvWlNCemIzVnlZMlVnYjJKcVpXTjBjeTVjYmlBZ0lDb2dRSEJoY21GdElIdEdkVzVqZEdsdmJuMGdXMk5oYkd4aVlXTnJYU0JVYUdVZ1puVnVZM1JwYjI0Z2RHOGdZM1Z6ZEc5dGFYcGxJRzFsY21kcGJtY2djSEp2Y0dWeWRHbGxjeTVjYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ1czUm9hWE5CY21kZElGUm9aU0JnZEdocGMyQWdZbWx1WkdsdVp5QnZaaUJnWTJGc2JHSmhZMnRnTGx4dUlDQWdLaUJBY0dGeVlXMHRJSHRQWW1wbFkzUjlJRnRrWldWd1NXNWthV05oZEc5eVhTQkpiblJsY201aGJHeDVJSFZ6WldRZ2RHOGdhVzVrYVdOaGRHVWdkR2hoZENCZ2MzUmhZMnRCWUZ4dUlDQWdLaUFnWVc1a0lHQnpkR0ZqYTBKZ0lHRnlaU0JoY25KaGVYTWdiMllnZEhKaGRtVnljMlZrSUc5aWFtVmpkSE1nYVc1emRHVmhaQ0J2WmlCemIzVnlZMlVnYjJKcVpXTjBjeTVjYmlBZ0lDb2dRSEJoY21GdExTQjdRWEp5WVhsOUlGdHpkR0ZqYTBFOVcxMWRJRWx1ZEdWeWJtRnNiSGtnZFhObFpDQjBieUIwY21GamF5QjBjbUYyWlhKelpXUWdjMjkxY21ObElHOWlhbVZqZEhNdVhHNGdJQ0FxSUVCd1lYSmhiUzBnZTBGeWNtRjVmU0JiYzNSaFkydENQVnRkWFNCSmJuUmxjbTVoYkd4NUlIVnpaV1FnZEc4Z1lYTnpiMk5wWVhSbElIWmhiSFZsY3lCM2FYUm9JSFJvWldseVhHNGdJQ0FxSUNCemIzVnlZMlVnWTI5MWJuUmxjbkJoY25SekxseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1QySnFaV04wZlNCU1pYUjFjbTV6SUhSb1pTQmtaWE4wYVc1aGRHbHZiaUJ2WW1wbFkzUXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCdVlXMWxjeUE5SUh0Y2JpQWdJQ29nSUNBbmMzUnZiMmRsY3ljNklGdGNiaUFnSUNvZ0lDQWdJSHNnSjI1aGJXVW5PaUFuYlc5bEp5QjlMRnh1SUNBZ0tpQWdJQ0FnZXlBbmJtRnRaU2M2SUNkc1lYSnllU2NnZlZ4dUlDQWdLaUFnSUYxY2JpQWdJQ29nZlR0Y2JpQWdJQ3BjYmlBZ0lDb2dkbUZ5SUdGblpYTWdQU0I3WEc0Z0lDQXFJQ0FnSjNOMGIyOW5aWE1uT2lCYlhHNGdJQ0FxSUNBZ0lDQjdJQ2RoWjJVbk9pQTBNQ0I5TEZ4dUlDQWdLaUFnSUNBZ2V5QW5ZV2RsSnpvZ05UQWdmVnh1SUNBZ0tpQWdJRjFjYmlBZ0lDb2dmVHRjYmlBZ0lDcGNiaUFnSUNvZ1h5NXRaWEpuWlNodVlXMWxjeXdnWVdkbGN5azdYRzRnSUNBcUlDOHZJRDArSUhzZ0ozTjBiMjluWlhNbk9pQmJleUFuYm1GdFpTYzZJQ2R0YjJVbkxDQW5ZV2RsSnpvZ05EQWdmU3dnZXlBbmJtRnRaU2M2SUNkc1lYSnllU2NzSUNkaFoyVW5PaUExTUNCOVhTQjlYRzRnSUNBcVhHNGdJQ0FxSUhaaGNpQm1iMjlrSUQwZ2UxeHVJQ0FnS2lBZ0lDZG1jblZwZEhNbk9pQmJKMkZ3Y0d4bEoxMHNYRzRnSUNBcUlDQWdKM1psWjJWMFlXSnNaWE1uT2lCYkoySmxaWFFuWFZ4dUlDQWdLaUI5TzF4dUlDQWdLbHh1SUNBZ0tpQjJZWElnYjNSb1pYSkdiMjlrSUQwZ2UxeHVJQ0FnS2lBZ0lDZG1jblZwZEhNbk9pQmJKMkpoYm1GdVlTZGRMRnh1SUNBZ0tpQWdJQ2QyWldkbGRHRmliR1Z6SnpvZ1d5ZGpZWEp5YjNRblhWeHVJQ0FnS2lCOU8xeHVJQ0FnS2x4dUlDQWdLaUJmTG0xbGNtZGxLR1p2YjJRc0lHOTBhR1Z5Um05dlpDd2dablZ1WTNScGIyNG9ZU3dnWWlrZ2UxeHVJQ0FnS2lBZ0lISmxkSFZ5YmlCZkxtbHpRWEp5WVhrb1lTa2dQeUJoTG1OdmJtTmhkQ2hpS1NBNklIVnVaR1ZtYVc1bFpEdGNiaUFnSUNvZ2ZTazdYRzRnSUNBcUlDOHZJRDArSUhzZ0oyWnlkV2wwY3ljNklGc25ZWEJ3YkdVbkxDQW5ZbUZ1WVc1aEoxMHNJQ2QyWldkbGRHRmliR1Z6SnpvZ1d5ZGlaV1YwSnl3Z0oyTmhjbkp2ZEYwZ2ZWeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdiV1Z5WjJVb2IySnFaV04wTENCemIzVnlZMlVzSUdSbFpYQkpibVJwWTJGMGIzSXBJSHRjYmlBZ0lDQjJZWElnWVhKbmN5QTlJR0Z5WjNWdFpXNTBjeXhjYmlBZ0lDQWdJQ0FnYVc1a1pYZ2dQU0F3TEZ4dUlDQWdJQ0FnSUNCc1pXNW5kR2dnUFNBeU8xeHVYRzRnSUNBZ2FXWWdLQ0ZwYzA5aWFtVmpkQ2h2WW1wbFkzUXBLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdiMkpxWldOME8xeHVJQ0FnSUgxY2JpQWdJQ0JwWmlBb1pHVmxjRWx1WkdsallYUnZjaUE5UFQwZ2FXNWthV05oZEc5eVQySnFaV04wS1NCN1hHNGdJQ0FnSUNCMllYSWdZMkZzYkdKaFkyc2dQU0JoY21keld6TmRMRnh1SUNBZ0lDQWdJQ0FnSUhOMFlXTnJRU0E5SUdGeVozTmJORjBzWEc0Z0lDQWdJQ0FnSUNBZ2MzUmhZMnRDSUQwZ1lYSm5jMXMxWFR0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdjM1JoWTJ0QklEMGdXMTA3WEc0Z0lDQWdJQ0J6ZEdGamEwSWdQU0JiWFR0Y2JseHVJQ0FnSUNBZ0x5OGdZV3hzYjNkeklIZHZjbXRwYm1jZ2QybDBhQ0JnWHk1eVpXUjFZMlZnSUdGdVpDQmdYeTV5WldSMVkyVlNhV2RvZEdBZ2QybDBhRzkxZEZ4dUlDQWdJQ0FnTHk4Z2RYTnBibWNnZEdobGFYSWdZR05oYkd4aVlXTnJZQ0JoY21kMWJXVnVkSE1zSUdCcGJtUmxlSHhyWlhsZ0lHRnVaQ0JnWTI5c2JHVmpkR2x2Ym1CY2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ1pHVmxjRWx1WkdsallYUnZjaUFoUFNBbmJuVnRZbVZ5SnlrZ2UxeHVJQ0FnSUNBZ0lDQnNaVzVuZEdnZ1BTQmhjbWR6TG14bGJtZDBhRHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJR2xtSUNoc1pXNW5kR2dnUGlBeklDWW1JSFI1Y0dWdlppQmhjbWR6VzJ4bGJtZDBhQ0F0SURKZElEMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUNBZ1kyRnNiR0poWTJzZ1BTQmpjbVZoZEdWRFlXeHNZbUZqYXloaGNtZHpXeTB0YkdWdVozUm9JQzBnTVYwc0lHRnlaM05iYkdWdVozUm9MUzFkTENBeUtUdGNiaUFnSUNBZ0lIMGdaV3h6WlNCcFppQW9iR1Z1WjNSb0lENGdNaUFtSmlCMGVYQmxiMllnWVhKbmMxdHNaVzVuZEdnZ0xTQXhYU0E5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQWdJR05oYkd4aVlXTnJJRDBnWVhKbmMxc3RMV3hsYm1kMGFGMDdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0FnSUhkb2FXeGxJQ2dySzJsdVpHVjRJRHdnYkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0FvYVhOQmNuSmhlU2hoY21kelcybHVaR1Y0WFNrZ1B5Qm1iM0pGWVdOb0lEb2dabTl5VDNkdUtTaGhjbWR6VzJsdVpHVjRYU3dnWm5WdVkzUnBiMjRvYzI5MWNtTmxMQ0JyWlhrcElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUdadmRXNWtMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2FYTkJjbklzWEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWE4xYkhRZ1BTQnpiM1Z5WTJVc1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVd4MVpTQTlJRzlpYW1WamRGdHJaWGxkTzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h6YjNWeVkyVWdKaVlnS0NocGMwRnljaUE5SUdselFYSnlZWGtvYzI5MWNtTmxLU2tnZkh3Z2FYTlFiR0ZwYms5aWFtVmpkQ2h6YjNWeVkyVXBLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJR0YyYjJsa0lHMWxjbWRwYm1jZ2NISmxkbWx2ZFhOc2VTQnRaWEpuWldRZ1kzbGpiR2xqSUhOdmRYSmpaWE5jYmlBZ0lDQWdJQ0FnSUNCMllYSWdjM1JoWTJ0TVpXNW5kR2dnUFNCemRHRmphMEV1YkdWdVozUm9PMXh1SUNBZ0lDQWdJQ0FnSUhkb2FXeGxJQ2h6ZEdGamEweGxibWQwYUMwdEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9LR1p2ZFc1a0lEMGdjM1JoWTJ0QlczTjBZV05yVEdWdVozUm9YU0E5UFNCemIzVnlZMlVwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGJIVmxJRDBnYzNSaFkydENXM04wWVdOclRHVnVaM1JvWFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUdsbUlDZ2habTkxYm1RcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGJIVmxJRDBnYVhOQmNuSmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1B5QW9hWE5CY25KaGVTaDJZV3gxWlNrZ1B5QjJZV3gxWlNBNklGdGRLVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQTZJQ2hwYzFCc1lXbHVUMkpxWldOMEtIWmhiSFZsS1NBL0lIWmhiSFZsSURvZ2UzMHBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvWTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WemRXeDBJRDBnWTJGc2JHSmhZMnNvZG1Gc2RXVXNJSE52ZFhKalpTazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdjbVZ6ZFd4MElDRTlJQ2QxYm1SbFptbHVaV1FuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1VnUFNCeVpYTjFiSFE3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklHRmtaQ0JnYzI5MWNtTmxZQ0JoYm1RZ1lYTnpiMk5wWVhSbFpDQmdkbUZzZFdWZ0lIUnZJSFJvWlNCemRHRmpheUJ2WmlCMGNtRjJaWEp6WldRZ2IySnFaV04wYzF4dUlDQWdJQ0FnSUNBZ0lDQWdjM1JoWTJ0QkxuQjFjMmdvYzI5MWNtTmxLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lITjBZV05yUWk1d2RYTm9LSFpoYkhWbEtUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdjbVZqZFhKemFYWmxiSGtnYldWeVoyVWdiMkpxWldOMGN5QmhibVFnWVhKeVlYbHpJQ2h6ZFhOalpYQjBhV0pzWlNCMGJ5QmpZV3hzSUhOMFlXTnJJR3hwYldsMGN5bGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDZ2hZMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdkbUZzZFdVZ1BTQnRaWEpuWlNoMllXeDFaU3dnYzI5MWNtTmxMQ0JwYm1ScFkyRjBiM0pQWW1wbFkzUXNJR05oYkd4aVlXTnJMQ0J6ZEdGamEwRXNJSE4wWVdOclFpazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaGpZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVnpkV3gwSUQwZ1kyRnNiR0poWTJzb2RtRnNkV1VzSUhOdmRYSmpaU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSEpsYzNWc2RDQTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYTjFiSFFnUFNCemIzVnlZMlU3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdjbVZ6ZFd4MElDRTlJQ2QxYm1SbFptbHVaV1FuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVd4MVpTQTlJSEpsYzNWc2REdGNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2IySnFaV04wVzJ0bGVWMGdQU0IyWVd4MVpUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnYjJKcVpXTjBPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVOeVpXRjBaWE1nWVNCemFHRnNiRzkzSUdOc2IyNWxJRzltSUdCdlltcGxZM1JnSUdWNFkyeDFaR2x1WnlCMGFHVWdjM0JsWTJsbWFXVmtJSEJ5YjNCbGNuUnBaWE11WEc0Z0lDQXFJRkJ5YjNCbGNuUjVJRzVoYldWeklHMWhlU0JpWlNCemNHVmphV1pwWldRZ1lYTWdhVzVrYVhacFpIVmhiQ0JoY21kMWJXVnVkSE1nYjNJZ1lYTWdZWEp5WVhseklHOW1YRzRnSUNBcUlIQnliM0JsY25SNUlHNWhiV1Z6TGlCSlppQmhJR0JqWVd4c1ltRmphMkFnWm5WdVkzUnBiMjRnYVhNZ2NHRnpjMlZrTENCcGRDQjNhV3hzSUdKbElHVjRaV04xZEdWa1hHNGdJQ0FxSUdadmNpQmxZV05vSUhCeWIzQmxjblI1SUdsdUlIUm9aU0JnYjJKcVpXTjBZQ3dnYjIxcGRIUnBibWNnZEdobElIQnliM0JsY25ScFpYTWdZR05oYkd4aVlXTnJZRnh1SUNBZ0tpQnlaWFIxY201eklIUnlkWFJvZVNCbWIzSXVJRlJvWlNCZ1kyRnNiR0poWTJ0Z0lHbHpJR0p2ZFc1a0lIUnZJR0IwYUdselFYSm5ZQ0JoYm1RZ2FXNTJiMnRsWkZ4dUlDQWdLaUIzYVhSb0lIUm9jbVZsSUdGeVozVnRaVzUwY3pzZ0tIWmhiSFZsTENCclpYa3NJRzlpYW1WamRDa3VYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRR05oZEdWbmIzSjVJRTlpYW1WamRITmNiaUFnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUc5aWFtVmpkQ0JVYUdVZ2MyOTFjbU5sSUc5aWFtVmpkQzVjYmlBZ0lDb2dRSEJoY21GdElIdEdkVzVqZEdsdmJueFRkSEpwYm1kOUlHTmhiR3hpWVdOcmZGdHdjbTl3TVN3Z2NISnZjRElzSUM0dUxsMGdWR2hsSUhCeWIzQmxjblJwWlhNZ2RHOGdiMjFwZEZ4dUlDQWdLaUFnYjNJZ2RHaGxJR1oxYm1OMGFXOXVJR05oYkd4bFpDQndaWElnYVhSbGNtRjBhVzl1TGx4dUlDQWdLaUJBY0dGeVlXMGdlMDFwZUdWa2ZTQmJkR2hwYzBGeVoxMGdWR2hsSUdCMGFHbHpZQ0JpYVc1a2FXNW5JRzltSUdCallXeHNZbUZqYTJBdVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0UFltcGxZM1I5SUZKbGRIVnlibk1nWVc0Z2IySnFaV04wSUhkcGRHaHZkWFFnZEdobElHOXRhWFIwWldRZ2NISnZjR1Z5ZEdsbGN5NWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dYeTV2YldsMEtIc2dKMjVoYldVbk9pQW5iVzlsSnl3Z0oyRm5aU2M2SURRd0lIMHNJQ2RoWjJVbktUdGNiaUFnSUNvZ0x5OGdQVDRnZXlBbmJtRnRaU2M2SUNkdGIyVW5JSDFjYmlBZ0lDcGNiaUFnSUNvZ1h5NXZiV2wwS0hzZ0oyNWhiV1VuT2lBbmJXOWxKeXdnSjJGblpTYzZJRFF3SUgwc0lHWjFibU4wYVc5dUtIWmhiSFZsS1NCN1hHNGdJQ0FxSUNBZ2NtVjBkWEp1SUhSNWNHVnZaaUIyWVd4MVpTQTlQU0FuYm5WdFltVnlKenRjYmlBZ0lDb2dmU2s3WEc0Z0lDQXFJQzh2SUQwK0lIc2dKMjVoYldVbk9pQW5iVzlsSnlCOVhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQnZiV2wwS0c5aWFtVmpkQ3dnWTJGc2JHSmhZMnNzSUhSb2FYTkJjbWNwSUh0Y2JpQWdJQ0IyWVhJZ2FYTkdkVzVqSUQwZ2RIbHdaVzltSUdOaGJHeGlZV05ySUQwOUlDZG1kVzVqZEdsdmJpY3NYRzRnSUNBZ0lDQWdJSEpsYzNWc2RDQTlJSHQ5TzF4dVhHNGdJQ0FnYVdZZ0tHbHpSblZ1WXlrZ2UxeHVJQ0FnSUNBZ1kyRnNiR0poWTJzZ1BTQmpjbVZoZEdWRFlXeHNZbUZqYXloallXeHNZbUZqYXl3Z2RHaHBjMEZ5WnlrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSFpoY2lCd2NtOXdjeUE5SUdOdmJtTmhkQzVoY0hCc2VTaGhjbkpoZVZKbFppd2dZWEpuZFcxbGJuUnpLVHRjYmlBZ0lDQjlYRzRnSUNBZ1ptOXlTVzRvYjJKcVpXTjBMQ0JtZFc1amRHbHZiaWgyWVd4MVpTd2dhMlY1TENCdlltcGxZM1FwSUh0Y2JpQWdJQ0FnSUdsbUlDaHBjMFoxYm1OY2JpQWdJQ0FnSUNBZ0lDQWdJRDhnSVdOaGJHeGlZV05yS0haaGJIVmxMQ0JyWlhrc0lHOWlhbVZqZENsY2JpQWdJQ0FnSUNBZ0lDQWdJRG9nYVc1a1pYaFBaaWh3Y205d2N5d2dhMlY1TENBeEtTQThJREJjYmlBZ0lDQWdJQ0FnSUNBcElIdGNiaUFnSUNBZ0lDQWdjbVZ6ZFd4MFcydGxlVjBnUFNCMllXeDFaVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLVHRjYmlBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTnlaV0YwWlhNZ1lTQjBkMjhnWkdsdFpXNXphVzl1WVd3Z1lYSnlZWGtnYjJZZ2RHaGxJR2RwZG1WdUlHOWlhbVZqZENkeklHdGxlUzEyWVd4MVpTQndZV2x5Y3l4Y2JpQWdJQ29nYVM1bExpQmdXMXRyWlhreExDQjJZV3gxWlRGZExDQmJhMlY1TWl3Z2RtRnNkV1V5WFYxZ0xseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQlBZbXBsWTNSelhHNGdJQ0FxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0J2WW1wbFkzUWdWR2hsSUc5aWFtVmpkQ0IwYnlCcGJuTndaV04wTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UVhKeVlYbDlJRkpsZEhWeWJuTWdibVYzSUdGeWNtRjVJRzltSUd0bGVTMTJZV3gxWlNCd1lXbHljeTVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nWHk1d1lXbHljeWg3SUNkdGIyVW5PaUF6TUN3Z0oyeGhjbko1SnpvZ05EQWdmU2s3WEc0Z0lDQXFJQzh2SUQwK0lGdGJKMjF2WlNjc0lETXdYU3dnV3lkc1lYSnllU2NzSURRd1hWMGdLRzl5WkdWeUlHbHpJRzV2ZENCbmRXRnlZVzUwWldWa0tWeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdjR0ZwY25Nb2IySnFaV04wS1NCN1hHNGdJQ0FnZG1GeUlHbHVaR1Y0SUQwZ0xURXNYRzRnSUNBZ0lDQWdJSEJ5YjNCeklEMGdhMlY1Y3lodlltcGxZM1FwTEZ4dUlDQWdJQ0FnSUNCc1pXNW5kR2dnUFNCd2NtOXdjeTVzWlc1bmRHZ3NYRzRnSUNBZ0lDQWdJSEpsYzNWc2RDQTlJRUZ5Y21GNUtHeGxibWQwYUNrN1hHNWNiaUFnSUNCM2FHbHNaU0FvS3l0cGJtUmxlQ0E4SUd4bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnZG1GeUlHdGxlU0E5SUhCeWIzQnpXMmx1WkdWNFhUdGNiaUFnSUNBZ0lISmxjM1ZzZEZ0cGJtUmxlRjBnUFNCYmEyVjVMQ0J2WW1wbFkzUmJhMlY1WFYwN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnlaWE4xYkhRN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRM0psWVhSbGN5QmhJSE5vWVd4c2IzY2dZMnh2Ym1VZ2IyWWdZRzlpYW1WamRHQWdZMjl0Y0c5elpXUWdiMllnZEdobElITndaV05wWm1sbFpDQndjbTl3WlhKMGFXVnpMbHh1SUNBZ0tpQlFjbTl3WlhKMGVTQnVZVzFsY3lCdFlYa2dZbVVnYzNCbFkybG1hV1ZrSUdGeklHbHVaR2wyYVdSMVlXd2dZWEpuZFcxbGJuUnpJRzl5SUdGeklHRnljbUY1Y3lCdlppQndjbTl3WlhKMGVWeHVJQ0FnS2lCdVlXMWxjeTRnU1dZZ1lHTmhiR3hpWVdOcllDQnBjeUJ3WVhOelpXUXNJR2wwSUhkcGJHd2dZbVVnWlhobFkzVjBaV1FnWm05eUlHVmhZMmdnY0hKdmNHVnlkSGtnYVc0Z2RHaGxYRzRnSUNBcUlHQnZZbXBsWTNSZ0xDQndhV05yYVc1bklIUm9aU0J3Y205d1pYSjBhV1Z6SUdCallXeHNZbUZqYTJBZ2NtVjBkWEp1Y3lCMGNuVjBhSGtnWm05eUxpQlVhR1VnWUdOaGJHeGlZV05yWUZ4dUlDQWdLaUJwY3lCaWIzVnVaQ0IwYnlCZ2RHaHBjMEZ5WjJBZ1lXNWtJR2x1ZG05clpXUWdkMmwwYUNCMGFISmxaU0JoY21kMWJXVnVkSE03SUNoMllXeDFaU3dnYTJWNUxDQnZZbXBsWTNRcExseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQlBZbXBsWTNSelhHNGdJQ0FxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0J2WW1wbFkzUWdWR2hsSUhOdmRYSmpaU0J2WW1wbFkzUXVYRzRnSUNBcUlFQndZWEpoYlNCN1FYSnlZWGw4Um5WdVkzUnBiMjU4VTNSeWFXNW5mU0JqWVd4c1ltRmphM3hiY0hKdmNERXNJSEJ5YjNBeUxDQXVMaTVkSUZSb1pTQm1kVzVqZEdsdmJpQmpZV3hzWldSY2JpQWdJQ29nSUhCbGNpQnBkR1Z5WVhScGIyNGdiM0lnY0hKdmNHVnlkR2xsY3lCMGJ5QndhV05yTENCbGFYUm9aWElnWVhNZ2FXNWthWFpwWkhWaGJDQmhjbWQxYldWdWRITWdiM0lnWVhKeVlYbHpMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwMXBlR1ZrZlNCYmRHaHBjMEZ5WjEwZ1ZHaGxJR0IwYUdsellDQmlhVzVrYVc1bklHOW1JR0JqWVd4c1ltRmphMkF1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHRQWW1wbFkzUjlJRkpsZEhWeWJuTWdZVzRnYjJKcVpXTjBJR052YlhCdmMyVmtJRzltSUhSb1pTQndhV05yWldRZ2NISnZjR1Z5ZEdsbGN5NWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dYeTV3YVdOcktIc2dKMjVoYldVbk9pQW5iVzlsSnl3Z0oxOTFjMlZ5YVdRbk9pQW5iVzlsTVNjZ2ZTd2dKMjVoYldVbktUdGNiaUFnSUNvZ0x5OGdQVDRnZXlBbmJtRnRaU2M2SUNkdGIyVW5JSDFjYmlBZ0lDcGNiaUFnSUNvZ1h5NXdhV05yS0hzZ0oyNWhiV1VuT2lBbmJXOWxKeXdnSjE5MWMyVnlhV1FuT2lBbmJXOWxNU2NnZlN3Z1puVnVZM1JwYjI0b2RtRnNkV1VzSUd0bGVTa2dlMXh1SUNBZ0tpQWdJSEpsZEhWeWJpQnJaWGt1WTJoaGNrRjBLREFwSUNFOUlDZGZKenRjYmlBZ0lDb2dmU2s3WEc0Z0lDQXFJQzh2SUQwK0lIc2dKMjVoYldVbk9pQW5iVzlsSnlCOVhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQndhV05yS0c5aWFtVmpkQ3dnWTJGc2JHSmhZMnNzSUhSb2FYTkJjbWNwSUh0Y2JpQWdJQ0IyWVhJZ2NtVnpkV3gwSUQwZ2UzMDdYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQmpZV3hzWW1GamF5QWhQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNCMllYSWdhVzVrWlhnZ1BTQXdMRnh1SUNBZ0lDQWdJQ0FnSUhCeWIzQnpJRDBnWTI5dVkyRjBMbUZ3Y0d4NUtHRnljbUY1VW1WbUxDQmhjbWQxYldWdWRITXBMRnh1SUNBZ0lDQWdJQ0FnSUd4bGJtZDBhQ0E5SUdselQySnFaV04wS0c5aWFtVmpkQ2tnUHlCd2NtOXdjeTVzWlc1bmRHZ2dPaUF3TzF4dVhHNGdJQ0FnSUNCM2FHbHNaU0FvS3l0cGJtUmxlQ0E4SUd4bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdhMlY1SUQwZ2NISnZjSE5iYVc1a1pYaGRPMXh1SUNBZ0lDQWdJQ0JwWmlBb2EyVjVJR2x1SUc5aWFtVmpkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxjM1ZzZEZ0clpYbGRJRDBnYjJKcVpXTjBXMnRsZVYwN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnWTJGc2JHSmhZMnNnUFNCamNtVmhkR1ZEWVd4c1ltRmpheWhqWVd4c1ltRmpheXdnZEdocGMwRnlaeWs3WEc0Z0lDQWdJQ0JtYjNKSmJpaHZZbXBsWTNRc0lHWjFibU4wYVc5dUtIWmhiSFZsTENCclpYa3NJRzlpYW1WamRDa2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb1kyRnNiR0poWTJzb2RtRnNkV1VzSUd0bGVTd2diMkpxWldOMEtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGMzVnNkRnRyWlhsZElEMGdkbUZzZFdVN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVOeVpXRjBaWE1nWVc0Z1lYSnlZWGtnWTI5dGNHOXpaV1FnYjJZZ2RHaGxJRzkzYmlCbGJuVnRaWEpoWW14bElIQnliM0JsY25SNUlIWmhiSFZsY3lCdlppQmdiMkpxWldOMFlDNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dUMkpxWldOMGMxeHVJQ0FnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnYjJKcVpXTjBJRlJvWlNCdlltcGxZM1FnZEc4Z2FXNXpjR1ZqZEM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBGeWNtRjVmU0JTWlhSMWNtNXpJR0VnYm1WM0lHRnljbUY1SUc5bUlIQnliM0JsY25SNUlIWmhiSFZsY3k1Y2JpQWdJQ29nUUdWNFlXMXdiR1ZjYmlBZ0lDcGNiaUFnSUNvZ1h5NTJZV3gxWlhNb2V5QW5iMjVsSnpvZ01Td2dKM1IzYnljNklESXNJQ2QwYUhKbFpTYzZJRE1nZlNrN1hHNGdJQ0FxSUM4dklEMCtJRnN4TENBeUxDQXpYVnh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnZG1Gc2RXVnpLRzlpYW1WamRDa2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJQzB4TEZ4dUlDQWdJQ0FnSUNCd2NtOXdjeUE5SUd0bGVYTW9iMkpxWldOMEtTeGNiaUFnSUNBZ0lDQWdiR1Z1WjNSb0lEMGdjSEp2Y0hNdWJHVnVaM1JvTEZ4dUlDQWdJQ0FnSUNCeVpYTjFiSFFnUFNCQmNuSmhlU2hzWlc1bmRHZ3BPMXh1WEc0Z0lDQWdkMmhwYkdVZ0tDc3JhVzVrWlhnZ1BDQnNaVzVuZEdncElIdGNiaUFnSUNBZ0lISmxjM1ZzZEZ0cGJtUmxlRjBnUFNCdlltcGxZM1JiY0hKdmNITmJhVzVrWlhoZFhUdGNiaUFnSUNCOVhHNGdJQ0FnY21WMGRYSnVJSEpsYzNWc2REdGNiaUFnZlZ4dVhHNGdJQzhxTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwcUwxeHVYRzRnSUM4cUtseHVJQ0FnS2lCRGNtVmhkR1Z6SUdGdUlHRnljbUY1SUc5bUlHVnNaVzFsYm5SeklHWnliMjBnZEdobElITndaV05wWm1sbFpDQnBibVJsZUdWekxDQnZjaUJyWlhsekxDQnZaaUIwYUdWY2JpQWdJQ29nWUdOdmJHeGxZM1JwYjI1Z0xpQkpibVJsZUdWeklHMWhlU0JpWlNCemNHVmphV1pwWldRZ1lYTWdhVzVrYVhacFpIVmhiQ0JoY21kMWJXVnVkSE1nYjNJZ1lYTWdZWEp5WVhselhHNGdJQ0FxSUc5bUlHbHVaR1Y0WlhNdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ6ZEdGMGFXTmNiaUFnSUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFnSUNvZ1FHTmhkR1ZuYjNKNUlFTnZiR3hsWTNScGIyNXpYRzRnSUNBcUlFQndZWEpoYlNCN1FYSnlZWGw4VDJKcVpXTjBmRk4wY21sdVozMGdZMjlzYkdWamRHbHZiaUJVYUdVZ1kyOXNiR1ZqZEdsdmJpQjBieUJwZEdWeVlYUmxJRzkyWlhJdVhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhKeVlYbDhUblZ0WW1WeWZGTjBjbWx1WjMwZ1cybHVaR1Y0TVN3Z2FXNWtaWGd5TENBdUxpNWRJRlJvWlNCcGJtUmxlR1Z6SUc5bVhHNGdJQ0FxSUNCZ1kyOXNiR1ZqZEdsdmJtQWdkRzhnY21WMGNtbGxkbVVzSUdWcGRHaGxjaUJoY3lCcGJtUnBkbWxrZFdGc0lHRnlaM1Z0Wlc1MGN5QnZjaUJoY25KaGVYTXVYRzRnSUNBcUlFQnlaWFIxY201eklIdEJjbkpoZVgwZ1VtVjBkWEp1Y3lCaElHNWxkeUJoY25KaGVTQnZaaUJsYkdWdFpXNTBjeUJqYjNKeVpYTndiMjVrYVc1bklIUnZJSFJvWlZ4dUlDQWdLaUFnY0hKdmRtbGtaV1FnYVc1a1pYaGxjeTVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nWHk1aGRDaGJKMkVuTENBbllpY3NJQ2RqSnl3Z0oyUW5MQ0FuWlNkZExDQmJNQ3dnTWl3Z05GMHBPMXh1SUNBZ0tpQXZMeUE5UGlCYkoyRW5MQ0FuWXljc0lDZGxKMTFjYmlBZ0lDcGNiaUFnSUNvZ1h5NWhkQ2hiSjIxdlpTY3NJQ2RzWVhKeWVTY3NJQ2RqZFhKc2VTZGRMQ0F3TENBeUtUdGNiaUFnSUNvZ0x5OGdQVDRnV3lkdGIyVW5MQ0FuWTNWeWJIa25YVnh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnWVhRb1kyOXNiR1ZqZEdsdmJpa2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJQzB4TEZ4dUlDQWdJQ0FnSUNCd2NtOXdjeUE5SUdOdmJtTmhkQzVoY0hCc2VTaGhjbkpoZVZKbFppd2djMnhwWTJVb1lYSm5kVzFsYm5SekxDQXhLU2tzWEc0Z0lDQWdJQ0FnSUd4bGJtZDBhQ0E5SUhCeWIzQnpMbXhsYm1kMGFDeGNiaUFnSUNBZ0lDQWdjbVZ6ZFd4MElEMGdRWEp5WVhrb2JHVnVaM1JvS1R0Y2JseHVJQ0FnSUhkb2FXeGxLQ3NyYVc1a1pYZ2dQQ0JzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJSEpsYzNWc2RGdHBibVJsZUYwZ1BTQmpiMnhzWldOMGFXOXVXM0J5YjNCelcybHVaR1Y0WFYwN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnlaWE4xYkhRN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMmhsWTJ0eklHbG1JR0VnWjJsMlpXNGdZSFJoY21kbGRHQWdaV3hsYldWdWRDQnBjeUJ3Y21WelpXNTBJR2x1SUdFZ1lHTnZiR3hsWTNScGIyNWdJSFZ6YVc1bklITjBjbWxqZEZ4dUlDQWdLaUJsY1hWaGJHbDBlU0JtYjNJZ1kyOXRjR0Z5YVhOdmJuTXNJR2t1WlM0Z1lEMDlQV0F1SUVsbUlHQm1jbTl0U1c1a1pYaGdJR2x6SUc1bFoyRjBhWFpsTENCcGRDQnBjeUIxYzJWa1hHNGdJQ0FxSUdGeklIUm9aU0J2Wm1aelpYUWdabkp2YlNCMGFHVWdaVzVrSUc5bUlIUm9aU0JqYjJ4c1pXTjBhVzl1TGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCaGJHbGhjeUJwYm1Oc2RXUmxYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQkRiMnhzWldOMGFXOXVjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwRnljbUY1ZkU5aWFtVmpkSHhUZEhKcGJtZDlJR052Ykd4bFkzUnBiMjRnVkdobElHTnZiR3hsWTNScGIyNGdkRzhnYVhSbGNtRjBaU0J2ZG1WeUxseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0IwWVhKblpYUWdWR2hsSUhaaGJIVmxJSFJ2SUdOb1pXTnJJR1p2Y2k1Y2JpQWdJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJRnRtY205dFNXNWtaWGc5TUYwZ1ZHaGxJR2x1WkdWNElIUnZJSE5sWVhKamFDQm1jbTl0TGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQWdhV1lnZEdobElHQjBZWEpuWlhSZ0lHVnNaVzFsYm5RZ2FYTWdabTkxYm1Rc0lHVnNjMlVnWUdaaGJITmxZQzVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nWHk1amIyNTBZV2x1Y3loYk1Td2dNaXdnTTEwc0lERXBPMXh1SUNBZ0tpQXZMeUE5UGlCMGNuVmxYRzRnSUNBcVhHNGdJQ0FxSUY4dVkyOXVkR0ZwYm5Nb1d6RXNJRElzSUROZExDQXhMQ0F5S1R0Y2JpQWdJQ29nTHk4Z1BUNGdabUZzYzJWY2JpQWdJQ3BjYmlBZ0lDb2dYeTVqYjI1MFlXbHVjeWg3SUNkdVlXMWxKem9nSjIxdlpTY3NJQ2RoWjJVbk9pQTBNQ0I5TENBbmJXOWxKeWs3WEc0Z0lDQXFJQzh2SUQwK0lIUnlkV1ZjYmlBZ0lDcGNiaUFnSUNvZ1h5NWpiMjUwWVdsdWN5Z25ZM1Z5YkhrbkxDQW5kWEluS1R0Y2JpQWdJQ29nTHk4Z1BUNGdkSEoxWlZ4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z1kyOXVkR0ZwYm5Nb1kyOXNiR1ZqZEdsdmJpd2dkR0Z5WjJWMExDQm1jbTl0U1c1a1pYZ3BJSHRjYmlBZ0lDQjJZWElnYVc1a1pYZ2dQU0F0TVN4Y2JpQWdJQ0FnSUNBZ2JHVnVaM1JvSUQwZ1kyOXNiR1ZqZEdsdmJpQS9JR052Ykd4bFkzUnBiMjR1YkdWdVozUm9JRG9nTUN4Y2JpQWdJQ0FnSUNBZ2NtVnpkV3gwSUQwZ1ptRnNjMlU3WEc1Y2JpQWdJQ0JtY205dFNXNWtaWGdnUFNBb1puSnZiVWx1WkdWNElEd2dNQ0EvSUc1aGRHbDJaVTFoZUNnd0xDQnNaVzVuZEdnZ0t5Qm1jbTl0U1c1a1pYZ3BJRG9nWm5KdmJVbHVaR1Y0S1NCOGZDQXdPMXh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdiR1Z1WjNSb0lEMDlJQ2R1ZFcxaVpYSW5LU0I3WEc0Z0lDQWdJQ0J5WlhOMWJIUWdQU0FvYVhOVGRISnBibWNvWTI5c2JHVmpkR2x2YmlsY2JpQWdJQ0FnSUNBZ1B5QmpiMnhzWldOMGFXOXVMbWx1WkdWNFQyWW9kR0Z5WjJWMExDQm1jbTl0U1c1a1pYZ3BYRzRnSUNBZ0lDQWdJRG9nYVc1a1pYaFBaaWhqYjJ4c1pXTjBhVzl1TENCMFlYSm5aWFFzSUdaeWIyMUpibVJsZUNsY2JpQWdJQ0FnSUNrZ1BpQXRNVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ1pXRmphQ2hqYjJ4c1pXTjBhVzl1TENCbWRXNWpkR2x2YmloMllXeDFaU2tnZTF4dUlDQWdJQ0FnSUNCcFppQW9LeXRwYm1SbGVDQStQU0JtY205dFNXNWtaWGdwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z0lTaHlaWE4xYkhRZ1BTQjJZV3gxWlNBOVBUMGdkR0Z5WjJWMEtUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1EzSmxZWFJsY3lCaGJpQnZZbXBsWTNRZ1kyOXRjRzl6WldRZ2IyWWdhMlY1Y3lCeVpYUjFjbTVsWkNCbWNtOXRJSEoxYm01cGJtY2daV0ZqYUNCbGJHVnRaVzUwSUc5bUlIUm9aVnh1SUNBZ0tpQmdZMjlzYkdWamRHbHZibUFnZEdoeWIzVm5hQ0IwYUdVZ1oybDJaVzRnWUdOaGJHeGlZV05yWUM0Z1ZHaGxJR052Y25KbGMzQnZibVJwYm1jZ2RtRnNkV1VnYjJZZ1pXRmphQ0JyWlhsY2JpQWdJQ29nYVhNZ2RHaGxJRzUxYldKbGNpQnZaaUIwYVcxbGN5QjBhR1VnYTJWNUlIZGhjeUJ5WlhSMWNtNWxaQ0JpZVNCMGFHVWdZR05oYkd4aVlXTnJZQzRnVkdobElHQmpZV3hzWW1GamEyQmNiaUFnSUNvZ2FYTWdZbTkxYm1RZ2RHOGdZSFJvYVhOQmNtZGdJR0Z1WkNCcGJuWnZhMlZrSUhkcGRHZ2dkR2h5WldVZ1lYSm5kVzFsYm5Sek95QW9kbUZzZFdVc0lHbHVaR1Y0Zkd0bGVTd2dZMjlzYkdWamRHbHZiaWt1WEc0Z0lDQXFYRzRnSUNBcUlFbG1JR0VnY0hKdmNHVnlkSGtnYm1GdFpTQnBjeUJ3WVhOelpXUWdabTl5SUdCallXeHNZbUZqYTJBc0lIUm9aU0JqY21WaGRHVmtJRndpWHk1d2JIVmphMXdpSUhOMGVXeGxYRzRnSUNBcUlHTmhiR3hpWVdOcklIZHBiR3dnY21WMGRYSnVJSFJvWlNCd2NtOXdaWEowZVNCMllXeDFaU0J2WmlCMGFHVWdaMmwyWlc0Z1pXeGxiV1Z1ZEM1Y2JpQWdJQ3BjYmlBZ0lDb2dTV1lnWVc0Z2IySnFaV04wSUdseklIQmhjM05sWkNCbWIzSWdZR05oYkd4aVlXTnJZQ3dnZEdobElHTnlaV0YwWldRZ1hDSmZMbmRvWlhKbFhDSWdjM1I1YkdVZ1kyRnNiR0poWTJ0Y2JpQWdJQ29nZDJsc2JDQnlaWFIxY200Z1lIUnlkV1ZnSUdadmNpQmxiR1Z0Wlc1MGN5QjBhR0YwSUdoaGRtVWdkR2hsSUhCeWIzQmxkR2xsY3lCdlppQjBhR1VnWjJsMlpXNGdiMkpxWldOMExGeHVJQ0FnS2lCbGJITmxJR0JtWVd4elpXQXVYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRR05oZEdWbmIzSjVJRU52Ykd4bFkzUnBiMjV6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdRWEp5WVhsOFQySnFaV04wZkZOMGNtbHVaMzBnWTI5c2JHVmpkR2x2YmlCVWFHVWdZMjlzYkdWamRHbHZiaUIwYnlCcGRHVnlZWFJsSUc5MlpYSXVYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OFQySnFaV04wZkZOMGNtbHVaMzBnVzJOaGJHeGlZV05yUFdsa1pXNTBhWFI1WFNCVWFHVWdablZ1WTNScGIyNGdZMkZzYkdWa0lIQmxjbHh1SUNBZ0tpQWdhWFJsY21GMGFXOXVMaUJKWmlCaElIQnliM0JsY25SNUlHNWhiV1VnYjNJZ2IySnFaV04wSUdseklIQmhjM05sWkN3Z2FYUWdkMmxzYkNCaVpTQjFjMlZrSUhSdklHTnlaV0YwWlZ4dUlDQWdLaUFnWVNCY0lsOHVjR3gxWTJ0Y0lpQnZjaUJjSWw4dWQyaGxjbVZjSWlCemRIbHNaU0JqWVd4c1ltRmpheXdnY21WemNHVmpkR2wyWld4NUxseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0JiZEdocGMwRnlaMTBnVkdobElHQjBhR2x6WUNCaWFXNWthVzVuSUc5bUlHQmpZV3hzWW1GamEyQXVYRzRnSUNBcUlFQnlaWFIxY201eklIdFBZbXBsWTNSOUlGSmxkSFZ5Ym5NZ2RHaGxJR052YlhCdmMyVmtJR0ZuWjNKbFoyRjBaU0J2WW1wbFkzUXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJRjh1WTI5MWJuUkNlU2hiTkM0ekxDQTJMakVzSURZdU5GMHNJR1oxYm1OMGFXOXVLRzUxYlNrZ2V5QnlaWFIxY200Z1RXRjBhQzVtYkc5dmNpaHVkVzBwT3lCOUtUdGNiaUFnSUNvZ0x5OGdQVDRnZXlBbk5DYzZJREVzSUNjMkp6b2dNaUI5WEc0Z0lDQXFYRzRnSUNBcUlGOHVZMjkxYm5SQ2VTaGJOQzR6TENBMkxqRXNJRFl1TkYwc0lHWjFibU4wYVc5dUtHNTFiU2tnZXlCeVpYUjFjbTRnZEdocGN5NW1iRzl2Y2lodWRXMHBPeUI5TENCTllYUm9LVHRjYmlBZ0lDb2dMeThnUFQ0Z2V5QW5OQ2M2SURFc0lDYzJKem9nTWlCOVhHNGdJQ0FxWEc0Z0lDQXFJRjh1WTI5MWJuUkNlU2hiSjI5dVpTY3NJQ2QwZDI4bkxDQW5kR2h5WldVblhTd2dKMnhsYm1kMGFDY3BPMXh1SUNBZ0tpQXZMeUE5UGlCN0lDY3pKem9nTWl3Z0p6VW5PaUF4SUgxY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlHTnZkVzUwUW5rb1kyOXNiR1ZqZEdsdmJpd2dZMkZzYkdKaFkyc3NJSFJvYVhOQmNtY3BJSHRjYmlBZ0lDQjJZWElnY21WemRXeDBJRDBnZTMwN1hHNGdJQ0FnWTJGc2JHSmhZMnNnUFNCamNtVmhkR1ZEWVd4c1ltRmpheWhqWVd4c1ltRmpheXdnZEdocGMwRnlaeWs3WEc1Y2JpQWdJQ0JtYjNKRllXTm9LR052Ykd4bFkzUnBiMjRzSUdaMWJtTjBhVzl1S0haaGJIVmxMQ0JyWlhrc0lHTnZiR3hsWTNScGIyNHBJSHRjYmlBZ0lDQWdJR3RsZVNBOUlHTmhiR3hpWVdOcktIWmhiSFZsTENCclpYa3NJR052Ykd4bFkzUnBiMjRwSUNzZ0p5YzdYRzRnSUNBZ0lDQW9hR0Z6VDNkdVVISnZjR1Z5ZEhrdVkyRnNiQ2h5WlhOMWJIUXNJR3RsZVNrZ1B5QnlaWE4xYkhSYmEyVjVYU3NySURvZ2NtVnpkV3gwVzJ0bGVWMGdQU0F4S1R0Y2JpQWdJQ0I5S1R0Y2JpQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4ME8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU5vWldOcmN5QnBaaUIwYUdVZ1lHTmhiR3hpWVdOcllDQnlaWFIxY201eklHRWdkSEoxZEdoNUlIWmhiSFZsSUdadmNpQXFLbUZzYkNvcUlHVnNaVzFsYm5SeklHOW1JR0ZjYmlBZ0lDb2dZR052Ykd4bFkzUnBiMjVnTGlCVWFHVWdZR05oYkd4aVlXTnJZQ0JwY3lCaWIzVnVaQ0IwYnlCZ2RHaHBjMEZ5WjJBZ1lXNWtJR2x1ZG05clpXUWdkMmwwYUNCMGFISmxaVnh1SUNBZ0tpQmhjbWQxYldWdWRITTdJQ2gyWVd4MVpTd2dhVzVrWlhoOGEyVjVMQ0JqYjJ4c1pXTjBhVzl1S1M1Y2JpQWdJQ3BjYmlBZ0lDb2dTV1lnWVNCd2NtOXdaWEowZVNCdVlXMWxJR2x6SUhCaGMzTmxaQ0JtYjNJZ1lHTmhiR3hpWVdOcllDd2dkR2hsSUdOeVpXRjBaV1FnWENKZkxuQnNkV05yWENJZ2MzUjViR1ZjYmlBZ0lDb2dZMkZzYkdKaFkyc2dkMmxzYkNCeVpYUjFjbTRnZEdobElIQnliM0JsY25SNUlIWmhiSFZsSUc5bUlIUm9aU0JuYVhabGJpQmxiR1Z0Wlc1MExseHVJQ0FnS2x4dUlDQWdLaUJKWmlCaGJpQnZZbXBsWTNRZ2FYTWdjR0Z6YzJWa0lHWnZjaUJnWTJGc2JHSmhZMnRnTENCMGFHVWdZM0psWVhSbFpDQmNJbDh1ZDJobGNtVmNJaUJ6ZEhsc1pTQmpZV3hzWW1GamExeHVJQ0FnS2lCM2FXeHNJSEpsZEhWeWJpQmdkSEoxWldBZ1ptOXlJR1ZzWlcxbGJuUnpJSFJvWVhRZ2FHRjJaU0IwYUdVZ2NISnZjR1YwYVdWeklHOW1JSFJvWlNCbmFYWmxiaUJ2WW1wbFkzUXNYRzRnSUNBcUlHVnNjMlVnWUdaaGJITmxZQzVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWVd4cFlYTWdZV3hzWEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JEYjJ4c1pXTjBhVzl1YzF4dUlDQWdLaUJBY0dGeVlXMGdlMEZ5Y21GNWZFOWlhbVZqZEh4VGRISnBibWQ5SUdOdmJHeGxZM1JwYjI0Z1ZHaGxJR052Ykd4bFkzUnBiMjRnZEc4Z2FYUmxjbUYwWlNCdmRtVnlMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwWjFibU4wYVc5dWZFOWlhbVZqZEh4VGRISnBibWQ5SUZ0allXeHNZbUZqYXoxcFpHVnVkR2wwZVYwZ1ZHaGxJR1oxYm1OMGFXOXVJR05oYkd4bFpDQndaWEpjYmlBZ0lDb2dJR2wwWlhKaGRHbHZiaTRnU1dZZ1lTQndjbTl3WlhKMGVTQnVZVzFsSUc5eUlHOWlhbVZqZENCcGN5QndZWE56WldRc0lHbDBJSGRwYkd3Z1ltVWdkWE5sWkNCMGJ5QmpjbVZoZEdWY2JpQWdJQ29nSUdFZ1hDSmZMbkJzZFdOclhDSWdiM0lnWENKZkxuZG9aWEpsWENJZ2MzUjViR1VnWTJGc2JHSmhZMnNzSUhKbGMzQmxZM1JwZG1Wc2VTNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0TmFYaGxaSDBnVzNSb2FYTkJjbWRkSUZSb1pTQmdkR2hwYzJBZ1ltbHVaR2x1WnlCdlppQmdZMkZzYkdKaFkydGdMbHh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdRbTl2YkdWaGJuMGdVbVYwZFhKdWN5QmdkSEoxWldBZ2FXWWdZV3hzSUdWc1pXMWxiblJ6SUhCaGMzTWdkR2hsSUdOaGJHeGlZV05ySUdOb1pXTnJMRnh1SUNBZ0tpQWdaV3h6WlNCZ1ptRnNjMlZnTGx4dUlDQWdLaUJBWlhoaGJYQnNaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtVjJaWEo1S0Z0MGNuVmxMQ0F4TENCdWRXeHNMQ0FuZVdWekoxMHNJRUp2YjJ4bFlXNHBPMXh1SUNBZ0tpQXZMeUE5UGlCbVlXeHpaVnh1SUNBZ0tseHVJQ0FnS2lCMllYSWdjM1J2YjJkbGN5QTlJRnRjYmlBZ0lDb2dJQ0I3SUNkdVlXMWxKem9nSjIxdlpTY3NJQ2RoWjJVbk9pQTBNQ0I5TEZ4dUlDQWdLaUFnSUhzZ0oyNWhiV1VuT2lBbmJHRnljbmtuTENBbllXZGxKem9nTlRBZ2ZWeHVJQ0FnS2lCZE8xeHVJQ0FnS2x4dUlDQWdLaUF2THlCMWMybHVaeUJjSWw4dWNHeDFZMnRjSWlCallXeHNZbUZqYXlCemFHOXlkR2hoYm1SY2JpQWdJQ29nWHk1bGRtVnllU2h6ZEc5dloyVnpMQ0FuWVdkbEp5azdYRzRnSUNBcUlDOHZJRDArSUhSeWRXVmNiaUFnSUNwY2JpQWdJQ29nTHk4Z2RYTnBibWNnWENKZkxuZG9aWEpsWENJZ1kyRnNiR0poWTJzZ2MyaHZjblJvWVc1a1hHNGdJQ0FxSUY4dVpYWmxjbmtvYzNSdmIyZGxjeXdnZXlBbllXZGxKem9nTlRBZ2ZTazdYRzRnSUNBcUlDOHZJRDArSUdaaGJITmxYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJsZG1WeWVTaGpiMnhzWldOMGFXOXVMQ0JqWVd4c1ltRmpheXdnZEdocGMwRnlaeWtnZTF4dUlDQWdJSFpoY2lCeVpYTjFiSFFnUFNCMGNuVmxPMXh1SUNBZ0lHTmhiR3hpWVdOcklEMGdZM0psWVhSbFEyRnNiR0poWTJzb1kyRnNiR0poWTJzc0lIUm9hWE5CY21jcE8xeHVYRzRnSUNBZ2FXWWdLR2x6UVhKeVlYa29ZMjlzYkdWamRHbHZiaWtwSUh0Y2JpQWdJQ0FnSUhaaGNpQnBibVJsZUNBOUlDMHhMRnh1SUNBZ0lDQWdJQ0FnSUd4bGJtZDBhQ0E5SUdOdmJHeGxZM1JwYjI0dWJHVnVaM1JvTzF4dVhHNGdJQ0FnSUNCM2FHbHNaU0FvS3l0cGJtUmxlQ0E4SUd4bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnSUNCcFppQW9JU2h5WlhOMWJIUWdQU0FoSVdOaGJHeGlZV05yS0dOdmJHeGxZM1JwYjI1YmFXNWtaWGhkTENCcGJtUmxlQ3dnWTI5c2JHVmpkR2x2YmlrcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ1pXRmphQ2hqYjJ4c1pXTjBhVzl1TENCbWRXNWpkR2x2YmloMllXeDFaU3dnYVc1a1pYZ3NJR052Ykd4bFkzUnBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNoeVpYTjFiSFFnUFNBaElXTmhiR3hpWVdOcktIWmhiSFZsTENCcGJtUmxlQ3dnWTI5c2JHVmpkR2x2YmlrcE8xeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUlhoaGJXbHVaWE1nWldGamFDQmxiR1Z0Wlc1MElHbHVJR0VnWUdOdmJHeGxZM1JwYjI1Z0xDQnlaWFIxY201cGJtY2dZVzRnWVhKeVlYa2diMllnWVd4c0lHVnNaVzFsYm5SelhHNGdJQ0FxSUhSb1pTQmdZMkZzYkdKaFkydGdJSEpsZEhWeWJuTWdkSEoxZEdoNUlHWnZjaTRnVkdobElHQmpZV3hzWW1GamEyQWdhWE1nWW05MWJtUWdkRzhnWUhSb2FYTkJjbWRnSUdGdVpGeHVJQ0FnS2lCcGJuWnZhMlZrSUhkcGRHZ2dkR2h5WldVZ1lYSm5kVzFsYm5Sek95QW9kbUZzZFdVc0lHbHVaR1Y0Zkd0bGVTd2dZMjlzYkdWamRHbHZiaWt1WEc0Z0lDQXFYRzRnSUNBcUlFbG1JR0VnY0hKdmNHVnlkSGtnYm1GdFpTQnBjeUJ3WVhOelpXUWdabTl5SUdCallXeHNZbUZqYTJBc0lIUm9aU0JqY21WaGRHVmtJRndpWHk1d2JIVmphMXdpSUhOMGVXeGxYRzRnSUNBcUlHTmhiR3hpWVdOcklIZHBiR3dnY21WMGRYSnVJSFJvWlNCd2NtOXdaWEowZVNCMllXeDFaU0J2WmlCMGFHVWdaMmwyWlc0Z1pXeGxiV1Z1ZEM1Y2JpQWdJQ3BjYmlBZ0lDb2dTV1lnWVc0Z2IySnFaV04wSUdseklIQmhjM05sWkNCbWIzSWdZR05oYkd4aVlXTnJZQ3dnZEdobElHTnlaV0YwWldRZ1hDSmZMbmRvWlhKbFhDSWdjM1I1YkdVZ1kyRnNiR0poWTJ0Y2JpQWdJQ29nZDJsc2JDQnlaWFIxY200Z1lIUnlkV1ZnSUdadmNpQmxiR1Z0Wlc1MGN5QjBhR0YwSUdoaGRtVWdkR2hsSUhCeWIzQmxkR2xsY3lCdlppQjBhR1VnWjJsMlpXNGdiMkpxWldOMExGeHVJQ0FnS2lCbGJITmxJR0JtWVd4elpXQXVYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRR0ZzYVdGeklITmxiR1ZqZEZ4dUlDQWdLaUJBWTJGMFpXZHZjbmtnUTI5c2JHVmpkR2x2Ym5OY2JpQWdJQ29nUUhCaGNtRnRJSHRCY25KaGVYeFBZbXBsWTNSOFUzUnlhVzVuZlNCamIyeHNaV04wYVc5dUlGUm9aU0JqYjJ4c1pXTjBhVzl1SUhSdklHbDBaWEpoZEdVZ2IzWmxjaTVjYmlBZ0lDb2dRSEJoY21GdElIdEdkVzVqZEdsdmJueFBZbXBsWTNSOFUzUnlhVzVuZlNCYlkyRnNiR0poWTJzOWFXUmxiblJwZEhsZElGUm9aU0JtZFc1amRHbHZiaUJqWVd4c1pXUWdjR1Z5WEc0Z0lDQXFJQ0JwZEdWeVlYUnBiMjR1SUVsbUlHRWdjSEp2Y0dWeWRIa2dibUZ0WlNCdmNpQnZZbXBsWTNRZ2FYTWdjR0Z6YzJWa0xDQnBkQ0IzYVd4c0lHSmxJSFZ6WldRZ2RHOGdZM0psWVhSbFhHNGdJQ0FxSUNCaElGd2lYeTV3YkhWamExd2lJRzl5SUZ3aVh5NTNhR1Z5WlZ3aUlITjBlV3hsSUdOaGJHeGlZV05yTENCeVpYTndaV04wYVhabGJIa3VYRzRnSUNBcUlFQndZWEpoYlNCN1RXbDRaV1I5SUZ0MGFHbHpRWEpuWFNCVWFHVWdZSFJvYVhOZ0lHSnBibVJwYm1jZ2IyWWdZR05oYkd4aVlXTnJZQzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMEZ5Y21GNWZTQlNaWFIxY201eklHRWdibVYzSUdGeWNtRjVJRzltSUdWc1pXMWxiblJ6SUhSb1lYUWdjR0Z6YzJWa0lIUm9aU0JqWVd4c1ltRmpheUJqYUdWamF5NWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dkbUZ5SUdWMlpXNXpJRDBnWHk1bWFXeDBaWElvV3pFc0lESXNJRE1zSURRc0lEVXNJRFpkTENCbWRXNWpkR2x2YmlodWRXMHBJSHNnY21WMGRYSnVJRzUxYlNBbElESWdQVDBnTURzZ2ZTazdYRzRnSUNBcUlDOHZJRDArSUZzeUxDQTBMQ0EyWFZ4dUlDQWdLbHh1SUNBZ0tpQjJZWElnWm05dlpDQTlJRnRjYmlBZ0lDb2dJQ0I3SUNkdVlXMWxKem9nSjJGd2NHeGxKeXdnSUNkdmNtZGhibWxqSnpvZ1ptRnNjMlVzSUNkMGVYQmxKem9nSjJaeWRXbDBKeUI5TEZ4dUlDQWdLaUFnSUhzZ0oyNWhiV1VuT2lBblkyRnljbTkwSnl3Z0oyOXlaMkZ1YVdNbk9pQjBjblZsTENBZ0ozUjVjR1VuT2lBbmRtVm5aWFJoWW14bEp5QjlYRzRnSUNBcUlGMDdYRzRnSUNBcVhHNGdJQ0FxSUM4dklIVnphVzVuSUZ3aVh5NXdiSFZqYTF3aUlHTmhiR3hpWVdOcklITm9iM0owYUdGdVpGeHVJQ0FnS2lCZkxtWnBiSFJsY2lobWIyOWtMQ0FuYjNKbllXNXBZeWNwTzF4dUlDQWdLaUF2THlBOVBpQmJleUFuYm1GdFpTYzZJQ2RqWVhKeWIzUW5MQ0FuYjNKbllXNXBZeWM2SUhSeWRXVXNJQ2QwZVhCbEp6b2dKM1psWjJWMFlXSnNaU2NnZlYxY2JpQWdJQ3BjYmlBZ0lDb2dMeThnZFhOcGJtY2dYQ0pmTG5kb1pYSmxYQ0lnWTJGc2JHSmhZMnNnYzJodmNuUm9ZVzVrWEc0Z0lDQXFJRjh1Wm1sc2RHVnlLR1p2YjJRc0lIc2dKM1I1Y0dVbk9pQW5abkoxYVhRbklIMHBPMXh1SUNBZ0tpQXZMeUE5UGlCYmV5QW5ibUZ0WlNjNklDZGhjSEJzWlNjc0lDZHZjbWRoYm1sakp6b2dabUZzYzJVc0lDZDBlWEJsSnpvZ0oyWnlkV2wwSnlCOVhWeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdabWxzZEdWeUtHTnZiR3hsWTNScGIyNHNJR05oYkd4aVlXTnJMQ0IwYUdselFYSm5LU0I3WEc0Z0lDQWdkbUZ5SUhKbGMzVnNkQ0E5SUZ0ZE8xeHVJQ0FnSUdOaGJHeGlZV05ySUQwZ1kzSmxZWFJsUTJGc2JHSmhZMnNvWTJGc2JHSmhZMnNzSUhSb2FYTkJjbWNwTzF4dVhHNGdJQ0FnYVdZZ0tHbHpRWEp5WVhrb1kyOXNiR1ZqZEdsdmJpa3BJSHRjYmlBZ0lDQWdJSFpoY2lCcGJtUmxlQ0E5SUMweExGeHVJQ0FnSUNBZ0lDQWdJR3hsYm1kMGFDQTlJR052Ykd4bFkzUnBiMjR1YkdWdVozUm9PMXh1WEc0Z0lDQWdJQ0IzYUdsc1pTQW9LeXRwYm1SbGVDQThJR3hsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0IyWVhJZ2RtRnNkV1VnUFNCamIyeHNaV04wYVc5dVcybHVaR1Y0WFR0Y2JpQWdJQ0FnSUNBZ2FXWWdLR05oYkd4aVlXTnJLSFpoYkhWbExDQnBibVJsZUN3Z1kyOXNiR1ZqZEdsdmJpa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYTjFiSFF1Y0hWemFDaDJZV3gxWlNrN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnWldGamFDaGpiMnhzWldOMGFXOXVMQ0JtZFc1amRHbHZiaWgyWVd4MVpTd2dhVzVrWlhnc0lHTnZiR3hsWTNScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHTmhiR3hpWVdOcktIWmhiSFZsTENCcGJtUmxlQ3dnWTI5c2JHVmpkR2x2YmlrcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhOMWJIUXVjSFZ6YUNoMllXeDFaU2s3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4ME8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRVY0WVcxcGJtVnpJR1ZoWTJnZ1pXeGxiV1Z1ZENCcGJpQmhJR0JqYjJ4c1pXTjBhVzl1WUN3Z2NtVjBkWEp1YVc1bklIUm9aU0JtYVhKemRDQjBhR0YwSUhSb1pTQmdZMkZzYkdKaFkydGdYRzRnSUNBcUlISmxkSFZ5Ym5NZ2RISjFkR2g1SUdadmNpNGdWR2hsSUdCallXeHNZbUZqYTJBZ2FYTWdZbTkxYm1RZ2RHOGdZSFJvYVhOQmNtZGdJR0Z1WkNCcGJuWnZhMlZrSUhkcGRHZ2dkR2h5WldWY2JpQWdJQ29nWVhKbmRXMWxiblJ6T3lBb2RtRnNkV1VzSUdsdVpHVjRmR3RsZVN3Z1kyOXNiR1ZqZEdsdmJpa3VYRzRnSUNBcVhHNGdJQ0FxSUVsbUlHRWdjSEp2Y0dWeWRIa2dibUZ0WlNCcGN5QndZWE56WldRZ1ptOXlJR0JqWVd4c1ltRmphMkFzSUhSb1pTQmpjbVZoZEdWa0lGd2lYeTV3YkhWamExd2lJSE4wZVd4bFhHNGdJQ0FxSUdOaGJHeGlZV05ySUhkcGJHd2djbVYwZFhKdUlIUm9aU0J3Y205d1pYSjBlU0IyWVd4MVpTQnZaaUIwYUdVZ1oybDJaVzRnWld4bGJXVnVkQzVjYmlBZ0lDcGNiaUFnSUNvZ1NXWWdZVzRnYjJKcVpXTjBJR2x6SUhCaGMzTmxaQ0JtYjNJZ1lHTmhiR3hpWVdOcllDd2dkR2hsSUdOeVpXRjBaV1FnWENKZkxuZG9aWEpsWENJZ2MzUjViR1VnWTJGc2JHSmhZMnRjYmlBZ0lDb2dkMmxzYkNCeVpYUjFjbTRnWUhSeWRXVmdJR1p2Y2lCbGJHVnRaVzUwY3lCMGFHRjBJR2hoZG1VZ2RHaGxJSEJ5YjNCbGRHbGxjeUJ2WmlCMGFHVWdaMmwyWlc0Z2IySnFaV04wTEZ4dUlDQWdLaUJsYkhObElHQm1ZV3h6WldBdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ6ZEdGMGFXTmNiaUFnSUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFnSUNvZ1FHRnNhV0Z6SUdSbGRHVmpkRnh1SUNBZ0tpQkFZMkYwWldkdmNua2dRMjlzYkdWamRHbHZibk5jYmlBZ0lDb2dRSEJoY21GdElIdEJjbkpoZVh4UFltcGxZM1I4VTNSeWFXNW5mU0JqYjJ4c1pXTjBhVzl1SUZSb1pTQmpiMnhzWldOMGFXOXVJSFJ2SUdsMFpYSmhkR1VnYjNabGNpNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym54UFltcGxZM1I4VTNSeWFXNW5mU0JiWTJGc2JHSmhZMnM5YVdSbGJuUnBkSGxkSUZSb1pTQm1kVzVqZEdsdmJpQmpZV3hzWldRZ2NHVnlYRzRnSUNBcUlDQnBkR1Z5WVhScGIyNHVJRWxtSUdFZ2NISnZjR1Z5ZEhrZ2JtRnRaU0J2Y2lCdlltcGxZM1FnYVhNZ2NHRnpjMlZrTENCcGRDQjNhV3hzSUdKbElIVnpaV1FnZEc4Z1kzSmxZWFJsWEc0Z0lDQXFJQ0JoSUZ3aVh5NXdiSFZqYTF3aUlHOXlJRndpWHk1M2FHVnlaVndpSUhOMGVXeGxJR05oYkd4aVlXTnJMQ0J5WlhOd1pXTjBhWFpsYkhrdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VFdsNFpXUjlJRnQwYUdselFYSm5YU0JVYUdVZ1lIUm9hWE5nSUdKcGJtUnBibWNnYjJZZ1lHTmhiR3hpWVdOcllDNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwMXBlR1ZrZlNCU1pYUjFjbTV6SUhSb1pTQmxiR1Z0Wlc1MElIUm9ZWFFnY0dGemMyVmtJSFJvWlNCallXeHNZbUZqYXlCamFHVmpheXhjYmlBZ0lDb2dJR1ZzYzJVZ1lIVnVaR1ZtYVc1bFpHQXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCbGRtVnVJRDBnWHk1bWFXNWtLRnN4TENBeUxDQXpMQ0EwTENBMUxDQTJYU3dnWm5WdVkzUnBiMjRvYm5WdEtTQjdJSEpsZEhWeWJpQnVkVzBnSlNBeUlEMDlJREE3SUgwcE8xeHVJQ0FnS2lBdkx5QTlQaUF5WEc0Z0lDQXFYRzRnSUNBcUlIWmhjaUJtYjI5a0lEMGdXMXh1SUNBZ0tpQWdJSHNnSjI1aGJXVW5PaUFuWVhCd2JHVW5MQ0FnSjI5eVoyRnVhV01uT2lCbVlXeHpaU3dnSjNSNWNHVW5PaUFuWm5KMWFYUW5JSDBzWEc0Z0lDQXFJQ0FnZXlBbmJtRnRaU2M2SUNkaVlXNWhibUVuTENBbmIzSm5ZVzVwWXljNklIUnlkV1VzSUNBbmRIbHdaU2M2SUNkbWNuVnBkQ2NnZlN4Y2JpQWdJQ29nSUNCN0lDZHVZVzFsSnpvZ0oySmxaWFFuTENBZ0lDZHZjbWRoYm1sakp6b2dabUZzYzJVc0lDZDBlWEJsSnpvZ0ozWmxaMlYwWVdKc1pTY2dmU3hjYmlBZ0lDb2dJQ0I3SUNkdVlXMWxKem9nSjJOaGNuSnZkQ2NzSUNkdmNtZGhibWxqSnpvZ2RISjFaU3dnSUNkMGVYQmxKem9nSjNabFoyVjBZV0pzWlNjZ2ZWeHVJQ0FnS2lCZE8xeHVJQ0FnS2x4dUlDQWdLaUF2THlCMWMybHVaeUJjSWw4dWQyaGxjbVZjSWlCallXeHNZbUZqYXlCemFHOXlkR2hoYm1SY2JpQWdJQ29nZG1GeUlIWmxaMmRwWlNBOUlGOHVabWx1WkNobWIyOWtMQ0I3SUNkMGVYQmxKem9nSjNabFoyVjBZV0pzWlNjZ2ZTazdYRzRnSUNBcUlDOHZJRDArSUhzZ0oyNWhiV1VuT2lBblltVmxkQ2NzSUNkdmNtZGhibWxqSnpvZ1ptRnNjMlVzSUNkMGVYQmxKem9nSjNabFoyVjBZV0pzWlNjZ2ZWeHVJQ0FnS2x4dUlDQWdLaUF2THlCMWMybHVaeUJjSWw4dWNHeDFZMnRjSWlCallXeHNZbUZqYXlCemFHOXlkR2hoYm1SY2JpQWdJQ29nZG1GeUlHaGxZV3gwYUhrZ1BTQmZMbVpwYm1Rb1ptOXZaQ3dnSjI5eVoyRnVhV01uS1R0Y2JpQWdJQ29nTHk4Z1BUNGdleUFuYm1GdFpTYzZJQ2RpWVc1aGJtRW5MQ0FuYjNKbllXNXBZeWM2SUhSeWRXVXNJQ2QwZVhCbEp6b2dKMlp5ZFdsMEp5QjlYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJtYVc1a0tHTnZiR3hsWTNScGIyNHNJR05oYkd4aVlXTnJMQ0IwYUdselFYSm5LU0I3WEc0Z0lDQWdkbUZ5SUhKbGMzVnNkRHRjYmlBZ0lDQmpZV3hzWW1GamF5QTlJR055WldGMFpVTmhiR3hpWVdOcktHTmhiR3hpWVdOckxDQjBhR2x6UVhKbktUdGNibHh1SUNBZ0lHWnZja1ZoWTJnb1kyOXNiR1ZqZEdsdmJpd2dablZ1WTNScGIyNG9kbUZzZFdVc0lHbHVaR1Y0TENCamIyeHNaV04wYVc5dUtTQjdYRzRnSUNBZ0lDQnBaaUFvWTJGc2JHSmhZMnNvZG1Gc2RXVXNJR2x1WkdWNExDQmpiMnhzWldOMGFXOXVLU2tnZTF4dUlDQWdJQ0FnSUNCeVpYTjFiSFFnUFNCMllXeDFaVHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwcE8xeHVJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nU1hSbGNtRjBaWE1nYjNabGNpQmhJR0JqYjJ4c1pXTjBhVzl1WUN3Z1pYaGxZM1YwYVc1bklIUm9aU0JnWTJGc2JHSmhZMnRnSUdadmNpQmxZV05vSUdWc1pXMWxiblFnYVc1Y2JpQWdJQ29nZEdobElHQmpiMnhzWldOMGFXOXVZQzRnVkdobElHQmpZV3hzWW1GamEyQWdhWE1nWW05MWJtUWdkRzhnWUhSb2FYTkJjbWRnSUdGdVpDQnBiblp2YTJWa0lIZHBkR2dnZEdoeVpXVmNiaUFnSUNvZ1lYSm5kVzFsYm5Sek95QW9kbUZzZFdVc0lHbHVaR1Y0Zkd0bGVTd2dZMjlzYkdWamRHbHZiaWt1SUVOaGJHeGlZV05yY3lCdFlYa2daWGhwZENCcGRHVnlZWFJwYjI0Z1pXRnliSGxjYmlBZ0lDb2dZbmtnWlhod2JHbGphWFJzZVNCeVpYUjFjbTVwYm1jZ1lHWmhiSE5sWUM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVlXeHBZWE1nWldGamFGeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1EyOXNiR1ZqZEdsdmJuTmNiaUFnSUNvZ1FIQmhjbUZ0SUh0QmNuSmhlWHhQWW1wbFkzUjhVM1J5YVc1bmZTQmpiMnhzWldOMGFXOXVJRlJvWlNCamIyeHNaV04wYVc5dUlIUnZJR2wwWlhKaGRHVWdiM1psY2k1Y2JpQWdJQ29nUUhCaGNtRnRJSHRHZFc1amRHbHZibjBnVzJOaGJHeGlZV05yUFdsa1pXNTBhWFI1WFNCVWFHVWdablZ1WTNScGIyNGdZMkZzYkdWa0lIQmxjaUJwZEdWeVlYUnBiMjR1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUV2w0WldSOUlGdDBhR2x6UVhKblhTQlVhR1VnWUhSb2FYTmdJR0pwYm1ScGJtY2diMllnWUdOaGJHeGlZV05yWUM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBGeWNtRjVmRTlpYW1WamRIeFRkSEpwYm1kOUlGSmxkSFZ5Ym5NZ1lHTnZiR3hsWTNScGIyNWdMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUJmS0ZzeExDQXlMQ0F6WFNrdVptOXlSV0ZqYUNoaGJHVnlkQ2t1YW05cGJpZ25MQ2NwTzF4dUlDQWdLaUF2THlBOVBpQmhiR1Z5ZEhNZ1pXRmphQ0J1ZFcxaVpYSWdZVzVrSUhKbGRIVnlibk1nSnpFc01pd3pKMXh1SUNBZ0tseHVJQ0FnS2lCZkxtWnZja1ZoWTJnb2V5QW5iMjVsSnpvZ01Td2dKM1IzYnljNklESXNJQ2QwYUhKbFpTYzZJRE1nZlN3Z1lXeGxjblFwTzF4dUlDQWdLaUF2THlBOVBpQmhiR1Z5ZEhNZ1pXRmphQ0J1ZFcxaVpYSWdkbUZzZFdVZ0tHOXlaR1Z5SUdseklHNXZkQ0JuZFdGeVlXNTBaV1ZrS1Z4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z1ptOXlSV0ZqYUNoamIyeHNaV04wYVc5dUxDQmpZV3hzWW1GamF5d2dkR2hwYzBGeVp5a2dlMXh1SUNBZ0lHbG1JQ2hqWVd4c1ltRmpheUFtSmlCMGVYQmxiMllnZEdocGMwRnlaeUE5UFNBbmRXNWtaV1pwYm1Wa0p5QW1KaUJwYzBGeWNtRjVLR052Ykd4bFkzUnBiMjRwS1NCN1hHNGdJQ0FnSUNCMllYSWdhVzVrWlhnZ1BTQXRNU3hjYmlBZ0lDQWdJQ0FnSUNCc1pXNW5kR2dnUFNCamIyeHNaV04wYVc5dUxteGxibWQwYUR0Y2JseHVJQ0FnSUNBZ2QyaHBiR1VnS0NzcmFXNWtaWGdnUENCc1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLR05oYkd4aVlXTnJLR052Ykd4bFkzUnBiMjViYVc1a1pYaGRMQ0JwYm1SbGVDd2dZMjlzYkdWamRHbHZiaWtnUFQwOUlHWmhiSE5sS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnWldGamFDaGpiMnhzWldOMGFXOXVMQ0JqWVd4c1ltRmpheXdnZEdocGMwRnlaeWs3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCamIyeHNaV04wYVc5dU8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU55WldGMFpYTWdZVzRnYjJKcVpXTjBJR052YlhCdmMyVmtJRzltSUd0bGVYTWdjbVYwZFhKdVpXUWdabkp2YlNCeWRXNXVhVzVuSUdWaFkyZ2daV3hsYldWdWRDQnZaaUIwYUdWY2JpQWdJQ29nWUdOdmJHeGxZM1JwYjI1Z0lIUm9jbTkxWjJnZ2RHaGxJR0JqWVd4c1ltRmphMkF1SUZSb1pTQmpiM0p5WlhOd2IyNWthVzVuSUhaaGJIVmxJRzltSUdWaFkyZ2dhMlY1SUdselhHNGdJQ0FxSUdGdUlHRnljbUY1SUc5bUlHVnNaVzFsYm5SeklIQmhjM05sWkNCMGJ5QmdZMkZzYkdKaFkydGdJSFJvWVhRZ2NtVjBkWEp1WldRZ2RHaGxJR3RsZVM0Z1ZHaGxJR0JqWVd4c1ltRmphMkJjYmlBZ0lDb2dhWE1nWW05MWJtUWdkRzhnWUhSb2FYTkJjbWRnSUdGdVpDQnBiblp2YTJWa0lIZHBkR2dnZEdoeVpXVWdZWEpuZFcxbGJuUnpPeUFvZG1Gc2RXVXNJR2x1WkdWNGZHdGxlU3dnWTI5c2JHVmpkR2x2YmlrdVhHNGdJQ0FxWEc0Z0lDQXFJRWxtSUdFZ2NISnZjR1Z5ZEhrZ2JtRnRaU0JwY3lCd1lYTnpaV1FnWm05eUlHQmpZV3hzWW1GamEyQXNJSFJvWlNCamNtVmhkR1ZrSUZ3aVh5NXdiSFZqYTF3aUlITjBlV3hsWEc0Z0lDQXFJR05oYkd4aVlXTnJJSGRwYkd3Z2NtVjBkWEp1SUhSb1pTQndjbTl3WlhKMGVTQjJZV3gxWlNCdlppQjBhR1VnWjJsMlpXNGdaV3hsYldWdWRDNWNiaUFnSUNwY2JpQWdJQ29nU1dZZ1lXNGdiMkpxWldOMElHbHpJSEJoYzNObFpDQm1iM0lnWUdOaGJHeGlZV05yWUN3Z2RHaGxJR055WldGMFpXUWdYQ0pmTG5kb1pYSmxYQ0lnYzNSNWJHVWdZMkZzYkdKaFkydGNiaUFnSUNvZ2QybHNiQ0J5WlhSMWNtNGdZSFJ5ZFdWZ0lHWnZjaUJsYkdWdFpXNTBjeUIwYUdGMElHaGhkbVVnZEdobElIQnliM0JsZEdsbGN5QnZaaUIwYUdVZ1oybDJaVzRnYjJKcVpXTjBMRnh1SUNBZ0tpQmxiSE5sSUdCbVlXeHpaV0JjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnUTI5c2JHVmpkR2x2Ym5OY2JpQWdJQ29nUUhCaGNtRnRJSHRCY25KaGVYeFBZbXBsWTNSOFUzUnlhVzVuZlNCamIyeHNaV04wYVc5dUlGUm9aU0JqYjJ4c1pXTjBhVzl1SUhSdklHbDBaWEpoZEdVZ2IzWmxjaTVjYmlBZ0lDb2dRSEJoY21GdElIdEdkVzVqZEdsdmJueFBZbXBsWTNSOFUzUnlhVzVuZlNCYlkyRnNiR0poWTJzOWFXUmxiblJwZEhsZElGUm9aU0JtZFc1amRHbHZiaUJqWVd4c1pXUWdjR1Z5WEc0Z0lDQXFJQ0JwZEdWeVlYUnBiMjR1SUVsbUlHRWdjSEp2Y0dWeWRIa2dibUZ0WlNCdmNpQnZZbXBsWTNRZ2FYTWdjR0Z6YzJWa0xDQnBkQ0IzYVd4c0lHSmxJSFZ6WldRZ2RHOGdZM0psWVhSbFhHNGdJQ0FxSUNCaElGd2lYeTV3YkhWamExd2lJRzl5SUZ3aVh5NTNhR1Z5WlZ3aUlITjBlV3hsSUdOaGJHeGlZV05yTENCeVpYTndaV04wYVhabGJIa3VYRzRnSUNBcUlFQndZWEpoYlNCN1RXbDRaV1I5SUZ0MGFHbHpRWEpuWFNCVWFHVWdZSFJvYVhOZ0lHSnBibVJwYm1jZ2IyWWdZR05oYkd4aVlXTnJZQzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMDlpYW1WamRIMGdVbVYwZFhKdWN5QjBhR1VnWTI5dGNHOXpaV1FnWVdkbmNtVm5ZWFJsSUc5aWFtVmpkQzVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nWHk1bmNtOTFjRUo1S0ZzMExqSXNJRFl1TVN3Z05pNDBYU3dnWm5WdVkzUnBiMjRvYm5WdEtTQjdJSEpsZEhWeWJpQk5ZWFJvTG1ac2IyOXlLRzUxYlNrN0lIMHBPMXh1SUNBZ0tpQXZMeUE5UGlCN0lDYzBKem9nV3pRdU1sMHNJQ2MySnpvZ1d6WXVNU3dnTmk0MFhTQjlYRzRnSUNBcVhHNGdJQ0FxSUY4dVozSnZkWEJDZVNoYk5DNHlMQ0EyTGpFc0lEWXVORjBzSUdaMWJtTjBhVzl1S0c1MWJTa2dleUJ5WlhSMWNtNGdkR2hwY3k1bWJHOXZjaWh1ZFcwcE95QjlMQ0JOWVhSb0tUdGNiaUFnSUNvZ0x5OGdQVDRnZXlBbk5DYzZJRnMwTGpKZExDQW5OaWM2SUZzMkxqRXNJRFl1TkYwZ2ZWeHVJQ0FnS2x4dUlDQWdLaUF2THlCMWMybHVaeUJjSWw4dWNHeDFZMnRjSWlCallXeHNZbUZqYXlCemFHOXlkR2hoYm1SY2JpQWdJQ29nWHk1bmNtOTFjRUo1S0ZzbmIyNWxKeXdnSjNSM2J5Y3NJQ2QwYUhKbFpTZGRMQ0FuYkdWdVozUm9KeWs3WEc0Z0lDQXFJQzh2SUQwK0lIc2dKek1uT2lCYkoyOXVaU2NzSUNkMGQyOG5YU3dnSnpVbk9pQmJKM1JvY21WbEoxMGdmVnh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnWjNKdmRYQkNlU2hqYjJ4c1pXTjBhVzl1TENCallXeHNZbUZqYXl3Z2RHaHBjMEZ5WnlrZ2UxeHVJQ0FnSUhaaGNpQnlaWE4xYkhRZ1BTQjdmVHRjYmlBZ0lDQmpZV3hzWW1GamF5QTlJR055WldGMFpVTmhiR3hpWVdOcktHTmhiR3hpWVdOckxDQjBhR2x6UVhKbktUdGNibHh1SUNBZ0lHWnZja1ZoWTJnb1kyOXNiR1ZqZEdsdmJpd2dablZ1WTNScGIyNG9kbUZzZFdVc0lHdGxlU3dnWTI5c2JHVmpkR2x2YmlrZ2UxeHVJQ0FnSUNBZ2EyVjVJRDBnWTJGc2JHSmhZMnNvZG1Gc2RXVXNJR3RsZVN3Z1kyOXNiR1ZqZEdsdmJpa2dLeUFuSnp0Y2JpQWdJQ0FnSUNob1lYTlBkMjVRY205d1pYSjBlUzVqWVd4c0tISmxjM1ZzZEN3Z2EyVjVLU0EvSUhKbGMzVnNkRnRyWlhsZElEb2djbVZ6ZFd4MFcydGxlVjBnUFNCYlhTa3VjSFZ6YUNoMllXeDFaU2s3WEc0Z0lDQWdmU2s3WEc0Z0lDQWdjbVYwZFhKdUlISmxjM1ZzZER0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkpiblp2YTJWeklIUm9aU0J0WlhSb2IyUWdibUZ0WldRZ1lua2dZRzFsZEdodlpFNWhiV1ZnSUc5dUlHVmhZMmdnWld4bGJXVnVkQ0JwYmlCMGFHVWdZR052Ykd4bFkzUnBiMjVnTEZ4dUlDQWdLaUJ5WlhSMWNtNXBibWNnWVc0Z1lYSnlZWGtnYjJZZ2RHaGxJSEpsYzNWc2RITWdiMllnWldGamFDQnBiblp2YTJWa0lHMWxkR2h2WkM0Z1FXUmthWFJwYjI1aGJDQmhjbWQxYldWdWRITmNiaUFnSUNvZ2QybHNiQ0JpWlNCd1lYTnpaV1FnZEc4Z1pXRmphQ0JwYm5admEyVmtJRzFsZEdodlpDNGdTV1lnWUcxbGRHaHZaRTVoYldWZ0lHbHpJR0VnWm5WdVkzUnBiMjRzSUdsMElIZHBiR3hjYmlBZ0lDb2dZbVVnYVc1MmIydGxaQ0JtYjNJc0lHRnVaQ0JnZEdocGMyQWdZbTkxYm1RZ2RHOHNJR1ZoWTJnZ1pXeGxiV1Z1ZENCcGJpQjBhR1VnWUdOdmJHeGxZM1JwYjI1Z0xseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQkRiMnhzWldOMGFXOXVjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwRnljbUY1ZkU5aWFtVmpkSHhUZEhKcGJtZDlJR052Ykd4bFkzUnBiMjRnVkdobElHTnZiR3hsWTNScGIyNGdkRzhnYVhSbGNtRjBaU0J2ZG1WeUxseHVJQ0FnS2lCQWNHRnlZVzBnZTBaMWJtTjBhVzl1ZkZOMGNtbHVaMzBnYldWMGFHOWtUbUZ0WlNCVWFHVWdibUZ0WlNCdlppQjBhR1VnYldWMGFHOWtJSFJ2SUdsdWRtOXJaU0J2Y2x4dUlDQWdLaUFnZEdobElHWjFibU4wYVc5dUlHbHVkbTlyWldRZ2NHVnlJR2wwWlhKaGRHbHZiaTVjYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ1cyRnlaekVzSUdGeVp6SXNJQzR1TGwwZ1FYSm5kVzFsYm5SeklIUnZJR2x1ZG05clpTQjBhR1VnYldWMGFHOWtJSGRwZEdndVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0QmNuSmhlWDBnVW1WMGRYSnVjeUJoSUc1bGR5QmhjbkpoZVNCdlppQjBhR1VnY21WemRXeDBjeUJ2WmlCbFlXTm9JR2x1ZG05clpXUWdiV1YwYUc5a0xseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQmZMbWx1ZG05clpTaGJXelVzSURFc0lEZGRMQ0JiTXl3Z01pd2dNVjFkTENBbmMyOXlkQ2NwTzF4dUlDQWdLaUF2THlBOVBpQmJXekVzSURVc0lEZGRMQ0JiTVN3Z01pd2dNMTFkWEc0Z0lDQXFYRzRnSUNBcUlGOHVhVzUyYjJ0bEtGc3hNak1zSURRMU5sMHNJRk4wY21sdVp5NXdjbTkwYjNSNWNHVXVjM0JzYVhRc0lDY25LVHRjYmlBZ0lDb2dMeThnUFQ0Z1cxc25NU2NzSUNjeUp5d2dKek1uWFN3Z1d5YzBKeXdnSnpVbkxDQW5OaWRkWFZ4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z2FXNTJiMnRsS0dOdmJHeGxZM1JwYjI0c0lHMWxkR2h2WkU1aGJXVXBJSHRjYmlBZ0lDQjJZWElnWVhKbmN5QTlJSE5zYVdObEtHRnlaM1Z0Wlc1MGN5d2dNaWtzWEc0Z0lDQWdJQ0FnSUdsdVpHVjRJRDBnTFRFc1hHNGdJQ0FnSUNBZ0lHbHpSblZ1WXlBOUlIUjVjR1Z2WmlCdFpYUm9iMlJPWVcxbElEMDlJQ2RtZFc1amRHbHZiaWNzWEc0Z0lDQWdJQ0FnSUd4bGJtZDBhQ0E5SUdOdmJHeGxZM1JwYjI0Z1B5QmpiMnhzWldOMGFXOXVMbXhsYm1kMGFDQTZJREFzWEc0Z0lDQWdJQ0FnSUhKbGMzVnNkQ0E5SUVGeWNtRjVLSFI1Y0dWdlppQnNaVzVuZEdnZ1BUMGdKMjUxYldKbGNpY2dQeUJzWlc1bmRHZ2dPaUF3S1R0Y2JseHVJQ0FnSUdadmNrVmhZMmdvWTI5c2JHVmpkR2x2Yml3Z1puVnVZM1JwYjI0b2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUhKbGMzVnNkRnNySzJsdVpHVjRYU0E5SUNocGMwWjFibU1nUHlCdFpYUm9iMlJPWVcxbElEb2dkbUZzZFdWYmJXVjBhRzlrVG1GdFpWMHBMbUZ3Y0d4NUtIWmhiSFZsTENCaGNtZHpLVHRjYmlBZ0lDQjlLVHRjYmlBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTnlaV0YwWlhNZ1lXNGdZWEp5WVhrZ2IyWWdkbUZzZFdWeklHSjVJSEoxYm01cGJtY2daV0ZqYUNCbGJHVnRaVzUwSUdsdUlIUm9aU0JnWTI5c2JHVmpkR2x2Ym1CY2JpQWdJQ29nZEdoeWIzVm5hQ0IwYUdVZ1lHTmhiR3hpWVdOcllDNGdWR2hsSUdCallXeHNZbUZqYTJBZ2FYTWdZbTkxYm1RZ2RHOGdZSFJvYVhOQmNtZGdJR0Z1WkNCcGJuWnZhMlZrSUhkcGRHaGNiaUFnSUNvZ2RHaHlaV1VnWVhKbmRXMWxiblJ6T3lBb2RtRnNkV1VzSUdsdVpHVjRmR3RsZVN3Z1kyOXNiR1ZqZEdsdmJpa3VYRzRnSUNBcVhHNGdJQ0FxSUVsbUlHRWdjSEp2Y0dWeWRIa2dibUZ0WlNCcGN5QndZWE56WldRZ1ptOXlJR0JqWVd4c1ltRmphMkFzSUhSb1pTQmpjbVZoZEdWa0lGd2lYeTV3YkhWamExd2lJSE4wZVd4bFhHNGdJQ0FxSUdOaGJHeGlZV05ySUhkcGJHd2djbVYwZFhKdUlIUm9aU0J3Y205d1pYSjBlU0IyWVd4MVpTQnZaaUIwYUdVZ1oybDJaVzRnWld4bGJXVnVkQzVjYmlBZ0lDcGNiaUFnSUNvZ1NXWWdZVzRnYjJKcVpXTjBJR2x6SUhCaGMzTmxaQ0JtYjNJZ1lHTmhiR3hpWVdOcllDd2dkR2hsSUdOeVpXRjBaV1FnWENKZkxuZG9aWEpsWENJZ2MzUjViR1VnWTJGc2JHSmhZMnRjYmlBZ0lDb2dkMmxzYkNCeVpYUjFjbTRnWUhSeWRXVmdJR1p2Y2lCbGJHVnRaVzUwY3lCMGFHRjBJR2hoZG1VZ2RHaGxJSEJ5YjNCbGRHbGxjeUJ2WmlCMGFHVWdaMmwyWlc0Z2IySnFaV04wTEZ4dUlDQWdLaUJsYkhObElHQm1ZV3h6WldBdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ6ZEdGMGFXTmNiaUFnSUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFnSUNvZ1FHRnNhV0Z6SUdOdmJHeGxZM1JjYmlBZ0lDb2dRR05oZEdWbmIzSjVJRU52Ykd4bFkzUnBiMjV6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdRWEp5WVhsOFQySnFaV04wZkZOMGNtbHVaMzBnWTI5c2JHVmpkR2x2YmlCVWFHVWdZMjlzYkdWamRHbHZiaUIwYnlCcGRHVnlZWFJsSUc5MlpYSXVYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OFQySnFaV04wZkZOMGNtbHVaMzBnVzJOaGJHeGlZV05yUFdsa1pXNTBhWFI1WFNCVWFHVWdablZ1WTNScGIyNGdZMkZzYkdWa0lIQmxjbHh1SUNBZ0tpQWdhWFJsY21GMGFXOXVMaUJKWmlCaElIQnliM0JsY25SNUlHNWhiV1VnYjNJZ2IySnFaV04wSUdseklIQmhjM05sWkN3Z2FYUWdkMmxzYkNCaVpTQjFjMlZrSUhSdklHTnlaV0YwWlZ4dUlDQWdLaUFnWVNCY0lsOHVjR3gxWTJ0Y0lpQnZjaUJjSWw4dWQyaGxjbVZjSWlCemRIbHNaU0JqWVd4c1ltRmpheXdnY21WemNHVmpkR2wyWld4NUxseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0JiZEdocGMwRnlaMTBnVkdobElHQjBhR2x6WUNCaWFXNWthVzVuSUc5bUlHQmpZV3hzWW1GamEyQXVYRzRnSUNBcUlFQnlaWFIxY201eklIdEJjbkpoZVgwZ1VtVjBkWEp1Y3lCaElHNWxkeUJoY25KaGVTQnZaaUIwYUdVZ2NtVnpkV3gwY3lCdlppQmxZV05vSUdCallXeHNZbUZqYTJBZ1pYaGxZM1YwYVc5dUxseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQmZMbTFoY0NoYk1Td2dNaXdnTTEwc0lHWjFibU4wYVc5dUtHNTFiU2tnZXlCeVpYUjFjbTRnYm5WdElDb2dNenNnZlNrN1hHNGdJQ0FxSUM4dklEMCtJRnN6TENBMkxDQTVYVnh1SUNBZ0tseHVJQ0FnS2lCZkxtMWhjQ2g3SUNkdmJtVW5PaUF4TENBbmRIZHZKem9nTWl3Z0ozUm9jbVZsSnpvZ015QjlMQ0JtZFc1amRHbHZiaWh1ZFcwcElIc2djbVYwZFhKdUlHNTFiU0FxSURNN0lIMHBPMXh1SUNBZ0tpQXZMeUE5UGlCYk15d2dOaXdnT1YwZ0tHOXlaR1Z5SUdseklHNXZkQ0JuZFdGeVlXNTBaV1ZrS1Z4dUlDQWdLbHh1SUNBZ0tpQjJZWElnYzNSdmIyZGxjeUE5SUZ0Y2JpQWdJQ29nSUNCN0lDZHVZVzFsSnpvZ0oyMXZaU2NzSUNkaFoyVW5PaUEwTUNCOUxGeHVJQ0FnS2lBZ0lIc2dKMjVoYldVbk9pQW5iR0Z5Y25rbkxDQW5ZV2RsSnpvZ05UQWdmVnh1SUNBZ0tpQmRPMXh1SUNBZ0tseHVJQ0FnS2lBdkx5QjFjMmx1WnlCY0lsOHVjR3gxWTJ0Y0lpQmpZV3hzWW1GamF5QnphRzl5ZEdoaGJtUmNiaUFnSUNvZ1h5NXRZWEFvYzNSdmIyZGxjeXdnSjI1aGJXVW5LVHRjYmlBZ0lDb2dMeThnUFQ0Z1d5ZHRiMlVuTENBbmJHRnljbmtuWFZ4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z2JXRndLR052Ykd4bFkzUnBiMjRzSUdOaGJHeGlZV05yTENCMGFHbHpRWEpuS1NCN1hHNGdJQ0FnZG1GeUlHbHVaR1Y0SUQwZ0xURXNYRzRnSUNBZ0lDQWdJR3hsYm1kMGFDQTlJR052Ykd4bFkzUnBiMjRnUHlCamIyeHNaV04wYVc5dUxteGxibWQwYUNBNklEQXNYRzRnSUNBZ0lDQWdJSEpsYzNWc2RDQTlJRUZ5Y21GNUtIUjVjR1Z2WmlCc1pXNW5kR2dnUFQwZ0oyNTFiV0psY2ljZ1B5QnNaVzVuZEdnZ09pQXdLVHRjYmx4dUlDQWdJR05oYkd4aVlXTnJJRDBnWTNKbFlYUmxRMkZzYkdKaFkyc29ZMkZzYkdKaFkyc3NJSFJvYVhOQmNtY3BPMXh1SUNBZ0lHbG1JQ2hwYzBGeWNtRjVLR052Ykd4bFkzUnBiMjRwS1NCN1hHNGdJQ0FnSUNCM2FHbHNaU0FvS3l0cGJtUmxlQ0E4SUd4bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYTjFiSFJiYVc1a1pYaGRJRDBnWTJGc2JHSmhZMnNvWTI5c2JHVmpkR2x2Ymx0cGJtUmxlRjBzSUdsdVpHVjRMQ0JqYjJ4c1pXTjBhVzl1S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdaV0ZqYUNoamIyeHNaV04wYVc5dUxDQm1kVzVqZEdsdmJpaDJZV3gxWlN3Z2EyVjVMQ0JqYjJ4c1pXTjBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lISmxjM1ZzZEZzcksybHVaR1Y0WFNBOUlHTmhiR3hpWVdOcktIWmhiSFZsTENCclpYa3NJR052Ykd4bFkzUnBiMjRwTzF4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnlaWE4xYkhRN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbVYwY21sbGRtVnpJSFJvWlNCdFlYaHBiWFZ0SUhaaGJIVmxJRzltSUdGdUlHQmhjbkpoZVdBdUlFbG1JR0JqWVd4c1ltRmphMkFnYVhNZ2NHRnpjMlZrTEZ4dUlDQWdLaUJwZENCM2FXeHNJR0psSUdWNFpXTjFkR1ZrSUdadmNpQmxZV05vSUhaaGJIVmxJR2x1SUhSb1pTQmdZWEp5WVhsZ0lIUnZJR2RsYm1WeVlYUmxJSFJvWlZ4dUlDQWdLaUJqY21sMFpYSnBiMjRnWW5rZ2QyaHBZMmdnZEdobElIWmhiSFZsSUdseklISmhibXRsWkM0Z1ZHaGxJR0JqWVd4c1ltRmphMkFnYVhNZ1ltOTFibVFnZEc5Y2JpQWdJQ29nWUhSb2FYTkJjbWRnSUdGdVpDQnBiblp2YTJWa0lIZHBkR2dnZEdoeVpXVWdZWEpuZFcxbGJuUnpPeUFvZG1Gc2RXVXNJR2x1WkdWNExDQmpiMnhzWldOMGFXOXVLUzVjYmlBZ0lDcGNiaUFnSUNvZ1NXWWdZU0J3Y205d1pYSjBlU0J1WVcxbElHbHpJSEJoYzNObFpDQm1iM0lnWUdOaGJHeGlZV05yWUN3Z2RHaGxJR055WldGMFpXUWdYQ0pmTG5Cc2RXTnJYQ0lnYzNSNWJHVmNiaUFnSUNvZ1kyRnNiR0poWTJzZ2QybHNiQ0J5WlhSMWNtNGdkR2hsSUhCeWIzQmxjblI1SUhaaGJIVmxJRzltSUhSb1pTQm5hWFpsYmlCbGJHVnRaVzUwTGx4dUlDQWdLbHh1SUNBZ0tpQkpaaUJoYmlCdlltcGxZM1FnYVhNZ2NHRnpjMlZrSUdadmNpQmdZMkZzYkdKaFkydGdMQ0IwYUdVZ1kzSmxZWFJsWkNCY0lsOHVkMmhsY21WY0lpQnpkSGxzWlNCallXeHNZbUZqYTF4dUlDQWdLaUIzYVd4c0lISmxkSFZ5YmlCZ2RISjFaV0FnWm05eUlHVnNaVzFsYm5SeklIUm9ZWFFnYUdGMlpTQjBhR1VnY0hKdmNHVjBhV1Z6SUc5bUlIUm9aU0JuYVhabGJpQnZZbXBsWTNRc1hHNGdJQ0FxSUdWc2MyVWdZR1poYkhObFlDNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dRMjlzYkdWamRHbHZibk5jYmlBZ0lDb2dRSEJoY21GdElIdEJjbkpoZVh4UFltcGxZM1I4VTNSeWFXNW5mU0JqYjJ4c1pXTjBhVzl1SUZSb1pTQmpiMnhzWldOMGFXOXVJSFJ2SUdsMFpYSmhkR1VnYjNabGNpNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym54UFltcGxZM1I4VTNSeWFXNW5mU0JiWTJGc2JHSmhZMnM5YVdSbGJuUnBkSGxkSUZSb1pTQm1kVzVqZEdsdmJpQmpZV3hzWldRZ2NHVnlYRzRnSUNBcUlDQnBkR1Z5WVhScGIyNHVJRWxtSUdFZ2NISnZjR1Z5ZEhrZ2JtRnRaU0J2Y2lCdlltcGxZM1FnYVhNZ2NHRnpjMlZrTENCcGRDQjNhV3hzSUdKbElIVnpaV1FnZEc4Z1kzSmxZWFJsWEc0Z0lDQXFJQ0JoSUZ3aVh5NXdiSFZqYTF3aUlHOXlJRndpWHk1M2FHVnlaVndpSUhOMGVXeGxJR05oYkd4aVlXTnJMQ0J5WlhOd1pXTjBhWFpsYkhrdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VFdsNFpXUjlJRnQwYUdselFYSm5YU0JVYUdVZ1lIUm9hWE5nSUdKcGJtUnBibWNnYjJZZ1lHTmhiR3hpWVdOcllDNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwMXBlR1ZrZlNCU1pYUjFjbTV6SUhSb1pTQnRZWGhwYlhWdElIWmhiSFZsTGx4dUlDQWdLaUJBWlhoaGJYQnNaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtMWhlQ2hiTkN3Z01pd2dPQ3dnTmwwcE8xeHVJQ0FnS2lBdkx5QTlQaUE0WEc0Z0lDQXFYRzRnSUNBcUlIWmhjaUJ6ZEc5dloyVnpJRDBnVzF4dUlDQWdLaUFnSUhzZ0oyNWhiV1VuT2lBbmJXOWxKeXdnSjJGblpTYzZJRFF3SUgwc1hHNGdJQ0FxSUNBZ2V5QW5ibUZ0WlNjNklDZHNZWEp5ZVNjc0lDZGhaMlVuT2lBMU1DQjlYRzRnSUNBcUlGMDdYRzRnSUNBcVhHNGdJQ0FxSUY4dWJXRjRLSE4wYjI5blpYTXNJR1oxYm1OMGFXOXVLSE4wYjI5blpTa2dleUJ5WlhSMWNtNGdjM1J2YjJkbExtRm5aVHNnZlNrN1hHNGdJQ0FxSUM4dklEMCtJSHNnSjI1aGJXVW5PaUFuYkdGeWNua25MQ0FuWVdkbEp6b2dOVEFnZlR0Y2JpQWdJQ3BjYmlBZ0lDb2dMeThnZFhOcGJtY2dYQ0pmTG5Cc2RXTnJYQ0lnWTJGc2JHSmhZMnNnYzJodmNuUm9ZVzVrWEc0Z0lDQXFJRjh1YldGNEtITjBiMjluWlhNc0lDZGhaMlVuS1R0Y2JpQWdJQ29nTHk4Z1BUNGdleUFuYm1GdFpTYzZJQ2RzWVhKeWVTY3NJQ2RoWjJVbk9pQTFNQ0I5TzF4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z2JXRjRLR052Ykd4bFkzUnBiMjRzSUdOaGJHeGlZV05yTENCMGFHbHpRWEpuS1NCN1hHNGdJQ0FnZG1GeUlHTnZiWEIxZEdWa0lEMGdMVWx1Wm1sdWFYUjVMRnh1SUNBZ0lDQWdJQ0J5WlhOMWJIUWdQU0JqYjIxd2RYUmxaRHRjYmx4dUlDQWdJR2xtSUNnaFkyRnNiR0poWTJzZ0ppWWdhWE5CY25KaGVTaGpiMnhzWldOMGFXOXVLU2tnZTF4dUlDQWdJQ0FnZG1GeUlHbHVaR1Y0SUQwZ0xURXNYRzRnSUNBZ0lDQWdJQ0FnYkdWdVozUm9JRDBnWTI5c2JHVmpkR2x2Ymk1c1pXNW5kR2c3WEc1Y2JpQWdJQ0FnSUhkb2FXeGxJQ2dySzJsdVpHVjRJRHdnYkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQjJZV3gxWlNBOUlHTnZiR3hsWTNScGIyNWJhVzVrWlhoZE8xeHVJQ0FnSUNBZ0lDQnBaaUFvZG1Gc2RXVWdQaUJ5WlhOMWJIUXBJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYTjFiSFFnUFNCMllXeDFaVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQmpZV3hzWW1GamF5QTlJQ0ZqWVd4c1ltRmpheUFtSmlCcGMxTjBjbWx1WnloamIyeHNaV04wYVc5dUtWeHVJQ0FnSUNBZ0lDQS9JR05vWVhKQmRFTmhiR3hpWVdOclhHNGdJQ0FnSUNBZ0lEb2dZM0psWVhSbFEyRnNiR0poWTJzb1kyRnNiR0poWTJzc0lIUm9hWE5CY21jcE8xeHVYRzRnSUNBZ0lDQmxZV05vS0dOdmJHeGxZM1JwYjI0c0lHWjFibU4wYVc5dUtIWmhiSFZsTENCcGJtUmxlQ3dnWTI5c2JHVmpkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnWTNWeWNtVnVkQ0E5SUdOaGJHeGlZV05yS0haaGJIVmxMQ0JwYm1SbGVDd2dZMjlzYkdWamRHbHZiaWs3WEc0Z0lDQWdJQ0FnSUdsbUlDaGpkWEp5Wlc1MElENGdZMjl0Y0hWMFpXUXBJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyMXdkWFJsWkNBOUlHTjFjbkpsYm5RN1hHNGdJQ0FnSUNBZ0lDQWdjbVZ6ZFd4MElEMGdkbUZzZFdVN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZKbGRISnBaWFpsY3lCMGFHVWdiV2x1YVcxMWJTQjJZV3gxWlNCdlppQmhiaUJnWVhKeVlYbGdMaUJKWmlCZ1kyRnNiR0poWTJ0Z0lHbHpJSEJoYzNObFpDeGNiaUFnSUNvZ2FYUWdkMmxzYkNCaVpTQmxlR1ZqZFhSbFpDQm1iM0lnWldGamFDQjJZV3gxWlNCcGJpQjBhR1VnWUdGeWNtRjVZQ0IwYnlCblpXNWxjbUYwWlNCMGFHVmNiaUFnSUNvZ1kzSnBkR1Z5YVc5dUlHSjVJSGRvYVdOb0lIUm9aU0IyWVd4MVpTQnBjeUJ5WVc1clpXUXVJRlJvWlNCZ1kyRnNiR0poWTJ0Z0lHbHpJR0p2ZFc1a0lIUnZJR0IwYUdselFYSm5ZRnh1SUNBZ0tpQmhibVFnYVc1MmIydGxaQ0IzYVhSb0lIUm9jbVZsSUdGeVozVnRaVzUwY3pzZ0tIWmhiSFZsTENCcGJtUmxlQ3dnWTI5c2JHVmpkR2x2YmlrdVhHNGdJQ0FxWEc0Z0lDQXFJRWxtSUdFZ2NISnZjR1Z5ZEhrZ2JtRnRaU0JwY3lCd1lYTnpaV1FnWm05eUlHQmpZV3hzWW1GamEyQXNJSFJvWlNCamNtVmhkR1ZrSUZ3aVh5NXdiSFZqYTF3aUlITjBlV3hsWEc0Z0lDQXFJR05oYkd4aVlXTnJJSGRwYkd3Z2NtVjBkWEp1SUhSb1pTQndjbTl3WlhKMGVTQjJZV3gxWlNCdlppQjBhR1VnWjJsMlpXNGdaV3hsYldWdWRDNWNiaUFnSUNwY2JpQWdJQ29nU1dZZ1lXNGdiMkpxWldOMElHbHpJSEJoYzNObFpDQm1iM0lnWUdOaGJHeGlZV05yWUN3Z2RHaGxJR055WldGMFpXUWdYQ0pmTG5kb1pYSmxYQ0lnYzNSNWJHVWdZMkZzYkdKaFkydGNiaUFnSUNvZ2QybHNiQ0J5WlhSMWNtNGdZSFJ5ZFdWZ0lHWnZjaUJsYkdWdFpXNTBjeUIwYUdGMElHaGhkbVVnZEdobElIQnliM0JsZEdsbGN5QnZaaUIwYUdVZ1oybDJaVzRnYjJKcVpXTjBMRnh1SUNBZ0tpQmxiSE5sSUdCbVlXeHpaV0F1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUVOdmJHeGxZM1JwYjI1elhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhKeVlYbDhUMkpxWldOMGZGTjBjbWx1WjMwZ1kyOXNiR1ZqZEdsdmJpQlVhR1VnWTI5c2JHVmpkR2x2YmlCMGJ5QnBkR1Z5WVhSbElHOTJaWEl1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdSblZ1WTNScGIyNThUMkpxWldOMGZGTjBjbWx1WjMwZ1cyTmhiR3hpWVdOclBXbGtaVzUwYVhSNVhTQlVhR1VnWm5WdVkzUnBiMjRnWTJGc2JHVmtJSEJsY2x4dUlDQWdLaUFnYVhSbGNtRjBhVzl1TGlCSlppQmhJSEJ5YjNCbGNuUjVJRzVoYldVZ2IzSWdiMkpxWldOMElHbHpJSEJoYzNObFpDd2dhWFFnZDJsc2JDQmlaU0IxYzJWa0lIUnZJR055WldGMFpWeHVJQ0FnS2lBZ1lTQmNJbDh1Y0d4MVkydGNJaUJ2Y2lCY0lsOHVkMmhsY21WY0lpQnpkSGxzWlNCallXeHNZbUZqYXl3Z2NtVnpjR1ZqZEdsMlpXeDVMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwMXBlR1ZrZlNCYmRHaHBjMEZ5WjEwZ1ZHaGxJR0IwYUdsellDQmlhVzVrYVc1bklHOW1JR0JqWVd4c1ltRmphMkF1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHROYVhobFpIMGdVbVYwZFhKdWN5QjBhR1VnYldsdWFXMTFiU0IyWVd4MVpTNWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dYeTV0YVc0b1d6UXNJRElzSURnc0lEWmRLVHRjYmlBZ0lDb2dMeThnUFQ0Z01seHVJQ0FnS2x4dUlDQWdLaUIyWVhJZ2MzUnZiMmRsY3lBOUlGdGNiaUFnSUNvZ0lDQjdJQ2R1WVcxbEp6b2dKMjF2WlNjc0lDZGhaMlVuT2lBME1DQjlMRnh1SUNBZ0tpQWdJSHNnSjI1aGJXVW5PaUFuYkdGeWNua25MQ0FuWVdkbEp6b2dOVEFnZlZ4dUlDQWdLaUJkTzF4dUlDQWdLbHh1SUNBZ0tpQmZMbTFwYmloemRHOXZaMlZ6TENCbWRXNWpkR2x2YmloemRHOXZaMlVwSUhzZ2NtVjBkWEp1SUhOMGIyOW5aUzVoWjJVN0lIMHBPMXh1SUNBZ0tpQXZMeUE5UGlCN0lDZHVZVzFsSnpvZ0oyMXZaU2NzSUNkaFoyVW5PaUEwTUNCOU8xeHVJQ0FnS2x4dUlDQWdLaUF2THlCMWMybHVaeUJjSWw4dWNHeDFZMnRjSWlCallXeHNZbUZqYXlCemFHOXlkR2hoYm1SY2JpQWdJQ29nWHk1dGFXNG9jM1J2YjJkbGN5d2dKMkZuWlNjcE8xeHVJQ0FnS2lBdkx5QTlQaUI3SUNkdVlXMWxKem9nSjIxdlpTY3NJQ2RoWjJVbk9pQTBNQ0I5TzF4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z2JXbHVLR052Ykd4bFkzUnBiMjRzSUdOaGJHeGlZV05yTENCMGFHbHpRWEpuS1NCN1hHNGdJQ0FnZG1GeUlHTnZiWEIxZEdWa0lEMGdTVzVtYVc1cGRIa3NYRzRnSUNBZ0lDQWdJSEpsYzNWc2RDQTlJR052YlhCMWRHVmtPMXh1WEc0Z0lDQWdhV1lnS0NGallXeHNZbUZqYXlBbUppQnBjMEZ5Y21GNUtHTnZiR3hsWTNScGIyNHBLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2FXNWtaWGdnUFNBdE1TeGNiaUFnSUNBZ0lDQWdJQ0JzWlc1bmRHZ2dQU0JqYjJ4c1pXTjBhVzl1TG14bGJtZDBhRHRjYmx4dUlDQWdJQ0FnZDJocGJHVWdLQ3NyYVc1a1pYZ2dQQ0JzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlIWmhiSFZsSUQwZ1kyOXNiR1ZqZEdsdmJsdHBibVJsZUYwN1hHNGdJQ0FnSUNBZ0lHbG1JQ2gyWVd4MVpTQThJSEpsYzNWc2RDa2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGMzVnNkQ0E5SUhaaGJIVmxPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHTmhiR3hpWVdOcklEMGdJV05oYkd4aVlXTnJJQ1ltSUdselUzUnlhVzVuS0dOdmJHeGxZM1JwYjI0cFhHNGdJQ0FnSUNBZ0lEOGdZMmhoY2tGMFEyRnNiR0poWTJ0Y2JpQWdJQ0FnSUNBZ09pQmpjbVZoZEdWRFlXeHNZbUZqYXloallXeHNZbUZqYXl3Z2RHaHBjMEZ5WnlrN1hHNWNiaUFnSUNBZ0lHVmhZMmdvWTI5c2JHVmpkR2x2Yml3Z1puVnVZM1JwYjI0b2RtRnNkV1VzSUdsdVpHVjRMQ0JqYjJ4c1pXTjBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJqZFhKeVpXNTBJRDBnWTJGc2JHSmhZMnNvZG1Gc2RXVXNJR2x1WkdWNExDQmpiMnhzWldOMGFXOXVLVHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHTjFjbkpsYm5RZ1BDQmpiMjF3ZFhSbFpDa2dlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJYQjFkR1ZrSUQwZ1kzVnljbVZ1ZER0Y2JpQWdJQ0FnSUNBZ0lDQnlaWE4xYkhRZ1BTQjJZV3gxWlR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVW1WMGNtbGxkbVZ6SUhSb1pTQjJZV3gxWlNCdlppQmhJSE53WldOcFptbGxaQ0J3Y205d1pYSjBlU0JtY205dElHRnNiQ0JsYkdWdFpXNTBjeUJwYmlCMGFHVWdZR052Ykd4bFkzUnBiMjVnTGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCMGVYQmxJRVoxYm1OMGFXOXVYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQkRiMnhzWldOMGFXOXVjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwRnljbUY1ZkU5aWFtVmpkSHhUZEhKcGJtZDlJR052Ykd4bFkzUnBiMjRnVkdobElHTnZiR3hsWTNScGIyNGdkRzhnYVhSbGNtRjBaU0J2ZG1WeUxseHVJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnY0hKdmNHVnlkSGtnVkdobElIQnliM0JsY25SNUlIUnZJSEJzZFdOckxseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1FYSnlZWGw5SUZKbGRIVnlibk1nWVNCdVpYY2dZWEp5WVhrZ2IyWWdjSEp2Y0dWeWRIa2dkbUZzZFdWekxseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQjJZWElnYzNSdmIyZGxjeUE5SUZ0Y2JpQWdJQ29nSUNCN0lDZHVZVzFsSnpvZ0oyMXZaU2NzSUNkaFoyVW5PaUEwTUNCOUxGeHVJQ0FnS2lBZ0lIc2dKMjVoYldVbk9pQW5iR0Z5Y25rbkxDQW5ZV2RsSnpvZ05UQWdmVnh1SUNBZ0tpQmRPMXh1SUNBZ0tseHVJQ0FnS2lCZkxuQnNkV05yS0hOMGIyOW5aWE1zSUNkdVlXMWxKeWs3WEc0Z0lDQXFJQzh2SUQwK0lGc25iVzlsSnl3Z0oyeGhjbko1SjExY2JpQWdJQ292WEc0Z0lIWmhjaUJ3YkhWamF5QTlJRzFoY0R0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nVW1Wa2RXTmxjeUJoSUdCamIyeHNaV04wYVc5dVlDQjBieUJoSUhaaGJIVmxJSFJvWVhRZ2FYTWdkR2hsSUdGalkzVnRkV3hoZEdWa0lISmxjM1ZzZENCdlppQnlkVzV1YVc1blhHNGdJQ0FxSUdWaFkyZ2daV3hsYldWdWRDQnBiaUIwYUdVZ1lHTnZiR3hsWTNScGIyNWdJSFJvY205MVoyZ2dkR2hsSUdCallXeHNZbUZqYTJBc0lIZG9aWEpsSUdWaFkyZ2djM1ZqWTJWemMybDJaVnh1SUNBZ0tpQmdZMkZzYkdKaFkydGdJR1Y0WldOMWRHbHZiaUJqYjI1emRXMWxjeUIwYUdVZ2NtVjBkWEp1SUhaaGJIVmxJRzltSUhSb1pTQndjbVYyYVc5MWN5QmxlR1ZqZFhScGIyNHVYRzRnSUNBcUlFbG1JR0JoWTJOMWJYVnNZWFJ2Y21BZ2FYTWdibTkwSUhCaGMzTmxaQ3dnZEdobElHWnBjbk4wSUdWc1pXMWxiblFnYjJZZ2RHaGxJR0JqYjJ4c1pXTjBhVzl1WUNCM2FXeHNJR0psWEc0Z0lDQXFJSFZ6WldRZ1lYTWdkR2hsSUdsdWFYUnBZV3dnWUdGalkzVnRkV3hoZEc5eVlDQjJZV3gxWlM0Z1ZHaGxJR0JqWVd4c1ltRmphMkFnYVhNZ1ltOTFibVFnZEc4Z1lIUm9hWE5CY21kZ1hHNGdJQ0FxSUdGdVpDQnBiblp2YTJWa0lIZHBkR2dnWm05MWNpQmhjbWQxYldWdWRITTdJQ2hoWTJOMWJYVnNZWFJ2Y2l3Z2RtRnNkV1VzSUdsdVpHVjRmR3RsZVN3Z1kyOXNiR1ZqZEdsdmJpa3VYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRR0ZzYVdGeklHWnZiR1JzTENCcGJtcGxZM1JjYmlBZ0lDb2dRR05oZEdWbmIzSjVJRU52Ykd4bFkzUnBiMjV6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdRWEp5WVhsOFQySnFaV04wZkZOMGNtbHVaMzBnWTI5c2JHVmpkR2x2YmlCVWFHVWdZMjlzYkdWamRHbHZiaUIwYnlCcGRHVnlZWFJsSUc5MlpYSXVYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlGdGpZV3hzWW1GamF6MXBaR1Z1ZEdsMGVWMGdWR2hsSUdaMWJtTjBhVzl1SUdOaGJHeGxaQ0J3WlhJZ2FYUmxjbUYwYVc5dUxseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0JiWVdOamRXMTFiR0YwYjNKZElFbHVhWFJwWVd3Z2RtRnNkV1VnYjJZZ2RHaGxJR0ZqWTNWdGRXeGhkRzl5TGx4dUlDQWdLaUJBY0dGeVlXMGdlMDFwZUdWa2ZTQmJkR2hwYzBGeVoxMGdWR2hsSUdCMGFHbHpZQ0JpYVc1a2FXNW5JRzltSUdCallXeHNZbUZqYTJBdVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0TmFYaGxaSDBnVW1WMGRYSnVjeUIwYUdVZ1lXTmpkVzExYkdGMFpXUWdkbUZzZFdVdVhHNGdJQ0FxSUVCbGVHRnRjR3hsWEc0Z0lDQXFYRzRnSUNBcUlIWmhjaUJ6ZFcwZ1BTQmZMbkpsWkhWalpTaGJNU3dnTWl3Z00xMHNJR1oxYm1OMGFXOXVLSE4xYlN3Z2JuVnRLU0I3WEc0Z0lDQXFJQ0FnY21WMGRYSnVJSE4xYlNBcklHNTFiVHRjYmlBZ0lDb2dmU2s3WEc0Z0lDQXFJQzh2SUQwK0lEWmNiaUFnSUNwY2JpQWdJQ29nZG1GeUlHMWhjSEJsWkNBOUlGOHVjbVZrZFdObEtIc2dKMkVuT2lBeExDQW5ZaWM2SURJc0lDZGpKem9nTXlCOUxDQm1kVzVqZEdsdmJpaHlaWE4xYkhRc0lHNTFiU3dnYTJWNUtTQjdYRzRnSUNBcUlDQWdjbVZ6ZFd4MFcydGxlVjBnUFNCdWRXMGdLaUF6TzF4dUlDQWdLaUFnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUNBcUlIMHNJSHQ5S1R0Y2JpQWdJQ29nTHk4Z1BUNGdleUFuWVNjNklETXNJQ2RpSnpvZ05pd2dKMk1uT2lBNUlIMWNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJSEpsWkhWalpTaGpiMnhzWldOMGFXOXVMQ0JqWVd4c1ltRmpheXdnWVdOamRXMTFiR0YwYjNJc0lIUm9hWE5CY21jcElIdGNiaUFnSUNCMllYSWdibTloWTJOMWJTQTlJR0Z5WjNWdFpXNTBjeTVzWlc1bmRHZ2dQQ0F6TzF4dUlDQWdJR05oYkd4aVlXTnJJRDBnWTNKbFlYUmxRMkZzYkdKaFkyc29ZMkZzYkdKaFkyc3NJSFJvYVhOQmNtY3NJRFFwTzF4dVhHNGdJQ0FnYVdZZ0tHbHpRWEp5WVhrb1kyOXNiR1ZqZEdsdmJpa3BJSHRjYmlBZ0lDQWdJSFpoY2lCcGJtUmxlQ0E5SUMweExGeHVJQ0FnSUNBZ0lDQWdJR3hsYm1kMGFDQTlJR052Ykd4bFkzUnBiMjR1YkdWdVozUm9PMXh1WEc0Z0lDQWdJQ0JwWmlBb2JtOWhZMk4xYlNrZ2UxeHVJQ0FnSUNBZ0lDQmhZMk4xYlhWc1lYUnZjaUE5SUdOdmJHeGxZM1JwYjI1Ykt5dHBibVJsZUYwN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCM2FHbHNaU0FvS3l0cGJtUmxlQ0E4SUd4bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnSUNCaFkyTjFiWFZzWVhSdmNpQTlJR05oYkd4aVlXTnJLR0ZqWTNWdGRXeGhkRzl5TENCamIyeHNaV04wYVc5dVcybHVaR1Y0WFN3Z2FXNWtaWGdzSUdOdmJHeGxZM1JwYjI0cE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0JsWVdOb0tHTnZiR3hsWTNScGIyNHNJR1oxYm1OMGFXOXVLSFpoYkhWbExDQnBibVJsZUN3Z1kyOXNiR1ZqZEdsdmJpa2dlMXh1SUNBZ0lDQWdJQ0JoWTJOMWJYVnNZWFJ2Y2lBOUlHNXZZV05qZFcxY2JpQWdJQ0FnSUNBZ0lDQS9JQ2h1YjJGalkzVnRJRDBnWm1Gc2MyVXNJSFpoYkhWbEtWeHVJQ0FnSUNBZ0lDQWdJRG9nWTJGc2JHSmhZMnNvWVdOamRXMTFiR0YwYjNJc0lIWmhiSFZsTENCcGJtUmxlQ3dnWTI5c2JHVmpkR2x2YmlsY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdZV05qZFcxMWJHRjBiM0k3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1ZHaHBjeUJ0WlhSb2IyUWdhWE1nYzJsdGFXeGhjaUIwYnlCZ1h5NXlaV1IxWTJWZ0xDQmxlR05sY0hRZ2RHaGhkQ0JwZENCcGRHVnlZWFJsY3lCdmRtVnlJR0ZjYmlBZ0lDb2dZR052Ykd4bFkzUnBiMjVnSUdaeWIyMGdjbWxuYUhRZ2RHOGdiR1ZtZEM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVlXeHBZWE1nWm05c1pISmNiaUFnSUNvZ1FHTmhkR1ZuYjNKNUlFTnZiR3hsWTNScGIyNXpYRzRnSUNBcUlFQndZWEpoYlNCN1FYSnlZWGw4VDJKcVpXTjBmRk4wY21sdVozMGdZMjlzYkdWamRHbHZiaUJVYUdVZ1kyOXNiR1ZqZEdsdmJpQjBieUJwZEdWeVlYUmxJRzkyWlhJdVhHNGdJQ0FxSUVCd1lYSmhiU0I3Um5WdVkzUnBiMjU5SUZ0allXeHNZbUZqYXoxcFpHVnVkR2wwZVYwZ1ZHaGxJR1oxYm1OMGFXOXVJR05oYkd4bFpDQndaWElnYVhSbGNtRjBhVzl1TGx4dUlDQWdLaUJBY0dGeVlXMGdlMDFwZUdWa2ZTQmJZV05qZFcxMWJHRjBiM0pkSUVsdWFYUnBZV3dnZG1Gc2RXVWdiMllnZEdobElHRmpZM1Z0ZFd4aGRHOXlMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwMXBlR1ZrZlNCYmRHaHBjMEZ5WjEwZ1ZHaGxJR0IwYUdsellDQmlhVzVrYVc1bklHOW1JR0JqWVd4c1ltRmphMkF1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHROYVhobFpIMGdVbVYwZFhKdWN5QjBhR1VnWVdOamRXMTFiR0YwWldRZ2RtRnNkV1V1WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUhaaGNpQnNhWE4wSUQwZ1cxc3dMQ0F4WFN3Z1d6SXNJRE5kTENCYk5Dd2dOVjFkTzF4dUlDQWdLaUIyWVhJZ1pteGhkQ0E5SUY4dWNtVmtkV05sVW1sbmFIUW9iR2x6ZEN3Z1puVnVZM1JwYjI0b1lTd2dZaWtnZXlCeVpYUjFjbTRnWVM1amIyNWpZWFFvWWlrN0lIMHNJRnRkS1R0Y2JpQWdJQ29nTHk4Z1BUNGdXelFzSURVc0lESXNJRE1zSURBc0lERmRYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJ5WldSMVkyVlNhV2RvZENoamIyeHNaV04wYVc5dUxDQmpZV3hzWW1GamF5d2dZV05qZFcxMWJHRjBiM0lzSUhSb2FYTkJjbWNwSUh0Y2JpQWdJQ0IyWVhJZ2FYUmxjbUZpYkdVZ1BTQmpiMnhzWldOMGFXOXVMRnh1SUNBZ0lDQWdJQ0JzWlc1bmRHZ2dQU0JqYjJ4c1pXTjBhVzl1SUQ4Z1kyOXNiR1ZqZEdsdmJpNXNaVzVuZEdnZ09pQXdMRnh1SUNBZ0lDQWdJQ0J1YjJGalkzVnRJRDBnWVhKbmRXMWxiblJ6TG14bGJtZDBhQ0E4SURNN1hHNWNiaUFnSUNCcFppQW9kSGx3Wlc5bUlHeGxibWQwYUNBaFBTQW5iblZ0WW1WeUp5a2dlMXh1SUNBZ0lDQWdkbUZ5SUhCeWIzQnpJRDBnYTJWNWN5aGpiMnhzWldOMGFXOXVLVHRjYmlBZ0lDQWdJR3hsYm1kMGFDQTlJSEJ5YjNCekxteGxibWQwYUR0Y2JpQWdJQ0I5WEc0Z0lDQWdZMkZzYkdKaFkyc2dQU0JqY21WaGRHVkRZV3hzWW1GamF5aGpZV3hzWW1GamF5d2dkR2hwYzBGeVp5d2dOQ2s3WEc0Z0lDQWdabTl5UldGamFDaGpiMnhzWldOMGFXOXVMQ0JtZFc1amRHbHZiaWgyWVd4MVpTd2dhVzVrWlhnc0lHTnZiR3hsWTNScGIyNHBJSHRjYmlBZ0lDQWdJR2x1WkdWNElEMGdjSEp2Y0hNZ1B5QndjbTl3YzFzdExXeGxibWQwYUYwZ09pQXRMV3hsYm1kMGFEdGNiaUFnSUNBZ0lHRmpZM1Z0ZFd4aGRHOXlJRDBnYm05aFkyTjFiVnh1SUNBZ0lDQWdJQ0EvSUNodWIyRmpZM1Z0SUQwZ1ptRnNjMlVzSUdsMFpYSmhZbXhsVzJsdVpHVjRYU2xjYmlBZ0lDQWdJQ0FnT2lCallXeHNZbUZqYXloaFkyTjFiWFZzWVhSdmNpd2dhWFJsY21GaWJHVmJhVzVrWlhoZExDQnBibVJsZUN3Z1kyOXNiR1ZqZEdsdmJpazdYRzRnSUNBZ2ZTazdYRzRnSUNBZ2NtVjBkWEp1SUdGalkzVnRkV3hoZEc5eU8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRlJvWlNCdmNIQnZjMmwwWlNCdlppQmdYeTVtYVd4MFpYSmdMQ0IwYUdseklHMWxkR2h2WkNCeVpYUjFjbTV6SUhSb1pTQmxiR1Z0Wlc1MGN5QnZaaUJoWEc0Z0lDQXFJR0JqYjJ4c1pXTjBhVzl1WUNCMGFHRjBJR0JqWVd4c1ltRmphMkFnWkc5bGN5QXFLbTV2ZENvcUlISmxkSFZ5YmlCMGNuVjBhSGtnWm05eUxseHVJQ0FnS2x4dUlDQWdLaUJKWmlCaElIQnliM0JsY25SNUlHNWhiV1VnYVhNZ2NHRnpjMlZrSUdadmNpQmdZMkZzYkdKaFkydGdMQ0IwYUdVZ1kzSmxZWFJsWkNCY0lsOHVjR3gxWTJ0Y0lpQnpkSGxzWlZ4dUlDQWdLaUJqWVd4c1ltRmpheUIzYVd4c0lISmxkSFZ5YmlCMGFHVWdjSEp2Y0dWeWRIa2dkbUZzZFdVZ2IyWWdkR2hsSUdkcGRtVnVJR1ZzWlcxbGJuUXVYRzRnSUNBcVhHNGdJQ0FxSUVsbUlHRnVJRzlpYW1WamRDQnBjeUJ3WVhOelpXUWdabTl5SUdCallXeHNZbUZqYTJBc0lIUm9aU0JqY21WaGRHVmtJRndpWHk1M2FHVnlaVndpSUhOMGVXeGxJR05oYkd4aVlXTnJYRzRnSUNBcUlIZHBiR3dnY21WMGRYSnVJR0IwY25WbFlDQm1iM0lnWld4bGJXVnVkSE1nZEdoaGRDQm9ZWFpsSUhSb1pTQndjbTl3WlhScFpYTWdiMllnZEdobElHZHBkbVZ1SUc5aWFtVmpkQ3hjYmlBZ0lDb2daV3h6WlNCZ1ptRnNjMlZnTGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCRGIyeHNaV04wYVc5dWMxeHVJQ0FnS2lCQWNHRnlZVzBnZTBGeWNtRjVmRTlpYW1WamRIeFRkSEpwYm1kOUlHTnZiR3hsWTNScGIyNGdWR2hsSUdOdmJHeGxZM1JwYjI0Z2RHOGdhWFJsY21GMFpTQnZkbVZ5TGx4dUlDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmRTlpYW1WamRIeFRkSEpwYm1kOUlGdGpZV3hzWW1GamF6MXBaR1Z1ZEdsMGVWMGdWR2hsSUdaMWJtTjBhVzl1SUdOaGJHeGxaQ0J3WlhKY2JpQWdJQ29nSUdsMFpYSmhkR2x2Ymk0Z1NXWWdZU0J3Y205d1pYSjBlU0J1WVcxbElHOXlJRzlpYW1WamRDQnBjeUJ3WVhOelpXUXNJR2wwSUhkcGJHd2dZbVVnZFhObFpDQjBieUJqY21WaGRHVmNiaUFnSUNvZ0lHRWdYQ0pmTG5Cc2RXTnJYQ0lnYjNJZ1hDSmZMbmRvWlhKbFhDSWdjM1I1YkdVZ1kyRnNiR0poWTJzc0lISmxjM0JsWTNScGRtVnNlUzVjYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ1czUm9hWE5CY21kZElGUm9aU0JnZEdocGMyQWdZbWx1WkdsdVp5QnZaaUJnWTJGc2JHSmhZMnRnTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UVhKeVlYbDlJRkpsZEhWeWJuTWdZU0J1WlhjZ1lYSnlZWGtnYjJZZ1pXeGxiV1Z1ZEhNZ2RHaGhkQ0JrYVdRZ0tpcHViM1FxS2lCd1lYTnpJSFJvWlZ4dUlDQWdLaUFnWTJGc2JHSmhZMnNnWTJobFkyc3VYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCdlpHUnpJRDBnWHk1eVpXcGxZM1FvV3pFc0lESXNJRE1zSURRc0lEVXNJRFpkTENCbWRXNWpkR2x2YmlodWRXMHBJSHNnY21WMGRYSnVJRzUxYlNBbElESWdQVDBnTURzZ2ZTazdYRzRnSUNBcUlDOHZJRDArSUZzeExDQXpMQ0ExWFZ4dUlDQWdLbHh1SUNBZ0tpQjJZWElnWm05dlpDQTlJRnRjYmlBZ0lDb2dJQ0I3SUNkdVlXMWxKem9nSjJGd2NHeGxKeXdnSUNkdmNtZGhibWxqSnpvZ1ptRnNjMlVzSUNkMGVYQmxKem9nSjJaeWRXbDBKeUI5TEZ4dUlDQWdLaUFnSUhzZ0oyNWhiV1VuT2lBblkyRnljbTkwSnl3Z0oyOXlaMkZ1YVdNbk9pQjBjblZsTENBZ0ozUjVjR1VuT2lBbmRtVm5aWFJoWW14bEp5QjlYRzRnSUNBcUlGMDdYRzRnSUNBcVhHNGdJQ0FxSUM4dklIVnphVzVuSUZ3aVh5NXdiSFZqYTF3aUlHTmhiR3hpWVdOcklITm9iM0owYUdGdVpGeHVJQ0FnS2lCZkxuSmxhbVZqZENobWIyOWtMQ0FuYjNKbllXNXBZeWNwTzF4dUlDQWdLaUF2THlBOVBpQmJleUFuYm1GdFpTYzZJQ2RoY0hCc1pTY3NJQ2R2Y21kaGJtbGpKem9nWm1Gc2MyVXNJQ2QwZVhCbEp6b2dKMlp5ZFdsMEp5QjlYVnh1SUNBZ0tseHVJQ0FnS2lBdkx5QjFjMmx1WnlCY0lsOHVkMmhsY21WY0lpQmpZV3hzWW1GamF5QnphRzl5ZEdoaGJtUmNiaUFnSUNvZ1h5NXlaV3BsWTNRb1ptOXZaQ3dnZXlBbmRIbHdaU2M2SUNkbWNuVnBkQ2NnZlNrN1hHNGdJQ0FxSUM4dklEMCtJRnQ3SUNkdVlXMWxKem9nSjJOaGNuSnZkQ2NzSUNkdmNtZGhibWxqSnpvZ2RISjFaU3dnSjNSNWNHVW5PaUFuZG1WblpYUmhZbXhsSnlCOVhWeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdjbVZxWldOMEtHTnZiR3hsWTNScGIyNHNJR05oYkd4aVlXTnJMQ0IwYUdselFYSm5LU0I3WEc0Z0lDQWdZMkZzYkdKaFkyc2dQU0JqY21WaGRHVkRZV3hzWW1GamF5aGpZV3hzWW1GamF5d2dkR2hwYzBGeVp5azdYRzRnSUNBZ2NtVjBkWEp1SUdacGJIUmxjaWhqYjJ4c1pXTjBhVzl1TENCbWRXNWpkR2x2YmloMllXeDFaU3dnYVc1a1pYZ3NJR052Ykd4bFkzUnBiMjRwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUFoWTJGc2JHSmhZMnNvZG1Gc2RXVXNJR2x1WkdWNExDQmpiMnhzWldOMGFXOXVLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCRGNtVmhkR1Z6SUdGdUlHRnljbUY1SUc5bUlITm9kV1ptYkdWa0lHQmhjbkpoZVdBZ2RtRnNkV1Z6TENCMWMybHVaeUJoSUhabGNuTnBiMjRnYjJZZ2RHaGxYRzRnSUNBcUlFWnBjMmhsY2kxWllYUmxjeUJ6YUhWbVpteGxMaUJUWldVZ2FIUjBjRG92TDJWdUxuZHBhMmx3WldScFlTNXZjbWN2ZDJscmFTOUdhWE5vWlhJdFdXRjBaWE5mYzJoMVptWnNaUzVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnUTI5c2JHVmpkR2x2Ym5OY2JpQWdJQ29nUUhCaGNtRnRJSHRCY25KaGVYeFBZbXBsWTNSOFUzUnlhVzVuZlNCamIyeHNaV04wYVc5dUlGUm9aU0JqYjJ4c1pXTjBhVzl1SUhSdklITm9kV1ptYkdVdVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0QmNuSmhlWDBnVW1WMGRYSnVjeUJoSUc1bGR5QnphSFZtWm14bFpDQmpiMnhzWldOMGFXOXVMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUJmTG5Ob2RXWm1iR1VvV3pFc0lESXNJRE1zSURRc0lEVXNJRFpkS1R0Y2JpQWdJQ29nTHk4Z1BUNGdXelFzSURFc0lEWXNJRE1zSURVc0lESmRYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJ6YUhWbVpteGxLR052Ykd4bFkzUnBiMjRwSUh0Y2JpQWdJQ0IyWVhJZ2FXNWtaWGdnUFNBdE1TeGNiaUFnSUNBZ0lDQWdiR1Z1WjNSb0lEMGdZMjlzYkdWamRHbHZiaUEvSUdOdmJHeGxZM1JwYjI0dWJHVnVaM1JvSURvZ01DeGNiaUFnSUNBZ0lDQWdjbVZ6ZFd4MElEMGdRWEp5WVhrb2RIbHdaVzltSUd4bGJtZDBhQ0E5UFNBbmJuVnRZbVZ5SnlBL0lHeGxibWQwYUNBNklEQXBPMXh1WEc0Z0lDQWdabTl5UldGamFDaGpiMnhzWldOMGFXOXVMQ0JtZFc1amRHbHZiaWgyWVd4MVpTa2dlMXh1SUNBZ0lDQWdkbUZ5SUhKaGJtUWdQU0JtYkc5dmNpaHVZWFJwZG1WU1lXNWtiMjBvS1NBcUlDZ3JLMmx1WkdWNElDc2dNU2twTzF4dUlDQWdJQ0FnY21WemRXeDBXMmx1WkdWNFhTQTlJSEpsYzNWc2RGdHlZVzVrWFR0Y2JpQWdJQ0FnSUhKbGMzVnNkRnR5WVc1a1hTQTlJSFpoYkhWbE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUjJWMGN5QjBhR1VnYzJsNlpTQnZaaUIwYUdVZ1lHTnZiR3hsWTNScGIyNWdJR0o1SUhKbGRIVnlibWx1WnlCZ1kyOXNiR1ZqZEdsdmJpNXNaVzVuZEdoZ0lHWnZjaUJoY25KaGVYTmNiaUFnSUNvZ1lXNWtJR0Z5Y21GNUxXeHBhMlVnYjJKcVpXTjBjeUJ2Y2lCMGFHVWdiblZ0WW1WeUlHOW1JRzkzYmlCbGJuVnRaWEpoWW14bElIQnliM0JsY25ScFpYTWdabTl5SUc5aWFtVmpkSE11WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUVOdmJHeGxZM1JwYjI1elhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhKeVlYbDhUMkpxWldOMGZGTjBjbWx1WjMwZ1kyOXNiR1ZqZEdsdmJpQlVhR1VnWTI5c2JHVmpkR2x2YmlCMGJ5QnBibk53WldOMExseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1RuVnRZbVZ5ZlNCU1pYUjFjbTV6SUdCamIyeHNaV04wYVc5dUxteGxibWQwYUdBZ2IzSWdiblZ0WW1WeUlHOW1JRzkzYmlCbGJuVnRaWEpoWW14bElIQnliM0JsY25ScFpYTXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJRjh1YzJsNlpTaGJNU3dnTWwwcE8xeHVJQ0FnS2lBdkx5QTlQaUF5WEc0Z0lDQXFYRzRnSUNBcUlGOHVjMmw2WlNoN0lDZHZibVVuT2lBeExDQW5kSGR2SnpvZ01pd2dKM1JvY21WbEp6b2dNeUI5S1R0Y2JpQWdJQ29nTHk4Z1BUNGdNMXh1SUNBZ0tseHVJQ0FnS2lCZkxuTnBlbVVvSjJOMWNteDVKeWs3WEc0Z0lDQXFJQzh2SUQwK0lEVmNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJSE5wZW1Vb1kyOXNiR1ZqZEdsdmJpa2dlMXh1SUNBZ0lIWmhjaUJzWlc1bmRHZ2dQU0JqYjJ4c1pXTjBhVzl1SUQ4Z1kyOXNiR1ZqZEdsdmJpNXNaVzVuZEdnZ09pQXdPMXh1SUNBZ0lISmxkSFZ5YmlCMGVYQmxiMllnYkdWdVozUm9JRDA5SUNkdWRXMWlaWEluSUQ4Z2JHVnVaM1JvSURvZ2EyVjVjeWhqYjJ4c1pXTjBhVzl1S1M1c1pXNW5kR2c3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1EyaGxZMnR6SUdsbUlIUm9aU0JnWTJGc2JHSmhZMnRnSUhKbGRIVnlibk1nWVNCMGNuVjBhSGtnZG1Gc2RXVWdabTl5SUNvcVlXNTVLaW9nWld4bGJXVnVkQ0J2WmlCaFhHNGdJQ0FxSUdCamIyeHNaV04wYVc5dVlDNGdWR2hsSUdaMWJtTjBhVzl1SUhKbGRIVnlibk1nWVhNZ2MyOXZiaUJoY3lCcGRDQm1hVzVrY3lCd1lYTnphVzVuSUhaaGJIVmxMQ0JoYm1SY2JpQWdJQ29nWkc5bGN5QnViM1FnYVhSbGNtRjBaU0J2ZG1WeUlIUm9aU0JsYm5ScGNtVWdZR052Ykd4bFkzUnBiMjVnTGlCVWFHVWdZR05oYkd4aVlXTnJZQ0JwY3lCaWIzVnVaQ0IwYjF4dUlDQWdLaUJnZEdocGMwRnlaMkFnWVc1a0lHbHVkbTlyWldRZ2QybDBhQ0IwYUhKbFpTQmhjbWQxYldWdWRITTdJQ2gyWVd4MVpTd2dhVzVrWlhoOGEyVjVMQ0JqYjJ4c1pXTjBhVzl1S1M1Y2JpQWdJQ3BjYmlBZ0lDb2dTV1lnWVNCd2NtOXdaWEowZVNCdVlXMWxJR2x6SUhCaGMzTmxaQ0JtYjNJZ1lHTmhiR3hpWVdOcllDd2dkR2hsSUdOeVpXRjBaV1FnWENKZkxuQnNkV05yWENJZ2MzUjViR1ZjYmlBZ0lDb2dZMkZzYkdKaFkyc2dkMmxzYkNCeVpYUjFjbTRnZEdobElIQnliM0JsY25SNUlIWmhiSFZsSUc5bUlIUm9aU0JuYVhabGJpQmxiR1Z0Wlc1MExseHVJQ0FnS2x4dUlDQWdLaUJKWmlCaGJpQnZZbXBsWTNRZ2FYTWdjR0Z6YzJWa0lHWnZjaUJnWTJGc2JHSmhZMnRnTENCMGFHVWdZM0psWVhSbFpDQmNJbDh1ZDJobGNtVmNJaUJ6ZEhsc1pTQmpZV3hzWW1GamExeHVJQ0FnS2lCM2FXeHNJSEpsZEhWeWJpQmdkSEoxWldBZ1ptOXlJR1ZzWlcxbGJuUnpJSFJvWVhRZ2FHRjJaU0IwYUdVZ2NISnZjR1YwYVdWeklHOW1JSFJvWlNCbmFYWmxiaUJ2WW1wbFkzUXNYRzRnSUNBcUlHVnNjMlVnWUdaaGJITmxZQzVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWVd4cFlYTWdZVzU1WEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JEYjJ4c1pXTjBhVzl1YzF4dUlDQWdLaUJBY0dGeVlXMGdlMEZ5Y21GNWZFOWlhbVZqZEh4VGRISnBibWQ5SUdOdmJHeGxZM1JwYjI0Z1ZHaGxJR052Ykd4bFkzUnBiMjRnZEc4Z2FYUmxjbUYwWlNCdmRtVnlMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwWjFibU4wYVc5dWZFOWlhbVZqZEh4VGRISnBibWQ5SUZ0allXeHNZbUZqYXoxcFpHVnVkR2wwZVYwZ1ZHaGxJR1oxYm1OMGFXOXVJR05oYkd4bFpDQndaWEpjYmlBZ0lDb2dJR2wwWlhKaGRHbHZiaTRnU1dZZ1lTQndjbTl3WlhKMGVTQnVZVzFsSUc5eUlHOWlhbVZqZENCcGN5QndZWE56WldRc0lHbDBJSGRwYkd3Z1ltVWdkWE5sWkNCMGJ5QmpjbVZoZEdWY2JpQWdJQ29nSUdFZ1hDSmZMbkJzZFdOclhDSWdiM0lnWENKZkxuZG9aWEpsWENJZ2MzUjViR1VnWTJGc2JHSmhZMnNzSUhKbGMzQmxZM1JwZG1Wc2VTNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0TmFYaGxaSDBnVzNSb2FYTkJjbWRkSUZSb1pTQmdkR2hwYzJBZ1ltbHVaR2x1WnlCdlppQmdZMkZzYkdKaFkydGdMbHh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdRbTl2YkdWaGJuMGdVbVYwZFhKdWN5QmdkSEoxWldBZ2FXWWdZVzU1SUdWc1pXMWxiblFnY0dGemMyVnpJSFJvWlNCallXeHNZbUZqYXlCamFHVmpheXhjYmlBZ0lDb2dJR1ZzYzJVZ1lHWmhiSE5sWUM1Y2JpQWdJQ29nUUdWNFlXMXdiR1ZjYmlBZ0lDcGNiaUFnSUNvZ1h5NXpiMjFsS0Z0dWRXeHNMQ0F3TENBbmVXVnpKeXdnWm1Gc2MyVmRMQ0JDYjI5c1pXRnVLVHRjYmlBZ0lDb2dMeThnUFQ0Z2RISjFaVnh1SUNBZ0tseHVJQ0FnS2lCMllYSWdabTl2WkNBOUlGdGNiaUFnSUNvZ0lDQjdJQ2R1WVcxbEp6b2dKMkZ3Y0d4bEp5d2dJQ2R2Y21kaGJtbGpKem9nWm1Gc2MyVXNJQ2QwZVhCbEp6b2dKMlp5ZFdsMEp5QjlMRnh1SUNBZ0tpQWdJSHNnSjI1aGJXVW5PaUFuWTJGeWNtOTBKeXdnSjI5eVoyRnVhV01uT2lCMGNuVmxMQ0FnSjNSNWNHVW5PaUFuZG1WblpYUmhZbXhsSnlCOVhHNGdJQ0FxSUYwN1hHNGdJQ0FxWEc0Z0lDQXFJQzh2SUhWemFXNW5JRndpWHk1d2JIVmphMXdpSUdOaGJHeGlZV05ySUhOb2IzSjBhR0Z1WkZ4dUlDQWdLaUJmTG5OdmJXVW9abTl2WkN3Z0oyOXlaMkZ1YVdNbktUdGNiaUFnSUNvZ0x5OGdQVDRnZEhKMVpWeHVJQ0FnS2x4dUlDQWdLaUF2THlCMWMybHVaeUJjSWw4dWQyaGxjbVZjSWlCallXeHNZbUZqYXlCemFHOXlkR2hoYm1SY2JpQWdJQ29nWHk1emIyMWxLR1p2YjJRc0lIc2dKM1I1Y0dVbk9pQW5iV1ZoZENjZ2ZTazdYRzRnSUNBcUlDOHZJRDArSUdaaGJITmxYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJ6YjIxbEtHTnZiR3hsWTNScGIyNHNJR05oYkd4aVlXTnJMQ0IwYUdselFYSm5LU0I3WEc0Z0lDQWdkbUZ5SUhKbGMzVnNkRHRjYmlBZ0lDQmpZV3hzWW1GamF5QTlJR055WldGMFpVTmhiR3hpWVdOcktHTmhiR3hpWVdOckxDQjBhR2x6UVhKbktUdGNibHh1SUNBZ0lHbG1JQ2hwYzBGeWNtRjVLR052Ykd4bFkzUnBiMjRwS1NCN1hHNGdJQ0FnSUNCMllYSWdhVzVrWlhnZ1BTQXRNU3hjYmlBZ0lDQWdJQ0FnSUNCc1pXNW5kR2dnUFNCamIyeHNaV04wYVc5dUxteGxibWQwYUR0Y2JseHVJQ0FnSUNBZ2QyaHBiR1VnS0NzcmFXNWtaWGdnUENCc1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLQ2h5WlhOMWJIUWdQU0JqWVd4c1ltRmpheWhqYjJ4c1pXTjBhVzl1VzJsdVpHVjRYU3dnYVc1a1pYZ3NJR052Ykd4bFkzUnBiMjRwS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUdWaFkyZ29ZMjlzYkdWamRHbHZiaXdnWm5WdVkzUnBiMjRvZG1Gc2RXVXNJR2x1WkdWNExDQmpiMnhzWldOMGFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUFoS0hKbGMzVnNkQ0E5SUdOaGJHeGlZV05yS0haaGJIVmxMQ0JwYm1SbGVDd2dZMjlzYkdWamRHbHZiaWtwTzF4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQWhJWEpsYzNWc2REdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJEY21WaGRHVnpJR0Z1SUdGeWNtRjVJRzltSUdWc1pXMWxiblJ6TENCemIzSjBaV1FnYVc0Z1lYTmpaVzVrYVc1bklHOXlaR1Z5SUdKNUlIUm9aU0J5WlhOMWJIUnpJRzltWEc0Z0lDQXFJSEoxYm01cGJtY2daV0ZqYUNCbGJHVnRaVzUwSUdsdUlIUm9aU0JnWTI5c2JHVmpkR2x2Ym1BZ2RHaHliM1ZuYUNCMGFHVWdZR05oYkd4aVlXTnJZQzRnVkdocGN5QnRaWFJvYjJSY2JpQWdJQ29nY0dWeVptOXliWE1nWVNCemRHRmliR1VnYzI5eWRDd2dkR2hoZENCcGN5d2dhWFFnZDJsc2JDQndjbVZ6WlhKMlpTQjBhR1VnYjNKcFoybHVZV3dnYzI5eWRDQnZjbVJsY2lCdlpseHVJQ0FnS2lCbGNYVmhiQ0JsYkdWdFpXNTBjeTRnVkdobElHQmpZV3hzWW1GamEyQWdhWE1nWW05MWJtUWdkRzhnWUhSb2FYTkJjbWRnSUdGdVpDQnBiblp2YTJWa0lIZHBkR2dnZEdoeVpXVmNiaUFnSUNvZ1lYSm5kVzFsYm5Sek95QW9kbUZzZFdVc0lHbHVaR1Y0Zkd0bGVTd2dZMjlzYkdWamRHbHZiaWt1WEc0Z0lDQXFYRzRnSUNBcUlFbG1JR0VnY0hKdmNHVnlkSGtnYm1GdFpTQnBjeUJ3WVhOelpXUWdabTl5SUdCallXeHNZbUZqYTJBc0lIUm9aU0JqY21WaGRHVmtJRndpWHk1d2JIVmphMXdpSUhOMGVXeGxYRzRnSUNBcUlHTmhiR3hpWVdOcklIZHBiR3dnY21WMGRYSnVJSFJvWlNCd2NtOXdaWEowZVNCMllXeDFaU0J2WmlCMGFHVWdaMmwyWlc0Z1pXeGxiV1Z1ZEM1Y2JpQWdJQ3BjYmlBZ0lDb2dTV1lnWVc0Z2IySnFaV04wSUdseklIQmhjM05sWkNCbWIzSWdZR05oYkd4aVlXTnJZQ3dnZEdobElHTnlaV0YwWldRZ1hDSmZMbmRvWlhKbFhDSWdjM1I1YkdVZ1kyRnNiR0poWTJ0Y2JpQWdJQ29nZDJsc2JDQnlaWFIxY200Z1lIUnlkV1ZnSUdadmNpQmxiR1Z0Wlc1MGN5QjBhR0YwSUdoaGRtVWdkR2hsSUhCeWIzQmxkR2xsY3lCdlppQjBhR1VnWjJsMlpXNGdiMkpxWldOMExGeHVJQ0FnS2lCbGJITmxJR0JtWVd4elpXQXVYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRR05oZEdWbmIzSjVJRU52Ykd4bFkzUnBiMjV6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdRWEp5WVhsOFQySnFaV04wZkZOMGNtbHVaMzBnWTI5c2JHVmpkR2x2YmlCVWFHVWdZMjlzYkdWamRHbHZiaUIwYnlCcGRHVnlZWFJsSUc5MlpYSXVYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OFQySnFaV04wZkZOMGNtbHVaMzBnVzJOaGJHeGlZV05yUFdsa1pXNTBhWFI1WFNCVWFHVWdablZ1WTNScGIyNGdZMkZzYkdWa0lIQmxjbHh1SUNBZ0tpQWdhWFJsY21GMGFXOXVMaUJKWmlCaElIQnliM0JsY25SNUlHNWhiV1VnYjNJZ2IySnFaV04wSUdseklIQmhjM05sWkN3Z2FYUWdkMmxzYkNCaVpTQjFjMlZrSUhSdklHTnlaV0YwWlZ4dUlDQWdLaUFnWVNCY0lsOHVjR3gxWTJ0Y0lpQnZjaUJjSWw4dWQyaGxjbVZjSWlCemRIbHNaU0JqWVd4c1ltRmpheXdnY21WemNHVmpkR2wyWld4NUxseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0JiZEdocGMwRnlaMTBnVkdobElHQjBhR2x6WUNCaWFXNWthVzVuSUc5bUlHQmpZV3hzWW1GamEyQXVYRzRnSUNBcUlFQnlaWFIxY201eklIdEJjbkpoZVgwZ1VtVjBkWEp1Y3lCaElHNWxkeUJoY25KaGVTQnZaaUJ6YjNKMFpXUWdaV3hsYldWdWRITXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJRjh1YzI5eWRFSjVLRnN4TENBeUxDQXpYU3dnWm5WdVkzUnBiMjRvYm5WdEtTQjdJSEpsZEhWeWJpQk5ZWFJvTG5OcGJpaHVkVzBwT3lCOUtUdGNiaUFnSUNvZ0x5OGdQVDRnV3pNc0lERXNJREpkWEc0Z0lDQXFYRzRnSUNBcUlGOHVjMjl5ZEVKNUtGc3hMQ0F5TENBelhTd2dablZ1WTNScGIyNG9iblZ0S1NCN0lISmxkSFZ5YmlCMGFHbHpMbk5wYmlodWRXMHBPeUI5TENCTllYUm9LVHRjYmlBZ0lDb2dMeThnUFQ0Z1d6TXNJREVzSURKZFhHNGdJQ0FxWEc0Z0lDQXFJQzh2SUhWemFXNW5JRndpWHk1d2JIVmphMXdpSUdOaGJHeGlZV05ySUhOb2IzSjBhR0Z1WkZ4dUlDQWdLaUJmTG5OdmNuUkNlU2hiSjJKaGJtRnVZU2NzSUNkemRISmhkMkpsY25KNUp5d2dKMkZ3Y0d4bEoxMHNJQ2RzWlc1bmRHZ25LVHRjYmlBZ0lDb2dMeThnUFQ0Z1d5ZGhjSEJzWlNjc0lDZGlZVzVoYm1FbkxDQW5jM1J5WVhkaVpYSnllU2RkWEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCemIzSjBRbmtvWTI5c2JHVmpkR2x2Yml3Z1kyRnNiR0poWTJzc0lIUm9hWE5CY21jcElIdGNiaUFnSUNCMllYSWdhVzVrWlhnZ1BTQXRNU3hjYmlBZ0lDQWdJQ0FnYkdWdVozUm9JRDBnWTI5c2JHVmpkR2x2YmlBL0lHTnZiR3hsWTNScGIyNHViR1Z1WjNSb0lEb2dNQ3hjYmlBZ0lDQWdJQ0FnY21WemRXeDBJRDBnUVhKeVlYa29kSGx3Wlc5bUlHeGxibWQwYUNBOVBTQW5iblZ0WW1WeUp5QS9JR3hsYm1kMGFDQTZJREFwTzF4dVhHNGdJQ0FnWTJGc2JHSmhZMnNnUFNCamNtVmhkR1ZEWVd4c1ltRmpheWhqWVd4c1ltRmpheXdnZEdocGMwRnlaeWs3WEc0Z0lDQWdabTl5UldGamFDaGpiMnhzWldOMGFXOXVMQ0JtZFc1amRHbHZiaWgyWVd4MVpTd2dhMlY1TENCamIyeHNaV04wYVc5dUtTQjdYRzRnSUNBZ0lDQnlaWE4xYkhSYkt5dHBibVJsZUYwZ1BTQjdYRzRnSUNBZ0lDQWdJQ2RqY21sMFpYSnBZU2M2SUdOaGJHeGlZV05yS0haaGJIVmxMQ0JyWlhrc0lHTnZiR3hsWTNScGIyNHBMRnh1SUNBZ0lDQWdJQ0FuYVc1a1pYZ25PaUJwYm1SbGVDeGNiaUFnSUNBZ0lDQWdKM1poYkhWbEp6b2dkbUZzZFdWY2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNCc1pXNW5kR2dnUFNCeVpYTjFiSFF1YkdWdVozUm9PMXh1SUNBZ0lISmxjM1ZzZEM1emIzSjBLR052YlhCaGNtVkJjMk5sYm1ScGJtY3BPMXh1SUNBZ0lIZG9hV3hsSUNoc1pXNW5kR2d0TFNrZ2UxeHVJQ0FnSUNBZ2NtVnpkV3gwVzJ4bGJtZDBhRjBnUFNCeVpYTjFiSFJiYkdWdVozUm9YUzUyWVd4MVpUdGNiaUFnSUNCOVhHNGdJQ0FnY21WMGRYSnVJSEpsYzNWc2REdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJEYjI1MlpYSjBjeUIwYUdVZ1lHTnZiR3hsWTNScGIyNWdJSFJ2SUdGdUlHRnljbUY1TGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCRGIyeHNaV04wYVc5dWMxeHVJQ0FnS2lCQWNHRnlZVzBnZTBGeWNtRjVmRTlpYW1WamRIeFRkSEpwYm1kOUlHTnZiR3hsWTNScGIyNGdWR2hsSUdOdmJHeGxZM1JwYjI0Z2RHOGdZMjl1ZG1WeWRDNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwRnljbUY1ZlNCU1pYUjFjbTV6SUhSb1pTQnVaWGNnWTI5dWRtVnlkR1ZrSUdGeWNtRjVMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUFvWm5WdVkzUnBiMjRvS1NCN0lISmxkSFZ5YmlCZkxuUnZRWEp5WVhrb1lYSm5kVzFsYm5SektTNXpiR2xqWlNneEtUc2dmU2tvTVN3Z01pd2dNeXdnTkNrN1hHNGdJQ0FxSUM4dklEMCtJRnN5TENBekxDQTBYVnh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnZEc5QmNuSmhlU2hqYjJ4c1pXTjBhVzl1S1NCN1hHNGdJQ0FnYVdZZ0tHTnZiR3hsWTNScGIyNGdKaVlnZEhsd1pXOW1JR052Ykd4bFkzUnBiMjR1YkdWdVozUm9JRDA5SUNkdWRXMWlaWEluS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnSUhOc2FXTmxLR052Ykd4bFkzUnBiMjRwTzF4dUlDQWdJSDFjYmlBZ0lDQnlaWFIxY200Z2RtRnNkV1Z6S0dOdmJHeGxZM1JwYjI0cE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRVY0WVcxcGJtVnpJR1ZoWTJnZ1pXeGxiV1Z1ZENCcGJpQmhJR0JqYjJ4c1pXTjBhVzl1WUN3Z2NtVjBkWEp1YVc1bklHRnVJR0Z5Y21GNUlHOW1JR0ZzYkNCbGJHVnRaVzUwYzF4dUlDQWdLaUIwYUdGMElHaGhkbVVnZEdobElHZHBkbVZ1SUdCd2NtOXdaWEowYVdWellDNGdWMmhsYmlCamFHVmphMmx1WnlCZ2NISnZjR1Z5ZEdsbGMyQXNJSFJvYVhNZ2JXVjBhRzlrWEc0Z0lDQXFJSEJsY21admNtMXpJR0VnWkdWbGNDQmpiMjF3WVhKcGMyOXVJR0psZEhkbFpXNGdkbUZzZFdWeklIUnZJR1JsZEdWeWJXbHVaU0JwWmlCMGFHVjVJR0Z5WlNCbGNYVnBkbUZzWlc1MFhHNGdJQ0FxSUhSdklHVmhZMmdnYjNSb1pYSXVYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRSFI1Y0dVZ1JuVnVZM1JwYjI1Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUVOdmJHeGxZM1JwYjI1elhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhKeVlYbDhUMkpxWldOMGZGTjBjbWx1WjMwZ1kyOXNiR1ZqZEdsdmJpQlVhR1VnWTI5c2JHVmpkR2x2YmlCMGJ5QnBkR1Z5WVhSbElHOTJaWEl1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQndjbTl3WlhKMGFXVnpJRlJvWlNCdlltcGxZM1FnYjJZZ2NISnZjR1Z5ZEhrZ2RtRnNkV1Z6SUhSdklHWnBiSFJsY2lCaWVTNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwRnljbUY1ZlNCU1pYUjFjbTV6SUdFZ2JtVjNJR0Z5Y21GNUlHOW1JR1ZzWlcxbGJuUnpJSFJvWVhRZ2FHRjJaU0IwYUdVZ1oybDJaVzRnWUhCeWIzQmxjblJwWlhOZ0xseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQjJZWElnYzNSdmIyZGxjeUE5SUZ0Y2JpQWdJQ29nSUNCN0lDZHVZVzFsSnpvZ0oyMXZaU2NzSUNkaFoyVW5PaUEwTUNCOUxGeHVJQ0FnS2lBZ0lIc2dKMjVoYldVbk9pQW5iR0Z5Y25rbkxDQW5ZV2RsSnpvZ05UQWdmVnh1SUNBZ0tpQmRPMXh1SUNBZ0tseHVJQ0FnS2lCZkxuZG9aWEpsS0hOMGIyOW5aWE1zSUhzZ0oyRm5aU2M2SURRd0lIMHBPMXh1SUNBZ0tpQXZMeUE5UGlCYmV5QW5ibUZ0WlNjNklDZHRiMlVuTENBbllXZGxKem9nTkRBZ2ZWMWNiaUFnSUNvdlhHNGdJSFpoY2lCM2FHVnlaU0E5SUdacGJIUmxjanRjYmx4dUlDQXZLaTB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0S2k5Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUTNKbFlYUmxjeUJoYmlCaGNuSmhlU0IzYVhSb0lHRnNiQ0JtWVd4elpYa2dkbUZzZFdWeklHOW1JR0JoY25KaGVXQWdjbVZ0YjNabFpDNGdWR2hsSUhaaGJIVmxjMXh1SUNBZ0tpQmdabUZzYzJWZ0xDQmdiblZzYkdBc0lHQXdZQ3dnWUZ3aVhDSmdMQ0JnZFc1a1pXWnBibVZrWUNCaGJtUWdZRTVoVG1BZ1lYSmxJR0ZzYkNCbVlXeHpaWGt1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUVGeWNtRjVjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwRnljbUY1ZlNCaGNuSmhlU0JVYUdVZ1lYSnlZWGtnZEc4Z1kyOXRjR0ZqZEM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBGeWNtRjVmU0JTWlhSMWNtNXpJR0VnYm1WM0lHWnBiSFJsY21Wa0lHRnljbUY1TGx4dUlDQWdLaUJBWlhoaGJYQnNaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtTnZiWEJoWTNRb1d6QXNJREVzSUdaaGJITmxMQ0F5TENBbkp5d2dNMTBwTzF4dUlDQWdLaUF2THlBOVBpQmJNU3dnTWl3Z00xMWNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJR052YlhCaFkzUW9ZWEp5WVhrcElIdGNiaUFnSUNCMllYSWdhVzVrWlhnZ1BTQXRNU3hjYmlBZ0lDQWdJQ0FnYkdWdVozUm9JRDBnWVhKeVlYa2dQeUJoY25KaGVTNXNaVzVuZEdnZ09pQXdMRnh1SUNBZ0lDQWdJQ0J5WlhOMWJIUWdQU0JiWFR0Y2JseHVJQ0FnSUhkb2FXeGxJQ2dySzJsdVpHVjRJRHdnYkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0IyWVhJZ2RtRnNkV1VnUFNCaGNuSmhlVnRwYm1SbGVGMDdYRzRnSUNBZ0lDQnBaaUFvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJQ0FnY21WemRXeDBMbkIxYzJnb2RtRnNkV1VwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTnlaV0YwWlhNZ1lXNGdZWEp5WVhrZ2IyWWdZR0Z5Y21GNVlDQmxiR1Z0Wlc1MGN5QnViM1FnY0hKbGMyVnVkQ0JwYmlCMGFHVWdiM1JvWlhJZ1lYSnlZWGx6WEc0Z0lDQXFJSFZ6YVc1bklITjBjbWxqZENCbGNYVmhiR2wwZVNCbWIzSWdZMjl0Y0dGeWFYTnZibk1zSUdrdVpTNGdZRDA5UFdBdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ6ZEdGMGFXTmNiaUFnSUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFnSUNvZ1FHTmhkR1ZuYjNKNUlFRnljbUY1YzF4dUlDQWdLaUJBY0dGeVlXMGdlMEZ5Y21GNWZTQmhjbkpoZVNCVWFHVWdZWEp5WVhrZ2RHOGdjSEp2WTJWemN5NWNiaUFnSUNvZ1FIQmhjbUZ0SUh0QmNuSmhlWDBnVzJGeWNtRjVNU3dnWVhKeVlYa3lMQ0F1TGk1ZElFRnljbUY1Y3lCMGJ5QmphR1ZqYXk1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBGeWNtRjVmU0JTWlhSMWNtNXpJR0VnYm1WM0lHRnljbUY1SUc5bUlHQmhjbkpoZVdBZ1pXeGxiV1Z1ZEhNZ2JtOTBJSEJ5WlhObGJuUWdhVzRnZEdobFhHNGdJQ0FxSUNCdmRHaGxjaUJoY25KaGVYTXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJRjh1WkdsbVptVnlaVzVqWlNoYk1Td2dNaXdnTXl3Z05Dd2dOVjBzSUZzMUxDQXlMQ0F4TUYwcE8xeHVJQ0FnS2lBdkx5QTlQaUJiTVN3Z015d2dORjFjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUdScFptWmxjbVZ1WTJVb1lYSnlZWGtwSUh0Y2JpQWdJQ0IyWVhJZ2FXNWtaWGdnUFNBdE1TeGNiaUFnSUNBZ0lDQWdiR1Z1WjNSb0lEMGdZWEp5WVhrZ1B5QmhjbkpoZVM1c1pXNW5kR2dnT2lBd0xGeHVJQ0FnSUNBZ0lDQm1iR0YwZEdWdVpXUWdQU0JqYjI1allYUXVZWEJ3Ykhrb1lYSnlZWGxTWldZc0lHRnlaM1Z0Wlc1MGN5a3NYRzRnSUNBZ0lDQWdJR052Ym5SaGFXNXpJRDBnWTJGamFHVmtRMjl1ZEdGcGJuTW9abXhoZEhSbGJtVmtMQ0JzWlc1bmRHZ3BMRnh1SUNBZ0lDQWdJQ0J5WlhOMWJIUWdQU0JiWFR0Y2JseHVJQ0FnSUhkb2FXeGxJQ2dySzJsdVpHVjRJRHdnYkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0IyWVhJZ2RtRnNkV1VnUFNCaGNuSmhlVnRwYm1SbGVGMDdYRzRnSUNBZ0lDQnBaaUFvSVdOdmJuUmhhVzV6S0haaGJIVmxLU2tnZTF4dUlDQWdJQ0FnSUNCeVpYTjFiSFF1Y0hWemFDaDJZV3gxWlNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnlaWE4xYkhRN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dSMlYwY3lCMGFHVWdabWx5YzNRZ1pXeGxiV1Z1ZENCdlppQjBhR1VnWUdGeWNtRjVZQzRnU1dZZ1lTQnVkVzFpWlhJZ1lHNWdJR2x6SUhCaGMzTmxaQ3dnZEdobElHWnBjbk4wWEc0Z0lDQXFJR0J1WUNCbGJHVnRaVzUwY3lCdlppQjBhR1VnWUdGeWNtRjVZQ0JoY21VZ2NtVjBkWEp1WldRdUlFbG1JR0VnWUdOaGJHeGlZV05yWUNCbWRXNWpkR2x2YmlCcGN5QndZWE56WldRc1hHNGdJQ0FxSUhSb1pTQm1hWEp6ZENCbGJHVnRaVzUwY3lCMGFHVWdZR05oYkd4aVlXTnJZQ0J5WlhSMWNtNXpJSFJ5ZFhSb2VTQm1iM0lnWVhKbElISmxkSFZ5Ym1Wa0xpQlVhR1VnWUdOaGJHeGlZV05yWUZ4dUlDQWdLaUJwY3lCaWIzVnVaQ0IwYnlCZ2RHaHBjMEZ5WjJBZ1lXNWtJR2x1ZG05clpXUWdkMmwwYUNCMGFISmxaU0JoY21kMWJXVnVkSE03SUNoMllXeDFaU3dnYVc1a1pYZ3NJR0Z5Y21GNUtTNWNiaUFnSUNwY2JpQWdJQ29nU1dZZ1lTQndjbTl3WlhKMGVTQnVZVzFsSUdseklIQmhjM05sWkNCbWIzSWdZR05oYkd4aVlXTnJZQ3dnZEdobElHTnlaV0YwWldRZ1hDSmZMbkJzZFdOclhDSWdjM1I1YkdWY2JpQWdJQ29nWTJGc2JHSmhZMnNnZDJsc2JDQnlaWFIxY200Z2RHaGxJSEJ5YjNCbGNuUjVJSFpoYkhWbElHOW1JSFJvWlNCbmFYWmxiaUJsYkdWdFpXNTBMbHh1SUNBZ0tseHVJQ0FnS2lCSlppQmhiaUJ2WW1wbFkzUWdhWE1nY0dGemMyVmtJR1p2Y2lCZ1kyRnNiR0poWTJ0Z0xDQjBhR1VnWTNKbFlYUmxaQ0JjSWw4dWQyaGxjbVZjSWlCemRIbHNaU0JqWVd4c1ltRmphMXh1SUNBZ0tpQjNhV3hzSUhKbGRIVnliaUJnZEhKMVpXQWdabTl5SUdWc1pXMWxiblJ6SUhSb1lYUWdhR0YyWlNCMGFHVWdjSEp2Y0dWMGFXVnpJRzltSUhSb1pTQm5hWFpsYmlCdlltcGxZM1FzWEc0Z0lDQXFJR1ZzYzJVZ1lHWmhiSE5sWUM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVlXeHBZWE1nYUdWaFpDd2dkR0ZyWlZ4dUlDQWdLaUJBWTJGMFpXZHZjbmtnUVhKeVlYbHpYRzRnSUNBcUlFQndZWEpoYlNCN1FYSnlZWGw5SUdGeWNtRjVJRlJvWlNCaGNuSmhlU0IwYnlCeGRXVnllUzVjYmlBZ0lDb2dRSEJoY21GdElIdEdkVzVqZEdsdmJueFBZbXBsWTNSOFRuVnRZbVZ5ZkZOMGNtbHVaMzBnVzJOaGJHeGlZV05yZkc1ZElGUm9aU0JtZFc1amRHbHZiaUJqWVd4c1pXUmNiaUFnSUNvZ0lIQmxjaUJsYkdWdFpXNTBJRzl5SUhSb1pTQnVkVzFpWlhJZ2IyWWdaV3hsYldWdWRITWdkRzhnY21WMGRYSnVMaUJKWmlCaElIQnliM0JsY25SNUlHNWhiV1VnYjNKY2JpQWdJQ29nSUc5aWFtVmpkQ0JwY3lCd1lYTnpaV1FzSUdsMElIZHBiR3dnWW1VZ2RYTmxaQ0IwYnlCamNtVmhkR1VnWVNCY0lsOHVjR3gxWTJ0Y0lpQnZjaUJjSWw4dWQyaGxjbVZjSWx4dUlDQWdLaUFnYzNSNWJHVWdZMkZzYkdKaFkyc3NJSEpsYzNCbFkzUnBkbVZzZVM1Y2JpQWdJQ29nUUhCaGNtRnRJSHROYVhobFpIMGdXM1JvYVhOQmNtZGRJRlJvWlNCZ2RHaHBjMkFnWW1sdVpHbHVaeUJ2WmlCZ1kyRnNiR0poWTJ0Z0xseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1RXbDRaV1I5SUZKbGRIVnlibk1nZEdobElHWnBjbk4wSUdWc1pXMWxiblFvY3lrZ2IyWWdZR0Z5Y21GNVlDNWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dYeTVtYVhKemRDaGJNU3dnTWl3Z00xMHBPMXh1SUNBZ0tpQXZMeUE5UGlBeFhHNGdJQ0FxWEc0Z0lDQXFJRjh1Wm1seWMzUW9XekVzSURJc0lETmRMQ0F5S1R0Y2JpQWdJQ29nTHk4Z1BUNGdXekVzSURKZFhHNGdJQ0FxWEc0Z0lDQXFJRjh1Wm1seWMzUW9XekVzSURJc0lETmRMQ0JtZFc1amRHbHZiaWh1ZFcwcElIdGNiaUFnSUNvZ0lDQnlaWFIxY200Z2JuVnRJRHdnTXp0Y2JpQWdJQ29nZlNrN1hHNGdJQ0FxSUM4dklEMCtJRnN4TENBeVhWeHVJQ0FnS2x4dUlDQWdLaUIyWVhJZ1ptOXZaQ0E5SUZ0Y2JpQWdJQ29nSUNCN0lDZHVZVzFsSnpvZ0oySmhibUZ1WVNjc0lDZHZjbWRoYm1sakp6b2dkSEoxWlNCOUxGeHVJQ0FnS2lBZ0lIc2dKMjVoYldVbk9pQW5ZbVZsZENjc0lDQWdKMjl5WjJGdWFXTW5PaUJtWVd4elpTQjlMRnh1SUNBZ0tpQmRPMXh1SUNBZ0tseHVJQ0FnS2lBdkx5QjFjMmx1WnlCY0lsOHVjR3gxWTJ0Y0lpQmpZV3hzWW1GamF5QnphRzl5ZEdoaGJtUmNiaUFnSUNvZ1h5NW1hWEp6ZENobWIyOWtMQ0FuYjNKbllXNXBZeWNwTzF4dUlDQWdLaUF2THlBOVBpQmJleUFuYm1GdFpTYzZJQ2RpWVc1aGJtRW5MQ0FuYjNKbllXNXBZeWM2SUhSeWRXVWdmVjFjYmlBZ0lDcGNiaUFnSUNvZ2RtRnlJR1p2YjJRZ1BTQmJYRzRnSUNBcUlDQWdleUFuYm1GdFpTYzZJQ2RoY0hCc1pTY3NJQ0FuZEhsd1pTYzZJQ2RtY25WcGRDY2dmU3hjYmlBZ0lDb2dJQ0I3SUNkdVlXMWxKem9nSjJKaGJtRnVZU2NzSUNkMGVYQmxKem9nSjJaeWRXbDBKeUI5TEZ4dUlDQWdLaUFnSUhzZ0oyNWhiV1VuT2lBblltVmxkQ2NzSUNBZ0ozUjVjR1VuT2lBbmRtVm5aWFJoWW14bEp5QjlYRzRnSUNBcUlGMDdYRzRnSUNBcVhHNGdJQ0FxSUM4dklIVnphVzVuSUZ3aVh5NTNhR1Z5WlZ3aUlHTmhiR3hpWVdOcklITm9iM0owYUdGdVpGeHVJQ0FnS2lCZkxtWnBjbk4wS0dadmIyUXNJSHNnSjNSNWNHVW5PaUFuWm5KMWFYUW5JSDBwTzF4dUlDQWdLaUF2THlBOVBpQmJleUFuYm1GdFpTYzZJQ2RoY0hCc1pTY3NJQ2QwZVhCbEp6b2dKMlp5ZFdsMEp5QjlMQ0I3SUNkdVlXMWxKem9nSjJKaGJtRnVZU2NzSUNkMGVYQmxKem9nSjJaeWRXbDBKeUI5WFZ4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z1ptbHljM1FvWVhKeVlYa3NJR05oYkd4aVlXTnJMQ0IwYUdselFYSm5LU0I3WEc0Z0lDQWdhV1lnS0dGeWNtRjVLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2JpQTlJREFzWEc0Z0lDQWdJQ0FnSUNBZ2JHVnVaM1JvSUQwZ1lYSnlZWGt1YkdWdVozUm9PMXh1WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUdOaGJHeGlZV05ySUNFOUlDZHVkVzFpWlhJbklDWW1JR05oYkd4aVlXTnJJQ0U5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlHbHVaR1Y0SUQwZ0xURTdYRzRnSUNBZ0lDQWdJR05oYkd4aVlXTnJJRDBnWTNKbFlYUmxRMkZzYkdKaFkyc29ZMkZzYkdKaFkyc3NJSFJvYVhOQmNtY3BPMXh1SUNBZ0lDQWdJQ0IzYUdsc1pTQW9LeXRwYm1SbGVDQThJR3hsYm1kMGFDQW1KaUJqWVd4c1ltRmpheWhoY25KaGVWdHBibVJsZUYwc0lHbHVaR1Y0TENCaGNuSmhlU2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQnVLeXM3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUc0Z1BTQmpZV3hzWW1GamF6dGNiaUFnSUNBZ0lDQWdhV1lnS0c0Z1BUMGdiblZzYkNCOGZDQjBhR2x6UVhKbktTQjdYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR0Z5Y21GNVd6QmRPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjMnhwWTJVb1lYSnlZWGtzSURBc0lHNWhkR2wyWlUxcGJpaHVZWFJwZG1WTllYZ29NQ3dnYmlrc0lHeGxibWQwYUNrcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkdiR0YwZEdWdWN5QmhJRzVsYzNSbFpDQmhjbkpoZVNBb2RHaGxJRzVsYzNScGJtY2dZMkZ1SUdKbElIUnZJR0Z1ZVNCa1pYQjBhQ2t1SUVsbUlHQnphR0ZzYkc5M1lDQnBjMXh1SUNBZ0tpQjBjblYwYUhrc0lHQmhjbkpoZVdBZ2QybHNiQ0J2Ym14NUlHSmxJR1pzWVhSMFpXNWxaQ0JoSUhOcGJtZHNaU0JzWlhabGJDNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dRWEp5WVhselhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhKeVlYbDlJR0Z5Y21GNUlGUm9aU0JoY25KaGVTQjBieUJqYjIxd1lXTjBMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwSnZiMnhsWVc1OUlITm9ZV3hzYjNjZ1FTQm1iR0ZuSUhSdklHbHVaR2xqWVhSbElHOXViSGtnWm14aGRIUmxibWx1WnlCaElITnBibWRzWlNCc1pYWmxiQzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMEZ5Y21GNWZTQlNaWFIxY201eklHRWdibVYzSUdac1lYUjBaVzVsWkNCaGNuSmhlUzVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nWHk1bWJHRjBkR1Z1S0ZzeExDQmJNbDBzSUZzekxDQmJXelJkWFYxZEtUdGNiaUFnSUNvZ0x5OGdQVDRnV3pFc0lESXNJRE1zSURSZE8xeHVJQ0FnS2x4dUlDQWdLaUJmTG1ac1lYUjBaVzRvV3pFc0lGc3lYU3dnV3pNc0lGdGJORjFkWFYwc0lIUnlkV1VwTzF4dUlDQWdLaUF2THlBOVBpQmJNU3dnTWl3Z015d2dXMXMwWFYxZE8xeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdabXhoZEhSbGJpaGhjbkpoZVN3Z2MyaGhiR3h2ZHlrZ2UxeHVJQ0FnSUhaaGNpQnBibVJsZUNBOUlDMHhMRnh1SUNBZ0lDQWdJQ0JzWlc1bmRHZ2dQU0JoY25KaGVTQS9JR0Z5Y21GNUxteGxibWQwYUNBNklEQXNYRzRnSUNBZ0lDQWdJSEpsYzNWc2RDQTlJRnRkTzF4dVhHNGdJQ0FnZDJocGJHVWdLQ3NyYVc1a1pYZ2dQQ0JzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJSFpoY2lCMllXeDFaU0E5SUdGeWNtRjVXMmx1WkdWNFhUdGNibHh1SUNBZ0lDQWdMeThnY21WamRYSnphWFpsYkhrZ1pteGhkSFJsYmlCaGNuSmhlWE1nS0hOMWMyTmxjSFJwWW14bElIUnZJR05oYkd3Z2MzUmhZMnNnYkdsdGFYUnpLVnh1SUNBZ0lDQWdhV1lnS0dselFYSnlZWGtvZG1Gc2RXVXBLU0I3WEc0Z0lDQWdJQ0FnSUhCMWMyZ3VZWEJ3Ykhrb2NtVnpkV3gwTENCemFHRnNiRzkzSUQ4Z2RtRnNkV1VnT2lCbWJHRjBkR1Z1S0haaGJIVmxLU2s3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0J5WlhOMWJIUXVjSFZ6YUNoMllXeDFaU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1IyVjBjeUIwYUdVZ2FXNWtaWGdnWVhRZ2QyaHBZMmdnZEdobElHWnBjbk4wSUc5alkzVnljbVZ1WTJVZ2IyWWdZSFpoYkhWbFlDQnBjeUJtYjNWdVpDQjFjMmx1WjF4dUlDQWdLaUJ6ZEhKcFkzUWdaWEYxWVd4cGRIa2dabTl5SUdOdmJYQmhjbWx6YjI1ekxDQnBMbVV1SUdBOVBUMWdMaUJKWmlCMGFHVWdZR0Z5Y21GNVlDQnBjeUJoYkhKbFlXUjVYRzRnSUNBcUlITnZjblJsWkN3Z2NHRnpjMmx1WnlCZ2RISjFaV0FnWm05eUlHQm1jbTl0U1c1a1pYaGdJSGRwYkd3Z2NuVnVJR0VnWm1GemRHVnlJR0pwYm1GeWVTQnpaV0Z5WTJndVhHNGdJQ0FxWEc0Z0lDQXFJRUJ6ZEdGMGFXTmNiaUFnSUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFnSUNvZ1FHTmhkR1ZuYjNKNUlFRnljbUY1YzF4dUlDQWdLaUJBY0dGeVlXMGdlMEZ5Y21GNWZTQmhjbkpoZVNCVWFHVWdZWEp5WVhrZ2RHOGdjMlZoY21Ob0xseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0IyWVd4MVpTQlVhR1VnZG1Gc2RXVWdkRzhnYzJWaGNtTm9JR1p2Y2k1Y2JpQWdJQ29nUUhCaGNtRnRJSHRDYjI5c1pXRnVmRTUxYldKbGNuMGdXMlp5YjIxSmJtUmxlRDB3WFNCVWFHVWdhVzVrWlhnZ2RHOGdjMlZoY21Ob0lHWnliMjBnYjNJZ1lIUnlkV1ZnSUhSdlhHNGdJQ0FxSUNCd1pYSm1iM0p0SUdFZ1ltbHVZWEo1SUhObFlYSmphQ0J2YmlCaElITnZjblJsWkNCZ1lYSnlZWGxnTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3VG5WdFltVnlmU0JTWlhSMWNtNXpJSFJvWlNCcGJtUmxlQ0J2WmlCMGFHVWdiV0YwWTJobFpDQjJZV3gxWlNCdmNpQmdMVEZnTGx4dUlDQWdLaUJBWlhoaGJYQnNaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtbHVaR1Y0VDJZb1d6RXNJRElzSURNc0lERXNJRElzSUROZExDQXlLVHRjYmlBZ0lDb2dMeThnUFQ0Z01WeHVJQ0FnS2x4dUlDQWdLaUJmTG1sdVpHVjRUMllvV3pFc0lESXNJRE1zSURFc0lESXNJRE5kTENBeUxDQXpLVHRjYmlBZ0lDb2dMeThnUFQ0Z05GeHVJQ0FnS2x4dUlDQWdLaUJmTG1sdVpHVjRUMllvV3pFc0lERXNJRElzSURJc0lETXNJRE5kTENBeUxDQjBjblZsS1R0Y2JpQWdJQ29nTHk4Z1BUNGdNbHh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnYVc1a1pYaFBaaWhoY25KaGVTd2dkbUZzZFdVc0lHWnliMjFKYm1SbGVDa2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJQzB4TEZ4dUlDQWdJQ0FnSUNCc1pXNW5kR2dnUFNCaGNuSmhlU0EvSUdGeWNtRjVMbXhsYm1kMGFDQTZJREE3WEc1Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUdaeWIyMUpibVJsZUNBOVBTQW5iblZ0WW1WeUp5a2dlMXh1SUNBZ0lDQWdhVzVrWlhnZ1BTQW9abkp2YlVsdVpHVjRJRHdnTUNBL0lHNWhkR2wyWlUxaGVDZ3dMQ0JzWlc1bmRHZ2dLeUJtY205dFNXNWtaWGdwSURvZ1puSnZiVWx1WkdWNElIeDhJREFwSUMwZ01UdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tHWnliMjFKYm1SbGVDa2dlMXh1SUNBZ0lDQWdhVzVrWlhnZ1BTQnpiM0owWldSSmJtUmxlQ2hoY25KaGVTd2dkbUZzZFdVcE8xeHVJQ0FnSUNBZ2NtVjBkWEp1SUdGeWNtRjVXMmx1WkdWNFhTQTlQVDBnZG1Gc2RXVWdQeUJwYm1SbGVDQTZJQzB4TzF4dUlDQWdJSDFjYmlBZ0lDQjNhR2xzWlNBb0t5dHBibVJsZUNBOElHeGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ2FXWWdLR0Z5Y21GNVcybHVaR1Y0WFNBOVBUMGdkbUZzZFdVcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHbHVaR1Y0TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ0lDQnlaWFIxY200Z0xURTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUjJWMGN5QmhiR3dnWW5WMElIUm9aU0JzWVhOMElHVnNaVzFsYm5RZ2IyWWdZR0Z5Y21GNVlDNGdTV1lnWVNCdWRXMWlaWElnWUc1Z0lHbHpJSEJoYzNObFpDd2dkR2hsWEc0Z0lDQXFJR3hoYzNRZ1lHNWdJR1ZzWlcxbGJuUnpJR0Z5WlNCbGVHTnNkV1JsWkNCbWNtOXRJSFJvWlNCeVpYTjFiSFF1SUVsbUlHRWdZR05oYkd4aVlXTnJZQ0JtZFc1amRHbHZibHh1SUNBZ0tpQnBjeUJ3WVhOelpXUXNJSFJvWlNCc1lYTjBJR1ZzWlcxbGJuUnpJSFJvWlNCZ1kyRnNiR0poWTJ0Z0lISmxkSFZ5Ym5NZ2RISjFkR2g1SUdadmNpQmhjbVVnWlhoamJIVmtaV1JjYmlBZ0lDb2dabkp2YlNCMGFHVWdjbVZ6ZFd4MExpQlVhR1VnWUdOaGJHeGlZV05yWUNCcGN5QmliM1Z1WkNCMGJ5QmdkR2hwYzBGeVoyQWdZVzVrSUdsdWRtOXJaV1FnZDJsMGFDQjBhSEpsWlZ4dUlDQWdLaUJoY21kMWJXVnVkSE03SUNoMllXeDFaU3dnYVc1a1pYZ3NJR0Z5Y21GNUtTNWNiaUFnSUNwY2JpQWdJQ29nU1dZZ1lTQndjbTl3WlhKMGVTQnVZVzFsSUdseklIQmhjM05sWkNCbWIzSWdZR05oYkd4aVlXTnJZQ3dnZEdobElHTnlaV0YwWldRZ1hDSmZMbkJzZFdOclhDSWdjM1I1YkdWY2JpQWdJQ29nWTJGc2JHSmhZMnNnZDJsc2JDQnlaWFIxY200Z2RHaGxJSEJ5YjNCbGNuUjVJSFpoYkhWbElHOW1JSFJvWlNCbmFYWmxiaUJsYkdWdFpXNTBMbHh1SUNBZ0tseHVJQ0FnS2lCSlppQmhiaUJ2WW1wbFkzUWdhWE1nY0dGemMyVmtJR1p2Y2lCZ1kyRnNiR0poWTJ0Z0xDQjBhR1VnWTNKbFlYUmxaQ0JjSWw4dWQyaGxjbVZjSWlCemRIbHNaU0JqWVd4c1ltRmphMXh1SUNBZ0tpQjNhV3hzSUhKbGRIVnliaUJnZEhKMVpXQWdabTl5SUdWc1pXMWxiblJ6SUhSb1lYUWdhR0YyWlNCMGFHVWdjSEp2Y0dWMGFXVnpJRzltSUhSb1pTQm5hWFpsYmlCdlltcGxZM1FzWEc0Z0lDQXFJR1ZzYzJVZ1lHWmhiSE5sWUM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1FYSnlZWGx6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdRWEp5WVhsOUlHRnljbUY1SUZSb1pTQmhjbkpoZVNCMGJ5QnhkV1Z5ZVM1Y2JpQWdJQ29nUUhCaGNtRnRJSHRHZFc1amRHbHZibnhQWW1wbFkzUjhUblZ0WW1WeWZGTjBjbWx1WjMwZ1cyTmhiR3hpWVdOcmZHNDlNVjBnVkdobElHWjFibU4wYVc5dUlHTmhiR3hsWkZ4dUlDQWdLaUFnY0dWeUlHVnNaVzFsYm5RZ2IzSWdkR2hsSUc1MWJXSmxjaUJ2WmlCbGJHVnRaVzUwY3lCMGJ5QmxlR05zZFdSbExpQkpaaUJoSUhCeWIzQmxjblI1SUc1aGJXVWdiM0pjYmlBZ0lDb2dJRzlpYW1WamRDQnBjeUJ3WVhOelpXUXNJR2wwSUhkcGJHd2dZbVVnZFhObFpDQjBieUJqY21WaGRHVWdZU0JjSWw4dWNHeDFZMnRjSWlCdmNpQmNJbDh1ZDJobGNtVmNJbHh1SUNBZ0tpQWdjM1I1YkdVZ1kyRnNiR0poWTJzc0lISmxjM0JsWTNScGRtVnNlUzVjYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ1czUm9hWE5CY21kZElGUm9aU0JnZEdocGMyQWdZbWx1WkdsdVp5QnZaaUJnWTJGc2JHSmhZMnRnTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3UVhKeVlYbDlJRkpsZEhWeWJuTWdZU0J6YkdsalpTQnZaaUJnWVhKeVlYbGdMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUJmTG1sdWFYUnBZV3dvV3pFc0lESXNJRE5kS1R0Y2JpQWdJQ29nTHk4Z1BUNGdXekVzSURKZFhHNGdJQ0FxWEc0Z0lDQXFJRjh1YVc1cGRHbGhiQ2hiTVN3Z01pd2dNMTBzSURJcE8xeHVJQ0FnS2lBdkx5QTlQaUJiTVYxY2JpQWdJQ3BjYmlBZ0lDb2dYeTVwYm1sMGFXRnNLRnN4TENBeUxDQXpYU3dnWm5WdVkzUnBiMjRvYm5WdEtTQjdYRzRnSUNBcUlDQWdjbVYwZFhKdUlHNTFiU0ErSURFN1hHNGdJQ0FxSUgwcE8xeHVJQ0FnS2lBdkx5QTlQaUJiTVYxY2JpQWdJQ3BjYmlBZ0lDb2dkbUZ5SUdadmIyUWdQU0JiWEc0Z0lDQXFJQ0FnZXlBbmJtRnRaU2M2SUNkaVpXVjBKeXdnSUNBbmIzSm5ZVzVwWXljNklHWmhiSE5sSUgwc1hHNGdJQ0FxSUNBZ2V5QW5ibUZ0WlNjNklDZGpZWEp5YjNRbkxDQW5iM0puWVc1cFl5YzZJSFJ5ZFdVZ2ZWeHVJQ0FnS2lCZE8xeHVJQ0FnS2x4dUlDQWdLaUF2THlCMWMybHVaeUJjSWw4dWNHeDFZMnRjSWlCallXeHNZbUZqYXlCemFHOXlkR2hoYm1SY2JpQWdJQ29nWHk1cGJtbDBhV0ZzS0dadmIyUXNJQ2R2Y21kaGJtbGpKeWs3WEc0Z0lDQXFJQzh2SUQwK0lGdDdJQ2R1WVcxbEp6b2dKMkpsWlhRbkxDQWdJQ2R2Y21kaGJtbGpKem9nWm1Gc2MyVWdmVjFjYmlBZ0lDcGNiaUFnSUNvZ2RtRnlJR1p2YjJRZ1BTQmJYRzRnSUNBcUlDQWdleUFuYm1GdFpTYzZJQ2RpWVc1aGJtRW5MQ0FuZEhsd1pTYzZJQ2RtY25WcGRDY2dmU3hjYmlBZ0lDb2dJQ0I3SUNkdVlXMWxKem9nSjJKbFpYUW5MQ0FnSUNkMGVYQmxKem9nSjNabFoyVjBZV0pzWlNjZ2ZTeGNiaUFnSUNvZ0lDQjdJQ2R1WVcxbEp6b2dKMk5oY25KdmRDY3NJQ2QwZVhCbEp6b2dKM1psWjJWMFlXSnNaU2NnZlZ4dUlDQWdLaUJkTzF4dUlDQWdLbHh1SUNBZ0tpQXZMeUIxYzJsdVp5QmNJbDh1ZDJobGNtVmNJaUJqWVd4c1ltRmpheUJ6YUc5eWRHaGhibVJjYmlBZ0lDb2dYeTVwYm1sMGFXRnNLR1p2YjJRc0lIc2dKM1I1Y0dVbk9pQW5kbVZuWlhSaFlteGxKeUI5S1R0Y2JpQWdJQ29nTHk4Z1BUNGdXM3NnSjI1aGJXVW5PaUFuWW1GdVlXNWhKeXdnSjNSNWNHVW5PaUFuWm5KMWFYUW5JSDFkWEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCcGJtbDBhV0ZzS0dGeWNtRjVMQ0JqWVd4c1ltRmpheXdnZEdocGMwRnlaeWtnZTF4dUlDQWdJR2xtSUNnaFlYSnlZWGtwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJiWFR0Y2JpQWdJQ0I5WEc0Z0lDQWdkbUZ5SUc0Z1BTQXdMRnh1SUNBZ0lDQWdJQ0JzWlc1bmRHZ2dQU0JoY25KaGVTNXNaVzVuZEdnN1hHNWNiaUFnSUNCcFppQW9kSGx3Wlc5bUlHTmhiR3hpWVdOcklDRTlJQ2R1ZFcxaVpYSW5JQ1ltSUdOaGJHeGlZV05ySUNFOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUhaaGNpQnBibVJsZUNBOUlHeGxibWQwYUR0Y2JpQWdJQ0FnSUdOaGJHeGlZV05ySUQwZ1kzSmxZWFJsUTJGc2JHSmhZMnNvWTJGc2JHSmhZMnNzSUhSb2FYTkJjbWNwTzF4dUlDQWdJQ0FnZDJocGJHVWdLR2x1WkdWNExTMGdKaVlnWTJGc2JHSmhZMnNvWVhKeVlYbGJhVzVrWlhoZExDQnBibVJsZUN3Z1lYSnlZWGtwS1NCN1hHNGdJQ0FnSUNBZ0lHNHJLenRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2JpQTlJQ2hqWVd4c1ltRmpheUE5UFNCdWRXeHNJSHg4SUhSb2FYTkJjbWNwSUQ4Z01TQTZJR05oYkd4aVlXTnJJSHg4SUc0N1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnpiR2xqWlNoaGNuSmhlU3dnTUN3Z2JtRjBhWFpsVFdsdUtHNWhkR2wyWlUxaGVDZ3dMQ0JzWlc1bmRHZ2dMU0J1S1N3Z2JHVnVaM1JvS1NrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMjl0Y0hWMFpYTWdkR2hsSUdsdWRHVnljMlZqZEdsdmJpQnZaaUJoYkd3Z2RHaGxJSEJoYzNObFpDMXBiaUJoY25KaGVYTWdkWE5wYm1jZ2MzUnlhV04wSUdWeGRXRnNhWFI1WEc0Z0lDQXFJR1p2Y2lCamIyMXdZWEpwYzI5dWN5d2dhUzVsTGlCZ1BUMDlZQzVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnUVhKeVlYbHpYRzRnSUNBcUlFQndZWEpoYlNCN1FYSnlZWGw5SUZ0aGNuSmhlVEVzSUdGeWNtRjVNaXdnTGk0dVhTQkJjbkpoZVhNZ2RHOGdjSEp2WTJWemN5NWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwRnljbUY1ZlNCU1pYUjFjbTV6SUdFZ2JtVjNJR0Z5Y21GNUlHOW1JSFZ1YVhGMVpTQmxiR1Z0Wlc1MGN5QjBhR0YwSUdGeVpTQndjbVZ6Wlc1MFhHNGdJQ0FxSUNCcGJpQXFLbUZzYkNvcUlHOW1JSFJvWlNCaGNuSmhlWE11WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUY4dWFXNTBaWEp6WldOMGFXOXVLRnN4TENBeUxDQXpYU3dnV3pFd01Td2dNaXdnTVN3Z01UQmRMQ0JiTWl3Z01WMHBPMXh1SUNBZ0tpQXZMeUE5UGlCYk1Td2dNbDFjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUdsdWRHVnljMlZqZEdsdmJpaGhjbkpoZVNrZ2UxeHVJQ0FnSUhaaGNpQmhjbWR6SUQwZ1lYSm5kVzFsYm5SekxGeHVJQ0FnSUNBZ0lDQmhjbWR6VEdWdVozUm9JRDBnWVhKbmN5NXNaVzVuZEdnc1hHNGdJQ0FnSUNBZ0lHTmhZMmhsSUQwZ2V5QW5NQ2M2SUh0OUlIMHNYRzRnSUNBZ0lDQWdJR2x1WkdWNElEMGdMVEVzWEc0Z0lDQWdJQ0FnSUd4bGJtZDBhQ0E5SUdGeWNtRjVJRDhnWVhKeVlYa3ViR1Z1WjNSb0lEb2dNQ3hjYmlBZ0lDQWdJQ0FnYVhOTVlYSm5aU0E5SUd4bGJtZDBhQ0ErUFNBeE1EQXNYRzRnSUNBZ0lDQWdJSEpsYzNWc2RDQTlJRnRkTEZ4dUlDQWdJQ0FnSUNCelpXVnVJRDBnY21WemRXeDBPMXh1WEc0Z0lDQWdiM1YwWlhJNlhHNGdJQ0FnZDJocGJHVWdLQ3NyYVc1a1pYZ2dQQ0JzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJSFpoY2lCMllXeDFaU0E5SUdGeWNtRjVXMmx1WkdWNFhUdGNiaUFnSUNBZ0lHbG1JQ2hwYzB4aGNtZGxLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQnJaWGtnUFNCMllXeDFaU0FySUNjbk8xeHVJQ0FnSUNBZ0lDQjJZWElnYVc1cGRHVmtJRDBnYUdGelQzZHVVSEp2Y0dWeWRIa3VZMkZzYkNoallXTm9aVnN3WFN3Z2EyVjVLVnh1SUNBZ0lDQWdJQ0FnSUQ4Z0lTaHpaV1Z1SUQwZ1kyRmphR1ZiTUYxYmEyVjVYU2xjYmlBZ0lDQWdJQ0FnSUNBNklDaHpaV1Z1SUQwZ1kyRmphR1ZiTUYxYmEyVjVYU0E5SUZ0ZEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbG1JQ2hwYm1sMFpXUWdmSHdnYVc1a1pYaFBaaWh6WldWdUxDQjJZV3gxWlNrZ1BDQXdLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaHBjMHhoY21kbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnYzJWbGJpNXdkWE5vS0haaGJIVmxLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCMllYSWdZWEpuYzBsdVpHVjRJRDBnWVhKbmMweGxibWQwYUR0Y2JpQWdJQ0FnSUNBZ2QyaHBiR1VnS0MwdFlYSm5jMGx1WkdWNEtTQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tDRW9ZMkZqYUdWYllYSm5jMGx1WkdWNFhTQjhmQ0FvWTJGamFHVmJZWEpuYzBsdVpHVjRYU0E5SUdOaFkyaGxaRU52Ym5SaGFXNXpLR0Z5WjNOYllYSm5jMGx1WkdWNFhTd2dNQ3dnTVRBd0tTa3BLSFpoYkhWbEtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyOXVkR2x1ZFdVZ2IzVjBaWEk3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSEpsYzNWc2RDNXdkWE5vS0haaGJIVmxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUhKbGMzVnNkRHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCSFpYUnpJSFJvWlNCc1lYTjBJR1ZzWlcxbGJuUWdiMllnZEdobElHQmhjbkpoZVdBdUlFbG1JR0VnYm5WdFltVnlJR0J1WUNCcGN5QndZWE56WldRc0lIUm9aU0JzWVhOMFhHNGdJQ0FxSUdCdVlDQmxiR1Z0Wlc1MGN5QnZaaUIwYUdVZ1lHRnljbUY1WUNCaGNtVWdjbVYwZFhKdVpXUXVJRWxtSUdFZ1lHTmhiR3hpWVdOcllDQm1kVzVqZEdsdmJpQnBjeUJ3WVhOelpXUXNYRzRnSUNBcUlIUm9aU0JzWVhOMElHVnNaVzFsYm5SeklIUm9aU0JnWTJGc2JHSmhZMnRnSUhKbGRIVnlibk1nZEhKMWRHaDVJR1p2Y2lCaGNtVWdjbVYwZFhKdVpXUXVJRlJvWlNCZ1kyRnNiR0poWTJ0Z1hHNGdJQ0FxSUdseklHSnZkVzVrSUhSdklHQjBhR2x6UVhKbllDQmhibVFnYVc1MmIydGxaQ0IzYVhSb0lIUm9jbVZsSUdGeVozVnRaVzUwY3pzZ0tIWmhiSFZsTENCcGJtUmxlQ3dnWVhKeVlYa3BMbHh1SUNBZ0tseHVJQ0FnS2x4dUlDQWdLaUJKWmlCaElIQnliM0JsY25SNUlHNWhiV1VnYVhNZ2NHRnpjMlZrSUdadmNpQmdZMkZzYkdKaFkydGdMQ0IwYUdVZ1kzSmxZWFJsWkNCY0lsOHVjR3gxWTJ0Y0lpQnpkSGxzWlZ4dUlDQWdLaUJqWVd4c1ltRmpheUIzYVd4c0lISmxkSFZ5YmlCMGFHVWdjSEp2Y0dWeWRIa2dkbUZzZFdVZ2IyWWdkR2hsSUdkcGRtVnVJR1ZzWlcxbGJuUXVYRzRnSUNBcVhHNGdJQ0FxSUVsbUlHRnVJRzlpYW1WamRDQnBjeUJ3WVhOelpXUWdabTl5SUdCallXeHNZbUZqYTJBc0lIUm9aU0JqY21WaGRHVmtJRndpWHk1M2FHVnlaVndpSUhOMGVXeGxJR05oYkd4aVlXTnJYRzRnSUNBcUlIZHBiR3dnY21WMGRYSnVJR0IwY25WbFlDQm1iM0lnWld4bGJXVnVkSE1nZEdoaGRDQm9ZWFpsSUhSb1pTQndjbTl3WlhScFpYTWdiMllnZEdobElHZHBkbVZ1SUc5aWFtVmpkQ3hjYmlBZ0lDb2daV3h6WlNCZ1ptRnNjMlZnTGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCQmNuSmhlWE5jYmlBZ0lDb2dRSEJoY21GdElIdEJjbkpoZVgwZ1lYSnlZWGtnVkdobElHRnljbUY1SUhSdklIRjFaWEo1TGx4dUlDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmRTlpYW1WamRIeE9kVzFpWlhKOFUzUnlhVzVuZlNCYlkyRnNiR0poWTJ0OGJsMGdWR2hsSUdaMWJtTjBhVzl1SUdOaGJHeGxaRnh1SUNBZ0tpQWdjR1Z5SUdWc1pXMWxiblFnYjNJZ2RHaGxJRzUxYldKbGNpQnZaaUJsYkdWdFpXNTBjeUIwYnlCeVpYUjFjbTR1SUVsbUlHRWdjSEp2Y0dWeWRIa2dibUZ0WlNCdmNseHVJQ0FnS2lBZ2IySnFaV04wSUdseklIQmhjM05sWkN3Z2FYUWdkMmxzYkNCaVpTQjFjMlZrSUhSdklHTnlaV0YwWlNCaElGd2lYeTV3YkhWamExd2lJRzl5SUZ3aVh5NTNhR1Z5WlZ3aVhHNGdJQ0FxSUNCemRIbHNaU0JqWVd4c1ltRmpheXdnY21WemNHVmpkR2wyWld4NUxseHVJQ0FnS2lCQWNHRnlZVzBnZTAxcGVHVmtmU0JiZEdocGMwRnlaMTBnVkdobElHQjBhR2x6WUNCaWFXNWthVzVuSUc5bUlHQmpZV3hzWW1GamEyQXVYRzRnSUNBcUlFQnlaWFIxY201eklIdE5hWGhsWkgwZ1VtVjBkWEp1Y3lCMGFHVWdiR0Z6ZENCbGJHVnRaVzUwS0hNcElHOW1JR0JoY25KaGVXQXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJRjh1YkdGemRDaGJNU3dnTWl3Z00xMHBPMXh1SUNBZ0tpQXZMeUE5UGlBelhHNGdJQ0FxWEc0Z0lDQXFJRjh1YkdGemRDaGJNU3dnTWl3Z00xMHNJRElwTzF4dUlDQWdLaUF2THlBOVBpQmJNaXdnTTExY2JpQWdJQ3BjYmlBZ0lDb2dYeTVzWVhOMEtGc3hMQ0F5TENBelhTd2dablZ1WTNScGIyNG9iblZ0S1NCN1hHNGdJQ0FxSUNBZ2NtVjBkWEp1SUc1MWJTQStJREU3WEc0Z0lDQXFJSDBwTzF4dUlDQWdLaUF2THlBOVBpQmJNaXdnTTExY2JpQWdJQ3BjYmlBZ0lDb2dkbUZ5SUdadmIyUWdQU0JiWEc0Z0lDQXFJQ0FnZXlBbmJtRnRaU2M2SUNkaVpXVjBKeXdnSUNBbmIzSm5ZVzVwWXljNklHWmhiSE5sSUgwc1hHNGdJQ0FxSUNBZ2V5QW5ibUZ0WlNjNklDZGpZWEp5YjNRbkxDQW5iM0puWVc1cFl5YzZJSFJ5ZFdVZ2ZWeHVJQ0FnS2lCZE8xeHVJQ0FnS2x4dUlDQWdLaUF2THlCMWMybHVaeUJjSWw4dWNHeDFZMnRjSWlCallXeHNZbUZqYXlCemFHOXlkR2hoYm1SY2JpQWdJQ29nWHk1c1lYTjBLR1p2YjJRc0lDZHZjbWRoYm1sakp5azdYRzRnSUNBcUlDOHZJRDArSUZ0N0lDZHVZVzFsSnpvZ0oyTmhjbkp2ZENjc0lDZHZjbWRoYm1sakp6b2dkSEoxWlNCOVhWeHVJQ0FnS2x4dUlDQWdLaUIyWVhJZ1ptOXZaQ0E5SUZ0Y2JpQWdJQ29nSUNCN0lDZHVZVzFsSnpvZ0oySmhibUZ1WVNjc0lDZDBlWEJsSnpvZ0oyWnlkV2wwSnlCOUxGeHVJQ0FnS2lBZ0lIc2dKMjVoYldVbk9pQW5ZbVZsZENjc0lDQWdKM1I1Y0dVbk9pQW5kbVZuWlhSaFlteGxKeUI5TEZ4dUlDQWdLaUFnSUhzZ0oyNWhiV1VuT2lBblkyRnljbTkwSnl3Z0ozUjVjR1VuT2lBbmRtVm5aWFJoWW14bEp5QjlYRzRnSUNBcUlGMDdYRzRnSUNBcVhHNGdJQ0FxSUM4dklIVnphVzVuSUZ3aVh5NTNhR1Z5WlZ3aUlHTmhiR3hpWVdOcklITm9iM0owYUdGdVpGeHVJQ0FnS2lCZkxteGhjM1FvWm05dlpDd2dleUFuZEhsd1pTYzZJQ2QyWldkbGRHRmliR1VuSUgwcE8xeHVJQ0FnS2lBdkx5QTlQaUJiZXlBbmJtRnRaU2M2SUNkaVpXVjBKeXdnSjNSNWNHVW5PaUFuZG1WblpYUmhZbXhsSnlCOUxDQjdJQ2R1WVcxbEp6b2dKMk5oY25KdmRDY3NJQ2QwZVhCbEp6b2dKM1psWjJWMFlXSnNaU2NnZlYxY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlHeGhjM1FvWVhKeVlYa3NJR05oYkd4aVlXTnJMQ0IwYUdselFYSm5LU0I3WEc0Z0lDQWdhV1lnS0dGeWNtRjVLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2JpQTlJREFzWEc0Z0lDQWdJQ0FnSUNBZ2JHVnVaM1JvSUQwZ1lYSnlZWGt1YkdWdVozUm9PMXh1WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUdOaGJHeGlZV05ySUNFOUlDZHVkVzFpWlhJbklDWW1JR05oYkd4aVlXTnJJQ0U5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlHbHVaR1Y0SUQwZ2JHVnVaM1JvTzF4dUlDQWdJQ0FnSUNCallXeHNZbUZqYXlBOUlHTnlaV0YwWlVOaGJHeGlZV05yS0dOaGJHeGlZV05yTENCMGFHbHpRWEpuS1R0Y2JpQWdJQ0FnSUNBZ2QyaHBiR1VnS0dsdVpHVjRMUzBnSmlZZ1kyRnNiR0poWTJzb1lYSnlZWGxiYVc1a1pYaGRMQ0JwYm1SbGVDd2dZWEp5WVhrcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnYmlzck8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQnVJRDBnWTJGc2JHSmhZMnM3WEc0Z0lDQWdJQ0FnSUdsbUlDaHVJRDA5SUc1MWJHd2dmSHdnZEdocGMwRnlaeWtnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCaGNuSmhlVnRzWlc1bmRHZ2dMU0F4WFR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOc2FXTmxLR0Z5Y21GNUxDQnVZWFJwZG1WTllYZ29NQ3dnYkdWdVozUm9JQzBnYmlrcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkhaWFJ6SUhSb1pTQnBibVJsZUNCaGRDQjNhR2xqYUNCMGFHVWdiR0Z6ZENCdlkyTjFjbkpsYm1ObElHOW1JR0IyWVd4MVpXQWdhWE1nWm05MWJtUWdkWE5wYm1jZ2MzUnlhV04wWEc0Z0lDQXFJR1Z4ZFdGc2FYUjVJR1p2Y2lCamIyMXdZWEpwYzI5dWN5d2dhUzVsTGlCZ1BUMDlZQzRnU1dZZ1lHWnliMjFKYm1SbGVHQWdhWE1nYm1WbllYUnBkbVVzSUdsMElHbHpJSFZ6WldSY2JpQWdJQ29nWVhNZ2RHaGxJRzltWm5ObGRDQm1jbTl0SUhSb1pTQmxibVFnYjJZZ2RHaGxJR052Ykd4bFkzUnBiMjR1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUVGeWNtRjVjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwRnljbUY1ZlNCaGNuSmhlU0JVYUdVZ1lYSnlZWGtnZEc4Z2MyVmhjbU5vTGx4dUlDQWdLaUJBY0dGeVlXMGdlMDFwZUdWa2ZTQjJZV3gxWlNCVWFHVWdkbUZzZFdVZ2RHOGdjMlZoY21Ob0lHWnZjaTVjYmlBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlGdG1jbTl0U1c1a1pYZzlZWEp5WVhrdWJHVnVaM1JvTFRGZElGUm9aU0JwYm1SbGVDQjBieUJ6WldGeVkyZ2dabkp2YlM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTA1MWJXSmxjbjBnVW1WMGRYSnVjeUIwYUdVZ2FXNWtaWGdnYjJZZ2RHaGxJRzFoZEdOb1pXUWdkbUZzZFdVZ2IzSWdZQzB4WUM1Y2JpQWdJQ29nUUdWNFlXMXdiR1ZjYmlBZ0lDcGNiaUFnSUNvZ1h5NXNZWE4wU1c1a1pYaFBaaWhiTVN3Z01pd2dNeXdnTVN3Z01pd2dNMTBzSURJcE8xeHVJQ0FnS2lBdkx5QTlQaUEwWEc0Z0lDQXFYRzRnSUNBcUlGOHViR0Z6ZEVsdVpHVjRUMllvV3pFc0lESXNJRE1zSURFc0lESXNJRE5kTENBeUxDQXpLVHRjYmlBZ0lDb2dMeThnUFQ0Z01WeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdiR0Z6ZEVsdVpHVjRUMllvWVhKeVlYa3NJSFpoYkhWbExDQm1jbTl0U1c1a1pYZ3BJSHRjYmlBZ0lDQjJZWElnYVc1a1pYZ2dQU0JoY25KaGVTQS9JR0Z5Y21GNUxteGxibWQwYUNBNklEQTdYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQm1jbTl0U1c1a1pYZ2dQVDBnSjI1MWJXSmxjaWNwSUh0Y2JpQWdJQ0FnSUdsdVpHVjRJRDBnS0daeWIyMUpibVJsZUNBOElEQWdQeUJ1WVhScGRtVk5ZWGdvTUN3Z2FXNWtaWGdnS3lCbWNtOXRTVzVrWlhncElEb2dibUYwYVhabFRXbHVLR1p5YjIxSmJtUmxlQ3dnYVc1a1pYZ2dMU0F4S1NrZ0t5QXhPMXh1SUNBZ0lIMWNiaUFnSUNCM2FHbHNaU0FvYVc1a1pYZ3RMU2tnZTF4dUlDQWdJQ0FnYVdZZ0tHRnljbUY1VzJsdVpHVjRYU0E5UFQwZ2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdsdVpHVjRPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnTFRFN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRM0psWVhSbGN5QmhiaUJ2WW1wbFkzUWdZMjl0Y0c5elpXUWdabkp2YlNCaGNuSmhlWE1nYjJZZ1lHdGxlWE5nSUdGdVpDQmdkbUZzZFdWellDNGdVR0Z6Y3lCbGFYUm9aWEpjYmlBZ0lDb2dZU0J6YVc1bmJHVWdkSGR2SUdScGJXVnVjMmx2Ym1Gc0lHRnljbUY1TENCcExtVXVJR0JiVzJ0bGVURXNJSFpoYkhWbE1WMHNJRnRyWlhreUxDQjJZV3gxWlRKZFhXQXNJRzl5WEc0Z0lDQXFJSFIzYnlCaGNuSmhlWE1zSUc5dVpTQnZaaUJnYTJWNWMyQWdZVzVrSUc5dVpTQnZaaUJqYjNKeVpYTndiMjVrYVc1bklHQjJZV3gxWlhOZ0xseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQkJjbkpoZVhOY2JpQWdJQ29nUUhCaGNtRnRJSHRCY25KaGVYMGdhMlY1Y3lCVWFHVWdZWEp5WVhrZ2IyWWdhMlY1Y3k1Y2JpQWdJQ29nUUhCaGNtRnRJSHRCY25KaGVYMGdXM1poYkhWbGN6MWJYVjBnVkdobElHRnljbUY1SUc5bUlIWmhiSFZsY3k1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTA5aWFtVmpkSDBnVW1WMGRYSnVjeUJoYmlCdlltcGxZM1FnWTI5dGNHOXpaV1FnYjJZZ2RHaGxJR2RwZG1WdUlHdGxlWE1nWVc1a1hHNGdJQ0FxSUNCamIzSnlaWE53YjI1a2FXNW5JSFpoYkhWbGN5NWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dYeTV2WW1wbFkzUW9XeWR0YjJVbkxDQW5iR0Z5Y25rblhTd2dXek13TENBME1GMHBPMXh1SUNBZ0tpQXZMeUE5UGlCN0lDZHRiMlVuT2lBek1Dd2dKMnhoY25KNUp6b2dOREFnZlZ4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z2IySnFaV04wS0d0bGVYTXNJSFpoYkhWbGN5a2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJQzB4TEZ4dUlDQWdJQ0FnSUNCc1pXNW5kR2dnUFNCclpYbHpJRDhnYTJWNWN5NXNaVzVuZEdnZ09pQXdMRnh1SUNBZ0lDQWdJQ0J5WlhOMWJIUWdQU0I3ZlR0Y2JseHVJQ0FnSUhkb2FXeGxJQ2dySzJsdVpHVjRJRHdnYkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0IyWVhJZ2EyVjVJRDBnYTJWNWMxdHBibVJsZUYwN1hHNGdJQ0FnSUNCcFppQW9kbUZzZFdWektTQjdYRzRnSUNBZ0lDQWdJSEpsYzNWc2RGdHJaWGxkSUQwZ2RtRnNkV1Z6VzJsdVpHVjRYVHRjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJSEpsYzNWc2RGdHJaWGxiTUYxZElEMGdhMlY1V3pGZE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4ME8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU55WldGMFpYTWdZVzRnWVhKeVlYa2diMllnYm5WdFltVnljeUFvY0c5emFYUnBkbVVnWVc1a0wyOXlJRzVsWjJGMGFYWmxLU0J3Y205bmNtVnpjMmx1WnlCbWNtOXRYRzRnSUNBcUlHQnpkR0Z5ZEdBZ2RYQWdkRzhnWW5WMElHNXZkQ0JwYm1Oc2RXUnBibWNnWUdWdVpHQXVYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRR05oZEdWbmIzSjVJRUZ5Y21GNWMxeHVJQ0FnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnVzNOMFlYSjBQVEJkSUZSb1pTQnpkR0Z5ZENCdlppQjBhR1VnY21GdVoyVXVYRzRnSUNBcUlFQndZWEpoYlNCN1RuVnRZbVZ5ZlNCbGJtUWdWR2hsSUdWdVpDQnZaaUIwYUdVZ2NtRnVaMlV1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUblZ0WW1WeWZTQmJjM1JsY0QweFhTQlVhR1VnZG1Gc2RXVWdkRzhnYVc1amNtVnRaVzUwSUc5eUlHUmxjMk55WlcxbGJuUWdZbmt1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHRCY25KaGVYMGdVbVYwZFhKdWN5QmhJRzVsZHlCeVlXNW5aU0JoY25KaGVTNWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dYeTV5WVc1blpTZ3hNQ2s3WEc0Z0lDQXFJQzh2SUQwK0lGc3dMQ0F4TENBeUxDQXpMQ0EwTENBMUxDQTJMQ0EzTENBNExDQTVYVnh1SUNBZ0tseHVJQ0FnS2lCZkxuSmhibWRsS0RFc0lERXhLVHRjYmlBZ0lDb2dMeThnUFQ0Z1d6RXNJRElzSURNc0lEUXNJRFVzSURZc0lEY3NJRGdzSURrc0lERXdYVnh1SUNBZ0tseHVJQ0FnS2lCZkxuSmhibWRsS0RBc0lETXdMQ0ExS1R0Y2JpQWdJQ29nTHk4Z1BUNGdXekFzSURVc0lERXdMQ0F4TlN3Z01qQXNJREkxWFZ4dUlDQWdLbHh1SUNBZ0tpQmZMbkpoYm1kbEtEQXNJQzB4TUN3Z0xURXBPMXh1SUNBZ0tpQXZMeUE5UGlCYk1Dd2dMVEVzSUMweUxDQXRNeXdnTFRRc0lDMDFMQ0F0Tml3Z0xUY3NJQzA0TENBdE9WMWNiaUFnSUNwY2JpQWdJQ29nWHk1eVlXNW5aU2d3S1R0Y2JpQWdJQ29nTHk4Z1BUNGdXMTFjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUhKaGJtZGxLSE4wWVhKMExDQmxibVFzSUhOMFpYQXBJSHRjYmlBZ0lDQnpkR0Z5ZENBOUlDdHpkR0Z5ZENCOGZDQXdPMXh1SUNBZ0lITjBaWEFnUFNBcmMzUmxjQ0I4ZkNBeE8xeHVYRzRnSUNBZ2FXWWdLR1Z1WkNBOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNCbGJtUWdQU0J6ZEdGeWREdGNiaUFnSUNBZ0lITjBZWEowSUQwZ01EdGNiaUFnSUNCOVhHNGdJQ0FnTHk4Z2RYTmxJR0JCY25KaGVTaHNaVzVuZEdncFlDQnpieUJXT0NCM2FXeHNJR0YyYjJsa0lIUm9aU0J6Ykc5M1pYSWdYQ0prYVdOMGFXOXVZWEo1WENJZ2JXOWtaVnh1SUNBZ0lDOHZJR2gwZEhBNkx5OTViM1YwZFM1aVpTOVlRWEZKY0VkVk9GcGFheU4wUFRFM2JUSTFjMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJQzB4TEZ4dUlDQWdJQ0FnSUNCc1pXNW5kR2dnUFNCdVlYUnBkbVZOWVhnb01Dd2dZMlZwYkNnb1pXNWtJQzBnYzNSaGNuUXBJQzhnYzNSbGNDa3BMRnh1SUNBZ0lDQWdJQ0J5WlhOMWJIUWdQU0JCY25KaGVTaHNaVzVuZEdncE8xeHVYRzRnSUNBZ2QyaHBiR1VnS0NzcmFXNWtaWGdnUENCc1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUhKbGMzVnNkRnRwYm1SbGVGMGdQU0J6ZEdGeWREdGNiaUFnSUNBZ0lITjBZWEowSUNzOUlITjBaWEE3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1ZHaGxJRzl3Y0c5emFYUmxJRzltSUdCZkxtbHVhWFJwWVd4Z0xDQjBhR2x6SUcxbGRHaHZaQ0JuWlhSeklHRnNiQ0JpZFhRZ2RHaGxJR1pwY25OMElIWmhiSFZsSUc5bUlHQmhjbkpoZVdBdVhHNGdJQ0FxSUVsbUlHRWdiblZ0WW1WeUlHQnVZQ0JwY3lCd1lYTnpaV1FzSUhSb1pTQm1hWEp6ZENCZ2JtQWdkbUZzZFdWeklHRnlaU0JsZUdOc2RXUmxaQ0JtY205dElIUm9aU0J5WlhOMWJIUXVYRzRnSUNBcUlFbG1JR0VnWUdOaGJHeGlZV05yWUNCbWRXNWpkR2x2YmlCcGN5QndZWE56WldRc0lIUm9aU0JtYVhKemRDQmxiR1Z0Wlc1MGN5QjBhR1VnWUdOaGJHeGlZV05yWUNCeVpYUjFjbTV6WEc0Z0lDQXFJSFJ5ZFhSb2VTQm1iM0lnWVhKbElHVjRZMngxWkdWa0lHWnliMjBnZEdobElISmxjM1ZzZEM0Z1ZHaGxJR0JqWVd4c1ltRmphMkFnYVhNZ1ltOTFibVFnZEc4Z1lIUm9hWE5CY21kZ1hHNGdJQ0FxSUdGdVpDQnBiblp2YTJWa0lIZHBkR2dnZEdoeVpXVWdZWEpuZFcxbGJuUnpPeUFvZG1Gc2RXVXNJR2x1WkdWNExDQmhjbkpoZVNrdVhHNGdJQ0FxWEc0Z0lDQXFJRWxtSUdFZ2NISnZjR1Z5ZEhrZ2JtRnRaU0JwY3lCd1lYTnpaV1FnWm05eUlHQmpZV3hzWW1GamEyQXNJSFJvWlNCamNtVmhkR1ZrSUZ3aVh5NXdiSFZqYTF3aUlITjBlV3hsWEc0Z0lDQXFJR05oYkd4aVlXTnJJSGRwYkd3Z2NtVjBkWEp1SUhSb1pTQndjbTl3WlhKMGVTQjJZV3gxWlNCdlppQjBhR1VnWjJsMlpXNGdaV3hsYldWdWRDNWNiaUFnSUNwY2JpQWdJQ29nU1dZZ1lXNGdiMkpxWldOMElHbHpJSEJoYzNObFpDQm1iM0lnWUdOaGJHeGlZV05yWUN3Z2RHaGxJR055WldGMFpXUWdYQ0pmTG5kb1pYSmxYQ0lnYzNSNWJHVWdZMkZzYkdKaFkydGNiaUFnSUNvZ2QybHNiQ0J5WlhSMWNtNGdZSFJ5ZFdWZ0lHWnZjaUJsYkdWdFpXNTBjeUIwYUdGMElHaGhkbVVnZEdobElIQnliM0JsZEdsbGN5QnZaaUIwYUdVZ1oybDJaVzRnYjJKcVpXTjBMRnh1SUNBZ0tpQmxiSE5sSUdCbVlXeHpaV0F1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdGc2FXRnpJR1J5YjNBc0lIUmhhV3hjYmlBZ0lDb2dRR05oZEdWbmIzSjVJRUZ5Y21GNWMxeHVJQ0FnS2lCQWNHRnlZVzBnZTBGeWNtRjVmU0JoY25KaGVTQlVhR1VnWVhKeVlYa2dkRzhnY1hWbGNua3VYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OFQySnFaV04wZkU1MWJXSmxjbnhUZEhKcGJtZDlJRnRqWVd4c1ltRmphM3h1UFRGZElGUm9aU0JtZFc1amRHbHZiaUJqWVd4c1pXUmNiaUFnSUNvZ0lIQmxjaUJsYkdWdFpXNTBJRzl5SUhSb1pTQnVkVzFpWlhJZ2IyWWdaV3hsYldWdWRITWdkRzhnWlhoamJIVmtaUzRnU1dZZ1lTQndjbTl3WlhKMGVTQnVZVzFsSUc5eVhHNGdJQ0FxSUNCdlltcGxZM1FnYVhNZ2NHRnpjMlZrTENCcGRDQjNhV3hzSUdKbElIVnpaV1FnZEc4Z1kzSmxZWFJsSUdFZ1hDSmZMbkJzZFdOclhDSWdiM0lnWENKZkxuZG9aWEpsWENKY2JpQWdJQ29nSUhOMGVXeGxJR05oYkd4aVlXTnJMQ0J5WlhOd1pXTjBhWFpsYkhrdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VFdsNFpXUjlJRnQwYUdselFYSm5YU0JVYUdVZ1lIUm9hWE5nSUdKcGJtUnBibWNnYjJZZ1lHTmhiR3hpWVdOcllDNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwRnljbUY1ZlNCU1pYUjFjbTV6SUdFZ2MyeHBZMlVnYjJZZ1lHRnljbUY1WUM1Y2JpQWdJQ29nUUdWNFlXMXdiR1ZjYmlBZ0lDcGNiaUFnSUNvZ1h5NXlaWE4wS0ZzeExDQXlMQ0F6WFNrN1hHNGdJQ0FxSUM4dklEMCtJRnN5TENBelhWeHVJQ0FnS2x4dUlDQWdLaUJmTG5KbGMzUW9XekVzSURJc0lETmRMQ0F5S1R0Y2JpQWdJQ29nTHk4Z1BUNGdXek5kWEc0Z0lDQXFYRzRnSUNBcUlGOHVjbVZ6ZENoYk1Td2dNaXdnTTEwc0lHWjFibU4wYVc5dUtHNTFiU2tnZTF4dUlDQWdLaUFnSUhKbGRIVnliaUJ1ZFcwZ1BDQXpPMXh1SUNBZ0tpQjlLVHRjYmlBZ0lDb2dMeThnUFQ0Z1d6TmRYRzRnSUNBcVhHNGdJQ0FxSUhaaGNpQm1iMjlrSUQwZ1cxeHVJQ0FnS2lBZ0lIc2dKMjVoYldVbk9pQW5ZbUZ1WVc1aEp5d2dKMjl5WjJGdWFXTW5PaUIwY25WbElIMHNYRzRnSUNBcUlDQWdleUFuYm1GdFpTYzZJQ2RpWldWMEp5d2dJQ0FuYjNKbllXNXBZeWM2SUdaaGJITmxJSDBzWEc0Z0lDQXFJRjA3WEc0Z0lDQXFYRzRnSUNBcUlDOHZJSFZ6YVc1bklGd2lYeTV3YkhWamExd2lJR05oYkd4aVlXTnJJSE5vYjNKMGFHRnVaRnh1SUNBZ0tpQmZMbkpsYzNRb1ptOXZaQ3dnSjI5eVoyRnVhV01uS1R0Y2JpQWdJQ29nTHk4Z1BUNGdXM3NnSjI1aGJXVW5PaUFuWW1WbGRDY3NJQ2R2Y21kaGJtbGpKem9nWm1Gc2MyVWdmVjFjYmlBZ0lDcGNiaUFnSUNvZ2RtRnlJR1p2YjJRZ1BTQmJYRzRnSUNBcUlDQWdleUFuYm1GdFpTYzZJQ2RoY0hCc1pTY3NJQ0FuZEhsd1pTYzZJQ2RtY25WcGRDY2dmU3hjYmlBZ0lDb2dJQ0I3SUNkdVlXMWxKem9nSjJKaGJtRnVZU2NzSUNkMGVYQmxKem9nSjJaeWRXbDBKeUI5TEZ4dUlDQWdLaUFnSUhzZ0oyNWhiV1VuT2lBblltVmxkQ2NzSUNBZ0ozUjVjR1VuT2lBbmRtVm5aWFJoWW14bEp5QjlYRzRnSUNBcUlGMDdYRzRnSUNBcVhHNGdJQ0FxSUM4dklIVnphVzVuSUZ3aVh5NTNhR1Z5WlZ3aUlHTmhiR3hpWVdOcklITm9iM0owYUdGdVpGeHVJQ0FnS2lCZkxuSmxjM1FvWm05dlpDd2dleUFuZEhsd1pTYzZJQ2RtY25WcGRDY2dmU2s3WEc0Z0lDQXFJQzh2SUQwK0lGdDdJQ2R1WVcxbEp6b2dKMkpsWlhRbkxDQW5kSGx3WlNjNklDZDJaV2RsZEdGaWJHVW5JSDFkWEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCeVpYTjBLR0Z5Y21GNUxDQmpZV3hzWW1GamF5d2dkR2hwYzBGeVp5a2dlMXh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdZMkZzYkdKaFkyc2dJVDBnSjI1MWJXSmxjaWNnSmlZZ1kyRnNiR0poWTJzZ0lUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2RtRnlJRzRnUFNBd0xGeHVJQ0FnSUNBZ0lDQWdJR2x1WkdWNElEMGdMVEVzWEc0Z0lDQWdJQ0FnSUNBZ2JHVnVaM1JvSUQwZ1lYSnlZWGtnUHlCaGNuSmhlUzVzWlc1bmRHZ2dPaUF3TzF4dVhHNGdJQ0FnSUNCallXeHNZbUZqYXlBOUlHTnlaV0YwWlVOaGJHeGlZV05yS0dOaGJHeGlZV05yTENCMGFHbHpRWEpuS1R0Y2JpQWdJQ0FnSUhkb2FXeGxJQ2dySzJsdVpHVjRJRHdnYkdWdVozUm9JQ1ltSUdOaGJHeGlZV05yS0dGeWNtRjVXMmx1WkdWNFhTd2dhVzVrWlhnc0lHRnljbUY1S1NrZ2UxeHVJQ0FnSUNBZ0lDQnVLeXM3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHNGdQU0FvWTJGc2JHSmhZMnNnUFQwZ2JuVnNiQ0I4ZkNCMGFHbHpRWEpuS1NBL0lERWdPaUJ1WVhScGRtVk5ZWGdvTUN3Z1kyRnNiR0poWTJzcE8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdjMnhwWTJVb1lYSnlZWGtzSUc0cE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRlZ6WlhNZ1lTQmlhVzVoY25rZ2MyVmhjbU5vSUhSdklHUmxkR1Z5YldsdVpTQjBhR1VnYzIxaGJHeGxjM1FnYVc1a1pYZ2dZWFFnZDJocFkyZ2dkR2hsSUdCMllXeDFaV0JjYmlBZ0lDb2djMmh2ZFd4a0lHSmxJR2x1YzJWeWRHVmtJR2x1ZEc4Z1lHRnljbUY1WUNCcGJpQnZjbVJsY2lCMGJ5QnRZV2x1ZEdGcGJpQjBhR1VnYzI5eWRDQnZjbVJsY2lCdlppQjBhR1ZjYmlBZ0lDb2djMjl5ZEdWa0lHQmhjbkpoZVdBdUlFbG1JR0JqWVd4c1ltRmphMkFnYVhNZ2NHRnpjMlZrTENCcGRDQjNhV3hzSUdKbElHVjRaV04xZEdWa0lHWnZjaUJnZG1Gc2RXVmdJR0Z1WkZ4dUlDQWdLaUJsWVdOb0lHVnNaVzFsYm5RZ2FXNGdZR0Z5Y21GNVlDQjBieUJqYjIxd2RYUmxJSFJvWldseUlITnZjblFnY21GdWEybHVaeTRnVkdobElHQmpZV3hzWW1GamEyQWdhWE5jYmlBZ0lDb2dZbTkxYm1RZ2RHOGdZSFJvYVhOQmNtZGdJR0Z1WkNCcGJuWnZhMlZrSUhkcGRHZ2diMjVsSUdGeVozVnRaVzUwT3lBb2RtRnNkV1VwTGx4dUlDQWdLbHh1SUNBZ0tpQkpaaUJoSUhCeWIzQmxjblI1SUc1aGJXVWdhWE1nY0dGemMyVmtJR1p2Y2lCZ1kyRnNiR0poWTJ0Z0xDQjBhR1VnWTNKbFlYUmxaQ0JjSWw4dWNHeDFZMnRjSWlCemRIbHNaVnh1SUNBZ0tpQmpZV3hzWW1GamF5QjNhV3hzSUhKbGRIVnliaUIwYUdVZ2NISnZjR1Z5ZEhrZ2RtRnNkV1VnYjJZZ2RHaGxJR2RwZG1WdUlHVnNaVzFsYm5RdVhHNGdJQ0FxWEc0Z0lDQXFJRWxtSUdGdUlHOWlhbVZqZENCcGN5QndZWE56WldRZ1ptOXlJR0JqWVd4c1ltRmphMkFzSUhSb1pTQmpjbVZoZEdWa0lGd2lYeTUzYUdWeVpWd2lJSE4wZVd4bElHTmhiR3hpWVdOclhHNGdJQ0FxSUhkcGJHd2djbVYwZFhKdUlHQjBjblZsWUNCbWIzSWdaV3hsYldWdWRITWdkR2hoZENCb1lYWmxJSFJvWlNCd2NtOXdaWFJwWlhNZ2IyWWdkR2hsSUdkcGRtVnVJRzlpYW1WamRDeGNiaUFnSUNvZ1pXeHpaU0JnWm1Gc2MyVmdMbHh1SUNBZ0tseHVJQ0FnS2lCQWMzUmhkR2xqWEc0Z0lDQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JCY25KaGVYTmNiaUFnSUNvZ1FIQmhjbUZ0SUh0QmNuSmhlWDBnWVhKeVlYa2dWR2hsSUdGeWNtRjVJSFJ2SUdsMFpYSmhkR1VnYjNabGNpNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0TmFYaGxaSDBnZG1Gc2RXVWdWR2hsSUhaaGJIVmxJSFJ2SUdWMllXeDFZWFJsTGx4dUlDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmRTlpYW1WamRIeFRkSEpwYm1kOUlGdGpZV3hzWW1GamF6MXBaR1Z1ZEdsMGVWMGdWR2hsSUdaMWJtTjBhVzl1SUdOaGJHeGxaQ0J3WlhKY2JpQWdJQ29nSUdsMFpYSmhkR2x2Ymk0Z1NXWWdZU0J3Y205d1pYSjBlU0J1WVcxbElHOXlJRzlpYW1WamRDQnBjeUJ3WVhOelpXUXNJR2wwSUhkcGJHd2dZbVVnZFhObFpDQjBieUJqY21WaGRHVmNiaUFnSUNvZ0lHRWdYQ0pmTG5Cc2RXTnJYQ0lnYjNJZ1hDSmZMbmRvWlhKbFhDSWdjM1I1YkdVZ1kyRnNiR0poWTJzc0lISmxjM0JsWTNScGRtVnNlUzVjYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ1czUm9hWE5CY21kZElGUm9aU0JnZEdocGMyQWdZbWx1WkdsdVp5QnZaaUJnWTJGc2JHSmhZMnRnTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3VG5WdFltVnlmU0JTWlhSMWNtNXpJSFJvWlNCcGJtUmxlQ0JoZENCM2FHbGphQ0IwYUdVZ2RtRnNkV1VnYzJodmRXeGtJR0psSUdsdWMyVnlkR1ZrWEc0Z0lDQXFJQ0JwYm5SdklHQmhjbkpoZVdBdVhHNGdJQ0FxSUVCbGVHRnRjR3hsWEc0Z0lDQXFYRzRnSUNBcUlGOHVjMjl5ZEdWa1NXNWtaWGdvV3pJd0xDQXpNQ3dnTlRCZExDQTBNQ2s3WEc0Z0lDQXFJQzh2SUQwK0lESmNiaUFnSUNwY2JpQWdJQ29nTHk4Z2RYTnBibWNnWENKZkxuQnNkV05yWENJZ1kyRnNiR0poWTJzZ2MyaHZjblJvWVc1a1hHNGdJQ0FxSUY4dWMyOXlkR1ZrU1c1a1pYZ29XM3NnSjNnbk9pQXlNQ0I5TENCN0lDZDRKem9nTXpBZ2ZTd2dleUFuZUNjNklEVXdJSDFkTENCN0lDZDRKem9nTkRBZ2ZTd2dKM2duS1R0Y2JpQWdJQ29nTHk4Z1BUNGdNbHh1SUNBZ0tseHVJQ0FnS2lCMllYSWdaR2xqZENBOUlIdGNiaUFnSUNvZ0lDQW5kMjl5WkZSdlRuVnRZbVZ5SnpvZ2V5QW5kSGRsYm5SNUp6b2dNakFzSUNkMGFHbHlkSGtuT2lBek1Dd2dKMlp2ZFhKMGVTYzZJRFF3TENBblptbG1kSGtuT2lBMU1DQjlYRzRnSUNBcUlIMDdYRzRnSUNBcVhHNGdJQ0FxSUY4dWMyOXlkR1ZrU1c1a1pYZ29XeWQwZDJWdWRIa25MQ0FuZEdocGNuUjVKeXdnSjJacFpuUjVKMTBzSUNkbWIzVnlkSGtuTENCbWRXNWpkR2x2YmloM2IzSmtLU0I3WEc0Z0lDQXFJQ0FnY21WMGRYSnVJR1JwWTNRdWQyOXlaRlJ2VG5WdFltVnlXM2R2Y21SZE8xeHVJQ0FnS2lCOUtUdGNiaUFnSUNvZ0x5OGdQVDRnTWx4dUlDQWdLbHh1SUNBZ0tpQmZMbk52Y25SbFpFbHVaR1Y0S0ZzbmRIZGxiblI1Snl3Z0ozUm9hWEowZVNjc0lDZG1hV1owZVNkZExDQW5abTkxY25SNUp5d2dablZ1WTNScGIyNG9kMjl5WkNrZ2UxeHVJQ0FnS2lBZ0lISmxkSFZ5YmlCMGFHbHpMbmR2Y21SVWIwNTFiV0psY2x0M2IzSmtYVHRjYmlBZ0lDb2dmU3dnWkdsamRDazdYRzRnSUNBcUlDOHZJRDArSURKY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlITnZjblJsWkVsdVpHVjRLR0Z5Y21GNUxDQjJZV3gxWlN3Z1kyRnNiR0poWTJzc0lIUm9hWE5CY21jcElIdGNiaUFnSUNCMllYSWdiRzkzSUQwZ01DeGNiaUFnSUNBZ0lDQWdhR2xuYUNBOUlHRnljbUY1SUQ4Z1lYSnlZWGt1YkdWdVozUm9JRG9nYkc5M08xeHVYRzRnSUNBZ0x5OGdaWGh3YkdsamFYUnNlU0J5WldabGNtVnVZMlVnWUdsa1pXNTBhWFI1WUNCbWIzSWdZbVYwZEdWeUlHbHViR2x1YVc1bklHbHVJRVpwY21WbWIzaGNiaUFnSUNCallXeHNZbUZqYXlBOUlHTmhiR3hpWVdOcklEOGdZM0psWVhSbFEyRnNiR0poWTJzb1kyRnNiR0poWTJzc0lIUm9hWE5CY21jc0lERXBJRG9nYVdSbGJuUnBkSGs3WEc0Z0lDQWdkbUZzZFdVZ1BTQmpZV3hzWW1GamF5aDJZV3gxWlNrN1hHNWNiaUFnSUNCM2FHbHNaU0FvYkc5M0lEd2dhR2xuYUNrZ2UxeHVJQ0FnSUNBZ2RtRnlJRzFwWkNBOUlDaHNiM2NnS3lCb2FXZG9LU0ErUGo0Z01UdGNiaUFnSUNBZ0lHTmhiR3hpWVdOcktHRnljbUY1VzIxcFpGMHBJRHdnZG1Gc2RXVmNiaUFnSUNBZ0lDQWdQeUJzYjNjZ1BTQnRhV1FnS3lBeFhHNGdJQ0FnSUNBZ0lEb2dhR2xuYUNBOUlHMXBaRHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUd4dmR6dGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJEYjIxd2RYUmxjeUIwYUdVZ2RXNXBiMjRnYjJZZ2RHaGxJSEJoYzNObFpDMXBiaUJoY25KaGVYTWdkWE5wYm1jZ2MzUnlhV04wSUdWeGRXRnNhWFI1SUdadmNseHVJQ0FnS2lCamIyMXdZWEpwYzI5dWN5d2dhUzVsTGlCZ1BUMDlZQzVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnUVhKeVlYbHpYRzRnSUNBcUlFQndZWEpoYlNCN1FYSnlZWGw5SUZ0aGNuSmhlVEVzSUdGeWNtRjVNaXdnTGk0dVhTQkJjbkpoZVhNZ2RHOGdjSEp2WTJWemN5NWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwRnljbUY1ZlNCU1pYUjFjbTV6SUdFZ2JtVjNJR0Z5Y21GNUlHOW1JSFZ1YVhGMVpTQjJZV3gxWlhNc0lHbHVJRzl5WkdWeUxDQjBhR0YwSUdGeVpWeHVJQ0FnS2lBZ2NISmxjMlZ1ZENCcGJpQnZibVVnYjNJZ2JXOXlaU0J2WmlCMGFHVWdZWEp5WVhsekxseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQmZMblZ1YVc5dUtGc3hMQ0F5TENBelhTd2dXekV3TVN3Z01pd2dNU3dnTVRCZExDQmJNaXdnTVYwcE8xeHVJQ0FnS2lBdkx5QTlQaUJiTVN3Z01pd2dNeXdnTVRBeExDQXhNRjFjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUhWdWFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjFibWx4S0dOdmJtTmhkQzVoY0hCc2VTaGhjbkpoZVZKbFppd2dZWEpuZFcxbGJuUnpLU2s3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1EzSmxZWFJsY3lCaElHUjFjR3hwWTJGMFpTMTJZV3gxWlMxbWNtVmxJSFpsY25OcGIyNGdiMllnZEdobElHQmhjbkpoZVdBZ2RYTnBibWNnYzNSeWFXTjBJR1Z4ZFdGc2FYUjVYRzRnSUNBcUlHWnZjaUJqYjIxd1lYSnBjMjl1Y3l3Z2FTNWxMaUJnUFQwOVlDNGdTV1lnZEdobElHQmhjbkpoZVdBZ2FYTWdZV3h5WldGa2VTQnpiM0owWldRc0lIQmhjM05wYm1jZ1lIUnlkV1ZnWEc0Z0lDQXFJR1p2Y2lCZ2FYTlRiM0owWldSZ0lIZHBiR3dnY25WdUlHRWdabUZ6ZEdWeUlHRnNaMjl5YVhSb2JTNGdTV1lnWUdOaGJHeGlZV05yWUNCcGN5QndZWE56WldRc0lHVmhZMmhjYmlBZ0lDb2daV3hsYldWdWRDQnZaaUJnWVhKeVlYbGdJR2x6SUhCaGMzTmxaQ0IwYUhKdmRXZG9JR0VnWTJGc2JHSmhZMnRnSUdKbFptOXlaU0IxYm1seGRXVnVaWE56SUdseklHTnZiWEIxZEdWa0xseHVJQ0FnS2lCVWFHVWdZR05oYkd4aVlXTnJZQ0JwY3lCaWIzVnVaQ0IwYnlCZ2RHaHBjMEZ5WjJBZ1lXNWtJR2x1ZG05clpXUWdkMmwwYUNCMGFISmxaU0JoY21kMWJXVnVkSE03SUNoMllXeDFaU3dnYVc1a1pYZ3NJR0Z5Y21GNUtTNWNiaUFnSUNwY2JpQWdJQ29nU1dZZ1lTQndjbTl3WlhKMGVTQnVZVzFsSUdseklIQmhjM05sWkNCbWIzSWdZR05oYkd4aVlXTnJZQ3dnZEdobElHTnlaV0YwWldRZ1hDSmZMbkJzZFdOclhDSWdjM1I1YkdWY2JpQWdJQ29nWTJGc2JHSmhZMnNnZDJsc2JDQnlaWFIxY200Z2RHaGxJSEJ5YjNCbGNuUjVJSFpoYkhWbElHOW1JSFJvWlNCbmFYWmxiaUJsYkdWdFpXNTBMbHh1SUNBZ0tseHVJQ0FnS2lCSlppQmhiaUJ2WW1wbFkzUWdhWE1nY0dGemMyVmtJR1p2Y2lCZ1kyRnNiR0poWTJ0Z0xDQjBhR1VnWTNKbFlYUmxaQ0JjSWw4dWQyaGxjbVZjSWlCemRIbHNaU0JqWVd4c1ltRmphMXh1SUNBZ0tpQjNhV3hzSUhKbGRIVnliaUJnZEhKMVpXQWdabTl5SUdWc1pXMWxiblJ6SUhSb1lYUWdhR0YyWlNCMGFHVWdjSEp2Y0dWMGFXVnpJRzltSUhSb1pTQm5hWFpsYmlCdlltcGxZM1FzWEc0Z0lDQXFJR1ZzYzJVZ1lHWmhiSE5sWUM1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVlXeHBZWE1nZFc1cGNYVmxYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQkJjbkpoZVhOY2JpQWdJQ29nUUhCaGNtRnRJSHRCY25KaGVYMGdZWEp5WVhrZ1ZHaGxJR0Z5Y21GNUlIUnZJSEJ5YjJObGMzTXVYRzRnSUNBcUlFQndZWEpoYlNCN1FtOXZiR1ZoYm4wZ1cybHpVMjl5ZEdWa1BXWmhiSE5sWFNCQklHWnNZV2NnZEc4Z2FXNWthV05oZEdVZ2RHaGhkQ0IwYUdVZ1lHRnljbUY1WUNCcGN5QmhiSEpsWVdSNUlITnZjblJsWkM1Y2JpQWdJQ29nUUhCaGNtRnRJSHRHZFc1amRHbHZibnhQWW1wbFkzUjhVM1J5YVc1bmZTQmJZMkZzYkdKaFkyczlhV1JsYm5ScGRIbGRJRlJvWlNCbWRXNWpkR2x2YmlCallXeHNaV1FnY0dWeVhHNGdJQ0FxSUNCcGRHVnlZWFJwYjI0dUlFbG1JR0VnY0hKdmNHVnlkSGtnYm1GdFpTQnZjaUJ2WW1wbFkzUWdhWE1nY0dGemMyVmtMQ0JwZENCM2FXeHNJR0psSUhWelpXUWdkRzhnWTNKbFlYUmxYRzRnSUNBcUlDQmhJRndpWHk1d2JIVmphMXdpSUc5eUlGd2lYeTUzYUdWeVpWd2lJSE4wZVd4bElHTmhiR3hpWVdOckxDQnlaWE53WldOMGFYWmxiSGt1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUV2w0WldSOUlGdDBhR2x6UVhKblhTQlVhR1VnWUhSb2FYTmdJR0pwYm1ScGJtY2diMllnWUdOaGJHeGlZV05yWUM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBGeWNtRjVmU0JTWlhSMWNtNXpJR0VnWkhWd2JHbGpZWFJsTFhaaGJIVmxMV1p5WldVZ1lYSnlZWGt1WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUY4dWRXNXBjU2hiTVN3Z01pd2dNU3dnTXl3Z01WMHBPMXh1SUNBZ0tpQXZMeUE5UGlCYk1Td2dNaXdnTTExY2JpQWdJQ3BjYmlBZ0lDb2dYeTUxYm1seEtGc3hMQ0F4TENBeUxDQXlMQ0F6WFN3Z2RISjFaU2s3WEc0Z0lDQXFJQzh2SUQwK0lGc3hMQ0F5TENBelhWeHVJQ0FnS2x4dUlDQWdLaUJmTG5WdWFYRW9XekVzSURJc0lERXVOU3dnTXl3Z01pNDFYU3dnWm5WdVkzUnBiMjRvYm5WdEtTQjdJSEpsZEhWeWJpQk5ZWFJvTG1ac2IyOXlLRzUxYlNrN0lIMHBPMXh1SUNBZ0tpQXZMeUE5UGlCYk1Td2dNaXdnTTExY2JpQWdJQ3BjYmlBZ0lDb2dYeTUxYm1seEtGc3hMQ0F5TENBeExqVXNJRE1zSURJdU5WMHNJR1oxYm1OMGFXOXVLRzUxYlNrZ2V5QnlaWFIxY200Z2RHaHBjeTVtYkc5dmNpaHVkVzBwT3lCOUxDQk5ZWFJvS1R0Y2JpQWdJQ29nTHk4Z1BUNGdXekVzSURJc0lETmRYRzRnSUNBcVhHNGdJQ0FxSUM4dklIVnphVzVuSUZ3aVh5NXdiSFZqYTF3aUlHTmhiR3hpWVdOcklITm9iM0owYUdGdVpGeHVJQ0FnS2lCZkxuVnVhWEVvVzNzZ0ozZ25PaUF4SUgwc0lIc2dKM2duT2lBeUlIMHNJSHNnSjNnbk9pQXhJSDFkTENBbmVDY3BPMXh1SUNBZ0tpQXZMeUE5UGlCYmV5QW5lQ2M2SURFZ2ZTd2dleUFuZUNjNklESWdmVjFjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUhWdWFYRW9ZWEp5WVhrc0lHbHpVMjl5ZEdWa0xDQmpZV3hzWW1GamF5d2dkR2hwYzBGeVp5a2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJQzB4TEZ4dUlDQWdJQ0FnSUNCc1pXNW5kR2dnUFNCaGNuSmhlU0EvSUdGeWNtRjVMbXhsYm1kMGFDQTZJREFzWEc0Z0lDQWdJQ0FnSUhKbGMzVnNkQ0E5SUZ0ZExGeHVJQ0FnSUNBZ0lDQnpaV1Z1SUQwZ2NtVnpkV3gwTzF4dVhHNGdJQ0FnTHk4Z2FuVm5aMnhsSUdGeVozVnRaVzUwYzF4dUlDQWdJR2xtSUNoMGVYQmxiMllnYVhOVGIzSjBaV1FnUFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdkR2hwYzBGeVp5QTlJR05oYkd4aVlXTnJPMXh1SUNBZ0lDQWdZMkZzYkdKaFkyc2dQU0JwYzFOdmNuUmxaRHRjYmlBZ0lDQWdJR2x6VTI5eWRHVmtJRDBnWm1Gc2MyVTdYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklHbHVhWFFnZG1Gc2RXVWdZMkZqYUdVZ1ptOXlJR3hoY21kbElHRnljbUY1YzF4dUlDQWdJSFpoY2lCcGMweGhjbWRsSUQwZ0lXbHpVMjl5ZEdWa0lDWW1JR3hsYm1kMGFDQStQU0EzTlR0Y2JpQWdJQ0JwWmlBb2FYTk1ZWEpuWlNrZ2UxeHVJQ0FnSUNBZ2RtRnlJR05oWTJobElEMGdlMzA3WEc0Z0lDQWdmVnh1SUNBZ0lHbG1JQ2hqWVd4c1ltRmpheWtnZTF4dUlDQWdJQ0FnYzJWbGJpQTlJRnRkTzF4dUlDQWdJQ0FnWTJGc2JHSmhZMnNnUFNCamNtVmhkR1ZEWVd4c1ltRmpheWhqWVd4c1ltRmpheXdnZEdocGMwRnlaeWs3WEc0Z0lDQWdmVnh1SUNBZ0lIZG9hV3hsSUNncksybHVaR1Y0SUR3Z2JHVnVaM1JvS1NCN1hHNGdJQ0FnSUNCMllYSWdkbUZzZFdVZ1BTQmhjbkpoZVZ0cGJtUmxlRjBzWEc0Z0lDQWdJQ0FnSUNBZ1kyOXRjSFYwWldRZ1BTQmpZV3hzWW1GamF5QS9JR05oYkd4aVlXTnJLSFpoYkhWbExDQnBibVJsZUN3Z1lYSnlZWGtwSURvZ2RtRnNkV1U3WEc1Y2JpQWdJQ0FnSUdsbUlDaHBjMHhoY21kbEtTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCclpYa2dQU0JqYjIxd2RYUmxaQ0FySUNjbk8xeHVJQ0FnSUNBZ0lDQjJZWElnYVc1cGRHVmtJRDBnYUdGelQzZHVVSEp2Y0dWeWRIa3VZMkZzYkNoallXTm9aU3dnYTJWNUtWeHVJQ0FnSUNBZ0lDQWdJRDhnSVNoelpXVnVJRDBnWTJGamFHVmJhMlY1WFNsY2JpQWdJQ0FnSUNBZ0lDQTZJQ2h6WldWdUlEMGdZMkZqYUdWYmEyVjVYU0E5SUZ0ZEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbG1JQ2hwYzFOdmNuUmxaRnh1SUNBZ0lDQWdJQ0FnSUNBZ1B5QWhhVzVrWlhnZ2ZId2djMlZsYmx0elpXVnVMbXhsYm1kMGFDQXRJREZkSUNFOVBTQmpiMjF3ZFhSbFpGeHVJQ0FnSUNBZ0lDQWdJQ0FnT2lCcGJtbDBaV1FnZkh3Z2FXNWtaWGhQWmloelpXVnVMQ0JqYjIxd2RYUmxaQ2tnUENBd1hHNGdJQ0FnSUNBZ0lDQWdLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaGpZV3hzWW1GamF5QjhmQ0JwYzB4aGNtZGxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2MyVmxiaTV3ZFhOb0tHTnZiWEIxZEdWa0tUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0J5WlhOMWJIUXVjSFZ6YUNoMllXeDFaU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1EzSmxZWFJsY3lCaGJpQmhjbkpoZVNCM2FYUm9JR0ZzYkNCdlkyTjFjbkpsYm1ObGN5QnZaaUIwYUdVZ2NHRnpjMlZrSUhaaGJIVmxjeUJ5WlcxdmRtVmtJSFZ6YVc1blhHNGdJQ0FxSUhOMGNtbGpkQ0JsY1hWaGJHbDBlU0JtYjNJZ1kyOXRjR0Z5YVhOdmJuTXNJR2t1WlM0Z1lEMDlQV0F1WEc0Z0lDQXFYRzRnSUNBcUlFQnpkR0YwYVdOY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdOaGRHVm5iM0o1SUVGeWNtRjVjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwRnljbUY1ZlNCaGNuSmhlU0JVYUdVZ1lYSnlZWGtnZEc4Z1ptbHNkR1Z5TGx4dUlDQWdLaUJBY0dGeVlXMGdlMDFwZUdWa2ZTQmJkbUZzZFdVeExDQjJZV3gxWlRJc0lDNHVMbDBnVm1Gc2RXVnpJSFJ2SUhKbGJXOTJaUzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMEZ5Y21GNWZTQlNaWFIxY201eklHRWdibVYzSUdacGJIUmxjbVZrSUdGeWNtRjVMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUJmTG5kcGRHaHZkWFFvV3pFc0lESXNJREVzSURBc0lETXNJREVzSURSZExDQXdMQ0F4S1R0Y2JpQWdJQ29nTHk4Z1BUNGdXeklzSURNc0lEUmRYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUIzYVhSb2IzVjBLR0Z5Y21GNUtTQjdYRzRnSUNBZ2RtRnlJR2x1WkdWNElEMGdMVEVzWEc0Z0lDQWdJQ0FnSUd4bGJtZDBhQ0E5SUdGeWNtRjVJRDhnWVhKeVlYa3ViR1Z1WjNSb0lEb2dNQ3hjYmlBZ0lDQWdJQ0FnWTI5dWRHRnBibk1nUFNCallXTm9aV1JEYjI1MFlXbHVjeWhoY21kMWJXVnVkSE1zSURFcExGeHVJQ0FnSUNBZ0lDQnlaWE4xYkhRZ1BTQmJYVHRjYmx4dUlDQWdJSGRvYVd4bElDZ3JLMmx1WkdWNElEd2diR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQjJZWElnZG1Gc2RXVWdQU0JoY25KaGVWdHBibVJsZUYwN1hHNGdJQ0FnSUNCcFppQW9JV052Ym5SaGFXNXpLSFpoYkhWbEtTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhOMWJIUXVjSFZ6YUNoMllXeDFaU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1IzSnZkWEJ6SUhSb1pTQmxiR1Z0Wlc1MGN5QnZaaUJsWVdOb0lHRnljbUY1SUdGMElIUm9aV2x5SUdOdmNuSmxjM0J2Ym1ScGJtY2dhVzVrWlhobGN5NGdWWE5sWm5Wc0lHWnZjbHh1SUNBZ0tpQnpaWEJoY21GMFpTQmtZWFJoSUhOdmRYSmpaWE1nZEdoaGRDQmhjbVVnWTI5dmNtUnBibUYwWldRZ2RHaHliM1ZuYUNCdFlYUmphR2x1WnlCaGNuSmhlU0JwYm1SbGVHVnpMbHh1SUNBZ0tpQkdiM0lnWVNCdFlYUnlhWGdnYjJZZ2JtVnpkR1ZrSUdGeWNtRjVjeXdnWUY4dWVtbHdMbUZ3Y0d4NUtDNHVMaWxnSUdOaGJpQjBjbUZ1YzNCdmMyVWdkR2hsSUcxaGRISnBlRnh1SUNBZ0tpQnBiaUJoSUhOcGJXbHNZWElnWm1GemFHbHZiaTVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnUVhKeVlYbHpYRzRnSUNBcUlFQndZWEpoYlNCN1FYSnlZWGw5SUZ0aGNuSmhlVEVzSUdGeWNtRjVNaXdnTGk0dVhTQkJjbkpoZVhNZ2RHOGdjSEp2WTJWemN5NWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwRnljbUY1ZlNCU1pYUjFjbTV6SUdFZ2JtVjNJR0Z5Y21GNUlHOW1JR2R5YjNWd1pXUWdaV3hsYldWdWRITXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJRjh1ZW1sd0tGc25iVzlsSnl3Z0oyeGhjbko1SjEwc0lGc3pNQ3dnTkRCZExDQmJkSEoxWlN3Z1ptRnNjMlZkS1R0Y2JpQWdJQ29nTHk4Z1BUNGdXMXNuYlc5bEp5d2dNekFzSUhSeWRXVmRMQ0JiSjJ4aGNuSjVKeXdnTkRBc0lHWmhiSE5sWFYxY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlIcHBjQ2hoY25KaGVTa2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJQzB4TEZ4dUlDQWdJQ0FnSUNCc1pXNW5kR2dnUFNCaGNuSmhlU0EvSUcxaGVDaHdiSFZqYXloaGNtZDFiV1Z1ZEhNc0lDZHNaVzVuZEdnbktTa2dPaUF3TEZ4dUlDQWdJQ0FnSUNCeVpYTjFiSFFnUFNCQmNuSmhlU2hzWlc1bmRHZ3BPMXh1WEc0Z0lDQWdkMmhwYkdVZ0tDc3JhVzVrWlhnZ1BDQnNaVzVuZEdncElIdGNiaUFnSUNBZ0lISmxjM1ZzZEZ0cGJtUmxlRjBnUFNCd2JIVmpheWhoY21kMWJXVnVkSE1zSUdsdVpHVjRLVHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUhKbGMzVnNkRHRjYmlBZ2ZWeHVYRzRnSUM4cUxTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHFMMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRjbVZoZEdWeklHRWdablZ1WTNScGIyNGdkR2hoZENCcGN5QnlaWE4wY21samRHVmtJSFJ2SUdWNFpXTjFkR2x1WnlCZ1puVnVZMkFnYjI1c2VTQmhablJsY2lCcGRDQnBjMXh1SUNBZ0tpQmpZV3hzWldRZ1lHNWdJSFJwYldWekxpQlVhR1VnWUdaMWJtTmdJR2x6SUdWNFpXTjFkR1ZrSUhkcGRHZ2dkR2hsSUdCMGFHbHpZQ0JpYVc1a2FXNW5JRzltSUhSb1pWeHVJQ0FnS2lCamNtVmhkR1ZrSUdaMWJtTjBhVzl1TGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCR2RXNWpkR2x2Ym5OY2JpQWdJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJRzRnVkdobElHNTFiV0psY2lCdlppQjBhVzFsY3lCMGFHVWdablZ1WTNScGIyNGdiWFZ6ZENCaVpTQmpZV3hzWldRZ1ltVm1iM0psWEc0Z0lDQXFJR2wwSUdseklHVjRaV04xZEdWa0xseHVJQ0FnS2lCQWNHRnlZVzBnZTBaMWJtTjBhVzl1ZlNCbWRXNWpJRlJvWlNCbWRXNWpkR2x2YmlCMGJ5QnlaWE4wY21samRDNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwWjFibU4wYVc5dWZTQlNaWFIxY201eklIUm9aU0J1WlhjZ2NtVnpkSEpwWTNSbFpDQm1kVzVqZEdsdmJpNWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dkbUZ5SUhKbGJtUmxjazV2ZEdWeklEMGdYeTVoWm5SbGNpaHViM1JsY3k1c1pXNW5kR2dzSUhKbGJtUmxjaWs3WEc0Z0lDQXFJRjh1Wm05eVJXRmphQ2h1YjNSbGN5d2dablZ1WTNScGIyNG9ibTkwWlNrZ2UxeHVJQ0FnS2lBZ0lHNXZkR1V1WVhONWJtTlRZWFpsS0hzZ0ozTjFZMk5sYzNNbk9pQnlaVzVrWlhKT2IzUmxjeUI5S1R0Y2JpQWdJQ29nZlNrN1hHNGdJQ0FxSUM4dklHQnlaVzVrWlhKT2IzUmxjMkFnYVhNZ2NuVnVJRzl1WTJVc0lHRm1kR1Z5SUdGc2JDQnViM1JsY3lCb1lYWmxJSE5oZG1Wa1hHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQmhablJsY2lodUxDQm1kVzVqS1NCN1hHNGdJQ0FnYVdZZ0tHNGdQQ0F4S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWm5WdVl5Z3BPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNCcFppQW9MUzF1SUR3Z01Ta2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdablZ1WXk1aGNIQnNlU2gwYUdsekxDQmhjbWQxYldWdWRITXBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMDdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUTNKbFlYUmxjeUJoSUdaMWJtTjBhVzl1SUhSb1lYUXNJSGRvWlc0Z1kyRnNiR1ZrTENCcGJuWnZhMlZ6SUdCbWRXNWpZQ0IzYVhSb0lIUm9aU0JnZEdocGMyQmNiaUFnSUNvZ1ltbHVaR2x1WnlCdlppQmdkR2hwYzBGeVoyQWdZVzVrSUhCeVpYQmxibVJ6SUdGdWVTQmhaR1JwZEdsdmJtRnNJR0JpYVc1a1lDQmhjbWQxYldWdWRITWdkRzhnZEdodmMyVmNiaUFnSUNvZ2NHRnpjMlZrSUhSdklIUm9aU0JpYjNWdVpDQm1kVzVqZEdsdmJpNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dSblZ1WTNScGIyNXpYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHWjFibU1nVkdobElHWjFibU4wYVc5dUlIUnZJR0pwYm1RdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VFdsNFpXUjlJRnQwYUdselFYSm5YU0JVYUdVZ1lIUm9hWE5nSUdKcGJtUnBibWNnYjJZZ1lHWjFibU5nTGx4dUlDQWdLaUJBY0dGeVlXMGdlMDFwZUdWa2ZTQmJZWEpuTVN3Z1lYSm5NaXdnTGk0dVhTQkJjbWQxYldWdWRITWdkRzhnWW1VZ2NHRnlkR2xoYkd4NUlHRndjR3hwWldRdVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0R2RXNWpkR2x2Ym4wZ1VtVjBkWEp1Y3lCMGFHVWdibVYzSUdKdmRXNWtJR1oxYm1OMGFXOXVMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUIyWVhJZ1puVnVZeUE5SUdaMWJtTjBhVzl1S0dkeVpXVjBhVzVuS1NCN1hHNGdJQ0FxSUNBZ2NtVjBkWEp1SUdkeVpXVjBhVzVuSUNzZ0p5QW5JQ3NnZEdocGN5NXVZVzFsTzF4dUlDQWdLaUI5TzF4dUlDQWdLbHh1SUNBZ0tpQm1kVzVqSUQwZ1h5NWlhVzVrS0daMWJtTXNJSHNnSjI1aGJXVW5PaUFuYlc5bEp5QjlMQ0FuYUdrbktUdGNiaUFnSUNvZ1puVnVZeWdwTzF4dUlDQWdLaUF2THlBOVBpQW5hR2tnYlc5bEoxeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdZbWx1WkNobWRXNWpMQ0IwYUdselFYSm5LU0I3WEc0Z0lDQWdMeThnZFhObElHQkdkVzVqZEdsdmJpTmlhVzVrWUNCcFppQnBkQ0JsZUdsemRITWdZVzVrSUdseklHWmhjM1JjYmlBZ0lDQXZMeUFvYVc0Z1ZqZ2dZRVoxYm1OMGFXOXVJMkpwYm1SZ0lHbHpJSE5zYjNkbGNpQmxlR05sY0hRZ2QyaGxiaUJ3WVhKMGFXRnNiSGtnWVhCd2JHbGxaQ2xjYmlBZ0lDQnlaWFIxY200Z2FYTkNhVzVrUm1GemRDQjhmQ0FvYm1GMGFYWmxRbWx1WkNBbUppQmhjbWQxYldWdWRITXViR1Z1WjNSb0lENGdNaWxjYmlBZ0lDQWdJRDhnYm1GMGFYWmxRbWx1WkM1allXeHNMbUZ3Y0d4NUtHNWhkR2wyWlVKcGJtUXNJR0Z5WjNWdFpXNTBjeWxjYmlBZ0lDQWdJRG9nWTNKbFlYUmxRbTkxYm1Rb1puVnVZeXdnZEdocGMwRnlaeXdnYzJ4cFkyVW9ZWEpuZFcxbGJuUnpMQ0F5S1NrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRbWx1WkhNZ2JXVjBhRzlrY3lCdmJpQmdiMkpxWldOMFlDQjBieUJnYjJKcVpXTjBZQ3dnYjNabGNuZHlhWFJwYm1jZ2RHaGxJR1Y0YVhOMGFXNW5JRzFsZEdodlpDNWNiaUFnSUNvZ1RXVjBhRzlrSUc1aGJXVnpJRzFoZVNCaVpTQnpjR1ZqYVdacFpXUWdZWE1nYVc1a2FYWnBaSFZoYkNCaGNtZDFiV1Z1ZEhNZ2IzSWdZWE1nWVhKeVlYbHpJRzltSUcxbGRHaHZaRnh1SUNBZ0tpQnVZVzFsY3k0Z1NXWWdibThnYldWMGFHOWtJRzVoYldWeklHRnlaU0J3Y205MmFXUmxaQ3dnWVd4c0lIUm9aU0JtZFc1amRHbHZiaUJ3Y205d1pYSjBhV1Z6SUc5bUlHQnZZbXBsWTNSZ1hHNGdJQ0FxSUhkcGJHd2dZbVVnWW05MWJtUXVYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRR05oZEdWbmIzSjVJRVoxYm1OMGFXOXVjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ2IySnFaV04wSUZSb1pTQnZZbXBsWTNRZ2RHOGdZbWx1WkNCaGJtUWdZWE56YVdkdUlIUm9aU0JpYjNWdVpDQnRaWFJvYjJSeklIUnZMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ1cyMWxkR2h2WkU1aGJXVXhMQ0J0WlhSb2IyUk9ZVzFsTWl3Z0xpNHVYU0JOWlhSb2IyUWdibUZ0WlhNZ2IyNGdkR2hsSUc5aWFtVmpkQ0IwYnlCaWFXNWtMbHh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdUMkpxWldOMGZTQlNaWFIxY201eklHQnZZbXBsWTNSZ0xseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQjJZWElnZG1sbGR5QTlJSHRjYmlBZ0lDb2dJQ2RzWVdKbGJDYzZJQ2RrYjJOekp5eGNiaUFnSUNvZ0lDZHZia05zYVdOckp6b2dablZ1WTNScGIyNG9LU0I3SUdGc1pYSjBLQ2RqYkdsamEyVmtJQ2NnS3lCMGFHbHpMbXhoWW1Wc0tUc2dmVnh1SUNBZ0tpQjlPMXh1SUNBZ0tseHVJQ0FnS2lCZkxtSnBibVJCYkd3b2RtbGxkeWs3WEc0Z0lDQXFJR3BSZFdWeWVTZ25JMlJ2WTNNbktTNXZiaWduWTJ4cFkyc25MQ0IyYVdWM0xtOXVRMnhwWTJzcE8xeHVJQ0FnS2lBdkx5QTlQaUJoYkdWeWRITWdKMk5zYVdOclpXUWdaRzlqY3ljc0lIZG9aVzRnZEdobElHSjFkSFJ2YmlCcGN5QmpiR2xqYTJWa1hHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQmlhVzVrUVd4c0tHOWlhbVZqZENrZ2UxeHVJQ0FnSUhaaGNpQm1kVzVqY3lBOUlHTnZibU5oZEM1aGNIQnNlU2hoY25KaGVWSmxaaXdnWVhKbmRXMWxiblJ6S1N4Y2JpQWdJQ0FnSUNBZ2FXNWtaWGdnUFNCbWRXNWpjeTVzWlc1bmRHZ2dQaUF4SUQ4Z01DQTZJQ2htZFc1amN5QTlJR1oxYm1OMGFXOXVjeWh2WW1wbFkzUXBMQ0F0TVNrc1hHNGdJQ0FnSUNBZ0lHeGxibWQwYUNBOUlHWjFibU56TG14bGJtZDBhRHRjYmx4dUlDQWdJSGRvYVd4bElDZ3JLMmx1WkdWNElEd2diR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQjJZWElnYTJWNUlEMGdablZ1WTNOYmFXNWtaWGhkTzF4dUlDQWdJQ0FnYjJKcVpXTjBXMnRsZVYwZ1BTQmlhVzVrS0c5aWFtVmpkRnRyWlhsZExDQnZZbXBsWTNRcE8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdiMkpxWldOME8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU55WldGMFpYTWdZU0JtZFc1amRHbHZiaUIwYUdGMExDQjNhR1Z1SUdOaGJHeGxaQ3dnYVc1MmIydGxjeUIwYUdVZ2JXVjBhRzlrSUdGMElHQnZZbXBsWTNSYmEyVjVYV0JjYmlBZ0lDb2dZVzVrSUhCeVpYQmxibVJ6SUdGdWVTQmhaR1JwZEdsdmJtRnNJR0JpYVc1a1MyVjVZQ0JoY21kMWJXVnVkSE1nZEc4Z2RHaHZjMlVnY0dGemMyVmtJSFJ2SUhSb1pTQmliM1Z1WkZ4dUlDQWdLaUJtZFc1amRHbHZiaTRnVkdocGN5QnRaWFJvYjJRZ1pHbG1abVZ5Y3lCbWNtOXRJR0JmTG1KcGJtUmdJR0o1SUdGc2JHOTNhVzVuSUdKdmRXNWtJR1oxYm1OMGFXOXVjeUIwYjF4dUlDQWdLaUJ5WldabGNtVnVZMlVnYldWMGFHOWtjeUIwYUdGMElIZHBiR3dnWW1VZ2NtVmtaV1pwYm1Wa0lHOXlJR1J2YmlkMElIbGxkQ0JsZUdsemRDNWNiaUFnSUNvZ1UyVmxJR2gwZEhBNkx5OXRhV05vWVhWNExtTmhMMkZ5ZEdsamJHVnpMMnhoZW5rdFpuVnVZM1JwYjI0dFpHVm1hVzVwZEdsdmJpMXdZWFIwWlhKdUxseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQkdkVzVqZEdsdmJuTmNiaUFnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUc5aWFtVmpkQ0JVYUdVZ2IySnFaV04wSUhSb1pTQnRaWFJvYjJRZ1ltVnNiMjVuY3lCMGJ5NWNiaUFnSUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUd0bGVTQlVhR1VnYTJWNUlHOW1JSFJvWlNCdFpYUm9iMlF1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUV2w0WldSOUlGdGhjbWN4TENCaGNtY3lMQ0F1TGk1ZElFRnlaM1Z0Wlc1MGN5QjBieUJpWlNCd1lYSjBhV0ZzYkhrZ1lYQndiR2xsWkM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBaMWJtTjBhVzl1ZlNCU1pYUjFjbTV6SUhSb1pTQnVaWGNnWW05MWJtUWdablZ1WTNScGIyNHVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCdlltcGxZM1FnUFNCN1hHNGdJQ0FxSUNBZ0oyNWhiV1VuT2lBbmJXOWxKeXhjYmlBZ0lDb2dJQ0FuWjNKbFpYUW5PaUJtZFc1amRHbHZiaWhuY21WbGRHbHVaeWtnZTF4dUlDQWdLaUFnSUNBZ2NtVjBkWEp1SUdkeVpXVjBhVzVuSUNzZ0p5QW5JQ3NnZEdocGN5NXVZVzFsTzF4dUlDQWdLaUFnSUgxY2JpQWdJQ29nZlR0Y2JpQWdJQ3BjYmlBZ0lDb2dkbUZ5SUdaMWJtTWdQU0JmTG1KcGJtUkxaWGtvYjJKcVpXTjBMQ0FuWjNKbFpYUW5MQ0FuYUdrbktUdGNiaUFnSUNvZ1puVnVZeWdwTzF4dUlDQWdLaUF2THlBOVBpQW5hR2tnYlc5bEoxeHVJQ0FnS2x4dUlDQWdLaUJ2WW1wbFkzUXVaM0psWlhRZ1BTQm1kVzVqZEdsdmJpaG5jbVZsZEdsdVp5a2dlMXh1SUNBZ0tpQWdJSEpsZEhWeWJpQm5jbVZsZEdsdVp5QXJJQ2NzSUNjZ0t5QjBhR2x6TG01aGJXVWdLeUFuSVNjN1hHNGdJQ0FxSUgwN1hHNGdJQ0FxWEc0Z0lDQXFJR1oxYm1Nb0tUdGNiaUFnSUNvZ0x5OGdQVDRnSjJocExDQnRiMlVoSjF4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z1ltbHVaRXRsZVNodlltcGxZM1FzSUd0bGVTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCamNtVmhkR1ZDYjNWdVpDaHZZbXBsWTNRc0lHdGxlU3dnYzJ4cFkyVW9ZWEpuZFcxbGJuUnpMQ0F5S1NrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRM0psWVhSbGN5QmhJR1oxYm1OMGFXOXVJSFJvWVhRZ2FYTWdkR2hsSUdOdmJYQnZjMmwwYVc5dUlHOW1JSFJvWlNCd1lYTnpaV1FnWm5WdVkzUnBiMjV6TEZ4dUlDQWdLaUIzYUdWeVpTQmxZV05vSUdaMWJtTjBhVzl1SUdOdmJuTjFiV1Z6SUhSb1pTQnlaWFIxY200Z2RtRnNkV1VnYjJZZ2RHaGxJR1oxYm1OMGFXOXVJSFJvWVhRZ1ptOXNiRzkzY3k1Y2JpQWdJQ29nUm05eUlHVjRZVzF3YkdVc0lHTnZiWEJ2YzJsdVp5QjBhR1VnWm5WdVkzUnBiMjV6SUdCbUtDbGdMQ0JnWnlncFlDd2dZVzVrSUdCb0tDbGdJSEJ5YjJSMVkyVnpJR0JtS0djb2FDZ3BLU2xnTGx4dUlDQWdLaUJGWVdOb0lHWjFibU4wYVc5dUlHbHpJR1Y0WldOMWRHVmtJSGRwZEdnZ2RHaGxJR0IwYUdsellDQmlhVzVrYVc1bklHOW1JSFJvWlNCamIyMXdiM05sWkNCbWRXNWpkR2x2Ymk1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1JuVnVZM1JwYjI1elhHNGdJQ0FxSUVCd1lYSmhiU0I3Um5WdVkzUnBiMjU5SUZ0bWRXNWpNU3dnWm5WdVl6SXNJQzR1TGwwZ1JuVnVZM1JwYjI1eklIUnZJR052YlhCdmMyVXVYRzRnSUNBcUlFQnlaWFIxY201eklIdEdkVzVqZEdsdmJuMGdVbVYwZFhKdWN5QjBhR1VnYm1WM0lHTnZiWEJ2YzJWa0lHWjFibU4wYVc5dUxseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQjJZWElnWjNKbFpYUWdQU0JtZFc1amRHbHZiaWh1WVcxbEtTQjdJSEpsZEhWeWJpQW5hR2tnSnlBcklHNWhiV1U3SUgwN1hHNGdJQ0FxSUhaaGNpQmxlR05zWVdsdElEMGdablZ1WTNScGIyNG9jM1JoZEdWdFpXNTBLU0I3SUhKbGRIVnliaUJ6ZEdGMFpXMWxiblFnS3lBbklTYzdJSDA3WEc0Z0lDQXFJSFpoY2lCM1pXeGpiMjFsSUQwZ1h5NWpiMjF3YjNObEtHVjRZMnhoYVcwc0lHZHlaV1YwS1R0Y2JpQWdJQ29nZDJWc1kyOXRaU2duYlc5bEp5azdYRzRnSUNBcUlDOHZJRDArSUNkb2FTQnRiMlVoSjF4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z1kyOXRjRzl6WlNncElIdGNiaUFnSUNCMllYSWdablZ1WTNNZ1BTQmhjbWQxYldWdWRITTdYRzRnSUNBZ2NtVjBkWEp1SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ2RtRnlJR0Z5WjNNZ1BTQmhjbWQxYldWdWRITXNYRzRnSUNBZ0lDQWdJQ0FnYkdWdVozUm9JRDBnWm5WdVkzTXViR1Z1WjNSb08xeHVYRzRnSUNBZ0lDQjNhR2xzWlNBb2JHVnVaM1JvTFMwcElIdGNiaUFnSUNBZ0lDQWdZWEpuY3lBOUlGdG1kVzVqYzF0c1pXNW5kR2hkTG1Gd2NHeDVLSFJvYVhNc0lHRnlaM01wWFR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhKbGRIVnliaUJoY21keld6QmRPMXh1SUNBZ0lIMDdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUTNKbFlYUmxjeUJoSUdaMWJtTjBhVzl1SUhSb1lYUWdkMmxzYkNCa1pXeGhlU0IwYUdVZ1pYaGxZM1YwYVc5dUlHOW1JR0JtZFc1allDQjFiblJwYkNCaFpuUmxjbHh1SUNBZ0tpQmdkMkZwZEdBZ2JXbHNiR2x6WldOdmJtUnpJR2hoZG1VZ1pXeGhjSE5sWkNCemFXNWpaU0IwYUdVZ2JHRnpkQ0IwYVcxbElHbDBJSGRoY3lCcGJuWnZhMlZrTGlCUVlYTnpYRzRnSUNBcUlHQjBjblZsWUNCbWIzSWdZR2x0YldWa2FXRjBaV0FnZEc4Z1kyRjFjMlVnWkdWaWIzVnVZMlVnZEc4Z2FXNTJiMnRsSUdCbWRXNWpZQ0J2YmlCMGFHVWdiR1ZoWkdsdVp5eGNiaUFnSUNvZ2FXNXpkR1ZoWkNCdlppQjBhR1VnZEhKaGFXeHBibWNzSUdWa1oyVWdiMllnZEdobElHQjNZV2wwWUNCMGFXMWxiM1YwTGlCVGRXSnpaWEYxWlc1MElHTmhiR3h6SUhSdlhHNGdJQ0FxSUhSb1pTQmtaV0p2ZFc1alpXUWdablZ1WTNScGIyNGdkMmxzYkNCeVpYUjFjbTRnZEdobElISmxjM1ZzZENCdlppQjBhR1VnYkdGemRDQmdablZ1WTJBZ1kyRnNiQzVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnUm5WdVkzUnBiMjV6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdSblZ1WTNScGIyNTlJR1oxYm1NZ1ZHaGxJR1oxYm1OMGFXOXVJSFJ2SUdSbFltOTFibU5sTGx4dUlDQWdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdkMkZwZENCVWFHVWdiblZ0WW1WeUlHOW1JRzFwYkd4cGMyVmpiMjVrY3lCMGJ5QmtaV3hoZVM1Y2JpQWdJQ29nUUhCaGNtRnRJSHRDYjI5c1pXRnVmU0JwYlcxbFpHbGhkR1VnUVNCbWJHRm5JSFJ2SUdsdVpHbGpZWFJsSUdWNFpXTjFkR2x2YmlCcGN5QnZiaUIwYUdVZ2JHVmhaR2x1WjF4dUlDQWdLaUFnWldSblpTQnZaaUIwYUdVZ2RHbHRaVzkxZEM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBaMWJtTjBhVzl1ZlNCU1pYUjFjbTV6SUhSb1pTQnVaWGNnWkdWaWIzVnVZMlZrSUdaMWJtTjBhVzl1TGx4dUlDQWdLaUJBWlhoaGJYQnNaVnh1SUNBZ0tseHVJQ0FnS2lCMllYSWdiR0Y2ZVV4aGVXOTFkQ0E5SUY4dVpHVmliM1Z1WTJVb1kyRnNZM1ZzWVhSbFRHRjViM1YwTENBek1EQXBPMXh1SUNBZ0tpQnFVWFZsY25rb2QybHVaRzkzS1M1dmJpZ25jbVZ6YVhwbEp5d2diR0Y2ZVV4aGVXOTFkQ2s3WEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCa1pXSnZkVzVqWlNobWRXNWpMQ0IzWVdsMExDQnBiVzFsWkdsaGRHVXBJSHRjYmlBZ0lDQjJZWElnWVhKbmN5eGNiaUFnSUNBZ0lDQWdjbVZ6ZFd4MExGeHVJQ0FnSUNBZ0lDQjBhR2x6UVhKbkxGeHVJQ0FnSUNBZ0lDQjBhVzFsYjNWMFNXUTdYRzVjYmlBZ0lDQm1kVzVqZEdsdmJpQmtaV3hoZVdWa0tDa2dlMXh1SUNBZ0lDQWdkR2x0Wlc5MWRFbGtJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lHbG1JQ2doYVcxdFpXUnBZWFJsS1NCN1hHNGdJQ0FnSUNBZ0lISmxjM1ZzZENBOUlHWjFibU11WVhCd2JIa29kR2hwYzBGeVp5d2dZWEpuY3lrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJSFpoY2lCcGMwbHRiV1ZrYVdGMFpTQTlJR2x0YldWa2FXRjBaU0FtSmlBaGRHbHRaVzkxZEVsa08xeHVJQ0FnSUNBZ1lYSm5jeUE5SUdGeVozVnRaVzUwY3p0Y2JpQWdJQ0FnSUhSb2FYTkJjbWNnUFNCMGFHbHpPMXh1WEc0Z0lDQWdJQ0JqYkdWaGNsUnBiV1Z2ZFhRb2RHbHRaVzkxZEVsa0tUdGNiaUFnSUNBZ0lIUnBiV1Z2ZFhSSlpDQTlJSE5sZEZScGJXVnZkWFFvWkdWc1lYbGxaQ3dnZDJGcGRDazdYRzVjYmlBZ0lDQWdJR2xtSUNocGMwbHRiV1ZrYVdGMFpTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhOMWJIUWdQU0JtZFc1akxtRndjR3g1S0hSb2FYTkJjbWNzSUdGeVozTXBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdjbVYwZFhKdUlISmxjM1ZzZER0Y2JpQWdJQ0I5TzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFVjRaV04xZEdWeklIUm9aU0JnWm5WdVkyQWdablZ1WTNScGIyNGdZV1owWlhJZ1lIZGhhWFJnSUcxcGJHeHBjMlZqYjI1a2N5NGdRV1JrYVhScGIyNWhiQ0JoY21kMWJXVnVkSE5jYmlBZ0lDb2dkMmxzYkNCaVpTQndZWE56WldRZ2RHOGdZR1oxYm1OZ0lIZG9aVzRnYVhRZ2FYTWdhVzUyYjJ0bFpDNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dSblZ1WTNScGIyNXpYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHWjFibU1nVkdobElHWjFibU4wYVc5dUlIUnZJR1JsYkdGNUxseHVJQ0FnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnZDJGcGRDQlVhR1VnYm5WdFltVnlJRzltSUcxcGJHeHBjMlZqYjI1a2N5QjBieUJrWld4aGVTQmxlR1ZqZFhScGIyNHVYRzRnSUNBcUlFQndZWEpoYlNCN1RXbDRaV1I5SUZ0aGNtY3hMQ0JoY21jeUxDQXVMaTVkSUVGeVozVnRaVzUwY3lCMGJ5QnBiblp2YTJVZ2RHaGxJR1oxYm1OMGFXOXVJSGRwZEdndVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0T2RXMWlaWEo5SUZKbGRIVnlibk1nZEdobElHQnpaWFJVYVcxbGIzVjBZQ0IwYVcxbGIzVjBJR2xrTGx4dUlDQWdLaUJBWlhoaGJYQnNaVnh1SUNBZ0tseHVJQ0FnS2lCMllYSWdiRzluSUQwZ1h5NWlhVzVrS0dOdmJuTnZiR1V1Ykc5bkxDQmpiMjV6YjJ4bEtUdGNiaUFnSUNvZ1h5NWtaV3hoZVNoc2IyY3NJREV3TURBc0lDZHNiMmRuWldRZ2JHRjBaWEluS1R0Y2JpQWdJQ29nTHk4Z1BUNGdKMnh2WjJkbFpDQnNZWFJsY2ljZ0tFRndjR1ZoY25NZ1lXWjBaWElnYjI1bElITmxZMjl1WkM0cFhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQmtaV3hoZVNobWRXNWpMQ0IzWVdsMEtTQjdYRzRnSUNBZ2RtRnlJR0Z5WjNNZ1BTQnpiR2xqWlNoaGNtZDFiV1Z1ZEhNc0lESXBPMXh1SUNBZ0lISmxkSFZ5YmlCelpYUlVhVzFsYjNWMEtHWjFibU4wYVc5dUtDa2dleUJtZFc1akxtRndjR3g1S0hWdVpHVm1hVzVsWkN3Z1lYSm5jeWs3SUgwc0lIZGhhWFFwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFUmxabVZ5Y3lCbGVHVmpkWFJwYm1jZ2RHaGxJR0JtZFc1allDQm1kVzVqZEdsdmJpQjFiblJwYkNCMGFHVWdZM1Z5Y21WdWRDQmpZV3hzSUhOMFlXTnJJR2hoY3lCamJHVmhjbVZrTGx4dUlDQWdLaUJCWkdScGRHbHZibUZzSUdGeVozVnRaVzUwY3lCM2FXeHNJR0psSUhCaGMzTmxaQ0IwYnlCZ1puVnVZMkFnZDJobGJpQnBkQ0JwY3lCcGJuWnZhMlZrTGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCR2RXNWpkR2x2Ym5OY2JpQWdJQ29nUUhCaGNtRnRJSHRHZFc1amRHbHZibjBnWm5WdVl5QlVhR1VnWm5WdVkzUnBiMjRnZEc4Z1pHVm1aWEl1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUV2w0WldSOUlGdGhjbWN4TENCaGNtY3lMQ0F1TGk1ZElFRnlaM1Z0Wlc1MGN5QjBieUJwYm5admEyVWdkR2hsSUdaMWJtTjBhVzl1SUhkcGRHZ3VYRzRnSUNBcUlFQnlaWFIxY201eklIdE9kVzFpWlhKOUlGSmxkSFZ5Ym5NZ2RHaGxJR0J6WlhSVWFXMWxiM1YwWUNCMGFXMWxiM1YwSUdsa0xseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQmZMbVJsWm1WeUtHWjFibU4wYVc5dUtDa2dleUJoYkdWeWRDZ25aR1ZtWlhKeVpXUW5LVHNnZlNrN1hHNGdJQ0FxSUM4dklISmxkSFZ5Ym5NZ1puSnZiU0IwYUdVZ1puVnVZM1JwYjI0Z1ltVm1iM0psSUdCaGJHVnlkR0FnYVhNZ1kyRnNiR1ZrWEc0Z0lDQXFMMXh1SUNCbWRXNWpkR2x2YmlCa1pXWmxjaWhtZFc1aktTQjdYRzRnSUNBZ2RtRnlJR0Z5WjNNZ1BTQnpiR2xqWlNoaGNtZDFiV1Z1ZEhNc0lERXBPMXh1SUNBZ0lISmxkSFZ5YmlCelpYUlVhVzFsYjNWMEtHWjFibU4wYVc5dUtDa2dleUJtZFc1akxtRndjR3g1S0hWdVpHVm1hVzVsWkN3Z1lYSm5jeWs3SUgwc0lERXBPMXh1SUNCOVhHNGdJQzh2SUhWelpTQmdjMlYwU1cxdFpXUnBZWFJsWUNCcFppQnBkQ2R6SUdGMllXbHNZV0pzWlNCcGJpQk9iMlJsTG1welhHNGdJR2xtSUNocGMxWTRJQ1ltSUdaeVpXVk5iMlIxYkdVZ0ppWWdkSGx3Wlc5bUlITmxkRWx0YldWa2FXRjBaU0E5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ1pHVm1aWElnUFNCaWFXNWtLSE5sZEVsdGJXVmthV0YwWlN3Z2QybHVaRzkzS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRjbVZoZEdWeklHRWdablZ1WTNScGIyNGdkR2hoZENCdFpXMXZhWHBsY3lCMGFHVWdjbVZ6ZFd4MElHOW1JR0JtZFc1allDNGdTV1lnWUhKbGMyOXNkbVZ5WUNCcGMxeHVJQ0FnS2lCd1lYTnpaV1FzSUdsMElIZHBiR3dnWW1VZ2RYTmxaQ0IwYnlCa1pYUmxjbTFwYm1VZ2RHaGxJR05oWTJobElHdGxlU0JtYjNJZ2MzUnZjbWx1WnlCMGFHVWdjbVZ6ZFd4MFhHNGdJQ0FxSUdKaGMyVmtJRzl1SUhSb1pTQmhjbWQxYldWdWRITWdjR0Z6YzJWa0lIUnZJSFJvWlNCdFpXMXZhWHBsWkNCbWRXNWpkR2x2Ymk0Z1Fua2daR1ZtWVhWc2RDd2dkR2hsSUdacGNuTjBYRzRnSUNBcUlHRnlaM1Z0Wlc1MElIQmhjM05sWkNCMGJ5QjBhR1VnYldWdGIybDZaV1FnWm5WdVkzUnBiMjRnYVhNZ2RYTmxaQ0JoY3lCMGFHVWdZMkZqYUdVZ2EyVjVMaUJVYUdVZ1lHWjFibU5nWEc0Z0lDQXFJR2x6SUdWNFpXTjFkR1ZrSUhkcGRHZ2dkR2hsSUdCMGFHbHpZQ0JpYVc1a2FXNW5JRzltSUhSb1pTQnRaVzF2YVhwbFpDQm1kVzVqZEdsdmJpNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dSblZ1WTNScGIyNXpYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHWjFibU1nVkdobElHWjFibU4wYVc5dUlIUnZJR2hoZG1VZ2FYUnpJRzkxZEhCMWRDQnRaVzF2YVhwbFpDNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym4wZ1czSmxjMjlzZG1WeVhTQkJJR1oxYm1OMGFXOXVJSFZ6WldRZ2RHOGdjbVZ6YjJ4MlpTQjBhR1VnWTJGamFHVWdhMlY1TGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3Um5WdVkzUnBiMjU5SUZKbGRIVnlibk1nZEdobElHNWxkeUJ0WlcxdmFYcHBibWNnWm5WdVkzUnBiMjR1WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUhaaGNpQm1hV0p2Ym1Galkya2dQU0JmTG0xbGJXOXBlbVVvWm5WdVkzUnBiMjRvYmlrZ2UxeHVJQ0FnS2lBZ0lISmxkSFZ5YmlCdUlEd2dNaUEvSUc0Z09pQm1hV0p2Ym1Galkya29iaUF0SURFcElDc2dabWxpYjI1aFkyTnBLRzRnTFNBeUtUdGNiaUFnSUNvZ2ZTazdYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJ0WlcxdmFYcGxLR1oxYm1Nc0lISmxjMjlzZG1WeUtTQjdYRzRnSUNBZ2RtRnlJR05oWTJobElEMGdlMzA3WEc0Z0lDQWdjbVYwZFhKdUlHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lDQWdkbUZ5SUd0bGVTQTlJQ2h5WlhOdmJIWmxjaUEvSUhKbGMyOXNkbVZ5TG1Gd2NHeDVLSFJvYVhNc0lHRnlaM1Z0Wlc1MGN5a2dPaUJoY21kMWJXVnVkSE5iTUYwcElDc2dKeWM3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdhR0Z6VDNkdVVISnZjR1Z5ZEhrdVkyRnNiQ2hqWVdOb1pTd2dhMlY1S1Z4dUlDQWdJQ0FnSUNBL0lHTmhZMmhsVzJ0bGVWMWNiaUFnSUNBZ0lDQWdPaUFvWTJGamFHVmJhMlY1WFNBOUlHWjFibU11WVhCd2JIa29kR2hwY3l3Z1lYSm5kVzFsYm5SektTazdYRzRnSUNBZ2ZUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJEY21WaGRHVnpJR0VnWm5WdVkzUnBiMjRnZEdoaGRDQnBjeUJ5WlhOMGNtbGpkR1ZrSUhSdklHVjRaV04xZEdVZ1lHWjFibU5nSUc5dVkyVXVJRkpsY0dWaGRDQmpZV3hzY3lCMGIxeHVJQ0FnS2lCMGFHVWdablZ1WTNScGIyNGdkMmxzYkNCeVpYUjFjbTRnZEdobElIWmhiSFZsSUc5bUlIUm9aU0JtYVhKemRDQmpZV3hzTGlCVWFHVWdZR1oxYm1OZ0lHbHpJR1Y0WldOMWRHVmtYRzRnSUNBcUlIZHBkR2dnZEdobElHQjBhR2x6WUNCaWFXNWthVzVuSUc5bUlIUm9aU0JqY21WaGRHVmtJR1oxYm1OMGFXOXVMbHh1SUNBZ0tseHVJQ0FnS2lCQWMzUmhkR2xqWEc0Z0lDQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JHZFc1amRHbHZibk5jYmlBZ0lDb2dRSEJoY21GdElIdEdkVzVqZEdsdmJuMGdablZ1WXlCVWFHVWdablZ1WTNScGIyNGdkRzhnY21WemRISnBZM1F1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHRHZFc1amRHbHZibjBnVW1WMGRYSnVjeUIwYUdVZ2JtVjNJSEpsYzNSeWFXTjBaV1FnWm5WdVkzUnBiMjR1WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUhaaGNpQnBibWwwYVdGc2FYcGxJRDBnWHk1dmJtTmxLR055WldGMFpVRndjR3hwWTJGMGFXOXVLVHRjYmlBZ0lDb2dhVzVwZEdsaGJHbDZaU2dwTzF4dUlDQWdLaUJwYm1sMGFXRnNhWHBsS0NrN1hHNGdJQ0FxSUM4dklHQnBibWwwYVdGc2FYcGxZQ0JsZUdWamRYUmxjeUJnWTNKbFlYUmxRWEJ3YkdsallYUnBiMjVnSUc5dVkyVmNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJRzl1WTJVb1puVnVZeWtnZTF4dUlDQWdJSFpoY2lCeVlXNHNYRzRnSUNBZ0lDQWdJSEpsYzNWc2REdGNibHh1SUNBZ0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lHbG1JQ2h5WVc0cElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlISmxjM1ZzZER0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhKaGJpQTlJSFJ5ZFdVN1hHNGdJQ0FnSUNCeVpYTjFiSFFnUFNCbWRXNWpMbUZ3Y0d4NUtIUm9hWE1zSUdGeVozVnRaVzUwY3lrN1hHNWNiaUFnSUNBZ0lDOHZJR05zWldGeUlIUm9aU0JnWm5WdVkyQWdkbUZ5YVdGaWJHVWdjMjhnZEdobElHWjFibU4wYVc5dUlHMWhlU0JpWlNCbllYSmlZV2RsSUdOdmJHeGxZM1JsWkZ4dUlDQWdJQ0FnWm5WdVl5QTlJRzUxYkd3N1hHNGdJQ0FnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNBZ0lIMDdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUTNKbFlYUmxjeUJoSUdaMWJtTjBhVzl1SUhSb1lYUXNJSGRvWlc0Z1kyRnNiR1ZrTENCcGJuWnZhMlZ6SUdCbWRXNWpZQ0IzYVhSb0lHRnVlU0JoWkdScGRHbHZibUZzWEc0Z0lDQXFJR0J3WVhKMGFXRnNZQ0JoY21kMWJXVnVkSE1nY0hKbGNHVnVaR1ZrSUhSdklIUm9iM05sSUhCaGMzTmxaQ0IwYnlCMGFHVWdibVYzSUdaMWJtTjBhVzl1TGlCVWFHbHpYRzRnSUNBcUlHMWxkR2h2WkNCcGN5QnphVzFwYkdGeUlIUnZJR0JmTG1KcGJtUmdMQ0JsZUdObGNIUWdhWFFnWkc5bGN5QXFLbTV2ZENvcUlHRnNkR1Z5SUhSb1pTQmdkR2hwYzJBZ1ltbHVaR2x1Wnk1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1JuVnVZM1JwYjI1elhHNGdJQ0FxSUVCd1lYSmhiU0I3Um5WdVkzUnBiMjU5SUdaMWJtTWdWR2hsSUdaMWJtTjBhVzl1SUhSdklIQmhjblJwWVd4c2VTQmhjSEJzZVNCaGNtZDFiV1Z1ZEhNZ2RHOHVYRzRnSUNBcUlFQndZWEpoYlNCN1RXbDRaV1I5SUZ0aGNtY3hMQ0JoY21jeUxDQXVMaTVkSUVGeVozVnRaVzUwY3lCMGJ5QmlaU0J3WVhKMGFXRnNiSGtnWVhCd2JHbGxaQzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMFoxYm1OMGFXOXVmU0JTWlhSMWNtNXpJSFJvWlNCdVpYY2djR0Z5ZEdsaGJHeDVJR0Z3Y0d4cFpXUWdablZ1WTNScGIyNHVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCbmNtVmxkQ0E5SUdaMWJtTjBhVzl1S0dkeVpXVjBhVzVuTENCdVlXMWxLU0I3SUhKbGRIVnliaUJuY21WbGRHbHVaeUFySUNjZ0p5QXJJRzVoYldVN0lIMDdYRzRnSUNBcUlIWmhjaUJvYVNBOUlGOHVjR0Z5ZEdsaGJDaG5jbVZsZEN3Z0oyaHBKeWs3WEc0Z0lDQXFJR2hwS0NkdGIyVW5LVHRjYmlBZ0lDb2dMeThnUFQ0Z0oyaHBJRzF2WlNkY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlIQmhjblJwWVd3b1puVnVZeWtnZTF4dUlDQWdJSEpsZEhWeWJpQmpjbVZoZEdWQ2IzVnVaQ2htZFc1akxDQnpiR2xqWlNoaGNtZDFiV1Z1ZEhNc0lERXBLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCVWFHbHpJRzFsZEdodlpDQnBjeUJ6YVcxcGJHRnlJSFJ2SUdCZkxuQmhjblJwWVd4Z0xDQmxlR05sY0hRZ2RHaGhkQ0JnY0dGeWRHbGhiR0FnWVhKbmRXMWxiblJ6SUdGeVpWeHVJQ0FnS2lCaGNIQmxibVJsWkNCMGJ5QjBhRzl6WlNCd1lYTnpaV1FnZEc4Z2RHaGxJRzVsZHlCbWRXNWpkR2x2Ymk1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1JuVnVZM1JwYjI1elhHNGdJQ0FxSUVCd1lYSmhiU0I3Um5WdVkzUnBiMjU5SUdaMWJtTWdWR2hsSUdaMWJtTjBhVzl1SUhSdklIQmhjblJwWVd4c2VTQmhjSEJzZVNCaGNtZDFiV1Z1ZEhNZ2RHOHVYRzRnSUNBcUlFQndZWEpoYlNCN1RXbDRaV1I5SUZ0aGNtY3hMQ0JoY21jeUxDQXVMaTVkSUVGeVozVnRaVzUwY3lCMGJ5QmlaU0J3WVhKMGFXRnNiSGtnWVhCd2JHbGxaQzVjYmlBZ0lDb2dRSEpsZEhWeWJuTWdlMFoxYm1OMGFXOXVmU0JTWlhSMWNtNXpJSFJvWlNCdVpYY2djR0Z5ZEdsaGJHeDVJR0Z3Y0d4cFpXUWdablZ1WTNScGIyNHVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCa1pXWmhkV3gwYzBSbFpYQWdQU0JmTG5CaGNuUnBZV3hTYVdkb2RDaGZMbTFsY21kbExDQmZMbVJsWm1GMWJIUnpLVHRjYmlBZ0lDcGNiaUFnSUNvZ2RtRnlJRzl3ZEdsdmJuTWdQU0I3WEc0Z0lDQXFJQ0FnSjNaaGNtbGhZbXhsSnpvZ0oyUmhkR0VuTEZ4dUlDQWdLaUFnSUNkcGJYQnZjblJ6SnpvZ2V5QW5hbkVuT2lBa0lIMWNiaUFnSUNvZ2ZUdGNiaUFnSUNwY2JpQWdJQ29nWkdWbVlYVnNkSE5FWldWd0tHOXdkR2x2Ym5Nc0lGOHVkR1Z0Y0d4aGRHVlRaWFIwYVc1bmN5azdYRzRnSUNBcVhHNGdJQ0FxSUc5d2RHbHZibk11ZG1GeWFXRmliR1ZjYmlBZ0lDb2dMeThnUFQ0Z0oyUmhkR0VuWEc0Z0lDQXFYRzRnSUNBcUlHOXdkR2x2Ym5NdWFXMXdiM0owYzF4dUlDQWdLaUF2THlBOVBpQjdJQ2RmSnpvZ1h5d2dKMnB4SnpvZ0pDQjlYRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUJ3WVhKMGFXRnNVbWxuYUhRb1puVnVZeWtnZTF4dUlDQWdJSEpsZEhWeWJpQmpjbVZoZEdWQ2IzVnVaQ2htZFc1akxDQnpiR2xqWlNoaGNtZDFiV1Z1ZEhNc0lERXBMQ0J1ZFd4c0xDQnBibVJwWTJGMGIzSlBZbXBsWTNRcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRU55WldGMFpYTWdZU0JtZFc1amRHbHZiaUIwYUdGMExDQjNhR1Z1SUdWNFpXTjFkR1ZrTENCM2FXeHNJRzl1YkhrZ1kyRnNiQ0IwYUdVZ1lHWjFibU5nWEc0Z0lDQXFJR1oxYm1OMGFXOXVJR0YwSUcxdmMzUWdiMjVqWlNCd1pYSWdaWFpsY25rZ1lIZGhhWFJnSUcxcGJHeHBjMlZqYjI1a2N5NGdTV1lnZEdobElIUm9jbTkwZEd4bFpGeHVJQ0FnS2lCbWRXNWpkR2x2YmlCcGN5QnBiblp2YTJWa0lHMXZjbVVnZEdoaGJpQnZibU5sSUdSMWNtbHVaeUIwYUdVZ1lIZGhhWFJnSUhScGJXVnZkWFFzSUdCbWRXNWpZQ0IzYVd4c1hHNGdJQ0FxSUdGc2MyOGdZbVVnWTJGc2JHVmtJRzl1SUhSb1pTQjBjbUZwYkdsdVp5QmxaR2RsSUc5bUlIUm9aU0IwYVcxbGIzVjBMaUJUZFdKelpYRjFaVzUwSUdOaGJHeHpJSFJ2SUhSb1pWeHVJQ0FnS2lCMGFISnZkSFJzWldRZ1puVnVZM1JwYjI0Z2QybHNiQ0J5WlhSMWNtNGdkR2hsSUhKbGMzVnNkQ0J2WmlCMGFHVWdiR0Z6ZENCZ1puVnVZMkFnWTJGc2JDNWNiaUFnSUNwY2JpQWdJQ29nUUhOMFlYUnBZMXh1SUNBZ0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNBZ0tpQkFZMkYwWldkdmNua2dSblZ1WTNScGIyNXpYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHWjFibU1nVkdobElHWjFibU4wYVc5dUlIUnZJSFJvY205MGRHeGxMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwNTFiV0psY24wZ2QyRnBkQ0JVYUdVZ2JuVnRZbVZ5SUc5bUlHMXBiR3hwYzJWamIyNWtjeUIwYnlCMGFISnZkSFJzWlNCbGVHVmpkWFJwYjI1eklIUnZMbHh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdSblZ1WTNScGIyNTlJRkpsZEhWeWJuTWdkR2hsSUc1bGR5QjBhSEp2ZEhSc1pXUWdablZ1WTNScGIyNHVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCMGFISnZkSFJzWldRZ1BTQmZMblJvY205MGRHeGxLSFZ3WkdGMFpWQnZjMmwwYVc5dUxDQXhNREFwTzF4dUlDQWdLaUJxVVhWbGNua29kMmx1Wkc5M0tTNXZiaWduYzJOeWIyeHNKeXdnZEdoeWIzUjBiR1ZrS1R0Y2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlIUm9jbTkwZEd4bEtHWjFibU1zSUhkaGFYUXBJSHRjYmlBZ0lDQjJZWElnWVhKbmN5eGNiaUFnSUNBZ0lDQWdjbVZ6ZFd4MExGeHVJQ0FnSUNBZ0lDQjBhR2x6UVhKbkxGeHVJQ0FnSUNBZ0lDQjBhVzFsYjNWMFNXUXNYRzRnSUNBZ0lDQWdJR3hoYzNSRFlXeHNaV1FnUFNBd08xeHVYRzRnSUNBZ1puVnVZM1JwYjI0Z2RISmhhV3hwYm1kRFlXeHNLQ2tnZTF4dUlDQWdJQ0FnYkdGemRFTmhiR3hsWkNBOUlHNWxkeUJFWVhSbE8xeHVJQ0FnSUNBZ2RHbHRaVzkxZEVsa0lEMGdiblZzYkR0Y2JpQWdJQ0FnSUhKbGMzVnNkQ0E5SUdaMWJtTXVZWEJ3Ykhrb2RHaHBjMEZ5Wnl3Z1lYSm5jeWs3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lIWmhjaUJ1YjNjZ1BTQnVaWGNnUkdGMFpTeGNiaUFnSUNBZ0lDQWdJQ0J5WlcxaGFXNXBibWNnUFNCM1lXbDBJQzBnS0c1dmR5QXRJR3hoYzNSRFlXeHNaV1FwTzF4dVhHNGdJQ0FnSUNCaGNtZHpJRDBnWVhKbmRXMWxiblJ6TzF4dUlDQWdJQ0FnZEdocGMwRnlaeUE5SUhSb2FYTTdYRzVjYmlBZ0lDQWdJR2xtSUNoeVpXMWhhVzVwYm1jZ1BEMGdNQ2tnZTF4dUlDQWdJQ0FnSUNCamJHVmhjbFJwYldWdmRYUW9kR2x0Wlc5MWRFbGtLVHRjYmlBZ0lDQWdJQ0FnZEdsdFpXOTFkRWxrSUQwZ2JuVnNiRHRjYmlBZ0lDQWdJQ0FnYkdGemRFTmhiR3hsWkNBOUlHNXZkenRjYmlBZ0lDQWdJQ0FnY21WemRXeDBJRDBnWm5WdVl5NWhjSEJzZVNoMGFHbHpRWEpuTENCaGNtZHpLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJR1ZzYzJVZ2FXWWdLQ0YwYVcxbGIzVjBTV1FwSUh0Y2JpQWdJQ0FnSUNBZ2RHbHRaVzkxZEVsa0lEMGdjMlYwVkdsdFpXOTFkQ2gwY21GcGJHbHVaME5oYkd3c0lISmxiV0ZwYm1sdVp5azdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4dUlDQWdJSDA3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1EzSmxZWFJsY3lCaElHWjFibU4wYVc5dUlIUm9ZWFFnY0dGemMyVnpJR0IyWVd4MVpXQWdkRzhnZEdobElHQjNjbUZ3Y0dWeVlDQm1kVzVqZEdsdmJpQmhjeUJwZEhOY2JpQWdJQ29nWm1seWMzUWdZWEpuZFcxbGJuUXVJRUZrWkdsMGFXOXVZV3dnWVhKbmRXMWxiblJ6SUhCaGMzTmxaQ0IwYnlCMGFHVWdablZ1WTNScGIyNGdZWEpsSUdGd2NHVnVaR1ZrWEc0Z0lDQXFJSFJ2SUhSb2IzTmxJSEJoYzNObFpDQjBieUIwYUdVZ1lIZHlZWEJ3WlhKZ0lHWjFibU4wYVc5dUxpQlVhR1VnWUhkeVlYQndaWEpnSUdseklHVjRaV04xZEdWa0lIZHBkR2hjYmlBZ0lDb2dkR2hsSUdCMGFHbHpZQ0JpYVc1a2FXNW5JRzltSUhSb1pTQmpjbVZoZEdWa0lHWjFibU4wYVc5dUxseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQkdkVzVqZEdsdmJuTmNiaUFnSUNvZ1FIQmhjbUZ0SUh0TmFYaGxaSDBnZG1Gc2RXVWdWR2hsSUhaaGJIVmxJSFJ2SUhkeVlYQXVYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlIZHlZWEJ3WlhJZ1ZHaGxJSGR5WVhCd1pYSWdablZ1WTNScGIyNHVYRzRnSUNBcUlFQnlaWFIxY201eklIdEdkVzVqZEdsdmJuMGdVbVYwZFhKdWN5QjBhR1VnYm1WM0lHWjFibU4wYVc5dUxseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQjJZWElnYUdWc2JHOGdQU0JtZFc1amRHbHZiaWh1WVcxbEtTQjdJSEpsZEhWeWJpQW5hR1ZzYkc4Z0p5QXJJRzVoYldVN0lIMDdYRzRnSUNBcUlHaGxiR3h2SUQwZ1h5NTNjbUZ3S0dobGJHeHZMQ0JtZFc1amRHbHZiaWhtZFc1aktTQjdYRzRnSUNBcUlDQWdjbVYwZFhKdUlDZGlaV1p2Y21Vc0lDY2dLeUJtZFc1aktDZHRiMlVuS1NBcklDY3NJR0ZtZEdWeUp6dGNiaUFnSUNvZ2ZTazdYRzRnSUNBcUlHaGxiR3h2S0NrN1hHNGdJQ0FxSUM4dklEMCtJQ2RpWldadmNtVXNJR2hsYkd4dklHMXZaU3dnWVdaMFpYSW5YRzRnSUNBcUwxeHVJQ0JtZFc1amRHbHZiaUIzY21Gd0tIWmhiSFZsTENCM2NtRndjR1Z5S1NCN1hHNGdJQ0FnY21WMGRYSnVJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnZG1GeUlHRnlaM01nUFNCYmRtRnNkV1ZkTzF4dUlDQWdJQ0FnY0hWemFDNWhjSEJzZVNoaGNtZHpMQ0JoY21kMWJXVnVkSE1wTzF4dUlDQWdJQ0FnY21WMGRYSnVJSGR5WVhCd1pYSXVZWEJ3Ykhrb2RHaHBjeXdnWVhKbmN5azdYRzRnSUNBZ2ZUdGNiaUFnZlZ4dVhHNGdJQzhxTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwcUwxeHVYRzRnSUM4cUtseHVJQ0FnS2lCRGIyNTJaWEowY3lCMGFHVWdZMmhoY21GamRHVnljeUJnSm1Bc0lHQThZQ3dnWUQ1Z0xDQmdYQ0pnTENCaGJtUWdZQ2RnSUdsdUlHQnpkSEpwYm1kZ0lIUnZJSFJvWldseVhHNGdJQ0FxSUdOdmNuSmxjM0J2Ym1ScGJtY2dTRlJOVENCbGJuUnBkR2xsY3k1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQVkyRjBaV2R2Y25rZ1ZYUnBiR2wwYVdWelhHNGdJQ0FxSUVCd1lYSmhiU0I3VTNSeWFXNW5mU0J6ZEhKcGJtY2dWR2hsSUhOMGNtbHVaeUIwYnlCbGMyTmhjR1V1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHRUZEhKcGJtZDlJRkpsZEhWeWJuTWdkR2hsSUdWelkyRndaV1FnYzNSeWFXNW5MbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUJmTG1WelkyRndaU2duVFc5bExDQk1ZWEp5ZVNBbUlFTjFjbXg1SnlrN1hHNGdJQ0FxSUM4dklEMCtJQ2ROYjJVc0lFeGhjbko1SUNaaGJYQTdJRU4xY214NUoxeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdaWE5qWVhCbEtITjBjbWx1WnlrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ6ZEhKcGJtY2dQVDBnYm5Wc2JDQS9JQ2NuSURvZ0tITjBjbWx1WnlBcklDY25LUzV5WlhCc1lXTmxLSEpsVlc1bGMyTmhjR1ZrU0hSdGJDd2daWE5qWVhCbFNIUnRiRU5vWVhJcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRlJvYVhNZ1puVnVZM1JwYjI0Z2NtVjBkWEp1Y3lCMGFHVWdabWx5YzNRZ1lYSm5kVzFsYm5RZ2NHRnpjMlZrSUhSdklHbDBMbHh1SUNBZ0tseHVJQ0FnS2lCQWMzUmhkR2xqWEc0Z0lDQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JWZEdsc2FYUnBaWE5jYmlBZ0lDb2dRSEJoY21GdElIdE5hWGhsWkgwZ2RtRnNkV1VnUVc1NUlIWmhiSFZsTGx4dUlDQWdLaUJBY21WMGRYSnVjeUI3VFdsNFpXUjlJRkpsZEhWeWJuTWdZSFpoYkhWbFlDNWNiaUFnSUNvZ1FHVjRZVzF3YkdWY2JpQWdJQ3BjYmlBZ0lDb2dkbUZ5SUcxdlpTQTlJSHNnSjI1aGJXVW5PaUFuYlc5bEp5QjlPMXh1SUNBZ0tpQnRiMlVnUFQwOUlGOHVhV1JsYm5ScGRIa29iVzlsS1R0Y2JpQWdJQ29nTHk4Z1BUNGdkSEoxWlZ4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z2FXUmxiblJwZEhrb2RtRnNkV1VwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkbUZzZFdVN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRV1JrY3lCbWRXNWpkR2x2Ym5NZ2NISnZjR1Z5ZEdsbGN5QnZaaUJnYjJKcVpXTjBZQ0IwYnlCMGFHVWdZR3h2WkdGemFHQWdablZ1WTNScGIyNGdZVzVrSUdOb1lXbHVZV0pzWlZ4dUlDQWdLaUIzY21Gd2NHVnlMbHh1SUNBZ0tseHVJQ0FnS2lCQWMzUmhkR2xqWEc0Z0lDQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0lDQXFJRUJqWVhSbFoyOXllU0JWZEdsc2FYUnBaWE5jYmlBZ0lDb2dRSEJoY21GdElIdFBZbXBsWTNSOUlHOWlhbVZqZENCVWFHVWdiMkpxWldOMElHOW1JR1oxYm1OMGFXOXVJSEJ5YjNCbGNuUnBaWE1nZEc4Z1lXUmtJSFJ2SUdCc2IyUmhjMmhnTGx4dUlDQWdLaUJBWlhoaGJYQnNaVnh1SUNBZ0tseHVJQ0FnS2lCZkxtMXBlR2x1S0h0Y2JpQWdJQ29nSUNBblkyRndhWFJoYkdsNlpTYzZJR1oxYm1OMGFXOXVLSE4wY21sdVp5a2dlMXh1SUNBZ0tpQWdJQ0FnY21WMGRYSnVJSE4wY21sdVp5NWphR0Z5UVhRb01Da3VkRzlWY0hCbGNrTmhjMlVvS1NBcklITjBjbWx1Wnk1emJHbGpaU2d4S1M1MGIweHZkMlZ5UTJGelpTZ3BPMXh1SUNBZ0tpQWdJSDFjYmlBZ0lDb2dmU2s3WEc0Z0lDQXFYRzRnSUNBcUlGOHVZMkZ3YVhSaGJHbDZaU2duYlc5bEp5azdYRzRnSUNBcUlDOHZJRDArSUNkTmIyVW5YRzRnSUNBcVhHNGdJQ0FxSUY4b0oyMXZaU2NwTG1OaGNHbDBZV3hwZW1Vb0tUdGNiaUFnSUNvZ0x5OGdQVDRnSjAxdlpTZGNiaUFnSUNvdlhHNGdJR1oxYm1OMGFXOXVJRzFwZUdsdUtHOWlhbVZqZENrZ2UxeHVJQ0FnSUdadmNrVmhZMmdvWm5WdVkzUnBiMjV6S0c5aWFtVmpkQ2tzSUdaMWJtTjBhVzl1S0cxbGRHaHZaRTVoYldVcElIdGNiaUFnSUNBZ0lIWmhjaUJtZFc1aklEMGdiRzlrWVhOb1cyMWxkR2h2WkU1aGJXVmRJRDBnYjJKcVpXTjBXMjFsZEdodlpFNWhiV1ZkTzF4dVhHNGdJQ0FnSUNCc2IyUmhjMmd1Y0hKdmRHOTBlWEJsVzIxbGRHaHZaRTVoYldWZElEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQmhjbWR6SUQwZ1czUm9hWE11WDE5M2NtRndjR1ZrWDE5ZE8xeHVJQ0FnSUNBZ0lDQndkWE5vTG1Gd2NHeDVLR0Z5WjNNc0lHRnlaM1Z0Wlc1MGN5azdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnVaWGNnYkc5a1lYTm9LR1oxYm1NdVlYQndiSGtvYkc5a1lYTm9MQ0JoY21kektTazdYRzRnSUNBZ0lDQjlPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZKbGRtVnlkSE1nZEdobElDZGZKeUIyWVhKcFlXSnNaU0IwYnlCcGRITWdjSEpsZG1sdmRYTWdkbUZzZFdVZ1lXNWtJSEpsZEhWeWJuTWdZU0J5WldabGNtVnVZMlVnZEc5Y2JpQWdJQ29nZEdobElHQnNiMlJoYzJoZ0lHWjFibU4wYVc5dUxseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQlZkR2xzYVhScFpYTmNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UwWjFibU4wYVc5dWZTQlNaWFIxY201eklIUm9aU0JnYkc5a1lYTm9ZQ0JtZFc1amRHbHZiaTVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nZG1GeUlHeHZaR0Z6YUNBOUlGOHVibTlEYjI1bWJHbGpkQ2dwTzF4dUlDQWdLaTljYmlBZ1puVnVZM1JwYjI0Z2JtOURiMjVtYkdsamRDZ3BJSHRjYmlBZ0lDQjNhVzVrYjNjdVh5QTlJRzlzWkVSaGMyZzdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVUhKdlpIVmpaWE1nWVNCeVlXNWtiMjBnYm5WdFltVnlJR0psZEhkbFpXNGdZRzFwYm1BZ1lXNWtJR0J0WVhoZ0lDaHBibU5zZFhOcGRtVXBMaUJKWmlCdmJteDVJRzl1WlZ4dUlDQWdLaUJoY21kMWJXVnVkQ0JwY3lCd1lYTnpaV1FzSUdFZ2JuVnRZbVZ5SUdKbGRIZGxaVzRnWURCZ0lHRnVaQ0IwYUdVZ1oybDJaVzRnYm5WdFltVnlJSGRwYkd3Z1ltVWdjbVYwZFhKdVpXUXVYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRR05oZEdWbmIzSjVJRlYwYVd4cGRHbGxjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwNTFiV0psY24wZ1cyMXBiajB3WFNCVWFHVWdiV2x1YVcxMWJTQndiM056YVdKc1pTQjJZV3gxWlM1Y2JpQWdJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJRnR0WVhnOU1WMGdWR2hsSUcxaGVHbHRkVzBnY0c5emMybGliR1VnZG1Gc2RXVXVYRzRnSUNBcUlFQnlaWFIxY201eklIdE9kVzFpWlhKOUlGSmxkSFZ5Ym5NZ1lTQnlZVzVrYjIwZ2JuVnRZbVZ5TGx4dUlDQWdLaUJBWlhoaGJYQnNaVnh1SUNBZ0tseHVJQ0FnS2lCZkxuSmhibVJ2YlNnd0xDQTFLVHRjYmlBZ0lDb2dMeThnUFQ0Z1lTQnVkVzFpWlhJZ1ltVjBkMlZsYmlBd0lHRnVaQ0ExWEc0Z0lDQXFYRzRnSUNBcUlGOHVjbUZ1Wkc5dEtEVXBPMXh1SUNBZ0tpQXZMeUE5UGlCaGJITnZJR0VnYm5WdFltVnlJR0psZEhkbFpXNGdNQ0JoYm1RZ05WeHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdjbUZ1Wkc5dEtHMXBiaXdnYldGNEtTQjdYRzRnSUNBZ2FXWWdLRzFwYmlBOVBTQnVkV3hzSUNZbUlHMWhlQ0E5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0J0WVhnZ1BTQXhPMXh1SUNBZ0lIMWNiaUFnSUNCdGFXNGdQU0FyYldsdUlIeDhJREE3WEc0Z0lDQWdhV1lnS0cxaGVDQTlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQnRZWGdnUFNCdGFXNDdYRzRnSUNBZ0lDQnRhVzRnUFNBd08xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdiV2x1SUNzZ1pteHZiM0lvYm1GMGFYWmxVbUZ1Wkc5dEtDa2dLaUFvS0N0dFlYZ2dmSHdnTUNrZ0xTQnRhVzRnS3lBeEtTazdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVW1WemIyeDJaWE1nZEdobElIWmhiSFZsSUc5bUlHQndjbTl3WlhKMGVXQWdiMjRnWUc5aWFtVmpkR0F1SUVsbUlHQndjbTl3WlhKMGVXQWdhWE1nWVNCbWRXNWpkR2x2Yml4Y2JpQWdJQ29nYVhRZ2QybHNiQ0JpWlNCcGJuWnZhMlZrSUdGdVpDQnBkSE1nY21WemRXeDBJSEpsZEhWeWJtVmtMQ0JsYkhObElIUm9aU0J3Y205d1pYSjBlU0IyWVd4MVpTQnBjMXh1SUNBZ0tpQnlaWFIxY201bFpDNGdTV1lnWUc5aWFtVmpkR0FnYVhNZ1ptRnNjMlY1TENCMGFHVnVJR0J1ZFd4c1lDQnBjeUJ5WlhSMWNtNWxaQzVjYmlBZ0lDcGNiaUFnSUNvZ1FITjBZWFJwWTF4dUlDQWdLaUJBYldWdFltVnlUMllnWDF4dUlDQWdLaUJBWTJGMFpXZHZjbmtnVlhScGJHbDBhV1Z6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUMkpxWldOMGZTQnZZbXBsWTNRZ1ZHaGxJRzlpYW1WamRDQjBieUJwYm5Od1pXTjBMbHh1SUNBZ0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ2NISnZjR1Z5ZEhrZ1ZHaGxJSEJ5YjNCbGNuUjVJSFJ2SUdkbGRDQjBhR1VnZG1Gc2RXVWdiMll1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHROYVhobFpIMGdVbVYwZFhKdWN5QjBhR1VnY21WemIyeDJaV1FnZG1Gc2RXVXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJSFpoY2lCdlltcGxZM1FnUFNCN1hHNGdJQ0FxSUNBZ0oyTm9aV1Z6WlNjNklDZGpjblZ0Y0dWMGN5Y3NYRzRnSUNBcUlDQWdKM04wZFdabUp6b2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQXFJQ0FnSUNCeVpYUjFjbTRnSjI1dmJuTmxibk5sSnp0Y2JpQWdJQ29nSUNCOVhHNGdJQ0FxSUgwN1hHNGdJQ0FxWEc0Z0lDQXFJRjh1Y21WemRXeDBLRzlpYW1WamRDd2dKMk5vWldWelpTY3BPMXh1SUNBZ0tpQXZMeUE5UGlBblkzSjFiWEJsZEhNblhHNGdJQ0FxWEc0Z0lDQXFJRjh1Y21WemRXeDBLRzlpYW1WamRDd2dKM04wZFdabUp5azdYRzRnSUNBcUlDOHZJRDArSUNkdWIyNXpaVzV6WlNkY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlISmxjM1ZzZENodlltcGxZM1FzSUhCeWIzQmxjblI1S1NCN1hHNGdJQ0FnZG1GeUlIWmhiSFZsSUQwZ2IySnFaV04wSUQ4Z2IySnFaV04wVzNCeWIzQmxjblI1WFNBNklIVnVaR1ZtYVc1bFpEdGNiaUFnSUNCeVpYUjFjbTRnYVhOR2RXNWpkR2x2YmloMllXeDFaU2tnUHlCdlltcGxZM1JiY0hKdmNHVnlkSGxkS0NrZ09pQjJZV3gxWlR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkJJRzFwWTNKdkxYUmxiWEJzWVhScGJtY2diV1YwYUc5a0lIUm9ZWFFnYUdGdVpHeGxjeUJoY21KcGRISmhjbmtnWkdWc2FXMXBkR1Z5Y3l3Z2NISmxjMlZ5ZG1WelhHNGdJQ0FxSUhkb2FYUmxjM0JoWTJVc0lHRnVaQ0JqYjNKeVpXTjBiSGtnWlhOallYQmxjeUJ4ZFc5MFpYTWdkMmwwYUdsdUlHbHVkR1Z5Y0c5c1lYUmxaQ0JqYjJSbExseHVJQ0FnS2x4dUlDQWdLaUJPYjNSbE9pQkpiaUIwYUdVZ1pHVjJaV3h2Y0cxbGJuUWdZblZwYkdRc0lHQmZMblJsYlhCc1lYUmxZQ0IxZEdsc2FYcGxjeUJ6YjNWeVkyVlZVa3h6SUdadmNpQmxZWE5wWlhKY2JpQWdJQ29nWkdWaWRXZG5hVzVuTGlCVFpXVWdhSFIwY0RvdkwzZDNkeTVvZEcxc05YSnZZMnR6TG1OdmJTOWxiaTkwZFhSdmNtbGhiSE12WkdWMlpXeHZjR1Z5ZEc5dmJITXZjMjkxY21ObGJXRndjeThqZEc5akxYTnZkWEpqWlhWeWJGeHVJQ0FnS2x4dUlDQWdLaUJPYjNSbE9pQk1ieTFFWVhOb0lHMWhlU0JpWlNCMWMyVmtJR2x1SUVOb2NtOXRaU0JsZUhSbGJuTnBiMjV6SUdKNUlHVnBkR2hsY2lCamNtVmhkR2x1WnlCaElHQnNiMlJoYzJnZ1kzTndZRnh1SUNBZ0tpQmlkV2xzWkNCaGJtUWdkWE5wYm1jZ2NISmxZMjl0Y0dsc1pXUWdkR1Z0Y0d4aGRHVnpMQ0J2Y2lCc2IyRmthVzVuSUV4dkxVUmhjMmdnYVc0Z1lTQnpZVzVrWW05NExseHVJQ0FnS2x4dUlDQWdLaUJHYjNJZ2JXOXlaU0JwYm1admNtMWhkR2x2YmlCdmJpQndjbVZqYjIxd2FXeHBibWNnZEdWdGNHeGhkR1Z6SUhObFpUcGNiaUFnSUNvZ2FIUjBjRG92TDJ4dlpHRnphQzVqYjIwdkkyTjFjM1J2YlMxaWRXbHNaSE5jYmlBZ0lDcGNiaUFnSUNvZ1JtOXlJRzF2Y21VZ2FXNW1iM0p0WVhScGIyNGdiMjRnUTJoeWIyMWxJR1Y0ZEdWdWMybHZiaUJ6WVc1a1ltOTRaWE1nYzJWbE9seHVJQ0FnS2lCb2RIUndPaTh2WkdWMlpXeHZjR1Z5TG1Ob2NtOXRaUzVqYjIwdmMzUmhZbXhsTDJWNGRHVnVjMmx2Ym5NdmMyRnVaR0p2ZUdsdVowVjJZV3d1YUhSdGJGeHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQlZkR2xzYVhScFpYTmNiaUFnSUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUhSbGVIUWdWR2hsSUhSbGJYQnNZWFJsSUhSbGVIUXVYRzRnSUNBcUlFQndZWEpoYlNCN1QySmxZM1I5SUdSaGRHRWdWR2hsSUdSaGRHRWdiMkpxWldOMElIVnpaV1FnZEc4Z2NHOXdkV3hoZEdVZ2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0J2Y0hScGIyNXpJRlJvWlNCdmNIUnBiMjV6SUc5aWFtVmpkQzVjYmlBZ0lDb2dJR1Z6WTJGd1pTQXRJRlJvWlNCY0ltVnpZMkZ3WlZ3aUlHUmxiR2x0YVhSbGNpQnlaV2RsZUhBdVhHNGdJQ0FxSUNCbGRtRnNkV0YwWlNBdElGUm9aU0JjSW1WMllXeDFZWFJsWENJZ1pHVnNhVzFwZEdWeUlISmxaMlY0Y0M1Y2JpQWdJQ29nSUdsdWRHVnljRzlzWVhSbElDMGdWR2hsSUZ3aWFXNTBaWEp3YjJ4aGRHVmNJaUJrWld4cGJXbDBaWElnY21WblpYaHdMbHh1SUNBZ0tpQWdjMjkxY21ObFZWSk1JQzBnVkdobElITnZkWEpqWlZWU1RDQnZaaUIwYUdVZ2RHVnRjR3hoZEdVbmN5QmpiMjF3YVd4bFpDQnpiM1Z5WTJVdVhHNGdJQ0FxSUNCMllYSnBZV0pzWlNBdElGUm9aU0JrWVhSaElHOWlhbVZqZENCMllYSnBZV0pzWlNCdVlXMWxMbHh1SUNBZ0tseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1JuVnVZM1JwYjI1OFUzUnlhVzVuZlNCU1pYUjFjbTV6SUdFZ1kyOXRjR2xzWldRZ1puVnVZM1JwYjI0Z2QyaGxiaUJ1YnlCZ1pHRjBZV0FnYjJKcVpXTjBYRzRnSUNBcUlDQnBjeUJuYVhabGJpd2daV3h6WlNCcGRDQnlaWFIxY201eklIUm9aU0JwYm5SbGNuQnZiR0YwWldRZ2RHVjRkQzVjYmlBZ0lDb2dRR1Y0WVcxd2JHVmNiaUFnSUNwY2JpQWdJQ29nTHk4Z2RYTnBibWNnWVNCamIyMXdhV3hsWkNCMFpXMXdiR0YwWlZ4dUlDQWdLaUIyWVhJZ1kyOXRjR2xzWldRZ1BTQmZMblJsYlhCc1lYUmxLQ2RvWld4c2J5QThKVDBnYm1GdFpTQWxQaWNwTzF4dUlDQWdLaUJqYjIxd2FXeGxaQ2g3SUNkdVlXMWxKem9nSjIxdlpTY2dmU2s3WEc0Z0lDQXFJQzh2SUQwK0lDZG9aV3hzYnlCdGIyVW5YRzRnSUNBcVhHNGdJQ0FxSUhaaGNpQnNhWE4wSUQwZ0p6d2xJRjh1Wm05eVJXRmphQ2h3Wlc5d2JHVXNJR1oxYm1OMGFXOXVLRzVoYldVcElIc2dKVDQ4YkdrK1BDVTlJRzVoYldVZ0pUNDhMMnhwUGp3bElIMHBPeUFsUGljN1hHNGdJQ0FxSUY4dWRHVnRjR3hoZEdVb2JHbHpkQ3dnZXlBbmNHVnZjR3hsSnpvZ1d5ZHRiMlVuTENBbmJHRnljbmtuWFNCOUtUdGNiaUFnSUNvZ0x5OGdQVDRnSnp4c2FUNXRiMlU4TDJ4cFBqeHNhVDVzWVhKeWVUd3ZiR2srSjF4dUlDQWdLbHh1SUNBZ0tpQXZMeUIxYzJsdVp5QjBhR1VnWENKbGMyTmhjR1ZjSWlCa1pXeHBiV2wwWlhJZ2RHOGdaWE5qWVhCbElFaFVUVXdnYVc0Z1pHRjBZU0J3Y205d1pYSjBlU0IyWVd4MVpYTmNiaUFnSUNvZ1h5NTBaVzF3YkdGMFpTZ25QR0krUENVdElIWmhiSFZsSUNVK1BDOWlQaWNzSUhzZ0ozWmhiSFZsSnpvZ0p6eHpZM0pwY0hRK0p5QjlLVHRjYmlBZ0lDb2dMeThnUFQ0Z0p6eGlQaVpzZER0elkzSnBjSFFtWjNRN1BDOWlQaWRjYmlBZ0lDcGNiaUFnSUNvZ0x5OGdkWE5wYm1jZ2RHaGxJRVZUTmlCa1pXeHBiV2wwWlhJZ1lYTWdZVzRnWVd4MFpYSnVZWFJwZG1VZ2RHOGdkR2hsSUdSbFptRjFiSFFnWENKcGJuUmxjbkJ2YkdGMFpWd2lJR1JsYkdsdGFYUmxjbHh1SUNBZ0tpQmZMblJsYlhCc1lYUmxLQ2RvWld4c2J5QWtleUJ1WVcxbElIMG5MQ0I3SUNkdVlXMWxKem9nSjJOMWNteDVKeUI5S1R0Y2JpQWdJQ29nTHk4Z1BUNGdKMmhsYkd4dklHTjFjbXg1SjF4dUlDQWdLbHh1SUNBZ0tpQXZMeUIxYzJsdVp5QjBhR1VnYVc1MFpYSnVZV3dnWUhCeWFXNTBZQ0JtZFc1amRHbHZiaUJwYmlCY0ltVjJZV3gxWVhSbFhDSWdaR1ZzYVcxcGRHVnljMXh1SUNBZ0tpQmZMblJsYlhCc1lYUmxLQ2M4SlNCd2NtbHVkQ2hjSW1obGJHeHZJRndpSUNzZ1pYQnBkR2hsZENrN0lDVStJU2NzSUhzZ0oyVndhWFJvWlhRbk9pQW5jM1J2YjJkbEp5QjlLVHRjYmlBZ0lDb2dMeThnUFQ0Z0oyaGxiR3h2SUhOMGIyOW5aU0VuWEc0Z0lDQXFYRzRnSUNBcUlDOHZJSFZ6YVc1bklHTjFjM1J2YlNCMFpXMXdiR0YwWlNCa1pXeHBiV2wwWlhKelhHNGdJQ0FxSUY4dWRHVnRjR3hoZEdWVFpYUjBhVzVuY3lBOUlIdGNiaUFnSUNvZ0lDQW5hVzUwWlhKd2IyeGhkR1VuT2lBdmUzc29XMXhjYzF4Y1UxMHJQeWw5ZlM5blhHNGdJQ0FxSUgwN1hHNGdJQ0FxWEc0Z0lDQXFJRjh1ZEdWdGNHeGhkR1VvSjJobGJHeHZJSHQ3SUc1aGJXVWdmWDBoSnl3Z2V5QW5ibUZ0WlNjNklDZHRkWE4wWVdOb1pTY2dmU2s3WEc0Z0lDQXFJQzh2SUQwK0lDZG9aV3hzYnlCdGRYTjBZV05vWlNFblhHNGdJQ0FxWEc0Z0lDQXFJQzh2SUhWemFXNW5JSFJvWlNCZ2MyOTFjbU5sVlZKTVlDQnZjSFJwYjI0Z2RHOGdjM0JsWTJsbWVTQmhJR04xYzNSdmJTQnpiM1Z5WTJWVlVrd2dabTl5SUhSb1pTQjBaVzF3YkdGMFpWeHVJQ0FnS2lCMllYSWdZMjl0Y0dsc1pXUWdQU0JmTG5SbGJYQnNZWFJsS0Nkb1pXeHNieUE4SlQwZ2JtRnRaU0FsUGljc0lHNTFiR3dzSUhzZ0ozTnZkWEpqWlZWU1RDYzZJQ2N2WW1GemFXTXZaM0psWlhScGJtY3Vhbk4wSnlCOUtUdGNiaUFnSUNvZ1kyOXRjR2xzWldRb1pHRjBZU2s3WEc0Z0lDQXFJQzh2SUQwK0lHWnBibVFnZEdobElITnZkWEpqWlNCdlppQmNJbWR5WldWMGFXNW5MbXB6ZEZ3aUlIVnVaR1Z5SUhSb1pTQlRiM1Z5WTJWeklIUmhZaUJ2Y2lCU1pYTnZkWEpqWlhNZ2NHRnVaV3dnYjJZZ2RHaGxJSGRsWWlCcGJuTndaV04wYjNKY2JpQWdJQ3BjYmlBZ0lDb2dMeThnZFhOcGJtY2dkR2hsSUdCMllYSnBZV0pzWldBZ2IzQjBhVzl1SUhSdklHVnVjM1Z5WlNCaElIZHBkR2d0YzNSaGRHVnRaVzUwSUdsemJpZDBJSFZ6WldRZ2FXNGdkR2hsSUdOdmJYQnBiR1ZrSUhSbGJYQnNZWFJsWEc0Z0lDQXFJSFpoY2lCamIyMXdhV3hsWkNBOUlGOHVkR1Z0Y0d4aGRHVW9KMmhwSUR3bFBTQmtZWFJoTG01aGJXVWdKVDRoSnl3Z2JuVnNiQ3dnZXlBbmRtRnlhV0ZpYkdVbk9pQW5aR0YwWVNjZ2ZTazdYRzRnSUNBcUlHTnZiWEJwYkdWa0xuTnZkWEpqWlR0Y2JpQWdJQ29nTHk4Z1BUNGdablZ1WTNScGIyNG9aR0YwWVNrZ2UxeHVJQ0FnS2lBZ0lIWmhjaUJmWDNRc0lGOWZjQ0E5SUNjbkxDQmZYMlVnUFNCZkxtVnpZMkZ3WlR0Y2JpQWdJQ29nSUNCZlgzQWdLejBnSjJocElDY2dLeUFvS0Y5ZmRDQTlJQ2dnWkdGMFlTNXVZVzFsSUNrcElEMDlJRzUxYkd3Z1B5QW5KeUE2SUY5ZmRDa2dLeUFuSVNjN1hHNGdJQ0FxSUNBZ2NtVjBkWEp1SUY5ZmNEdGNiaUFnSUNvZ2ZWeHVJQ0FnS2x4dUlDQWdLaUF2THlCMWMybHVaeUIwYUdVZ1lITnZkWEpqWldBZ2NISnZjR1Z5ZEhrZ2RHOGdhVzVzYVc1bElHTnZiWEJwYkdWa0lIUmxiWEJzWVhSbGN5Qm1iM0lnYldWaGJtbHVaMloxYkZ4dUlDQWdLaUF2THlCc2FXNWxJRzUxYldKbGNuTWdhVzRnWlhKeWIzSWdiV1Z6YzJGblpYTWdZVzVrSUdFZ2MzUmhZMnNnZEhKaFkyVmNiaUFnSUNvZ1puTXVkM0pwZEdWR2FXeGxVM2x1WXlod1lYUm9MbXB2YVc0b1kzZGtMQ0FuYW5OMExtcHpKeWtzSUNkY1hGeHVJQ0FnS2lBZ0lIWmhjaUJLVTFRZ1BTQjdYRnhjYmlBZ0lDb2dJQ0FnSUZ3aWJXRnBibHdpT2lBbklDc2dYeTUwWlcxd2JHRjBaU2h0WVdsdVZHVjRkQ2t1YzI5MWNtTmxJQ3NnSjF4Y1hHNGdJQ0FxSUNBZ2ZUdGNYRnh1SUNBZ0tpQW5LVHRjYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUhSbGJYQnNZWFJsS0hSbGVIUXNJR1JoZEdFc0lHOXdkR2x2Ym5NcElIdGNiaUFnSUNBdkx5QmlZWE5sWkNCdmJpQktiMmh1SUZKbGMybG5KM01nWUhSdGNHeGdJR2x0Y0d4bGJXVnVkR0YwYVc5dVhHNGdJQ0FnTHk4Z2FIUjBjRG92TDJWcWIyaHVMbTl5Wnk5aWJHOW5MMnBoZG1GelkzSnBjSFF0YldsamNtOHRkR1Z0Y0d4aGRHbHVaeTljYmlBZ0lDQXZMeUJoYm1RZ1RHRjFjbUVnUkc5cmRHOXliM1poSjNNZ1pHOVVMbXB6WEc0Z0lDQWdMeThnYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDI5c1lXUnZMMlJ2VkZ4dUlDQWdJSFpoY2lCelpYUjBhVzVuY3lBOUlHeHZaR0Z6YUM1MFpXMXdiR0YwWlZObGRIUnBibWR6TzF4dUlDQWdJSFJsZUhRZ2ZId2dLSFJsZUhRZ1BTQW5KeWs3WEc1Y2JpQWdJQ0F2THlCaGRtOXBaQ0J0YVhOemFXNW5JR1JsY0dWdVpHVnVZMmxsY3lCM2FHVnVJR0JwZEdWeVlYUnZjbFJsYlhCc1lYUmxZQ0JwY3lCdWIzUWdaR1ZtYVc1bFpGeHVJQ0FnSUc5d2RHbHZibk1nUFNCa1pXWmhkV3gwY3loN2ZTd2diM0IwYVc5dWN5d2djMlYwZEdsdVozTXBPMXh1WEc0Z0lDQWdkbUZ5SUdsdGNHOXlkSE1nUFNCa1pXWmhkV3gwY3loN2ZTd2diM0IwYVc5dWN5NXBiWEJ2Y25SekxDQnpaWFIwYVc1bmN5NXBiWEJ2Y25SektTeGNiaUFnSUNBZ0lDQWdhVzF3YjNKMGMwdGxlWE1nUFNCclpYbHpLR2x0Y0c5eWRITXBMRnh1SUNBZ0lDQWdJQ0JwYlhCdmNuUnpWbUZzZFdWeklEMGdkbUZzZFdWektHbHRjRzl5ZEhNcE8xeHVYRzRnSUNBZ2RtRnlJR2x6UlhaaGJIVmhkR2x1Wnl4Y2JpQWdJQ0FnSUNBZ2FXNWtaWGdnUFNBd0xGeHVJQ0FnSUNBZ0lDQnBiblJsY25CdmJHRjBaU0E5SUc5d2RHbHZibk11YVc1MFpYSndiMnhoZEdVZ2ZId2djbVZPYjAxaGRHTm9MRnh1SUNBZ0lDQWdJQ0J6YjNWeVkyVWdQU0JjSWw5ZmNDQXJQU0FuWENJN1hHNWNiaUFnSUNBdkx5QmpiMjF3YVd4bElISmxaMlY0Y0NCMGJ5QnRZWFJqYUNCbFlXTm9JR1JsYkdsdGFYUmxjbHh1SUNBZ0lIWmhjaUJ5WlVSbGJHbHRhWFJsY25NZ1BTQlNaV2RGZUhBb1hHNGdJQ0FnSUNBb2IzQjBhVzl1Y3k1bGMyTmhjR1VnZkh3Z2NtVk9iMDFoZEdOb0tTNXpiM1Z5WTJVZ0t5QW5mQ2NnSzF4dUlDQWdJQ0FnYVc1MFpYSndiMnhoZEdVdWMyOTFjbU5sSUNzZ0ozd25JQ3RjYmlBZ0lDQWdJQ2hwYm5SbGNuQnZiR0YwWlNBOVBUMGdjbVZKYm5SbGNuQnZiR0YwWlNBL0lISmxSWE5VWlcxd2JHRjBaU0E2SUhKbFRtOU5ZWFJqYUNrdWMyOTFjbU5sSUNzZ0ozd25JQ3RjYmlBZ0lDQWdJQ2h2Y0hScGIyNXpMbVYyWVd4MVlYUmxJSHg4SUhKbFRtOU5ZWFJqYUNrdWMyOTFjbU5sSUNzZ0ozd2tKMXh1SUNBZ0lDd2dKMmNuS1R0Y2JseHVJQ0FnSUhSbGVIUXVjbVZ3YkdGalpTaHlaVVJsYkdsdGFYUmxjbk1zSUdaMWJtTjBhVzl1S0cxaGRHTm9MQ0JsYzJOaGNHVldZV3gxWlN3Z2FXNTBaWEp3YjJ4aGRHVldZV3gxWlN3Z1pYTlVaVzF3YkdGMFpWWmhiSFZsTENCbGRtRnNkV0YwWlZaaGJIVmxMQ0J2Wm1aelpYUXBJSHRjYmlBZ0lDQWdJR2x1ZEdWeWNHOXNZWFJsVm1Gc2RXVWdmSHdnS0dsdWRHVnljRzlzWVhSbFZtRnNkV1VnUFNCbGMxUmxiWEJzWVhSbFZtRnNkV1VwTzF4dVhHNGdJQ0FnSUNBdkx5QmxjMk5oY0dVZ1kyaGhjbUZqZEdWeWN5QjBhR0YwSUdOaGJtNXZkQ0JpWlNCcGJtTnNkV1JsWkNCcGJpQnpkSEpwYm1jZ2JHbDBaWEpoYkhOY2JpQWdJQ0FnSUhOdmRYSmpaU0FyUFNCMFpYaDBMbk5zYVdObEtHbHVaR1Y0TENCdlptWnpaWFFwTG5KbGNHeGhZMlVvY21WVmJtVnpZMkZ3WldSVGRISnBibWNzSUdWelkyRndaVk4wY21sdVowTm9ZWElwTzF4dVhHNGdJQ0FnSUNBdkx5QnlaWEJzWVdObElHUmxiR2x0YVhSbGNuTWdkMmwwYUNCemJtbHdjR1YwYzF4dUlDQWdJQ0FnYVdZZ0tHVnpZMkZ3WlZaaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUhOdmRYSmpaU0FyUFNCY0lpY2dLMXhjYmw5ZlpTaGNJaUFySUdWelkyRndaVlpoYkhWbElDc2dYQ0lwSUN0Y1hHNG5YQ0k3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JwWmlBb1pYWmhiSFZoZEdWV1lXeDFaU2tnZTF4dUlDQWdJQ0FnSUNCcGMwVjJZV3gxWVhScGJtY2dQU0IwY25WbE8xeHVJQ0FnSUNBZ0lDQnpiM1Z5WTJVZ0t6MGdYQ0luTzF4Y2Jsd2lJQ3NnWlhaaGJIVmhkR1ZXWVd4MVpTQXJJRndpTzF4Y2JsOWZjQ0FyUFNBblhDSTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnBaaUFvYVc1MFpYSndiMnhoZEdWV1lXeDFaU2tnZTF4dUlDQWdJQ0FnSUNCemIzVnlZMlVnS3owZ1hDSW5JQ3RjWEc0b0tGOWZkQ0E5SUNoY0lpQXJJR2x1ZEdWeWNHOXNZWFJsVm1Gc2RXVWdLeUJjSWlrcElEMDlJRzUxYkd3Z1B5QW5KeUE2SUY5ZmRDa2dLMXhjYmlkY0lqdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbHVaR1Y0SUQwZ2IyWm1jMlYwSUNzZ2JXRjBZMmd1YkdWdVozUm9PMXh1WEc0Z0lDQWdJQ0F2THlCMGFHVWdTbE1nWlc1bmFXNWxJR1Z0WW1Wa1pHVmtJR2x1SUVGa2IySmxJSEJ5YjJSMVkzUnpJSEpsY1hWcGNtVnpJSEpsZEhWeWJtbHVaeUIwYUdVZ1lHMWhkR05vWUZ4dUlDQWdJQ0FnTHk4Z2MzUnlhVzVuSUdsdUlHOXlaR1Z5SUhSdklIQnliMlIxWTJVZ2RHaGxJR052Y25KbFkzUWdZRzltWm5ObGRHQWdkbUZzZFdWY2JpQWdJQ0FnSUhKbGRIVnliaUJ0WVhSamFEdGNiaUFnSUNCOUtUdGNibHh1SUNBZ0lITnZkWEpqWlNBclBTQmNJaWM3WEZ4dVhDSTdYRzVjYmlBZ0lDQXZMeUJwWmlCZ2RtRnlhV0ZpYkdWZ0lHbHpJRzV2ZENCemNHVmphV1pwWldRZ1lXNWtJSFJvWlNCMFpXMXdiR0YwWlNCamIyNTBZV2x1Y3lCY0ltVjJZV3gxWVhSbFhDSmNiaUFnSUNBdkx5QmtaV3hwYldsMFpYSnpMQ0IzY21Gd0lHRWdkMmwwYUMxemRHRjBaVzFsYm5RZ1lYSnZkVzVrSUhSb1pTQm5aVzVsY21GMFpXUWdZMjlrWlNCMGJ5QmhaR1FnZEdobFhHNGdJQ0FnTHk4Z1pHRjBZU0J2WW1wbFkzUWdkRzhnZEdobElIUnZjQ0J2WmlCMGFHVWdjMk52Y0dVZ1kyaGhhVzVjYmlBZ0lDQjJZWElnZG1GeWFXRmliR1VnUFNCdmNIUnBiMjV6TG5aaGNtbGhZbXhsTEZ4dUlDQWdJQ0FnSUNCb1lYTldZWEpwWVdKc1pTQTlJSFpoY21saFlteGxPMXh1WEc0Z0lDQWdhV1lnS0NGb1lYTldZWEpwWVdKc1pTa2dlMXh1SUNBZ0lDQWdkbUZ5YVdGaWJHVWdQU0FuYjJKcUp6dGNiaUFnSUNBZ0lITnZkWEpqWlNBOUlDZDNhWFJvSUNnbklDc2dkbUZ5YVdGaWJHVWdLeUFuS1NCN1hGeHVKeUFySUhOdmRYSmpaU0FySUNkY1hHNTlYRnh1Snp0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnWTJ4bFlXNTFjQ0JqYjJSbElHSjVJSE4wY21sd2NHbHVaeUJsYlhCMGVTQnpkSEpwYm1kelhHNGdJQ0FnYzI5MWNtTmxJRDBnS0dselJYWmhiSFZoZEdsdVp5QS9JSE52ZFhKalpTNXlaWEJzWVdObEtISmxSVzF3ZEhsVGRISnBibWRNWldGa2FXNW5MQ0FuSnlrZ09pQnpiM1Z5WTJVcFhHNGdJQ0FnSUNBdWNtVndiR0ZqWlNoeVpVVnRjSFI1VTNSeWFXNW5UV2xrWkd4bExDQW5KREVuS1Z4dUlDQWdJQ0FnTG5KbGNHeGhZMlVvY21WRmJYQjBlVk4wY21sdVoxUnlZV2xzYVc1bkxDQW5KREU3SnlrN1hHNWNiaUFnSUNBdkx5Qm1jbUZ0WlNCamIyUmxJR0Z6SUhSb1pTQm1kVzVqZEdsdmJpQmliMlI1WEc0Z0lDQWdjMjkxY21ObElEMGdKMloxYm1OMGFXOXVLQ2NnS3lCMllYSnBZV0pzWlNBcklDY3BJSHRjWEc0bklDdGNiaUFnSUNBZ0lDaG9ZWE5XWVhKcFlXSnNaU0EvSUNjbklEb2dkbUZ5YVdGaWJHVWdLeUFuSUh4OElDZ25JQ3NnZG1GeWFXRmliR1VnS3lBbklEMGdlMzBwTzF4Y2JpY3BJQ3RjYmlBZ0lDQWdJRndpZG1GeUlGOWZkQ3dnWDE5d0lEMGdKeWNzSUY5ZlpTQTlJRjh1WlhOallYQmxYQ0lnSzF4dUlDQWdJQ0FnS0dselJYWmhiSFZoZEdsdVoxeHVJQ0FnSUNBZ0lDQS9JQ2NzSUY5ZmFpQTlJRUZ5Y21GNUxuQnliM1J2ZEhsd1pTNXFiMmx1TzF4Y2JpY2dLMXh1SUNBZ0lDQWdJQ0FnSUZ3aVpuVnVZM1JwYjI0Z2NISnBiblFvS1NCN0lGOWZjQ0FyUFNCZlgyb3VZMkZzYkNoaGNtZDFiV1Z1ZEhNc0lDY25LU0I5WEZ4dVhDSmNiaUFnSUNBZ0lDQWdPaUFuTzF4Y2JpZGNiaUFnSUNBZ0lDa2dLMXh1SUNBZ0lDQWdjMjkxY21ObElDdGNiaUFnSUNBZ0lDZHlaWFIxY200Z1gxOXdYRnh1ZlNjN1hHNWNiaUFnSUNBdkx5QlZjMlVnWVNCemIzVnlZMlZWVWt3Z1ptOXlJR1ZoYzJsbGNpQmtaV0oxWjJkcGJtY2dZVzVrSUhkeVlYQWdhVzRnWVNCdGRXeDBhUzFzYVc1bElHTnZiVzFsYm5RZ2RHOWNiaUFnSUNBdkx5QmhkbTlwWkNCcGMzTjFaWE1nZDJsMGFDQk9ZWEozYUdGc0xDQkpSU0JqYjI1a2FYUnBiMjVoYkNCamIyMXdhV3hoZEdsdmJpd2dZVzVrSUhSb1pTQktVeUJsYm1kcGJtVmNiaUFnSUNBdkx5QmxiV0psWkdSbFpDQnBiaUJCWkc5aVpTQndjbTlrZFdOMGN5NWNiaUFnSUNBdkx5Qm9kSFJ3T2k4dmQzZDNMbWgwYld3MWNtOWphM011WTI5dEwyVnVMM1IxZEc5eWFXRnNjeTlrWlhabGJHOXdaWEowYjI5c2N5OXpiM1Z5WTJWdFlYQnpMeU4wYjJNdGMyOTFjbU5sZFhKc1hHNGdJQ0FnZG1GeUlITnZkWEpqWlZWU1RDQTlJQ2RjWEc0dktseGNiaTh2UUNCemIzVnlZMlZWVWt3OUp5QXJJQ2h2Y0hScGIyNXpMbk52ZFhKalpWVlNUQ0I4ZkNBbkwyeHZaR0Z6YUM5MFpXMXdiR0YwWlM5emIzVnlZMlZiSnlBcklDaDBaVzF3YkdGMFpVTnZkVzUwWlhJckt5a2dLeUFuWFNjcElDc2dKMXhjYmlvdkp6dGNibHh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0IyWVhJZ2NtVnpkV3gwSUQwZ1JuVnVZM1JwYjI0b2FXMXdiM0owYzB0bGVYTXNJQ2R5WlhSMWNtNGdKeUFySUhOdmRYSmpaU0FySUhOdmRYSmpaVlZTVENrdVlYQndiSGtvZFc1a1pXWnBibVZrTENCcGJYQnZjblJ6Vm1Gc2RXVnpLVHRjYmlBZ0lDQjlJR05oZEdOb0tHVXBJSHRjYmlBZ0lDQWdJR1V1YzI5MWNtTmxJRDBnYzI5MWNtTmxPMXh1SUNBZ0lDQWdkR2h5YjNjZ1pUdGNiaUFnSUNCOVhHNGdJQ0FnYVdZZ0tHUmhkR0VwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUW9aR0YwWVNrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUhCeWIzWnBaR1VnZEdobElHTnZiWEJwYkdWa0lHWjFibU4wYVc5dUozTWdjMjkxY21ObElIWnBZU0JwZEhNZ1lIUnZVM1J5YVc1bllDQnRaWFJvYjJRc0lHbHVYRzRnSUNBZ0x5OGdjM1Z3Y0c5eWRHVmtJR1Z1ZG1seWIyNXRaVzUwY3l3Z2IzSWdkR2hsSUdCemIzVnlZMlZnSUhCeWIzQmxjblI1SUdGeklHRWdZMjl1ZG1WdWFXVnVZMlVnWm05eVhHNGdJQ0FnTHk4Z2FXNXNhVzVwYm1jZ1kyOXRjR2xzWldRZ2RHVnRjR3hoZEdWeklHUjFjbWx1WnlCMGFHVWdZblZwYkdRZ2NISnZZMlZ6YzF4dUlDQWdJSEpsYzNWc2RDNXpiM1Z5WTJVZ1BTQnpiM1Z5WTJVN1hHNGdJQ0FnY21WMGRYSnVJSEpsYzNWc2REdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJGZUdWamRYUmxjeUIwYUdVZ1lHTmhiR3hpWVdOcllDQm1kVzVqZEdsdmJpQmdibUFnZEdsdFpYTXNJSEpsZEhWeWJtbHVaeUJoYmlCaGNuSmhlU0J2WmlCMGFHVWdjbVZ6ZFd4MGMxeHVJQ0FnS2lCdlppQmxZV05vSUdCallXeHNZbUZqYTJBZ1pYaGxZM1YwYVc5dUxpQlVhR1VnWUdOaGJHeGlZV05yWUNCcGN5QmliM1Z1WkNCMGJ5QmdkR2hwYzBGeVoyQWdZVzVrSUdsdWRtOXJaV1JjYmlBZ0lDb2dkMmwwYUNCdmJtVWdZWEpuZFcxbGJuUTdJQ2hwYm1SbGVDa3VYRzRnSUNBcVhHNGdJQ0FxSUVCemRHRjBhV05jYmlBZ0lDb2dRRzFsYldKbGNrOW1JRjljYmlBZ0lDb2dRR05oZEdWbmIzSjVJRlYwYVd4cGRHbGxjMXh1SUNBZ0tpQkFjR0Z5WVcwZ2UwNTFiV0psY24wZ2JpQlVhR1VnYm5WdFltVnlJRzltSUhScGJXVnpJSFJ2SUdWNFpXTjFkR1VnZEdobElHTmhiR3hpWVdOckxseHVJQ0FnS2lCQWNHRnlZVzBnZTBaMWJtTjBhVzl1ZlNCallXeHNZbUZqYXlCVWFHVWdablZ1WTNScGIyNGdZMkZzYkdWa0lIQmxjaUJwZEdWeVlYUnBiMjR1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdUV2w0WldSOUlGdDBhR2x6UVhKblhTQlVhR1VnWUhSb2FYTmdJR0pwYm1ScGJtY2diMllnWUdOaGJHeGlZV05yWUM1Y2JpQWdJQ29nUUhKbGRIVnlibk1nZTBGeWNtRjVmU0JTWlhSMWNtNXpJR0VnYm1WM0lHRnljbUY1SUc5bUlIUm9aU0J5WlhOMWJIUnpJRzltSUdWaFkyZ2dZR05oYkd4aVlXTnJZQ0JsZUdWamRYUnBiMjR1WEc0Z0lDQXFJRUJsZUdGdGNHeGxYRzRnSUNBcVhHNGdJQ0FxSUhaaGNpQmthV05sVW05c2JITWdQU0JmTG5ScGJXVnpLRE1zSUY4dWNHRnlkR2xoYkNoZkxuSmhibVJ2YlN3Z01Td2dOaWtwTzF4dUlDQWdLaUF2THlBOVBpQmJNeXdnTml3Z05GMWNiaUFnSUNwY2JpQWdJQ29nWHk1MGFXMWxjeWd6TENCbWRXNWpkR2x2YmlodUtTQjdJRzFoWjJVdVkyRnpkRk53Wld4c0tHNHBPeUI5S1R0Y2JpQWdJQ29nTHk4Z1BUNGdZMkZzYkhNZ1lHMWhaMlV1WTJGemRGTndaV3hzS0c0cFlDQjBhSEpsWlNCMGFXMWxjeXdnY0dGemMybHVaeUJnYm1BZ2IyWWdZREJnTENCZ01XQXNJR0Z1WkNCZ01tQWdjbVZ6Y0dWamRHbDJaV3g1WEc0Z0lDQXFYRzRnSUNBcUlGOHVkR2x0WlhNb015d2dablZ1WTNScGIyNG9iaWtnZXlCMGFHbHpMbU5oYzNRb2JpazdJSDBzSUcxaFoyVXBPMXh1SUNBZ0tpQXZMeUE5UGlCaGJITnZJR05oYkd4eklHQnRZV2RsTG1OaGMzUlRjR1ZzYkNodUtXQWdkR2h5WldVZ2RHbHRaWE5jYmlBZ0lDb3ZYRzRnSUdaMWJtTjBhVzl1SUhScGJXVnpLRzRzSUdOaGJHeGlZV05yTENCMGFHbHpRWEpuS1NCN1hHNGdJQ0FnYmlBOUlDdHVJSHg4SURBN1hHNGdJQ0FnZG1GeUlHbHVaR1Y0SUQwZ0xURXNYRzRnSUNBZ0lDQWdJSEpsYzNWc2RDQTlJRUZ5Y21GNUtHNHBPMXh1WEc0Z0lDQWdkMmhwYkdVZ0tDc3JhVzVrWlhnZ1BDQnVLU0I3WEc0Z0lDQWdJQ0J5WlhOMWJIUmJhVzVrWlhoZElEMGdZMkZzYkdKaFkyc3VZMkZzYkNoMGFHbHpRWEpuTENCcGJtUmxlQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1ZHaGxJRzl3Y0c5emFYUmxJRzltSUdCZkxtVnpZMkZ3WldBc0lIUm9hWE1nYldWMGFHOWtJR052Ym5abGNuUnpJSFJvWlNCSVZFMU1JR1Z1ZEdsMGFXVnpYRzRnSUNBcUlHQW1ZVzF3TzJBc0lHQW1iSFE3WUN3Z1lDWm5kRHRnTENCZ0puRjFiM1E3WUN3Z1lXNWtJR0FtSXpNNU8yQWdhVzRnWUhOMGNtbHVaMkFnZEc4Z2RHaGxhWEpjYmlBZ0lDb2dZMjl5Y21WemNHOXVaR2x1WnlCamFHRnlZV04wWlhKekxseHVJQ0FnS2x4dUlDQWdLaUJBYzNSaGRHbGpYRzRnSUNBcUlFQnRaVzFpWlhKUFppQmZYRzRnSUNBcUlFQmpZWFJsWjI5eWVTQlZkR2xzYVhScFpYTmNiaUFnSUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUhOMGNtbHVaeUJVYUdVZ2MzUnlhVzVuSUhSdklIVnVaWE5qWVhCbExseHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1UzUnlhVzVuZlNCU1pYUjFjbTV6SUhSb1pTQjFibVZ6WTJGd1pXUWdjM1J5YVc1bkxseHVJQ0FnS2lCQVpYaGhiWEJzWlZ4dUlDQWdLbHh1SUNBZ0tpQmZMblZ1WlhOallYQmxLQ2ROYjJVc0lFeGhjbko1SUNaaGJYQTdJRU4xY214NUp5azdYRzRnSUNBcUlDOHZJRDArSUNkTmIyVXNJRXhoY25KNUlDWWdRM1Z5YkhrblhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQjFibVZ6WTJGd1pTaHpkSEpwYm1jcElIdGNiaUFnSUNCeVpYUjFjbTRnYzNSeWFXNW5JRDA5SUc1MWJHd2dQeUFuSnlBNklDaHpkSEpwYm1jZ0t5QW5KeWt1Y21Wd2JHRmpaU2h5WlVWelkyRndaV1JJZEcxc0xDQjFibVZ6WTJGd1pVaDBiV3hEYUdGeUtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJIWlc1bGNtRjBaWE1nWVNCMWJtbHhkV1VnU1VRdUlFbG1JR0J3Y21WbWFYaGdJR2x6SUhCaGMzTmxaQ3dnZEdobElFbEVJSGRwYkd3Z1ltVWdZWEJ3Wlc1a1pXUWdkRzhnYVhRdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ6ZEdGMGFXTmNiaUFnSUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFnSUNvZ1FHTmhkR1ZuYjNKNUlGVjBhV3hwZEdsbGMxeHVJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnVzNCeVpXWnBlRjBnVkdobElIWmhiSFZsSUhSdklIQnlaV1pwZUNCMGFHVWdTVVFnZDJsMGFDNWNiaUFnSUNvZ1FISmxkSFZ5Ym5NZ2UxTjBjbWx1WjMwZ1VtVjBkWEp1Y3lCMGFHVWdkVzVwY1hWbElFbEVMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUJmTG5WdWFYRjFaVWxrS0NkamIyNTBZV04wWHljcE8xeHVJQ0FnS2lBdkx5QTlQaUFuWTI5dWRHRmpkRjh4TURRblhHNGdJQ0FxWEc0Z0lDQXFJRjh1ZFc1cGNYVmxTV1FvS1R0Y2JpQWdJQ29nTHk4Z1BUNGdKekV3TlNkY2JpQWdJQ292WEc0Z0lHWjFibU4wYVc5dUlIVnVhWEYxWlVsa0tIQnlaV1pwZUNrZ2UxeHVJQ0FnSUhaaGNpQnBaQ0E5SUNzcmFXUkRiM1Z1ZEdWeU8xeHVJQ0FnSUhKbGRIVnliaUFvY0hKbFptbDRJRDA5SUc1MWJHd2dQeUFuSnlBNklIQnlaV1pwZUNBcklDY25LU0FySUdsa08xeHVJQ0I5WEc1Y2JpQWdMeW90TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFNvdlhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVsdWRtOXJaWE1nWUdsdWRHVnlZMlZ3ZEc5eVlDQjNhWFJvSUhSb1pTQmdkbUZzZFdWZ0lHRnpJSFJvWlNCbWFYSnpkQ0JoY21kMWJXVnVkQ3dnWVc1a0lIUm9aVzVjYmlBZ0lDb2djbVYwZFhKdWN5QmdkbUZzZFdWZ0xpQlVhR1VnY0hWeWNHOXpaU0J2WmlCMGFHbHpJRzFsZEdodlpDQnBjeUIwYnlCY0luUmhjQ0JwYm5SdlhDSWdZU0J0WlhSb2IyUWdZMmhoYVc0c1hHNGdJQ0FxSUdsdUlHOXlaR1Z5SUhSdklIQmxjbVp2Y20wZ2IzQmxjbUYwYVc5dWN5QnZiaUJwYm5SbGNtMWxaR2xoZEdVZ2NtVnpkV3gwY3lCM2FYUm9hVzRnZEdobElHTm9ZV2x1TGx4dUlDQWdLbHh1SUNBZ0tpQkFjM1JoZEdsalhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCRGFHRnBibWx1WjF4dUlDQWdLaUJBY0dGeVlXMGdlMDFwZUdWa2ZTQjJZV3gxWlNCVWFHVWdkbUZzZFdVZ2RHOGdjR0Z6Y3lCMGJ5QmdhVzUwWlhKalpYQjBiM0pnTGx4dUlDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0JwYm5SbGNtTmxjSFJ2Y2lCVWFHVWdablZ1WTNScGIyNGdkRzhnYVc1MmIydGxMbHh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdUV2w0WldSOUlGSmxkSFZ5Ym5NZ1lIWmhiSFZsWUM1Y2JpQWdJQ29nUUdWNFlXMXdiR1ZjYmlBZ0lDcGNiaUFnSUNvZ1h5aGJNU3dnTWl3Z015d2dORjBwWEc0Z0lDQXFJQ0F1Wm1sc2RHVnlLR1oxYm1OMGFXOXVLRzUxYlNrZ2V5QnlaWFIxY200Z2JuVnRJQ1VnTWlBOVBTQXdPeUI5S1Z4dUlDQWdLaUFnTG5SaGNDaGhiR1Z5ZENsY2JpQWdJQ29nSUM1dFlYQW9ablZ1WTNScGIyNG9iblZ0S1NCN0lISmxkSFZ5YmlCdWRXMGdLaUJ1ZFcwN0lIMHBYRzRnSUNBcUlDQXVkbUZzZFdVb0tUdGNiaUFnSUNvZ0x5OGdQVDRnTHk4Z1d6SXNJRFJkSUNoaGJHVnlkR1ZrS1Z4dUlDQWdLaUF2THlBOVBpQmJOQ3dnTVRaZFhHNGdJQ0FxTDF4dUlDQm1kVzVqZEdsdmJpQjBZWEFvZG1Gc2RXVXNJR2x1ZEdWeVkyVndkRzl5S1NCN1hHNGdJQ0FnYVc1MFpYSmpaWEIwYjNJb2RtRnNkV1VwTzF4dUlDQWdJSEpsZEhWeWJpQjJZV3gxWlR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlFjbTlrZFdObGN5QjBhR1VnWUhSdlUzUnlhVzVuWUNCeVpYTjFiSFFnYjJZZ2RHaGxJSGR5WVhCd1pXUWdkbUZzZFdVdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ1WVcxbElIUnZVM1J5YVc1blhHNGdJQ0FxSUVCdFpXMWlaWEpQWmlCZlhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCRGFHRnBibWx1WjF4dUlDQWdLaUJBY21WMGRYSnVjeUI3VTNSeWFXNW5mU0JTWlhSMWNtNXpJSFJvWlNCemRISnBibWNnY21WemRXeDBMbHh1SUNBZ0tpQkFaWGhoYlhCc1pWeHVJQ0FnS2x4dUlDQWdLaUJmS0ZzeExDQXlMQ0F6WFNrdWRHOVRkSEpwYm1jb0tUdGNiaUFnSUNvZ0x5OGdQVDRnSnpFc01pd3pKMXh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnZDNKaGNIQmxjbFJ2VTNSeWFXNW5LQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw5ZmQzSmhjSEJsWkY5ZklDc2dKeWM3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1JYaDBjbUZqZEhNZ2RHaGxJSGR5WVhCd1pXUWdkbUZzZFdVdVhHNGdJQ0FxWEc0Z0lDQXFJRUJ1WVcxbElIWmhiSFZsVDJaY2JpQWdJQ29nUUcxbGJXSmxjazltSUY5Y2JpQWdJQ29nUUdGc2FXRnpJSFpoYkhWbFhHNGdJQ0FxSUVCallYUmxaMjl5ZVNCRGFHRnBibWx1WjF4dUlDQWdLaUJBY21WMGRYSnVjeUI3VFdsNFpXUjlJRkpsZEhWeWJuTWdkR2hsSUhkeVlYQndaV1FnZG1Gc2RXVXVYRzRnSUNBcUlFQmxlR0Z0Y0d4bFhHNGdJQ0FxWEc0Z0lDQXFJRjhvV3pFc0lESXNJRE5kS1M1MllXeDFaVTltS0NrN1hHNGdJQ0FxSUM4dklEMCtJRnN4TENBeUxDQXpYVnh1SUNBZ0tpOWNiaUFnWm5WdVkzUnBiMjRnZDNKaGNIQmxjbFpoYkhWbFQyWW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDE5M2NtRndjR1ZrWDE4N1hHNGdJSDFjYmx4dUlDQXZLaTB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0S2k5Y2JseHVJQ0F2THlCaFpHUWdablZ1WTNScGIyNXpJSFJvWVhRZ2NtVjBkWEp1SUhkeVlYQndaV1FnZG1Gc2RXVnpJSGRvWlc0Z1kyaGhhVzVwYm1kY2JpQWdiRzlrWVhOb0xtRm1kR1Z5SUQwZ1lXWjBaWEk3WEc0Z0lHeHZaR0Z6YUM1aGMzTnBaMjRnUFNCaGMzTnBaMjQ3WEc0Z0lHeHZaR0Z6YUM1aGRDQTlJR0YwTzF4dUlDQnNiMlJoYzJndVltbHVaQ0E5SUdKcGJtUTdYRzRnSUd4dlpHRnphQzVpYVc1a1FXeHNJRDBnWW1sdVpFRnNiRHRjYmlBZ2JHOWtZWE5vTG1KcGJtUkxaWGtnUFNCaWFXNWtTMlY1TzF4dUlDQnNiMlJoYzJndVkyOXRjR0ZqZENBOUlHTnZiWEJoWTNRN1hHNGdJR3h2WkdGemFDNWpiMjF3YjNObElEMGdZMjl0Y0c5elpUdGNiaUFnYkc5a1lYTm9MbU52ZFc1MFFua2dQU0JqYjNWdWRFSjVPMXh1SUNCc2IyUmhjMmd1WkdWaWIzVnVZMlVnUFNCa1pXSnZkVzVqWlR0Y2JpQWdiRzlrWVhOb0xtUmxabUYxYkhSeklEMGdaR1ZtWVhWc2RITTdYRzRnSUd4dlpHRnphQzVrWldabGNpQTlJR1JsWm1WeU8xeHVJQ0JzYjJSaGMyZ3VaR1ZzWVhrZ1BTQmtaV3hoZVR0Y2JpQWdiRzlrWVhOb0xtUnBabVpsY21WdVkyVWdQU0JrYVdabVpYSmxibU5sTzF4dUlDQnNiMlJoYzJndVptbHNkR1Z5SUQwZ1ptbHNkR1Z5TzF4dUlDQnNiMlJoYzJndVpteGhkSFJsYmlBOUlHWnNZWFIwWlc0N1hHNGdJR3h2WkdGemFDNW1iM0pGWVdOb0lEMGdabTl5UldGamFEdGNiaUFnYkc5a1lYTm9MbVp2Y2tsdUlEMGdabTl5U1c0N1hHNGdJR3h2WkdGemFDNW1iM0pQZDI0Z1BTQm1iM0pQZDI0N1hHNGdJR3h2WkdGemFDNW1kVzVqZEdsdmJuTWdQU0JtZFc1amRHbHZibk03WEc0Z0lHeHZaR0Z6YUM1bmNtOTFjRUo1SUQwZ1ozSnZkWEJDZVR0Y2JpQWdiRzlrWVhOb0xtbHVhWFJwWVd3Z1BTQnBibWwwYVdGc08xeHVJQ0JzYjJSaGMyZ3VhVzUwWlhKelpXTjBhVzl1SUQwZ2FXNTBaWEp6WldOMGFXOXVPMXh1SUNCc2IyUmhjMmd1YVc1MlpYSjBJRDBnYVc1MlpYSjBPMXh1SUNCc2IyUmhjMmd1YVc1MmIydGxJRDBnYVc1MmIydGxPMXh1SUNCc2IyUmhjMmd1YTJWNWN5QTlJR3RsZVhNN1hHNGdJR3h2WkdGemFDNXRZWEFnUFNCdFlYQTdYRzRnSUd4dlpHRnphQzV0WVhnZ1BTQnRZWGc3WEc0Z0lHeHZaR0Z6YUM1dFpXMXZhWHBsSUQwZ2JXVnRiMmw2WlR0Y2JpQWdiRzlrWVhOb0xtMWxjbWRsSUQwZ2JXVnlaMlU3WEc0Z0lHeHZaR0Z6YUM1dGFXNGdQU0J0YVc0N1hHNGdJR3h2WkdGemFDNXZZbXBsWTNRZ1BTQnZZbXBsWTNRN1hHNGdJR3h2WkdGemFDNXZiV2wwSUQwZ2IyMXBkRHRjYmlBZ2JHOWtZWE5vTG05dVkyVWdQU0J2Ym1ObE8xeHVJQ0JzYjJSaGMyZ3VjR0ZwY25NZ1BTQndZV2x5Y3p0Y2JpQWdiRzlrWVhOb0xuQmhjblJwWVd3Z1BTQndZWEowYVdGc08xeHVJQ0JzYjJSaGMyZ3VjR0Z5ZEdsaGJGSnBaMmgwSUQwZ2NHRnlkR2xoYkZKcFoyaDBPMXh1SUNCc2IyUmhjMmd1Y0dsamF5QTlJSEJwWTJzN1hHNGdJR3h2WkdGemFDNXdiSFZqYXlBOUlIQnNkV05yTzF4dUlDQnNiMlJoYzJndWNtRnVaMlVnUFNCeVlXNW5aVHRjYmlBZ2JHOWtZWE5vTG5KbGFtVmpkQ0E5SUhKbGFtVmpkRHRjYmlBZ2JHOWtZWE5vTG5KbGMzUWdQU0J5WlhOME8xeHVJQ0JzYjJSaGMyZ3VjMmgxWm1ac1pTQTlJSE5vZFdabWJHVTdYRzRnSUd4dlpHRnphQzV6YjNKMFFua2dQU0J6YjNKMFFuazdYRzRnSUd4dlpHRnphQzUwWVhBZ1BTQjBZWEE3WEc0Z0lHeHZaR0Z6YUM1MGFISnZkSFJzWlNBOUlIUm9jbTkwZEd4bE8xeHVJQ0JzYjJSaGMyZ3VkR2x0WlhNZ1BTQjBhVzFsY3p0Y2JpQWdiRzlrWVhOb0xuUnZRWEp5WVhrZ1BTQjBiMEZ5Y21GNU8xeHVJQ0JzYjJSaGMyZ3VkVzVwYjI0Z1BTQjFibWx2Ymp0Y2JpQWdiRzlrWVhOb0xuVnVhWEVnUFNCMWJtbHhPMXh1SUNCc2IyUmhjMmd1ZG1Gc2RXVnpJRDBnZG1Gc2RXVnpPMXh1SUNCc2IyUmhjMmd1ZDJobGNtVWdQU0IzYUdWeVpUdGNiaUFnYkc5a1lYTm9MbmRwZEdodmRYUWdQU0IzYVhSb2IzVjBPMXh1SUNCc2IyUmhjMmd1ZDNKaGNDQTlJSGR5WVhBN1hHNGdJR3h2WkdGemFDNTZhWEFnUFNCNmFYQTdYRzVjYmlBZ0x5OGdZV1JrSUdGc2FXRnpaWE5jYmlBZ2JHOWtZWE5vTG1OdmJHeGxZM1FnUFNCdFlYQTdYRzRnSUd4dlpHRnphQzVrY205d0lEMGdjbVZ6ZER0Y2JpQWdiRzlrWVhOb0xtVmhZMmdnUFNCbWIzSkZZV05vTzF4dUlDQnNiMlJoYzJndVpYaDBaVzVrSUQwZ1lYTnphV2R1TzF4dUlDQnNiMlJoYzJndWJXVjBhRzlrY3lBOUlHWjFibU4wYVc5dWN6dGNiaUFnYkc5a1lYTm9Mbk5sYkdWamRDQTlJR1pwYkhSbGNqdGNiaUFnYkc5a1lYTm9MblJoYVd3Z1BTQnlaWE4wTzF4dUlDQnNiMlJoYzJndWRXNXBjWFZsSUQwZ2RXNXBjVHRjYmx4dUlDQXZMeUJoWkdRZ1puVnVZM1JwYjI1eklIUnZJR0JzYjJSaGMyZ3VjSEp2ZEc5MGVYQmxZRnh1SUNCdGFYaHBiaWhzYjJSaGMyZ3BPMXh1WEc0Z0lDOHFMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzBxTDF4dVhHNGdJQzh2SUdGa1pDQm1kVzVqZEdsdmJuTWdkR2hoZENCeVpYUjFjbTRnZFc1M2NtRndjR1ZrSUhaaGJIVmxjeUIzYUdWdUlHTm9ZV2x1YVc1blhHNGdJR3h2WkdGemFDNWpiRzl1WlNBOUlHTnNiMjVsTzF4dUlDQnNiMlJoYzJndVkyeHZibVZFWldWd0lEMGdZMnh2Ym1WRVpXVndPMXh1SUNCc2IyUmhjMmd1WTI5dWRHRnBibk1nUFNCamIyNTBZV2x1Y3p0Y2JpQWdiRzlrWVhOb0xtVnpZMkZ3WlNBOUlHVnpZMkZ3WlR0Y2JpQWdiRzlrWVhOb0xtVjJaWEo1SUQwZ1pYWmxjbms3WEc0Z0lHeHZaR0Z6YUM1bWFXNWtJRDBnWm1sdVpEdGNiaUFnYkc5a1lYTm9MbWhoY3lBOUlHaGhjenRjYmlBZ2JHOWtZWE5vTG1sa1pXNTBhWFI1SUQwZ2FXUmxiblJwZEhrN1hHNGdJR3h2WkdGemFDNXBibVJsZUU5bUlEMGdhVzVrWlhoUFpqdGNiaUFnYkc5a1lYTm9MbWx6UVhKbmRXMWxiblJ6SUQwZ2FYTkJjbWQxYldWdWRITTdYRzRnSUd4dlpHRnphQzVwYzBGeWNtRjVJRDBnYVhOQmNuSmhlVHRjYmlBZ2JHOWtZWE5vTG1selFtOXZiR1ZoYmlBOUlHbHpRbTl2YkdWaGJqdGNiaUFnYkc5a1lYTm9MbWx6UkdGMFpTQTlJR2x6UkdGMFpUdGNiaUFnYkc5a1lYTm9MbWx6Uld4bGJXVnVkQ0E5SUdselJXeGxiV1Z1ZER0Y2JpQWdiRzlrWVhOb0xtbHpSVzF3ZEhrZ1BTQnBjMFZ0Y0hSNU8xeHVJQ0JzYjJSaGMyZ3VhWE5GY1hWaGJDQTlJR2x6UlhGMVlXdzdYRzRnSUd4dlpHRnphQzVwYzBacGJtbDBaU0E5SUdselJtbHVhWFJsTzF4dUlDQnNiMlJoYzJndWFYTkdkVzVqZEdsdmJpQTlJR2x6Um5WdVkzUnBiMjQ3WEc0Z0lHeHZaR0Z6YUM1cGMwNWhUaUE5SUdselRtRk9PMXh1SUNCc2IyUmhjMmd1YVhOT2RXeHNJRDBnYVhOT2RXeHNPMXh1SUNCc2IyUmhjMmd1YVhOT2RXMWlaWElnUFNCcGMwNTFiV0psY2p0Y2JpQWdiRzlrWVhOb0xtbHpUMkpxWldOMElEMGdhWE5QWW1wbFkzUTdYRzRnSUd4dlpHRnphQzVwYzFCc1lXbHVUMkpxWldOMElEMGdhWE5RYkdGcGJrOWlhbVZqZER0Y2JpQWdiRzlrWVhOb0xtbHpVbVZuUlhod0lEMGdhWE5TWldkRmVIQTdYRzRnSUd4dlpHRnphQzVwYzFOMGNtbHVaeUE5SUdselUzUnlhVzVuTzF4dUlDQnNiMlJoYzJndWFYTlZibVJsWm1sdVpXUWdQU0JwYzFWdVpHVm1hVzVsWkR0Y2JpQWdiRzlrWVhOb0xteGhjM1JKYm1SbGVFOW1JRDBnYkdGemRFbHVaR1Y0VDJZN1hHNGdJR3h2WkdGemFDNXRhWGhwYmlBOUlHMXBlR2x1TzF4dUlDQnNiMlJoYzJndWJtOURiMjVtYkdsamRDQTlJRzV2UTI5dVpteHBZM1E3WEc0Z0lHeHZaR0Z6YUM1eVlXNWtiMjBnUFNCeVlXNWtiMjA3WEc0Z0lHeHZaR0Z6YUM1eVpXUjFZMlVnUFNCeVpXUjFZMlU3WEc0Z0lHeHZaR0Z6YUM1eVpXUjFZMlZTYVdkb2RDQTlJSEpsWkhWalpWSnBaMmgwTzF4dUlDQnNiMlJoYzJndWNtVnpkV3gwSUQwZ2NtVnpkV3gwTzF4dUlDQnNiMlJoYzJndWMybDZaU0E5SUhOcGVtVTdYRzRnSUd4dlpHRnphQzV6YjIxbElEMGdjMjl0WlR0Y2JpQWdiRzlrWVhOb0xuTnZjblJsWkVsdVpHVjRJRDBnYzI5eWRHVmtTVzVrWlhnN1hHNGdJR3h2WkdGemFDNTBaVzF3YkdGMFpTQTlJSFJsYlhCc1lYUmxPMXh1SUNCc2IyUmhjMmd1ZFc1bGMyTmhjR1VnUFNCMWJtVnpZMkZ3WlR0Y2JpQWdiRzlrWVhOb0xuVnVhWEYxWlVsa0lEMGdkVzVwY1hWbFNXUTdYRzVjYmlBZ0x5OGdZV1JrSUdGc2FXRnpaWE5jYmlBZ2JHOWtZWE5vTG1Gc2JDQTlJR1YyWlhKNU8xeHVJQ0JzYjJSaGMyZ3VZVzU1SUQwZ2MyOXRaVHRjYmlBZ2JHOWtZWE5vTG1SbGRHVmpkQ0E5SUdacGJtUTdYRzRnSUd4dlpHRnphQzVtYjJ4a2JDQTlJSEpsWkhWalpUdGNiaUFnYkc5a1lYTm9MbVp2YkdSeUlEMGdjbVZrZFdObFVtbG5hSFE3WEc0Z0lHeHZaR0Z6YUM1cGJtTnNkV1JsSUQwZ1kyOXVkR0ZwYm5NN1hHNGdJR3h2WkdGemFDNXBibXBsWTNRZ1BTQnlaV1IxWTJVN1hHNWNiaUFnWm05eVQzZHVLR3h2WkdGemFDd2dablZ1WTNScGIyNG9ablZ1WXl3Z2JXVjBhRzlrVG1GdFpTa2dlMXh1SUNBZ0lHbG1JQ2doYkc5a1lYTm9MbkJ5YjNSdmRIbHdaVnR0WlhSb2IyUk9ZVzFsWFNrZ2UxeHVJQ0FnSUNBZ2JHOWtZWE5vTG5CeWIzUnZkSGx3WlZ0dFpYUm9iMlJPWVcxbFhTQTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdZWEpuY3lBOUlGdDBhR2x6TGw5ZmQzSmhjSEJsWkY5ZlhUdGNiaUFnSUNBZ0lDQWdjSFZ6YUM1aGNIQnNlU2hoY21kekxDQmhjbWQxYldWdWRITXBPMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdablZ1WXk1aGNIQnNlU2hzYjJSaGMyZ3NJR0Z5WjNNcE8xeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOVhHNGdJSDBwTzF4dVhHNGdJQzhxTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwcUwxeHVYRzRnSUM4dklHRmtaQ0JtZFc1amRHbHZibk1nWTJGd1lXSnNaU0J2WmlCeVpYUjFjbTVwYm1jZ2QzSmhjSEJsWkNCaGJtUWdkVzUzY21Gd2NHVmtJSFpoYkhWbGN5QjNhR1Z1SUdOb1lXbHVhVzVuWEc0Z0lHeHZaR0Z6YUM1bWFYSnpkQ0E5SUdacGNuTjBPMXh1SUNCc2IyUmhjMmd1YkdGemRDQTlJR3hoYzNRN1hHNWNiaUFnTHk4Z1lXUmtJR0ZzYVdGelpYTmNiaUFnYkc5a1lYTm9MblJoYTJVZ1BTQm1hWEp6ZER0Y2JpQWdiRzlrWVhOb0xtaGxZV1FnUFNCbWFYSnpkRHRjYmx4dUlDQm1iM0pQZDI0b2JHOWtZWE5vTENCbWRXNWpkR2x2YmlobWRXNWpMQ0J0WlhSb2IyUk9ZVzFsS1NCN1hHNGdJQ0FnYVdZZ0tDRnNiMlJoYzJndWNISnZkRzkwZVhCbFcyMWxkR2h2WkU1aGJXVmRLU0I3WEc0Z0lDQWdJQ0JzYjJSaGMyZ3VjSEp2ZEc5MGVYQmxXMjFsZEdodlpFNWhiV1ZkUFNCbWRXNWpkR2x2YmloallXeHNZbUZqYXl3Z2RHaHBjMEZ5WnlrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnY21WemRXeDBJRDBnWm5WdVl5aDBhR2x6TGw5ZmQzSmhjSEJsWkY5ZkxDQmpZV3hzWW1GamF5d2dkR2hwYzBGeVp5azdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQmpZV3hzWW1GamF5QTlQU0J1ZFd4c0lIeDhJQ2gwYUdselFYSm5JQ1ltSUhSNWNHVnZaaUJqWVd4c1ltRmpheUFoUFNBblpuVnVZM1JwYjI0bktWeHVJQ0FnSUNBZ0lDQWdJRDhnY21WemRXeDBYRzRnSUNBZ0lDQWdJQ0FnT2lCdVpYY2diRzlrWVhOb0tISmxjM1ZzZENrN1hHNGdJQ0FnSUNCOU8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1Y2JpQWdMeW90TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFNvdlhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZSb1pTQnpaVzFoYm5ScFl5QjJaWEp6YVc5dUlHNTFiV0psY2k1Y2JpQWdJQ3BjYmlBZ0lDb2dRSE4wWVhScFkxeHVJQ0FnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ0FnS2lCQWRIbHdaU0JUZEhKcGJtZGNiaUFnSUNvdlhHNGdJR3h2WkdGemFDNVdSVkpUU1U5T0lEMGdKekV1TUM0eUp6dGNibHh1SUNBdkx5QmhaR1FnWENKRGFHRnBibWx1WjF3aUlHWjFibU4wYVc5dWN5QjBieUIwYUdVZ2QzSmhjSEJsY2x4dUlDQnNiMlJoYzJndWNISnZkRzkwZVhCbExuUnZVM1J5YVc1bklEMGdkM0poY0hCbGNsUnZVM1J5YVc1bk8xeHVJQ0JzYjJSaGMyZ3VjSEp2ZEc5MGVYQmxMblpoYkhWbElEMGdkM0poY0hCbGNsWmhiSFZsVDJZN1hHNGdJR3h2WkdGemFDNXdjbTkwYjNSNWNHVXVkbUZzZFdWUFppQTlJSGR5WVhCd1pYSldZV3gxWlU5bU8xeHVYRzRnSUM4dklHRmtaQ0JnUVhKeVlYbGdJR1oxYm1OMGFXOXVjeUIwYUdGMElISmxkSFZ5YmlCMWJuZHlZWEJ3WldRZ2RtRnNkV1Z6WEc0Z0lHVmhZMmdvV3lkcWIybHVKeXdnSjNCdmNDY3NJQ2R6YUdsbWRDZGRMQ0JtZFc1amRHbHZiaWh0WlhSb2IyUk9ZVzFsS1NCN1hHNGdJQ0FnZG1GeUlHWjFibU1nUFNCaGNuSmhlVkpsWmx0dFpYUm9iMlJPWVcxbFhUdGNiaUFnSUNCc2IyUmhjMmd1Y0hKdmRHOTBlWEJsVzIxbGRHaHZaRTVoYldWZElEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdablZ1WXk1aGNIQnNlU2gwYUdsekxsOWZkM0poY0hCbFpGOWZMQ0JoY21kMWJXVnVkSE1wTzF4dUlDQWdJSDA3WEc0Z0lIMHBPMXh1WEc0Z0lDOHZJR0ZrWkNCZ1FYSnlZWGxnSUdaMWJtTjBhVzl1Y3lCMGFHRjBJSEpsZEhWeWJpQjBhR1VnZDNKaGNIQmxaQ0IyWVd4MVpWeHVJQ0JsWVdOb0tGc25jSFZ6YUNjc0lDZHlaWFpsY25ObEp5d2dKM052Y25RbkxDQW5kVzV6YUdsbWRDZGRMQ0JtZFc1amRHbHZiaWh0WlhSb2IyUk9ZVzFsS1NCN1hHNGdJQ0FnZG1GeUlHWjFibU1nUFNCaGNuSmhlVkpsWmx0dFpYUm9iMlJPWVcxbFhUdGNiaUFnSUNCc2IyUmhjMmd1Y0hKdmRHOTBlWEJsVzIxbGRHaHZaRTVoYldWZElEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0JtZFc1akxtRndjR3g1S0hSb2FYTXVYMTkzY21Gd2NHVmtYMThzSUdGeVozVnRaVzUwY3lrN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN6dGNiaUFnSUNCOU8xeHVJQ0I5S1R0Y2JseHVJQ0F2THlCaFpHUWdZRUZ5Y21GNVlDQm1kVzVqZEdsdmJuTWdkR2hoZENCeVpYUjFjbTRnYm1WM0lIZHlZWEJ3WldRZ2RtRnNkV1Z6WEc0Z0lHVmhZMmdvV3lkamIyNWpZWFFuTENBbmMyeHBZMlVuTENBbmMzQnNhV05sSjEwc0lHWjFibU4wYVc5dUtHMWxkR2h2WkU1aGJXVXBJSHRjYmlBZ0lDQjJZWElnWm5WdVl5QTlJR0Z5Y21GNVVtVm1XMjFsZEdodlpFNWhiV1ZkTzF4dUlDQWdJR3h2WkdGemFDNXdjbTkwYjNSNWNHVmJiV1YwYUc5a1RtRnRaVjBnUFNCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdVpYY2diRzlrWVhOb0tHWjFibU11WVhCd2JIa29kR2hwY3k1ZlgzZHlZWEJ3WldSZlh5d2dZWEpuZFcxbGJuUnpLU2s3WEc0Z0lDQWdmVHRjYmlBZ2ZTazdYRzVjYmlBZ0x5b3RMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMU292WEc1Y2JpQWdMeThnWlhod2IzTmxJRXh2TFVSaGMyaGNiaUFnTHk4Z2MyOXRaU0JCVFVRZ1luVnBiR1FnYjNCMGFXMXBlbVZ5Y3l3Z2JHbHJaU0J5TG1wekxDQmphR1ZqYXlCbWIzSWdjM0JsWTJsbWFXTWdZMjl1WkdsMGFXOXVJSEJoZEhSbGNtNXpJR3hwYTJVZ2RHaGxJR1p2Ykd4dmQybHVaenBjYmlBZ2FXWWdLSFI1Y0dWdlppQmtaV1pwYm1VZ1BUMGdKMloxYm1OMGFXOXVKeUFtSmlCMGVYQmxiMllnWkdWbWFXNWxMbUZ0WkNBOVBTQW5iMkpxWldOMEp5QW1KaUJrWldacGJtVXVZVzFrS1NCN1hHNGdJQ0FnTHk4Z1JYaHdiM05sSUV4dkxVUmhjMmdnZEc4Z2RHaGxJR2RzYjJKaGJDQnZZbXBsWTNRZ1pYWmxiaUIzYUdWdUlHRnVJRUZOUkNCc2IyRmtaWElnYVhNZ2NISmxjMlZ1ZENCcGJseHVJQ0FnSUM4dklHTmhjMlVnVEc4dFJHRnphQ0IzWVhNZ2FXNXFaV04wWldRZ1lua2dZU0IwYUdseVpDMXdZWEowZVNCelkzSnBjSFFnWVc1a0lHNXZkQ0JwYm5SbGJtUmxaQ0IwYnlCaVpWeHVJQ0FnSUM4dklHeHZZV1JsWkNCaGN5QmhJRzF2WkhWc1pTNGdWR2hsSUdkc2IySmhiQ0JoYzNOcFoyNXRaVzUwSUdOaGJpQmlaU0J5WlhabGNuUmxaQ0JwYmlCMGFHVWdURzh0UkdGemFGeHVJQ0FnSUM4dklHMXZaSFZzWlNCMmFXRWdhWFJ6SUdCdWIwTnZibVpzYVdOMEtDbGdJRzFsZEdodlpDNWNiaUFnSUNCM2FXNWtiM2N1WHlBOUlHeHZaR0Z6YUR0Y2JseHVJQ0FnSUM4dklHUmxabWx1WlNCaGN5QmhiaUJoYm05dWVXMXZkWE1nYlc5a2RXeGxJSE52TENCMGFISnZkV2RvSUhCaGRHZ2diV0Z3Y0dsdVp5d2dhWFFnWTJGdUlHSmxYRzRnSUNBZ0x5OGdjbVZtWlhKbGJtTmxaQ0JoY3lCMGFHVWdYQ0oxYm1SbGNuTmpiM0psWENJZ2JXOWtkV3hsWEc0Z0lDQWdaR1ZtYVc1bEtHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHeHZaR0Z6YUR0Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1SUNBdkx5QmphR1ZqYXlCbWIzSWdZR1Y0Y0c5eWRITmdJR0ZtZEdWeUlHQmtaV1pwYm1WZ0lHbHVJR05oYzJVZ1lTQmlkV2xzWkNCdmNIUnBiV2w2WlhJZ1lXUmtjeUJoYmlCZ1pYaHdiM0owYzJBZ2IySnFaV04wWEc0Z0lHVnNjMlVnYVdZZ0tHWnlaV1ZGZUhCdmNuUnpLU0I3WEc0Z0lDQWdMeThnYVc0Z1RtOWtaUzVxY3lCdmNpQlNhVzVuYjBwVElIWXdMamd1TUN0Y2JpQWdJQ0JwWmlBb1puSmxaVTF2WkhWc1pTa2dlMXh1SUNBZ0lDQWdLR1p5WldWTmIyUjFiR1V1Wlhod2IzSjBjeUE5SUd4dlpHRnphQ2t1WHlBOUlHeHZaR0Z6YUR0Y2JpQWdJQ0I5WEc0Z0lDQWdMeThnYVc0Z1RtRnlkMmhoYkNCdmNpQlNhVzVuYjBwVElIWXdMamN1TUMxY2JpQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lHWnlaV1ZGZUhCdmNuUnpMbDhnUFNCc2IyUmhjMmc3WEc0Z0lDQWdmVnh1SUNCOVhHNGdJR1ZzYzJVZ2UxeHVJQ0FnSUM4dklHbHVJR0VnWW5KdmQzTmxjaUJ2Y2lCU2FHbHViMXh1SUNBZ0lIZHBibVJ2ZHk1ZklEMGdiRzlrWVhOb08xeHVJQ0I5WEc1OUtIUm9hWE1wS1R0Y2JpSXNJaThxS2lGY2NseHVJQ0FnVTI5amFXRnNRbUZ5SUZCc2RXY3RhVzRnZGpFdU1GeHlYRzRnSUNCRllYTjVJSEJzZFdkcGJpQm1iM0lnYzJsdGNHeGxJSE52WTJsaGJDQmlZWElnZDJsMGFDQnpkWEJ3YjNKMElIWnBaR1Z2Y3l3Z1ptRmpaV0p2YjJzZ2NHRm5aWE1zSUd4cGEyVWdZVzVrSUc5MGFHVnlJSGRwWkdkbGRITmNjbHh1SUNBZ1FHeHBZMlZ1YzJVNklHNXZibVZjY2x4dUlDQWdRR0YxZEdodmNqb2dUV2xqYUdGc0lFdHZkbUZzSUNoTlNXTlJieWxjY2x4dUlDQWdRSEJ5WlhObGNuWmxYSEpjYmlvcUwxeHlYRzVjY2x4dWFXMXdiM0owSUY4Z1puSnZiU0FuYkc5a1lYTm9KenRjY2x4dVhISmNibXhsZENCamIyNW1hV2NnUFNCN1hISmNiaUFnSUNCdmNHVnVaV1JEYkdGemN6b2dYQ0p2Y0dWdVpXUmNJaXhjY2x4dUlDQWdJRnh5WEc0Z0lDQWdjR0Z1Wld4TllYaElaV2xuYUhRNklEVTFOaXhjY2x4dUlDQWdJSEJoYm1Wc1EyeGhjM002SUZ3aUxuTnZZMmxoYkMxd1lXNWxiRndpTEZ4eVhHNGdJQ0FnY0dGdVpXeEdhWGhsWkVOc1lYTnpPaUJjSW5SdmNDMW1hWGhsWkZ3aUxGeHlYRzRnSUNBZ2NHRnVaV3hRWlhKalpXNTBPaUI3WEhKY2JpQWdJQ0FnSUNBZ2FHRnNabEJ2YzJsMGFXOXVPaUF6TUN4Y2NseHVJQ0FnSUNBZ0lDQm1hWGhsWkRvZ01seHlYRzRnSUNBZ2ZTeGNjbHh1WEhKY2JpQWdJQ0J3WVc1bGJFSnZaSGxEYkdGemN6b2dYQ0l1Y0dGdVpXd3RZMjl1ZEdWdWRDMXdiR0ZqWldodmJHUmxjbHdpTEZ4eVhHNGdJQ0FnWW05NFEyeGhjM002SUZ3aUxtSnZlRndpTEZ4eVhHNGdJQ0FnWEhKY2JpQWdJQ0JwWTI5dVEyeGhjM002SUZ3aUxuTnZZMmxoYkMxcFkyOXVYQ0lzWEhKY2JpQWdJQ0JwWTI5dVFXTjBhWFpsUTJ4aGMzTTZJRndpWVdOMGFYWmxYQ0lzWEhKY2JpQWdJQ0JjY2x4dUlDQWdJR2hoYkdaUWIzTnBkR2x2YmpvZ1ptRnNjMlVzWEhKY2JpQWdJQ0JvWVd4bVVHOXphWFJwYjI1RGJHRnpjem9nWENKb1lXeG1MWEJ2YzJsMGFXOXVYQ0lzWEhKY2JseHlYRzRnSUNBZ2RHOW5aMnhsT2lCbVlXeHpaVnh5WEc1Y2NseHVmVHRjY2x4dVhISmNibU5zWVhOeklGTnZZMmxoYkVKaGNpQjdYSEpjYmx4eVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2RYTmxja052Ym1ZcElIdGNjbHh1SUNBZ0lDQWdJQ0JmTG1admNrVmhZMmdvZFhObGNrTnZibVlzSUNoMllXeDFaU3dnYTJWNUtTQTlQaUJqYjI1bWFXZGJhMlY1WFNBOUlIWmhiSFZsS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjR1Z1UW1GeUlEMGdkR2hwY3k1dmNHVnVRbUZ5TG1KcGJtUW9kR2hwY3lrN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1amJHOXpaVUpoY2lBOUlIUm9hWE11WTJ4dmMyVkNZWEl1WW1sdVpDaDBhR2x6S1R0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRGQnZjMmwwYVc5dVFuSmxZV3R3YjJsdWRITWdQU0IwYUdsekxuTmxkRkJ2YzJsMGFXOXVRbkpsWVd0d2IybHVkSE11WW1sdVpDaDBhR2x6S1R0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG1OaGJHTlFaWEpqWlc1MElEMGdkR2hwY3k1allXeGpVR1Z5WTJWdWRDNWlhVzVrS0hSb2FYTXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRGQnZjMmwwYVc5dVFuSmxZV3R3YjJsdWRITW9LVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCdmNHVnVRbUZ5S0dVcElIdGNjbHh1SUNBZ0lDQWdJQ0JzWlhRZ0pIUm9hWE1nUFNBa0tHVXVZM1Z5Y21WdWRGUmhjbWRsZENrN1hISmNiaUFnSUNBZ0lDQWdiR1YwSUhSNWNHVWdQU0FrZEdocGN5NWtZWFJoS0Z3aVltOTRYQ0lwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JsTG5OMGIzQlFjbTl3WVdkaGRHbHZiaWdwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmloamIyNW1hV2N1ZEc5bloyeGxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR2xtS0NRb1kyOXVabWxuTG5CaGJtVnNRMnhoYzNNcExtaGhjME5zWVhOektHTnZibVpwWnk1dmNHVnVaV1JEYkdGemN5a2dKaVlnSkhSb2FYTXVhR0Z6UTJ4aGMzTW9ZMjl1Wm1sbkxtbGpiMjVCWTNScGRtVkRiR0Z6Y3lrcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG1Oc2IzTmxRbUZ5S0dVcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeUJEYUdGdVoyVWdZMjlzYjNJZ1lXTnZjbkprYVc1bklHSjVJR2RwZG1WdUlHTnNZWE56WEhKY2JpQWdJQ0FnSUNBZ0pDaGpiMjVtYVdjdWNHRnVaV3hEYkdGemN5QXJJRndpSUZ3aUlDc2dZMjl1Wm1sbkxtbGpiMjVEYkdGemN5a3VjbVZ0YjNabFEyeGhjM01vWTI5dVptbG5MbWxqYjI1QlkzUnBkbVZEYkdGemN5azdYSEpjYmlBZ0lDQWdJQ0FnSkhSb2FYTXVZV1JrUTJ4aGMzTW9ZMjl1Wm1sbkxtbGpiMjVCWTNScGRtVkRiR0Z6Y3lrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklFTm9ZVzVuWlNCamIyNTBaVzUwWEhKY2JpQWdJQ0FnSUNBZ0pDaGpiMjVtYVdjdWNHRnVaV3hEYkdGemN5QXJJRndpSUZ3aUlDc2dZMjl1Wm1sbkxuQmhibVZzUW05a2VVTnNZWE56SUNzZ1hDSWdYQ0lnS3lCamIyNW1hV2N1WW05NFEyeGhjM01wTG1ocFpHVW9LVHRjY2x4dUlDQWdJQ0FnSUNBa0tHTnZibVpwWnk1d1lXNWxiRU5zWVhOeklDc2dYQ0lnWENJZ0t5QmpiMjVtYVdjdWNHRnVaV3hDYjJSNVEyeGhjM01nS3lCY0lpQXVYQ0lnS3lCMGVYQmxLUzV6YUc5M0tDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJSE5zYVdSbElHTnZiblJsYm5SY2NseHVJQ0FnSUNBZ0lDQWtLR052Ym1acFp5NXdZVzVsYkVOc1lYTnpLVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQXVZV1JrUTJ4aGMzTW9ZMjl1Wm1sbkxtOXdaVzVsWkVOc1lYTnpLVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQXVjbVZ0YjNabFEyeGhjM01vWm5WdVkzUnBiMjRnS0dsdVpHVjRMQ0JqYkdGemMwNWhiV1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlBb1kyeGhjM05PWVcxbExtMWhkR05vS0M4b1hueGNYSE1wYm1WMGQyOXlheTFjWEZNckwyY3BJSHg4SUZ0ZEtTNXFiMmx1S0NjZ0p5azdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDNWhaR1JEYkdGemN5aGNJbTVsZEhkdmNtc3RYQ0lnS3lCMGVYQmxLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCamJHOXpaVUpoY2lobEtTQjdYSEpjYmlBZ0lDQWdJQ0FnYVdZb0lTUW9ZMjl1Wm1sbkxuQmhibVZzUTJ4aGMzTXBMbWhoYzBOc1lYTnpLR052Ym1acFp5NXZjR1Z1WldSRGJHRnpjeWtwWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0pDaGpiMjVtYVdjdWNHRnVaV3hEYkdGemN5a3VjbVZ0YjNabFEyeGhjM01vWTI5dVptbG5MbTl3Wlc1bFpFTnNZWE56S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnpaWFJRYjNOcGRHbHZia0p5WldGcmNHOXBiblJ6S0NrZ2UxeHlYRzRnSUNBZ0lDQWdJR3hsZENCd1lXNWxiQ0E5SUNRb1kyOXVabWxuTG5CaGJtVnNRMnhoYzNNcE8xeHlYRzRnSUNBZ0lDQWdJR3hsZENCd1lXNWxiRUp2WkhrZ1BTQWtLR052Ym1acFp5NXdZVzVsYkVKdlpIbERiR0Z6Y3lrN1hISmNiaUFnSUNBZ0lDQWdiR1YwSUhkcGJtUnZkMGhsYVdkb2RDQTlJQ1FvZDJsdVpHOTNLUzVvWldsbmFIUW9LVHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdhR0ZzWmxCdmMybDBhVzl1SUQwZ1RXRjBhQzVtYkc5dmNpZ29jR0Z1Wld4Q2IyUjVMbWhsYVdkb2RDZ3BJQ3NnZEdocGN5NWpZV3hqVUdWeVkyVnVkQ2gzYVc1a2IzZElaV2xuYUhRc0lHTnZibVpwWnk1d1lXNWxiRkJsY21ObGJuUXVhR0ZzWmxCdmMybDBhVzl1S1NrcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCcFppQW9kMmx1Wkc5M1NHVnBaMmgwSUR3OUlHaGhiR1pRYjNOcGRHbHZiaWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J3WVc1bGJDNXlaVzF2ZG1WRGJHRnpjeWhqYjI1bWFXY3VhR0ZzWmxCdmMybDBhVzl1UTJ4aGMzTXBYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F1WVdSa1EyeGhjM01vWTI5dVptbG5MbkJoYm1Wc1JtbDRaV1JEYkdGemN5azdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J3WVc1bGJFSnZaSGt1YUdWcFoyaDBLSGRwYm1SdmQwaGxhV2RvZENrN1hISmNiaUFnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2hqYjI1bWFXY3VhR0ZzWmxCdmMybDBhVzl1SUNZbUlIZHBibVJ2ZDBobGFXZG9kQ0ErUFNCb1lXeG1VRzl6YVhScGIyNHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjR0Z1Wld3dVlXUmtRMnhoYzNNb1kyOXVabWxuTG1oaGJHWlFiM05wZEdsdmJrTnNZWE56S1Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0xuSmxiVzkyWlVOc1lYTnpLR052Ym1acFp5NXdZVzVsYkVacGVHVmtRMnhoYzNNcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdhV1lnS0hCaGJtVnNRbTlrZVM1b1pXbG5hSFFvS1NBK1BTQmpiMjVtYVdjdWNHRnVaV3hOWVhoSVpXbG5hSFFwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY0dGdVpXeENiMlI1TG1obGFXZG9kQ2hqYjI1bWFXY3VjR0Z1Wld4TllYaElaV2xuYUhRcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCallXeGpVR1Z5WTJWdWRDaDBiM1JoYkN3Z2NHVnlZMlZ1ZENrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQW9jR1Z5WTJWdWRDQXZJREV3TUNrZ0tpQjBiM1JoYkRzZ1hISmNiaUFnSUNCOVhISmNibjFjY2x4dVhISmNibVY0Y0c5eWRDQmtaV1poZFd4MElGTnZZMmxoYkVKaGNqc2lMQ0pwYlhCdmNuUWdVMjlqYVdGc1FtRnlJR1p5YjIwZ0p5NHZiVzlrZFd4bGN5OVRiMk5wWVd4Q1lYSW5PMXh5WEc1Y2NseHVKQ2htZFc1amRHbHZiaUFvS1NCN1hISmNiaUFnSUNCY2NseHVJQ0FnSUd4bGRDQmlZWElnUFNCdVpYY2dVMjlqYVdGc1FtRnlLSHRjY2x4dUlDQWdJQ0FnSUNCMGIyZG5iR1U2SUhSeWRXVXNYSEpjYmlBZ0lDQWdJQ0FnYUdGc1psQnZjMmwwYVc5dU9pQjBjblZsWEhKY2JpQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQXZMeUJ5ZFc0Z1lXWjBaWElnWkc5amRXMWxiblFnY21WaFpIa2dJQ0JjY2x4dUlDQWdJQ1FvWENJdWNHRnVaV3d0WTI5dWRHVnVkQzF3YkdGalpXaHZiR1JsY2x3aUtTNXZiaWhjSW1Oc2FXTnJYQ0lzSUNobEtTQTlQaUJsTG5OMGIzQlFjbTl3WVdkaGRHbHZiaWdwS1R0Y2NseHVJQ0FnSUNRb1hDSXVjMjlqYVdGc0xYQmhibVZzSUM1emIyTnBZV3d0YVdOdmJsd2lLUzV2YmloY0ltTnNhV05yWENJc0lHSmhjaTV2Y0dWdVFtRnlLVHRjY2x4dUlDQWdJQ1FvWENKaWIyUjVYQ0lwTG05dUtGd2lZMnhwWTJ0Y0lpd2dZbUZ5TG1Oc2IzTmxRbUZ5S1R0Y2NseHVJQ0FnSUNRb2QybHVaRzkzS1M1eVpYTnBlbVVvWW1GeUxuTmxkRkJ2YzJsMGFXOXVRbkpsWVd0d2IybHVkSE1wTzF4eVhHNTlLVHRjY2x4dUlsMTkifQ==
