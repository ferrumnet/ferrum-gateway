import { useEffect, useState } from "react";
import { setToLS, getFromLS } from "../storageUtils/storage";
import _ from "lodash";

export const themeMapper = (themeVariable) => {
  return {
    "data": {
      "light": {
        "id": "themeLight",
        "name": "Light",
        "useBgImage": themeVariable?.useBgImg ? true : false,
        "BgImage": themeVariable?.bgImg || "https://ferrum.network/wp-content/uploads/2021/05/FerrumNetwork__globe-1-min.png",
        "colors": {
          "themeColor": "#fff7e9",
          "navbar": "transparent",
          "mainHeaderColor": themeVariable?.headingColor || themeVariable?.themeDarker,
          "body": themeVariable?.neutralLight,
          "headercolor": "rgba(39, 42, 51,0)",
          "themePrimary": themeVariable?.themeDark,
          "themeSecondary": themeVariable?.themeSecondary,
          "textPri": "#ffffff",
          "text": "#dbb46e",
          "inverse":  themeVariable.bodyTextColor || "#ffffff",
          "textSec": "#afafaf",
          "stepsWaitBackgroundColor": themeVariable?.stepsWaitBgColor,
          "stepsWaitBorderColor": themeVariable?.stepsWaitColor,
          "stepsFinishBackgroundColor": themeVariable?.stepsBgColor,
          "stepsFinishBorderColor": themeVariable?.stepsBorderColor,
          "card": {
            "cardPri": themeVariable?.cardBgColor || themeVariable?.neutralDark,
            "cardTextPri": "#f3f3f3",
            "cardSec": themeVariable?.cardSec || "#272a33",
            "cardTextSec": "#ffffff",
            "borderRadius": themeVariable?.cardBorderRadius || "0",
            "boxShadow": themeVariable?.cardBoxShadow || "0px -1px 4px 0px",
            //todo: check for other uses of this or remove
            "box-shadow": themeVariable?.cardBoxShadow || "0px -1px 4px 0px"
          },
          "borderColor": "#828282",
          "button": {
            "btnPri": themeVariable?.btnBgColor || themeVariable?.themePrimary,
            "btnTextPriColor": themeVariable?.btnTextPriColor,
            "btnTextSecColor": themeVariable?.btnTextSecColor,
            "btnSec": "#e3e3e3",
            "btnDull": "#ffffff",
            //todo: check for other uses or remove
            "textPri": "#111111",
            "textSec": "#333333",
            "borderRadius": themeVariable?.btnBorderRadius || '0',
            "backgroundSize": themeVariable?.btnBackgroundSize,
            "btnActiveColor": themeVariable?.btnActiveColor,
            "btnPadding": themeVariable?.btnPadding,
          },
         
          "link": {
            "text": "teal",
            "opacity": 1
          },
          "input": {
            "inputPri": "#f1f1f1",
            "inputSec": "#6c757d"
          },
          "dropdown": {
            "bgColor": "#272a33"
          }
        },
        "font": 'Poppins, Sans-serif !important'
      },
      "dark": {
        "id": "themeDark",
        "name": "Dark",
        "useBgImage": themeVariable?.useBgImg ? true : false,
        "BgImage": themeVariable?.bgImg || "https://ferrum.network/wp-content/uploads/2021/05/FerrumNetwork__globe-1-min.png",
        "colors": {
          "body":themeVariable?.neutralDark,
          "navbar": themeVariable?.themeTertiary,
          "mainHeaderColor": themeVariable?.themeDarker,
          "themeColor": "#dab46e",
          "headercolor": "#272a33",
          "themePrimary": themeVariable?.themePrimary,
          "themeSecondary": themeVariable?.themeSecondary,
          "textPri": "#ffffff",
          "textSec": "#afafaf",
          "text": "#ffffff",
          "inverse":  "#000000",
          "borderColor": "#828282",
          "card": {
            "cardPri": themeVariable?.neutralLight,
            "cardTextPri": "#f3f3f3",
            "cardSec": "rgba(0,0,0,0.9)",
            "cardTextSec": "#f3f3f3"
          },
          "button": {
            "btnPri": themeVariable?.themeDark,
            "btnSec": "#e3e3e3",
            "btnDull": "#ffffff",
            "textPri": "#333333",
            "textSec": "#777777",
            "borderRadius": "0"
          },
          "link": {
            "text": "#ffffff",
            "opacity": 1
          },
          "input": {
            "inputPri": "#ffffff",
            "inputSec": "#ffffff"
          },
          "dropdown": {
            "bgColor": "#272a33"
          }
        },
        "font": 'Roboto,sans-serif !important'
      }
    }
  }  
}

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
