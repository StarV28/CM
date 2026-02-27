type LocaleCode = "en" | "de" | "ua" | "tr" | "hi";

// export const useSSRLocale = () => {
//   const locale = useState<LocaleCode>("lang", () => {
//     // Если cookie уже есть — берём её
//     const cookieVal = useCookie<LocaleCode>("lang").value;
//     return cookieVal || "en"; // иначе дефолт
//   });

//   const cookie = useCookie<LocaleCode>("lang");
//   const { setLocale } = useI18n();

//   // Сразу применяем текущий язык
//   setLocale(locale.value);

//   // Слежка за изменением
//   watch(locale, (newLocale) => {
//     // Ставим cookie сразу при выборе через кнопку
//     cookie.value = newLocale;
//     setLocale(newLocale);
//   });

//   const setLang = (newLang: LocaleCode) => {
//     locale.value = newLang; // это вызовет watch и обновит cookie + i18n
//   };

//   return { locale, setLang };
// };

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
