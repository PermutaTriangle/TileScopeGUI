import $ from 'jquery';

import createNavBar from './nav_bar';
import TextInput from './text_input';
import SpecTree from './spec_tree';
import ErrorDisplay from './error_display';
import statusCode from '../consumers/status_codes';
import { getTiling } from '../consumers/service';
import { downloadJson } from '../utils/dom_utils';
import AppState from '../utils/app_state';

import '../utils/typedefs';

import './styles/app.scss';

/**
 * The main component. It keeps track of states.
 */
class App {
  /**
   * Convert failure status code to error message.
   *
   * @param {number} status
   * @returns {string} error message
   */
  static statusToMessage(status) {
    if (status < 0) return 'Server unavailable';
    return 'Invalid input';
  }

  /**
   * Create an instance of the app.
   */
  constructor() {
    /** @type {AppState} */
    this.appState = new AppState();
    /** @type {JQuery} */
    this.appSelector = $('#app');
    /** @type {NavBar} */
    createNavBar(
      this.appSelector,
      () => {
        this.init();
      },
      () => {
        this.reset();
      },
      () => {
        this.export();
      },
      () => {
        this.import();
      },
    );
    /** @type {ErrorDisplay} */
    this.errorDisplay = new ErrorDisplay(this.appSelector);
    /** @type {null|TextInput} */
    this.textInput = null;
    /** @type {null|SpecTree} */
    this.specTree = null;
  }

  /**
   * Reset the app. This will clear any tree shown and start
   * with the input field.
   */
  init() {
    if (this.specTree) {
      this.specTree.remove();
      this.specTree = null;
    }

    // Create a text field for input.
    if (!this.textInput) {
      this.textInput = new TextInput(
        this.appSelector,
        (msg) => {
          this.errorDisplay.alert(msg);
        },
        async (val) => {
          const res = await getTiling(val);
          if (res.status !== statusCode.OK) {
            this.errorDisplay.alert(App.statusToMessage(res.status));
          } else {
            this.startTree(res.data);
          }
        },
      );
    }
  }

  /**
   * Process input event.
   *
   * @async
   * @param {TilingResponse} data
   */
  startTree(data) {
    this.specTree = new SpecTree(this.appSelector, data, this.errorDisplay, this.appState);
    this.textInput.remove();
    this.textInput = null;
  }

  /**
   * Reset the current tree, starting again from the root.
   */
  reset() {
    if (!this.specTree) {
      this.init();
    } else {
      const root = this.specTree.getRoot();
      const data = {
        tiling: root.tilingJson,
        plot: root.plot,
        key: root.key,
        verified: root.verified,
      };
      this.specTree.remove();
      this.specTree = null;
      this.specTree = new SpecTree(this.appSelector, data, this.errorDisplay, this.appState);
    }
  }

  /**
   * Export the current tree, either as a session or as a specification json.
   * The latter will only be possible if its complete.
   */
  export() {
    if (!this.specTree) {
      this.errorDisplay.alert('Nothing to export');
    } else if (this.specTree.hasSpecification()) {
      downloadJson(this.specTree.spec.toSpecificationJson(), 'specification');
    } else {
      this.errorDisplay.alert('Currently only implemented for complete specs');
    }
  }

  /**
   * Import an existing session.
   */
  import() {
    this.errorDisplay.notImplemented();
  }
}

export default App;
