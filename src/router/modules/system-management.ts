import { RouteRecordRaw } from 'vue-router';
// import {Layout} from "@/router/constant";
import DetailLayout from "@/layout/default/detail.vue";
import menuPage from "@/views/system-management/menu/index.vue";
import rolePage from "@/views/system-management/role/index.vue";

const routeName = "system-management";

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
    path: "/system-management",
    name: routeName,
    redirect: "/system-management/menu",
    component: DetailLayout,
    meta: {
      title: '系统管理',
      icon: "icon-code", // router icon
      // permissions: ['site-settings', 'control-chart'],
      sort: 3,
    },
    children: [
      {
        path: 'menu',
        name: `${routeName}_menu`,
        meta: {
          title: '菜单管理',
          // permissions: ['site-settings'],
          affix: true,
          icon: "icon-settings"
        },
        component: menuPage,
      },
      {
        path: 'role',
        name: `${routeName}_role`,
        meta: {
          title: '角色管理',
          affix: true,
          icon: "icon-settings"
        },
        component: rolePage
      },
      // {
      //   path: 'user',
      //   name: `${routeName}_user`,
      //   meta: {
      //     title: '用户管理',
      //     affix: true,
      //     icon: "icon-settings"
      //   },
      //   component: user,
      // },

    ],
  }
]

export default routes;
