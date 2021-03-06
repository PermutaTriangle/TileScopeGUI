import { isEquivOp } from '../utils/permuta_utils';

import '../utils/typedefs';

/**
 * A JS representation of a partial specification.
 */
class Specification {
  /**
   *
   * @param {TilingInterface} currTiling
   * @param {OriginalRule} originalRule
   * @param {Dictionary} keyMap
   */
  static #originalRuleToJsonable(currTiling, originalRule, keyMap) {
    const ruleJson = { ...originalRule };
    delete ruleJson.children;
    ruleJson.children = originalRule.children.map((cKey) => keyMap.get(cKey));
    ruleJson.comb_class = keyMap.get(currTiling.key);
    return ruleJson;
  }

  /**
   * @param {Dictionary} dict
   */
  static #addEmpty(dict) {
    const emptyKey = 'AQABAAAAAAA=';
    if (!dict.contains(emptyKey)) {
      const emptyTilingJson = {
        class_module: 'tilings.tiling',
        comb_class: 'Tiling',
        obstructions: [{ patt: [0], pos: [[0, 0]] }],
        requirements: [],
        assumptions: [],
      };
      dict.set(emptyKey, emptyTilingJson);
    }
  }

  /**
   *
   * @param {TilingInterface} currTiling
   * @param {Dictionary} keyMap
   * @returns
   */
  static #verificationRule(currTiling, keyMap) {
    const rule = { ...currTiling.verified };
    delete rule.formal_step;
    rule.comb_class = keyMap.get(currTiling.key);
    return rule;
  }

  static #getJsonableRulesInit() {
    const rules = [];
    const visited = new Set([0]);
    const stack = [0];
    return { rules, visited, stack };
  }

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
   * Get all tiling keys in the (possibly partial) specification.
   *
   * @returns {string[]} keys
   */
  allTilingKeys() {
    return Object.keys(this.tilingIndex);
  }

  /**
   * Remove rule from specification.
   *
   * @param {number} id
   */
  removeRule(id) {
    delete this.rules[id];
  }

  /**
   * Remove class from specification. This will
   * also remove the rule whose LHS is the class
   * if any.
   *
   * @param {number} id
   */
  removeClass(id) {
    const tiling = this.tilings[id];
    delete this.tilingIndex[tiling.key];
    delete this.rules[id];
    delete this.tilings[id];
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
    return this.#parentBelowInSingleChildPath(idx, parentId);
  }

  /**
   * Expand the partial specification by adding a rule for tiling.
   *
   * @param {number} parent
   * @param {RuleInterface} rule
   * @returns {boolean[]} array of booleans representing if child is new in spec
   */
  addRule(parent, rule) {
    const [childIds, newClasses, newSiblings] = [[], [], {}];
    rule.children.forEach((child) => {
      let idx = this.indexOfKey(child.key);
      if (idx < 0) {
        idx = this.addNewClass(child);
        newClasses.push(true);
        newSiblings[idx] = null;
      } else {
        newClasses.push(idx in newSiblings);
      }
      childIds.push(idx);
    });
    this.rules[parent] = rule.withoutTilings(childIds);
    return newClasses;
  }

  /**
   *
   * @param {Dictionary} keyMap
   * @returns {{root: TilingJson, rules: object[]}}
   */
  toSpecificationJson(keyMap) {
    Specification.#addEmpty(keyMap);
    return {
      root: keyMap.get(this.tilings[0].key),
      rules: this.#getJsonableRules(keyMap),
    };
  }

  #getJsonableRules(keyMap) {
    const { rules, visited, stack } = Specification.#getJsonableRulesInit();
    while (stack.length > 0) {
      const curr = stack.pop();
      const currTiling = this.tilings[curr];
      if (this.hasChildren(curr)) {
        this.#jsonExpand(curr, currTiling, visited, stack, rules, keyMap);
      } else if (currTiling.isVerified()) {
        rules.push(Specification.#verificationRule(currTiling, keyMap));
      }
    }
    return rules;
  }

  #jsonExpand(curr, currTiling, visited, stack, rules, keyMap) {
    const rule = this.rules[curr];
    if (isEquivOp(rule.op)) {
      rules.push(this.#constructEquivalencePath(currTiling, rule, visited, stack, keyMap));
    } else {
      rule.children.forEach((c) => {
        if (!visited.has(c)) {
          visited.add(c);
          stack.push(c);
        }
      });
      rules.push(this.#ruleToJsonable(rule, currTiling, keyMap));
    }
  }

  #constructEquivalencePath(currTiling, rule, visited, stack, keyMap) {
    return {
      class_module: 'comb_spec_searcher.strategies.rule',
      rule_class: 'EquivalencePathRule',
      rules: this.#gatherEquivRules(currTiling, rule, visited, stack, keyMap),
    };
  }

  #gatherEquivRules(currTiling, rule, visited, stack, keyMap) {
    const rules = [this.#ruleToJsonable(rule, currTiling, keyMap)];
    let nxt = rule.children[0];
    let nxtRule = this.rules[nxt];
    while (this.hasChildren(nxt) && isEquivOp(nxtRule.op)) {
      rules.push(this.#ruleToJsonable(nxtRule, this.tilings[nxt], keyMap));
      [nxt] = nxtRule.children;
      nxtRule = this.rules[nxt];
    }
    visited.add(nxt);
    stack.push(nxt);
    return rules;
  }

  #ruleToJsonable(rule, currTiling, keyMap) {
    const ruleObj = this.#constructJsonObject(rule, currTiling, keyMap);
    if (rule.originalRule !== undefined) {
      ruleObj.original_rule = Specification.#originalRuleToJsonable(
        currTiling,
        rule.originalRule,
        keyMap,
      );
      delete ruleObj.comb_class;
      delete ruleObj.children;
      delete ruleObj.strategy;
    }
    return ruleObj;
  }

  #constructJsonObject(rule, currTiling, keyMap) {
    return {
      class_module: rule.classModule,
      rule_class: rule.ruleClass,
      comb_class: keyMap.get(currTiling.key),
      children: rule.children.map((c) => keyMap.get(this.tilings[c].key)),
      strategy: rule.strategy,
    };
  }

  /**
   *
   * @param {number} idx
   * @param {number} parentId
   * @returns {boolean} true if parent found
   */
  #parentBelowInSingleChildPath(idx, parentId) {
    let rule = this.getRuleByLHS(idx);
    while (rule !== null && rule.children.length === 1) {
      if (rule.children[0] === parentId) return true;
      rule = this.getRuleByLHS(rule.children[0]);
    }
    return false;
  }
}

export default Specification;
