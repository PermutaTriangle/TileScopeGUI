import $ from 'jquery';

import Modal from './bootstrap_wrappers/modal';

import './styles/settings.scss';

const displaySettings = (appState) => {
  (() =>
    new Modal({
      parentSelector: $('body'),
      id: 'settings-modal',
      type: Modal.CENTRAL,
      header: 'asdf',
      body: 'asdf',
      footer: '',
      startVisible: true,
      closeOnEscape: true,
    }))();
};

export default displaySettings;
