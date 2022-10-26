import { contains } from "./array.js";
import { pickShallow } from "./object.js";

/**
 * Create a factory function, which can be used to inject dependencies.
 *
 * The created functions are memoized, a consecutive call of the factory
 * with the exact same inputs will return the same function instance.
 * The memoized cache is exposed on `factory.cache` and can be cleared
 * if needed.
 *
 * Example:
 *
 *     const name = 'log'
 *     const dependencies = ['config', 'typed', 'divideScalar', 'Complex']
 *
 *     export const createLog = factory(name, dependencies, ({ typed, config, divideScalar, Complex }) => {
 *       // ... create the function log here and return it
 *     }
 *
 * @param {string} name           Name of the function to be created
 * @param {string[]} dependencies The names of all required dependencies
 * @param {function} create       Callback function called with an object with all dependencies
 * @param {Object} [meta]         Optional object with meta information that will be attached
 *                                to the created factory function as property `meta`.
 * @returns {function}
 */
export function factory(name, dependencies, create, meta) {
  function assertAndCreate(scope) {
    // we only pass the requested dependencies to the factory function
    // to prevent functions to rely on dependencies that are not explicitly
    // requested.
    const deps = pickShallow(scope, dependencies.map(stripOptionalNotation));

    assertDependencies(name, dependencies, scope);

    return create(deps);
  }

  assertAndCreate.isFactory = true;
  assertAndCreate.fn = name;
  assertAndCreate.dependencies = dependencies.slice().sort();
  if (meta) {
    assertAndCreate.meta = meta;
  }

  return assertAndCreate;
}

/**
 * Sort all factories such that when loading in order, the dependencies are resolved.
 *
 * @param {Array} factories
 * @returns {Array} Returns a new array with the sorted factories.
 */
export function sortFactories(factories) {
  const factoriesByName = {};

  factories.forEach((factory) => {
    factoriesByName[factory.fn] = factory;
  });

  function containsDependency(factory, dependency) {
    // TODO: detect circular references
    if (isFactory(factory)) {
      if (contains(factory.dependencies, dependency.fn || dependency.name)) {
        return true;
      }

      if (
        factory.dependencies.some((d) =>
          containsDependency(factoriesByName[d], dependency)
        )
      ) {
        return true;
      }
    }

    return false;
  }

  const sorted = [];

  function addFactory(factory) {
    let index = 0;
    while (
      index < sorted.length &&
      !containsDependency(sorted[index], factory)
    ) {
      index++;
    }

    sorted.splice(index, 0, factory);
  }

  // sort regular factory functions
  factories.filter(isFactory).forEach(addFactory);

  // sort legacy factory functions AFTER the regular factory functions
  factories.filter((factory) => !isFactory(factory)).forEach(addFactory);

  return sorted;
}

// TODO: comment or cleanup if unused in the end
export function create(factories, scope = {}) {
  sortFactories(factories).forEach((factory) => factory(scope));

  return scope;
}

/**
 * Test whether an object is a factory. This is the case when it has
 * properties name, dependencies, and a function create.
 * @param {*} obj
 * @returns {boolean}
 */
export function isFactory(obj) {
  return (
    typeof obj === "function" &&
    typeof obj.fn === "string" &&
    Array.isArray(obj.dependencies)
  );
}

/**
 * Assert that all dependencies of a list with dependencies are available in the provided scope.
 *
 * Will throw an exception when there are dependencies missing.
 *
 * @param {string} name   Name for the function to be created. Used to generate a useful error message
 * @param {string[]} dependencies
 * @param {Object} scope
 */
export function assertDependencies(name, dependencies, scope) {
  const allDefined = dependencies
    .filter((dependency) => !isOptionalDependency(dependency)) // filter optionals
    .every((dependency) => scope[dependency] !== undefined);

  if (!allDefined) {
    const missingDependencies = dependencies.filter(
      (dependency) => scope[dependency] === undefined
    );

    // TODO: create a custom error class for this, a MathjsError or something like that
    throw new Error(
      `Cannot create function "${name}", ` +
        `some dependencies are missing: ${missingDependencies
          .map((d) => `"${d}"`)
          .join(", ")}.`
    );
  }
}

export function isOptionalDependency(dependency) {
  return dependency && dependency[0] === "?";
}

export function stripOptionalNotation(dependency) {
  return dependency && dependency[0] === "?" ? dependency.slice(1) : dependency;
}
// type checks for all known types
//
// note that:
//
// - check by duck-typing on a property like `isUnit`, instead of checking instanceof.
//   instanceof cannot be used because that would not allow to pass data from
//   one instance of math.js to another since each has it's own instance of Unit.
// - check the `isUnit` property via the constructor, so there will be no
//   matches for "fake" instances like plain objects with a property `isUnit`.
//   That is important for security reasons.
// - It must not be possible to override the type checks used internally,
//   for security reasons, so these functions are not exposed in the expression
//   parser.

export function isNumber(x) {
  return typeof x === "number";
}

export function isBigNumber(x) {
  if (!x || typeof x !== "object" || typeof x.constructor !== "function") {
    return false;
  }

  if (
    x.isBigNumber === true &&
    typeof x.constructor.prototype === "object" &&
    x.constructor.prototype.isBigNumber === true
  ) {
    return true;
  }

  if (
    typeof x.constructor.isDecimal === "function" &&
    x.constructor.isDecimal(x) === true
  ) {
    return true;
  }

  return false;
}

export function isComplex(x) {
  return (
    (x &&
      typeof x === "object" &&
      Object.getPrototypeOf(x).isComplex === true) ||
    false
  );
}

export function isFraction(x) {
  return (
    (x &&
      typeof x === "object" &&
      Object.getPrototypeOf(x).isFraction === true) ||
    false
  );
}

export function isUnit(x) {
  return (x && x.constructor.prototype.isUnit === true) || false;
}

export function isString(x) {
  return typeof x === "string";
}

export const isArray = Array.isArray;

export function isMatrix(x) {
  return (x && x.constructor.prototype.isMatrix === true) || false;
}

/**
 * Test whether a value is a collection: an Array or Matrix
 * @param {*} x
 * @returns {boolean} isCollection
 */
export function isCollection(x) {
  return Array.isArray(x) || isMatrix(x);
}

export function isDenseMatrix(x) {
  return (
    (x && x.isDenseMatrix && x.constructor.prototype.isMatrix === true) || false
  );
}

export function isSparseMatrix(x) {
  return (
    (x && x.isSparseMatrix && x.constructor.prototype.isMatrix === true) ||
    false
  );
}

export function isRange(x) {
  return (x && x.constructor.prototype.isRange === true) || false;
}

export function isIndex(x) {
  return (x && x.constructor.prototype.isIndex === true) || false;
}

export function isBoolean(x) {
  return typeof x === "boolean";
}

export function isResultSet(x) {
  return (x && x.constructor.prototype.isResultSet === true) || false;
}

export function isHelp(x) {
  return (x && x.constructor.prototype.isHelp === true) || false;
}

export function isFunction(x) {
  return typeof x === "function";
}

export function isDate(x) {
  return x instanceof Date;
}

export function isRegExp(x) {
  return x instanceof RegExp;
}

export function isObject(x) {
  return !!(
    x &&
    typeof x === "object" &&
    x.constructor === Object &&
    !isComplex(x) &&
    !isFraction(x)
  );
}

export function isNull(x) {
  return x === null;
}

export function isUndefined(x) {
  return x === undefined;
}

