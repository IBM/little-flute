const { isArray, isString, containsKeys } = require("./lib/shortcuts");

/**
 * get next name from references
 * @param {Object} ref
 * @param {string} key
 * @returns {string} next key name
 */
function nextName(ref, key) {
  let name = key;
  while (containsKeys(ref, name)) {
    name = name + "_";
  }
  return name;
}

/**
 * json parser
 * @param {string} json stringified json
 * @param {object} options optional object to contain callback functions for clarinet stream
 * @param {onOpenObject=} options.onOpenObject on object open callback
 * @param {onCloseObject=} options.onCloseObject on object close callback
 * @param {onOpenArray=} options.onOpenArray on array open callback
 * @param {onCloseArray=} options.onCloseArray on array close callback
 * @param {onKey=} options.onKey on key callback
 * @param {onValue=} options.onValue on value callback
 */
function flute(json, options) {
  if (!isString(json)) {
    throw new Error(
      "flute expects passed item to be a string got " + typeof json
    );
  }

  // creeate stream
  let clarinet = require("clarinet").createStream();
  this.parsedJson = {}; // parsed json
  this.currentRef = this.parsedJson; // current reference during parsing
  this.layers = []; // object layer tracking

  /**
   * get the most recent reference from layers array and set to currentRef
   */
  this.lastRef = function () {
    this.currentRef = this.parsedJson;
    this.layers.forEach((layer) => {
      this.currentRef = this.currentRef[layer];
    });
  };

  /**
   * create a new object at current reference and add to layers
   * @param {string} key object key
   */
  this.nextObjRef = function (key) {
    this.currentRef[key] = {};
    this.currentRef = this.currentRef[key];
    this.layers.push(key);
  };

  /**
   * handle opening of object during parse
   * @param {string} key object key name
   */
  this.onOpenObject = function (key) {
    if (key) {
      this.lastRef();
      if (isArray(this.currentRef)) {
        this.layers.push(this.currentRef.length.toString());
        this.currentRef.push({});
        this.currentRef = this.currentRef[this.currentRef.length - 1];
      }
      this.nextObjRef(key);
    }
  };

  /**
   * handle closing object
   */
  this.onCloseObject = function () {
    this.layers.pop();
  };

  /**
   * handle adding of value to object
   * @param {*} value value
   */
  this.onValue = function (value) {
    if (isArray(this.currentRef)) {
      this.currentRef.push(value);
    } else {
      let key = this.layers.pop();
      this.lastRef();
      this.currentRef[key] = value;
    }
  };

  /**
   * handle key for object
   * @param {string} key object key
   */
  this.onKey = function (key) {
    if (key) {
      this.lastRef();
      let keyName = containsKeys(this.currentRef, key)
        ? nextName(this.currentRef, key)
        : key;
      this.currentRef[keyName] = {};
      this.layers.push(keyName);
    }
  };

  /**
   * handle closing array
   */
  this.onCloseArray = function () {
    this.layers.pop();
  };

  /**
   * handle open array
   */
  this.onOpenArray = function () {
    let next = this.layers.pop();
    this.lastRef();
    this.layers.push(next);
    this.currentRef[next] = [];
    this.currentRef = this.currentRef[next];
  };

  /**
   * parse json from string
   * @returns {*} JSON object
   */
  this.parse = function () {
    clarinet.onopenobject = (key) => {
      this.onOpenObject(key);
      if (options?.onOpenObject) {
        options.onOpenObject(key, this.currentRef, this.parsedJson);
      }
    };
    clarinet.oncloseobject = () => {
      this.onCloseObject();
      if (options?.onCloseObject) {
        options.onCloseObject(this.currentRef, this.parsedJson);
      }
    };
    clarinet.onkey = (key) => {
      this.onKey(key);
      if (options?.onKey) {
        options.onKey(key, this.currentRef, this.parsedJson);
      }
    };
    clarinet.onvalue = (value) => {
      this.onValue(value);
      if (options?.onValue) {
        options.onValue(value, this.currentRef, this.parsedJson);
      }
    };
    clarinet.onopenarray = () => {
      this.onOpenArray();
      if (options?.onOpenArray) {
        options.onOpenArray(this.currentRef, this.parsedJson);
      }
    };
    clarinet.onclosearray = () => {
      this.onCloseArray();
      if (options?.onCloseArray) {
        options.onCloseArray(this.currentRef, this.parsedJson);
      }
    };
    clarinet.write(json);
    return this.parsedJson;
  };
}

/**
 * Run function function on open object
 * @callback onOpenObject
 * @param {string} key object key name
 * @param {*} currentRef reference of current object
 * @param {object} parsedJson current parsed json value
 */

/**
 * Run function function on object key
 * @callback onKey
 * @param {string} key object key name
 * @param {*} currentRef reference of current object
 * @param {object} parsedJson current parsed json value
 */

/**
 * Run function on value
 * @callback onValue
 * @param {*} value arbitrary value
 * @param {*} currentRef reference of current object
 * @param {object} parsedJson current parsed json value
 */

/**
 * Run function on open array
 * @callback onOpenArray
 * @param {*} currentRef reference of current object
 * @param {object} parsedJson current parsed json value
 */

/**
 * Run function on close array
 * @callback onCloseArray
 * @param {*} currentRef reference of current object
 * @param {object} parsedJson current parsed json value
 */

/**
 * Run function on close object
 * @callback onCloseObject
 * @param {*} currentRef reference of current object
 * @param {object} parsedJson current parsed json value
 */

module.exports = flute; // ♬ wrappers love their little flutes
