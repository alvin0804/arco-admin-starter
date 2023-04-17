import { RouteRecordRaw } from "vue-router";

const modules = import.meta.globEager('./modules/**/*.ts');

export function getRouteModuleList() {
  const routeModuleList: RouteRecordRaw[] = [];
  Object.keys(modules).forEach(async (key) => {
    // @ts-ignore
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
  });
  routeModuleList.sort(function sortRoute(a: RouteRecordRaw, b: RouteRecordRaw) {
    // @ts-ignore
    return (a.meta?.sort || 0) - (b.meta?.sort || 0);
  });

  return routeModuleList;
}