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

  getNode(id) {
    return this.tree.nodeDB.get(id);
  }

  destroy() {
    TreeStore.destroy(this.tree.id);
  }

  getNodeCount() {
    return this.tree.nodeDB.numberOfNodes();
  }

  getNextKey() {
    return this.tree.nodeDB.getNextKey();
  }

  removeAllDescendantOf(id, callback, redraw = true) {
    const node = this.getNode(id);
    const stack = [...node.children];
    node.children = [];

    while (stack.length > 0) {
      const currNode = this.getNode(stack.pop());
      currNode.nodeDOM.remove();
      currNode.children.forEach((c) => {
        stack.push(c);
      });
      this.tree.connectionStore[currNode.id].remove();
      delete this.tree.connectionStore[currNode.id];
      this.tree.nodeDB.deleteNode(currNode.id);
      callback(currNode.id);
    }

    if (redraw) this.tree.positionTree();
  }

  removeNode(id, filterChildren = true) {
    const node = this.getNode(id);
    node.nodeDOM.remove();
    const parent = this.getNode(node.parentId);
    const connLine = this.tree.connectionStore[id];
    connLine.remove();
    delete this.tree.connectionStore[id];
    if (filterChildren) parent.children = parent.children.filter((z) => z !== id);
    this.tree.nodeDB.deleteNode(id);
  }

  /**
   * @param {number[]} ids
   */
  removeSiblings(ids, redraw = true) {
    this.getNode(this.getNode(ids[0]).parentId).children = [];
    ids.forEach((id) => {
      this.removeNode(id, false);
    });
    if (redraw) this.tree.positionTree();
  }

  moveChildren(oldParentId, newParentId, redraw = true) {
    const newParent = this.getNode(newParentId);
    const oldParent = this.getNode(oldParentId);

    if (newParent.children.length !== 0) return false;

    newParent.children = oldParent.children;
    oldParent.children = [];

    newParent.children.forEach((child) => {
      this.getNode(child).parentId = newParentId;
    });

    if (redraw) this.tree.positionTree();

    return true;
  }

  numberOfNodes() {
    return this.tree.nodeDB.numberOfNodes;
  }
}

export default Treant;
