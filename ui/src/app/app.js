import $ from 'jquery';

import NavBar from './nav_bar';
import TextInput from './text_input';
import SpecTree from './spec_tree';
import ErrorDisplay from './error_display';

import './styles/app.scss';

/**
 * The main component. It keeps track of states.
 */
class App {
  /**
   * Create an instance of the app.
   */
  constructor() {
    this.appSelector = $('#app');
    this.navBar = new NavBar(this.appSelector);
    this.errorDisplay = new ErrorDisplay(this.appSelector);
    this.textInput = null;
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
   */
  async startTree(data) {
    this.specTree = new SpecTree(this.appSelector, data, this.errorDisplay);
    this.textInput.remove();
    this.textInput = null;
  }

  /**
   * Reset the current tree, starting again from the root.
   */
  reset() {
    this.errorDisplay.notImplemented();
  }

  /**
   * Export the current tree, either as a session or as a specification json.
   * The latter will only be possible if its complete.
   */
  export() {
    this.errorDisplay.notImplemented();
  }

  /**
   * Import an existing session.
   */
  import() {
    this.errorDisplay.notImplemented();
  }
}

export default App;
