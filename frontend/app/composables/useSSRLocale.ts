type LocaleCode = "en" | "de" | "ua" | "tr" | "hi";

//---------------------------------------//
export const useSSRLocale = () => {
  const { locale, setLocale } = useI18n();
  const cookie = useCookie<LocaleCode>("lang");

  // sync cookie → i18n (если пользователь уже выбирал язык)
  if (cookie.value && cookie.value !== locale.value) {
    setLocale(cookie.value);
  }

  const setLang = (newLang: LocaleCode) => {
    cookie.value = newLang; // сохраняем выбор пользователя
    setLocale(newLang); // переключаем язык
  };

  return { locale, setLang };
};
