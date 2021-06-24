import $ from 'jquery';
import TreantUtils from './treant_utils';

class TreeNode {
  /**
   * TreeNode constructor.
   * @param {object} nodeStructure
   * @param {number} id
   * @param {number} parentId
   * @param {Tree} tree
   * @param {number} stackParentId
   * @constructor
   */
  constructor(nodeStructure, id, parentId, tree, stackParentId) {
    this.id = id;
    this.parentId = parentId;
    this.tree = tree;

    this.prelim = 0;
    this.modifier = 0;
    this.leftNeighborId = null;

    this.stackParentId = stackParentId;

    // pseudo node is a node with width=height=0, it is invisible, but necessary for the correct positioning of the tree
    this.pseudo = nodeStructure === 'pseudo' || nodeStructure.pseudo; // todo: surely if nodeStructure is a scalar then the rest will error:

    this.meta = nodeStructure.meta || {};
    this.image = nodeStructure.image || null;

    this.link = TreantUtils.createMerge(tree.cfg.node.link, nodeStructure.link);

    this.connStyle = TreantUtils.createMerge(tree.cfg.connectors, nodeStructure.connectors);
    this.connector = null;

    this.drawLineThrough =
      nodeStructure.drawLineThrough === false
        ? false
        : nodeStructure.drawLineThrough || tree.cfg.node.drawLineThrough;

    this.collapsable =
      nodeStructure.collapsable === false
        ? false
        : nodeStructure.collapsable || tree.cfg.node.collapsable;
    this.collapsed = nodeStructure.collapsed;

    this.text = nodeStructure.text;

    // '.node' DIV
    this.nodeInnerHTML = nodeStructure.innerHTML;
    this.nodeHTMLclass =
      (tree.cfg.node.HTMLclass ? tree.cfg.node.HTMLclass : '') + // globally defined class for the nodex
      (nodeStructure.HTMLclass ? ` ${nodeStructure.HTMLclass}` : ''); // + specific node class

    this.nodeHTMLid = nodeStructure.HTMLid;

    this.children = [];
  }

  /**
   * @returns {Tree}
   */
  getTree() {
    return this.tree;
  }

  /**
   * @returns {object}
   */
  getTreeConfig() {
    return this.getTree().cfg;
  }

  /**
   * @returns {NodeDB}
   */
  getTreeNodeDb() {
    return this.getTree().getNodeDb();
  }

  /**
   * @param {number} nodeId
   * @returns {TreeNode}
   */
  lookupNode(nodeId) {
    return this.getTreeNodeDb().get(nodeId);
  }

  /**
   * @returns {Tree}
   */
  Tree() {
    return this.getTree();
  }

  /**
   * @param {number} nodeId
   * @returns {TreeNode}
   */
  dbGet(nodeId) {
    return this.getTreeNodeDb().get(nodeId);
  }

  /**
   * Returns the width of the node
   * @returns {float}
   */
  size() {
    const orientation = this.getTreeConfig().rootOrientation;

    if (this.pseudo) {
      // prevents separating the subtrees
      return -this.getTreeConfig().subTeeSeparation;
    }

    if (orientation === 'NORTH' || orientation === 'SOUTH') {
      return this.width;
    }
    // else: (orientation === 'WEST' || orientation === 'EAST') {
    return this.height;
  }

  /**
   * @returns {number}
   */
  childrenCount() {
    return this.collapsed || !this.children ? 0 : this.children.length;
  }

  /**
   * @param {number} index
   * @returns {TreeNode}
   */
  childAt(index) {
    return this.dbGet(this.children[index]);
  }

  /**
   * @returns {TreeNode}
   */
  firstChild() {
    return this.childAt(0);
  }

  /**
   * @returns {TreeNode}
   */
  lastChild() {
    return this.childAt(this.children.length - 1);
  }

  /**
   * @returns {TreeNode}
   */
  parent() {
    return this.lookupNode(this.parentId);
  }

  /**
   * @returns {TreeNode}
   */
  leftNeighbor() {
    if (this.leftNeighborId) {
      return this.lookupNode(this.leftNeighborId);
    }
    return undefined;
  }

  /**
   * @returns {TreeNode}
   */
  rightNeighbor() {
    if (this.rightNeighborId) {
      return this.lookupNode(this.rightNeighborId);
    }
    return undefined;
  }

