import $ from 'jquery';

import './styles/nav_bar.scss';

/**
 * Create a navigation bar. This will generate the HTML and add to parent.
 *
 * @param {JQuery} domParent
 * @param {() => void} homeCallback
 * @param {() => void} resetCallback
 * @param {() => void} exportCallback
 * @param {() => void} importCallback
 * @param {() => void} settingsCallback
 * @param {() => void} helpCallback
 */
const createNavBar = (
  domParent,
  homeCallback,
  resetCallback,
  exportCallback,
  importCallback,
  settingsCallback,
  helpCallback,
) => {
  /**
   * Raw html for navigation bar.
   *
   * @returns {string} raw HTML string
   */
  const getHTML = () => `<div class="topnav">
  <a>Home</a>
  <a>Reset</a>
  <a>Export</a>
  <a>Import</a>
  <a>Settings</a>
  <a>Help</a>
</div>`;

  /**
   * Set events for anchors.
   *
   * @param {string[][]} arr
   */
  const setEvents = (...callbacks) => {
    callbacks.forEach((callback, i) => {
      $(`.topnav > a:nth-child(${i + 1})`)
        .off('click')
        .on('click', callback);
    });
  };

  domParent.prepend(getHTML());
  setEvents(
    homeCallback,
    resetCallback,
    exportCallback,
    importCallback,
    settingsCallback,
    helpCallback,
  );
};

export default createNavBar;
