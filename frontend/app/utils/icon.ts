import SettSun from "@/assets/icons/setting-sun.svg";
import Sett2 from "@/assets/icons/settings-round.svg";
import Copy from "@/assets/icons/copyright.svg";
import login from "@/assets/icons/login.svg";

export const icons = {
  setSun: SettSun,
  set2: Sett2,
  copy: Copy,
  login: login,
};
export type IconName = keyof typeof icons;