  /**
   * @returns {TreeNode}
   */
  leftSibling() {
    const leftNeighbor = this.leftNeighbor();
    if (leftNeighbor && leftNeighbor.parentId === this.parentId) {
      return leftNeighbor;
    }
    return undefined;
  }

  /**
   * @returns {TreeNode}
   */
  rightSibling() {
    const rightNeighbor = this.rightNeighbor();
    if (rightNeighbor && rightNeighbor.parentId === this.parentId) {
      return rightNeighbor;
    }
    return undefined;
  }

  /**
   * @returns {number}
   */
  childrenCenter() {
    const first = this.firstChild();
    const last = this.lastChild();

    return first.prelim + (last.prelim - first.prelim + last.size()) / 2;
  }

  /**
   * Find out if one of the node ancestors is collapsed
   * @returns {*}
   */
  collapsedParent() {
    const parent = this.parent();
    if (!parent) {
      return false;
    }
    if (parent.collapsed) {
      return parent;
    }
    return parent.collapsedParent();
  }

  /**
   * Returns the leftmost child at specific level, (initial level = 0)
   * @param level
   * @param depth
   * @returns {*}
   */
  leftMost(level, depth) {
    if (level >= depth) {
      return this;
    }
    if (this.childrenCount() === 0) {
      return undefined;
    }

    for (let i = 0, n = this.childrenCount(); i < n; i += 1) {
      const leftmostDescendant = this.childAt(i).leftMost(level + 1, depth);
      if (leftmostDescendant) {
        return leftmostDescendant;
      }
    }
    return undefined;
  }

  // returns start or the end point of the connector line, origin is upper-left
  connectorPoint(startPoint) {
    let orient = this.Tree().cfg.rootOrientation;
    const point = {};

    if (this.stackParentId) {
      // return different end point if node is a stacked child
      if (orient === 'NORTH' || orient === 'SOUTH') {
        orient = 'WEST';
      } else if (orient === 'EAST' || orient === 'WEST') {
        orient = 'NORTH';
      }
    }

    // if pseudo, a virtual center is used
    if (orient === 'NORTH') {
      point.x = this.pseudo
        ? this.X - this.Tree().cfg.subTeeSeparation / 2
        : this.X + this.width / 2;
      point.y = startPoint ? this.Y + this.height : this.Y;
    } else if (orient === 'SOUTH') {
      point.x = this.pseudo
        ? this.X - this.Tree().cfg.subTeeSeparation / 2
        : this.X + this.width / 2;
      point.y = startPoint ? this.Y : this.Y + this.height;
    } else if (orient === 'EAST') {
      point.x = startPoint ? this.X : this.X + this.width;
      point.y = this.pseudo
        ? this.Y - this.Tree().cfg.subTeeSeparation / 2
        : this.Y + this.height / 2;
    } else if (orient === 'WEST') {
      point.x = startPoint ? this.X + this.width : this.X;
      point.y = this.pseudo
        ? this.Y - this.Tree().cfg.subTeeSeparation / 2
        : this.Y + this.height / 2;
    }
    return point;
  }

  /**
   * @returns {string}
   */
  pathStringThrough() {
    // get the geometry of a path going through the node
    const startPoint = this.connectorPoint(true);
    const endPoint = this.connectorPoint(false);

    return ['M', `${startPoint.x},${startPoint.y}`, 'L', `${endPoint.x},${endPoint.y}`].join(' ');
  }

  /**
   * @param {object} hidePoint
   */
  drawLineThroughMe(hidePoint) {
    // hidepoint se proslijedjuje ako je node sakriven zbog collapsed
    const pathString = hidePoint
      ? this.Tree().getPointPathString(hidePoint)
      : this.pathStringThrough();

    this.lineThroughMe = this.lineThroughMe || this.Tree().raphael.path(pathString);

    const lineStyle = TreantUtils.cloneObj(this.connStyle.style);

    delete lineStyle['arrow-start'];
    delete lineStyle['arrow-end'];

    this.lineThroughMe.attr(lineStyle);

    if (hidePoint) {
      this.lineThroughMe.hide();
      this.lineThroughMe.hidden = true;
    }
  }

  addSwitchEvent(nodeSwitch) {
    const self = this;
    TreantUtils.addEvent(nodeSwitch, 'click', (e) => {
      e.preventDefault();
      if (
        self.getTreeConfig().callback.onBeforeClickCollapseSwitch.apply(self, [nodeSwitch, e]) !==
        false
      ) {
        self.toggleCollapse();
        self.getTreeConfig().callback.onAfterClickCollapseSwitch.apply(self, [nodeSwitch, e]);
      }
    });
  }

