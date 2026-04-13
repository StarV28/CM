<template>
  <div v-if="news" class="news-box">
    <h3 class="title">{{ t("news.title") }}</h3>
    <div class="news">
      <div v-for="(item, ind) in news" :key="ind" class="news__item item">
        <div class="item__image">
          <img
            :src="getSafeImage(item.image)"
            alt="Image News"
            @error="onImageError($event)"
          />
        </div>
        <div class="item__title">
          <a :href="item.url" target="_blank" rel="noopener noreferrer">{{
            item.title
          }}</a>
        </div>
        <div class="item__date">
          <span>{{ item.publishedAt }}</span>
        </div>
        <div class="item__link">
          <a :href="item.url" target="_blank" rel="noopener noreferrer">{{
            item.source
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from "@/stores/newsStore";
import { useSSRLocale } from "@/composables/useSSRLocale";
//-------------------------------------------------------------------------------------//

interface NewsItem {
  title: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
}

//-------------------------------------------------------------------------------------//
const newsStore = useNewsStore();
const news = computed<NewsItem[]>(() => newsStore.news);
const { t } = useI18n();
const isClient = ref<boolean>(false);
// const loading = computed(() => newsStore.loading);
const { locale } = useSSRLocale();
//-------------------------------------------------------------------------------------//
const getSafeImage = (url?: string) => {
  if (!url || url.trim() === "") return "/image/news-image.webp";
  if (!isClient.value) return url;
  const uniqueParam = `nocache=${Date.now()}`;
  return `${url}${url.includes("?") ? "&" : "?"}${uniqueParam}`;
};

//-------------------------------------------------------------------------------------//
const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (!target.src.includes("/image/news-image.webp")) {
    requestAnimationFrame(() => {
      target.src = "/image/news-image.webp";
    });
  }
};
//-------------------------------------------------------------------------------------//
watch(
  locale,
  (newLocale, oldLocale) => {
    if (newLocale && newLocale !== oldLocale) {
      newsStore.getNews(newLocale);
    }
  },
  { immediate: true },
);

//-------------------------------------------------------------------------------------//

onMounted(() => {
  newsStore.startAutoUpdate(locale.value);
  isClient.value = true;
});
onBeforeUnmount(() => {
  newsStore.stopAutoUpdate();
});
</script>

<style scoped>
.title {
  font-size: 21px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  line-height: 1.4;
  display: inline-block;
  margin-bottom: 20px;
  width: 100%;
  border-bottom: 1px solid var(--accent-color);
}
.news {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-template-rows: auto;
  gap: 25px;
  margin-bottom: 20px;
}
.item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 15px;
  flex: 1 0 auto;
}
.item__image {
  position: relative;
  width: 100%;
  padding-bottom: 170px;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.item__title {
  flex: 1;
  a {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    font-weight: 100;
    line-height: 1.1;
    text-decoration: none;
    color: var(--text-color);
    transition: color 0.3s ease;
    &:hover {
      transition: color 0.3s ease;
      color: rgb(193, 16, 16);
    }
  }
}
.item__date {
  span {
    font-size: 12px;
    font-weight: 100;
    line-height: 1.4;
  }
}
.item__link {
  a {
    font-size: 14px;
    font-family: "Inter", sans-serif;
    font-weight: 100;
    color: var(--text-color);
    transition: color 0.3s ease;
    &:hover {
      transition: color 0.3s ease;
      color: rgb(193, 16, 16);
    }
  }
}
@media (max-width: 769px) {
  /* .news {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
  } */
  .item {
    gap: 7px;
  }
  .item__image {
    padding-bottom: 130px;
  }
  .item__title {
    a {
      font-family: "Inter", sans-serif;
      font-size: 18px;
      font-weight: 500;
    }
  }
}
@media (max-width: 520px) {
  .item__title {
    a {
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
