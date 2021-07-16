import TreantUtils from './treant_utils';
import TreeNode from './tree_node';

class NodeDB {
  /**
   * NodeDB is used for storing the nodes. Each tree has its own NodeDB.
   * @param {object} nodeStructure
   * @param {Tree} tree
   * @constructor
   */
  constructor(nodeStructure, tree) {
    this.db = {};

    const self = this;

    /**
     * @param {object} node
     * @param {number} parentId
     */
    const iterateChildren = (node, parentId) => {
      let newNode = self.createNode(node, parentId, tree, null);

      if (node.children) {
        // pseudo node is used for descending children to the next level
        if (node.childrenDropLevel && node.childrenDropLevel > 0) {
          while (node.childrenDropLevel) {
            // eslint-disable-next-line no-param-reassign
            node.childrenDropLevel -= 1;
            // pseudo node needs to inherit the connection style from its parent for continuous connectors
            const connStyle = TreantUtils.cloneObj(newNode.connStyle);
            newNode = self.createNode('pseudo', newNode.id, tree, null);
            newNode.connStyle = connStyle;
            newNode.children = [];
          }
        }

        const stack = node.stackChildren && !self.hasGrandChildren(node) ? newNode.id : null;

        // children are positioned on separate levels, one beneath the other
        if (stack !== null) {
          newNode.stackChildren = [];
        }

        for (let i = 0, len = node.children.length; i < len; i += 1) {
          if (stack !== null) {
            newNode = self.createNode(node.children[i], newNode.id, tree, stack);
            if (i + 1 < len) {
              // last node cant have children
              newNode.children = [];
            }
          } else {
            iterateChildren(node.children[i], newNode.id);
          }
        }
      }
    };

    if (tree.cfg.animateOnInit) {
      // eslint-disable-next-line no-param-reassign
      nodeStructure.collapsed = true;
    }

    iterateChildren(nodeStructure, -1); // root node

    this.createGeometries(tree);
  }

  /**
   * Remove node from db by id.
   *
   * @param {number} id
   */
  deleteNode(id) {
    delete this.db[id];
  }

  /**
   * Number of nodes in the db.
   *
   * @returns {int} node count
   */
  numberOfNodes() {
    return Object.keys(this.db).length;
  }

  /**
   * Create an integer key.
   *
   * @returns {number} next key to use.
   */
  getNextKey() {
    let nxt = this.numberOfNodes();
    while (nxt in this.db) nxt -= 1;
    return nxt;
  }

  /**
   * @param {Tree} tree
   * @returns {NodeDB}
   */
  createGeometries(tree) {
    Object.entries(this.db).forEach(([, node]) => {
      node.createGeometry(tree);
    });
  }

  /**
   * @param {number} nodeId
   * @returns {TreeNode}
   */
  get(nodeId) {
    return this.db[nodeId]; // get TreeNode by ID
  }

  /**
   * @param {function} callback
   * @returns {NodeDB}
   */
  walk(callback) {
    Object.entries(this.db).forEach(([, node]) => {
      callback.apply(this, [node]);
    });
  }

  /**
   *
   * @param {object} nodeStructure
   * @param {number} parentId
   * @param {Tree} tree
   * @param {number} stackParentId
   * @returns {TreeNode}
   */
  createNode(nodeStructure, parentId, tree, stackParentId) {
    const nextId = this.getNextKey();
    const node = new TreeNode(nodeStructure, nextId, parentId, tree, stackParentId);

    this.db[nextId] = node;

    // skip root node (0)
    if (parentId >= 0) {
      const parent = this.get(parentId);

      // todo: refactor into separate private method
      if (nodeStructure.position) {
        if (nodeStructure.position === 'left') {
          parent.children.push(node.id);
        } else if (nodeStructure.position === 'right') {
          parent.children.splice(0, 0, node.id);
        } else if (nodeStructure.position === 'center') {
          parent.children.splice(Math.floor(parent.children.length / 2), 0, node.id);
        } else {
          // edge case when there's only 1 child
          const position = parseInt(nodeStructure.position, 10);
          if (parent.children.length === 1 && position > 0) {
            parent.children.splice(0, 0, node.id);
          } else {
            parent.children.splice(Math.max(position, parent.children.length - 1), 0, node.id);
          }
        }
      } else {
        parent.children.push(node.id);
      }
    }

    if (stackParentId) {
      this.get(stackParentId).stackParent = true;
      this.get(stackParentId).stackChildren.push(node.id);
    }

    return node;
  }

  getMinMaxCoord(dim, parent, minMax) {
    // used for getting the dimensions of the tree, dim = 'X' || 'Y'
    // looks for min and max (X and Y) within the set of nodes
    const par = parent || this.get(0);
    const mm = minMax || {
      // start with root node dimensions
      min: par[dim],
      max: par[dim] + (dim === 'X' ? par.width : par.height),
    };

    let i = par.childrenCount();

    while (i) {
      i -= 1;
      const node = par.childAt(i);
      const maxTest = node[dim] + (dim === 'X' ? node.width : node.height);
      const minTest = node[dim];

      if (maxTest > mm.max) {
        mm.max = maxTest;
      }
      if (minTest < mm.min) {
        mm.min = minTest;
      }

      this.getMinMaxCoord(dim, node, mm);
    }
    return mm;
  }

  /**
   * @param {object} nodeStructure
   * @returns {boolean}
   */
  static hasGrandChildren(nodeStructure) {
    let i = nodeStructure.children.length;
    while (i) {
      i -= 1;
      if (nodeStructure.children[i].children) {
        return true;
      }
    }
    return false;
  }
}

export default NodeDB;
