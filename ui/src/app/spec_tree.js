import $ from 'jquery';

import * as bootstrap from 'bootstrap';

import Tiling from '../combinatorics/tiling';
import Specification from '../combinatorics/specification';
import Treant from '../treant/treant';
import Rule from '../combinatorics/rule';
import Modal from './modal';
import Queue from '../containers/queue';

import '../utils/typedefs';

import './styles/spec_tree.scss';
/**
 * A component for the specification tree.
 */
class SpecTree {
  /**
   * The div id of the SpecTree's container.
   */
  static divId = 'spec-tree';

  /**
   * Raw HTML for SpecTree.
   *
   * @returns {string} raw HTML string
   */
  static getHTML() {
    return `<div id="${SpecTree.divId}"></div>`;
  }

  /**
   * Create a modal for viewing rule.
   *
   * @param {string} formalStep
   * @returns {string} raw HTML string
   */
  static ruleNodeModalHtml(formalStep) {
    return `<div id="rule-modal" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">
              <p>${formalStep}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="rem-rule" type="button" class="btn btn-danger">Remove</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  /**
   * Raw HTML for a node that is added to Treant.
   *
   * @param {TilingInterface} tiling
   * @param {number} label
   * @param {number} nodeId
   * @param {boolean} [duplicate] defaults to false
   * @returns {string} raw HTML string
   */
  static nodeHtml(tiling, label, nodeId, duplicate = false, expanded = false) {
    let additionalClasses = '';
    if (tiling.isVerified()) additionalClasses = ' spec-node-verified';
    else if (duplicate) additionalClasses = ' spec-node-duplicate';
    else if (!expanded) additionalClasses = ' spec-node-todo';
    return `<div id="spec-node-${nodeId}" class="spec-node-container${additionalClasses}">
      <div class="spec-node-label">${label}</div>
      <div class="spec-node">
        <div class="spec-node-inner-content">
          ${tiling.asciiHTML()}
        </div>
      </div>
    </div>`;
  }

  /**
   * Raw HTML for a rule node.
   *
   * @param {string} op
   * @param {number} nodeId
   * @returns {string} raw HTML string
   */
  static ruleNodeHtml(op, nodeId) {
    return `<div id="spec-node-${nodeId}" class="rule-node">${op}</div>`;
  }

  /**
   * Base config for Treant.
   */
  static chart = {
    maxDepth: 10000,
    container: `#${SpecTree.divId}`,
    connectors: { type: 'bCurve', style: {} },
    nodeAlign: 'BOTTOM',
    levelSeparation: 35,
    siblingSeparation: 30,
    connectorsSpeed: 10,
    animation: { nodeSpeed: 0, connectorsSpeed: 0 },
  };

  /**
   * Treant's initial configuration given a root class.
   *
   * @param {TilingInterface} root
   * @returns {{nodeStructure: {innerHTML: string, collapsable: boolean, collapsed: boolean}, chart: SpecTree.chart}} treant config
   */
  static initConfig(root) {
    return {
      nodeStructure: {
        innerHTML: SpecTree.nodeHtml(root, 0, 0),
        collapsable: false,
        collapsed: false,
      },
      chart: SpecTree.chart,
    };
  }

  /**
   * Create a specification tree component.
   *
   * @param {JQuery} parentSelector
   * @param {TilingResponse} initialTilingResponse
   * @param {ErrorDisplayInterface} errorDisplay
   * @param {AppStateInterface} appState
   */
  constructor(parentSelector, initialTilingResponse, errorDisplay, appState) {
    parentSelector.append(SpecTree.getHTML());
    const root = new Tiling(initialTilingResponse);
    /** @type {Set.<string>} */
    this.unverifiedLeaves = new Set();
    if (!root.isVerified()) this.unverifiedLeaves.add(root.key);
    /** @type {AppStateInterface} */
    this.appState = appState;
    /** @type {ErrorDisplayInterface} */
    this.errorDisplay = errorDisplay;
    /** @type {Specification} */
    this.spec = new Specification(root);
    /** @type {Treant} */
    this.treant = new Treant(SpecTree.initConfig(this.spec.getRoot()));

    /** @type {Object.<number,number>} */
    this.nodeIdToClassId = { 0: 0 };
    /** @type {Object.<number, Set<number>>} */
    this.classIdToNodeIds = { 0: new Set([0]) };

    this.setClickEventForNode(0);
  }

  /**
   * Check if we have a specification.
   *
   * @returns {boolean} true iff spec
   */
  hasSpecification() {
    return this.unverifiedLeaves.size === 0;
  }

