/**@type {Object.<string, Function>})*/
var listeners = {};

/**@type {Object.<string, Array>}*/
var bindings = {};

/**@type {string}*/
var currentFeature;

/**
 * Listeners to call upon beginning features
 * @type {Object.<string, string>}
 */
var featureEntrees = {};

/**
 * A function called when a listener isn't found for a step.
 * @type {Function}
 */
var onListenerNotFound;

/**
 * Set a handler for when a step listener wasn't found.
 * @param {Function} cb 
 */
function setOnListenerNotFound(cb) {
  onListenerNotFound = cb;
}

/**
 * Denote that a feature is starting
 * @param {string} name
 * @param {Function} cb
 */
function feature(name, cb) {
  /**
   * After `step`, you may list as many events to fire as you wish
   * @param {string} step
   */
  function when(step) {
    // allow multiple steps to fire
    var steps = Array.prototype.slice.call(arguments, 1);

    steps.forEach(function (nextStep) {
      var fullStep = name + '.' + step;
      if (!bindings[fullStep]) {
        bindings[fullStep] = [];
      }
      bindings[fullStep].push(nextStep);
    });
  }

  /**
   * Execute this step automatically when entering the feature
   * @param  {string} stepName - The name of the step to execute
   * @return {void}
   */
  function startWith(stepName) {
    featureEntrees[name] = stepName;
  }

  cb(when, startWith);
}

/**
 * Call this to tell the feature to execute a new step
 * @param {string} step
 * @param {Object} [opts] - (optional)
 * @param {string} opts.feature - feature to start executing
 */
function fire(step, opts) {
  if (opts && opts.feature) {
    currentFeature = opts.feature;
  }
  /** @type {Array} */
  var boundListeners = bindings[currentFeature + '.' + step];
  if (!boundListeners) {
    const message = 'No listeners for ' + step + ' (feature ' + currentFeature + ')';
    if (onListenerNotFound) {
      onListenerNotFound(message, opts);
      return;
    }
    console.warn(message);
    return;
  }
  boundListeners.forEach(function (nextStep) {  // allow multiple listeners
    var cb = listeners[nextStep];
    if (!cb) {
      const message = 'No listener for ' + nextStep;
      if (onListenerNotFound) {
        onListenerNotFound(message, opts);
        return;
      }
      console.error(message);
      return;
    }
    cb(opts);
  });
}

/**
 * Signal that a certain feature is commencing
 * @param {string} name
 * @param {string} [event] - An event to fire upon starting the feature
 */
function startFeature(name, event) {
  currentFeature = name;
  // fire the entree event first - if it exists
  var entree = featureEntrees[name];
  if (entree) {
    entree = listeners[entree];
    if (entree) {
      entree();
    }
  }
  if (event) {
    fire(event);
  }
}

/**
 * Use this to tie a step to a section of functionality
 * @param {string} step
 * @param {Function} cb
 */
function listen(step, cb) {
  listeners[step] = cb;
}

module.exports = {
  feature: feature, startFeature: startFeature, fire: fire, listen: listen,
  setOnListenerNotFound: setOnListenerNotFound
};
