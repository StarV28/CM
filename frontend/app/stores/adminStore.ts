import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import type {
  CreatePostAnalytic,
  CreatePostAnalyticResponse,
} from "../../types/adminAnalytics";
//---------------------------------------//

//---------------------------------------//

export const useAdminStore = defineStore("adminStore", () => {
  const api = useApi();

  //---------------------------------------//
  const createPostAnal = async (data: CreatePostAnalytic) => {
    const url = "/admin/analytics";

    const res = await api.post<CreatePostAnalyticResponse>(url, data);
    return res;
  };

  return { createPostAnal };
});
