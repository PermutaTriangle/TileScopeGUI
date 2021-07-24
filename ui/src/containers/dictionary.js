/**
 * Wrap object into a dictionary interface.
 *
 * @param {Object} [obj] defaults to null
 * @returns {{data: Object, get: (any) => any, set: (any, any) => void, contains: (any) => boolean}}
 */
const dictionary = (obj = null) => {
  const data = obj === null ? {} : obj;
  const set = (key, value) => {
    data[key] = value;
  };
  const get = (key) => data[key];
  const contains = (key) => key in data;
  return {
    data,
    set,
    get,
    contains,
  };
};

export default dictionary;
