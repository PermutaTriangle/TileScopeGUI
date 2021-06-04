/**
 * This is a modified version of https://github.com/fperucic/treant-js.
 */

import './treant.scss';
import TreeStore from './tree_store';

/**
 * Chart constructor.
 */
class Treant {
  constructor(cfg, callback = null) {
    this.tree = TreeStore.createTree(cfg);
    this.tree.positionTree(callback);
  }

  add(parentTreeNode, nodeDefinition) {
    const nNode = this.tree.addNode(parentTreeNode, nodeDefinition);
    this.tree.positionTree();
    return nNode;
  }

  destroy() {
    TreeStore.destroy(this.tree.id);
  }
}

export default Treant;
