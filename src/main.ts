import { createApp } from "vue";
import App from "./App.vue";
import router, { setupRouter } from "./router";
import { setupStore } from "./store";
import {setupComponents} from "@/plugins/components";

async function bootstrap() {

  const app = createApp(App);
  //注册全局组件
  setupComponents(app);

  // 挂载状态管理
  setupStore(app);
  // 挂载路由
  await setupRouter(app);

  // 路由准备就绪后挂载APP实例
  await router.isReady();

  app.mount("#app", true);
}

void bootstrap();
