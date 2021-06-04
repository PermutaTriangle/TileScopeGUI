class Specification {
  constructor(initialTiling) {
    this.root = initialTiling;
    this.tilings = [initialTiling];
    this.tilingIndex = {};
    this.tilingIndex[initialTiling.key] = 0;
    this.rules = [null];
  }

  getClassById(id) {
    return this.tilings[id];
  }

  hasChildren(id) {
    return this.rules[id] !== null;
  }

  addRule(parent, rule) {
    const array = [];
    const newClasses = [];
    rule.children.forEach((child) => {
      let idx = this.tilingIndex[child.key];
      if (!idx) {
        idx = this.tilings.length;
        this.tilingIndex[child.key] = idx;
        this.tilings.push(child);
        this.rules.push(null);
        newClasses.push(true);
      } else {
        newClasses.push(false);
      }
      array.push(idx);
    });
    this.rules[parent] = array;
    return newClasses;
  }
}

export default Specification;
