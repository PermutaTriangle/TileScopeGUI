import '../utils/typedefs';

/**
 * A JS representation of a partial specification.
 */
class Specification {
  /**
   * Create a partial specification from root.
   *
   * @constructor
   * @param {TilingInterface} initialTiling
   */
  constructor(initialTiling) {
    /** @type {TilingInterface[]} */
    this.tilings = [initialTiling];
    /** @type {Object.<string,number>} */
    this.tilingIndex = {};
    this.tilingIndex[initialTiling.key] = 0;
    /** @type {Array.<null|RuleWithoutTilings>} */
    this.rules = [null];
  }

  /**
   * Return index for tiling key or -1 if it doesn't exist.
   *
   * @param {string} key
   * @returns {number} the index of key or -1 if doesn't exist
   */
  indexOfKey(key) {
    const idx = this.tilingIndex[key];
    if (!idx && idx !== 0) return -1;
    return idx;
  }

  /**
   * Get root tiling.
   *
   * @returns {TilingInterface} root tiling
   */
  getRoot() {
    return this.tilings[0];
  }

  /**
   * Get tiling by id.
   *
   * @param {number} id
   * @returns {TilingInterface} tiling with given id
   */
  getClassById(id) {
    return this.tilings[id];
  }

  /**
   * Get rule by parent id.
   *
   * @param {number} id
   * @return {null|RuleWithoutTilings} rule who's LHS has given id
   */
  getRuleByLHS(id) {
    return this.rules[id];
  }

  /**
   * Check if tiling has been expanded.
   *
   * @param {number} id
   * @returns {boolean} true iff tiling with id has children
   */
  hasChildren(id) {
    return this.rules[id] !== null;
  }

  /**
   * Get array of children ids.
   *
   * @param {number} id
   * @returns {number[]} children ids array
   */
  getChildren(id) {
    return this.rules[id].children;
  }

  /**
   * Add a tiling to internal data structures. Its id is returned.
   *
   * @param {TilingInterface} tiling
   * @returns {number} id of new tiling
   */
  addNewClass(tiling) {
    const idx = this.tilings.length;
    this.tilingIndex[tiling.key] = idx;
    this.tilings.push(tiling);
    this.rules.push(null);
    return idx;
  }

  /**
   * Expand the partial specification by adding a rule for tiling.
   *
   * @param {number} parent
   * @param {RuleInterface} rule
   * @returns {boolean[]} array of booleans representing if child is new in spec
   */
  addRule(parent, rule) {
    const array = [];
    const newClasses = [];
    const newSiblings = {};
    rule.children.forEach((child) => {
      let idx = this.indexOfKey(child.key);
      if (idx < 0) {
        idx = this.addNewClass(child);
        newClasses.push(true);
        newSiblings[`${idx}`] = null;
      } else {
        newClasses.push(`${idx}` in newSiblings);
      }
      array.push(idx);
    });
    this.rules[parent] = rule.withoutTilings(array);
    return newClasses;
  }
}

export default Specification;
