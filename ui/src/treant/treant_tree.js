import $ from 'jquery';
import Raphael from 'raphael';
import TreantUtils from './treant_utils';
import NodeDB from './node_db';

class Tree {
  static doNothing() {}

  constructor(jsonConfig, treeId) {
    this.initJsonConfig = jsonConfig;
    this.initTreeId = treeId;

    this.id = treeId;

    this.cfg = TreantUtils.createMerge(Tree.CONFIG, jsonConfig.chart);
    this.drawArea = TreantUtils.findEl(this.cfg.container, true);
    if (!this.drawArea) {
      throw new Error(`Failed to find element by selector "${this.cfg.container}"`);
    }

    TreantUtils.addClass(this.drawArea, 'Treant');

    // kill of any child elements that may be there
    this.drawArea.innerHTML = '';

    this.nodeDB = new NodeDB(jsonConfig.nodeStructure, this);

    // key store for storing reference to node connectors,
    // key = nodeId where the connector ends
    this.connectionStore = {};

    this.loaded = false;

    this.raphael = new Raphael(this.drawArea, 100, 100);
  }

  reload() {
    this.reset(this.initJsonConfig, this.initTreeId).redraw();
  }

  /**
   * @returns {NodeDB}
   */
  getNodeDb() {
    return this.nodeDB;
  }

  /**
   * @param {TreeNode} parentTreeNode
   * @param {object} nodeDefinition
   * @returns {TreeNode}
   */
  addNode(parentTreeNode, nodeDefinition) {
    this.cfg.callback.onBeforeAddNode.apply(this, [parentTreeNode, nodeDefinition]);
    const pId = parentTreeNode === null ? -1 : parentTreeNode.id;
    const oNewNode = this.nodeDB.createNode(nodeDefinition, pId, this);
    oNewNode.createGeometry(this);
    // oNewNode.parent().createSwitchGeometry(this);
    this.positionTree();
    this.cfg.callback.onAfterAddNode.apply(this, [oNewNode, parentTreeNode, nodeDefinition]);
    return oNewNode;
  }

  /**
   * @returns {Tree}
   */
  redraw() {
    this.positionTree();
  }

  /**
   * @param {function} callback
   * @returns {Tree}
   */
  positionTree(callback) {
    const self = this;
    const root = this.root();

    this.resetLevelData();
    this.firstWalk(root, 0);
    this.secondWalk(root, 0, 0, 0);
    this.positionNodes();

    if (this.cfg.animateOnInit) {
      setTimeout(() => {
        root.toggleCollapse();
      }, this.cfg.animateOnInitDelay);
    }

    if (!this.loaded) {
      TreantUtils.addClass(this.drawArea, 'Treant-loaded'); // nodes are hidden until .loaded class is added
      if (Object.prototype.toString.call(callback) === '[object Function]') {
        callback(self);
      }
      self.cfg.callback.onTreeLoaded.apply(self, [root]);
      this.loaded = true;
    }
  }

  /**
   * In a first post-order walk, every node of the tree is assigned a preliminary
   * x-coordinate (held in field node->prelim).
   * In addition, internal nodes are given modifiers, which will be used to move their
   * children to the right (held in field node->modifier).
   * @param {TreeNode} node
   * @param {number} level
   * @returns {Tree}
   */
  firstWalk(node, level) {
    // eslint-disable-next-line no-param-reassign
    node.prelim = null;
    // eslint-disable-next-line no-param-reassign
    node.modifier = null;

    this.setNeighbors(node, level);
    this.calcLevelDim(node, level);

    const leftSibling = node.leftSibling();

    if (node.childrenCount() === 0 || level === this.cfg.maxDepth) {
      // set preliminary x-coordinate
      if (leftSibling) {
        // eslint-disable-next-line no-param-reassign
        node.prelim = leftSibling.prelim + leftSibling.size() + this.cfg.siblingSeparation;
      } else {
        // eslint-disable-next-line no-param-reassign
        node.prelim = 0;
      }
    } else {
      // node is not a leaf,  firstWalk for each child
      for (let i = 0, n = node.childrenCount(); i < n; i += 1) {
        this.firstWalk(node.childAt(i), level + 1);
      }

      const midPoint = node.childrenCenter() - node.size() / 2;

      if (leftSibling) {
        // eslint-disable-next-line no-param-reassign
        node.prelim = leftSibling.prelim + leftSibling.size() + this.cfg.siblingSeparation;
        // eslint-disable-next-line no-param-reassign
        node.modifier = node.prelim - midPoint;
        this.apportion(node, level);
      } else {
        // eslint-disable-next-line no-param-reassign
        node.prelim = midPoint;
      }

      // handle stacked children positioning
      if (node.stackParent) {
        // handle the parent of stacked children
        // eslint-disable-next-line no-param-reassign
        node.modifier +=
          this.nodeDB.get(node.stackChildren[0]).size() / 2 + node.connStyle.stackIndent;
      } else if (node.stackParentId) {
        // handle stacked children
        // eslint-disable-next-line no-param-reassign
        node.prelim = 0;
      }
    }
  }

