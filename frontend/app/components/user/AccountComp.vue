<template>
  <LoadingComp v-if="authStore.loading" />
  <div v-else class="page-user">
    <div class="page-user__btn-back">
      <NuxtLink :to="localePath('/')">{{ t("menu.main") }}</NuxtLink>
      <span>-></span>
      <span>{{ t("user.account") }}</span>
    </div>
    <div class="page-user__data data">
      <div class="data__block-user">
        <h1 class="data__title">{{ t("user.account") }}</h1>
        <div class="data__user-data">
          <span>{{ t("user.name") }}:</span>
          <h3>{{ user?.name }}</h3>
        </div>
        <div class="data__user-data">
          <span>{{ t("user.email") }}:</span>
          <h3>{{ user?.email }}</h3>
        </div>
      </div>
      <div v-if="favCoins.length" class="data__fav-coin fav-coin">
        <h2 class="fav-coin__h2">{{ t("user.choice") }}</h2>
        <div v-for="fav in favCoins" :key="fav.id" class="fav-coin__list">
          <div class="fav-coin__box">
            <div class="fav-coin__title">
              <span>{{ t("user.coin") }}</span>
              <h3>{{ fav.symbol }}</h3>
            </div>
            <div class="fav-coin__date">
              <span>{{ t("user.date") }}</span>
              <p v-if="fav?.createdAt">
                {{ fav.createdAt.slice(0, 19).replace("T", " ") }}
              </p>
            </div>
          </div>
          <button
            class="fav-coin__delete"
            @click="deleteCoin(fav.coinId, fav.userId)"
          >
            {{ t("user.del-coin") }}
          </button>
        </div>
      </div>
    </div>
    <div class="page-user__btn-box">
      <button type="button" class="btn" @click="logOut">
        {{ t("user.logout") }}
      </button>
      <button v-show="user" type="button" class="btn" @click="updateUser">
        {{ t("user.update") }}
      </button>
      <button class="btn btn__del" @click="deleteUser">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useFavoriteStore } from "@/stores/favoriteStore";
import type { User } from "../../../types/user";

//-------------------------------------------------------------------------------------//
const authStore = useAuthStore();
const userStore = useUserStore();
const favoriteStore = useFavoriteStore();
const router = useRouter();
const localePath = useLocalePath();
const { t } = useI18n();
const user = ref<User | null>(null);
const favCoins = computed(() => favoriteStore.favoriteArr ?? []);

// user.value = await useCookie<User | null>("user").value;

//---------------------------------------//
await useAsyncData("favorites", () => favoriteStore.getListFavorite());

//-------------------------------------------------------------------------------------//
function deleteCoin(coinId: number, userId: number) {
  favoriteStore.deleteCoin(coinId, userId);
}
//-------------------------------------------------------------------------------------//
function updateUser() {
  authStore.changeUserComp = false;
}

async function deleteUser() {
  const id = user.value?.id;
  if (!id) return;
  const res = await userStore.deleteUser(id);

  if (!res?.success) {
    alert(res?.message);
    return;
  } else {
    alert(res.message);
    authStore.logout();
    router.push(localePath("/"));
  }
}
//-------------------------------------------------------------------------------------//

const logOut = () => {
  authStore.logout();
  router.push(localePath("/"));
};
//-------------------------------------------------------------------------------------//
onMounted(async () => {
  const tokenCookie = useCookie("token");
  if (tokenCookie) {
    const userData = useCookie<User | null>("user").value;
    if (!userData) return;
    user.value = userData;
    // await favoriteStore.getListFavorite();
  }
});
</script>

<style lang="scss" scoped>
h1,
h2,
h3,
h5,
span,
p {
  margin: 0;
}
.page-user {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  align-items: start;
  justify-content: center;
  gap: 25px;
}
.page-user__btn-back {
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;

  a {
    font-size: 18px;
    text-decoration: none;
    font-weight: 500;
    color: var(--fan-color);
    &:hover {
      text-decoration: underline;
    }
  }
  span {
    font-size: 14px;
    color: var(--text-color);
    font-weight: 200;
  }
}
.page-user__data {
  flex: 1;
  margin-top: 15px;
}
.data {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));
  grid-template-rows: auto;
  gap: 15px;

  &__title {
    font-size: 31px;
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    line-height: 1.1;
    color: var(--fan-color);
    margin-bottom: 15px;
  }

  &__block-user {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
  }
  &__user-data {
    display: flex;
    align-items: center;
    gap: 15px;
    span {
      font-size: 21px;
      font-weight: 500;
      line-height: 1.3;
      color: var(--fan-color);
    }
    h3 {
      font-family: "Montserrat", sans-serif;
      font-weight: 200;
      font-size: 18px;
    }
  }
  &__fav-coin {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 15px;
  }
}
.fav-coin__h2 {
  font-size: 31px;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  line-height: 1.1;
  color: var(--fan-color);
  margin-bottom: 15px;
}
.fav-coin__list {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--accent-color);
}
.fav-coin__title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;

  span {
    font-size: 21px;
    font-weight: 500;
    line-height: 1.3;
    color: var(--fan-color);
  }
  h3 {
    font-family: "Montserrat", sans-serif;
    font-weight: 200;
    font-size: 18px;
    text-transform: capitalize;
  }
}
.fav-coin__box {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
}
.fav-coin__date {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;

  span,
  p {
    font-size: 12px;
    font-weight: 200;
    line-height: 1.3;
    // color: blueviolet;
  }
}
.fav-coin__delete {
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  background-color: rgb(201, 105, 105);
  color: #fff;
  font-size: 12px;
  font-weight: 200;
  line-height: 1.4;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transition: all 0.3s ease;
    box-shadow: 2px 2px 5px var(--text-color);
  }
}
.page-user__btn-box {
  margin: 25px 0;
  display: flex;
  align-items: center;
  gap: 25px;
}
.btn {
  padding: 5px 15px;
  border-radius: 6px;
  border: none;
  text-align: center;
  background-color: green;
  color: #ffff;
  font-size: 14px;
  font-weight: 400;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transition: all 0.3s ease;
    box-shadow: 2px 2px 5px var(--text-color);
  }
}
.btn__del {
  &:hover {
    background-color: red;
  }
}
@media (max-width: 768px) {
  .data {
    gap: 25px;
  }
  .data__title {
    font-size: 21px;
    font-weight: 400;
    margin-bottom: 0px;
  }
  .data__user-data {
    gap: 7px;
    span {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.3;
    }
    h3 {
      font-size: 16px;
    }
  }
  .fav-coin__h2 {
    font-size: 21px;
    font-weight: 500;
    margin: 0;
  }
  .fav-coin__title {
    gap: 15px;

    span {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.3;
    }
    h3 {
      font-size: 16px;
    }
  }
  .btn {
    font-size: 12px;
  }
}
@media (max-width: 545px) {
  .data {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    grid-template-rows: auto;
    gap: 35px;
  }
  .fav-coin__delete {
    padding: 5px 5px;
    font-size: 10px;
  }
  .data__user-data {
    flex-direction: column;
    align-items: start;
    h3 {
      font-size: 14px;
    }
  }
}
</style>
