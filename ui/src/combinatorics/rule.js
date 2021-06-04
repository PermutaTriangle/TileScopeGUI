import Tiling from './tiling';

class Rule {
  constructor(jsonObject) {
    this.formalStep = jsonObject.formal_step;
    this.children = jsonObject.children.map((child) => new Tiling(child));
    this.ruleClass = jsonObject.rule_class;
    this.class_module = jsonObject.class_module;
    this.strategy = jsonObject.strategy;
    this.op = jsonObject.op;
  }
}
export default Rule;
