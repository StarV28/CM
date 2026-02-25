import { useSocketStore } from "@/stores/socketStore";

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return;
  const socketStore = useSocketStore();
  socketStore.connect();
});
