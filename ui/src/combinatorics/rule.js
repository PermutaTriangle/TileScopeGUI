import Tiling from './tiling';

import '../utils/typedefs';

/**
 * A JS representtion of a rule.
 */
class Rule {
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
    this.op = this.children.length === 1 && jsonObject.op === '+' ? '≅' : jsonObject.op;
    /** @type {undefined|object} */
    this.originalRule = 'original_rule' in jsonObject ? jsonObject.original_rule : undefined;
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
