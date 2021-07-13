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
    /** @type {Object.<number, TilingInterface>} */
    this.tilings = { 0: initialTiling };
    /** @type {Object.<string,number>} */
    this.tilingIndex = {};
    this.tilingIndex[initialTiling.key] = 0;
    /** @type {Object.<number, RuleWithoutTilings>} */
    this.rules = {};
  }

  /**
   * Number of unique tilings in the specification.
   *
   * @returns {int} tiling count
   */
  numberOfTilings() {
    return Object.keys(this.tilings).length;
  }

  /**
   * Create an integer key.
   *
   * @returns {number} next key to use.
   */
  getNextKey() {
    let nxt = this.numberOfTilings();
    while (nxt in this.tilings) nxt -= 1;
    return nxt;
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
    return this.rules[id] || null;
  }

  /**
   * Check if tiling has been expanded.
   *
   * @param {number} id
   * @returns {boolean} true iff tiling with id has children
   */
  hasChildren(id) {
    return id in this.rules;
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
    const idx = this.getNextKey();
    this.tilingIndex[tiling.key] = idx;
    this.tilings[idx] = tiling;
    return idx;
  }

  /**
   * Check if adding child to parent causes tautology.
   *
   * @param {number} parentId
   * @param {string} childKey
   * @returns {boolean} true iff adding child to parent causes tautology
   */
  tautologyCheck(parentId, childKey) {
    const idx = this.indexOfKey(childKey);
    if (idx === -1) return false;
    if (idx === parentId) return true;
    let rule = this.getRuleByLHS(idx);
    while (rule !== null && rule.children.length === 1) {
      if (rule.children[0] === parentId) return true;
      rule = this.getRuleByLHS(rule.children[0]);
    }
    return false;
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
