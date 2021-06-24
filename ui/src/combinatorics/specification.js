/**
 * A JS representation of a partial specification.
 */
class Specification {
  /**
   * Create a partial specification from root.
   */
  constructor(initialTiling) {
    this.root = initialTiling;
    this.tilings = [initialTiling];
    this.tilingIndex = {};
    this.tilingIndex[initialTiling.key] = 0;
    this.rules = [null];
  }

  /**
   * Get tiling by id.
   */
  getClassById(id) {
    return this.tilings[id];
  }

  /**
   * Get rule by parent id.
   */
  getRuleByLHS(id) {
    return this.rules[id];
  }

  /**
   * Check if tiling has been expanded.
   */
  hasChildren(id) {
    return this.rules[id] !== null;
  }

  getChildren(id) {
    return this.rules[id].children;
  }

  /**
   * Expand the partial specification by adding a rule for tiling.
   */
  addRule(parent, rule) {
    const array = [];
    const newClasses = [];
    const newSiblings = {};
    rule.children.forEach((child) => {
      let idx = this.tilingIndex[child.key];
      if (!idx) {
        newSiblings[`${idx}`] = null;
        idx = this.tilings.length;
        this.tilingIndex[child.key] = idx;
        this.tilings.push(child);
        this.rules.push(null);
        newClasses.push(true);
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
