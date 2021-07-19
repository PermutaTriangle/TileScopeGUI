import mockAxios from '../../__mocks__/axios';

import { apiGet, apiPost } from '../../src/consumers/instance';

test('test setup instace', async () => {
  expect(mockAxios.create).toHaveBeenCalledTimes(1);
  const callParam = mockAxios.create.mock.calls[0][0];
  expect(callParam.baseURL).toBe('http://127.0.0.1:5000/api');
  expect(callParam.timeout).toBe(1000);
  expect(callParam.headers['Content-Type']).toBe('application/json');
});

describe('test api get', () => {
  test('test api get success', async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: 'maranax infirmux', status: 200 }),
    );
    const res = await apiGet('mypath');
    expect(res.data).toBe('maranax infirmux');
    expect(res.status).toBe(200);
  });

  test('test api get status failure', async () => {
    mockAxios.get.mockImplementationOnce(() => {
      const err = Error('Bad Request');
      err.response = { status: 400 };
      return Promise.reject(err);
    });
    const res = await apiGet('myPath');
    expect(res.status).toBe(400);
    expect(res.data).toBe(null);
  });

  test('test api get other failure', async () => {
    mockAxios.get.mockImplementationOnce(() => Promise.reject(Error('some error')));
    const res = await apiGet('mypath');
    expect(res.status).toBe(-1);
    expect(res.data).toBe(null);
  });
});

describe('test api post', () => {
  const body = { mydata: 'abc' };

  test('test api post success', async () => {
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: 'maranax infirmux', status: 200 }),
    );
    const res = await apiPost('mypath', body);
    expect(res.data).toBe('maranax infirmux');
    expect(res.status).toBe(200);
    expect(mockAxios.post.mock.calls[0][1]).toBe('{"mydata":"abc"}');
  });

  test('test api post status failure', async () => {
    mockAxios.post.mockImplementationOnce(() => {
      const err = Error('Bad Request');
      err.response = { status: 400 };
      return Promise.reject(err);
    });
    const res = await apiPost('myPath', body);
    expect(res.status).toBe(400);
    expect(res.data).toBe(null);
  });

  test('test api post other failure', async () => {
    mockAxios.post.mockImplementationOnce(() => Promise.reject(Error('some error')));
    const res = await apiPost('mypath', body);
    expect(res.status).toBe(-1);
    expect(res.data).toBe(null);
  });
});