  /**
   * Get root tiling.
   *
   * @returns {TilingInterface} root tiling
   */
  getRoot() {
    return this.spec.getRoot();
  }

  moveNodesThatCanBeMoved(nodeId, children) {
    const { classToAlternative, counter } = this.classAlternatives(nodeId);
    let moved = true;

    while (moved) {
      const queue = new Queue(this.treant.numberOfNodes());
      children.forEach((c) => {
        queue.enqueue(c);
      });
      moved = false;
      while (!queue.isEmpty()) {
        const currNodeId = queue.dequeue();
        const currClassId = this.nodeIdToClassId[currNodeId];
        const currChildren = this.nodeChildren(currNodeId);
        if (currChildren.length > 0) {
          if (currClassId in classToAlternative) {
            const altNodeId = classToAlternative[currClassId];
            if (currChildren.length > 0) {
              moved = true;
              this.treant.moveChildren(currNodeId, altNodeId, false);
              $(`#spec-node-{altNodeId}`).removeClass('spec-node-duplicate');
              const stack = [...this.nodeChildren(currNodeId)];
              while (stack.length > 0) {
                const currChild = stack.pop();
                const currChildChildren = this.nodeChildren(currChild);
                if (currChildChildren.length === 0) {
                  const currChildClassId = this.nodeIdToClassId[currChild];
                  if (!(currChildClassId in classToAlternative)) {
                    classToAlternative[currChildClassId] = currChild;
                  }
                } else {
                  currChildChildren.forEach((cc) => {
                    stack.push(cc);
                  });
                }
              }
            }
          } else {
            currChildren.forEach((c) => {
              queue.enqueue(c);
            });
          }
        }
      }
    }
  }

  classAlternatives(parentOfRuleToRemove) {
    let counter = 0;
    const classToAlternative = {};
    const queue = new Queue();
    queue.enqueue(0);
    while (!queue.isEmpty()) {
      const curr = queue.dequeue();
      if (curr !== parentOfRuleToRemove) {
        counter += 1;
        const classId = this.nodeIdToClassId[curr];
        if (!(classId in classToAlternative)) {
          const children = this.nodeChildren(curr);
          if (children.length === 0) {
            classToAlternative[classId] = curr;
          } else {
            children.forEach((c) => {
              queue.enqueue(c);
            });
          }
        }
      }
    }
    return { classToAlternative, counter };
  }

  /**
   * Remove the rule who's LHS has given id.
   *
   * @param {number} classId
   */
  removeRuleFromNode(nodeId) {
    const classId = this.nodeIdToClassId[nodeId];
    const children = this.nodeChildren(nodeId);

    // Update complete-spec tracker
    this.unverifiedLeaves.add(classId);

    // Update colors of nodes
    this.classIdToNodeIds[classId].forEach((nId) => {
      $(`#spec-node-${nId}`).addClass('spec-node-todo').removeClass('spec-node-duplicate');
    });

    // Update spec object
    this.spec.removeRule(classId);

    // Move the parts that can be moved
    this.moveNodesThatCanBeMoved(nodeId, children);

    // Delete every desentant of nodeId
    this.treant.removeAllDescendantOf(nodeId, (nId) => {
      console.log(nId);
      const cId = this.nodeIdToClassId[nId];
      if (cId in this.classIdToNodeIds) {
        this.classIdToNodeIds[cId].delete(nId);
        if (this.classIdToNodeIds[cId].size === 0) {
          delete this.classIdToNodeIds[cId];
          this.spec.removeClass(cId);
        }
      }
      delete this.nodeIdToClassId[nId];
    });
  }

  /**
   * Set click event for a new tiling node.
   *
   * @param {number} nodeId
   */
  setClickEventForNode(nodeId) {
    $(`#spec-node-${nodeId}`).on('click', () => {
      const classId = this.nodeIdToClassId[nodeId];
      const node = this.treant.getNode(nodeId);
      const tiling = this.spec.getClassById(classId);
      const rule = this.spec.getRuleByLHS(classId);
      Modal.render(
        tiling,
        this.appState,
        node.nodeInnerHTML,
        rule,
        this.errorDisplay,
        (newRule) => {
          this.extendNode(nodeId, newRule);
        },
      );
    });
  }

  /**
   * Extend node with given id with given rule.
   *
   * @param {number} nodeId
   * @param {RuleResponse} rule
   */
  async extendNode(nodeId, rule) {
    this.addRule(nodeId, new Rule(rule));
  }