  /**
   * @returns {TreeNode}
   */
  toggleCollapse() {
    const oTree = this.getTree();

    if (!oTree.inAnimation) {
      oTree.inAnimation = true;

      this.collapsed = !this.collapsed; // toggle the collapse at each click
      TreantUtils.toggleClass(this.nodeDOM, 'collapsed', this.collapsed);

      oTree.positionTree();

      const self = this;

      setTimeout(
        () => {
          // set the flag after the animation
          oTree.inAnimation = false;
          oTree.cfg.callback.onToggleCollapseFinished.apply(oTree, [self, self.collapsed]);
        },
        oTree.cfg.animation.nodeSpeed > oTree.cfg.animation.connectorsSpeed
          ? oTree.cfg.animation.nodeSpeed
          : oTree.cfg.animation.connectorsSpeed,
      );
    }
  }

  hide(collapseToPoint) {
    const ctp = collapseToPoint || false;

    const bCurrentState = this.hidden;
    this.hidden = true;

    this.nodeDOM.style.overflow = 'hidden';

    const tree = this.getTree();
    const config = this.getTreeConfig();
    const oNewState = {
      opacity: 0,
    };

    if (ctp) {
      oNewState.left = ctp.x;
      oNewState.top = ctp.y;
    }

    // if parent was hidden in initial configuration, position the node behind the parent without animations
    if (!this.positioned || bCurrentState) {
      this.nodeDOM.style.visibility = 'hidden';
      $(this.nodeDOM).css(oNewState);
      this.positioned = true;
    } else {
      // todo: fix flashy bug when a node is manually hidden and tree.redraw is called.
      $(this.nodeDOM).animate(
        oNewState,
        config.animation.nodeSpeed,
        config.animation.nodeAnimation,
        () => {
          this.style.visibility = 'hidden';
        },
      );
    }

    // animate the line through node if the line exists
    if (this.lineThroughMe) {
      const newPath = tree.getPointPathString(ctp);
      if (bCurrentState) {
        // update without animations
        this.lineThroughMe.attr({ path: newPath });
      } else {
        // update with animations
        tree.animatePath(this.lineThroughMe, tree.getPointPathString(ctp));
      }
    }
  }

  /**
   * @returns {TreeNode}
   */
  hideConnector() {
    const oTree = this.Tree();
    const oPath = oTree.connectionStore[this.id];
    if (oPath) {
      oPath.animate(
        { opacity: 0 },
        oTree.cfg.animation.connectorsSpeed,
        oTree.cfg.animation.connectorsAnimation,
      );
    }
  }

  show() {
    this.hidden = false;

    this.nodeDOM.style.visibility = 'visible';

    const oNewState = {
      left: this.X,
      top: this.Y,
      opacity: 1,
    };
    const config = this.getTreeConfig();
    const self = this;
    // if the node was hidden, update opacity and position
    $(this.nodeDOM).animate(
      oNewState,
      config.animation.nodeSpeed,
      config.animation.nodeAnimation,
      () => {
        // $.animate applies "overflow:hidden" to the node, remove it to avoid visual problems
        if (self.style) {
          self.style.overflow = '';
        } else {
          self.style = { overflow: '' };
        }
      },
    );

    if (this.lineThroughMe) {
      this.getTree().animatePath(this.lineThroughMe, this.pathStringThrough());
    }
  }

  /**
   * @returns {TreeNode}
   */
  showConnector() {
    const oTree = this.Tree();
    const oPath = oTree.connectionStore[this.id];
    if (oPath) {
      oPath.animate(
        { opacity: 1 },
        oTree.cfg.animation.connectorsSpeed,
        oTree.cfg.animation.connectorsAnimation,
      );
    }
  }

