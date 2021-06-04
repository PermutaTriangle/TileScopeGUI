import $ from 'jquery';

import NavBar from './nav_bar';
import TextInput from './text_input';
import SpecTree from './spec_tree';

import { getTiling } from '../consumers/service';
import statusCode from '../consumers/status_codes';

import './styles/app.scss';

class App {
  /**
   * The application itself. It keeps track of states.
   * */

  constructor() {
    /**
     * Create an instance of the app.
     */
    this.appSelector = $('#app');
    this.navBar = new NavBar(this.appSelector);
    this.textInput = null;
    this.specTree = null;
    this.setNavbarEvents();
  }

  setNavbarEvents() {
    /**
     * Set events for navigation bar.
     */
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

  init() {
    /**
     * Reset the app. This will clear any tree shown and start
     * with the input field.
     */
    if (this.specTree) {
      this.specTree.remove();
    }

    // Create a text field for input.

    this.textInput = new TextInput(this.appSelector, (value) => {
      this.fetchInit(value);
    });
  }

  async fetchInit(value) {
    /**
     * Process input event.
     */
    const res = await getTiling(value);
    if (res.status !== statusCode.OK) {
      console.log('REQ ERROR! TODO: HANDLE');
    } else {
      this.specTree = new SpecTree(this.appSelector, res.data);
      this.textInput.remove();
    }
  }

  reset() {
    /**
     * Reset the current tree, starting again from the root.
     */
    if (this.specTree) {
      this.specTree.reset();
    }
  }

  export() {
    /**
     * Export the current tree, either as a session or as a specification json.
     * The latter will only be possible if its complete.
     */
    if (this) console.log('todo');
    // App.downloadJson(obj, 'name');
  }

  static downloadJson(content, fileName) {
    /**
     * Download content as a file.
     */
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(content)], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = `${fileName}.json`;
    a.click();
  }

  import() {
    /**
     * Import an existing session.
     */
    if (this) console.log('TODO');
  }
}

export default App;
