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
 */
const createNavBar = (domParent, homeCallback, resetCallback, exportCallback, importCallback) => {
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
</div>`;

  /**
   * Set events for anchors.
   *
   * @param {string[][]} arr
   */
  const setEvents = (arr) => {
    arr.forEach((callback, i) => {
      $(`.topnav > a:nth-child(${i + 1})`)
        .off('click')
        .on('click', callback);
    });
  };

  domParent.prepend(getHTML());
  setEvents([homeCallback, resetCallback, exportCallback, importCallback]);
};

export default createNavBar;
