/**
 * This is a modified version of https://github.com/fperucic/treant-js.
 */

import Tree from './treant_tree';
import './treant.scss';

/**
 * TreeStore is used for holding initialized Tree objects its purpose is to
 * avoid global variables and enable multiple Trees on the page.
 */
const TreeStore = {
  store: [],

  createTree: (jsonConfig) => {
    const nNewTreeId = TreeStore.store.length;
    TreeStore.store.push(new Tree(jsonConfig, nNewTreeId));
    return TreeStore.get(nNewTreeId);
  },

  get: (treeId) => TreeStore.store[treeId],

  destroy: (treeId) => {
    const tree = TreeStore.get(treeId);
    if (tree) {
      tree.raphael.remove();
      const { drawArea } = tree;

      while (drawArea.firstChild) {
        drawArea.removeChild(drawArea.firstChild);
      }

      drawArea.style.overflowY = '';
      drawArea.style.overflowX = '';
      drawArea.className = drawArea.className
        .split(' ')
        .filter((cls) => cls !== 'Treant' && cls !== 'Treant-loaded')
        .join(' ');

      TreeStore.store[treeId] = null;
    }
  },
};

/**
 * Chart constructor.
 */
class Treant {
  constructor(cfg, callback = null) {
    this.tree = TreeStore.createTree(cfg);
    this.tree.positionTree(callback);
  }

  destroy() {
    TreeStore.destroy(this.tree.id);
  }
}

export default Treant;
