import Tree from './treant_tree';
import './treant.scss';

/**
 * TreeStore is used for holding initialized Tree objects its purpose is to
 * avoid global variables and enable multiple Trees on the page.
 */
const TreeStore = {
  store: [],

  createTree: (jsonConfig) => {
    let newTreeId = TreeStore.store.findIndex((e) => e === null);
    if (newTreeId === -1) {
      newTreeId = TreeStore.store.length;
      TreeStore.store.push(new Tree(jsonConfig, newTreeId));
    } else {
      TreeStore.store[newTreeId] = new Tree(jsonConfig, newTreeId);
    }
    return TreeStore.get(newTreeId);
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

export default TreeStore;
