import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';

import { resolve } from 'path';
const currentEnv = process.env.currentEnv || "";

console.log("currentEnv ", currentEnv, getPrefixUrl(currentEnv));

function getPrefixUrl(currentEnv: string) {
   let url = "";
  switch (currentEnv) {
    case "dev":
      url = "http://dev-data.lbxcn.com";
      break;
    case "qa":
      url = 'http://qa-data.lbxcn.com';
      break;
    case "release":
      url = "http://release-data.lbxcn.com";
      break;
    case "prod":
      url = "http://data.lbxcn.com";
      break;
    //  native local develop
    default:
      url = "http://localhost:5173"
  }

  return url
}


const list: any[] = [
  // {
  //   path: '/api',
  //   target: 'http://localhost:8900',
  // }
  {
    path: '/api',
    target: "http://debug-data.lbxcn.com",
    // target: 'http://10.0.208.146:9700',
    // target: "http://dev-data.lbxcn.com"
  }
];

const proxyOption = {
  changeOrigin: true,
  debug: true,
};

function proxy() {
  const result = list
    .map((item) => ({
      [item.path]: {
        ...proxyOption,
        target: item.target,
        rewrite: (pathname: string) => {
          console.log('pathname: ', item.path, item.target + pathname.replace(item.path, '/api'));
          return pathname.replace(item.path, '/api');
        },
      },
    }))
    .reduce((previous, current) => ({ ...previous, ...current }), {});

  console.log(JSON.stringify(result, null, 2));

  return result;
};


function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  define: {
    'process.env': {
      prefixUrl: getPrefixUrl(currentEnv),
      currentEnv,
    },
  },
  resolve: {
    alias: [
      {
        find: /\/#\//,
        replacement: pathResolve('types') + '/',
      },
      {
        find: '@',
        replacement: pathResolve('src') + '/',
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
    ],
  },
  server: {
    // open: true,
    proxy: proxy(),
  },
})
