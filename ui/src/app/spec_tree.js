import $ from 'jquery';

import './styles/spec_tree.scss';
import Tiling from '../combinatorics/tiling';
import Specification from '../combinatorics/specification';
import Treant from '../treant/treant';
import Rule from '../combinatorics/rule';
import Modal from './modal';

import '../utils/typedefs';

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
   * Raw HTML for a node that is added to Treant.
   *
   * @param {TilingInterface} tiling
   * @param {number} label
   * @param {number} nodeId
   * @param {boolean} [duplicate] defaults to false
   * @returns {string} raw HTML string
   */
  static nodeHtml(tiling, label, nodeId, duplicate = false) {
    let additionalClasses = '';
    if (tiling.isVerified()) additionalClasses = ' spec-node-verified';
    else if (duplicate) additionalClasses = ' spec-node-duplicate';
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
        innerHTML: SpecTree.nodeHtml(root, 1, 0),
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
    /** @type {number[]} */
    this.nodeIdToClassId = [0];
    /** @type {number[][]} */
    this.classIdToNodeIds = [[0]];

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
   * Add a rule and update spec.
   *
   * @param {number} nodeId
   * @param {Rule} rule
   */
  addRule(nodeId, rule) {
    const classId = this.nodeIdToClassId[nodeId];
    const newClasses = this.spec.addRule(classId, rule);
    const children = this.spec.getChildren(classId);
    const nodeParents = this.classIdToNodeIds[classId];

    this.unverifiedLeaves.delete(this.spec.getClassById(classId).key);

    // Color duplicates
    nodeParents.forEach((parentId) => {
      if (parentId !== nodeId) {
        $(`#spec-node-${parentId}`).addClass('spec-node-duplicate');
      }
    });

    // Add rule node
    let parent = this.treant.getNode(nodeId);
    let newNodeId = this.treant.getNodeCount();
    const op = children.length === 1 && rule.op === '+' ? '≅' : rule.op;
    parent = this.treant.add(parent, {
      innerHTML: SpecTree.ruleNodeHtml(op, newNodeId),
      collapsable: false,
      collapsed: false,
    });
    this.nodeIdToClassId.push(classId);

    // Add child nodes
    children.forEach((childId, idx) => {
      newNodeId += 1;
      const dup = !newClasses[idx] && this.spec.hasChildren(childId);
      const childTiling = this.spec.getClassById(childId);
      if (!dup && !childTiling.isVerified()) this.unverifiedLeaves.add(childTiling.key);
      this.treant.add(parent, {
        innerHTML: SpecTree.nodeHtml(childTiling, childId + 1, newNodeId, dup),
        collapsable: false,
        collapsed: false,
      });
      this.nodeIdToClassId.push(childId);
      while (this.classIdToNodeIds.length <= childId) this.classIdToNodeIds.push([]);
      this.classIdToNodeIds[childId].push(newNodeId);
      this.setClickEventForNode(newNodeId);
    });

    if (this.hasSpecification()) this.errorDisplay.alert('Specification!', true);
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
