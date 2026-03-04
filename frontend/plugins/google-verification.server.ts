// plugins/google-verification.server.ts
import { defineNuxtPlugin } from "#app";
import type { MetaObject } from "@nuxt/schema";

export default defineNuxtPlugin((nuxtApp) => {
  const meta: MetaObject[] = [
    {
      name: "google-site-verification",
      content: "4dVMpIuGlpYBfh_P6sX50tz7yE5cCmD6y4AMQx6iWiE",
    },
  ];

  nuxtApp.hook("app:head:setup", (head) => {
    meta.forEach((m) => head.meta.push(m));
  });
});
