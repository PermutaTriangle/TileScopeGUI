import $ from 'jquery';

import NavBar from './nav_bar';
import TextInput from './text_input';
import SpecTree from './spec_tree';
import ErrorDisplay from './error_display';
import AppState from './app_state';

import '../utils/typedefs';

import './styles/app.scss';

/**
 * The main component. It keeps track of states.
 */
class App {
  /**
   * Create an instance of the app.
   */
  constructor() {
    /** @type {AppState} */
    this.appState = new AppState();
    /** @type {JQuery} */
    this.appSelector = $('#app');
    /** @type {NavBar} */
    this.navBar = new NavBar(this.appSelector);
    /** @type {ErrorDisplay} */
    this.errorDisplay = new ErrorDisplay(this.appSelector);
    /** @type {null|TextInput} */
    this.textInput = null;
    /** @type {null|SpecTree} */
    this.specTree = null;
    this.setNavbarEvents();
  }

  /**
   * Set events for navigation bar.
   */
  setNavbarEvents() {
    this.navBar.setHomeEvent(() => {
      this.init();
    });
    this.navBar.setResetEvent(() => {
      this.reset();
    });
    this.navBar.setExportEvent(() => {
      this.export();
    });
    this.navBar.setImportEvent(() => {
      this.import();
    });
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
        (data) => {
          this.startTree(data);
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
  async startTree(data) {
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
    } else {
      this.errorDisplay.notImplemented();
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
