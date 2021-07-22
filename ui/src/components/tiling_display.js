import $ from 'jquery';

import StrategyDisplay from './strategy_display';
import { divWrap, accordionItem, bsLI, bsULFlush } from '../utils/dom_utils';

import '../utils/typedefs';

import './styles/tiling_display.scss';

/**
 * A component to display a tiling.
 */
class TilingDisplay {
  // #region Static functions

  /**
   * Convert a GP to a one based with superscript.
   *
   * @param {string} gp
   * @returns {string} one based gp with superscript for positions
   */
  static #fancyGP(gp) {
    if (gp[0] === 'ε') return 'ε';
    const [patt, pos] = gp.split(': ');
    const pattArr = patt.split('').map((x) => +x + 1);
    const posArr = [...pos.match(/\([0-9]+, [0-9]+\)/g)];
    let last = '';
    const arr = Array(pattArr.length);
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      if (posArr[i] === last) {
        arr[i] = pattArr[i];
      } else {
        arr[i] = `${pattArr[i]}<sup>${posArr[i]}</sup>`;
      }
      last = posArr[i];
    }
    return arr.join('');
  }

  // #endregion

  // #region Private variables

  /** @type {TilingInterface} */
  #tiling;

  /** @type {AppStateInterface} */
  #appState;

  /** @type {HTMLDivElement} */
  #plotDiv;

  /** @type {null|RuleWithoutTilings} */
  #rule;

  /** @type {(newRule: RuleResponse) => void} */
  #callback;

  /** @type {JQuery} */
  #parentDom;

  /** @type {(msg: string) => void} */
  #errorMsg;

  // #endregion

  /**
   * Create tiling display component.
   *
   * @constructor
   * @param {TilingInterface} tiling
   * @param {AppStateInterface} appState
   * @param {HTMLDivElement} plotDiv
   * @param {null|RuleWithoutTilings} rule
   * @param {(newRule: RuleResponse) => void} callback
   * @param {JQuery} parentDom
   * @param {(msg: string) => void} errorMsg
   */
  constructor(tiling, appState, plotDiv, rule, callback, parentDom, errorMsg) {
    this.#tiling = tiling;
    this.#appState = appState;
    this.#plotDiv = plotDiv;
    this.#rule = rule;
    this.#callback = callback;
    this.#parentDom = parentDom;
    this.#errorMsg = errorMsg;

    this.#plot();
  }

  /**
   * Have we already expanded this tiling?
   *
   * @returns {bolean} true if tilings is not on LHS on rule
   */
  #isExpandable() {
    return this.#rule === null;
  }

  /**
   * Is this tiling verified?
   *
   * @returns {boolean} true if tiling is verified
   */
  #isVerified() {
    return this.#tiling.isVerified();
  }

  /**
   * Add component to dom.
   */
  #plot() {
    this.#addTopFigure();
    const rOrV = this.#ruleOrVerification();
    this.#parentDom.append(`<div class="accordion" id="accordionPanelsStayOpenExample">
      ${this.#tilingInfo()}
      ${rOrV}
    </div>`);
    if (!rOrV) this.#expansionsStrats();
  }

  /**
   * Add tiling's ascii figure to dom.
   */
  #addTopFigure() {
    const div = divWrap('top-modal-figure', this.#plotDiv);
    this.#parentDom.append(div);
  }

  /**
   * Construct elements for displaying information about tiling.
   *
   * @returns {string} raw HTML string
   */
  #tilingInfo() {
    const items = [];
    if (this.#tiling.plot.label_map && Object.keys(this.#tiling.plot.label_map).length) {
      items.push(this.#cellBasesDiv());
    }
    if (this.#tiling.plot.crossing?.length) {
      items.push(this.#crossingDiv());
    }
    if (this.#tiling.plot.requirements?.length) {
      items.push(this.#requirementsDiv());
    }
    if (this.#tiling.plot.assumptions?.length) {
      items.push(this.#assumptionsDiv());
    }
    return items.join('');
  }

  /**
   * If tiling is verified or has been expanded,
   * return the appropriate info. Otherwise the
   * empty string is returned.
   *
   * @returns {string} raw HTML string or nothing if we can expand
   */
  #ruleOrVerification() {
    if (this.#isVerified()) {
      return this.#verification();
    }
    if (!this.#isExpandable()) {
      return this.#ruleForTiling();
    }
    return '';
  }

  /**
   * A list of cell bases.
   *
   * @returns {string} raw HTML string.
   */
  #cellBasesDiv() {
    return accordionItem(
      1,
      'Cell bases',
      bsULFlush(
        Object.entries(this.#tiling.plot.label_map)
          .map(([key, value]) => bsLI(`${key}: ${value}`))
          .join(''),
      ),
    );
  }

  /**
   * A list of crossing obstructions.
   *
   * @returns {string} raw HTML string.
   */
  #crossingDiv() {
    return accordionItem(
      2,
      'Crossing obstructions',
      bsULFlush(this.#tiling.plot.crossing.map((v) => bsLI(TilingDisplay.#fancyGP(v))).join('')),
    );
  }

  /**
   * A list of requirements.
   *
   * @returns {string} raw HTML string.
   */
  #requirementsDiv() {
    return accordionItem(
      3,
      'Requirements',
      bsULFlush(
        this.#tiling.plot.requirements
          .map((v) => bsLI(v.map((x) => TilingDisplay.#fancyGP(x)).join('<br>')))
          .join(''),
      ),
    );
  }

  /**
   * A list of assumptions.
   *
   * @returns {string} raw HTML string.
   */
  #assumptionsDiv() {
    return accordionItem(
      4,
      'Assumption',
      bsULFlush(
        this.#tiling.plot.assumptions
          .map((v) => bsLI(v.map((x) => TilingDisplay.#fancyGP(x)).join('<br>')))
          .join(''),
      ),
    );
  }

  /**
   * How the tiling is verified.
   *
   * @returns {string} raw HTML string.
   */
  #verification() {
    return accordionItem(5, 'Verified', `<div>${this.#tiling.verified.formal_step}</div>`);
  }

  /**
   * Add an interface for expansions.
   */
  #expansionsStrats() {
    const strat = new StrategyDisplay(
      this.#tiling,
      this.#appState,
      this.#plotDiv,
      this.#callback,
      $('.accordion'),
      this.#errorMsg,
    );
    strat.plot();
  }

  /**
   * The rule that the tilings is on the left hand side of.
   *
   * @returns {string} raw HTML string.
   */
  #ruleForTiling() {
    return accordionItem(5, 'Rule', `<div>${this.#rule.formalStep}</div>`);
  }
}

/**
 * @param {TilingInterface} tiling
 * @param {AppStateInterface} appState
 * @param {HTMLDivElement} plotDiv
 * @param {null|RuleWithoutTilings} rule
 * @param {(newRule: RuleResponse) => void} callback
 * @param {JQuery} parentDom
 * @param {(msg: string) => void} errorMsg
 */
const displayTiling = (tiling, appState, plotDiv, rule, callback, parentDom, errorMsg) => {
  (() => new TilingDisplay(tiling, appState, plotDiv, rule, callback, parentDom, errorMsg))();
};

export default displayTiling;
