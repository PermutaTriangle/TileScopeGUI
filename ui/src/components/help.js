import $ from 'jquery';

import Modal from './bootstrap_wrappers/modal';

import './styles/help.scss';

const displayHelp = () => {
  const modalTitle = 'Help';
  const modalId = 'help-modal';

  const header = () => `${Modal.headerTitle(modalTitle)}${Modal.closeHeaderButton()}`;

  const body = () => `<ul>
  <li>A class that has children</li>
  <li>A verified class</li>
  <li>A class that has children elsewhere</li>
  <li>A class that is yet to be expanded</li>
</ul>`;

  (() =>
    new Modal({
      parentSelector: $('body'),
      type: Modal.CENTRAL,
      id: modalId,
      header: header(),
      body: body(),
      footer: '',
      startVisible: true,
      closeOnEscape: true,
    }))();
};

export default displayHelp;
