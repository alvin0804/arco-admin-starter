import { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { RootRoute, RedirectRoute } from "./base";
import { getRouteModuleList } from "./route-module";
import { routerGuards } from "./router-grards";

//需要验证权限
export const asyncRoutes = [...getRouteModuleList()];

//普通路由 无需验证权限
export const constantRouter: any[] = [RootRoute, RedirectRoute];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);

  // 创建路由守卫
  routerGuards(router);
}

export default router;
