import { useEffect, useState } from "react";
import { setToLS, getFromLS } from "../storageUtils/storage";
import * as DefaultTheme from "./schema.json";

import { useSelector } from "react-redux";
import _ from "lodash";

export const themeMapper = (themeVariable) => {
  return {
    data: {
      light: {
        id: "themeLight",
        name: "Light",
        useBgImage: themeVariable?.useBgImg ? true : false,
        removeBgShadow: themeVariable?.removeBgShadow,
        BgImage:
          themeVariable?.bgImg ||
          "https://ferrum.network/wp-content/uploads/2021/05/FerrumNetwork__globe-1-min.png",
        colors: {
          themeColor: "#fff7e9",
          navbar: "transparent",
          mainHeaderColor: themeVariable?.headingColor || themeVariable?.themeDarker,
          topBannerTextColor: themeVariable?.topBannerTextColor,
          topBannerBgColor: themeVariable?.topBannerBgColor,
          topBannerIconColor: themeVariable?.topBannerIconColor,
          body: themeVariable?.neutralLight,
          headercolor: "rgba(39, 42, 51,0)",
          themePrimary: themeVariable?.themeDark,
          themeSecondary: themeVariable?.themeSecondary,
          borderColor: "#828282",
          // Alerts
          alertFailBgColor: themeVariable?.alertFailBgColor || "red",
          alertFailTextColor: themeVariable?.alertFailTextColor || "white",
          // Text
          textPri: "#ffffff",
          text: "#dbb46e",
          inverse: themeVariable.bodyTextColor || "#ffffff",
          inputTextColor: themeVariable.inputTextColor,
          textSec: "#afafaf",
          alertErrorBackgoundColor: themeVariable?.alertErrorBackgoundColor,
          alertErrorBodyTextColor:themeVariable?.alertErrorBodyTextColor,
          // Steps
          stepsTailBackgroundColor: themeVariable?.stepsTailBackgroundColor,
          stepsFinishBackgroundColor: themeVariable?.stepsFinishBgColor,
          stepsFinishBorderColor: themeVariable?.stepsFinishBorderColor,
          stepsWaitBackgroundColor: themeVariable?.stepsWaitBgColor,
          stepsWaitBorderColor: themeVariable?.stepsWaitBorderColor,
          stepsProcessBackgroundColor: themeVariable?.stepsProcessBgColor,
          stepsProcessBorderColor: themeVariable?.stepsProcessBorderColor,
          card: {
            cardPri: themeVariable?.cardPri || themeVariable?.cardBgColor || themeVariable?.neutralDark,
            cardTextPri: themeVariable?.cardTextPri || "#f3f3f3",
            cardSec: themeVariable?.cardSec || "#272a33",
            cardTextSec: themeVariable?.cardTextSec || "#f3f3f3",
            boxShadow:
              themeVariable?.cardBoxShadow || "#ffffff73 0px 0px 0px 0px",
            //todo: check for other uses of this or remove
            "box-shadow": themeVariable?.cardBoxShadow || "#ffffff73 0px 0px 0px 0px",
            cardBorderRadius: themeVariable?.cardBorderRadius,
          },

          button: {
            btnPri: themeVariable?.btnBgColor || themeVariable?.themePrimary,
            btnTextPriColor: themeVariable?.btnTextPriColor,
            btnTextSecColor: themeVariable?.btnTextSecColor,
            btnSec: "#e3e3e3",
            btnDull: "#ffffff",
            //todo: check for other uses or remove
            textPri: "#111111",
            textSec: "#333333",
            btnBorderRadius: themeVariable?.btnBorderRadius,
            backgroundSize: themeVariable?.btnBackgroundSize,
            btnActiveColor: themeVariable?.btnActiveColor,
            btnPadding: themeVariable?.btnPadding,
          },

          link: {
            text: "teal",
            opacity: 1,
          },
          input: {
            inputPri: "#f1f1f1",
            inputSec: "#6c757d",
          },
          dropdown: {
            bgColor: "#272a33",
          },
        },
        font: "Poppins, Sans-serif !important",
      },
      dark: {
        id: "themeDark",
        name: "Dark",
        useBgImage: themeVariable?.useBgImg ? true : false,
        BgImage:
          themeVariable?.bgImg ||
          "https://ferrum.network/wp-content/uploads/2021/05/FerrumNetwork__globe-1-min.png",
        colors: {
          body: themeVariable?.neutralDark,
          navbar: themeVariable?.themeTertiary,
          mainHeaderColor: themeVariable?.themeDarker,
          themeColor: "#dab46e",
          headercolor: "#272a33",
          themePrimary: themeVariable?.themePrimary,
          themeSecondary: themeVariable?.themeSecondary,
          textPri: "#ffffff",
          textSec: "#afafaf",
          text: "#ffffff",
          inverse: "#000000",
          borderColor: "#828282",
          card: {
            cardPri: themeVariable?.neutralLight,
            cardTextPri: "#f3f3f3",
            cardSec: "rgba(0,0,0,0.9)",
            cardTextSec: "#f3f3f3",
          },
          button: {
            btnPri: themeVariable?.themeDark,
            btnSec: "#e3e3e3",
            btnDull: "#ffffff",
            textPri: "#333333",
            textSec: "#777777",
            borderRadius: "0",
          },
          link: {
            text: "#ffffff",
            opacity: 1,
          },
          input: {
            inputPri: "#ffffff",
            inputSec: "#ffffff",
          },
          dropdown: {
            bgColor: "#272a33",
          },
        },
        font: "Roboto,sans-serif !important",
      },
    },
  };
};

export const useTheme = (group) => {
  const [themeLoaded, setThemeLoaded] = useState(false);
  let groupInfoData = useSelector((appS) => appS.data.state.groupInfo);
  let themes = groupInfoData.groupId
    ? themeMapper(groupInfoData.themeVariables)
    : getFromLS("all-themes");
  const [theme, setTheme] = useState(
    themes ? themes.data.light : DefaultTheme.data.light
  );

  const setMode = (mode, group) => {
    setToLS(group ? `${group}-theme` : "theme", mode);
    setTheme(mode);
  };

  const loadTheme = () => {
    themes = themeMapper(groupInfoData.themeVariables);
    setTheme(themes ? themes.data.light : DefaultTheme.data.light);
    setThemeLoaded(true);
    return themes.data.light;
  };

  const getFonts = () => {
    const allFonts = _.values(_.mapValues(themes.data, "font"));
    return allFonts;
  };

  useEffect(() => {
    setTheme(themes ? themes.data.light : DefaultTheme.data.light);
    setThemeLoaded(true);
    // eslint-disable-next-line
  }, [group]);

  return { theme, themeLoaded, setTheme, setMode, getFonts, loadTheme };
};
