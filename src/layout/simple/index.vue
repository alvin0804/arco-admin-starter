<template>
  <div class="admin-page-layout">
    <a-layout class="my-layout-header">
      <a-layout-sider :collapsed="collapsed">
        <LayoutLogo :collapsed="collapsed"></LayoutLogo>
      </a-layout-sider>
      <a-layout-content>
        <LayoutHeader :collapsed="collapsed"></LayoutHeader>
      </a-layout-content>
    </a-layout>
    <a-layout class="my-layout-main">
      <a-layout-sider collapsible :collapsed="collapsed" @collapse="onCollapse">
        <LayoutMenu :collapsed="collapsed"></LayoutMenu>
      </a-layout-sider>
      <a-layout-content>
        <LayoutMain></LayoutMain>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LayoutMain from "./components/main.vue";
import LayoutMenu from "./components/menu.vue";
import LayoutLogo from "./components/logo.vue";
import LayoutHeader from "./components/header.vue";

const collapsed = ref(true);

const onCollapse = (val) => {
  collapsed.value = val;
}
</script>

<style lang="less" scoped>
.admin-page-layout {
  height: 100vh;
  width: 100vw;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.my-layout-header {
  height: 48px;
  display: flex;
  flex: inherit;
  background: var(--color-bg-white);
  box-shadow: 0 1px 4px #00152914;
}
.my-layout-main {
  flex: 1;
  flex-shrink: 0;
  height: 0;
  display: flex;
  background: var(--color-fill-2);
}
</style>