  /*
   * Clean up the positioning of small sibling subtrees.
   * Subtrees of a node are formed independently and
   * placed as close together as possible. By requiring
   * that the subtrees be rigid at the time they are put
   * together, we avoid the undesirable effects that can
   * accrue from positioning nodes rather than subtrees.
   */
  apportion(node, level) {
    let firstChild = node.firstChild();
    let firstChildLeftNeighbor = firstChild.leftNeighbor();
    let compareDepth = 1;
    const depthToStop = this.cfg.maxDepth - level;

    while (firstChild && firstChildLeftNeighbor && compareDepth <= depthToStop) {
      // calculate the position of the firstChild, according to the position of firstChildLeftNeighbor

      let modifierSumRight = 0;
      let modifierSumLeft = 0;
      let leftAncestor = firstChildLeftNeighbor;
      let rightAncestor = firstChild;

      for (let i = 0; i < compareDepth; i += 1) {
        leftAncestor = leftAncestor.parent();
        rightAncestor = rightAncestor.parent();
        modifierSumLeft += leftAncestor.modifier;
        modifierSumRight += rightAncestor.modifier;

        // all the stacked children are oriented towards right so use right variables
        if (rightAncestor.stackParent !== undefined) {
          modifierSumRight += rightAncestor.size() / 2;
        }
      }

      // find the gap between two trees and apply it to subTrees
      // and matching smaller gaps to smaller subtrees

      let totalGap =
        firstChildLeftNeighbor.prelim +
        modifierSumLeft +
        firstChildLeftNeighbor.size() +
        this.cfg.subTeeSeparation -
        (firstChild.prelim + modifierSumRight);

      if (totalGap > 0) {
        let subtreeAux = node;
        let numSubtrees = 0;

        // count all the subtrees in the LeftSibling
        while (subtreeAux && subtreeAux.id !== leftAncestor.id) {
          subtreeAux = subtreeAux.leftSibling();
          numSubtrees += 1;
        }

        if (subtreeAux) {
          let subtreeMoveAux = node;
          const singleGap = totalGap / numSubtrees;

          while (subtreeMoveAux.id !== leftAncestor.id) {
            subtreeMoveAux.prelim += totalGap;
            subtreeMoveAux.modifier += totalGap;

            totalGap -= singleGap;
            subtreeMoveAux = subtreeMoveAux.leftSibling();
          }
        }
      }

      compareDepth += 1;

      firstChild =
        firstChild.childrenCount() === 0
          ? node.leftMost(0, compareDepth)
          : (firstChild = firstChild.firstChild());

      if (firstChild) {
        firstChildLeftNeighbor = firstChild.leftNeighbor();
      }
    }
  }