  /**
   * Get node id of children (not the rule but classes).
   *
   * @param {number} nodeId
   * @returns {number[]} node ids of children
   */
  nodeChildren(nodeId) {
    const node = this.treant.getNode(nodeId);
    if (node.children.length === 0) return [];
    return this.treant.getNode(node.children[0]).children;
  }

  /**
   * Add a rule and update spec.
   *
   * @param {number} nodeId
   * @param {Rule} rule
   */
  addRule(nodeId, rule) {
    console.log(rule);
    // Get class id
    const classId = this.nodeIdToClassId[nodeId];

    // Check if tautology
    if (rule.children.length === 1 && this.spec.tautologyCheck(classId, rule.children[0].key)) {
      this.errorDisplay.alert('Rule creates a tautology!');
      return;
    }

    // Add rule to spec
    const newClasses = this.spec.addRule(classId, rule);
    const children = this.spec.getChildren(classId);
    const nodeParents = this.classIdToNodeIds[classId];

    // Not unverified any more
    this.unverifiedLeaves.delete(this.spec.getClassById(classId).key);

    // Update colors of duplicates
    nodeParents.forEach((parentId) => {
      $(`#spec-node-${parentId}`).removeClass('spec-node-todo');
      if (parentId !== nodeId) {
        $(`#spec-node-${parentId}`).addClass('spec-node-duplicate');
      }
    });

    // Add rule node
    const parent = this.addRuleNode(nodeId, classId, children.length, rule);

    // Add child nodes
    this.addChildNodes(children, newClasses, parent);

    // Check if spec
    if (this.hasSpecification()) this.errorDisplay.alert('Specification!', true);
  }

  /**
   * Add a treant node for the rule.
   *
   * @param {number} nodeId
   * @param {number} classId
   * @param {number} numberOfChildren
   * @param {Rule} rule
   * @returns {number} node Id of rule node
   */
  addRuleNode(nodeId, classId, numberOfChildren, rule) {
    const parentNode = this.treant.getNode(nodeId);
    const newNodeId = this.treant.getNextKey();
    const op = numberOfChildren === 1 && rule.op === '+' ? '≅' : rule.op;
    const ruleNode = this.treant.add(parentNode, {
      innerHTML: SpecTree.ruleNodeHtml(op, newNodeId),
      collapsable: false,
      collapsed: false,
    });
    this.nodeIdToClassId[newNodeId] = classId;
    $(`#spec-node-${newNodeId}`).on('click', (evt) => {
      const parentOfRule = this.nodeIdToClassId[parseInt(evt.currentTarget.id.match(/\d+/)[0], 10)];
      const modalRule = this.spec.getRuleByLHS(parentOfRule);
      $('body').append(SpecTree.ruleNodeModalHtml(modalRule.formalStep));

      const modal = new bootstrap.Modal('#rule-modal');
      modal.show();

      // TODO: For some reason, hidden.bs.modal isn't working. Temp solution.
      $('body > div.modal-backdrop.show').on('DOMNodeRemoved', () => {
        $('#rule-modal').remove();
      });

      $('#rem-rule').on('click', () => {
        this.removeRuleFromNode(parentNode.id);
        modal.hide();
      });
    });

    return ruleNode;
  }

  /**
   * Draw children when adding rule.
   *
   * @param {number[]} children
   * @param {boolean[]} newClasses
   * @param {number} parent
   */
  addChildNodes(children, newClasses, parent) {
    let newNodeId = this.treant.getNextKey();
    children.forEach((childId, idx) => {
      const dup = !newClasses[idx] && this.spec.hasChildren(childId);
      const childTiling = this.spec.getClassById(childId);
      if (!dup && !childTiling.isVerified()) this.unverifiedLeaves.add(childTiling.key);
      this.treant.add(parent, {
        innerHTML: SpecTree.nodeHtml(childTiling, childId, newNodeId, dup),
        collapsable: false,
        collapsed: false,
      });

      this.nodeIdToClassId[newNodeId] = childId;
      if (!(childId in this.classIdToNodeIds)) this.classIdToNodeIds[childId] = new Set();
      this.classIdToNodeIds[childId].add(newNodeId);
      this.setClickEventForNode(newNodeId);
      newNodeId += 1;
    });
  }

  /**
   * Remove treant object and optionally div containing it.
   *
   * @param {boolean} [removeDiv] defaults to true
   */
  remove(removeDiv = true) {
    /**
     * Remove tree.
     */
    this.treant.destroy();
    if (removeDiv) $(`#${SpecTree.divId}`).remove();
  }
}

export default SpecTree;
