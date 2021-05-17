import { apiPost } from './consumers/instance';
import statusCode from './consumers/status_codes';

(async () => {
  const mydiv = document.getElementById('mydiv');
  const res = await apiPost('/test/5', { b: 'hi from js' }, null);
  if (res.status === statusCode.OK) {
    mydiv.innerText = `${res.data.a} and ${res.data.b}`;
  }
})();
