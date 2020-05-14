import root from './root.js';

/**
 * @name Utils.decomposeMatrix
 * @function
 * @param {Two.Matrix} matrix - The matrix to decompose.
 * @returns {Object} An object containing relevant skew values.
 * @description Decompose a 2D 3x3 Matrix to find the skew.
 */
var decomposeMatrix = function(matrix) {

  // TODO: Include skewX, skewY

  return {
      translateX: matrix.e,
      translateY: matrix.f,
      scaleX: matrix.a,
      scaleY: matrix.d,
      rotation: 180 * Math.asin(matrix.b) / Math.PI
  };

};

/**
 * @name Utils.lerp
 * @function
 * @param {Number} a - Start value.
 * @param {Number} b - End value.
 * @param {Number} t - Zero-to-one value describing percentage between a and b.
 * @returns {Number}
 * @description Linear interpolation between two values `a` and `b` by an amount `t`.
 */
var lerp = function(a, b, t) {
  return t * (b - a) + a;
};

/**
 * @name Utils.mod
 * @param {Number} v - The value to modulo
 * @param {Number} l - The value to modulo by
 * @returns {Number}
 * @description Modulo with added functionality to handle negative values in a positive manner.
 */
var mod = function(v, l) {

  while (v < 0) {
    v += l;
  }

  return v % l;

};

var NumArray = root.Float32Array || Array;

/**
* @name Utils.toFixed
* @function
* @param {Number} v - Any float
* @returns {Number} That float trimmed to the third decimal place.
* @description A pretty fast toFixed(3) alternative.
* @see {@link http://jsperf.com/parsefloat-tofixed-vs-math-round/18}
*/
var toFixed = function(v) {
  return Math.floor(v * 1000000) / 1000000;
};


export {decomposeMatrix, lerp, mod, NumArray, toFixed};
