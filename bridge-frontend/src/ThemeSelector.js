import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useTheme,theme } from "./theme/useTheme";
import { getFromLS } from "./storageUtils/storage";
// import { Form } from "react-bootstrap";
import { CgSun } from "react-icons/cg";
import { HiMoon } from "react-icons/hi";


// eslint-disable-next-line
export default (props) => {
  const themesFromStore = getFromLS("all-themes");
  const [data, setData] = useState(themesFromStore.data);
  const [themes, setThemes] = useState([]);
  const { setMode } = useTheme(props.group);
  const Icon = !props.isLight ? <HiMoon color={'black'} size={20} /> : <CgSun size={20} color={'#dab46e'} />;

  const themeSwitcher = (selectedTheme) => {
    setMode(selectedTheme,props.group);
    props.setter(selectedTheme);
  };

  useEffect(() => {
    setThemes(_.keys(data));
    //eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    props.newTheme && updateThemeCard(props.newTheme);
    //eslint-disable-next-line
  }, [props.newTheme]);

  const updateThemeCard = (theme) => {
    const key = _.keys(theme)[0];
    const updated = { ...data, [key]: theme[key] };
    setData(updated);
  };

  const ThemeCard = (props) => {    
    return (
      <>
        {/* <strong className="text-sec">Select Theme:</strong> */}
        {
          props.theme.name === 'Light' && <HiMoon 
            size={20}
            className="btn btn-theme"
            onClick={(theme) => { themeSwitcher(props.theme);}}
           
          >
            {/* {props.theme.name} */}
          </HiMoon>
        }
        {
          props.theme.name !== 'Light' && <CgSun 
            size={20}
            color={'black'}
            onClick={(theme) => { themeSwitcher(props.theme);}}
          >
            {/* {props.theme.name} */}
          </CgSun>
        }
      </>
    );
  };

  const handleSwitch = (theme) => {
    props.setIsLight(!props.isLight);
    setTimeout(()=>{
      setMode(props.isLight ? theme['light'] : theme['dark'],props.group);
      props.setter(props.isLight ? theme['light'] : theme['dark']);
    }
    ,500)
  }

  return (
    <div className="d-flex align-items-center">
        <div onClick={()=>handleSwitch(data)}>
          {Icon}
        </div>
    </div>
  );
};
