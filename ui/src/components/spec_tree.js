import $ from 'jquery';

import Modal from './bootstrap_wrappers/modal';

import Tiling from '../combinatorics/tiling';
import Specification from '../combinatorics/specification';
import Treant from '../treant/treant';
import Rule from '../combinatorics/rule';
import Queue from '../containers/queue';
import viewClassNode from './node_viewer';

import '../utils/typedefs';

import './styles/spec_tree.scss';
import dictionary from '../containers/dictionary';

/**
 * A component for the specification tree.
 */
class SpecTree {
  // #region Static variables

  /**
   * The div id of the SpecTree's container.
   */
  static #divId = 'spec-tree';

  /**
   * Base config for Treant.
   */
  static #chart = {
    maxDepth: 10000,
    container: `#${SpecTree.#divId}`,
    connectors: { type: 'bCurve', style: {} },
    nodeAlign: 'BOTTOM',
    levelSeparation: 35,
    siblingSeparation: 30,
    connectorsSpeed: 10,
    animation: { nodeSpeed: 0, connectorsSpeed: 0 },
  };

  // #endregion

  // #region Static functions

  /**
   * Raw HTML for SpecTree.
   *
   * @returns {string} raw HTML string
   */
  static #getHTML() {
    return `<div id="${SpecTree.#divId}"></div>`;
  }

  /**
   * Additional node class for label.
   *
   * @param {TilingInterface} tiling
   * @param {boolean} duplicate
   * @param {boolean} expanded
   * @returns {string} class
   */
  static #additionalNodeClass(tiling, duplicate, expanded) {
    if (tiling.isVerified()) return ' spec-node-verified';
    if (duplicate) return ' spec-node-duplicate';
    if (!expanded) return ' spec-node-todo';
    return '';
  }

  /**
   * Raw HTML for a node that is added to Treant.
   *
   * @param {TilingInterface} tiling
   * @param {number} label
   * @param {number} nodeId
   * @param {boolean} [duplicate] defaults to false
   * @param {boolean} [expanded] defaults to false
   * @returns {string} raw HTML string
   */
  static #nodeHtml(tiling, label, nodeId, duplicate = false, expanded = false) {
    const additionalClass = SpecTree.#additionalNodeClass(tiling, duplicate, expanded);
    return `<div id="spec-node-${nodeId}" class="spec-node-container${additionalClass}">
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
  static #ruleNodeHtml(op, nodeId) {
    return `<div id="spec-node-${nodeId}" class="rule-node">${op}</div>`;
  }

  /**
   * Create data for creating treant nodes.
   *
   * @param {string} html
   * @returns {TreantNodeData} data
   */
  static #treantNodeData(html) {
    return {
      innerHTML: html,
      collapsable: false,
      collapsed: false,
    };
  }

  /**
   * Create data for treant class Node.
   *
   * @param {TilingInterface} tiling
   * @param {number} label
   * @param {number} nodeId
   * @param {boolean} [duplicate] defaults to false
   * @param {boolean} [expanded] defaults to false
   * @returns {TreantNodeData} data
   */
  static #treantClassNodeData(tiling, label, nodeId, duplicate = false, expanded = false) {
    return SpecTree.#treantNodeData(SpecTree.#nodeHtml(tiling, label, nodeId, duplicate, expanded));
  }

  /**
   * Create data for treant rule node.
   *
   * @param {string} op
   * @param {number} newNodeId
   * @returns {TreantNodeData} data
   */
  static #treantRuleNodeData(op, newNodeId) {
    return SpecTree.#treantNodeData(SpecTree.#ruleNodeHtml(op, newNodeId));
  }

  /**
   * Treant's initial configuration given a root class.
   *
   * @param {TilingInterface} root
   * @returns {{nodeStructure: TreantNodeData, chart: SpecTree.chart}} treant config
   */
  static #initConfig(root) {
    return { nodeStructure: SpecTree.#treantClassNodeData(root, 0, 0), chart: SpecTree.#chart };
  }

  /**
   * Create a set of keys and add the root if not verified.
   *
   * @param {Tiling} root
   * @returns {Set.<string>} set
   */
  static #initUnverifiedLeaves(root) {
    const set = new Set();
    if (!root.isVerified()) set.add(root.key);
    return set;
  }

  /**
   * Create a modal from rule.
   *
   * @param {RuleWithoutTilings} modalRule
   * @returns {Modal} modal
   */
  static #createRuleModal(modalRule) {
    return new Modal({
      parentSelector: $('body'),
      type: Modal.CENTRAL,
      id: 'rule-modal',
      header: '',
      body: `<p>${modalRule.formalStep}</p>`,
      footer: `${Modal.closeFooterButton()}${Modal.dangerFooterButton('rem-rule', 'Remove')}`,
      startVisible: true,
      closeOnEscape: true,
    });
  }

  /**
   * Extract node id from click event.
   *
   * @param {JQuery.ClickEvent} evt
   * @returns {number} id
   */
  static #nodeIdFromEvent(evt) {
    return parseInt(evt.currentTarget.id.match(/\d+/)[0], 10);
  }

  /**
   * Initialize bfs search variables.
   *
   * @returns {{classToAlternative: ClassToAlternative, queue: Queue }}
   */
  static #bfsInit() {
    const queue = new Queue();
    queue.enqueue(0);
    return { classToAlternative: dictionary(), queue };
  }

  // #endregion

  // #region Private instance variables

  /** @type {Set.<string>} */
  #unverifiedLeaves;

  /** @type {AppStateInterface} */
  #appState;

  /** @type {ErrorDisplayInterface} */
  #errorDisplay;

  /** @type {Specification} */
  #spec;

  /** @type {Treant} */
  #treant;

  /** @type {Object.<number,number>} */
  #nodeIdToClassId;

  /** @type {Object.<number, Set<number>>} */
  #classIdToNodeIds;

  // #endregion

  // #region Public functions

  /**
   * Create a specification tree component.
   *
   * @param {JQuery} parentSelector
   * @param {TilingResponse} initialTilingResponse
   * @param {ErrorDisplayInterface} errorDisplay
   * @param {AppStateInterface} appState
   */
  constructor(parentSelector, initialTilingResponse, errorDisplay, appState) {
    parentSelector.append(SpecTree.#getHTML());
    const root = new Tiling(initialTilingResponse);
    this.#unverifiedLeaves = SpecTree.#initUnverifiedLeaves(root);
    this.#appState = appState;
    this.#errorDisplay = errorDisplay;
    this.#spec = new Specification(root);
    this.#treant = new Treant(SpecTree.#initConfig(this.#spec.getRoot()));
    this.#nodeIdToClassId = { 0: 0 };
    this.#classIdToNodeIds = { 0: new Set([0]) };
    this.#setClickEventForNode(0);
  }

  /**
   * Get root tiling.
   *
   * @returns {TilingInterface} root tiling
   */
  getRoot() {
    return this.#spec.getRoot();
  }

  /**
   * Check if we have a specification.
   *
   * @returns {boolean} true iff spec
   */
  hasSpecification() {
    return this.#unverifiedLeaves.size === 0;
  }

  /**
   * Getter for specification.
   *
   * @returns {Specification} specification
   */
  getSpecification() {
    return this.#spec;
  }

  /**
   * Remove treant object and optionally div containing it.
   *
   * @param {boolean} [removeFromDom] defaults to true
   */
  remove(removeFromDom = true) {
    /**
     * Remove tree.
     */
    this.#treant.destroy();
    if (removeFromDom) $(`#${SpecTree.#divId}`).remove();
  }

  // #endregion

  // #region Private functions

  /**
   * Once a node is moved, it children are possibly new alternatives.
   * This functions updates the container of alternatives.
   *
   * @param {number[]} stack
   * @param {ClassToAlternative} classToAlternative
   */
  #updateAlternatives(stack, classToAlternative) {
    while (stack.length > 0) {
      const currChild = stack.pop();
      const currChildChildren = this.#nodeChildren(currChild);
      if (currChildChildren.length === 0) {
        const currChildClassId = this.#nodeIdToClassId[currChild];
        if (!classToAlternative.contains(currChildClassId)) {
          classToAlternative.set(currChildClassId, currChild);
        }
      } else {
        currChildChildren.forEach((cc) => {
          stack.push(cc);
        });
      }
    }
  }

  /**
   * Move children from parent to new parent.
   *
   * @param {ClassToAlternative} classToAlternative
   * @param {number} currNodeId
   * @param {number} altNodeId
   */
  #moveChildren(classToAlternative, currNodeId, altNodeId) {
    const ruleNodeId = this.#treant.getNode(currNodeId).children[0];
    this.#treant.moveChildren(currNodeId, altNodeId, false);
    $(`#spec-node-${altNodeId}`).removeClass('spec-node-duplicate');
    this.#setRuleOnClickListener(ruleNodeId, altNodeId);
    const stack = [...this.#nodeChildren(currNodeId)];
    this.#updateAlternatives(stack, classToAlternative);
  }

  /**
   * Expansion for move bfs.
   *
   * @param {ClassToAlternative} classToAlternative
   * @param {Queue} queue
   * @param {number} currClassId
   * @param {number} currNodeId
   * @param {number[]} currChildren
   * @returns {boolean} moved something
   */
  #moveIterationExpand(classToAlternative, queue, currClassId, currNodeId, currChildren) {
    if (classToAlternative.contains(currClassId)) {
      const altNodeId = classToAlternative.get(currClassId);
      if (currChildren.length > 0) {
        this.#moveChildren(classToAlternative, currNodeId, altNodeId);
        return true;
      }
    } else {
      currChildren.forEach((c) => {
        queue.enqueue(c);
      });
    }
    return false;
  }

  /**
   * Data for current in BFS.
   *
   * @param {Queue} queue
   * @returns {{currNodeId: number, currClassId: number, currChild: number[]}} current data
   */
  #moveGetCurr(queue) {
    const currNodeId = queue.dequeue();
    const currClassId = this.#nodeIdToClassId[currNodeId];
    const currChildren = this.#nodeChildren(currNodeId);
    return { currNodeId, currClassId, currChildren };
  }

  /**
   * A single iteration of finding alternatives.
   *
   * @param {ClassToAlternative} classToAlternative
   * @returns {boolean} moved something
   */
  #moveIteration(classToAlternative, children) {
    const queue = new Queue(this.#treant.numberOfNodes());
    children.forEach((c) => {
      queue.enqueue(c);
    });
    let moved = false;
    while (!queue.isEmpty()) {
      const { currNodeId, currClassId, currChildren } = this.#moveGetCurr(queue);
      if (currChildren.length > 0) {
        moved =
          moved ||
          this.#moveIterationExpand(
            classToAlternative,
            queue,
            currClassId,
            currNodeId,
            currChildren,
          );
      }
    }
    return moved;
  }

  /**
   * Find alternative spots for rules with parents existing outside
   * the scope of descendants of the removed one.
   *
   * @param {number} nodeId
   * @param {number[]} children
   */
  #moveNodesThatCanBeMoved(nodeId, children) {
    const classToAlternative = this.#classAlternatives(nodeId);
    while (this.#moveIteration(classToAlternative, children));
  }

  /**
   * Expansion step in finding alternatives bfs.
   *
   * @param {number} curr
   * @param {ClassToAlternative} classToAlternative
   * @param {Queue} queue
   */
  #alternativesExpand(curr, classToAlternative, queue) {
    const classId = this.#nodeIdToClassId[curr];
    if (!classToAlternative.contains(classId)) {
      const children = this.#nodeChildren(curr);
      if (children.length === 0) {
        classToAlternative.set(classId, curr);
      } else {
        children.forEach((c) => {
          queue.enqueue(c);
        });
      }
    }
  }

  /**
   * BFS without memorization that gathers all possible
   * alternatives in the tree for classes, among those not
   * directly under the removed rule.
   *
   * @param {number} parentOfRuleToRemove
   * @returns {ClassToAlternative}
   */
  #classAlternatives(parentOfRuleToRemove) {
    const { classToAlternative, queue } = SpecTree.#bfsInit();
    while (!queue.isEmpty()) {
      const curr = queue.dequeue();
      if (curr !== parentOfRuleToRemove) {
        this.#alternativesExpand(curr, classToAlternative, queue);
      }
    }
    return classToAlternative;
  }

  /**
   * Remove any duplicate coloring from the class with the
   * removed rule and add `todo` class.
   *
   * @param {number} classId
   */
  #cleanColorClasses(classId) {
    this.#classIdToNodeIds[classId].forEach((nId) => {
      $(`#spec-node-${nId}`).addClass('spec-node-todo').removeClass('spec-node-duplicate');
    });
  }

  /**
   * Update trackers and spec when descendant is removed.
   *
   * @param {number} nodeId
   */
  #removeNodeFromTreantCallback(nodeId) {
    const classId = this.#nodeIdToClassId[nodeId];
    if (classId in this.#classIdToNodeIds) {
      this.#classIdToNodeIds[classId].delete(nodeId);
      if (this.#classIdToNodeIds[classId].size === 0) {
        delete this.#classIdToNodeIds[classId];
        this.#spec.removeClass(classId);
      }
    }
    delete this.#nodeIdToClassId[nodeId];
  }

  /**
   * Remove the rule who's LHS has given id.
   *
   * @param {number} classId
   */
  #removeRuleFromNode(nodeId) {
    console.log(nodeId);
    const classId = this.#nodeIdToClassId[nodeId];
    const children = this.#nodeChildren(nodeId);

    // Update complete-spec tracker
    this.#unverifiedLeaves.add(classId);

    // Update colors of nodes
    this.#cleanColorClasses(classId);

    // Update spec object
    this.#spec.removeRule(classId);

    // Move the parts that can be moved
    this.#moveNodesThatCanBeMoved(nodeId, children);

    // Delete every desentant of nodeId
    this.#treant.removeAllDescendantOf(nodeId, (nId) => {
      this.#removeNodeFromTreantCallback(nId);
    });
  }

  /**
   * Extract the appropriate information from node's id when viewing.
   *
   * @param {number} nodeId
   * @returns {{html: string, tiling: Tiling, rule: RuleWithoutTilings}}
   */
  #getNodeMeta(nodeId) {
    const classId = this.#nodeIdToClassId[nodeId];
    const node = this.#treant.getNode(nodeId);
    const tiling = this.#spec.getClassById(classId);
    const rule = this.#spec.getRuleByLHS(classId);
    return { html: node.nodeInnerHTML, tiling, rule };
  }

  /**
   * Called on click for class nodes.
   *
   * @param {number} nodeId
   */
  #viewNodeEventHandler(nodeId) {
    const { html, tiling, rule } = this.#getNodeMeta(nodeId);
    viewClassNode(tiling, this.#appState, html, rule, this.#errorDisplay, (newRule) => {
      this.#extendNode(nodeId, newRule);
    });
  }

  /**
   * Set click event for a new tiling node.
   *
   * @param {number} nodeId
   */
  #setClickEventForNode(nodeId) {
    $(`#spec-node-${nodeId}`).on('click', () => {
      this.#viewNodeEventHandler(nodeId);
    });
  }

  /**
   * Extend node with given id with given rule.
   *
   * @param {number} nodeId
   * @param {RuleResponse} ruleResponse
   */
  #extendNode(nodeId, ruleResponse) {
    this.#addRule(nodeId, new Rule(ruleResponse));
  }

  /**
   * Get node id of children (not the rule but classes).
   *
   * @param {number} nodeId
   * @returns {number[]} node ids of children
   */
  #nodeChildren(nodeId) {
    const node = this.#treant.getNode(nodeId);
    if (node.children.length === 0) return [];
    return this.#treant.getNode(node.children[0]).children;
  }

  /**
   * Check if adding the rule creates a tautology.
   *
   * @param {number} nodeId
   * @param {Rule} rule
   * @param {number} classId
   * @returns {boolean} true iff tautology
   */
  #tauology(nodeId, rule, classId) {
    if (rule.children.length === 1 && this.#spec.tautologyCheck(classId, rule.children[0].key)) {
      this.#errorDisplay.alert('Rule creates a tautology!');
      $(`#spec-node-${nodeId}`).trigger('click');
      return true;
    }
    return false;
  }

  /**
   * Remove `toto` additional class from any duplicates and
   * set the `duplicate` additional class for all but `nodeId`.
   *
   * @param {number} classId
   * @param {number} nodeId
   */
  #updateDuplicates(classId, nodeId) {
    const nodeParents = this.#classIdToNodeIds[classId];
    nodeParents.forEach((parentId) => {
      $(`#spec-node-${parentId}`).removeClass('spec-node-todo');
      if (parentId !== nodeId) {
        $(`#spec-node-${parentId}`).addClass('spec-node-duplicate');
      }
    });
  }

  /**
   * Add a rule and update spec.
   *
   * @param {number} nodeId
   * @param {Rule} rule
   */
  #addRule(nodeId, rule) {
    // Get class id
    const classId = this.#nodeIdToClassId[nodeId];

    // Check if tautology
    if (this.#tauology(nodeId, rule, classId)) return;

    // Add rule to spec
    const newClasses = this.#spec.addRule(classId, rule);
    const children = this.#spec.getChildren(classId);

    // Not unverified any more
    this.#unverifiedLeaves.delete(this.#spec.getClassById(classId).key);

    // Update colors of duplicates
    this.#updateDuplicates(classId, nodeId);

    // Add rule node
    const parent = this.#addRuleNode(nodeId, classId, rule);

    // Add child nodes
    this.#addChildNodes(children, newClasses, parent);

    // Check if spec
    if (this.hasSpecification()) this.#errorDisplay.alert('Specification!', true);
  }

  /**
   * Treant data for rule.
   *
   * @param {Rule} rule
   * @returns {TreantNodeData} data
   */
  #ruleNodeData(rule) {
    const key = this.#treant.getNextKey();
    return SpecTree.#treantRuleNodeData(rule.op, key);
  }

  /**
   * Add rule to treant.
   *
   * @param {number} nodeId
   * @param {Rule} rule
   * @returns {{parentNodeId: number, newNode: any}}
   */
  #addRuleToTreant(nodeId, rule) {
    const parentNode = this.#treant.getNode(nodeId);
    const ruleData = this.#ruleNodeData(rule);
    const ruleNode = this.#treant.add(parentNode, ruleData);
    return { parentNodeId: parentNode.id, newNode: ruleNode };
  }

  /**
   * Callback for click on rule.
   *
   * @param {JQuery.ClickEvent} evt
   * @param {number} parentNodeId
   */
  #ruleOnClickhandler(evt, parentNodeId) {
    const parentOfRule = this.#nodeIdToClassId[SpecTree.#nodeIdFromEvent(evt)];
    const modalRule = this.#spec.getRuleByLHS(parentOfRule);
    const modal = SpecTree.#createRuleModal(modalRule);
    $('#rem-rule').on('click', () => {
      this.#removeRuleFromNode(parentNodeId);
      modal.hide();
    });
  }

  /**
   * Clear previous and set event listener for click on rule.
   *
   * @param {number} id
   * @param {number} parentNodeId
   */
  #setRuleOnClickListener(id, parentNodeId) {
    $(`#spec-node-${id}`)
      .off('click')
      .on('click', (evt) => {
        this.#ruleOnClickhandler(evt, parentNodeId);
      });
  }

  /**
   * Add a treant node for the rule.
   *
   * @param {number} nodeId
   * @param {number} classId
   * @param {Rule} rule
   * @returns {any} the treant node of rule
   */
  #addRuleNode(nodeId, classId, rule) {
    const { parentNodeId, newNode } = this.#addRuleToTreant(nodeId, rule);
    this.#nodeIdToClassId[newNode.id] = classId;
    this.#setRuleOnClickListener(newNode.id, parentNodeId);
    return newNode;
  }

  /**
   * Check if new class is a duplicate and update unverified accordingly.
   *
   * @param {boolean[]} newClasses
   * @param {number} idx
   * @param {number} childId
   * @param {TilingInterface} childTiling
   * @returns {boolean} true iff duplicate.
   */
  #isDuplicate(newClasses, idx, childId, childTiling) {
    const dup = !newClasses[idx] && this.#spec.hasChildren(childId);
    if (!dup && !childTiling.isVerified()) this.#unverifiedLeaves.add(childTiling.key);
    return dup;
  }

  /**
   * Update trackers of classes and nodes.
   *
   * @param {number} nodeId
   * @param {number} classId
   */
  #updateNodeAndClassTrackers(nodeId, classId) {
    this.#nodeIdToClassId[nodeId] = classId;
    if (!(classId in this.#classIdToNodeIds)) this.#classIdToNodeIds[classId] = new Set();
    this.#classIdToNodeIds[classId].add(nodeId);
  }

  /**
   * Extract next child data.
   *
   * @param {number} childId
   * @param {number} idx
   * @param {boolean[]} newClasses
   * @returns {{newNodeId: number, nodeData: TreantNodeData}} next child
   */
  #nextChild(childId, idx, newClasses) {
    const newNodeId = this.#treant.getNextKey();
    const childTiling = this.#spec.getClassById(childId);
    const dup = this.#isDuplicate(newClasses, idx, childId, childTiling);
    const nodeData = SpecTree.#treantClassNodeData(childTiling, childId, newNodeId, dup);
    return { newNodeId, nodeData };
  }

  /**
   * Draw children when adding rule.
   *
   * @param {number[]} children
   * @param {boolean[]} newClasses
   * @param {any} parent # TreantNode
   */
  #addChildNodes(children, newClasses, parent) {
    children.forEach((childId, idx) => {
      const { newNodeId, nodeData } = this.#nextChild(childId, idx, newClasses);
      this.#treant.add(parent, nodeData);
      this.#updateNodeAndClassTrackers(newNodeId, childId);
      this.#setClickEventForNode(newNodeId);
    });
  }

  // #endregion
}

export default SpecTree;
