import { defineStore } from "pinia";
import { store } from "@/store";
import _ from "lodash";
import config from "@/config/website.config";
import { getUserInfoService } from '@/api/auth';

export interface IUserState {
  isLogin: boolean;
  userInfo: Object
}

export const useUserStore = defineStore({
  id: "app-user",
  state: (): IUserState => ({
    userInfo: {},
    isLogin: false,
  }),
  actions: {
    // 获取用户信息
    async getUserInfo() {

      const res =  await getUserInfoService({ systemCode: config.systemCode, userId: '00129702' });
      this.userInfo = res.data;
      return res.data;
    },

  },
});

export function useUserStoreWiidthOut() {
  return useUserStore(store);
}
