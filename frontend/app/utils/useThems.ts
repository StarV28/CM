export const useTheme = () => {
  const theme = useState<"light" | "dark">("theme", () => "light");

  const setTheme = (value: "light" | "dark") => {
    theme.value = value;
    document.documentElement.classList.toggle("dark", value === "dark");
    localStorage.setItem("theme", value);
  };

  const toggleTheme = () => setTheme(theme.value === "dark" ? "light" : "dark");

  return { theme, toggleTheme, setTheme };
};