  /**
   * Build a node from the 'text' and 'img' property and return with it.
   *
   * The node will contain all the fields that present under the 'text' property
   * Each field will refer to a css class with name defined as node-{$property_name}
   *
   * Example:
   * The definition:
   *
   *   text: {
   *     desc: "some description",
   *     paragraph: "some text"
   *   }
   *
   * will generate the following elements:
   *
   *   <p class="node-desc">some description</p>
   *   <p class="node-paragraph">some text</p>
   *
   * @Returns the configured node
   */
  buildNodeFromText(node) {
    // IMAGE
    if (this.image) {
      const image = document.createElement('img');
      image.src = this.image;
      node.appendChild(image);
    }

    // TEXT
    if (this.text) {
      Object.keys(this.text).forEach((key) => {
        // adding DATA Attributes to the node
        if (key.startsWith('data-')) {
          node.setAttribute(key, this.text[key]);
        } else {
          const textElement = document.createElement(this.text[key].href ? 'a' : 'p');

          // make an <a> element if required
          if (this.text[key].href) {
            textElement.href = this.text[key].href;
            if (this.text[key].target) {
              textElement.target = this.text[key].target;
            }
          }

          textElement.className = `node-${key}`;
          textElement.appendChild(
            document.createTextNode(
              // eslint-disable-next-line no-nested-ternary
              this.text[key].val
                ? this.text[key].val
                : this.text[key] instanceof Object
                ? "'val' param missing!"
                : this.text[key],
            ),
          );

          node.appendChild(textElement);
        }
      });
    }
    return node;
  }

  /**
   * Build a node from  'nodeInnerHTML' property that defines an existing HTML element, referenced by it's id, e.g: #someElement
   * Change the text in the passed node to 'Wrong ID selector' if the referenced element does ot exist,
   * return with a cloned and configured node otherwise
   *
   * @Returns node the configured node
   */
  buildNodeFromHtml(node) {
    // get some element by ID and clone its structure into a node
    if (this.nodeInnerHTML.charAt(0) === '#') {
      const elem = document.getElementById(this.nodeInnerHTML.substring(1));
      if (elem) {
        // eslint-disable-next-line no-param-reassign
        node = elem.cloneNode(true);
        // eslint-disable-next-line no-param-reassign
        node.id += '-clone';
        // eslint-disable-next-line no-param-reassign
        node.className += ' node';
      } else {
        // eslint-disable-next-line no-param-reassign
        node.innerHTML = '<b> Wrong ID selector </b>';
      }
    } else {
      // insert your custom HTML into a node
      // eslint-disable-next-line no-param-reassign
      node.innerHTML = this.nodeInnerHTML;
    }
    return node;
  }

  /**
   * @param {Tree} tree
   */
  createGeometry(tree) {
    if (this.id === 0 && tree.cfg.hideRootNode) {
      this.width = 0;
      this.height = 0;
      return;
    }

    const { drawArea } = tree;
    /// //////// CREATE NODE //////////////
    let node = document.createElement(this.link.href ? 'a' : 'div');

    node.className = !this.pseudo ? TreeNode.CONFIG.nodeHTMLclass : 'pseudo';
    if (this.nodeHTMLclass && !this.pseudo) {
      node.className += ` ${this.nodeHTMLclass}`;
    }

    if (this.nodeHTMLid) {
      node.id = this.nodeHTMLid;
    }

    if (this.link.href) {
      node.href = this.link.href;
      node.target = this.link.target;
    }

    $(node).data('treenode', this);

    /// //////// BUILD NODE CONTENT //////////////
    if (!this.pseudo) {
      node = this.nodeInnerHTML ? this.buildNodeFromHtml(node) : this.buildNodeFromText(node);

      // handle collapse switch
      if (this.collapsed || (this.collapsable && this.childrenCount() && !this.stackParentId)) {
        this.createSwitchGeometry(tree, node);
      }
    }

    tree.cfg.callback.onCreateNode.apply(tree, [this, node]);

    /// //////// APPEND all //////////////
    drawArea.appendChild(node);

    this.width = node.offsetWidth;
    this.height = node.offsetHeight;

    this.nodeDOM = node;
  }

  /**
   * @param {Tree} tree
   * @param {Element} nodeEl
   */
  createSwitchGeometry(tree, nodeEl) {
    const el = nodeEl || this.nodeDOM;

    // safe guard and check to see if it has a collapse switch
    let nodeSwitchEl = TreantUtils.findEl('.collapse-switch', true, el);
    if (!nodeSwitchEl) {
      nodeSwitchEl = document.createElement('a');
      nodeSwitchEl.className = 'collapse-switch';

      el.appendChild(nodeSwitchEl);
      this.addSwitchEvent(nodeSwitchEl);
      if (this.collapsed) {
        el.className += ' collapsed';
      }

      tree.cfg.callback.onCreateNodeCollapseSwitch.apply(tree, [this, el, nodeSwitchEl]);
    }
    return nodeSwitchEl;
  }
}

TreeNode.CONFIG = {
  nodeHTMLclass: 'node',
};

export default TreeNode;
