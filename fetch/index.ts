
import { isURL } from './index';

export const baseDomain = 'http://127.0.0.1:3013';

function genRequestUrl(url: string) {
  const isStartHttp = isURL(url);
  if (isStartHttp) return url;

  return `${baseDomain}${url}`;
}
/*
 * path: 请求路径
 * method: 请求方法 默认get
 * data: 请求参数 默认为空
 * */
function request<T>(
  path: string,
  method = 'GET',
  data: Record<string, any> = {},
  requestConfig = {}
) {
  method = method.toUpperCase();

  // 默认请求头
  const requestHeader: Record<string, unknown> = {
    headers: {
      'content-type': 'application/json',
    },
    method,
    ...requestConfig,
  };

  // 如果是get请求
  if (method === 'GET') {
    // 转换拼接get参数
    const esc = encodeURIComponent;
    const queryParams = Object.keys(data)
      .map((k) => `${esc(k)}=${esc(data[k])}`)
      .join('&');
    if (queryParams) path += `?${queryParams}`;
  } else {
    // 其他请求 放入body里面
    requestHeader.body = JSON.stringify(data);
  }

  const url = genRequestUrl(path);

  // 发送请求并返回 promise 对象 注意 fetch不会拦截其他异常请求️
  return new Promise<BaseResponse<T>>((resolve, reject) => {
    fetch(url, requestHeader)
      .then((res) => res.json())
      .then((response) => {
        // 此处后端返回的http的code永远是200只能判断 response中的code
        const res = response as unknown as BaseResponse<T>;
        if (res.code < 200 || res.code >= 300) {
          if (requestHeader.method === 'GET') alert(res.message);
          reject(res);
        }
        resolve(res);
      })
      .catch((error) => {
        // 服务器没有响应才会跳转到这里
        if (!window.navigator.onLine) {
          // 断网处理
          const errStr = '网络开小差了，稍后再试吧';
         alert(errStr);
        }
        console.error('Error:', error);
        reject(error);
      });
  });
}

export default request;