  /*
   * During a second pre-order walk, each node is given a
   * final x-coordinate by summing its preliminary
   * x-coordinate and the modifiers of all the node's
   * ancestors.  The y-coordinate depends on the height of
   * the tree.  (The roles of x and y are reversed for
   * RootOrientations of EAST or WEST.)
   */
  secondWalk(node, level, X, Y) {
    if (level > this.cfg.maxDepth) {
      return;
    }

    const xTmp = node.prelim + X;
    const yTmp = Y;
    const align = this.cfg.nodeAlign;
    const orient = this.cfg.rootOrientation;
    let levelHeight;
    let nodesizeTmp;

    if (orient === 'NORTH' || orient === 'SOUTH') {
      levelHeight = this.levelMaxDim[level].height;
      nodesizeTmp = node.height;
      if (node.pseudo) {
        // eslint-disable-next-line no-param-reassign
        node.height = levelHeight;
      } // assign a new size to pseudo nodes
    } else if (orient === 'WEST' || orient === 'EAST') {
      levelHeight = this.levelMaxDim[level].width;
      nodesizeTmp = node.width;
      if (node.pseudo) {
        // eslint-disable-next-line no-param-reassign
        node.width = levelHeight;
      } // assign a new size to pseudo nodes
    }

    // eslint-disable-next-line no-param-reassign
    node.X = xTmp;

    if (node.pseudo) {
      // pseudo nodes need to be properly aligned, otherwise position is not correct in some examples
      if (orient === 'NORTH' || orient === 'WEST') {
        // eslint-disable-next-line no-param-reassign
        node.Y = yTmp; // align "BOTTOM"
      } else if (orient === 'SOUTH' || orient === 'EAST') {
        // eslint-disable-next-line no-param-reassign
        node.Y = yTmp + (levelHeight - nodesizeTmp); // align "TOP"
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      node.Y =
        // eslint-disable-next-line no-nested-ternary
        align === 'CENTER'
          ? yTmp + (levelHeight - nodesizeTmp) / 2
          : align === 'TOP'
          ? yTmp + (levelHeight - nodesizeTmp)
          : yTmp;
    }

    if (orient === 'WEST' || orient === 'EAST') {
      const swapTmp = node.X;
      // eslint-disable-next-line no-param-reassign
      node.X = node.Y;
      // eslint-disable-next-line no-param-reassign
      node.Y = swapTmp;
    }

    if (orient === 'SOUTH') {
      // eslint-disable-next-line no-param-reassign
      node.Y = -node.Y - nodesizeTmp;
    } else if (orient === 'EAST') {
      // eslint-disable-next-line no-param-reassign
      node.X = -node.X - nodesizeTmp;
    }

    if (node.childrenCount() !== 0) {
      if (node.id === 0 && this.cfg.hideRootNode) {
        // ako je root node Hiden onda nemoj njegovu dijecu pomaknut po Y osi za Level separation, neka ona budu na vrhu
        this.secondWalk(node.firstChild(), level + 1, X + node.modifier, Y);
      } else {
        this.secondWalk(
          node.firstChild(),
          level + 1,
          X + node.modifier,
          Y + levelHeight + this.cfg.levelSeparation,
        );
      }
    }

    if (node.rightSibling()) {
      this.secondWalk(node.rightSibling(), level, X, Y);
    }
  }

  /**
   * position all the nodes, center the tree in center of its container
   * 0,0 coordinate is in the upper left corner
   * @returns {Tree}
   */
  positionNodes() {
    const self = this;
    const treeSize = {
      x: self.nodeDB.getMinMaxCoord('X', null, null),
      y: self.nodeDB.getMinMaxCoord('Y', null, null),
    };
    const treeWidth = treeSize.x.max - treeSize.x.min;
    const treeHeight = treeSize.y.max - treeSize.y.min;
    const treeCenter = {
      x: treeSize.x.max - treeWidth / 2,
      y: treeSize.y.max - treeHeight / 2,
    };
    this.handleOverflow(treeWidth, treeHeight);

    const containerCenter = {
      x: self.drawArea.clientWidth / 2,
      y: self.drawArea.clientHeight / 2,
    };
    const deltaX = containerCenter.x - treeCenter.x;
    const deltaY = containerCenter.y - treeCenter.y;
    // all nodes must have positive X or Y coordinates, handle this with offsets
    const negOffsetX = treeSize.x.min + deltaX <= 0 ? Math.abs(treeSize.x.min) : 0;
    const negOffsetY = treeSize.y.min + deltaY <= 0 ? Math.abs(treeSize.y.min) : 0;

    // position all the nodes
    Object.entries(this.nodeDB.db).forEach(([i, node]) => {
      self.cfg.callback.onBeforePositionNode.apply(self, [node, i, containerCenter, treeCenter]);

      if (node.id === 0 && this.cfg.hideRootNode) {
        self.cfg.callback.onAfterPositionNode.apply(self, [node, i, containerCenter, treeCenter]);
      } else {
        // if the tree is smaller than the draw area, then center the tree within drawing area
        // eslint-disable-next-line no-param-reassign
        node.X += negOffsetX + (treeWidth < this.drawArea.clientWidth ? deltaX : this.cfg.padding);
        // eslint-disable-next-line no-param-reassign
        node.Y +=
          negOffsetY + (treeHeight < this.drawArea.clientHeight ? deltaY : this.cfg.padding);

        const collapsedParent = node.collapsedParent();
        let hidePoint = null;

        if (collapsedParent) {
          // position the node behind the connector point of the parent, so future animations can be visible
          hidePoint = collapsedParent.connectorPoint(true);
          node.hide(hidePoint);
        } else if (node.positioned) {
          // node is already positioned,
          node.show();
        } else {
          // inicijalno stvaranje nodeova, postavi lokaciju
          // eslint-disable-next-line no-param-reassign
          node.nodeDOM.style.left = `${node.X}px`;
          // eslint-disable-next-line no-param-reassign
          node.nodeDOM.style.top = `${node.Y}px`;
          // eslint-disable-next-line no-param-reassign
          node.positioned = true;
        }

        if (node.id !== 0 && !(node.parent().id === 0 && this.cfg.hideRootNode)) {
          this.setConnectionToParent(node, hidePoint); // skip the root node
        } else if (!this.cfg.hideRootNode && node.drawLineThrough) {
          // drawlinethrough is performed for for the root node also
          node.drawLineThroughMe();
        }

        self.cfg.callback.onAfterPositionNode.apply(self, [node, i, containerCenter, treeCenter]);
      }
    });
  }

  /**
   * Create Raphael instance, (optionally set scroll bars if necessary)
   * @param {number} treeWidth
   * @param {number} treeHeight
   * @returns {Tree}
   */
  handleOverflow(treeWidth, treeHeight) {
    const viewWidth =
      treeWidth < this.drawArea.clientWidth
        ? this.drawArea.clientWidth
        : treeWidth + this.cfg.padding * 2;
    const viewHeight =
      treeHeight < this.drawArea.clientHeight
        ? this.drawArea.clientHeight
        : treeHeight + this.cfg.padding * 2;

    this.raphael.setSize(viewWidth, viewHeight);

    if (this.cfg.scrollbar === 'resize') {
      TreantUtils.setDimensions(this.drawArea, viewWidth, viewHeight);
    } else if (this.cfg.scrollbar === 'native') {
      if (this.drawArea.clientWidth < treeWidth) {
        // is overflow-x necessary
        this.drawArea.style.overflowX = 'auto';
      }

      if (this.drawArea.clientHeight < treeHeight) {
        // is overflow-y necessary
        this.drawArea.style.overflowY = 'auto';
      }
    }
    // Fancy scrollbar relies heavily on jQuery, so guarding with if ( $ )
    else if (this.cfg.scrollbar === 'fancy') {
      const jqDrawArea = $(this.drawArea);
      if (jqDrawArea.hasClass('ps-container')) {
        // znaci da je 'fancy' vec inicijaliziran, treba updateat
        jqDrawArea.find('.Treant').css({
          width: viewWidth,
          height: viewHeight,
        });

        jqDrawArea.perfectScrollbar('update');
      } else {
        const mainContainer = jqDrawArea.wrapInner('<div class="Treant"/>');
        const child = mainContainer.find('.Treant');

        child.css({
          width: viewWidth,
          height: viewHeight,
        });

        mainContainer.perfectScrollbar();
      }
    }
  }

  /**
   * @param {TreeNode} treeNode
   * @param {boolean} hidePoint
   * @returns {Tree}
   */
  setConnectionToParent(treeNode, hidePoint) {
    const stacked = treeNode.stackParentId;
    let connLine;
    const parent = stacked ? this.nodeDB.get(stacked) : treeNode.parent();
    const pathString = hidePoint
      ? Tree.getPointPathString(hidePoint)
      : this.getPathString(parent, treeNode, stacked);

    if (this.connectionStore[treeNode.id]) {
      // connector already exists, update the connector geometry
      connLine = this.connectionStore[treeNode.id];
      this.animatePath(connLine, pathString);
    } else {
      connLine = this.raphael.path(pathString);
      this.connectionStore[treeNode.id] = connLine;

      // don't show connector arrows por pseudo nodes
      if (treeNode.pseudo) {
        delete parent.connStyle.style['arrow-end'];
      }
      if (parent.pseudo) {
        delete parent.connStyle.style['arrow-start'];
      }

      connLine.attr(parent.connStyle.style);

      if (treeNode.drawLineThrough || treeNode.pseudo) {
        treeNode.drawLineThroughMe(hidePoint);
      }
    }
    // eslint-disable-next-line no-param-reassign
    treeNode.connector = connLine;
  }

  /**
   * Create the path which is represented as a point, used for hiding the connection
   * A path with a leading "_" indicates the path will be hidden
   * See: http://dmitrybaranovskiy.github.io/raphael/reference.html#Paper.path
   * @param {object} hidePoint
   * @returns {string}
   */
  static getPointPathString(hidePoint) {
    return [
      '_M',
      hidePoint.x,
      ',',
      hidePoint.y,
      'L',
      hidePoint.x,
      ',',
      hidePoint.y,
      hidePoint.x,
      ',',
      hidePoint.y,
    ].join(' ');
  }

  /**
   * This method relied on receiving a valid Raphael Paper.path.
   * See: http://dmitrybaranovskiy.github.io/raphael/reference.html#Paper.path
   * A pathString is typically in the format of "M10,20L30,40"
   * @param path
   * @param {string} pathString
   * @returns {Tree}
   */
  animatePath(path, pathString) {
    if (path.hidden && pathString.charAt(0) !== '_') {
      // path will be shown, so show it
      path.show();
      // eslint-disable-next-line no-param-reassign
      path.hidden = false;
    }

    // See: http://dmitrybaranovskiy.github.io/raphael/reference.html#Element.animate
    path.animate(
      {
        path: pathString.charAt(0) === '_' ? pathString.substring(1) : pathString, // remove the "_" prefix if it exists
      },
      this.cfg.animation.connectorsSpeed,
      this.cfg.animation.connectorsAnimation,
      () => {
        if (pathString.charAt(0) === '_') {
          // animation is hiding the path, hide it at the and of animation
          path.hide();
          // eslint-disable-next-line no-param-reassign
          path.hidden = true;
        }
      },
    );
  }

  /**
   *
   * @param {TreeNode} fromNode
   * @param {TreeNode} toNode
   * @param {boolean} stacked
   * @returns {string}
   */
  getPathString(fromNode, toNode, stacked) {
    const startPoint = fromNode.connectorPoint(true);
    const endPoint = toNode.connectorPoint(false);
    const orientation = this.cfg.rootOrientation;
    const connType = fromNode.connStyle.type;
    const P1 = {};
    const P2 = {};

    if (orientation === 'NORTH' || orientation === 'SOUTH') {
      P2.y = (startPoint.y + endPoint.y) / 2;
      P1.y = P2.y;

      P1.x = startPoint.x;
      P2.x = endPoint.x;
    } else if (orientation === 'EAST' || orientation === 'WEST') {
      P2.x = (startPoint.x + endPoint.x) / 2;
      P1.x = P2.x;

      P1.y = startPoint.y;
      P2.y = endPoint.y;
    }

    // sp, p1, pm, p2, ep == "x,y"
    const sp = `${startPoint.x},${startPoint.y}`;
    const p1 = `${P1.x},${P1.y}`;
    const p2 = `${P2.x},${P2.y}`;
    const ep = `${endPoint.x},${endPoint.y}`;
    const pm = `${(P1.x + P2.x) / 2},${(P1.y + P2.y) / 2}`;
    let pathString;
    let stackPoint;

    if (stacked) {
      // STACKED CHILDREN

      stackPoint =
        orientation === 'EAST' || orientation === 'WEST'
          ? `${endPoint.x},${startPoint.y}`
          : `${startPoint.x},${endPoint.y}`;

      if (connType === 'step' || connType === 'straight') {
        pathString = ['M', sp, 'L', stackPoint, 'L', ep];
      } else if (connType === 'curve' || connType === 'bCurve') {
        let helpPoint; // used for nicer curve lines
        const indent = fromNode.connStyle.stackIndent;

        if (orientation === 'NORTH') {
          helpPoint = `${endPoint.x - indent},${endPoint.y - indent}`;
        } else if (orientation === 'SOUTH') {
          helpPoint = `${endPoint.x - indent},${endPoint.y + indent}`;
        } else if (orientation === 'EAST') {
          helpPoint = `${endPoint.x + indent},${startPoint.y}`;
        } else if (orientation === 'WEST') {
          helpPoint = `${endPoint.x - indent},${startPoint.y}`;
        }
        pathString = ['M', sp, 'L', helpPoint, 'S', stackPoint, ep];
      }
    } else if (connType === 'step') {
      pathString = ['M', sp, 'L', p1, 'L', p2, 'L', ep];
    } else if (connType === 'curve') {
      pathString = ['M', sp, 'C', p1, p2, ep];
    } else if (connType === 'bCurve') {
      pathString = ['M', sp, 'Q', p1, pm, 'T', ep];
    } else if (connType === 'straight') {
      pathString = ['M', sp, 'L', sp, ep];
    }

    return pathString.join(' ');
  }

  /**
   * Algorithm works from left to right, so previous processed node will be left neighbour of the next node
   * @param {TreeNode} node
   * @param {number} level
   * @returns {Tree}
   */
  setNeighbors(node, level) {
    // eslint-disable-next-line no-param-reassign
    node.leftNeighborId = this.lastNodeOnLevel[level];
    if (node.leftNeighborId) {
      // eslint-disable-next-line no-param-reassign
      node.leftNeighbor().rightNeighborId = node.id;
    }
    this.lastNodeOnLevel[level] = node.id;
  }

  /**
   * Used for calculation of height and width of a level (level dimensions)
   * @param {TreeNode} node
   * @param {number} level
   * @returns {Tree}
   */
  calcLevelDim(node, level) {
    // root node is on level 0
    this.levelMaxDim[level] = {
      width: Math.max(this.levelMaxDim[level] ? this.levelMaxDim[level].width : 0, node.width),
      height: Math.max(this.levelMaxDim[level] ? this.levelMaxDim[level].height : 0, node.height),
    };
  }

  /**
   * @returns {Tree}
   */
  resetLevelData() {
    this.lastNodeOnLevel = [];
    this.levelMaxDim = [];
  }

  /**
   * @returns {TreeNode}
   */
  root() {
    return this.nodeDB.get(0);
  }
}

Tree.CONFIG = {
  maxDepth: 100,
  rootOrientation: 'NORTH', // NORTH || EAST || WEST || SOUTH
  nodeAlign: 'CENTER', // CENTER || TOP || BOTTOM
  levelSeparation: 30,
  siblingSeparation: 30,
  subTeeSeparation: 30,

  hideRootNode: false,

  animateOnInit: false,
  animateOnInitDelay: 500,

  padding: 15, // the difference is seen only when the scrollbar is shown
  scrollbar: 'native', // "native" || "fancy" || "None" (PS: "fancy" requires jquery and perfect-scrollbar)

  connectors: {
    type: 'curve', // 'curve' || 'step' || 'straight' || 'bCurve'
    style: {
      stroke: 'black',
    },
    stackIndent: 15,
  },

  node: {
    // each node inherits this, it can all be overridden in node config

    // HTMLclass: 'node',
    // drawLineThrough: false,
    // collapsable: false,
    link: {
      target: '_self',
    },
  },

  animation: {
    // each node inherits this, it can all be overridden in node config
    nodeSpeed: 450,
    nodeAnimation: 'linear',
    connectorsSpeed: 450,
    connectorsAnimation: 'linear',
  },

  callback: {
    onCreateNode: Tree.doNothing, // (treeNode, treeNodeDom)
    onCreateNodeCollapseSwitch: Tree.doNothing, // (treeNode, treeNodeDom, switchDom)
    onAfterAddNode: Tree.doNothing, // (newTreeNode, parentTreeNode, nodeStructure)
    onBeforeAddNode: Tree.doNothing, // (parentTreeNode, nodeStructure)
    onAfterPositionNode: Tree.doNothing, // (treeNode, nodeDbIndex, containerCenter, treeCenter)
    onBeforePositionNode: Tree.doNothing, // (treeNode, nodeDbIndex, containerCenter, treeCenter)
    onToggleCollapseFinished: Tree.doNothing, // (treeNode, bIsCollapsed)
    onAfterClickCollapseSwitch: Tree.doNothing, // (nodeSwitch, event)
    onBeforeClickCollapseSwitch: Tree.doNothing, // (nodeSwitch, event)
    onTreeLoaded: Tree.doNothing, // (rootTreeNode)
  },
};

export default Tree;
