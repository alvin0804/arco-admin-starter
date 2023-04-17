import appConfig from "@/config/website.config";
import { asyncRoutes, constantRouter } from "@/router";
import { generatorDynamicRouter } from "@/router/generator-routes";
import { store } from "@/store";
import { defineStore } from "pinia";
import { toRaw } from "vue";
import { RouteRecordRaw } from "vue-router";


export interface IAsyncRouteState {
  menus: RouteRecordRaw[];
  routers: any[];
  addRouters: any[];
  keepAliveComponents: string[];
  isDynamicAddedRoute: boolean;
}


export const useAsyncRouteStore = defineStore({
  id: "app-async-route",
  state: (): IAsyncRouteState => ({
    menus: [],
    routers: constantRouter,
    addRouters: [],
    keepAliveComponents: [],
    isDynamicAddedRoute: false,
  }),
  getters: {
    getMenus(): RouteRecordRaw[] {
      return this.menus;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    // 设置动态路由
    setRouters(routers) {
      this.addRouters = routers;
      this.routers = constantRouter.concat(routers);
    },
    setMenus(menus) {
      // 设置动态路由
      this.menus = menus;
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    setKeepAliveComponents(compNames) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames;
    },
    async generateRoutes(menus: any = []) {
      let accessedRouters;

      // 使用接口地址进行处理
      if(appConfig.permissionMode === 'BACK') {
        try {
          accessedRouters = await generatorDynamicRouter(menus, asyncRoutes);
        } catch (error) {
          console.log(error);
        }
      } else {
        //过滤账户是否拥有某一个权限，并将菜单从加载列表移除
        accessedRouters = asyncRoutes
      }

      this.setRouters(accessedRouters);
      this.setMenus(accessedRouters);
      return toRaw(accessedRouters);
    }
  }
});

// Need to be used outside the setup
export function useAsyncRouteStoreWidthOut() {
  return useAsyncRouteStore(store);
}