export function isAccessorNode(x) {
  return (
    (x &&
      x.isAccessorNode === true &&
      x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isArrayNode(x) {
  return (
    (x && x.isArrayNode === true && x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isAssignmentNode(x) {
  return (
    (x &&
      x.isAssignmentNode === true &&
      x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isBlockNode(x) {
  return (
    (x && x.isBlockNode === true && x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isConditionalNode(x) {
  return (
    (x &&
      x.isConditionalNode === true &&
      x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isConstantNode(x) {
  return (
    (x &&
      x.isConstantNode === true &&
      x.constructor.prototype.isNode === true) ||
    false
  );
}

/* Very specialized: returns true for those nodes which in the numerator of
   a fraction means that the division in that fraction has precedence over implicit
   multiplication, e.g. -2/3 x parses as (-2/3) x and 3/4 x parses as (3/4) x but
   6!/8 x parses as 6! / (8x). It is located here because it is shared between
   parse.js and OperatorNode.js (for parsing and printing, respectively).

   This should *not* be exported from mathjs, unlike most of the tests here.
   Its name does not start with 'is' to prevent utils/snapshot.js from thinking
   it should be exported.
*/
export function rule2Node(node) {
  return (
    isConstantNode(node) ||
    (isOperatorNode(node) &&
      node.args.length === 1 &&
      isConstantNode(node.args[0]) &&
      "-+~".includes(node.op))
  );
}

export function isFunctionAssignmentNode(x) {
  return (
    (x &&
      x.isFunctionAssignmentNode === true &&
      x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isFunctionNode(x) {
  return (
    (x &&
      x.isFunctionNode === true &&
      x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isIndexNode(x) {
  return (
    (x && x.isIndexNode === true && x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isNode(x) {
  return (
    (x && x.isNode === true && x.constructor.prototype.isNode === true) || false
  );
}

export function isObjectNode(x) {
  return (
    (x && x.isObjectNode === true && x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isOperatorNode(x) {
  return (
    (x &&
      x.isOperatorNode === true &&
      x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isParenthesisNode(x) {
  return (
    (x &&
      x.isParenthesisNode === true &&
      x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isRangeNode(x) {
  return (
    (x && x.isRangeNode === true && x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isSymbolNode(x) {
  return (
    (x && x.isSymbolNode === true && x.constructor.prototype.isNode === true) ||
    false
  );
}

export function isChain(x) {
  return (x && x.constructor.prototype.isChain === true) || false;
}

export function typeOf(x) {
  const t = typeof x;

  if (t === "object") {
    if (x === null) return "null";
    if (isBigNumber(x)) return "BigNumber"; // Special: weird mashup with Decimal
    if (x.constructor && x.constructor.name) return x.constructor.name;

    return "Object"; // just in case
  }

  return t; // can be 'string', 'number', 'boolean', 'function', 'bigint', ...
}
import { isCollection, isMatrix } from "./is.js";
import { IndexError } from "../error/IndexError.js";
import { arraySize } from "./array.js";
import { _switch } from "./switch.js";

/**
 * Test whether an array contains collections
 * @param {Array} array
 * @returns {boolean} Returns true when the array contains one or multiple
 *                    collections (Arrays or Matrices). Returns false otherwise.
 */
export function containsCollections(array) {
  for (let i = 0; i < array.length; i++) {
    if (isCollection(array[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Recursively loop over all elements in a given multi dimensional array
 * and invoke the callback on each of the elements.
 * @param {Array | Matrix} array
 * @param {Function} callback     The callback method is invoked with one
 *                                parameter: the current element in the array
 */
export function deepForEach(array, callback) {
  if (isMatrix(array)) {
    array = array.valueOf();
  }

  for (let i = 0, ii = array.length; i < ii; i++) {
    const value = array[i];

    if (Array.isArray(value)) {
      deepForEach(value, callback);
    } else {
      callback(value);
    }
  }
}

/**
 * Execute the callback function element wise for each element in array and any
 * nested array
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {Function} callback   The callback is called with two parameters:
 *                              value1 and value2, which contain the current
 *                              element of both arrays.
 * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
 *
 * @return {Array | Matrix} res
 */
export function deepMap(array, callback, skipZeros) {
  if (array && typeof array.map === "function") {
    // TODO: replace array.map with a for loop to improve performance
    return array.map(function (x) {
      return deepMap(x, callback, skipZeros);
    });
  } else {
    return callback(array);
  }
}

/**
 * Reduce a given matrix or array to a new matrix or
 * array with one less dimension, applying the given
 * callback in the selected dimension.
 * @param {Array | Matrix} mat
 * @param {number} dim
 * @param {Function} callback
 * @return {Array | Matrix} res
 */
export function reduce(mat, dim, callback) {
  const size = Array.isArray(mat) ? arraySize(mat) : mat.size();
  if (dim < 0 || dim >= size.length) {
    // TODO: would be more clear when throwing a DimensionError here
    throw new IndexError(dim, size.length);
  }

  if (isMatrix(mat)) {
    return mat.create(_reduce(mat.valueOf(), dim, callback));
  } else {
    return _reduce(mat, dim, callback);
  }
}

/**
 * Recursively reduce a matrix
 * @param {Array} mat
 * @param {number} dim
 * @param {Function} callback
 * @returns {Array} ret
 * @private
 */
function _reduce(mat, dim, callback) {
  let i, ret, val, tran;

  if (dim <= 0) {
    if (!Array.isArray(mat[0])) {
      val = mat[0];
      for (i = 1; i < mat.length; i++) {
        val = callback(val, mat[i]);
      }
      return val;
    } else {
      tran = _switch(mat);
      ret = [];
      for (i = 0; i < tran.length; i++) {
        ret[i] = _reduce(tran[i], dim - 1, callback);
      }
      return ret;
    }
  } else {
    ret = [];
    for (i = 0; i < mat.length; i++) {
      ret[i] = _reduce(mat[i], dim - 1, callback);
    }
    return ret;
  }
}

// TODO: document function scatter
export function scatter(
  a,
  j,
  w,
  x,
  u,
  mark,
  cindex,
  f,
  inverse,
  update,
  value
) {
  // a arrays
  const avalues = a._values;
  const aindex = a._index;
  const aptr = a._ptr;

  // vars
  let k, k0, k1, i;

  // check we need to process values (pattern matrix)
  if (x) {
    // values in j
    for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
      // row
      i = aindex[k];
      // check value exists in current j
      if (w[i] !== mark) {
        // i is new entry in j
        w[i] = mark;
        // add i to pattern of C
        cindex.push(i);
        // x(i) = A, check we need to call function this time
        if (update) {
          // copy value to workspace calling callback function
          x[i] = inverse ? f(avalues[k], value) : f(value, avalues[k]);
          // function was called on current row
          u[i] = mark;
        } else {
          // copy value to workspace
          x[i] = avalues[k];
        }
      } else {
        // i exists in C already
        x[i] = inverse ? f(avalues[k], x[i]) : f(x[i], avalues[k]);
        // function was called on current row
        u[i] = mark;
      }
    }
  } else {
    // values in j
    for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
      // row
      i = aindex[k];
      // check value exists in current j
      if (w[i] !== mark) {
        // i is new entry in j
        w[i] = mark;
        // add i to pattern of C
        cindex.push(i);
      } else {
        // indicate function was called on current row
        u[i] = mark;
      }
    }
  }
}

/**
 * Clone an object
 *
 *     clone(x)
 *
 * Can clone any primitive type, array, and object.
 * If x has a function clone, this function will be invoked to clone the object.
 *
 * @param {*} x
 * @return {*} clone
 */
export function clone(x) {
  const type = typeof x;

  // immutable primitive types
  if (
    type === "number" ||
    type === "string" ||
    type === "boolean" ||
    x === null ||
    x === undefined
  ) {
    return x;
  }

  // use clone function of the object when available
  if (typeof x.clone === "function") {
    return x.clone();
  }

  // array
  if (Array.isArray(x)) {
    return x.map(function (value) {
      return clone(value);
    });
  }

  if (x instanceof Date) return new Date(x.valueOf());
  if (isBigNumber(x)) return x; // bignumbers are immutable
  if (x instanceof RegExp) throw new TypeError("Cannot clone " + x); // TODO: clone a RegExp

  // object
  return mapObject(x, clone);
}

/**
 * Apply map to all properties of an object
 * @param {Object} object
 * @param {function} callback
 * @return {Object} Returns a copy of the object with mapped properties
 */
export function mapObject(object, callback) {
  const clone = {};

  for (const key in object) {
    if (hasOwnProperty(object, key)) {
      clone[key] = callback(object[key]);
    }
  }

  return clone;
}

/**
 * Extend object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 */
export function extend(a, b) {
  for (const prop in b) {
    if (hasOwnProperty(b, prop)) {
      a[prop] = b[prop];
    }
  }
  return a;
}

/**
 * Deep extend an object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
export function deepExtend(a, b) {
  // TODO: add support for Arrays to deepExtend
  if (Array.isArray(b)) {
    throw new TypeError("Arrays are not supported by deepExtend");
  }

  for (const prop in b) {
    // We check against prop not being in Object.prototype or Function.prototype
    // to prevent polluting for example Object.__proto__.
    if (
      hasOwnProperty(b, prop) &&
      !(prop in Object.prototype) &&
      !(prop in Function.prototype)
    ) {
      if (b[prop] && b[prop].constructor === Object) {
        if (a[prop] === undefined) {
          a[prop] = {};
        }
        if (a[prop] && a[prop].constructor === Object) {
          deepExtend(a[prop], b[prop]);
        } else {
          a[prop] = b[prop];
        }
      } else if (Array.isArray(b[prop])) {
        throw new TypeError("Arrays are not supported by deepExtend");
      } else {
        a[prop] = b[prop];
      }
    }
  }
  return a;
}

/**
 * Deep test equality of all fields in two pairs of arrays or objects.
 * Compares values and functions strictly (ie. 2 is not the same as '2').
 * @param {Array | Object} a
 * @param {Array | Object} b
 * @returns {boolean}
 */
export function deepStrictEqual(a, b) {
  let prop, i, len;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (i = 0, len = a.length; i < len; i++) {
      if (!deepStrictEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else if (typeof a === "function") {
    return a === b;
  } else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false;
    }

    for (prop in a) {
      // noinspection JSUnfilteredForInLoop
      if (!(prop in b) || !deepStrictEqual(a[prop], b[prop])) {
        return false;
      }
    }
    for (prop in b) {
      // noinspection JSUnfilteredForInLoop
      if (!(prop in a)) {
        return false;
      }
    }
    return true;
  } else {
    return a === b;
  }
}

/**
 * Recursively flatten a nested object.
 * @param {Object} nestedObject
 * @return {Object} Returns the flattened object
 */
export function deepFlatten(nestedObject) {
  const flattenedObject = {};

  _deepFlatten(nestedObject, flattenedObject);

  return flattenedObject;
}

// helper function used by deepFlatten
function _deepFlatten(nestedObject, flattenedObject) {
  for (const prop in nestedObject) {
    if (hasOwnProperty(nestedObject, prop)) {
      const value = nestedObject[prop];
      if (typeof value === "object" && value !== null) {
        _deepFlatten(value, flattenedObject);
      } else {
        flattenedObject[prop] = value;
      }
    }
  }
}

/**
 * Test whether the current JavaScript engine supports Object.defineProperty
 * @returns {boolean} returns true if supported
 */
export function canDefineProperty() {
  // test needed for broken IE8 implementation
  try {
    if (Object.defineProperty) {
      Object.defineProperty({}, "x", {
        get: function () {
          return null;
        },
      });
      return true;
    }
  } catch (e) {}

  return false;
}

/**
 * Attach a lazy loading property to a constant.
 * The given function `fn` is called once when the property is first requested.
 *
 * @param {Object} object         Object where to add the property
 * @param {string} prop           Property name
 * @param {Function} valueResolver Function returning the property value. Called
 *                                without arguments.
 */
export function lazy(object, prop, valueResolver) {
  let _uninitialized = true;
  let _value;

  Object.defineProperty(object, prop, {
    get: function () {
      if (_uninitialized) {
        _value = valueResolver();
        _uninitialized = false;
      }
      return _value;
    },

    set: function (value) {
      _value = value;
      _uninitialized = false;
    },

    configurable: true,
    enumerable: true,
  });
}

/**
 * Traverse a path into an object.
 * When a namespace is missing, it will be created
 * @param {Object} object
 * @param {string | string[]} path   A dot separated string like 'name.space'
 * @return {Object} Returns the object at the end of the path
 */
export function traverse(object, path) {
  if (path && typeof path === "string") {
    return traverse(object, path.split("."));
  }

  let obj = object;

  if (path) {
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (!(key in obj)) {
        obj[key] = {};
      }
      obj = obj[key];
    }
  }

  return obj;
}

/**
 * A safe hasOwnProperty
 * @param {Object} object
 * @param {string} property
 */
export function hasOwnProperty(object, property) {
  return object && Object.hasOwnProperty.call(object, property);
}

/**
 * Test whether an object is a factory. a factory has fields:
 *
 * - factory: function (type: Object, config: Object, load: function, typed: function [, math: Object])   (required)
 * - name: string (optional)
 * - path: string    A dot separated path (optional)
 * - math: boolean   If true (false by default), the math namespace is passed
 *                   as fifth argument of the factory function
 *
 * @param {*} object
 * @returns {boolean}
 */
export function isLegacyFactory(object) {
  return object && typeof object.factory === "function";
}

/**
 * Get a nested property from an object
 * @param {Object} object
 * @param {string | string[]} path
 * @returns {Object}
 */
export function get(object, path) {
  if (typeof path === "string") {
    if (isPath(path)) {
      return get(object, path.split("."));
    } else {
      return object[path];
    }
  }

  let child = object;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    child = child ? child[key] : undefined;
  }

  return child;
}

/**
 * Set a nested property in an object
 * Mutates the object itself
 * If the path doesn't exist, it will be created
 * @param {Object} object
 * @param {string | string[]} path
 * @param {*} value
 * @returns {Object}
 */
export function set(object, path, value) {
  if (typeof path === "string") {
    if (isPath(path)) {
      return set(object, path.split("."), value);
    } else {
      object[path] = value;
      return object;
    }
  }

  let child = object;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (child[key] === undefined) {
      child[key] = {};
    }
    child = child[key];
  }

  if (path.length > 0) {
    const lastKey = path[path.length - 1];
    child[lastKey] = value;
  }

  return object;
}

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} properties
 * @param {function} [transform] Optional value to transform a value when picking it
 * @return {Object}
 */
export function pick(object, properties, transform) {
  const copy = {};

  for (let i = 0; i < properties.length; i++) {
    const key = properties[i];
    const value = get(object, key);
    if (value !== undefined) {
      set(copy, key, transform ? transform(value, key) : value);
    }
  }

  return copy;
}

/**
 * Shallow version of pick, creating an object composed of the picked object properties
 * but not for nested properties
 * @param {Object} object
 * @param {string[]} properties
 * @return {Object}
 */
export function pickShallow(object, properties) {
  const copy = {};

  for (let i = 0; i < properties.length; i++) {
    const key = properties[i];
    const value = object[key];
    if (value !== undefined) {
      copy[key] = value;
    }
  }

  return copy;
}

export function values(object) {
  return Object.keys(object).map((key) => object[key]);
}

// helper function to test whether a string contains a path like 'user.name'
function isPath(str) {
  return str.indexOf(".") !== -1;
}








const name = "parse";
const dependencies = [
  "typed",
  "numeric",
  "config",
  "AccessorNode",
  "ArrayNode",
  "AssignmentNode",
  "BlockNode",
  "ConditionalNode",
  "ConstantNode",
  "FunctionAssignmentNode",
  "FunctionNode",
  "IndexNode",
  "ObjectNode",
  "OperatorNode",
  "ParenthesisNode",
  "RangeNode",
  "RelationalNode",
  "SymbolNode",
];

export const createParse = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({
    typed,
    numeric,
    config,
    AccessorNode,
    ArrayNode,
    AssignmentNode,
    BlockNode,
    ConditionalNode,
    ConstantNode,
    FunctionAssignmentNode,
    FunctionNode,
    IndexNode,
    ObjectNode,
    OperatorNode,
    ParenthesisNode,
    RangeNode,
    RelationalNode,
    SymbolNode,
  }) => {
    /**
     * Parse an expression. Returns a node tree, which can be evaluated by
     * invoking node.evaluate().
     *
     * Note the evaluating arbitrary expressions may involve security risks,
     * see [https://mathjs.org/docs/expressions/security.html](https://mathjs.org/docs/expressions/security.html) for more information.
     *
     * Syntax:
     *
     *     math.parse(expr)
     *     math.parse(expr, options)
     *     math.parse([expr1, expr2, expr3, ...])
     *     math.parse([expr1, expr2, expr3, ...], options)
     *
     * Example:
     *
     *     const node1 = math.parse('sqrt(3^2 + 4^2)')
     *     node1.compile().evaluate() // 5
     *
     *     let scope = {a:3, b:4}
     *     const node2 = math.parse('a * b') // 12
     *     const code2 = node2.compile()
     *     code2.evaluate(scope) // 12
     *     scope.a = 5
     *     code2.evaluate(scope) // 20
     *
     *     const nodes = math.parse(['a = 3', 'b = 4', 'a * b'])
     *     nodes[2].compile().evaluate() // 12
     *
     * See also:
     *
     *     evaluate, compile
     *
     * @param {string | string[] | Matrix} expr          Expression to be parsed
     * @param {{nodes: Object<string, Node>}} [options]  Available options:
     *                                                   - `nodes` a set of custom nodes
     * @return {Node | Node[]} node
     * @throws {Error}
     */
    const parse = typed(name, {
      string: function (expression) {
        return parseStart(expression, {});
      },
      "Array | Matrix": function (expressions) {
        return parseMultiple(expressions, {});
      },
      "string, Object": function (expression, options) {
        const extraNodes = options.nodes !== undefined ? options.nodes : {};

        return parseStart(expression, extraNodes);
      },
      "Array | Matrix, Object": parseMultiple,
    });

    function parseMultiple(expressions, options = {}) {
      const extraNodes = options.nodes !== undefined ? options.nodes : {};

      // parse an array or matrix with expressions
      return deepMap(expressions, function (elem) {
        if (typeof elem !== "string") throw new TypeError("String expected");

        return parseStart(elem, extraNodes);
      });
    }

    // token types enumeration
    const TOKENTYPE = {
      NULL: 0,
      DELIMITER: 1,
      NUMBER: 2,
      SYMBOL: 3,
      UNKNOWN: 4,
    };

    // map with all delimiters
    const DELIMITERS = {
      ",": true,
      "(": true,
      ")": true,
      "[": true,
      "]": true,
      "{": true,
      "}": true,
      '"': true,
      "'": true,
      ";": true,

      "+": true,
      "-": true,
      "*": true,
      ".*": true,
      "/": true,
      "./": true,
      "%": true,
      "^": true,
      ".^": true,
      "~": true,
      "!": true,
      "&": true,
      "|": true,
      "^|": true,
      "=": true,
      ":": true,
      "?": true,

      "==": true,
      "!=": true,
      "<": true,
      ">": true,
      "<=": true,
      ">=": true,

      "<<": true,
      ">>": true,
      ">>>": true,
    };

    // map with all named delimiters
    const NAMED_DELIMITERS = {
      mod: true,
      to: true,
      in: true,
      and: true,
      xor: true,
      or: true,
      not: true,
    };

    const CONSTANTS = {
      true: true,
      false: false,
      null: null,
      undefined,
    };

    const NUMERIC_CONSTANTS = ["NaN", "Infinity"];

    function initialState() {
      return {
        extraNodes: {}, // current extra nodes, must be careful not to mutate
        expression: "", // current expression
        comment: "", // last parsed comment
        index: 0, // current index in expr
        token: "", // current token
        tokenType: TOKENTYPE.NULL, // type of the token
        nestingLevel: 0, // level of nesting inside parameters, used to ignore newline characters
        conditionalLevel: null, // when a conditional is being parsed, the level of the conditional is stored here
      };
    }

    /**
     * View upto `length` characters of the expression starting at the current character.
     *
     * @param {Object} state
     * @param {number} [length=1] Number of characters to view
     * @returns {string}
     * @private
     */
    function currentString(state, length) {
      return state.expression.substr(state.index, length);
    }

    /**
     * View the current character. Returns '' if end of expression is reached.
     *
     * @param {Object} state
     * @returns {string}
     * @private
     */
    function currentCharacter(state) {
      return currentString(state, 1);
    }

    /**
     * Get the next character from the expression.
     * The character is stored into the char c. If the end of the expression is
     * reached, the function puts an empty string in c.
     * @private
     */
    function next(state) {
      state.index++;
    }

    /**
     * Preview the previous character from the expression.
     * @return {string} cNext
     * @private
     */
    function prevCharacter(state) {
      return state.expression.charAt(state.index - 1);
    }

    /**
     * Preview the next character from the expression.
     * @return {string} cNext
     * @private
     */
    function nextCharacter(state) {
      return state.expression.charAt(state.index + 1);
    }

    /**
     * Get next token in the current string expr.
     * The token and token type are available as token and tokenType
     * @private
     */
    function getToken(state) {
      state.tokenType = TOKENTYPE.NULL;
      state.token = "";
      state.comment = "";

      // skip over ignored characters:
      while (true) {
        // comments:
        if (currentCharacter(state) === "#") {
          while (
            currentCharacter(state) !== "\n" &&
            currentCharacter(state) !== ""
          ) {
            state.comment += currentCharacter(state);
            next(state);
          }
        }
        // whitespace: space, tab, and newline when inside parameters
        if (parse.isWhitespace(currentCharacter(state), state.nestingLevel)) {
          next(state);
        } else {
          break;
        }
      }

      // check for end of expression
      if (currentCharacter(state) === "") {
        // token is still empty
        state.tokenType = TOKENTYPE.DELIMITER;
        return;
      }

      // check for new line character
      if (currentCharacter(state) === "\n" && !state.nestingLevel) {
        state.tokenType = TOKENTYPE.DELIMITER;
        state.token = currentCharacter(state);
        next(state);
        return;
      }

      const c1 = currentCharacter(state);
      const c2 = currentString(state, 2);
      const c3 = currentString(state, 3);
      if (c3.length === 3 && DELIMITERS[c3]) {
        state.tokenType = TOKENTYPE.DELIMITER;
        state.token = c3;
        next(state);
        next(state);
        next(state);
        return;
      }

      // check for delimiters consisting of 2 characters
      if (c2.length === 2 && DELIMITERS[c2]) {
        state.tokenType = TOKENTYPE.DELIMITER;
        state.token = c2;
        next(state);
        next(state);
        return;
      }

      // check for delimiters consisting of 1 character
      if (DELIMITERS[c1]) {
        state.tokenType = TOKENTYPE.DELIMITER;
        state.token = c1;
        next(state);
        return;
      }

      // check for a number
      if (parse.isDigitDot(c1)) {
        state.tokenType = TOKENTYPE.NUMBER;

        // check for binary, octal, or hex
        const c2 = currentString(state, 2);
        if (c2 === "0b" || c2 === "0o" || c2 === "0x") {
          state.token += currentCharacter(state);
          next(state);
          state.token += currentCharacter(state);
          next(state);
          while (parse.isHexDigit(currentCharacter(state))) {
            state.token += currentCharacter(state);
            next(state);
          }
          if (currentCharacter(state) === ".") {
            // this number has a radix point
            state.token += ".";
            next(state);
            // get the digits after the radix
            while (parse.isHexDigit(currentCharacter(state))) {
              state.token += currentCharacter(state);
              next(state);
            }
          } else if (currentCharacter(state) === "i") {
            // this number has a word size suffix
            state.token += "i";
            next(state);
            // get the word size
            while (parse.isDigit(currentCharacter(state))) {
              state.token += currentCharacter(state);
              next(state);
            }
          }
          return;
        }

        // get number, can have a single dot
        if (currentCharacter(state) === ".") {
          state.token += currentCharacter(state);
          next(state);

          if (!parse.isDigit(currentCharacter(state))) {
            // this is no number, it is just a dot (can be dot notation)
            state.tokenType = TOKENTYPE.DELIMITER;
            return;
          }
        } else {
          while (parse.isDigit(currentCharacter(state))) {
            state.token += currentCharacter(state);
            next(state);
          }
          if (
            parse.isDecimalMark(currentCharacter(state), nextCharacter(state))
          ) {
            state.token += currentCharacter(state);
            next(state);
          }
        }

        while (parse.isDigit(currentCharacter(state))) {
          state.token += currentCharacter(state);
          next(state);
        }
        // check for exponential notation like "2.3e-4", "1.23e50" or "2e+4"
        if (
          currentCharacter(state) === "E" ||
          currentCharacter(state) === "e"
        ) {
          if (
            parse.isDigit(nextCharacter(state)) ||
            nextCharacter(state) === "-" ||
            nextCharacter(state) === "+"
          ) {
            state.token += currentCharacter(state);
            next(state);

            if (
              currentCharacter(state) === "+" ||
              currentCharacter(state) === "-"
            ) {
              state.token += currentCharacter(state);
              next(state);
            }
            // Scientific notation MUST be followed by an exponent
            if (!parse.isDigit(currentCharacter(state))) {
              throw createSyntaxError(
                state,
                'Digit expected, got "' + currentCharacter(state) + '"'
              );
            }

            while (parse.isDigit(currentCharacter(state))) {
              state.token += currentCharacter(state);
              next(state);
            }

            if (
              parse.isDecimalMark(currentCharacter(state), nextCharacter(state))
            ) {
              throw createSyntaxError(
                state,
                'Digit expected, got "' + currentCharacter(state) + '"'
              );
            }
          } else if (nextCharacter(state) === ".") {
            next(state);
            throw createSyntaxError(
              state,
              'Digit expected, got "' + currentCharacter(state) + '"'
            );
          }
        }

        return;
      }

      // check for variables, functions, named operators
      if (
        parse.isAlpha(
          currentCharacter(state),
          prevCharacter(state),
          nextCharacter(state)
        )
      ) {
        while (
          parse.isAlpha(
            currentCharacter(state),
            prevCharacter(state),
            nextCharacter(state)
          ) ||
          parse.isDigit(currentCharacter(state))
        ) {
          state.token += currentCharacter(state);
          next(state);
        }

        if (hasOwnProperty(NAMED_DELIMITERS, state.token)) {
          state.tokenType = TOKENTYPE.DELIMITER;
        } else {
          state.tokenType = TOKENTYPE.SYMBOL;
        }

        return;
      }

      // something unknown is found, wrong characters -> a syntax error
      state.tokenType = TOKENTYPE.UNKNOWN;
      while (currentCharacter(state) !== "") {
        state.token += currentCharacter(state);
        next(state);
      }
      throw createSyntaxError(
        state,
        'Syntax error in part "' + state.token + '"'
      );
    }

    /**
     * Get next token and skip newline tokens
     */
    function getTokenSkipNewline(state) {
      do {
        getToken(state);
      } while (state.token === "\n"); // eslint-disable-line no-unmodified-loop-condition
    }

    /**
     * Open parameters.
     * New line characters will be ignored until closeParams(state) is called
     */
    function openParams(state) {
      state.nestingLevel++;
    }

    /**
     * Close parameters.
     * New line characters will no longer be ignored
     */
    function closeParams(state) {
      state.nestingLevel--;
    }

    /**
     * Checks whether the current character `c` is a valid alpha character:
     *
     * - A latin letter (upper or lower case) Ascii: a-z, A-Z
     * - An underscore                        Ascii: _
     * - A dollar sign                        Ascii: $
     * - A latin letter with accents          Unicode: \u00C0 - \u02AF
     * - A greek letter                       Unicode: \u0370 - \u03FF
     * - A mathematical alphanumeric symbol   Unicode: \u{1D400} - \u{1D7FF} excluding invalid code points
     *
     * The previous and next characters are needed to determine whether
     * this character is part of a unicode surrogate pair.
     *
     * @param {string} c      Current character in the expression
     * @param {string} cPrev  Previous character
     * @param {string} cNext  Next character
     * @return {boolean}
     */
    parse.isAlpha = function isAlpha(c, cPrev, cNext) {
      return (
        parse.isValidLatinOrGreek(c) ||
        parse.isValidMathSymbol(c, cNext) ||
        parse.isValidMathSymbol(cPrev, c)
      );
    };

    /**
     * Test whether a character is a valid latin, greek, or letter-like character
     * @param {string} c
     * @return {boolean}
     */
    parse.isValidLatinOrGreek = function isValidLatinOrGreek(c) {
      return /^[a-zA-Z_$\u00C0-\u02AF\u0370-\u03FF\u2100-\u214F]$/.test(c);
    };

    /**
     * Test whether two given 16 bit characters form a surrogate pair of a
     * unicode math symbol.
     *
     * https://unicode-table.com/en/
     * https://www.wikiwand.com/en/Mathematical_operators_and_symbols_in_Unicode
     *
     * Note: In ES6 will be unicode aware:
     * https://stackoverflow.com/questions/280712/javascript-unicode-regexes
     * https://mathiasbynens.be/notes/es6-unicode-regex
     *
     * @param {string} high
     * @param {string} low
     * @return {boolean}
     */
    parse.isValidMathSymbol = function isValidMathSymbol(high, low) {
      return (
        /^[\uD835]$/.test(high) &&
        /^[\uDC00-\uDFFF]$/.test(low) &&
        /^[^\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]$/.test(
          low
        )
      );
    };

    /**
     * Check whether given character c is a white space character: space, tab, or enter
     * @param {string} c
     * @param {number} nestingLevel
     * @return {boolean}
     */
    parse.isWhitespace = function isWhitespace(c, nestingLevel) {
      // TODO: also take '\r' carriage return as newline? Or does that give problems on mac?
      return c === " " || c === "\t" || (c === "\n" && nestingLevel > 0);
    };

    /**
     * Test whether the character c is a decimal mark (dot).
     * This is the case when it's not the start of a delimiter '.*', './', or '.^'
     * @param {string} c
     * @param {string} cNext
     * @return {boolean}
     */
    parse.isDecimalMark = function isDecimalMark(c, cNext) {
      return c === "." && cNext !== "/" && cNext !== "*" && cNext !== "^";
    };

    /**
     * checks if the given char c is a digit or dot
     * @param {string} c   a string with one character
     * @return {boolean}
     */
    parse.isDigitDot = function isDigitDot(c) {
      return (c >= "0" && c <= "9") || c === ".";
    };

    /**
     * checks if the given char c is a digit
     * @param {string} c   a string with one character
     * @return {boolean}
     */
    parse.isDigit = function isDigit(c) {
      return c >= "0" && c <= "9";
    };

    /**
     * checks if the given char c is a hex digit
     * @param {string} c   a string with one character
     * @return {boolean}
     */
    parse.isHexDigit = function isHexDigit(c) {
      return (
        (c >= "0" && c <= "9") ||
        (c >= "a" && c <= "f") ||
        (c >= "A" && c <= "F")
      );
    };

    /**
     * Start of the parse levels below, in order of precedence
     * @return {Node} node
     * @private
     */
    function parseStart(expression, extraNodes) {
      const state = initialState();
      Object.assign(state, { expression, extraNodes });
      getToken(state);

      const node = parseBlock(state);

      // check for garbage at the end of the expression
      // an expression ends with a empty character '' and tokenType DELIMITER
      if (state.token !== "") {
        if (state.tokenType === TOKENTYPE.DELIMITER) {
          // user entered a not existing operator like "//"

          // TODO: give hints for aliases, for example with "<>" give as hint " did you mean !== ?"
          throw createError(state, "Unexpected operator " + state.token);
        } else {
          throw createSyntaxError(
            state,
            'Unexpected part "' + state.token + '"'
          );
        }
      }

      return node;
    }

    /**
     * Parse a block with expressions. Expressions can be separated by a newline
     * character '\n', or by a semicolon ';'. In case of a semicolon, no output
     * of the preceding line is returned.
     * @return {Node} node
     * @private
     */
    function parseBlock(state) {
      let node;
      const blocks = [];
      let visible;

      if (state.token !== "" && state.token !== "\n" && state.token !== ";") {
        node = parseAssignment(state);
        if (state.comment) {
          node.comment = state.comment;
        }
      }

      // TODO: simplify this loop
      while (state.token === "\n" || state.token === ";") {
        // eslint-disable-line no-unmodified-loop-condition
        if (blocks.length === 0 && node) {
          visible = state.token !== ";";
          blocks.push({ node, visible });
        }

        getToken(state);
        if (state.token !== "\n" && state.token !== ";" && state.token !== "") {
          node = parseAssignment(state);
          if (state.comment) {
            node.comment = state.comment;
          }

          visible = state.token !== ";";
          blocks.push({ node, visible });
        }
      }

      if (blocks.length > 0) {
        return new BlockNode(blocks);
      } else {
        if (!node) {
          node = new ConstantNode(undefined);
          if (state.comment) {
            node.comment = state.comment;
          }
        }

        return node;
      }
    }

    /**
     * Assignment of a function or variable,
     * - can be a variable like 'a=2.3'
     * - or a updating an existing variable like 'matrix(2,3:5)=[6,7,8]'
     * - defining a function like 'f(x) = x^2'
     * @return {Node} node
     * @private
     */
    function parseAssignment(state) {
      let name, args, value, valid;

      const node = parseConditional(state);

      if (state.token === "=") {
        if (isSymbolNode(node)) {
          // parse a variable assignment like 'a = 2/3'
          name = node.name;
          getTokenSkipNewline(state);
          value = parseAssignment(state);
          return new AssignmentNode(new SymbolNode(name), value);
        } else if (isAccessorNode(node)) {
          // parse a matrix subset assignment like 'A[1,2] = 4'
          getTokenSkipNewline(state);
          value = parseAssignment(state);
          return new AssignmentNode(node.object, node.index, value);
        } else if (isFunctionNode(node) && isSymbolNode(node.fn)) {
          // parse function assignment like 'f(x) = x^2'
          valid = true;
          args = [];

          name = node.name;
          node.args.forEach(function (arg, index) {
            if (isSymbolNode(arg)) {
              args[index] = arg.name;
            } else {
              valid = false;
            }
          });

          if (valid) {
            getTokenSkipNewline(state);
            value = parseAssignment(state);
            return new FunctionAssignmentNode(name, args, value);
          }
        }

        throw createSyntaxError(
          state,
          "Invalid left hand side of assignment operator ="
        );
      }

      return node;
    }

    /**
     * conditional operation
     *
     *     condition ? truePart : falsePart
     *
     * Note: conditional operator is right-associative
     *
     * @return {Node} node
     * @private
     */
    function parseConditional(state) {
      let node = parseLogicalOr(state);

      while (state.token === "?") {
        // eslint-disable-line no-unmodified-loop-condition
        // set a conditional level, the range operator will be ignored as long
        // as conditionalLevel === state.nestingLevel.
        const prev = state.conditionalLevel;
        state.conditionalLevel = state.nestingLevel;
        getTokenSkipNewline(state);

        const condition = node;
        const trueExpr = parseAssignment(state);

        if (state.token !== ":")
          throw createSyntaxError(
            state,
            "False part of conditional expression expected"
          );

        state.conditionalLevel = null;
        getTokenSkipNewline(state);

        const falseExpr = parseAssignment(state); // Note: check for conditional operator again, right associativity

        node = new ConditionalNode(condition, trueExpr, falseExpr);

        // restore the previous conditional level
        state.conditionalLevel = prev;
      }

      return node;
    }

    /**
     * logical or, 'x or y'
     * @return {Node} node
     * @private
     */
    function parseLogicalOr(state) {
      let node = parseLogicalXor(state);

      while (state.token === "or") {
        // eslint-disable-line no-unmodified-loop-condition
        getTokenSkipNewline(state);
        node = new OperatorNode("or", "or", [node, parseLogicalXor(state)]);
      }

      return node;
    }

    /**
     * logical exclusive or, 'x xor y'
     * @return {Node} node
     * @private
     */
    function parseLogicalXor(state) {
      let node = parseLogicalAnd(state);

      while (state.token === "xor") {
        // eslint-disable-line no-unmodified-loop-condition
        getTokenSkipNewline(state);
        node = new OperatorNode("xor", "xor", [node, parseLogicalAnd(state)]);
      }

      return node;
    }

    /**
     * logical and, 'x and y'
     * @return {Node} node
     * @private
     */
    function parseLogicalAnd(state) {
      let node = parseBitwiseOr(state);

      while (state.token === "and") {
        // eslint-disable-line no-unmodified-loop-condition
        getTokenSkipNewline(state);
        node = new OperatorNode("and", "and", [node, parseBitwiseOr(state)]);
      }

      return node;
    }

    /**
     * bitwise or, 'x | y'
     * @return {Node} node
     * @private
     */
    function parseBitwiseOr(state) {
      let node = parseBitwiseXor(state);

      while (state.token === "|") {
        // eslint-disable-line no-unmodified-loop-condition
        getTokenSkipNewline(state);
        node = new OperatorNode("|", "bitOr", [node, parseBitwiseXor(state)]);
      }

      return node;
    }

    /**
     * bitwise exclusive or (xor), 'x ^| y'
     * @return {Node} node
     * @private
     */
    function parseBitwiseXor(state) {
      let node = parseBitwiseAnd(state);

      while (state.token === "^|") {
        // eslint-disable-line no-unmodified-loop-condition
        getTokenSkipNewline(state);
        node = new OperatorNode("^|", "bitXor", [node, parseBitwiseAnd(state)]);
      }

      return node;
    }

    /**
     * bitwise and, 'x & y'
     * @return {Node} node
     * @private
     */
    function parseBitwiseAnd(state) {
      let node = parseRelational(state);

      while (state.token === "&") {
        // eslint-disable-line no-unmodified-loop-condition
        getTokenSkipNewline(state);
        node = new OperatorNode("&", "bitAnd", [node, parseRelational(state)]);
      }

      return node;
    }

    /**
     * Parse a chained conditional, like 'a > b >= c'
     * @return {Node} node
     */
    function parseRelational(state) {
      const params = [parseShift(state)];
      const conditionals = [];

      const operators = {
        "==": "equal",
        "!=": "unequal",
        "<": "smaller",
        ">": "larger",
        "<=": "smallerEq",
        ">=": "largerEq",
      };

      while (hasOwnProperty(operators, state.token)) {
        // eslint-disable-line no-unmodified-loop-condition
        const cond = { name: state.token, fn: operators[state.token] };
        conditionals.push(cond);
        getTokenSkipNewline(state);
        params.push(parseShift(state));
      }

      if (params.length === 1) {
        return params[0];
      } else if (params.length === 2) {
        return new OperatorNode(
          conditionals[0].name,
          conditionals[0].fn,
          params
        );
      } else {
        return new RelationalNode(
          conditionals.map((c) => c.fn),
          params
        );
      }
    }

    /**
     * Bitwise left shift, bitwise right arithmetic shift, bitwise right logical shift
     * @return {Node} node
     * @private
     */
    function parseShift(state) {
      let node, name, fn, params;

      node = parseConversion(state);

      const operators = {
        "<<": "leftShift",
        ">>": "rightArithShift",
        ">>>": "rightLogShift",
      };

      while (hasOwnProperty(operators, state.token)) {
        name = state.token;
        fn = operators[name];

        getTokenSkipNewline(state);
        params = [node, parseConversion(state)];
        node = new OperatorNode(name, fn, params);
      }

      return node;
    }

    /**
     * conversion operators 'to' and 'in'
     * @return {Node} node
     * @private
     */
    function parseConversion(state) {
      let node, name, fn, params;

      node = parseRange(state);

      const operators = {
        to: "to",
        in: "to", // alias of 'to'
      };

      while (hasOwnProperty(operators, state.token)) {
        name = state.token;
        fn = operators[name];

        getTokenSkipNewline(state);

        if (name === "in" && state.token === "") {
          // end of expression -> this is the unit 'in' ('inch')
          node = new OperatorNode(
            "*",
            "multiply",
            [node, new SymbolNode("in")],
            true
          );
        } else {
          // operator 'a to b' or 'a in b'
          params = [node, parseRange(state)];
          node = new OperatorNode(name, fn, params);
        }
      }

      return node;
    }

    /**
     * parse range, "start:end", "start:step:end", ":", "start:", ":end", etc
     * @return {Node} node
     * @private
     */
    function parseRange(state) {
      let node;
      const params = [];

      if (state.token === ":") {
        // implicit start=1 (one-based)
        node = new ConstantNode(1);
      } else {
        // explicit start
        node = parseAddSubtract(state);
      }

      if (
        state.token === ":" &&
        state.conditionalLevel !== state.nestingLevel
      ) {
        // we ignore the range operator when a conditional operator is being processed on the same level
        params.push(node);

        // parse step and end
        while (state.token === ":" && params.length < 3) {
          // eslint-disable-line no-unmodified-loop-condition
          getTokenSkipNewline(state);

          if (
            state.token === ")" ||
            state.token === "]" ||
            state.token === "," ||
            state.token === ""
          ) {
            // implicit end
            params.push(new SymbolNode("end"));
          } else {
            // explicit end
            params.push(parseAddSubtract(state));
          }
        }

        if (params.length === 3) {
          // params = [start, step, end]
          node = new RangeNode(params[0], params[2], params[1]); // start, end, step
        } else {
          // length === 2
          // params = [start, end]
          node = new RangeNode(params[0], params[1]); // start, end
        }
      }

      return node;
    }

    /**
     * add or subtract
     * @return {Node} node
     * @private
     */
    function parseAddSubtract(state) {
      let node, name, fn, params;

      node = parseMultiplyDivide(state);

      const operators = {
        "+": "add",
        "-": "subtract",
      };
      while (hasOwnProperty(operators, state.token)) {
        name = state.token;
        fn = operators[name];

        getTokenSkipNewline(state);
        const rightNode = parseMultiplyDivide(state);
        if (rightNode.isPercentage) {
          params = [node, new OperatorNode("*", "multiply", [node, rightNode])];
        } else {
          params = [node, rightNode];
        }
        node = new OperatorNode(name, fn, params);
      }

      return node;
    }

    /**
     * multiply, divide, modulus
     * @return {Node} node
     * @private
     */
    function parseMultiplyDivide(state) {
      let node, last, name, fn;

      node = parseImplicitMultiplication(state);
      last = node;

      const operators = {
        "*": "multiply",
        ".*": "dotMultiply",
        "/": "divide",
        "./": "dotDivide",
      };

      while (true) {
        if (hasOwnProperty(operators, state.token)) {
          // explicit operators
          name = state.token;
          fn = operators[name];

          getTokenSkipNewline(state);

          last = parseImplicitMultiplication(state);
          node = new OperatorNode(name, fn, [node, last]);
        } else {
          break;
        }
      }

      return node;
    }

    /**
     * implicit multiplication
     * @return {Node} node
     * @private
     */
    function parseImplicitMultiplication(state) {
      let node, last;

      node = parseRule2(state);
      last = node;

      while (true) {
        if (
          state.tokenType === TOKENTYPE.SYMBOL ||
          (state.token === "in" && isConstantNode(node)) ||
          (state.tokenType === TOKENTYPE.NUMBER &&
            !isConstantNode(last) &&
            (!isOperatorNode(last) || last.op === "!")) ||
          state.token === "("
        ) {
          // parse implicit multiplication
          //
          // symbol:      implicit multiplication like '2a', '(2+3)a', 'a b'
          // number:      implicit multiplication like '(2+3)2'
          // parenthesis: implicit multiplication like '2(3+4)', '(3+4)(1+2)'
          last = parseRule2(state);
          node = new OperatorNode(
            "*",
            "multiply",
            [node, last],
            true /* implicit */
          );
        } else {
          break;
        }
      }

      return node;
    }

    /**
     * Infamous "rule 2" as described in https://github.com/josdejong/mathjs/issues/792#issuecomment-361065370
     * And as amended in https://github.com/josdejong/mathjs/issues/2370#issuecomment-1054052164
     * Explicit division gets higher precedence than implicit multiplication
     * when the division matches this pattern:
     *   [unaryPrefixOp]?[number] / [number] [symbol]
     * @return {Node} node
     * @private
     */
    function parseRule2(state) {
      let node = parsePercentage(state);
      let last = node;
      const tokenStates = [];

      while (true) {
        // Match the "number /" part of the pattern "number / number symbol"
        if (state.token === "/" && rule2Node(last)) {
          // Look ahead to see if the next token is a number
          tokenStates.push(Object.assign({}, state));
          getTokenSkipNewline(state);

          // Match the "number / number" part of the pattern
          if (state.tokenType === TOKENTYPE.NUMBER) {
            // Look ahead again
            tokenStates.push(Object.assign({}, state));
            getTokenSkipNewline(state);

            // Match the "symbol" part of the pattern, or a left parenthesis
            if (state.tokenType === TOKENTYPE.SYMBOL || state.token === "(") {
              // We've matched the pattern "number / number symbol".
              // Rewind once and build the "number / number" node; the symbol will be consumed later
              Object.assign(state, tokenStates.pop());
              tokenStates.pop();
              last = parsePercentage(state);
              node = new OperatorNode("/", "divide", [node, last]);
            } else {
              // Not a match, so rewind
              tokenStates.pop();
              Object.assign(state, tokenStates.pop());
              break;
            }
          } else {
            // Not a match, so rewind
            Object.assign(state, tokenStates.pop());
            break;
          }
        } else {
          break;
        }
      }

      return node;
    }

    /**
     * percentage or mod
     * @return {Node} node
     * @private
     */
    function parsePercentage(state) {
      let node, name, fn, params;

      node = parseUnary(state);

      const operators = {
        "%": "mod",
        mod: "mod",
      };
      while (hasOwnProperty(operators, state.token)) {
        name = state.token;
        fn = operators[name];

        getTokenSkipNewline(state);

        if (
          name === "%" &&
          state.tokenType === TOKENTYPE.DELIMITER &&
          state.token !== "("
        ) {
          // If the expression contains only %, then treat that as /100
          node = new OperatorNode(
            "/",
            "divide",
            [node, new ConstantNode(100)],
            false,
            true
          );
        } else {
          params = [node, parseUnary(state)];
          node = new OperatorNode(name, fn, params);
        }
      }

      return node;
    }

    /**
     * Unary plus and minus, and logical and bitwise not
     * @return {Node} node
     * @private
     */
    function parseUnary(state) {
      let name, params, fn;
      const operators = {
        "-": "unaryMinus",
        "+": "unaryPlus",
        "~": "bitNot",
        not: "not",
      };

      if (hasOwnProperty(operators, state.token)) {
        fn = operators[state.token];
        name = state.token;

        getTokenSkipNewline(state);
        params = [parseUnary(state)];

        return new OperatorNode(name, fn, params);
      }

      return parsePow(state);
    }

    /**
     * power
     * Note: power operator is right associative
     * @return {Node} node
     * @private
     */
    function parsePow(state) {
      let node, name, fn, params;

      node = parseLeftHandOperators(state);

      if (state.token === "^" || state.token === ".^") {
        name = state.token;
        fn = name === "^" ? "pow" : "dotPow";

        getTokenSkipNewline(state);
        params = [node, parseUnary(state)]; // Go back to unary, we can have '2^-3'
        node = new OperatorNode(name, fn, params);
      }

      return node;
    }

    /**
     * Left hand operators: factorial x!, ctranspose x'
     * @return {Node} node
     * @private
     */
    function parseLeftHandOperators(state) {
      let node, name, fn, params;

      node = parseCustomNodes(state);

      const operators = {
        "!": "factorial",
        "'": "ctranspose",
      };

      while (hasOwnProperty(operators, state.token)) {
        name = state.token;
        fn = operators[name];

        getToken(state);
        params = [node];

        node = new OperatorNode(name, fn, params);
        node = parseAccessors(state, node);
      }

      return node;
    }

    /**
     * Parse a custom node handler. A node handler can be used to process
     * nodes in a custom way, for example for handling a plot.
     *
     * A handler must be passed as second argument of the parse function.
     * - must extend math.Node
     * - must contain a function _compile(defs: Object) : string
     * - must contain a function find(filter: Object) : Node[]
     * - must contain a function toString() : string
     * - the constructor is called with a single argument containing all parameters
     *
     * For example:
     *
     *     nodes = {
     *       'plot': PlotHandler
     *     }
     *
     * The constructor of the handler is called as:
     *
     *     node = new PlotHandler(params)
     *
     * The handler will be invoked when evaluating an expression like:
     *
     *     node = math.parse('plot(sin(x), x)', nodes)
     *
     * @return {Node} node
     * @private
     */
    function parseCustomNodes(state) {
      let params = [];

      if (
        state.tokenType === TOKENTYPE.SYMBOL &&
        hasOwnProperty(state.extraNodes, state.token)
      ) {
        const CustomNode = state.extraNodes[state.token];

        getToken(state);

        // parse parameters
        if (state.token === "(") {
          params = [];

          openParams(state);
          getToken(state);

          if (state.token !== ")") {
            params.push(parseAssignment(state));

            // parse a list with parameters
            while (state.token === ",") {
              // eslint-disable-line no-unmodified-loop-condition
              getToken(state);
              params.push(parseAssignment(state));
            }
          }

          if (state.token !== ")") {
            throw createSyntaxError(state, "Parenthesis ) expected");
          }
          closeParams(state);
          getToken(state);
        }

        // create a new custom node
        // noinspection JSValidateTypes
        return new CustomNode(params);
      }

      return parseSymbol(state);
    }

    /**
     * parse symbols: functions, variables, constants, units
     * @return {Node} node
     * @private
     */
    function parseSymbol(state) {
      let node, name;

      if (
        state.tokenType === TOKENTYPE.SYMBOL ||
        (state.tokenType === TOKENTYPE.DELIMITER &&
          state.token in NAMED_DELIMITERS)
      ) {
        name = state.token;

        getToken(state);

        if (hasOwnProperty(CONSTANTS, name)) {
          // true, false, null, ...
          node = new ConstantNode(CONSTANTS[name]);
        } else if (NUMERIC_CONSTANTS.indexOf(name) !== -1) {
          // NaN, Infinity
          node = new ConstantNode(numeric(name, "number"));
        } else {
          node = new SymbolNode(name);
        }

        // parse function parameters and matrix index
        node = parseAccessors(state, node);
        return node;
      }

      return parseDoubleQuotesString(state);
    }

    /**
     * parse accessors:
     * - function invocation in round brackets (...), for example sqrt(2)
     * - index enclosed in square brackets [...], for example A[2,3]
     * - dot notation for properties, like foo.bar
     * @param {Object} state
     * @param {Node} node    Node on which to apply the parameters. If there
     *                       are no parameters in the expression, the node
     *                       itself is returned
     * @param {string[]} [types]  Filter the types of notations
     *                            can be ['(', '[', '.']
     * @return {Node} node
     * @private
     */
    function parseAccessors(state, node, types) {
      let params;

      while (
        (state.token === "(" || state.token === "[" || state.token === ".") &&
        (!types || types.indexOf(state.token) !== -1)
      ) {
        // eslint-disable-line no-unmodified-loop-condition
        params = [];

        if (state.token === "(") {
          if (isSymbolNode(node) || isAccessorNode(node)) {
            // function invocation like fn(2, 3) or obj.fn(2, 3)
            openParams(state);
            getToken(state);

            if (state.token !== ")") {
              params.push(parseAssignment(state));

              // parse a list with parameters
              while (state.token === ",") {
                // eslint-disable-line no-unmodified-loop-condition
                getToken(state);
                params.push(parseAssignment(state));
              }
            }

            if (state.token !== ")") {
              throw createSyntaxError(state, "Parenthesis ) expected");
            }
            closeParams(state);
            getToken(state);

            node = new FunctionNode(node, params);
          } else {
            // implicit multiplication like (2+3)(4+5) or sqrt(2)(1+2)
            // don't parse it here but let it be handled by parseImplicitMultiplication
            // with correct precedence
            return node;
          }
        } else if (state.token === "[") {
          // index notation like variable[2, 3]
          openParams(state);
          getToken(state);

          if (state.token !== "]") {
            params.push(parseAssignment(state));

            // parse a list with parameters
            while (state.token === ",") {
              // eslint-disable-line no-unmodified-loop-condition
              getToken(state);
              params.push(parseAssignment(state));
            }
          }

          if (state.token !== "]") {
            throw createSyntaxError(state, "Parenthesis ] expected");
          }
          closeParams(state);
          getToken(state);

          node = new AccessorNode(node, new IndexNode(params));
        } else {
          // dot notation like variable.prop
          getToken(state);

          if (state.tokenType !== TOKENTYPE.SYMBOL) {
            throw createSyntaxError(state, "Property name expected after dot");
          }
          params.push(new ConstantNode(state.token));
          getToken(state);

          const dotNotation = true;
          node = new AccessorNode(node, new IndexNode(params, dotNotation));
        }
      }

      return node;
    }

    /**
     * Parse a double quotes string.
     * @return {Node} node
     * @private
     */
    function parseDoubleQuotesString(state) {
      let node, str;

      if (state.token === '"') {
        str = parseDoubleQuotesStringToken(state);

        // create constant
        node = new ConstantNode(str);

        // parse index parameters
        node = parseAccessors(state, node);

        return node;
      }

      return parseSingleQuotesString(state);
    }

    /**
     * Parse a string surrounded by double quotes "..."
     * @return {string}
     */
    function parseDoubleQuotesStringToken(state) {
      let str = "";

      while (
        currentCharacter(state) !== "" &&
        currentCharacter(state) !== '"'
      ) {
        if (currentCharacter(state) === "\\") {
          // escape character, immediately process the next
          // character to prevent stopping at a next '\"'
          str += currentCharacter(state);
          next(state);
        }

        str += currentCharacter(state);
        next(state);
      }

      getToken(state);
      if (state.token !== '"') {
        throw createSyntaxError(state, 'End of string " expected');
      }
      getToken(state);

      return JSON.parse('"' + str + '"'); // unescape escaped characters
    }

    /**
     * Parse a single quotes string.
     * @return {Node} node
     * @private
     */
    function parseSingleQuotesString(state) {
      let node, str;

      if (state.token === "'") {
        str = parseSingleQuotesStringToken(state);

        // create constant
        node = new ConstantNode(str);

        // parse index parameters
        node = parseAccessors(state, node);

        return node;
      }

      return parseMatrix(state);
    }

    /**
     * Parse a string surrounded by single quotes '...'
     * @return {string}
     */
    function parseSingleQuotesStringToken(state) {
      let str = "";

      while (
        currentCharacter(state) !== "" &&
        currentCharacter(state) !== "'"
      ) {
        if (currentCharacter(state) === "\\") {
          // escape character, immediately process the next
          // character to prevent stopping at a next '\''
          str += currentCharacter(state);
          next(state);
        }

        str += currentCharacter(state);
        next(state);
      }

      getToken(state);
      if (state.token !== "'") {
        throw createSyntaxError(state, "End of string ' expected");
      }
      getToken(state);

      return JSON.parse('"' + str + '"'); // unescape escaped characters
    }

    /**
     * parse the matrix
     * @return {Node} node
     * @private
     */
    function parseMatrix(state) {
      let array, params, rows, cols;

      if (state.token === "[") {
        // matrix [...]
        openParams(state);
        getToken(state);

        if (state.token !== "]") {
          // this is a non-empty matrix
          const row = parseRow(state);

          if (state.token === ";") {
            // 2 dimensional array
            rows = 1;
            params = [row];

            // the rows of the matrix are separated by dot-comma's
            while (state.token === ";") {
              // eslint-disable-line no-unmodified-loop-condition
              getToken(state);

              params[rows] = parseRow(state);
              rows++;
            }

            if (state.token !== "]") {
              throw createSyntaxError(state, "End of matrix ] expected");
            }
            closeParams(state);
            getToken(state);

            // check if the number of columns matches in all rows
            cols = params[0].items.length;
            for (let r = 1; r < rows; r++) {
              if (params[r].items.length !== cols) {
                throw createError(
                  state,
                  "Column dimensions mismatch " +
                    "(" +
                    params[r].items.length +
                    " !== " +
                    cols +
                    ")"
                );
              }
            }

            array = new ArrayNode(params);
          } else {
            // 1 dimensional vector
            if (state.token !== "]") {
              throw createSyntaxError(state, "End of matrix ] expected");
            }
            closeParams(state);
            getToken(state);

            array = row;
          }
        } else {
          // this is an empty matrix "[ ]"
          closeParams(state);
          getToken(state);
          array = new ArrayNode([]);
        }

        return parseAccessors(state, array);
      }

      return parseObject(state);
    }

    /**
     * Parse a single comma-separated row from a matrix, like 'a, b, c'
     * @return {ArrayNode} node
     */
    function parseRow(state) {
      const params = [parseAssignment(state)];
      let len = 1;

      while (state.token === ",") {
        // eslint-disable-line no-unmodified-loop-condition
        getToken(state);

        // parse expression
        params[len] = parseAssignment(state);
        len++;
      }

      return new ArrayNode(params);
    }

    /**
     * parse an object, enclosed in angle brackets{...}, for example {value: 2}
     * @return {Node} node
     * @private
     */
    function parseObject(state) {
      if (state.token === "{") {
        openParams(state);
        let key;

        const properties = {};
        do {
          getToken(state);

          if (state.token !== "}") {
            // parse key
            if (state.token === '"') {
              key = parseDoubleQuotesStringToken(state);
            } else if (state.token === "'") {
              key = parseSingleQuotesStringToken(state);
            } else if (
              state.tokenType === TOKENTYPE.SYMBOL ||
              (state.tokenType === TOKENTYPE.DELIMITER &&
                state.token in NAMED_DELIMITERS)
            ) {
              key = state.token;
              getToken(state);
            } else {
              throw createSyntaxError(
                state,
                "Symbol or string expected as object key"
              );
            }

            // parse key/value separator
            if (state.token !== ":") {
              throw createSyntaxError(
                state,
                "Colon : expected after object key"
              );
            }
            getToken(state);

            // parse key
            properties[key] = parseAssignment(state);
          }
        } while (state.token === ","); // eslint-disable-line no-unmodified-loop-condition

        if (state.token !== "}") {
          throw createSyntaxError(
            state,
            "Comma , or bracket } expected after object value"
          );
        }
        closeParams(state);
        getToken(state);

        let node = new ObjectNode(properties);

        // parse index parameters
        node = parseAccessors(state, node);

        return node;
      }

      return parseNumber(state);
    }

    /**
     * parse a number
     * @return {Node} node
     * @private
     */
    function parseNumber(state) {
      let numberStr;

      if (state.tokenType === TOKENTYPE.NUMBER) {
        // this is a number
        numberStr = state.token;
        getToken(state);

        return new ConstantNode(numeric(numberStr, config.number));
      }

      return parseParentheses(state);
    }

    /**
     * parentheses
     * @return {Node} node
     * @private
     */
    function parseParentheses(state) {
      let node;

      // check if it is a parenthesized expression
      if (state.token === "(") {
        // parentheses (...)
        openParams(state);
        getToken(state);

        node = parseAssignment(state); // start again

        if (state.token !== ")") {
          throw createSyntaxError(state, "Parenthesis ) expected");
        }
        closeParams(state);
        getToken(state);

        node = new ParenthesisNode(node);
        node = parseAccessors(state, node);
        return node;
      }

      return parseEnd(state);
    }

    /**
     * Evaluated when the expression is not yet ended but expected to end
     * @return {Node} res
     * @private
     */
    function parseEnd(state) {
      if (state.token === "") {
        // syntax error or unexpected end of expression
        throw createSyntaxError(state, "Unexpected end of expression");
      } else {
        throw createSyntaxError(state, "Value expected");
      }
    }

    /**
     * Shortcut for getting the current row value (one based)
     * Returns the line of the currently handled expression
     * @private
     */
    /* TODO: implement keeping track on the row number
  function row () {
    return null
  }
  */

    /**
     * Shortcut for getting the current col value (one based)
     * Returns the column (position) where the last state.token starts
     * @private
     */
    function col(state) {
      return state.index - state.token.length + 1;
    }

    /**
     * Create an error
     * @param {Object} state
     * @param {string} message
     * @return {SyntaxError} instantiated error
     * @private
     */
    function createSyntaxError(state, message) {
      const c = col(state);
      const error = new SyntaxError(message + " (char " + c + ")");
      error.char = c;

      return error;
    }

    /**
     * Create an error
     * @param {Object} state
     * @param {string} message
     * @return {Error} instantiated error
     * @private
     */
    function createError(state, message) {
      const c = col(state);
      const error = new SyntaxError(message + " (char " + c + ")");
      error.char = c;

      return error;
    }

    // Now that we can parse, automatically convert strings to Nodes by parsing
    typed.addConversion({ from: "string", to: "Node", convert: parse });

    return parse;
  }
);
