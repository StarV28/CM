<template>
  <div class="footer">
    <DonatButton class="footer__donate" />
    <div class="footer__menu menu">
      <div class="menu__logo">
        <NuxtImg
          class="footer__icon"
          src="/image/logo-CM.jpg"
          width="45"
          height="45"
          format=""
          alt="Logo"
        />
        <span>
          <h5>TradMon</h5>
          <p>cryptocurrency aggregator</p>
        </span>
      </div>
      <div class="menu__footer-box footer-box">
        <div class="footer-box__policy">
          <NuxtLink :to="localePath('disclaimer')">{{
            t("footer.disc")
          }}</NuxtLink>
          <NuxtLink :to="localePath('privacy')">{{
            t("footer.priv")
          }}</NuxtLink>
        </div>
        <div class="footer-box__email">
          <p>{{ t("footer.proposal") }}</p>
          <p>
            <a :href="`mailto:${email}`">E-mail: {{ email }}</a>
          </p>
        </div>
      </div>
    </div>
    <div class="footer__copyright">
      <span>
        <icons.copy width="18" height="18" />
        Copyright 2025 CM.
      </span>
      <span> Made by Starovoit Volodymyr </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { icons } from "@/utils/icon";
//-------------------------------------------------------------------------------------//
const email = ref("web.product.studio@gmail.com");
const nuxtApp = useNuxtApp();
const localePath = nuxtApp.$localePath;
const { t } = useI18n();
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  border-top: 1px solid var(--accent-color);
  // box-shadow: 0 -4px 8px -2px var(--accent-color);
  // border-radius: 6px;
}
.footer__donate {
  border-bottom: 1px solid var(--accent-color);
  padding-bottom: 15px;
}
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}
.menu__logo {
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    display: flex;
    flex-direction: column;
    gap: 5px;
    h5 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      font-family: "Montserrat", sans-serif;
      color: rgb(226, 176, 50);
      letter-spacing: 1px;
    }
    p {
      margin: 0;
      font-size: 12px;
      font-weight: 200;
      text-transform: capitalize;
    }
  }
}
.footer-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-box__policy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;

  a {
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-color);
    transition: color 0.3s ease;
    &:hover {
      transition: color 0.3s ease;
      color: blueviolet;
      text-decoration: underline;
    }
  }
}
.footer-box__email {
  max-width: 270px;
  text-align: end;

  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.3;
    margin: 0;
    a {
      color: var(--text-color);
      transition: color 0.3s ease;
      &:hover {
        transition: color 0.3s ease;
        color: blueviolet;
      }
    }
  }
}
.footer__icon {
  border-radius: 3px;
}
.footer__copyright {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--accent-color);

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 200;
    font-family: "Montserrat", sans-serif;
    text-transform: capitalize;
    color: var(--text-color);
    text-decoration: none;
  }
}

@media (max-width: 560px) {
  .footer {
    padding: 15px 5px;
    // box-shadow: 0 -4px 8px 0px var(--accent-color);
    // border-radius: 0px;
  }
  .menu {
    gap: 10px;
  }
  .menu__logo {
    flex-direction: column;
    align-items: start;
    gap: 7px;

    span {
      gap: 0px;
      h5 {
        font-size: 12px;
        font-weight: 500;
      }
      p {
        font-size: 8px;
        font-weight: 200;
      }
    }
  }
  .footer-box__policy {
    display: flex;
    flex-direction: column;
    gap: 7px;
    align-items: flex-end;

    a {
      font-size: 12px;
      font-weight: 400;
    }
  }
  .footer-box__email {
    p {
      font-size: 12px;
      font-weight: 400;
      line-height: 1.3;
      margin: 0;
      a {
        color: var(--text-color);
        &:hover {
          transition: color 0.3s ease;
          color: blueviolet;
        }
      }
    }
  }
  .footer__icon {
    border-radius: 3px;
  }
}
@media (max-width: 425px) {
  .footer__copyright {
    flex-direction: column;
    align-items: end;
    gap: 7px;
  }
}
</style>
