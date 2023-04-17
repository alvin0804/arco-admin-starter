<template>
  <Layout>
    <a-layout>
      <a-layout-sider class="menu-layout-sider" :style="{ width: '64px' }" :collapsed="true" :collapsible="true" :hide-trigger="true">
        <div class="menu-container">
          <custom-menu :menus="menus" :collapsed="true"></custom-menu>
        </div>
      </a-layout-sider>
      <div class="page-card">
        <a-breadcrumb class="page-breadcrumb">
          <a-breadcrumb-item v-for="(item, index) of breadcrumbs" :key="index">{{ item }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="page-main-wrapper">
          <div class="page-main">
            <RouterView></RouterView>
          </div>
        </div>
      </div>
    </a-layout>
  </Layout>
</template>

<script setup lang="ts">
import { useAsyncRouteStore } from "@/store/modules/asyncRoute";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Layout from "./components/layout.vue";
import CustomMenu from "./components/menu.vue";

const currentRoute = useRoute();

// const breadcrumbs = ref<any[]>([]);
const menus = ref<any[]>([]);
function findBrotherRouter(asyncMenus: any[], currentFullpath: string) {
  const brotherRoutes: any[] = [];
  function recusion(routerMap: any[], parent?) {
    return routerMap.map(item => {
      const { meta: { fullpath } } = item;

      if(fullpath === currentFullpath) {
        if(parent && parent.children.length > 0) {
          brotherRoutes.push(...parent.children);
        }
      }

      if(item.children && item.children.length > 0) {
        recusion(item.children, item)
      }
    })
  }

  recusion(asyncMenus);
  // console.log("获取兄弟节点: ", brotherRoutes, currentFullpath);
  return brotherRoutes;
}

function composeBreadcrumbs(asyncMenus: any[], currentFullpath: string) {
  let result: any = [];

  function recusion(routerMap: any[], parent?, breadcrumbs?) {
    return routerMap.map((item) => {
      const { meta: { title, fullpath } } = item;

      if(fullpath === currentFullpath) {
        if(parent && parent.children.length > 0) {
          console.log("asdfasdfasdf: ", breadcrumbs)
          result = (breadcrumbs || []).concat(title); 
        }
      }

      if(item.children && item.children.length> 0) {
        recusion(item.children, item, (breadcrumbs || []).concat(title))
      }
    })
  }

  recusion(asyncMenus);
  // console.log("获取兄弟节点: ", brotherRoutes, currentFullpath);
  return result;
}

const asyncRouteStore = useAsyncRouteStore();
const breadcrumbs = ref<any[]>([])

const init = async () => {
  // 通过fullpath查找同级兄弟路由
  menus.value = findBrotherRouter(asyncRouteStore.getMenus, currentRoute.fullPath)
  breadcrumbs.value = composeBreadcrumbs(asyncRouteStore.getMenus, currentRoute.fullPath)
  // console.log("breadcrumbs: ", breadcrumbs)
}

watch(() => currentRoute.fullPath, () => {
  init();
})
onMounted(init)
</script>

<style scoped lang="less">

.arco-menu-collapsed {
  width: 100%;
}

:deep(.arco-menu-collapsed .arco-menu-inner) {
  padding: 10px 0px;
  box-sizing: border-box;
}
:deep(.arco-menu .arco-menu-item .arco-menu-icon) {
  margin-right: 0;
  // color: #f2f3f5;
  color: red;
}
:deep(.arco-menu-vertical .arco-menu-item.arco-menu-has-icon) {
  flex-direction: column;
  padding: 8px 0px;
  box-sizing: border-box;
}
// :deep(.arco-menu-light .arco-menu-selected) {
//   background-color: #f2f3f51a;
// }
:deep(.arco-menu-light .arco-menu-item.arco-menu-selected) {
  background-color: #f2f3f51a;
}
:deep(.arco-menu-vertical .arco-menu-item.arco-menu-has-icon .arco-menu-title) {
  opacity: 1;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #f2f3f5;
}
:deep(.arco-menu-light .arco-menu-selected .arco-icon) {
  color: #fff;
  font-size: 18px;
}
:deep(.arco-layout-sider-light) {
  background-color: #0b7bc2;
}



.page-card {
  background-color: var(--color-fill-2);
  // background-color: red;
  width: calc(100vw - 64px);
  box-sizing: border-box;
  position: relative;
}
.page-breadcrumb {
  // position: absolute;
  // top: 0;
  // left: 0;
  height: 34px;
  box-sizing: border-box;

  font-size: 12px; 
  padding-top: 5px;
  padding-left: 10px;
}
.page-main-wrapper {
  background-color: var(--color-fill-2);
  height: calc(100vh - 82px);
  overflow: scroll;
}
.page-main {
  height: 100%;
  width: 100%;
  // padding-top: 24px;
}
</style>
