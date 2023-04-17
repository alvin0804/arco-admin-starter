<template>
  <div class="my-logo">
    <div class="title" v-if="!collapsed">项目标题</div>
    <a-avatar v-if="collapsed" :size="32" :style="{ background: '#2C60DB' }">标题</a-avatar>
  </div>
</template>

<script setup lang="ts">
</script>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'LayoutLogo',
  props: {
    collapsed: Boolean
  }
})
</script>

<style scoped lang="less">

.my-logo {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: #2C60DB;
  color: #2C60DB;

  .title {
    font-weight: 600;
    font-size: 18px;
    animation-duration: .2s;
  }
}
</style>
