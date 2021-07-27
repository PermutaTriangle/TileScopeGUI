/**
 * Wrap object into a dictionary interface.
 *
 * @param {Object} [obj] defaults to null
 * @returns {{data: Object, get: (any) => any, set: (any, any) => void, contains: (any) => boolean}}
 */
const dictionary = (obj = null) => {
  // Underlying js object
  const data = obj === null ? {} : obj;

  // Set value for key
  const set = (key, value) => {
    data[key] = value;
  };

  // Get value of key
  const get = (key) => data[key];

  // Check if key has a value
  const contains = (key) => key in data;

  return {
    data,
    set,
    get,
    contains,
  };
};

export default dictionary;
