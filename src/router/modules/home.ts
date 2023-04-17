import { RouteRecordRaw } from 'vue-router';
// import {Layout} from "@/router/constant";
import HomeLayout from "@/layout/default/home.vue";

// import SimpleLayout from "@/layout/simple.vue";
const routeName = "home";

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: routeName,
    redirect: "/home/list",
    component: HomeLayout,
    meta: {
      title: '首页',
      icon: "icon-home", // router icon
      sort: 1,
    },
    children: [
      {
        path: 'list',
        name: `${routeName}_list`,
        meta: {
          title: '首页',
          // permissions: ['index_list'],
          // affix: true,
          icon: "icon-apps"
        },
        component: () => import('@/views/home/list/list.vue'),
      },
    ],
  }
]

export default routes;
