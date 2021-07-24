import Tiling from './tiling';

import '../utils/typedefs';

/**
 * A JS representtion of a rule.
 */
class Rule {
  static #DISJOINT_UNION_OP = '+';

  static #EQUIVALENCE_OP = '≅';

  static #ORIGINAL_RULE_KEY = 'original_rule';

  /**
   * If the rule is a disjoint union with one child, convert the
   * op to an equivalence one. Otherwise the original op is returned.
   *
   * @param {RuleResponse} jsonObject
   * @returns {string} op
   */
  static #getOp(jsonObject) {
    if (jsonObject.children.length === 1 && jsonObject.op === Rule.#DISJOINT_UNION_OP) {
      return Rule.#EQUIVALENCE_OP;
    }
    return jsonObject.op;
  }

  /**
   * Extract original rule if exists.
   *
   * @param {RuleResponse} jsonObject
   * @returns {object|undefined} original rule
   */
  static #getOriginalRule(jsonObject) {
    if (Rule.#ORIGINAL_RULE_KEY in jsonObject) {
      return jsonObject.original_rule;
    }
    return undefined;
  }

  /**
   * Create a rule from a server response object.
   *
   * @constructor
   * @param {RuleResponse} jsonObject
   */
  constructor(jsonObject) {
    /** @type {string} */
    this.formalStep = jsonObject.formal_step;
    /** @type {Tiling[]} */
    this.children = jsonObject.children.map((child) => new Tiling(child));
    /** @type {string} */
    this.ruleClass = jsonObject.rule_class;
    /** @type {string} */
    this.classModule = jsonObject.class_module;
    /** @type {object} */
    this.strategy = jsonObject.strategy;
    /** @type {string} */
    this.op = Rule.#getOp(jsonObject);
    /** @type {undefined|object} */
    this.originalRule = Rule.#getOriginalRule(jsonObject);
  }

  /**
   * Rule object where children are represented by ids.
   *
   * @param {number[]} childrenIds
   * @returns {RuleWithoutTilings} rule with child indices.
   */
  withoutTilings(childrenIds) {
    return {
      op: this.op,
      formalStep: this.formalStep,
      ruleClass: this.ruleClass,
      classModule: this.classModule,
      strategy: this.strategy,
      children: childrenIds,
      originalRule: this.originalRule,
    };
  }
}

export default Rule;
