import _ from "lodash";


interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);


function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] {
  config = getConfig(config);
  const children = config.children as string;

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }

  return listFilter(tree);
}



export const permissionsListGenerator = (remoteMenus: any[]) => {
  const keys: string[] = [];

  function listFilter(routerMap: any[]) {
    routerMap.forEach((item) => {
      keys.push(item.url);

      if(item.childMenu && item.childMenu.length > 0) {
        listFilter(item.childMenu)
      }
    })
  }

  listFilter(remoteMenus);
  return keys;
}

export const remoteMenusGenerator = (remoteMenus: any[]): any[] => {

  const result: any[] = [];
  function travse(routerMap: any[]): void {
    routerMap.forEach((item) => {
      result.push(item.url);

      if(item.childMenu && item.childMenu.length > 0) {
        travse(item.childMenu)
      }
    })
  }

  travse(remoteMenus);
  return result;
}

export const routerGenerator = (routerMap: any[], parent?): any[] => {
  return routerMap.map((item => {

    // 全路径地址
    const fullpath = `${(parent && parent.path) || ''}/${item.path}`.replace('//', '/')
    const currentRouter: any = {
      path: item.path,
      name: item.name,
      component: item.component,
      meta: {
        ...item.meta,
        fullpath,
        keys: [fullpath]
      }
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect);

    // 递归后置
    if(item.children && item.children.length > 0) {
      //如果未定义 redirect 默认第一个子路由为 redirect
      !item.redirect && (currentRouter.redirect = `${item.path}/${item.children[0].path}`);
      // 递归
      currentRouter.children = routerGenerator(item.children, currentRouter);

      // 循环追加子组件 keys
      const childrenKeys = _.uniq(_.flattenDeep(currentRouter.children.map(({ meta: { keys = [] }}) => keys)));
      currentRouter.meta.keys.push(...childrenKeys);
    }

    return currentRouter
  }))
}


/**
 * 生成动态路由
 */
export async function generatorDynamicRouter(dynamicMenus: any[], asyncRoutes) {
  
  const remoteMenus = remoteMenusGenerator(dynamicMenus);
  const router = routerGenerator(asyncRoutes, remoteMenus);

  const routeFilter = (route) => {
    const { meta } = route;
    const { fullpath } = meta || {};
    return remoteMenus.includes(fullpath)
  };

  return filter(router, routeFilter);
}
