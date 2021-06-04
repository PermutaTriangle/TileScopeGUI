import $ from 'jquery';

import './styles/spec_tree.scss';
import Tiling from '../combinatorics/tiling';
import Specification from '../combinatorics/specification';
import Treant from '../treant/treant';
import { randomRule } from '../consumers/service';
import statusCode from '../consumers/status_codes';
import Rule from '../combinatorics/rule';
import Modal from './modal';

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
  static nodeHtml(tiling, label, nodeId) {
    const verifiedClass = tiling.verified ? ' spec-node-verified' : '';
    return `<div id="spec-node-${nodeId}" class="spec-node-container${verifiedClass}">
      <div class="spec-node-label">${label}</div>
      <div class="spec-node">
        <div class="spec-node-inner-content">
          ${tiling.asciiHTML()}
        </div>
      </div>
    </div>`;
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

  constructor(parentSelector, initialTilingResponse) {
    parentSelector.append(SpecTree.getHTML());
    const root = new Tiling(initialTilingResponse);
    this.spec = new Specification(root);
    this.treant = new Treant(SpecTree.initConfig(this.spec.root));
    this.nodeToClass = [0];
    this.classToNodes = [[0]];

    $('#spec-node-0').on('click', () => {
      const classId = this.nodeToClass[0];
      const nodeHTML = this.treant.tree.nodeDB.get(classId).nodeInnerHTML;
      const tiling = this.spec.getClassById(classId);
      const modal = new Modal(tiling, nodeHTML, false);
    });
  }

  /**
   * Extend node with given id.
   */
  async extendNode(id) {
    const classId = this.nodeToClass[id];
    if (this.spec.hasChildren(classId)) {
      console.log('Already expanded (todo: handle in ui)');
      return;
    }
    const tiling = this.spec.getClassById(classId);
    if (tiling.verified) {
      console.log('Already verified (todo: handle in ui)');
      return;
    }
    const res = await randomRule(tiling.tilingJson);
    if (res.status !== statusCode.OK) {
      console.log('NOT OK ERROR: TODO handle');
    } else {
      this.addRule(id, new Rule(res.data));
    }
  }

  addRule(id, rule) {
    const newClasses = this.spec.addRule(id, rule);
    const children = this.spec.rules[id];
    const nodeParents = this.classToNodes[id];

    const newNodes = [];
    nodeParents.forEach((parentId) => {
      const parent = this.treant.tree.nodeDB.get(parentId);
      children.forEach((childId) => {
        const nodeId = this.treant.tree.nodeDB.db.length;
        this.treant.add(parent, {
          innerHTML: SpecTree.nodeHtml(this.spec.getClassById(childId), nodeId, childId),
          collapsable: false,
          collapsed: false,
        });
        newNodes.push(nodeId);
        this.nodeToClass.push(childId);
        while (this.classToNodes.length <= childId) this.classToNodes.push([]);
        this.classToNodes[childId].push(nodeId);
      });
    });

    newNodes.forEach((nId) => {
      $(`#spec-node-${nId}`).on('click', () => {
        this.extendNode(nId);
      });
    });
  }

  remove(removeDiv = true) {
    this.treant.destroy();
    if (removeDiv) $(`#${SpecTree.divId}`).remove();
  }

  reset() {
    if (this) console.log('reset todo...');
  }
}

export default SpecTree;
