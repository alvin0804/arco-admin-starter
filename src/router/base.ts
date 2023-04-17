import { RouteRecordRaw } from "vue-router";
import type { AppRouteRecordRaw } from '@/router/types';
import appConfig from "@/config/website.config";
import {ErrorPage, Layout, RedirectPage} from "@/router/constant";

export const RootRoute: RouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: appConfig.baseHome,
  meta: {
    title: "Root",
  },
};

// export const LoginRoute: RouteRecordRaw = {
//     path: '/login',
//     name: 'Login',
//     component: defaultView.loginPage,
//     meta: {
//       title: '登录',
//     },
//   };

// 404 on a page
export const ErrorPageRoute: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: Layout,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'ErrorPageSon',
      component: ErrorPage,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
      },
    },
  ],
};

export const RedirectRoute: AppRouteRecordRaw = {
    path: '/redirect',
    name: appConfig.redirectName,
    component: Layout,
    meta: {
      title: appConfig.redirectName,
      hideBreadcrumb: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: appConfig.redirectName,
        component: RedirectPage,
        meta: {
          title: appConfig.redirectName,
          hideBreadcrumb: true,
        },
      },
    ],
  };
