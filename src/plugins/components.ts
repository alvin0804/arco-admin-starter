import {App} from "vue";
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
  TimelineComponent,
  TitleComponent 
} from 'echarts/components';



import Chart from "@/components/chart/index.vue";

// Manually introduce ECharts modules to reduce packing size
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
  TimelineComponent,
  TitleComponent,
]);


/**
 * 全局注册自定义组件
 */
export function setupComponents(app: App) {
  // Arco Design, Detail Info:  https://arco.design/vue/docs/start
  app.use(ArcoVue);
  app.use(ArcoVueIcon);

  // registery custom component


  // 注册全局组件
  app.component(Chart.name, Chart);
}
