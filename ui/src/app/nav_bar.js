import $ from 'jquery';

import './styles/nav_bar.scss';

/**
 * Nav bar component.
 */
class NavBar {
  /**
   * Raw html for navigation bar.
   *
   * @returns {string} raw HTML string
   */
  static getHTML() {
    return `<div class="topnav">
      <a id="nav-home">Home</a>
      <a id="nav-reset">Reset</a>
      <a id="nav-export">Export</a>
      <a id="nav-import">Import</a>
    </div>`;
  }

  /**
   * Create a navigation bar. This will generate the HTML and add to parent.
   *
   * @param {JQuery} domParent
   */
  constructor(domParent) {
    domParent.prepend(NavBar.getHTML());
    /** @type {JQuery} */
    this.home = $('#nav-home');
    /** @type {JQuery} */
    this.reset = $('#nav-reset');
    /** @type {JQuery} */
    this.export = $('#nav-export');
    /** @type {JQuery} */
    this.import = $('#nav-import');
  }

  /**
   * Set click event for home.
   *
   * @param {() => void} callback
   */
  setHomeEvent(callback) {
    this.home.off('click');
    this.home.on('click', () => {
      callback();
    });
  }

  /**
   * Set click event for reset.
   *
   * @param {() => void} callback
   */
  setResetEvent(callback) {
    this.reset.off('click');
    this.reset.on('click', () => {
      callback();
    });
  }

  /**
   * Set click event for export.
   *
   * @param {() => void} callback
   */
  setExportEvent(callback) {
    this.export.off('click');
    this.export.on('click', () => {
      callback();
    });
  }

  /**
   * Set click event for import.
   *
   * @param {() => void} callback
   */
  setImportEvent(callback) {
    this.import.off('click');
    this.import.on('click', () => {
      callback();
    });
  }
}

export default NavBar;
