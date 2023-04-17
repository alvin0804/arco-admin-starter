import { useUserStoreWiidthOut } from "@/store/modules/user";
import { useAsyncRouteStoreWidthOut } from "@/store/modules/asyncRoute";
import { isNavigationFailure, Router, RouteRecordRaw } from "vue-router";
import { ErrorPageRoute } from "./base";
import {setRouteEmitter} from "@/utils/route-listener";
import _ from "lodash";

export function routerGuards(router: Router) {
  const asyncRouteStore = useAsyncRouteStoreWidthOut();
  const userStore = useUserStoreWiidthOut();

  router.beforeEach(async (to, from, next) => {
    // 触发路由变更事件
    setRouteEmitter(to);

    if (asyncRouteStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    ///// 由于团队当前登录状态全部交由后端通过session进行控制
    ///// 登录成功时，能够正常获取到用户信息
    ///// 在未登录时前端调用获取用户信息的接口，服务端会自动重定向到 cas登录页面，登录成功后会重定向回到当前页面
    //////// 所以，在路由钩子当中无需进行登录页面跳转处理
    const userInfo = await userStore.getUserInfo();
    const menus = _.get(userInfo, 'roles[0].menus', []);
    // const permissionsList = permissionsListGenerator(menus);
    
    const routes = await asyncRouteStore.generateRoutes(menus);
    // 动态添加可访问路由表
    routes.forEach((item) => {
      router.addRoute(item as unknown as RouteRecordRaw);
    });

    

    //添加404
    const isErrorPage = router.getRoutes().findIndex((item) => item.name === ErrorPageRoute.name);
    if (isErrorPage === -1) {
      router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
    }

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    asyncRouteStore.setDynamicAddedRoute(true);
    next(nextData);
  });

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title;
    if (isNavigationFailure(failure)) {
      console.log('failed navigation', failure)
    }
    const asyncRouteStore = useAsyncRouteStoreWidthOut();
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = asyncRouteStore.keepAliveComponents;
    const currentComName: any = to.matched.find((item) => item.name == to.name)?.name;
    if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName);
    } else if (!to.meta?.keepAlive || to.name == 'Redirect') {
      // 不需要缓存的组件
      const index = asyncRouteStore.keepAliveComponents.findIndex((name) => name == currentComName);
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    asyncRouteStore.setKeepAliveComponents(keepAliveComponents);
  });

  router.onError((error) => {
    console.log(error, "路由错误");
  });
}
