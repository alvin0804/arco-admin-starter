import compose from "./compose";
// import debuggerMiddleware from "./middlewares/debugger";
import pageIdMiddleware from "./middlewares/pageId";
import requestIdMiddleware from "./middlewares/requestId";
// import casMiddleware from "./middlewares/cas";
import fetchMiddleware from "./middlewares/fetch";
import simpleGet from "./middlewares/simpleGet";
import simplePost from "./middlewares/simplePost";

export default function request(url, options) {
  const obj = {
    req: { url, options: { url, ...options } },
    res: null,
  };

  // jsonMiddleware, 
  // debuggerMiddleware, 
  // casMiddleware
  const middlewares = [pageIdMiddleware, requestIdMiddleware, simpleGet, simplePost, fetchMiddleware];

  return new Promise((resolve, reject) => {
    compose(middlewares)(obj).then(() => {
      const responseStream = obj.res;
      resolve(responseStream.json());
    }).catch(reject)
  })
}
