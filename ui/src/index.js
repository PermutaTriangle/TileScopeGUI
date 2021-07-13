import $ from 'jquery';
import App from './app/app';

/** Main function */
$(() => {
  const app = new App();
  app.init();
});
