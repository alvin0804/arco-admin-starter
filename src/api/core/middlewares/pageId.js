/**
 * 在请求当中添加page_id标识，方便前端出现异常时，后端快速定位日志
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
export default async function pageIdMiddleware(ctx, next) {
  if (!ctx) return next();

  // 获取请求地址hash路径,
  let hashStr = (new URL(window.location.href).hash || "").replace(/^#/, "");

  if(!ctx.req.options.headers) {
    ctx.req.options.headers = {};
  }
  ctx.req.options.headers['page_id'] = hashStr;

  await next();
}
