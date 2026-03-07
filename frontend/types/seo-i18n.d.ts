import "#app";

declare module "#app" {
  interface NuxtApp {
    $seoHead: () => void;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $seoHead: () => void;
  }
}
