<template>
  <div class="default-admin-page-layout">
    <div class="navigator-container">
      <div class="navigator-content">
        <div class="left-side">
          <a-space>
            <span :style="{ cursor: 'pointer' }" @click="jumpToSiteHome" title="跳转至首页">{{ config.title }}</span>
          </a-space>
        </div>
        <div class="right-side">
          <a-menu v-model:selected-keys="selectedKey" mode="horizontal" :style="{ height: '40px', marginRight: '8px', textAlign: 'right' }" size="mini" @menu-item-click="menuItemClick">
            <a-menu-item v-for="item in menus" :key="item.path">{{ item.title }}</a-menu-item>
          </a-menu>
          <a-button class="current-userinfo-btn" :style="{ border: 'none', backgroundColor: 'transparent' }" title="当前用户">{{ `${currentUserName}` }}</a-button>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { useAsyncRouteStore } from "@/store/modules/asyncRoute";
import { useUserStore } from "@/store/modules/user";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import config from "@/config/website.config";

const selectedKey = ref<string[]>(['']);
const userStore: any = useUserStore();
const currentUserName = computed(() => {
  return userStore.userInfo?.userName || '匿名用户';
})

const router = useRouter();
const menuItemClick = (key: string) => {
  router.push({ path: key })
}

const jumpToSiteHome = () => {
  router.push({name: 'home'});
}

const asyncRouteStore = useAsyncRouteStore();

const menus = computed(() => {
  return asyncRouteStore.getMenus.map(({ path, meta: { title, hiddenMenu } }: any) => ({ path, title, hiddenMenu })).filter(({ hiddenMenu }) => !hiddenMenu)
});

const init = () => {
  const url = new URL(window.location.href);

  const pathnames = url.hash.split("/").filter(pathname => pathname !== '#');

  const keys: string[] = [];
  for(let i = 1; i <= pathnames.length; i++) {
    keys.push(`/${pathnames.slice(0, i).join("/")}`.replace('//', '/'))
  }

  selectedKey.value = keys.filter(Boolean);
  console.log("selectKey: ", menus.value);
}
onMounted(init)
</script>

<style scoped lang="less">
.default-admin-page-layout {
  height: 100vh;
  width: 100vw;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.navigator-container {
  height: 40px;
  // background-color: rgba(11, 123, 194, 1);

  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;

  // box-shadow: 0px 2px 2px 0px #ededed;
  z-index: 2;
}

.navigator-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.left-side {
  display: flex;
  align-items: center;

  color: #0b7bc2;
  font-size: 16px;
  font-weight: 900;
}

.right-side {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  box-sizing: border-box;


  
  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    // color: var(--color-text-1);
    text-decoration: none;
  }

}
.current-userinfo-btn {
  font-size: 14px;
  background-color: transparent;
}


:deep(.locale-select) {
  border-radius: 20px;
}

:deep(.arco-menu-light) {
  background-color: transparent;
}

:deep(.arco-menu-item) {
  // color: #fff;
  background-color: transparent;
}

:deep(.arco-menu-item:hover) {
  // color: rgb(var(--primary-6));
  // color: #fff;
  font-weight: 900;
  background-color: transparent;
}

// :deep(.arco-menu-selected-label) {
//   background-color: #fff;
//   // color: #fff;
// }

:deep(.arco-menu-light.arco-menu-horizontal
    .arco-menu-item.arco-menu-selected:hover) {
  background-color: transparent;
  // color: #fff;
}
// :deep(.arco-menu-light .arco-menu-item.arco-menu-selected) {
//   color: #fff;
// }
// :deep(.arco-menu-light .arco-menu-item) {
//   // color: #fff;
// }

:deep(.arco-menu-inner) {
  overflow: inherit;
}

:deep(.arco-menu-selected-label) {
  bottom: -5px;
}

:deep(.arco-menu-light .arco-menu-item) {
  background-color: transparent;
}
:deep(.arco-menu-light .arco-menu-item:hover) {
  background-color: transparent;
  color: #0b7bc2;
}
</style>
