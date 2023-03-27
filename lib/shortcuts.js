/**
 * Lazy get
 * @param {*} value Value
 * @returns {string} Array for array, Function for function, `typeof` for other types
 */
function getType(value) {
  if (typeof value === "object" && Array.isArray(value)) {
    return "Array";
  }
  if (value instanceof Function) {
    return "Function";
  }
  return typeof value;
}

/**
 * Test if a value is array
 * @param {*} value value
 * @returns {boolean} true if string
 */
function isArray(value) {
  return getType(value) === "Array";
}

/**
 * Test if a value is string
 * @param {*} value value
 * @returns {boolean} true if string
 */
function isString(value) {
  return getType(value) === "string";
}

/**
 * helper function to see if an object contains a key
 * @param {Object} object Any object
 * @param {string} str Name of the key to find
 * @param {boolean=} lazy don't throw an error if the object type is not object
 * @returns {boolean} true if containsKeys, false if does not or is not an object
 */
function containsKeys(object, str, lazy) {
  if (getType(object) !== "object" && lazy) return false;
  return !(Object.keys(object).indexOf(str) === -1);
}

module.exports = {
  isArray,
  isString,
  containsKeys,
  getType
};
