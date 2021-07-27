import { useEffect, useState } from "react";
import { setToLS, getFromLS } from "../storageUtils/storage";
import _ from "lodash";

export const useTheme = (group) => {
  let themes = getFromLS("all-themes");

  if(group?.data){
    themes = getFromLS(`${group}-all-themes`);
    setToLS(`all-themes`, themes);
  }

  const [theme, setTheme] = useState(themes.data.light);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const setMode = (mode,group) => {
    setToLS(group ? `${group}-theme` :"theme", mode);
    setTheme(mode);
  };

  const getFonts = () => {
    const allFonts = _.values(_.mapValues(themes.data, "font"));
    return allFonts;
  };

  useEffect(() => {
    const localTheme = getFromLS(group ? `${group}-theme` :"theme");
    setTheme(localTheme);
    setThemeLoaded(true);
    // eslint-disable-next-line
  }, []);

  return { theme, themeLoaded,setTheme, setMode, getFonts };
};
