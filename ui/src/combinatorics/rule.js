import Tiling from './tiling';

/**
 * A JS representtion of a rule.
 */
class Rule {
  /**
   * Create a rule from a server response object.
   */
  constructor(jsonObject) {
    this.formalStep = jsonObject.formal_step;
    this.children = jsonObject.children.map((child) => new Tiling(child));
    this.ruleClass = jsonObject.rule_class;
    this.classModule = jsonObject.class_module;
    this.strategy = jsonObject.strategy;
    this.op = jsonObject.op;
  }

  /**
   * Rule object where children are represented by ids.
   */
  withoutTilings(childrenIds) {
    return {
      formalStep: this.formalStep,
      ruleClass: this.ruleClass,
      classModule: this.classModule,
      strategy: this.strategy,
      children: childrenIds,
    };
  }
}

export default Rule;
