import $ from 'jquery';

import './styles/spec_tree.scss';
import Tiling from '../combinatorics/tiling';
import Specification from '../combinatorics/specification';
import Treant from '../treant/treant';
import Rule from '../combinatorics/rule';
import Modal from './modal';

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
   */
  static getHTML() {
    return `<div id="${SpecTree.divId}"></div>`;
  }

  /**
   * Raw HTML for a node that is added to Treant.
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
   */
  constructor(parentSelector, initialTilingResponse, errorDisplay, appState) {
    parentSelector.append(SpecTree.getHTML());
    const root = new Tiling(initialTilingResponse);
    this.unverifiedLeaves = new Set();
    if (!root.isVerified()) this.unverifiedLeaves.add(root.key);
    this.appState = appState;
    this.errorDisplay = errorDisplay;
    this.spec = new Specification(root);
    this.treant = new Treant(SpecTree.initConfig(this.spec.root));
    this.nodeIdToClassId = [0];
    this.classIdToNodeIds = [[0]];

    this.setClickEventForNode(0);
  }

  /**
   * Set click event for a new tiling node.
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
   */
  async extendNode(nodeId, rule) {
    this.addRule(nodeId, new Rule(rule));
  }

  /**
   * Add a rule and update spec.
   */
  addRule(nodeId, rule) {
    // TODO: handle eq-rules

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
    parent = this.treant.add(parent, {
      innerHTML: SpecTree.ruleNodeHtml(rule.op, newNodeId),
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

    if (this.unverifiedLeaves.size === 0) this.errorDisplay.alert('Specification!', true);
  }

  remove(removeDiv = true) {
    /**
     * Remove tree.
     */
    this.treant.destroy();
    if (removeDiv) $(`#${SpecTree.divId}`).remove();
  }

  reset() {
    /**
     * Remove everything but the root.
     */
    this.errorDisplay.alert('Not implemented');
  }
}

export default SpecTree;
