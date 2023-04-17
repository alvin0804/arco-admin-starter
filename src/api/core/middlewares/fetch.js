import deepMerge from "../utils/deepmerge";

/**
 * 默认超时20分钟
 * @param {*} url 
 * @param {*} options 
 * @param {*} timeout 
 * @param {*} error 
 * @returns 
 */
async function fetchWithTimeout(url, options, timeout, error) {
  let controller = new AbortController();
  let signal = controller.signal;
  timeout = timeout || 20 * 60 * 1000;
  error = error || `frontend fetch timeout of ${timeout} exceeded`;
  options = options || {};
  options.signal = signal;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Response("timeout", { status: 504, statusText: "timeout " }));
      controller.abort();
    }, timeout);
    window.fetch(url, options).then(resolve, reject);
  });
}


/**
 * 在原生api基础上增加超时逻辑
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
export default async function fetchMiddleware(ctx, next) {
  if (!ctx) return next();

  const defaultOptions = {
    credentials: "same-origin",
    method: "GET", // 默认为get请求
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  const { options = {}, url = "" } = ctx.req;
  const fetchOptions = deepMerge(defaultOptions, options);
  
  // const res = await fetch(url, fetchOptions);
  const res = await fetchWithTimeout(url, fetchOptions);

  ctx.res = res;
  await next();
}
