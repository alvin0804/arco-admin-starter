
<script lang="tsx">
import {compile, computed, defineComponent, h, ref } from "vue";
import {RouteLocationNormalized, RouteRecordRaw, useRoute, useRouter} from "vue-router";
import {listenerRouteChange} from "@/utils/route-listener";

const linkRegexUrl = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i'
);
type TargetContext = '_self' | '_parent' | '_blank' | '_top';
const openWindow = (
  url: string,
  opts?: { target?: TargetContext; [key: string]: any }
) => {
  const { target = '_blank', ...others } = opts || {};
  window.open(
    url,
    target,
    Object.entries(others)
      .reduce((preValue: string[], curValue) => {
        const [key, value] = curValue;
        return [...preValue, `${key}=${value}`];
      }, [])
      .join(',')
  );
};

export default defineComponent({
  name: "LayoutMenu",
  props: {
    collapsed: Boolean as PropType<boolean>,
    menus: Array
  },
  setup(props) {

    const currentRoute = useRoute();
    const router = useRouter();
    const selectedKeys = ref<string[]>([]);

    const collapsed = computed(() => props.collapsed);

    const menus = computed(() => generatorMenu(props.menus || []));

    listenerRouteChange((newRoute: RouteLocationNormalized) => {
      console.log("listen", newRoute.meta)
    })

    // 排除Router
    function filterRouter(routerMap: Array<any>) {
      return routerMap.filter((item) => {
        return (
          (item.meta?.hidden || false) != true &&
          !['/:path(.*)*'].includes(item.path)
        );
      }).filter(isHiddenMenu);
    }
    // 判断根路由Router
    function isRootRouter(item) {
      return item.meta?.alwaysShow != true && item.children?.length === 1;
    }
    function isHiddenMenu(item) {
      console.log("item.meta?.hiddenMenu: ", item.meta?.hiddenMenu);
      return !item.meta?.hiddenMenu
    }
    // 生成目录
    function generatorMenu(routerMap: Array<any>) {
      return filterRouter(routerMap).map((item) => {
        const isRoot = isRootRouter(item);
        const info = isRoot ? item.children[0] : item;
        const currentMenu = {
          ...info,
          ...info.meta,
          label: info.meta?.title,
          key: info.name,
          icon: isRoot ? item.meta?.icon : info.meta?.icon
        }
        // 如果有子菜单进行递归处理
        if(info.children && info.children.length > 0) {
          currentMenu.children = generatorMenu(info.children);
        }
        return currentMenu;
      })
    }


    function goto(item: RouteRecordRaw) {
      // 如果是外链，打开窗口跳转
      if(linkRegexUrl.test(item.path)) {
        openWindow(item.path);
        selectedKeys.value = [item.name as string];
      }
      if(currentRoute.name === item.name) {
        selectedKeys.value = [item.name as string];
        return;
      }
      console.log("当前菜单： ", item)
      router.push({name: item.name })
    }
    function renderSubMenu(): any {
      function travel(_route: any[], nodes = []) {
        if(_route) {
          _route.forEach((element) => {
            const icon = element.icon ? () => h(compile(`<${element.icon} :size="16" :style="{ color: '#fff' }" />`)) : null;
            const node = (element.children && element.children !== 0) ? (
                <a-sub-menu
                  key={element.key}
                  title={element.title}
                  v-slots={{
                    icon,
                    title: () => h(compile(element.title))
                  }}
                  class={"default-layout-sub-menu"}
                >
                  { travel(element.children) }
                </a-sub-menu>
              ) : (
                <a-menu-item
                  key={element.key}
                  v-slots={{
                    icon,
                  }}
                  class={"default-layout-menu"}
                  onClick={() => goto(element)}
                >
                  { element.title }
                </a-menu-item>)
            nodes.push(node as never);
          })
        }
        return nodes;
      }
      return travel(menus.value);
    }

    return () => (
      <a-menu v-model:collapsed={collapsed.value}>
        { renderSubMenu() }
      </a-menu>
    )
  }
})
</script>

