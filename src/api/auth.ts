import requestCore from "./core";

/**
 * 获取用户信息
 */
export function getUserInfoService(params: any = {}) {
  return requestCore("/mock/getUserInfo.json", { method: 'GET', params });
}
