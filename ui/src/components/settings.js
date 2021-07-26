import $ from 'jquery';

import Modal from './bootstrap_wrappers/modal';

import '../utils/typedefs';
import './styles/settings.scss';

/**
 * Render settings.
 *
 * @param {AppStateInterface} appState
 */
const displaySettings = (appState) => {
  const modalTitle = 'Settings';

  const header = () => `${Modal.headerTitle(modalTitle)}${Modal.closeHeaderButton()}`;

  const checkA = () => (appState.getAtomVerification() ? ' checked' : '');
  const checkLF = () => (appState.getLocallyFactorableVerification() ? ' checked' : '');
  const checkIE = () => (appState.getInsertionEncodableVerification() ? ' checked' : '');
  const checkOBO = () => (appState.getOneByOneVerifciation() ? ' checked' : '');
  const checkSC = () => (appState.getSubclassVerification() ? ' checked' : '');
  const checkSO = () => (appState.getShortObstructionVerification() ? ' checked' : '');

  const checkJson = () => (appState.getClipboardCopy() ? ' checked' : '');
  const checkRepl = () => (!appState.getClipboardCopy() ? ' checked' : '');

  const body = () => `<div id="verification">
  <label>Verification strategies</label>
  <ul>
    <li><input type="checkbox"${checkA()} disabled>Empty, neutral, atomic</li>
    <li><input type="checkbox"${checkLF()}>Locally factorable</li>
    <li><input type="checkbox"${checkIE()}>Insertion encodable</li>
    <li><input type="checkbox"${checkOBO()}>One by one</li>
    <li><input type="checkbox"${checkSC()}>Subclass</li>
    <li><input type="checkbox"${checkSO()}>Short obstruction</li>
  </ul>
</div>
<div id="clipboardsetting">
  <label>Clipboard copy as:</label>
  <div>
    <input type="radio" id="json-copy" name="clipboard" value="json"${checkJson()}>
    <label for="json-copy">Json</label>
    <input type="radio" id="repl-copy" name="clipboard" value="repl"${checkRepl()}>
    <label for="repl-copy">Repl</label>
  </div>
</div>
`;

  const setCopyCallback = () => {
    $('#clipboardsetting input[type=radio][name=clipboard]').on('change', () => {
      appState.setClipboardCopy(!appState.getClipboardCopy());
      console.log(appState.clipboard);
    });
  };

  const setToggleCallbacks = () => {
    $('#verification > ul > li > input[type=checkbox]').on('change', (evt) => {
      const idx = $(evt.currentTarget).parent().index();
      switch (idx) {
        case 1:
          appState.setLocallyFactorableVerification(!appState.getLocallyFactorableVerification());
          break;
        case 2:
          appState.setInsertionEncodableVerification(!appState.getInsertionEncodableVerification());
          break;
        case 3:
          appState.setOneByOneVerifciation(!appState.getOneByOneVerifciation());
          break;
        case 4:
          appState.setSubclassVerification(!appState.getSubclassVerification());
          break;
        case 5:
          appState.setShortObstructionVerification(!appState.getShortObstructionVerification());
          break;
        default:
          break;
      }
    });
  };

  (() =>
    new Modal({
      parentSelector: $('body'),
      id: 'settings-modal',
      type: Modal.CENTRAL,
      header: header(),
      body: body(),
      footer: '',
      startVisible: true,
      closeOnEscape: true,
    }))();

  setToggleCallbacks();
  setCopyCallback();
};

export default displaySettings;
