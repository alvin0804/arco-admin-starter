<template>
  <div class="header-container">
    <a-space>
      <a-button type="text">用户名</a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
</script>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "LayoutHeader"
})
</script>

<style scoped>

.header-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* background-color: rgb(21, 40, 76); */
  background-color: #fff;
  height: 100%;
  padding-right: 20px;
}
</style>
