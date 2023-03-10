/**
 * Sets a dynamic default value when undefined, by calling the factory function
 * @template T
 * @template {keyof T} P
 * @param {T} obj an object
 * @param {P} prop a property of this object
 * @param {function(): T[P]} factory a default value factory for the property
 * @returns {void}
 */
const F = (obj, prop, factory) => {
  if (obj[prop] === undefined) {
    obj[prop] = factory();
  }
};

/**
 * @param {WebpackOptions} options options to be modified
 * @returns {void}
 * TODO - 
 */
const applyWebpackOptionsBaseDefaults = (options) => {
  F(options, "context", () => process.cwd());
};

const applyWebpackOptionsDefaults = (options) => {
  // TODO - 
  F(options, "context", () => process.cwd());
};

exports.applyWebpackOptionsBaseDefaults = applyWebpackOptionsBaseDefaults;
exports.applyWebpackOptionsDefaults = applyWebpackOptionsDefaults;
