import $ from 'jquery';

import createNavBar from './nav_bar';
import TextInput from './text_input';
import SpecTree from './spec_tree';
import ErrorDisplay from './error_display';
import statusCode from '../consumers/status_codes';
import { decodeTilings, getTiling } from '../consumers/service';
import { downloadJson } from '../utils/dom_utils';
import AppState from '../utils/app_state';
import displaySettings from './settings';
import displayHelp from './help';
import { isStr } from '../utils/utils';
import dictionary from '../containers/dictionary';

import '../utils/typedefs';

import './styles/app.scss';

/**
 * The main component. It keeps track of states.
 */
class App {
  // #region Static functions

  /**
   * Convert failure status code to error message.
   *
   * @param {number} status
   * @returns {string} error message
   */
  static #statusToMessage(status) {
    if (status < 0) return 'Server unavailable';
    return 'Invalid input';
  }

  // #endregion

  // #region Private variables

  /** @type {AppState} */
  #appState;

  /** @type {JQuery} */
  #appSelector;

  /** @type {ErrorDisplay} */
  #errorDisplay;

  /** @type {null|TextInput} */
  #textInput;

  /** @type {null|SpecTree} */
  #specTree;

  // #endregion

  // #region Public functions

  /**
   * Create an instance of the app.
   *
   * @constructor
   * @param {string} containerId
   */
  constructor(containerId) {
    this.#appState = new AppState();
    this.#appSelector = $(`#${containerId}`);
    createNavBar(this.#appSelector, ...this.#callbacksAsArgs());
    this.#errorDisplay = new ErrorDisplay(this.#appSelector);
    this.#textInput = null;
    this.#specTree = null;
  }

  /**
   * Reset the app. This will clear any tree shown and start
   * with the input field.
   */
  init() {
    if (this.#specTree) {
      this.#cleanSpecTree();
    }

    if (!this.#textInput) {
      this.#initTextField();
    }
  }

  // #endregion

  // #region Private functions

  /**
   * Get the callbacks in array.
   *
   * @returns {Array.<() => void>} callbacks
   */
  #callbacksAsArgs() {
    return [
      () => {
        this.init();
      },
      () => {
        this.#reset();
      },
      async () => {
        await this.#export();
      },
      () => {
        this.#import();
      },
      () => {
        displaySettings(this.#appState);
      },
      () => {
        displayHelp();
      },
    ];
  }

  /**
   * Process input event.
   *
   * @async
   * @param {TilingResponse} data
   */
  #startTree(data) {
    this.#specTree = new SpecTree(this.#appSelector, data, this.#errorDisplay, this.#appState);
    this.#cleanInputField();
  }

  /**
   * Reset the current tree, starting again from the root.
   */
  #reset() {
    if (!this.#specTree) {
      this.init();
    } else {
      const data = this.#getRootTilingAsResponse();
      this.#resetSpecTree(data);
    }
  }

  /**
   * Remove everything but root.
   *
   * @param {TilingResponse} data
   */
  #resetSpecTree(data) {
    this.#specTree.remove();
    this.#specTree = null;
    this.#specTree = new SpecTree(this.#appSelector, data, this.#errorDisplay, this.#appState);
  }

  /**
   * Remove spec tree.
   */
  #cleanSpecTree() {
    this.#specTree.remove();
    this.#specTree = null;
  }

  /**
   * Remove input field.
   */
  #cleanInputField() {
    this.#textInput.remove();
    this.#textInput = null;
  }

  /**
   * Initialize input field
   */
  #initTextField() {
    this.#textInput = new TextInput(
      this.#appSelector,
      (msg) => {
        this.#errorDisplay.alert(msg);
      },
      async (val) => {
        const res = await getTiling(val, this.#appState);
        this.#processResponse(res, val);
      },
    );
  }

  /**
   * Handle get tiling response.
   *
   * @param {{status: number, data: null|TilingResponse}} res
   */
  #processResponse(res, val) {
    if (res.status !== statusCode.OK) {
      this.#errorDisplay.alert(App.#statusToMessage(res.status));
    } else {
      if (isStr(val)) {
        this.#appState.setRootBasis(val.split('_'));
      }
      this.#startTree(res.data);
    }
  }

  /**
   * Get root tiling in the same format as the original starting request.
   *
   * @returns {TilingResponse} tiling as in original request
   */
  #getRootTilingAsResponse() {
    const root = this.#specTree.getRoot();
    return {
      plot: root.plot,
      key: root.key,
      verified: root.verified,
    };
  }

  /**
   * Get a dictionary that maps tiling keys to tiling jsons.
   *
   * @asnyc
   * @returns {Promise.<Dictionary>} key map
   */
  async #getKeyMap() {
    const spec = this.#specTree.getSpecification();
    const allKeys = spec.allTilingKeys();
    const resp = await decodeTilings(allKeys);
    if (resp.status !== statusCode.OK) return null;
    const allValues = resp.data;
    const keyMap = {};
    allKeys.forEach((key, i) => {
      keyMap[key] = allValues[i];
    });
    return dictionary(keyMap);
  }

  /**
   * Export the current tree, either as a session or as a specification json.
   * The latter will only be possible if its complete.
   * @async
   */
  async #export() {
    if (!this.#specTree) {
      this.#errorDisplay.alert('Nothing to export');
    } else if (this.#specTree.hasSpecification()) {
      const keyMap = await this.#getKeyMap();
      if (keyMap === null) {
        this.#errorDisplay('Failed to fetch tilings from server');
      } else {
        downloadJson(
          this.#specTree.getSpecification().toSpecificationJson(keyMap),
          'specification',
        );
      }
    } else {
      this.#errorDisplay.alert('Currently only implemented for complete specs');
    }
  }

  /**
   * Import an existing session.
   */
  #import() {
    this.#errorDisplay.notImplemented();
  }

  // #endregion
}

export default App;
