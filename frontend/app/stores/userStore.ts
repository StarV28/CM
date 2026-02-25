import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import type { User } from "../../types/user";
import type { UpdateUserResponse, DeleteUser } from "../../types/updateUser";

export const useUserStore = defineStore("userStore", () => {
  const api = useApi();
  const loading = ref(false);
  const error = ref<string | null>(null);

  //-------------------------------------------------------------------------------------//
  const updateUser = async (data: User) => {
    loading.value = true;
    try {
      const res = await api.post<UpdateUserResponse>(
        "/user/update",
        { data },
        false
      );

      if (res?.success === false) {
        return res;
      } else {
        const userCookie = useCookie<User | null>("user");
        userCookie.value = res?.user ?? null;

        return res;
      }
    } catch (err) {
      error.value = (err as Error)?.message;
      return null;
    } finally {
      loading.value = false;
    }
  };
  //-------------------------------------------------------------------------------------//
  const deleteUser = async (id: string) => {
    try {
      const res = await api.del<DeleteUser>(
        "/user/delete-user",
        { params: { id } },
        false
      );
      return res;
    } catch (err) {
      error.value = (err as Error)?.message;
      return null;
    }
  };
  //-------------------------------------------------------------------------------------//

  return {
    updateUser,
    deleteUser,
  };
});
