/**@type {Object.<string, Function>})*/
var listeners = {};

/**@type {Object.<string, Array>}*/
var bindings = {};


/**
 * Denote that a feature is starting
 * @param {string} name
 * @param {Function} cb
 */
function feature(name, cb) {
  function when(step, nextStep) {
    var fullStep = name + '.' + step;
    if (!bindings[fullStep]) {
      bindings[fullStep] = [];
    }
    bindings[fullStep].push(nextStep);
  }

  cb(when);
}

/**
 * Call this to tell the feature to execute a new step
 * @param {string} step
 * @param {Object} opts - (optional)
 * @param {string} opts.feature - feature to start executing
 */
function fire(step, opts) {
  if (opts && opts.feature) {
    fire.currentFeature = opts.feature;
  }
  /** @type {Array} */
  var boundListeners = bindings[fire.currentFeature + '.' + step];
  if (!boundListeners) {
    console.warn('No listeners for ' + step + ' (feature ' + fire.currentFeature + ')');
    return;
  }
  boundListeners.forEach(function (nextStep) {  // allow multiple listeners
    var cb = listeners[nextStep];
    if (!cb) {
      console.error('No listener for ' + nextStep);
      return;
    }
    cb();
  });
}

/**
 * Use this to tie a step to a section of functionality
 * @param {string} step
 * @param {Function} cb
 */
function listen(step, cb) {
  listeners[step] = cb;
}

module.exports = {feature: feature, fire: fire, listen: listen};