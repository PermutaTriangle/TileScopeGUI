import $ from 'jquery';

import './styles/nav_bar.scss';

class NavBar {
  static getHTML() {
    /**
     * Raw html for navigation bar.
     */
    return `<div class="topnav">
      <a id="nav-home">Home</a>
      <a id="nav-reset">Reset</a>
      <a id="nav-export">Export</a>
      <a id="nav-import">Import</a>
    </div>`;
  }

  constructor(domParent) {
    /**
     * Create a navigation bar. This will generate the HTML and add to parent.
     */
    domParent.prepend(NavBar.getHTML());
    this.home = $('#nav-home');
    this.reset = $('#nav-reset');
    this.export = $('#nav-export');
    this.import = $('#nav-import');
  }

  setHomeEvent(callback) {
    /**
     * Set click event for home.
     */
    this.home.off('click');
    this.home.on('click', (evt) => {
      callback(evt);
    });
  }

  setResetEvent(callback) {
    /**
     * Set click event for reset.
     */
    this.reset.off('click');
    this.reset.on('click', (evt) => {
      callback(evt);
    });
  }

  setExportEvent(callback) {
    /**
     * Set click event for export.
     */
    this.export.off('click');
    this.export.on('click', (evt) => {
      callback(evt);
    });
  }

  setImportEvent(callback) {
    /**
     * Set click event for import.
     */
    this.import.off('click');
    this.import.on('click', (evt) => {
      callback(evt);
    });
  }
}

export default NavBar;
