import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composables/useApi";
import type {
  FavoriteCoin,
  FavoriteCoinRes,
  Favorite,
} from "../../types/favorite";

//-------------------------------------------------------------------------------------//
const error = ref<string | null>(null);

//-------------------------------------------------------------------------------------//

export const useFavoriteStore = defineStore("favoriteStore", () => {
  const api = useApi();
  const showInform = ref<boolean>(false);
  const clickFavoriteEl = ref<HTMLElement | null>(null);
  const favoriteArr = ref<Favorite[]>([]);
  const favoriteCookie = useCookie<Favorite[]>("favorite");
  const info = ref<{ show: boolean; text: string }>({ show: false, text: "" });
  //-------------------------------------------------------------------------------------//
  favoriteArr.value = Array.isArray(favoriteCookie.value)
    ? favoriteCookie.value
    : [];

  watch(
    () => favoriteArr.value,
    (val) => {
      favoriteCookie.value = val;
    },
    { deep: true },
  );
  //-------------------------------------------------------------------------------------//
  function openInform() {
    showInform.value = true;
  }
  function closeInform() {
    showInform.value = false;
  }

  //-------------------------------------------------------------------------------------//
  const addFavoriteCoinUser = async (data: FavoriteCoin) => {
    try {
      const index =
        favoriteArr.value?.findIndex((f) => f.coinId === data.coinId) ?? -1;

      if (index > -1) {
        const coinId = data.coinId;
        const userId = data.userId;

        const res = await deleteCoin(coinId, userId);
        return res;
      } else if ((favoriteArr.value?.length ?? 0) >= 5) {
        return "You can max 5 coins add ";
      } else {
        const res = await api.post<FavoriteCoinRes>(
          "/favorite",
          { data },
          false,
        );
        if (res?.success && res.data) {
          favoriteArr.value = res.data.map((f) => ({
            coinId: f.coinId,
            userId: f.userId,
            symbol: f.symbol,
            id: f.id,
            createdAt: f.createdAt ?? "",
          }));
        }

        return res?.message;
      }
    } catch (err) {
      error.value = (err as Error)?.message;
      return [];
    }
  };
  //---------------------------------------//

  async function deleteCoin(coinId: number, userId: number) {
    try {
      const res = await api.del<FavoriteCoinRes>(
        "/favorite/delete",
        { params: { coinId, userId } },
        false,
      );

      if (res?.success) {
        favoriteArr.value = favoriteArr.value!.filter(
          (f) => f.coinId !== coinId,
        );
      }
      return res?.message;
    } catch (err) {
      error.value = (err as Error)?.message;
      return [];
    }
  }
  //---------------------------------------//
  async function getListFavorite() {
    try {
      const res = await api.get<{ result: Favorite[] }>(
        "/favorite/list",
        { query: {} },
        false,
      );
      favoriteArr.value = (res?.result ?? []).map((f) => ({
        coinId: f.coinId,
        userId: f.userId,
        symbol: f.symbol,
        id: f.id,
        createdAt: f.createdAt ?? "",
      }));
    } catch (err) {
      error.value = (err as Error)?.message;
      return [];
    }
  }

  return {
    addFavoriteCoinUser,
    openInform,
    showInform,
    closeInform,
    clickFavoriteEl,
    favoriteArr,
    info,
    deleteCoin,
    getListFavorite,
  };
});
